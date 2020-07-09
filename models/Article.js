var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  imgSrc: {
    type: String
  },
  source: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});
var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
