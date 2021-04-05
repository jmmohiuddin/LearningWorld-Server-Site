const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5055;
app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyhh2.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("connection err", err);
  const eventCollection = client.db("Learning-World").collection("books");
  app.get("/events", (req, res) => {
    eventCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  const ordersCollection = client.db("Learning-World").collection("books");
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    ordersCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    eventCollection.insertOne(newEvent).then((result) => {
      res.send(result.insertedCount);
    });
  });
  app.delete("/deleteEvent/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    eventCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(!!documents.value));
  });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
