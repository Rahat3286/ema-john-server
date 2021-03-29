const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.79vii.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()


app.use(bodyParser.json());
app.use(cors());


const port = 5000;

app.get('/', (req, res) =>{
    res.send("hello from db it's working");
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(products);
        productsCollection.insertOne(products)
            .then(result => {
                // console.log(result);
                console.log(result.insertedCount)
                res.send(result.insertedCount)
            })
    })

    app.get('/products', (req, res)=>{
        productsCollection.find({})  //.limit(20)
        .toArray((err,documents) => {
            res.send(documents);
        })
    })

    app.get('/products/:key', (req, res) => {
        productsCollection.find({ key: req.params.key})  //.limit(20)
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys',(req, res) => {
        const productKeys = req.body;
        productsCollection.find({ key: {$in:productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    // console.log('database connected');
    // client.close();
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                // console.log(result);
                // console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

});


// console.log(process.env.DB_USER)

// app.get('/', (req, res) => {
//     res.send('Hello ema watson!')
// })

app.listen(process.env.PORT || port)