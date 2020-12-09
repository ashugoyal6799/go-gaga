const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
// mongoose.connect(
//   "mongodb+srv://admin:@MADb018@cluster0.skjiz.mongodb.net/abhiDB",
//   { useNewUrlParser: true, useUnifiedTopology: true }
// );
mongoose.connect("mongodb://localhost:27017/gogoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = {
  name: String,
  location: String,
};
const User = new mongoose.model("User", userSchema);

// home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// show users page
app.get("/showUsers", function (req, res) {
  res.render("showUsers");
});

//print found users with given name
app.post("/usersByName", function (req, res) {
  User.find({ name: req.body.name }, function (err, users) {
    if (!err) {
      if (users.length == 0) {
        res.render("failed", { prop: req.body.name });
      } else {
        res.render("FoundUsers", { users: users });
      }
    } else {
      res.send(err);
    }
  });
});

// print found users with given location
app.post("/usersByLoc", function (req, res) {
  User.find({ location: req.body.location }, function (err, users) {
    if (!err) {
      if (users.length == 0) {
        res.render("failed", { prop: req.body.location });
      } else {
        res.render("FoundUsers", { users: users });
      }
    } else {
      res.send(err);
    }
  });
});

// save the name and password to database
app.post("/", function (req, res) {
  const newUser = new User({
    name: req.body.name,
    location: req.body.location,
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
