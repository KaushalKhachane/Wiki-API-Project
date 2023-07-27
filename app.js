import bodyParser from 'body-parser'
import express from "express"
import ejs from "ejs"
import mongoose from 'mongoose'

const app = express()
const port = 3000

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static("public"))


if(mongoose.connect("mongodb://127.0.0.1:27017/Pedia", {useNewUrlParser: true})){
  console.log("Connected With MongoDB!!!")
}

const articleSchema = new mongoose.Schema({
    title: String,
    content: String 
  })
  
const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get(async (req, res) => {
    try{
      const blog = await Article.find({});
      res.send(blog);
    }catch{
      res.status(500).send("Error fetching articles: " + error.message);
    }
})
.post(function(req,res){
  // console.log(req.body.title)
  // console.log(req.body.content)
  try{
    const blog = new Article({
      "title": req.body.title,
      "content": req.body.connect
    })
  
    blog.save();
    res.send("Article Has been Saved to the database");
  }catch{
    res.status(500).send("Error Happened");
  }
})
.delete(async(req,res)=>{
  try{
    await Article.deleteMany({});
    res.send("Successfully deleted all articles.");

  }catch{
    res.status(500).send("Error Happened");
  }
});

app.route("/articles/:articleTitle")
.get(async (req,res)=>{
  const article = await Article.findOne({title: req.params.articleTitle});
  res.send(article);
})

.put(async function(req, res){
  const articleTitle = req.params.articleTitle;
  const updateArticle = {
    title: req.body.title,
    content: req.body.content
  };

  const result = await Article.updateOne({title: articleTitle},
    {$set: updateArticle});

    if(result.modifiedCount == 1){
      res.send("Article Replaced");
    }else{
      res.send("No matching article found for update.");
    }
})

.patch( async (req,res)=>{
  const articleTitle = req.params.articleTitle;
  console.log(articleTitle)
  console.log(req.body)
  const result = await Article.updateOne(
    {title: articleTitle},
    {$set: req.body});

    if(result.modifiedCount == 1){
      res.send("Article Replaced");
    }else{
      res.send("No matching article found for update.");
    }

})

.delete( async (req,res)=>{
  const result = await Article.deleteOne({title: req.params.articleTitle})
  if(result.deletedCount == 1){
    res.send("Specified Article deleted!")
  }else{
    res.send("Error While Deleting!!!")
  } 
});

app.listen(port, () => console.log(`app hosted on port ${port}!`))