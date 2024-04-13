CREATE TABLE users (
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL
);
insert into users values ("shareef","sk","sks@gmail.com","123","7416262354");

CREATE TABLE tripdetails (
    flightname VARCHAR(255) NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    traveldate DATE NOT NULL,
    returndate DATE,
    numtickets INT NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    triptype VARCHAR(20) NOT NULL,
    email VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (email) REFERENCES users(email)
);