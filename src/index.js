const express = require('express')
const cors = require('cors')
const router = require('./routes/web')
const Connection = require('./database/Connection')
const app = express()
const port = 3001


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(router);


new Connection()

app.get('/',(req,res)=>{
    res.send('hello')
    console.log('hello');
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})