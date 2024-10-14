const express = require('express')
const cors = require('cors')
const router = require('./routes/web')
const Connection = require('./database/Connection')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const app = express()
const port = 3001


app.use(express.json());
app.use(cookieParser())
app.use(cors({
  credentials:true,
    origin: [
    'http://localhost:3000', // for local development
    'https://guitar-shop-frontend-brown.vercel.app' //frontend URL
  ]
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(router);


new Connection()

app.get('/',(req,res)=>{
    res.send('hello to guitarShop Backend')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app
