const express = require('express'); 
const hbs = require('hbs'); 
const wax = require('wax-on');

/* 1. SETUP EXPRESS */
let app = express();

// 1B. SETUP VIEW ENGINE
app.set('view engine', 'hbs'); 

// 1C. SETUP STATIC FOLDER
app.use(express.static('public'));

// 1D. SETUP WAX ON (FOR TEMPLATE INHERITANCE)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// 2. ROUTES
app.get('/', (req,res)=>{
    res.render('index')
})

// 3. RUN SERVER
app.listen(3000, ()=>console.log("Server started"))
