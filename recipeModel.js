const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeName: String,
  ingredients: [String],
  directions: String,
  imageOfProduct: String, // This will store the file path
  userID: {
    type: mongoose.Schema.Types.ObjectId, // Defines the type as ObjectId
    ref: 'User' // References the User model
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
