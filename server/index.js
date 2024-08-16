const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
// const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
// const jwt = require('jsonwebtoken')

const port = process.env.PORT || 8000


// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
// app.use(cookieParser())

// Verify Token Middleware
// const verifyToken = async (req, res, next) => {
//   const token = req.cookies?.token
//   console.log(token)
//   if (!token) {
//     return res.status(401).send({ message: 'unauthorized access' })
//   }
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       console.log(err)
//       return res.status(401).send({ message: 'unauthorized access' })
//     }
//     req.user = decoded
//     next()
//   })
// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aakl4py.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {

    const productsCollection = client.db('gizmogate').collection('products');


    // get all products
    // server.js (or app.js)

app.get('/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.brand) {
    query.brand = req.query.brand;
  }

  if (req.query.minPrice && req.query.maxPrice) {
    query.price = {
      $gte: parseFloat(req.query.minPrice),
      $lte: parseFloat(req.query.maxPrice),
    };
  }

  if (req.query.search) {
    query.name = {
      $regex: new RegExp(req.query.search, 'i'), // Case-insensitive search
    };
  }

  try {
    const products = await productsCollection.find(query).skip(skip).limit(limit).toArray();
    const totalProducts = await productsCollection.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.send({
      products,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error fetching products' });
  }
});

    
    
    
      
   

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from Server..')
})

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})