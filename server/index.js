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
    app.get('/products', async (req, res) => {
        try {
          const limit = parseInt(req.query.limit) || 10;
          const offset = parseInt(req.query.offset) || 0;
          const brand = req.query.brand;
  const category = req.query.category;
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
  let query = {};

  if (brand) {
    query.brand = brand;
  }

  if (category) {
    query.category = category;
  }

  query.price = { $gte: minPrice, $lte: maxPrice };

          
          const totalProducts = await productsCollection.countDocuments();
          const products = await productsCollection.find()
            .skip(offset)
            .limit(limit)
            .toArray();
      
          res.send({
            totalProducts,
            products,
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