require('dotenv').config();
const express = require("express");
const port = 3001;
const app = express();
const axios = require("axios");
const unqid = require("unqid");
const sha256 = require("sha256");
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require("cors");
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');



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
const connection = mysql.createConnection({
  host:process.env.RDS_ENDPOINT , 
  port: 3306,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: "shareef"
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



connection.connect((err) => {
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
    const [rows,fields] = await connection.promise().query(`SELECT * FROM users WHERE email = '${username}'`);
   // console.log(result[0].email +"   "+result[0][1].password);
    console.log(rows);
    if(rows.length>0 && rows[0].password===password){
     // res.status(200).json({ message: "Signin successful...." });
     console.log(rows);
     res.status(200).json({ message: 'Profile updated successfully', redirectUrl: 'https://trip-application.onrender.com/home' });
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
    const [rows, fields] = await connection.promise().query(
      `INSERT INTO users (firstname, lastname, email, password, mobile) VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, password, mobile]
    );

    // Check if the query executed successfully
    if (rows.affectedRows > 0) {
      console.log("Registration successful");
      res.redirect("https://trip-application.onrender.com/signin")
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
app.get("/pay", (req, res) => {
  const endpoint = "/pg/v1/pay";
  const {flightname,from,to,travelDate,returnDate,numTickets,cost,tripType} = req.query
  console.log(req.body+" 12345"+flightname);
  const payload = {
    merchantId: merchent_id,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: 123,
    amount: parseInt(cost)*100,
    redirectUrl: `https://trip-application-server.onrender.com/redirect-url/${merchantTransactionId}?flightname=${flightname}&from=${from}&to=${to}&travelDate=${travelDate}&returnDate=${returnDate}&numTickets=${numTickets}&cost=${cost}&tripType=${tripType}`,
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
app.get("/redirect-url/:merchantTransactionId", async (req, res) => {
  const { merchantTransactionId } = req.params;
  const { flightname, from, to, travelDate, returnDate, numTickets, cost, tripType } = req.query;

  // Split the 'from' string into destination and number of tickets
  const [fromDestination, fromNumTickets] = from.split(',');
  const xverify = sha256(`/pg/v1/status/${merchent_id}/${merchantTransactionId}` + salt_key) + "###" + salt_index;
  console.log(merchantTransactionId + " 12345 " + travelDate + " 123 " + fromNumTickets+"   "+from);
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
      const userEmail = req.cookies.email;
      console.log(userEmail);
      if (response.data.code === 'PAYMENT_SUCCESS') {
        const [userResult] = await connection.promise().query(
          'SELECT * FROM users WHERE email = ?',
          [userEmail]
        );

        // Check if the email exists in the users table
        if (userResult.length > 0) {
          // Email exists, proceed with inserting into tripdetails table
          const [result] = await connection.promise().query(
            `INSERT INTO tripdetails (flightname, from_location, to_location, traveldate, returndate, numtickets, cost, triptype, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [flightname, from, to, travelDate, returnDate, numTickets, cost, tripType, userEmail]
          );
          console.log('Data inserted into tripdetails table.');
          res.redirect("https://trip-application.onrender.com/home")
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
      const userEmail = req.cookies.email;


      const userData = await connection.promise().query('select * from tripdetails where email=?',[userEmail]);
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
    const userEmail = req.cookies.email;
    const cookiename = req.query.cookiename;
    const flightname = req.query.flightname;
    console.log(userEmail);

    if (cookiename) {
      const [result] = await connection.promise().query('delete from tripdetails where email=? and 	flightname=?',[cookiename,flightname]);
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


app.get('/personal', async (req, res) => {
  try {
    const email = req.cookies.email;
    if (!email) {
      return res.status(403).send('Unauthorized access');
    }

    // Fetch personal data from MySQL
    connection.query('SELECT firstname, lastname, email, mobile FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Error fetching personal data from MySQL:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
        return res.status(404).send('Data not found');
      }

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
    const { email, firstname, lastname, mobile } = req.body;
    if (!email) {
      return res.status(403).send('Unauthorized access');
    }

    // Fetch personal data from MySQL
    connection.query('update users set firstname=?,lastname=?,mobile=? WHERE email = ?', [firstname,lastname,mobile,email], (err, results) => {
      if (err) {
        console.error('Error fetching personal data from MySQL:', err);
        return res.status(500).send('Internal server error');
      }

      if (results.length === 0) {
        return res.status(404).send('Data not found');
      }

      // Send personal data as JSON response
      res.status(200).json({ message: 'Profile updated successfully', redirectUrl: 'https://trip-application.onrender.com/home' });
    });
  } catch (err) {
    console.error('Error handling request:', err);
    res.status(500).send('Internal server error');
  }
});



app.listen(3001, (err) => {
  console.log("the server is started listening....");

});
 