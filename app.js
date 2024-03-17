const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const uploadImage = multer({ dest: 'uploads/' }); // 'uploads/' is the directory where files will be saved
const User = require('./userModel');
const Recipe = require('./recipeModel');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('recipeImages'));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads'); // Make sure this directory exists
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

async function main()
{
    const uri = "mongodb+srv://general:XBdL2fEY57xuft61@blueeating.wuxbf81.mongodb.net/?retryWrites=true&w=majority&appName=BlueEating/User";
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('Cannot find user');
    }

    if (await bcrypt.compare(password, user.password)) {
      res.send({userID:user._id,userInitial:user.username});
    } else {
      res.send('Not Allowed');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/recipe', upload.single('imageOfProduct'), async (req, res) => {
  try {
    const { recipeName, ingredients, directions, userID } = req.body;

    // Access the uploaded file information from req.file
    const imagePath = req.file ? req.file.path : ''; // Get the file path or set it to an empty string if no file was uploaded

    // Create a new Recipe object with the provided data and image path
    const newRecipe = new Recipe({
      recipeName,
      ingredients,
      directions,
      imageOfProduct: imagePath,
      userID,
    });

    // Save the new recipe to the database
    await newRecipe.save();
    res.status(201).send('Recipe created successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while creating recipe.');
  }
});

/*
app.post('/recipe', upload.single('imageOfProduct'),async (req, res) => {
  try {
    // Destructure the expected fields from the request body
    const { recipeName, ingredients, directions, imageOfProduct, userID } = req.body;


    const imagePath = req.file ? req.file.path : null;


    // Parse ingredients assuming they're provided as a JSON string
    try {
    } catch (er) {
      console.error(er)
      return res.status(400).send("Invalid format for ingredients");
    }
    //const userID2 = mongoose.Types.ObjectId(userID);
    // Prepare the new recipe object with or without an image path
    const newRecipe = new Recipe({
      recipeName,
      ingredients: ingredients,
      directions,
      imageOfProduct: imagePath || '', // Use an empty string if no image path is provided
      userID,
    });


    // Save the new recipe to the database
    await newRecipe.save();
    res.status(201).send('Recipe created successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while creating recipe.');
  }
});
*/

// Search Recipe
app.post('/recipes/search', async (req, res) => {
  try {
    const searchCriteria = req.body; // Extract search criteria from request body
    // Implement search logic here. For example, using MongoDB's $match
    const recipes = await Recipe.find({
      // Example search logic
      recipeName: { $regex: searchCriteria.recipeName, $options: 'i' },
      'ingredients.ingredientName': { $in: searchCriteria.ingredients.map(ing => ing.ingredientName) }
    });
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while searching for recipes.');
  }
});

// Delete Recipe
app.delete('/recipe/:recipeID', async (req, res) => {
  try {
    const { recipeID } = req.params;
    const { userID } = req.body; // Assuming userID is sent in the body

    const recipe = await Recipe.findById(recipeID);
    if (!recipe) return res.status(404).send('Recipe not found');

    if (recipe.userID.toString() !== userID) {
      return res.status(403).send('Unauthorized to delete this recipe');
    }

    await Recipe.deleteOne({ _id: recipeID });
    res.send('Recipe deleted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get Recipe By ID
app.get('/recipe/:recipeID', async (req, res) => {
  try {
    const { recipeID } = req.params;
    const recipe = await Recipe.findById(new ObjectId(recipeID)); // Use 'new' keyword here
    
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    const imageData = await fs.promises.readFile(recipe.imageOfProduct);
    const response = {
      recipeID: recipe._id,
      recipeName: recipe.recipeName,
      ingredients: recipe.ingredients,
      directions: recipe.directions,
      imageOfProduct: imageData.toString('base64') // Include image data as base64 string
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error.message)
  }
});


const fs = require('fs');

app.get('/recipes', async (req, res) => {
  try {
    // Fetch 20 recipes from the database
    const recipes = await Recipe.find().limit(20);

    // Map each recipe to include its image data
    const recipesWithImages = await Promise.all(recipes.map(async recipe => {
      const imageData = await fs.promises.readFile(recipe.imageOfProduct);
      return {
        recipeID: recipe._id,
        recipeName: recipe.recipeName,
        ingredients: recipe.ingredients,
        directions: recipe.directions,
        imageOfProduct: imageData.toString('base64') // Include image data as base64 string
      };
    }));

    // Send the recipes with images as a response
    res.json(recipesWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error while fetching recipes.');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main().catch(console.error);
