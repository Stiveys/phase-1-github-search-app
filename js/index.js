// Grab references to DOM elements
const form = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

// Event listener for form submission
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload on form submission
  const query = searchInput.value.trim(); // Get the value from the search input

  if (query) {
    searchUsers(query);
  }
});

// Function to search GitHub users by name
function searchUsers(query) {
  fetch(`https://api.github.com/search/users?q=${query}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    displayUsers(data.items); // Display users
  })
  .catch(error => {
    console.error('Error fetching users:', error);
  });
}

// Function to display users in the DOM
function displayUsers(users) {
  userList.innerHTML = ''; // Clear previous results
  reposList.innerHTML = ''; // Clear any previous repo list

  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
      <button data-username="${user.login}">View Repos</button>
    `;
    userList.appendChild(userItem);

    // Add event listener for fetching user repositories
    userItem.querySelector('button').addEventListener('click', () => {
      fetchUserRepos(user.login);
    });
  });
}

// Function to fetch repositories of a specific user
function fetchUserRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    displayRepos(data); // Display repos
  })
  .catch(error => {
    console.error('Error fetching repos:', error);
  });
}

// Function to display repositories in the DOM
function displayRepos(repos) {
  reposList.innerHTML = ''; // Clear previous repo results

  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
      - ⭐ ${repo.stargazers_count}
    `;
    reposList.appendChild(repoItem);
  });
}
