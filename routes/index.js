var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var emailValidation = require('email-address');


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    if (!emailValidation.isValid(req.body.username)){
      console.log("invalid email")
      return res.render("register", {info: "Please enter a valid email address"});
    }
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          console.log(err)
          return res.render("register", {info: "Sorry. An account with that email already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.post('/add-hashtag', function(req, res) {
    if(req.user){
      req.user.tags.push(req.body.tag)
      req.user.save(function (err) {
            if (err)
            {
                // TODO: Handle the error!
            }
            console.log(req.user.tags)
            res.redirect('/');
        });
    }
    else{
      console.log("Not Logged In")
      res.redirect('/login');
    }
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
