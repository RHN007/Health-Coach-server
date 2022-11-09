const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 9000;
require('dotenv').config()

app.use(cors());
app.use(express.json())


app.get('/', (req, res)=> {
    res.send('Health Coach server is running')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})