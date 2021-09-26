const express  = require('express')
const app =  express();
require('dotenv/config')
const api = process.env.API_URL
app.get(api+'/products', (req, res) => {
    res.send('hello API !')
})
app.listen(3000, () => {
    console.log('App running on port 3000')
    console.log(api)

})