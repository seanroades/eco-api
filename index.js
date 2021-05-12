const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const multer = require('multer');
const upload = multer({dest: "uploads/"});

require('dotenv').config()

app.use(express.json())

app.listen(
  PORT,
  () => console.log(`Hello again PORT ${PORT}`)
);

app.get('/', (req, res) => {
  res.status(200).send({
    recommendations: {
      1: {
        itemName: 'grey hoodie',
        store: 'Depop',
        price: '$300',
        image: 'image'
      },
      2: {
        itemName: 'grey hoodie',
        store: 'Re-inc',
        price: '$300',
        image: 'image'
      }
    }
  })
});

app.post('/find/:id', (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  if (!item) {
    res.status(418).send({ message: "Must include image" });
  }

  const MongoClient = require('mongodb').MongoClient;
  const uri = `mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASS}@eco.fytit.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  console.log(uri)
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect( async (err) => {
    const collection = client.db(process.env.DB).collection(process.env.COLLECTION);
    await collection.insertOne({ 
      id: id,
      item: item
    })
    // perform actions on the collection object
    client.close();
  });
  
  res.status(200).send({
    message: 'Sent item to server',
    item: `item here: ${item}`,
    recommendations: {
      1: {
        itemName: 'grey hoodie',
        store: 'Depop',
        price: '$300',
        image: 'image'
      },
      2: {
        itemName: 'grey hoodie',
        store: 'Re-inc',
        price: '$300',
        image: 'image'
      },
      3: {
        itemName: 'grey hoodie',
        store: 'Re-inc',
        price: '$300',
        image: 'image'
      }
    }
  })
})

app.post("/recs", upload.single('itemImage'), (req, res) => {
  console.log(req.file)
})
