const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from 'public' directory
app.use(express.static('public'));

let categories = ['funnyJoke', 'lameJoke'];
let jokes = {
  funnyJoke: [
    { joke: 'Why did the student eat his homework?', response: 'Because the teacher told him it was a piece of cake!' },
    { joke: 'What kind of tree fits in your hand?', response: 'A palm tree' },
    { joke: 'What is worse than raining cats and dogs?', response: 'Hailing taxis' },
  ],
  lameJoke: [
    { joke: 'Which bear is the most condescending?', response: 'Pan-DUH' },
    { joke: 'What would the Terminator be called in his retirement?', response: 'The Exterminator' },
  ]
};

// Endpoint for joke categories
app.get('/jokebook/categories', (req, res) => {
  res.json(categories);
});

// Endpoint for jokes in a category
app.get('/jokebook/joke/:category', (req, res) => {
  const { category } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : jokes[category].length;

  if (!jokes[category]) {
    return res.status(404).json({ error: `no category listed for ${category}` });
  }

  res.json(jokes[category].slice(0, limit));
});

// Endpoint to add a new joke
app.post('/jokebook/joke/new', (req, res) => {
  const { category, joke, response } = req.body;

  if (!category || !joke || !response || !categories.includes(category)) {
    return res.status(400).json({ error: 'invalid or insufficient user input' });
  }

  jokes[category].push({ joke, response });
  res.json(jokes[category]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
