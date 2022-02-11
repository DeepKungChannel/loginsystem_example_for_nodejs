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
router.get('/', function (req, res, next) {
    if (req.session.loggedin == true) {
        res.render('add', {
            title: "Add Form",
            name: req.session.username
        });
    }else {
        res.redirect('/login');
    }
});

router.post('/', function (req, res, next) {
    if (req.session.loggedin == true) {
        let Date = req.body.Date;
        let disel = req.body.Disel;
        let e20 = req.body.E20;
        let g91 = req.body.G91;
        let g95 = req.body.G95;
        // Date = Date.replace('-','/');
        // Date = Date.replace('-','/');
        console.log(Date)
        let day = Date.substring(8, 10);
        let month = Date.substring(5, 7);
        if (month[0] == 0) {
            month = month.replace('0', '')
        }
        let year = Date.substr(0, 4);
        let Datem = String(day + '/' + month + '/' + year);
        console.log(Datem);
        connection.query('SELECT * FROM oil WHERE Date = ?', [Datem], function (error, results) {
            if (error) {
                console.log('Error : ' + error);
            }
            if (results.length > 0) {
                res.render('add', {
                    messages: 'This date has been use',
                    name: req.session.username,
                    title: 'Add Form'
                })
            } else {
                connection.query("INSERT INTO oil VALUES (?,?,?,?,?)", [Datem, disel, e20, g91, g95], function (error) {
                    if (error) {
                        console.log('Error : ' + error);
                    } else {
                        res.render('add', {
                            messages: 'Succes to add data',
                            name: req.session.username,
                            title: 'Add Form'
                        });
                    }
                });
            }
        });
    }else {
        res.redirect('/login');
    }
});
module.exports = router;