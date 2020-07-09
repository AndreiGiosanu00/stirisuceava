const express = require("express");
const router = express.Router();

const fs = require('fs');
const jwt = require('jsonwebtoken');

const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");
const scraper = require("./scraper");
const authGuard = require("./authGuard");

router.get("/api", function(req, res) {
  res.redirect("/api/articles");
});

router.post("/api/login", function (req, res) {
  console.log('I am here! ' + req.body['user']);
  if (req.body['user'] === 'admin' && req.body.password === 'StiriSuceavaPass1!') {
    let privateKey = fs.readFileSync('./config/private.pem', 'utf8');
    let token = jwt.sign({"body": "authentication"}, privateKey, {algorithm: "HS256"});
    res.json({'token': token});
  } else {
    res.status(500).json({'error': 'Invalid credentials!'});
  }
});

router.post("/api/scrape", authGuard.isAuthorized, function(req, res) {
  scraper.getStiriSuceavaNetNews();
  scraper.getNewsBucovinaNews();
  scraper.getMonitorulSuceavaNews();
  res.json({'response': 'Stiri Suceava start scraping!'});
});

router.get("/api/articles", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.json(doc);
    }
  });
});

router.post("/api/delete-article", authGuard.isAuthorized, function(req, res) {
  Article.deleteOne({_id: req.body.id}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/api/articles");
    }
  });
});

router.post("/api/delete-all", authGuard.isAuthorized, function (req, res) {
  Article.remove({}, function(err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.json({'response': 'All articles have been deleted!'});
    }
  });
});

router.get("/api/article", function (req, res) {
  Article.findOne({_id: req.query.id}, function (err, doc) {
    if (err) {
      res.send(err);
    } else {
      res.json({"article": doc});
    }
  })
});

router.post("/api/comment/:id", authGuard.isAuthorized, function(req, res) {
  const user = req.body.name;
  const content = req.body.comment;
  const articleId = req.params.id;

  const commentObj = {
    name: user,
    body: content
  };

  const newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articleId);

      Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comment: doc._id } },
        { new: true }
      ).exec(function(err, doc) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.redirect("/api/readArticle/" + articleId);
        }
      });
    }
  });
});

module.exports = router;
