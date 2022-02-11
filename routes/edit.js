var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host:'----------------------------------',
  user: '----------------------------------',
  password: '----------------------------------',
  database:'----------------------------------'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM oil', function(error,results){
    if(error){
      console.log(error);
    }
    if(results.length > 0) {
      res.render('edit', {
        name : req.session.username,
        oil : results
      })
    }
  });
});

router.get('/:day/:month/:year', function(req,res,next){
  let day = req.params.day;
  let month = req.params.month;
  let year = req.params.year;
  let id = (day + '/' + month + '/' + year);
  console.log(id);
  connection.query('SELECT * FROM oil WHERE Date = ?',[id],function(error,results){
    if (error) {
      console.log(error);
    }
    if (results.length > 0) {
      console.log(results);
      res.render('editform',{
        oil : results
      })
    }
  });
  // res.redirect('/edit');
});

router.post('/', function(req,res,next){
  let { date , disel , e20 ,g91 , g95} = req.body
  connection.query('UPDATE oil SET ? WHERE Date = ?',[{Date:date,Disel:disel,'Bensin Gasohol E20':e20,'Gasohol 91':g91,'Gasohol 95':g95},date],function(error,results){
    if(error){
      console.log(error);
      res.send('Error system report')
    }else {
      res.redirect('/edit');
    }
  })
});

module.exports = router;
