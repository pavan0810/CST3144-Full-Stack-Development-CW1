var http = require('http');
var express = require('express');
var cors = require('cors');
var propertiesReader = require('properties-reader');
var path = require('path')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

var propertiesPath = path.resolve(__dirname, "conf/db.properties")
var properties = propertiesReader(propertiesPath);

var dbPrefix = properties.get("db.prefix");
var dbUsername = encodeURIComponent(properties.get("db.user"));
var dbPwd = encodeURIComponent(properties.get("db.pwd"));
var dbName = properties.get("db.dbName");
var dbUrl = properties.get("db.dbUrl");
var dbParams = properties.get("db.params");
const uri = dbPrefix + dbUsername + ":" + dbPwd + dbUrl + dbParams;
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
var db = client.db(dbName);

var cart = []
var courses = [
    {
        id: 1,
        subject:"Mathematics",
        location:"Curepipe",
        price: 700,
        image: "../images/maths_class.jpg",
        spaces: 10
    },
    {
        id: 2,
        subject:"Physics",
        location:"Rose Hill",
        price: 1500,
        image: "../images/physics_class.jpg",
        spaces: 3
    },
    {
        id: 3,
        subject:"English",
        location:"Rose Belle",
        price: 450,
        image: "../images/english_class.jpg",
        spaces: 7
    }
]

var app = express();
app.use(cors());
app.use(express.json());

app.use(function(request, response, next){
    console.log("Request URL: " + request.url);
    console.log("Request Time: " + new Date());
    next();
});

app.get("/getCourses", (req, res) => {
    res.send(courses);
});

app.post("/addCourseToCart", (req, res) => {
    cart.push(req.body);
    console.log(cart);
    res.json("Course added to cart successfully!");
});

// app.put();
var server = http.createServer(app);
server.listen(3000, () => {
    console.log("Server listening on Port 3000");
});