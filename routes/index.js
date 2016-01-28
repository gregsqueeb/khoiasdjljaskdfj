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

router.get('/delete-tag', function(req, res) {
    if(req.user){
      console.log(req.query)
      console.log(req.user.tags)
      req.user.tags.splice(req.query.tag, 1);
      req.user.save(function (err) {
        if (err)
        {
            return res.render("/", {info: "Sorry. There was an error deleting your tag. Try Again."});
        }
        res.redirect('/');
      });
    }
    else{
      res.redirect('/login');
    }
});

router.post('/register', function(req, res) {
    if (!emailValidation.isValid(req.body.username)){
      return res.render("register", {info: "Please enter a valid email address"});
    }
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
      if (err) {
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
            return res.render("/", {info: "Sorry. There was an error adding your tag. Try Again."});
        }
        res.redirect('/');
      });
    }
    else{
      res.redirect('/login');
    }
});

router.post('/add-iginfo', function(req, res) {
    if(req.user){
      if(req.body.igusername){
        req.user.igusername = req.body.igusername;
      }
      if(req.body.igpassword){
        req.user.igpassword = req.body.igpassword;
      }
      req.user.save(function (err) {
        if (err)
        {
            return res.render("/", {info: "Sorry. There was an error changing/adding your Instagram login details. Try Again."});
        }
        res.redirect('/');
      });
    }
    else{
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
