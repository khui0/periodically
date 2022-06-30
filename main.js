const status = document.getElementById("status");
const feed = document.getElementById("feed");

document.getElementById("new").addEventListener("click", () => {
    createTask("test","due sometime lmao", "insert details here insert details here insert details here insert details here");
});

function createTask(title, date, details) {
    feed.innerHTML += `<div class="card" id="${title}">
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${details}</p>
        <div class="button-cluster">
            <button>Mark as complete</button>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    </div>`;
}