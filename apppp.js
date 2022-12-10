const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs")
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});
const itemsSchema = {
  name: String
};


const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = new mongoose.model("List", listSchema);

const Item = new mongoose.model("item", itemsSchema);



console.log(List.find({name:aami}));
