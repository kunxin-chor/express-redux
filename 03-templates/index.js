const express = require('express'); 
const hbs = require('hbs'); // <-- NOTE 1

/* 1. SETUP EXPRESS */
let app = express();

// 1B. SETUP VIEW ENGINE
app.set('view engine', 'hbs'); // <-- NOTE 2

// 1C. SETUP STATIC FOLDER
app.use(express.static('public'));

// 2. ROUTES
app.get('/', (req,res)=>{
    res.render('index')
})

// 3. RUN SERVER
app.listen(3000, ()=>console.log("Server started"))
