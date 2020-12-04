const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register =require('./controllers/register');
const login =require('./controllers/login');
const image =require('./controllers/image');

const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password :'parol6',
    database : 'smart_brain'
  }
});
// db.select('*').from("users").then(data=>{
//   console.log(data);
// });
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/signin', (req, res) => {login.handleLogin(req,res,db,bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req,res,db,bcrypt)});
app.put('/image', (req,res)=>{image.handleImage(req, res, db)})
app.post('/imageUrl', (req,res)=>{image.handleAPIinput(req, res)})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
});



const port=3000;
app.listen(port, ()=> {
  console.log('app is running on port: '+port);
})
