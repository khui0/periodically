const status = document.getElementById("status");
const feed = document.getElementById("feed");

var data = JSON.parse(localStorage.getItem("data") || "[]");

document.body.className = localStorage.getItem("theme") || "";

updateTasks();
updateStatus();
resetTaskModal();

setInterval(updatePastDue, 100);

document.querySelectorAll("[data-theme]").forEach(item => {
    item.addEventListener("click", () => {
        let value = item.getAttribute("data-theme");
        document.body.className = value;
        localStorage.setItem("theme", value);
    });
});

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", () => {
        let id = item.getAttribute("data-open");
        document.getElementById(id).showModal();
        if (id != "task") {
            document.getElementById(id).querySelector("button[data-close]").focus();
        }
    });
});

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById(item.getAttribute("data-close")).close();
    });
});

document.getElementById("task").addEventListener("close", resetTaskModal);

document.getElementById("task-submit").addEventListener("click", () => {
    let title = document.getElementById("task-title").value;
    let date = document.getElementById("task-date").value;
    let details = document.getElementById("task-details").value;

    let timestamp = new Date(date).getTime();
    if (title?.trim() && date?.trim()) {
        let uuid = uuidv4();
        storeTask(uuid, title, timestamp, details);
        updateTasks();
        updateStatus();
        resetTaskModal();
    }
    else {
        alert("Title and date seem to be empty 🤔");
    }
});

document.getElementById("reset-tasks").addEventListener("click", () => {
    if (confirm("All tasks will be deleted. Would you like to continue?")) {
        localStorage.removeItem("data");
    }
});

document.getElementById("reset-theme").addEventListener("click", () => {
    localStorage.removeItem("theme");
});

document.getElementById("reset").addEventListener("click", () => {
    if (confirm("All saved data will be deleted. Would you like to continue?")) {
        localStorage.clear();
    }
});

function createTask(uuid, title, date, details) {
    feed.innerHTML += `<div class="card" id="${uuid}">
        <h3>${title}</h3>
        <p>${date}</p>
        <p>${details}</p>
        <div class="button-cluster">
            <button data-delete="${uuid}">Completed</button>
        </div>
    </div>`;
    addButtonEvents();
}

function addButtonEvents() {
    document.querySelectorAll("[data-delete]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-delete");
            // Remove item from DOM
            document.getElementById(uuid).remove();
            // Remove item from data
            data = data.filter(item => item.uuid != uuid);
            localStorage.setItem("data", JSON.stringify(data));
            updateStatus();
        });
    });
}

function storeTask(uuid, title, timestamp, details) {
    let item = {
        "uuid": uuid,
        "title": title,
        "timestamp": timestamp,
        "details": details
    };
    data.push(item);
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

function updateTasks() {
    feed.innerHTML = "";
    data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
    for (let i = 0; i < data.length; i++) {
        createTask(data[i].uuid, data[i].title, new Date(data[i].timestamp).toLocaleString(), data[i].details);
    }
}

function updateStatus() {
    let amount = data.length;
    if (amount == 1) {
        document.getElementById("status").textContent = `${amount} thing left to do`;
    }
    else {
        document.getElementById("status").textContent = `${amount} things left to do`;
    }
}

function updatePastDue() {
    let current = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (current > data[i].timestamp) {
            document.getElementById(data[i].uuid).querySelector("p").style.color = "var(--error-color)";
        }
    }
}