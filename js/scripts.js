document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loadRandomJoke').addEventListener('click', loadRandomJoke);
    document.getElementById('searchButton').addEventListener('click', searchJokes);
    document.getElementById('newJokeForm').addEventListener('submit', submitNewJoke);

    loadCategories(); // Load categories on page load
});

function loadRandomJoke() {
    // Example endpoint: '/jokebook/random' (Adjust based on your actual API)
    fetch('/jokebook/random')
        .then(response => response.json())
        .then(data => {
            document.getElementById('jokeDisplay').innerText = `${data.joke} - ${data.response}`;
        })
        .catch(error => console.error('Error loading random joke:', error));
}

function loadCategories() {
    fetch('/jokebook/categories')
        .then(response => response.json())
        .then(categories => {
            const categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = ''; // Clear existing categories
            categories.forEach(category => {
                const li = document.createElement('li');
                li.innerText = category;
                li.addEventListener('click', () => searchJokes(category)); // Load jokes for clicked category
                categoryList.appendChild(li);
            });
        })
        .catch(error => console.error('Error loading categories:', error));
}

function searchJokes(category = null) {
    const categoryToSearch = category || document.getElementById('searchCategory').value;
    if (!categoryToSearch) {
        alert('Please enter a category to search.');
        return;
    }

    fetch(`/jokebook/joke/${categoryToSearch}`)
        .then(response => response.json())
        .then(jokes => {
            const jokeList = document.getElementById('jokeList');
            jokeList.innerHTML = ''; // Clear existing jokes
            jokes.forEach(joke => {
                const p = document.createElement('p');
                p.innerText = `${joke.joke} - ${joke.response}`;
                jokeList.appendChild(p);
            });
        })
        .catch(error => {
            console.error('Error searching jokes:', error);
            alert('Failed to load jokes for the category.');
        });
}

function submitNewJoke(event) {
    event.preventDefault();
    const category = document.getElementById('categoryInput').value;
    const joke = document.getElementById('jokeInput').value;
    const response = document.getElementById('responseInput').value;

    fetch('/jokebook/joke/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, joke, response }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Joke submitted successfully!');
        // Optionally refresh the joke list for the category
        searchJokes(category);
    })
    .catch(error => {
        console.error('Error submitting new joke:', error);
        alert('Failed to submit new joke.');
    });
}
