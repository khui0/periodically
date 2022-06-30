const status = document.getElementById("status");
const feed = document.getElementById("feed");

var data = {};

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", e => {
        document.getElementById(item.getAttribute("data-open")).showModal();
    })
})

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", e => {
        document.getElementById(item.getAttribute("data-close")).close();
    })
})

function createTask(title, date, details) {
    feed.innerHTML += `<div class="card" id="${title}">
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${details}</p>
        <div class="button-cluster">
            <button>Edit</button>
            <button>Finished</button>
        </div>
    </div>`;
}

// let uuid = uuidv4();
// data[uuid] = {};
// data[uuid].title = "test title";
// data[uuid].due = Date.now();
// data[uuid].details = "test details";
// console.log(data);