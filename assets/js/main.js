let baseUrl = "https://vica-post-api.vercel.app/api/posts";
const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const formTitle = document.querySelector("form h2");
const postModal = document.querySelector(".post-modal");
const btn = document.getElementById("btn");
const msg = document.getElementById("msg");
let editPostId = null;

// Toggle Modal
function togglePostModal(id = null) {
  editPostId = id;
  if (id) {
    getPostDetails(id);
    formTitle.textContent = "Edit Post";
    nameInput.value = "Loading ...";
    descInput.value = "Loading ...";
    nameInput.disabled=true;
    descInput.disabled=true;
    btn.disabled=true;
  } else {
    formTitle.textContent = "Add Post";
    nameInput.value = "";
    descInput.value = "";
    nameInput.disabled=false;
    descInput.disabled=false;
    btn.disabled=false;
  }
  postModal.classList.toggle("post-modal-active");
}

// Request: Get All Posts
function getPosts() {
  fetch(baseUrl)
    .then((res) => res.json())
    .then((res) => {
      const tableContent = document.querySelector("#table-content");
      tableContent.innerHTML = "";

      if (res.length === 0) {
        tableContent.innerHTML = `
          <tr>
            <td colspan="4" style="text-align: center;"><h3>No posts found</h3></td>
          </tr>`;
        return;
      }

      res.forEach((post) => {
        tableContent.innerHTML += `
          <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.description}</td>
            <td class="table-actions">
              <button onclick="togglePostModal(${post.id})">
                <img src="./assets/imgs/edit.svg" alt="">
              </button>
              <button id="${post.id}" class="delete-btn" onclick="deletePost(${post.id})">
                <img src="./assets/imgs/trash.svg" alt="">
              </button>
            </td>
          </tr>`;
      });
    })
    .catch((error) => {
      msg.innerHTML="Error fetching posts:"+error;
      msg.style.color="red";
      msg.style.backgroundColor="#ffbbbb";
      msg.style.display="block";
      setTimeout(stop , 3000);
    });
}

// Request: Get Post Details
function getPostDetails(postId) {
  fetch(`${baseUrl}/${postId}`)
    .then((res) => res.json())
    .then((res) => {
      nameInput.value = res.title;
      descInput.value = res.description;
      nameInput.disabled=false;
      descInput.disabled=false;
      btn.disabled=false;
    });
}

// Request: Add or Edit Post
function addOrEditPost(e) {
  e.preventDefault();
  btn.style.opacity="0.5";
  btn.style.cursor="not-allowed";
  btn.disabled=true;
  btn.innerHTML=`
  		<span>Loading  </span>
  		<i class="fa-solid fa-spinner fa-pulse"></i>
  `;
  const url = editPostId ? `${baseUrl}/${editPostId}` : baseUrl;
  const method = editPostId ? "PUT" : "POST";
  msg.innerHTML= editPostId ? "update successful" : "Add successful";
  
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: nameInput.value.trim(),
      description: descInput.value.trim(),
    }),
  })
    .then(() => {
      getPosts();
      togglePostModal();
      btn.style.opacity="1";
      btn.innerHTML="Save";
      btn.style.cursor="pointer";
      msg.style.color="green";
      msg.style.backgroundColor="#bbffbb";
      msg.style.display="block";
      setTimeout(stop , 3000);
      nameInput.value = "";
      descInput.value = "";
      btn.disabled=false;
      editPostId = null;
    })
    .catch((error) => {
      msg.innerHTML="Error:"+error;
      msg.style.color="red";
      msg.style.backgroundColor="#ffbbbb";
      msg.style.display="block";
      setTimeout(stop , 3000);
    });
}

// Request: Delete Post
function deletePost(id) {
  const del=document.getElementById(id);
  del.disabled=true;
  del.style.opacity="0.5";
  btn.style.cursor="not-allowed";
  fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  }).then(() => {
  	msg.innerHTML="delete successful";
  	msg.style.color="green";
  	msg.style.backgroundColor="#bbffbb";
  	del.disabled=false;
  	del.style.opacity="1";
  	del.style.cursor="pointer";
  	msg.style.display="block";
  	setTimeout(stop , 3000);
    getPosts();
  });
}

function stop(){
	msg.style.display="none";
}

getPosts();