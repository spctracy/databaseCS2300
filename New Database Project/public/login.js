// login.js

document.addEventListener('DOMContentLoaded', () => {
    // if already logged in, bounce to index
    if (localStorage.getItem('username')) {
      window.location.href = 'index.html';
      return;
    }
  
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('username').value.trim();
      const pass = document.getElementById('password').value;
  
      // simple placeholder check — replace with real auth as needed
      if (user && pass) {
        localStorage.setItem('username', user);
        window.location.href = 'index.html';
      } else {
        alert('Please enter both username and password.');
      }
    });
  });
  