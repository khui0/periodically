const status = document.getElementById("status");
const feed = document.getElementById("feed");

var data = {};

if (localStorage.getItem("data") === null) {
    localStorage.setItem("data", JSON.stringify(data));
}
else {
    data = JSON.parse(localStorage.getItem("data"));
    for (const uuid in data) {
        createTask(uuid, data[uuid].title, new Date(data[uuid].timestamp).toLocaleString(), data[uuid].details);
    }
    updateStatus();
}

updateStatus();
resetTaskModal();

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
        saveTask(uuid, title, timestamp, details);
        updateStatus();
        resetTaskModal();
    }
    else {
        alert("Fields cannot be left blank");
    }
});

document.getElementById("reset").addEventListener("click", () => {
    localStorage.clear();

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
            let uuid = item.getAttribute("data-delete");
            document.getElementById(uuid).remove();
            delete data[uuid];
            localStorage.setItem("data", JSON.stringify(data));
            updateStatus();
        });
    });
}

function saveTask(uuid, title, timestamp, details) {
    data[uuid] = {};
    data[uuid].title = title;
    data[uuid].timestamp = timestamp;
    data[uuid].details = details;
    localStorage.setItem("data", JSON.stringify(data));
}

function endOfToday() {
    let date = new Date();
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T23:59`;
}

function resetTaskModal() {
    document.getElementById("task").close();
    document.getElementById("task-title").value = "";
    document.getElementById("task-date").value = endOfToday();
    document.getElementById("task-details").value = "";
}

function updateStatus() {
    let amount = Object.keys(data).length;
    if (amount == 1) {
        document.getElementById("status").textContent = `${amount} thing left to do`;
    }
    else {
        document.getElementById("status").textContent = `${amount} things left to do`;
    }
}