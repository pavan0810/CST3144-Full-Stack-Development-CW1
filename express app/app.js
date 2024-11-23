var http = require('http');
var express = require('express');
var cors = require('cors');
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