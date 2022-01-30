const express = require("express");
const { MongoClient } = require("mongodb");
const objectID = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfpfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("CarPackage");
    const carCollection = database.collection("cars");
    const orderCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // get cars api
    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // post cars

    app.post("/cars", async (req, res) => {
      const cars = req.body;
      const result = await carCollection.insertOne(cars);
      res.json(result);
    });

    // post reviews api

    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      console.log("hit the post api ", reviews);
      const result = await reviewsCollection.insertOne(reviews);
      console.log(result);
      res.json(result);
    });

    // get reviews api

    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // get single service
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: objectID(id) };
      const cars = await carCollection.findOne(query);
      res.json(cars);
    });
    // get single service
    app.get("/dashboard/manageproducts/update/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: objectID(id) };
      const cars = await carCollection.findOne(query);
      res.json(cars);
    });

    // update product
    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;
      const filter = { _id: objectID(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateProduct.name,
          details: updateProduct.details,
          img: updateProduct.img,
          price: updateProduct.price,
          catagory: updateProduct.catagory,
        },
      };
      const result = await carCollection.updateOne(filter, updateDoc, option);
      console.log("updating ", req);
      res.json(result);
    });

    // order single
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      // console.log("id", id);
      const query = { _id: objectID(id) };
      const cars = await orderCollection.findOne(query);
      res.json(cars);
    });

    // get orders api
    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // get order by email
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });

    // get order by CarName
    app.get("/review", async (req, res) => {
      const CarName = req.query.CarName;
      const query = { CarName: CarName };
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // delect orders api

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectID(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // delect car api

    app.delete("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectID(id) };
      const result = await carCollection.deleteOne(query);
      res.json(result);
    });

    // add orders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      // console.log("hit the order pst", order);
      const result = await orderCollection.insertOne(order);
      // console.log(result);
      res.json(result);
    });

    // add  users
    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log("hit the order pst", users);
      const result = await usersCollection.insertOne(user);
      // console.log(result);
      res.json(result);
    });

    //  update admin role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }

      res.json({ admin: isAdmin });
    });
    // get users information api

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // add admin

    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      // console.log("put", user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Asons limited is running");
});

app.listen(port, () => {
  console.log("server running at port", port);
});
