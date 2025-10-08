// Global variables to track blog state
let currentBlogs = [];
let visibleBlogCount = 3;

// Function to fetch all blogs
async function fetchAllBlogs() {
    try {
        currentBlogs = await authFetch(`/${adminUUID}/admin/blogs/`, {
            method: 'GET',
        });
        console.log(currentBlogs);
        return currentBlogs;
    } catch (error) {
        console.error('Error loading blogs:', error);
        throw error;
    }
}

// Function to render blogs
function renderBlogs(blogsToShow) {
    const blogsContainer = document.querySelector('#pills-home .row');
    blogsContainer.innerHTML = ''; // Clear existing content
    
    blogsToShow.forEach(blog => {
        const blogCard = `
            <div class="col-xl-4 mb-4">
                    <div class="card shadow mb-4 border-0">
                        <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 class="m-0 font-weight-bold text-primary">${blog.title}</h6>
                            <div class="dropdown no-arrow">
                                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                    aria-labelledby="dropdownMenuLink">
                                    <div class="dropdown-header">Blog Actions:</div>
                                    <a class="dropdown-item" href="/blog/edit/${blog.id}">Edit</a>
                                    <a class="dropdown-item" href="/blog/view/${blog.slug}">View</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item delete-blog" href="#" data-id="${blog.id}">Delete</a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="text-center">
                                <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;height: 20rem;" 
                                    src="${blog.image_url ||'img/undraw_posting_photo.svg'}" alt="${blog.title}">
                            </div>
                            <p>Content:${blog.content}</p>
                                
                            </span></p>
                            <p>Created: ${new Date(blog.created_at).toLocaleDateString()}</p>
                            
                            <a target="_blank" rel="nofollow" href="http://127.0.0.1:8001/${adminUUID}/admin/blogs/${blog.slug}">Show More →</a>
                        </div>
                    </div>
                </div>
        `;
        blogsContainer.insertAdjacentHTML('beforeend', blogCard);
    });

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-blog').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this blog?')) {
                try {
                    await fetch(`http://127.0.0.1:8000/api/admin-uuid/admin/blogs/${button.dataset.id}/`, {
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });
                    loadBlogs(); // Refresh the list
                } catch (error) {
                    console.error('Delete failed:', error);
                }
            }
        });
    });


    // Show or hide "Show More" button
    const showMoreBtn = document.getElementById('showMoreBlogs');
    if (showMoreBtn) {
        showMoreBtn.style.display = blogsToShow.length < currentBlogs.length ? 'block' : 'none';
    }
}

// Function to load blogs with pagination
async function loadBlogs() {
    try {
        if (currentBlogs.length === 0) {
            await fetchAllBlogs();
        }
        
        const blogsToShow = currentBlogs.slice(0, visibleBlogCount);
        renderBlogs(blogsToShow);
        
    } catch (error) {
        console.error('Error loading blogs:', error);
        const blogsContainer = document.querySelector('#pills-home .row');
        blogsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">Failed to load blogs. Please try again later.</div>
            </div>
        `;
    }
}

// Function to show more blogs
function showMoreBlogs() {
    visibleBlogCount += 3; // Increase by 3 each click (or any number you prefer)
    const blogsToShow = currentBlogs.slice(0, visibleBlogCount);
    renderBlogs(blogsToShow);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadBlogs();
    
    // Add "Show More" button to HTML (if not already there)
    //const pillsHome = document.getElementById('pills-home');
    
    document.getElementById('showMoreBlogs').addEventListener('click', showMoreBlogs);
});

