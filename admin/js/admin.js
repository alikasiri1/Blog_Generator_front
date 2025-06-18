const API_ROOT = 'http://127.0.0.1:8000/api';
const accessToken = localStorage.getItem('access_token');
const adminUUID = localStorage.getItem('admin_uuid');

function getAuthHeaders() {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  };
}

async function authFetch(url, options = {}) {
  const res = await fetch(`${API_ROOT}${url}`, {
    ...options,
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
    alert("Session expired. Please log in again.");
    window.location.href = 'login.html';
    return;
  }
  return res.json();
}
if (!accessToken || !adminUUID) {
    alert("You're not logged in.");
    window.location.href = 'login.html';
  } else {
    loadBlogs();
  }

async function loadBlogs() {
  const blogs = await authFetch(`/admin/blogs/`);
  console.log(blogs)
  const out = document.getElementById('dataTable');
  out.innerHTML = `
      <thead>
        <tr>
          <th>Title</th>
          <th>Content (preview)</th>
          <th>Published</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${blogs.map(blog => `
          <tr>
            <th>
                ${blog.status === 'published' 
                    ? `<a class="nav-link" href="http://127.0.0.1:8001/single.html?title=${blog.slug}"> 
                        <span>${blog.title}</span>
                    </a>`
                    : `<span class="nav-link disabled">${blog.title}</span>`
                }
            </th>
            <th>${(blog.content || '').substring(0, 100)}...</th>
            <th>
                <button class="btn btn-sm btn-${blog.status === 'published' ? 'warning' : 'success'}">
                    ${blog.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
            </th>
            <td>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${blog.id}" data-bs-toggle="dropdown" aria-expanded="false">
                  	Actions
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${blog.id}">
                  <li><a class="dropdown-item" href="#" onclick='editBlog(${JSON.stringify(blog)})'>Edit</a></li>
                  <li><a class="dropdown-item" href="#">Regenerate</a></li>
                  <div class="dropdown-divider"></div>
                  <li><a class="dropdown-item" href="#" onclick='deleteBlog(${blog.slug})'>Delete</a></li>
                  
                </ul>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>`;
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}
