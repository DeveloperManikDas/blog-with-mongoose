import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

main();

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://leo999Plus:manik123manik@cluster0.vfc36z3.mongodb.net/myBlogDB"
    );
  } catch (error) {
    console.error("Function encountered an error:", error);
  }
}

const blogSchema = new mongoose.Schema({
  blogTitle: String,
  blogParagraph: String,
});
const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const defaultBlog = {
  blogTitle: "This is a demo blog Title",
  blogParagraph: "This is a demo blog",
};

app.get("/", async (req, res) => {
  const foundResult = await Blog.find({});
  if (foundResult.length === 0) {
    await Blog.insertMany([defaultBlog]);
  } else {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundResult,
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const title = req.body.postTitle;
  const paragraph = req.body.postBody;

  const blogPpost1 = new Blog({
    blogTitle: title,
    blogParagraph: paragraph,
  });
  blogPpost1.save();
  res.redirect("/");
});

app.get("/posts/:postName", async (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);
  const foundResult = await Blog.find({});

  const foundPost = foundResult.find(
    (post) => _.lowerCase(post.blogTitle) === requestedTitle
  );

  if (!foundPost) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("post", {
    title: foundPost.blogTitle,
    paragraph: foundPost.blogParagraph,
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
