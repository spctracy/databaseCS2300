
document.addEventListener('DOMContentLoaded', () => {
    // Footer year
    document.getElementById('year').textContent = new Date().getFullYear();

    const user = localStorage.getItem('username');
    if (!user) {
        //not logged in -> redirect to Login page
        window.location.href = 'login.html';
        return
    }

    document.getElementById('userName').textContent = user;

      // logout logic
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });

    // Canvas setup
    const canvas = document.getElementById('planner-canvas');
    const ctx    = canvas.getContext('2d');
  
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width;
      canvas.height = rect.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.globalCompositeOperation = 'source-over';
  
    let drawing = false, lastX = 0, lastY = 0;
  
    canvas.addEventListener('mousedown', e => {
      drawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('mousemove', e => {
      if (!drawing) return;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('mouseup',   () => drawing = false);
    canvas.addEventListener('mouseleave',() => drawing = false);
  
    // Eraser toggle
    const eraserBtn = document.getElementById('eraserBtn');
    let erasing = false;
    eraserBtn.addEventListener('click', () => {
      erasing = !erasing;
      if (erasing) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
        eraserBtn.textContent = 'Draw';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 2;
        eraserBtn.textContent = 'Eraser';
      }
    });
  
    // Clear all
    document.getElementById('clearBtn').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  
    // Screenshot
    document.getElementById('screenshotBtn').addEventListener('click', () => {
      const dataURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'canvas_screenshot.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const today = new Date();
  
    // 1. Find Sunday of the current week:
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
  
    // 2. Grab the 7 header cells:
    const headers = document.querySelectorAll('#calendar th');
  
    headers.forEach((th, idx) => {
      // compute this day
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + idx);
  
      const dd = String(d.getDate()).padStart(2,'0');
      const mm = String(d.getMonth()+1).padStart(2,'0');
  
      th.innerHTML = `
        <span class="weekday">${days[idx]}</span>
        <span class="date">${mm}/${dd}</span>
      `;
    });

    document.addEventListener('DOMContentLoaded', () => {
      const form     = document.getElementById('userForm');
      const list     = document.getElementById('userList');
      const apiRoot  = '/api/users';
    
      // fetch & render users
      function loadUsers(sort='username') {
        fetch(`${apiRoot}?sort=${sort}`)
          .then(r => r.json())
          .then(users => {
            list.innerHTML = users.map(u =>
              `<li>
                 <strong>${u.username}</strong> (${u.info||'–'})<br>
                 Classes: ${u.classes.join(', ') || 'none'}
               </li>`
            ).join('');
          });
      }
    
      // submit new user
      form.addEventListener('submit', ev => {
        ev.preventDefault();
        const data = {
          username: form.username.value.trim(),
          info:     form.info.value.trim(),
          classes:  form.classes.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(s => s)
        };
        fetch(apiRoot, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(r => r.json())
        .then(() => {
          form.reset();
          loadUsers();  // refresh list
        });
      });
    
      // load initially
      loadUsers();
    });
  

  });
  