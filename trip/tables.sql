CREATE TABLE users (
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL
);


CREATE TABLE tripdetails (
    flightname VARCHAR(100),
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    traveldate VARCHAR(20),
    returndate VARCHAR(20),
    numtickets VARCHAR(10),
    cost VARCHAR(20),
    triptype VARCHAR(20),
    email VARCHAR(255),
    FOREIGN KEY (email) REFERENCES users(email)
);

