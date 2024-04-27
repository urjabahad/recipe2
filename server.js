const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'ria@12345',
  database: 'recipes',
  connectionLimit: 10
});

// Middleware to parse JSON bodies
app.use(express.json());

// Route to save recipe to the database
app.post('/save-recipe', (req, res) => {
  const { username, recipeId } = req.body;
console.log('Attempting to save recipe:', { username, recipeId });

  // Insert the recipe into the database
  pool.query(
    'INSERT INTO saved_recipes (username, recipeId) VALUES (?, ?)',
    [username, recipeId],
    (error, results) => {
      if (error) {
        console.error('Error saving recipe:', error);
        res.status(500).json({ success: false, error: 'Error saving recipe' });
      } else {
        res.json({ success: true });
      }
    }
  );
});
// Route to fetch saved recipes for a particular user
app.get('/saved-recipes', (req, res) => {
  // Query to retrieve saved recipes
  pool.query(
    'SELECT * FROM saved_recipes',
    (error, results) => {
      if (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ success: false, error: 'Error fetching saved recipes' });
      } else {
        const savedRecipes = results.map(result => [result.username, result.recipeId]);
        res.json({ success: true, savedRecipes }); // Send JSON response
      }
    }
  );
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
