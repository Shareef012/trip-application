require('dotenv').config();
const express = require("express");
const port = 3001;
const app = express();
const axios = require("axios");
const unqid = require("unqid");
const sha256 = require("sha256");
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const Cookies = require('js-cookie');



app.use(cookieParser());


const corsOptions = {
  origin: 'https://trip-application.onrender.com',
  methods: ['GET', 'POST','DELETE'] // Allow credentials (cookies) to be sent cross-origin
};


app.use(cors(corsOptions));



const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false
}));
// Database connection
console.log(process.env.RDS_ENDPOINT);
const connection = mysql.createPool({
  host:process.env.RDS_ENDPOINT , 
  port: 3306,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: "shareef"
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



connection.getConnection((err) => {
  if (err) {
    console.log("connection error....", err);
  } else {
    console.log("database connection successful.....");
  }
});

const phonepe_host = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const merchent_id = "PGTESTPAYUAT";
const salt_index = 1;
const salt_key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";


app.get("/", (req, res) => {
  res.send("PhonePe Working.....");
});

app.post("/Signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username+" "+password +"  "+req.body )
    const [rows,fields] = await connection.query(`SELECT * FROM users WHERE email = '${username}'`);
   // console.log(result[0].email +"   "+result[0][1].password);
    console.log(rows);
    if(rows.length>0 && rows[0].password===password){
     // res.status(200).json({ message: "Signin successful...." });
     console.log(rows);
      Cookies.set("email",username);
     res.status(200).json({ message: 'Signin successfully', redirectUrl: 'https://trip-application.onrender.com/home' });
    }
    else{
      res.send("check email and password....")

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to Sign in" });
  }
});



app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile } = req.body;
    console.log(req.body+"   112345  "+firstName);
    const [rows, fields] = await connection.query(
      `INSERT INTO users (firstname, lastname, email, password, mobile) VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, password, mobile]
    );

    // Check if the query executed successfully
    if (rows.affectedRows > 0) {
      console.log("Registration successful");
      res.status(200).json({ message: 'Registeration successfully', redirectUrl: 'https://trip-application.onrender.com/home' });
    } else {
      console.log("Failed to register");
      res.status(500).json({ message: "Failed to register" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register" });
  }
});


const merchantTransactionId = unqid();
console.log(merchantTransactionId);
console.log(merchantTransactionId);
app.post("/pay", (req, res) => {
  const endpoint = "/pg/v1/pay";
  const {flightname,from_location,to_location,travelDate,returnDate,numTickets,cost,tripType,email} = req.query
  console.log(req.body+" 12345"+flightname);
  const payload = {
    merchantId: merchent_id,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 123,
    amount: parseInt(cost)*100,
    redirectUrl: `https://trip-application-server.onrender.com/redirect-url/${merchantTransactionId}?flightname=${flightname}&from_location=${from_location}&to_location=${to_location}&travelDate=${travelDate}&returnDate=${returnDate}&numTickets=${numTickets}&cost=${cost}&tripType=${tripType}&email=${email}`,
    redirectMode: "REDIRECT",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const burrObj = Buffer.from(JSON.stringify(payload), "utf8");
  const baseEncoded64 = burrObj.toString("base64");
  const xverify =
    sha256(baseEncoded64 + endpoint + salt_key) + "###" + salt_index;

  const options = {
    method: "post",
    url: `${phonepe_host}${endpoint}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": xverify,
    },
    data: {
      request: baseEncoded64,
    },
  };
  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
      const url = response.data.data.instrumentResponse.redirectInfo.url;
      res.redirect(url);
      //res.send(response.data)
    })
    .catch(function (error) {
      console.error(error);
    });
});
app.post("/redirect-url/:merchantTransactionId", async (req, res) => {
  const { merchantTransactionId } = req.params;
  const { flightname, from_location, to_location, travelDate, returnDate, numTickets, cost, tripType,email } = req.query;

  // Split the 'from' string into destination and number of tickets
  const [fromDestination, fromNumTickets] = from.split(',');
  const xverify = sha256(`/pg/v1/status/${merchent_id}/${merchantTransactionId}` + salt_key) + "###" + salt_index;
  console.log(merchantTransactionId + " 12345 " + travelDate + " 123 " + fromNumTickets+"   "+from_location);
  if (merchantTransactionId) {
    try {
      const options = {
        method: "get",
        url: `${phonepe_host}/pg/v1/status/${merchent_id}/${merchantTransactionId}`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-MERCHANT-ID": merchantTransactionId,
          "X-VERIFY": xverify
        },
      };
      const response = await axios.request(options);
      console.log(response.data);
      const userEmail =email;
      console.log(userEmail);
      if (response.data.code === 'PAYMENT_SUCCESS') {
        const [userResult] = await connection.promise().query(
          'SELECT * FROM users WHERE email = ?',
          [userEmail]
        );

        // Check if the email exists in the users table
        if (userResult.length > 0) {
          // Email exists, proceed with inserting into tripdetails table
          const [result] = await connection.query(
            `INSERT INTO tripdetails (flightname, from_location, to_location, traveldate, returndate, numtickets, cost, triptype, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [flightname, from_location, to_location, travelDate, returnDate, numTickets, cost, tripType, userEmail]
          );
          console.log('Data inserted into tripdetails table.');
          res.status(200).json({ message: 'Payment Done successfully', redirectUrl: 'https://trip-application.onrender.com/home' });
        } else {
          // Email does not exist in the users table
          console.log('Email does not exist in the users table. Data not inserted into tripdetails table.');
        }
      } else if (response.data.code === "PAYMENT_FAILURE") {
        // Handle payment failure
      } else {
        // Handle other cases
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.send("Error: Merchant transaction ID is missing.");
  }
});


app.get('/data' ,async (req,res)=>{
  try{
      const {email} = req.query;


      const userData = await connection.query('select * from tripdetails where email=?',[email]);
      if(userData.length===0){
        return res.status(404).json({error:"user data not found...."});
      }
      const user = userData[0];
      res.json([user]);
  }
  catch(err){
    console.log(err+"   data fetch errot....");
  }
})


app.post('/datadelete', async (req, res) => {
  try {
    
    const cookiename = req.query.cookiename;
    const flightname = req.query.flightname;
    

    if (cookiename) {
      const [result] = await connection.query('delete from tripdetails where email=? and 	flightname=?',[cookiename,flightname]);
        console.log(cookiename + " cookie has been deleted!");


      if (result.affectedRows > 0) {
        res.json({ status: 'success' });
      } else {
        res.status(404).send("Data not found");
      }
    } else {
      res.status(403).send("Unauthorized access");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});


app.post('/personal', async (req, res) => {
  try {
   // const {email} = req.body;
   const { email } = req.query;
    const userEmail = "sks@gmail.com";

    console.log(email+" this is the cookie......")

    // Fetch personal data from MySQL
    connection.query('SELECT firstname, lastname, email, mobile FROM users WHERE email = ?', [userEmail], (err, results) => {
      if (err) {
        console.error('Error fetching personal data from MySQL:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
        return res.status(404).send('Data not found');
      }
      console.log(results);

      // Send personal data as JSON response
      res.json(results);
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
  }
});


app.post('/update-profile', async (req, res) => {
  try {
    const { firstname, lastname, mobile, email } = req.query;
    if (!email) {
      return res.status(403).send('Unauthorized access');
    }
    console.log(firstname+"  "+lastname+"  "+mobile+"   "+email);
    // Fetch personal data from MySQL
    const [results] = await connection.query('update users set firstname=?,lastname=?,mobile=? where email=?',[firstname,lastname,mobile,email])
    if (results.affectedRows > 0) {
      res.json({ status: 'success',redirectUrl: 'https://trip-application.onrender.com/home' });
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
  }
});


app.post('/payment', async (req, res) => {
  try {
      const { flightname, from_location, to_location, travelDate, returnDate, numTickets, cost, tripType, email } = req.query;
      console.log(flightname+"   "+from_location+"    "+to_location+"   "+returnDate+"   "+travelDate+"  "+ numTickets+"   "+cost+"   "+tripType+" "+"  "+email);

      // Check if the email exists in the users table
      const [userResult] = await connection.query(
          'SELECT * FROM users WHERE email = ?',
          [email]
      );

      if (userResult.length === 0) {
          return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Email exists, proceed with inserting into tripdetails table
      const [result] = await connection.query(
          `INSERT INTO tripdetails (flightname, from_location, to_location, traveldate, returndate, numtickets, cost, triptype, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [flightname, from_location, to_location, travelDate, returnDate, numTickets, cost, tripType, email]
      );

      console.log('Data inserted into tripdetails table.');
      return res.status(200).json({ message: 'Payment successful', redirectUrl: 'https://trip-application.onrender.com/home' });
  } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: 'Internal Server Error' });
  } 
});


app.post('/profile-data', async (req, res) => {
  try {
    const { email } = req.query;
    console.log("This is the profile updataion cookie.... " + email);
    const userData = await connection.query(`SELECT firstname, lastname, mobile, email FROM users WHERE email=?`, [email]);
    if (userData.length > 0) {
      const data = userData[0];
      console.log("The data retrieved from the API call is:\n" );
      res.json([data]);
    } else {
      res.status(404).send({ message: 'No Data Found' });
    }
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});
app.listen(3001, (err) => {
  console.log("the server is started listening....");

});
 