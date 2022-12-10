const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const day1="Today";
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
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

const item1 = new Item({
  name: "welcome"
});
const item2 = new Item({
  name: "to do list"
});
const item3 = new Item({
  name: "hit the + button"
});


const DefaultItem = [item1, item2, item3];



app.get("/", function(req, res) {


  var Today = new Date();
  var option = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  var day = Today.toLocaleDateString("en-US", option);

  Item.find({}, function(err, foundItem) {
    if (foundItem.length === 0) {
      Item.insertMany(DefaultItem, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully inserted");
        }
      });
      res.render("/");
    } else {
      res.render("list", {
        kindofDay: day1,
        items: foundItem
      });

    }

  });

});




app.post("/", function(req, res) {

  var item = req.body.newItem;

  var listName = req.body.button;

  if (item === "") {} else {
    const itemtobeadded = new Item({
      name: item
    });

    if (listName === "Today") {
      itemtobeadded.save();
      res.redirect("/");
    } else {
      List.findOne({
        name: listName
      }, function(err, foundlist) {
        if (err) {
          console.log(err);
        }
        foundlist.items.push(itemtobeadded);
        foundlist.save();
        res.redirect("/" + listName);
      });
    }
  }
});




app.post("/delete", function(req, res) {

  const whichlist = req.body.whichlist;
  const delitem = req.body.checkbox;

  if(whichlist.trim() === day1.trim()){

    Item.findOneAndDelete({_id: delitem}, function(err) {
      if (!err) {
        console.log("deleted successfully");
        res.redirect("/");
      } else {
        console.log(err);
      }
    });

  }else{

    List.findOneAndUpdate({name:whichlist.trim()},{$pull:{items:{_id:delitem}}},function(err,found){
      if(!err){
        res.redirect("/"+whichlist.trim());

      }else{
        console.log(err);
      }
    });
  }
});


app.get("/:newLink", function(req, res) {
  const newLink = _.capitalize(req.params.newLink);

  List.findOne({
    name: newLink
  }, function(err, foundlist) {
    if (!err) {

      if (!foundlist) {
        const list = new List({
          name: newLink,
          items: DefaultItem
        });
        list.save();
        res.redirect("/" + newLink);


      } else {

        res.render("list", {
          kindofDay: foundlist.name,
          items: foundlist.items
        });

      }
    }
  })

});



app.listen(3000);
