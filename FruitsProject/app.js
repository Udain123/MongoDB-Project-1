

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB",{ useUnifiedTopology: true });

const fruitSchema = new mongoose.Schema ({
  name: {
    type:String,
    required: [true,"Please check your Data, no name is specified"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit ({
  rating: 10,
  review: "Peaches aur good"
});

// fruit.save();

const personSchema = new mongoose.Schema ({
  name: String,
  age: Number,
  favouriteFruit: fruitSchema
});

const Person = mongoose.model("Person",personSchema);

// const pineapple = new Fruit ({
//   name: "Pineapple",
//   rating: 9,
//   review: "Not that good"
// });

const graphes = new Fruit ({
  name: "Graphes",
  rating: 9,
  review: "A bit good"
});


 graphes.save();

const person = new Person ({
  name: "John",
  age: 37,
  favouriteFruit: graphes
});

person.save();

// const kiwi = new Fruit ({
//   name: "Kiwi",
//   rating: 10,
//   review: "Nice"
// });
//
// const orange = new Fruit ({
//   name: "Orange",
//   rating: 8,
//   review: "Sour"
// });
//
// const banana = new Fruit ({
//   name: "Banana",
//   rating: 9,
//   review: "Sweet"
// });

// Fruit.insertMany([kiwi,orange,banana], function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succesfully saved");
//   }
// });


Fruit.find(function(err,fruits){
  if(err){
    console.log(err);
  }
  else{

    mongoose.connection.close();
    fruits.forEach(function(fruit){
      console.log(fruit.name);
    });

  }
})

// Fruit.updateOne({_id: "5f128ae7ac80d221608d87f4"},{rating: 8}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succesful");
//   }
// });

// Fruit.deleteOne({name: "Banana"}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succesful");
//   }
// });

// Person.deleteMany({name: "John"}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("Succesfull");
//   }
// });




//
// const findDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('fruits');
//   // Find some documents
//   collection.find({}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     console.log("Found the following records");
//     console.log(docs)
//     callback(docs);
//   });
// }
