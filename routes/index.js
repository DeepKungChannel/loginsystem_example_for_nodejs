var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyparser = require('body-parser')
var path = require("path");
const { response } = require('../app');
var connection = mysql.createConnection({
  host:'----------------------------------',
  user: '----------------------------------',
  password: '----------------------------------',
  database:'----------------------------------'
});
// var connection2 = mysql.createConnection({
//   host : 'eu-cdbr-west-03.cleardb.net',
//   port : 3306,
//   user: 'ba0571b0b1c4a1',
//   password: '609531d0',
//   database: 'heroku_cc914cb7bdd2de0'
// })

var bcrypt = require("bcryptjs");

router.use(bodyparser.urlencoded({ extended : true }));
router.use(bodyparser.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.loggedin == true) {
    // res.send("Welcome back "+ req.session.username + "!")
    // console.log(res.cookie)
    // console.log(req.session);
    // console.log(req.sessionID);
    // console.log(req.cookies);
    connection.query("SELECT * FROM oil ", function(error,results){
      if (error) {
        console.log("Error : "+error)
      }else {
      // console.log(results);
      res.render('index', { 
        title: 'Home', 
        name: req.session.username, 
        oil: results
      });
    }
    })
  } else {
    res.redirect('/login')
  }
});

router.get('/login', function(req,res,next){
  if (req.session.loggedin == true){
    res.redirect('/');
  }else {
    res.render('login')
  }
});

router.post('/auth', function(req,res,next){
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    connection.query('SELECT * FROM accounts WHERE username = ? OR email = ?', [username,username],  async function(error, results, fields){
      if(results.length > 0 && await bcrypt.compare(password, results[0].password ) ) {
        // console.log("Password correct : "+ await bcrypt.compare(password, results[0].password ))
        // console.log(results[0].password);
        req.session.loggedin = true;
        req.session.username = results[0].username;
        
        res.redirect('/');
      } else {
        res.render('login',{message : "Username and/or Password is incorrect",user:username})
      }
      
      res.end();
    });
  }else {
    res.send("Please enter Username and Password");
    es.end();
  }
});

router.get('/logout', function(req,res,next){
  req.session.destroy();
  req.session = null;
  res.redirect('/login')
});

router.get('/register', function(req,res,next) {
  res.render('register', {title: 'Register'})
});

router.post('/auth/register', async function(req,res,next) {
  username_regis = req.body.username;
  password_regis = req.body.password;
  password_comfirm_regis = req.body.passwordconfirm;
  email_regis = req.body.email;
  // console.log(password_regis)
  // console.log(password_comfirm_regis)
  connection.query("SELECT email FROM accounts WHERE email = ?", [email_regis], function(error, results, fields) {
    if(error) {
      console.log(error)
    };

    if (results.length > 0) {
      res.render('register', {message : "This email is already in use" , email: email_regis,user:username_regis})
    }else {
      connection.query("SELECT username FROM accounts WHERE username = ?", [username_regis], async function(error,results, fields){
        if(error) {
          console.log(error)
        }
        if (results.length > 0) {
          res.render('register', {message : "This username already in use", email: email_regis,user:username_regis});
        }
        else if(String(password_regis) !== String(password_comfirm_regis)) {
          
          res.render('register', {message : "Password do not match", email: email_regis,user:username_regis});
        }else {
          const hashedPassword = await bcrypt.hash(password_regis, 8);
          // console.log(hashedPassword);
          connection.query("INSERT INTO accounts SET ?", {username:username_regis,password:hashedPassword,email:email_regis}, async function(error,results) {
            if (error) {
              console.log(error)
            } else {
              req.session.loggedin = true;
              req.session.username = username_regis;
              res.redirect("/")
        }
          })
        } 
      });
    }

  });
  
  

});
module.exports = router;
