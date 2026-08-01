# Student Portfolio

A responsive student portfolio website built using **React** and **Vite**. The project demonstrates component-based architecture, client-side routing, state management, and REST API integration by fetching GitHub repositories dynamically.

---

## Features

- Home, Projects, and Contact pages
- React Router for navigation
- Dark / Light theme toggle
- 404 Not Found page
- Dynamic GitHub repository listing
- Repository search functionality
- Loading spinner during API requests
- Error handling with retry option
- Responsive user interface

---

## Technologies Used

- React
- Vite
- JavaScript (ES6+)
- React Router DOM
- HTML5
- CSS3
- GitHub REST API

---

## Project Structure

```
student-portfolio/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Spinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── RepoCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Projects.jsx
│   │   ├── Contact.jsx
│   │   └── NotFound.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── package.json
└── README.md
```

---

## GitHub API

The Projects page fetches public repositories using the GitHub REST API.

Example Endpoint:

```
https://api.github.com/users/<github-username>/repos
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/HetGangani/portfolio-D25IT125.git
```

Go inside the project:

```bash
cd portfolio-D25IT125
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Functionalities

- Multi-page navigation
- Dynamic state management
- Conditional rendering
- GitHub API integration
- Search repositories
- Loading indicator
- Error handling
- Retry API request
- Responsive design

---

## Future Improvements

- GitHub authentication
- Project categories
- Contact form backend
- Animations
- Deployment using Vercel

---

## Author

**Het Gangani**

B.Tech Information Technology

CHARUSAT
