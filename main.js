const status = document.getElementById("status");
const feed = document.getElementById("feed");

var data = {};

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById(item.getAttribute("data-open")).showModal();
    });
});

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById(item.getAttribute("data-close")).close();
    });
});

document.getElementById("task-submit").addEventListener("click", () => {
    let title = document.getElementById("task-title").value;
    let date = document.getElementById("task-date").value;
    let details = document.getElementById("task-details").value;

    let timestamp = new Date(date).getTime();
    if (title?.trim() && date?.trim() && details?.trim()) {
        let uuid = uuidv4();
        createTask(uuid, title, new Date(timestamp).toLocaleString(), details);
        // Close modal and reset inputs
        document.getElementById("task").close();
        document.getElementById("task-title").value = "";
        document.getElementById("task-date").value = "";
        document.getElementById("task-details").value = "";
    }
    else {
        alert("Fields cannot be left blank");
    }
});

function createTask(uuid, title, date, details) {
    feed.innerHTML += `<div class="card" id="${uuid}">
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${details}</p>
        <div class="button-cluster">
            <button data-edit="${uuid}">Edit</button>
            <button data-delete="${uuid}">Finished</button>
        </div>
    </div>`;
    addButtonClick();
}

function addButtonClick() {
    document.querySelectorAll("[data-edit]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-edit");
            console.log("edit task with id: " + uuid);
        });
    });
    document.querySelectorAll("[data-delete]").forEach(item => {
        item.addEventListener("click", () => {
            document.getElementById(item.getAttribute("data-delete")).remove();
        });
    });
}

// let uuid = uuidv4();
// data[uuid] = {};
// data[uuid].title = "test title";
// data[uuid].due = Date.now();
// data[uuid].details = "test details";
// console.log(data);