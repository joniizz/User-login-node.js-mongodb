const express = require("express");
const cors = require("cors");
const db = require("./app/models");


const app = express();

db.mongoose
  .connect("mongodb://localhost:27017/login_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


var corsOptions = {
    origin: "http://localhost:8081",
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

//parser requests of content-type
app.use(express.json());
app.use(express.urlencoded({entended: true}));

app.get("/", (req, res) => {
    res.json({message: "Welcome to my application!"});
});

app.listen("8080", () => {
    console.log("Server is running on port 8080");
});
