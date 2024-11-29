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

var app = express();
app.use(cors());
app.use(express.json());

app.use(function(request, response, next){
    console.log("Request URL: " + request.url);
    console.log("Request Time: " + new Date());
    next();
});

app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    next();
});

app.get("/getCourses/:collectionName/:query", async (req, res) => {
    const query = JSON.parse(decodeURIComponent(req.params.query));
    var courses = await dbSearch(query, req.collection);
    res.json(courses);
});

app.post("/placeOrder", async (req, res) => {
    var order = req.body;
    var collection = db.collection("OrderInfo");
    const result = await collection.insertOne(order);
    console.log(result);
    res.json({message: "Order placed successfully!"});
});

app.put("/updateDocument/:collectionName/:id", async (req, res) => {
    var lessonId = parseInt(req.params.id);
    var fieldToUpdate = req.body;
    const result = await req.collection.updateOne(
        {id : lessonId},
        {$set : fieldToUpdate}
    );
    res.json("Lesson updated");
});

app.get("/search/:collectionName/:searchString", async (req, res) => {
    const courses = await req.collection.aggregate([
        {
          $search: {
            index: 'SearchCourse',
            text: {
              query: req.params.searchString,
              path: ['subject', 'location'],
            },
          },
        },
    ]).toArray();
    res.json(courses);
});

var server = http.createServer(app);
server.listen(3000, () => {
    console.log("Server listening on Port 3000");
});

async function dbSearch(query, collection) {
    const results = await collection.find(query).toArray();
    for(let i=0;i < results.length;i++) {
        results[i]._id = results[i]._id.toString();
    }
    return results;
}