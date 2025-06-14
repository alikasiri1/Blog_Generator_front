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
  const blogs = await authFetch(`/${adminUUID}/admin/blogs/`);
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

function showCreateModal() {
  document.getElementById('floatingFormTitle').innerText = 'Create Blog';
  document.getElementById('blog-id').value = '';
  document.getElementById('blog-title').value = '';
  document.getElementById('blog-content').value = '';
  document.getElementById('blog-category').value = '';
  openFloatingForm();
}

function editBlog(blog) {
  document.getElementById('floatingFormTitle').innerText = 'Edit Blog';
  document.getElementById('blog-id').value = blog.id;
  document.getElementById('blog-title').value = blog.title;
  document.getElementById('blog-content').value = blog.content;
  document.getElementById('blog-category').value = blog.category;
  openFloatingForm();
}

function openFloatingForm() {
  document.getElementById('floatingForm').style.display = 'block';
  document.getElementById('floatingFormBackdrop').style.display = 'block';
}

function closeFloatingForm() {
  document.getElementById('floatingForm').style.display = 'none';
  document.getElementById('floatingFormBackdrop').style.display = 'none';
}

async function submitBlog(e) {
  e.preventDefault();
  const id = document.getElementById('blog-id').value;
  const title = document.getElementById('blog-title').value;
  const content = document.getElementById('blog-content').value;
  const category = document.getElementById('blog-category').value;

  const blog = { title, content, category };
  const method = id ? 'PUT' : 'POST';
  const url = id
    ? `/${adminUUID}/admin/blogs/${id}/`
    : `/${adminUUID}/admin/blogs/`;

  await authFetch(url, {
    method,
    body: JSON.stringify(blog)
  });

  closeFloatingForm();
  loadBlogs();
}

async function deleteBlog(slug) {
  if (!confirm('Are you sure?')) return;
  await authFetch(`/${adminUUID}/admin/blogs/${slug}/`, {
    method: 'DELETE'
  });
  loadBlogs();
}

async function loadProfile() {
  const profile = await authFetch(`/${adminUUID}/admin/profil/`);
  const out = document.getElementById('output');
  out.innerHTML = `
    <h3>Admin Profile</h3>
    <p><strong>Username:</strong> ${profile.username}</p>
    <p><strong>Email:</strong> ${profile.email}</p>`;
}

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}
