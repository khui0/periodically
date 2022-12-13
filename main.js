import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const status = document.getElementById("status");
const feed = document.getElementById("feed");

let data = JSON.parse(localStorage.getItem("periodically-data") || "[]");
document.body.className = localStorage.getItem("periodically-theme") || "";

updateTasks();
updateStatus();

setInterval(updatePastDue, 100);
let countdown;

document.querySelectorAll("[data-theme]").forEach(item => {
    item.addEventListener("click", () => {
        let value = item.getAttribute("data-theme");
        document.body.className = value;
        localStorage.setItem("periodically-theme", value);
    });
});

document.querySelectorAll("[data-open]").forEach(item => {
    item.addEventListener("click", () => {
        let id = item.getAttribute("data-open");
        document.getElementById(id).showModal();
        if (id != "task") {
            document.getElementById(id).querySelector("button[data-close]").focus();
        }
        else {
            setTaskModal();
        }
    });
});

document.querySelectorAll("[data-close]").forEach(item => {
    item.addEventListener("click", () => {
        let id = item.getAttribute("data-open");
        document.getElementById(item.getAttribute("data-close")).close();
        if (id == "countdown") {
            clearInterval(countdown);
        }
    });
});

// Keybord shortcut to submit task
document.getElementById("task").addEventListener("keydown", e => {
    if (e.ctrlKey && e.key == "Enter") {
        document.getElementById("task-submit").click();
    }
});

document.getElementById("task-submit").addEventListener("click", e => {
    let modal = document.getElementById("task");
    let title = modal.querySelector("[data-title]").value;
    let date = modal.querySelector("[data-date]").value;
    let details = modal.querySelector("[data-details]").value;

    let timestamp = new Date(date).getTime();
    if (title?.trim() && date?.trim()) {
        if (!e.target.getAttribute("data-uuid")) {
            let uuid = uuidv4();
            storeTask(uuid, title, timestamp, details);
        }
        else {
            let uuid = e.target.getAttribute("data-uuid");
            // Removes old task from data object and localStorage
            data = data.filter(item => item.uuid != uuid);
            localStorage.setItem("periodically-data", JSON.stringify(data));
            storeTask(uuid, title, timestamp, details);
        }
        updateTasks();
        updateStatus();
        document.getElementById("task").close();
    }
    else {
        alert("Title and date can't be empty 🤔");
    }
});

document.querySelectorAll("[data-reset]").forEach(button => {
    button.addEventListener("click", () => {
        switch (button.getAttribute("data-reset")) {
            case "tasks":
                if (confirm("Would you like to remove all tasks? This cannot be undone.")) {
                    localStorage.removeItem("periodically-data");
                    alert("Tasks have been reset. Refresh to see changes 🗑️");
                }
                break;
            case "theme":
                localStorage.removeItem("periodically-theme");
                alert("Theme has been reset. Refresh to see changes 🦋");
                break;
            case "all":
                if (confirm("Would you like to reset all settings and data? This cannot be undone.")) {
                    localStorage.removeItem("periodically-data");
                    localStorage.removeItem("periodically-theme");
                    localStorage.removeItem("periodically-seen-buttons");
                    alert("All settings and data have been reset 🧼");
                }
                break;
        }
    });
});

function addTask(uuid, title, date, details) {
    feed.innerHTML += `<div class="card" id="${uuid}">
        <h3 data-task-title="${uuid}"></h3>
        <p>${date}</p>
        <p data-task-details="${uuid}"></p>
        <div class="button-cluster">
            <button data-delete="${uuid}">Complete</button>
            <button data-countdown="${uuid}">Countdown</button>
            <button data-edit="${uuid}">Edit</button>
        </div>
    </div>`;
    document.querySelector(`[data-task-title="${uuid}"]`).textContent = title;
    document.querySelector(`[data-task-details="${uuid}"]`).textContent = details;
    details && replaceHyperlinks(document.querySelector(`[data-task-details="${uuid}"]`));
    addButtonEvents();
}

function addButtonEvents() {
    document.querySelectorAll("[data-delete]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-delete");
            let task = data.find(item => item.uuid == uuid);
            if (confirm(`Would you like to mark "${truncateString(task.title, 20)}" as completed? 🥳`)) {
                // Remove item from DOM
                document.getElementById(uuid).remove();
                // Remove item from data object
                data = data.filter(item => item.uuid != uuid);
                localStorage.setItem("periodically-data", JSON.stringify(data));
                updateStatus();
            }
        });
    });
    document.querySelectorAll("[data-edit]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-edit");
            let task = data.find(item => item.uuid == uuid);
            setTaskModal("Edit task", "Save", uuid, [task.title, timeToISO(task.timestamp), task.details]);
            document.getElementById("task").showModal();
            updateStatus();
        });
    });
    document.querySelectorAll("[data-countdown]").forEach(item => {
        item.addEventListener("click", () => {
            let uuid = item.getAttribute("data-countdown");
            let task = data.find(item => item.uuid == uuid);
            let modal = document.getElementById("countdown");

            clearInterval(countdown);
            countdown = setInterval(updateCountdown, 100);
            updateCountdown();
            modal.showModal();

            function updateCountdown() {
                let time = timeBetween(new Date(task.timestamp).toISOString());
                let timeStrings = [
                    pluralize("days", time.days, true),
                    pluralize("hours", time.hours, true),
                    pluralize("minutes", time.minutes, true),
                    pluralize("seconds", time.seconds, true)
                ];
                modal.querySelector("h2").textContent = !time.passed ? `${task.title} is due in` : `${task.title} is past due by`;
                modal.querySelector("p").textContent = timeStrings.join(" ");
            }
        });
    });
}

function setTaskModal(title = "Add task", action = "Add", uuid = "", fields = ["", endOfToday(), ""]) {
    let modal = document.getElementById("task");
    let submit = document.getElementById("task-submit");
    modal.querySelector("h2").textContent = title;
    modal.querySelector("[data-title]").value = fields[0];
    modal.querySelector("[data-date]").value = fields[1];
    modal.querySelector("[data-details]").value = fields[2];
    submit.textContent = action;
    submit.setAttribute("data-uuid", uuid);
}

function storeTask(uuid, title, timestamp, details) {
    let item = {
        "uuid": uuid,
        "title": title,
        "timestamp": timestamp,
        "details": details
    };
    data.push(item);
    localStorage.setItem("periodically-data", JSON.stringify(data));
}

function updateTasks() {
    feed.innerHTML = "";
    data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
    for (let i = 0; i < data.length; i++) {
        addTask(data[i].uuid, data[i].title, timeToString(data[i].timestamp), data[i].details);
    }
}

function updateStatus() {
    let amount = data.length;
    if (amount == 1) {
        status.textContent = `${amount} task remaining`;
    }
    else {
        status.textContent = `${amount} tasks remaining`;
    }
}

function updatePastDue() {
    let current = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (current > data[i].timestamp) {
            document.getElementById(data[i].uuid).querySelector("p").className = "warning";
        }
    }
}

// Converts unix timestamp into string
function timeToString(timestamp) {
    let date = new Date(timestamp);
    if (timestamp) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes().toString().padStart(2, "0");
        let period;
        if (hours > 12) {
            hours %= 12;
            period = "PM";
        }
        else {
            period = "AM";
        }
        return `${month}/${day}/${year} ${hours}:${minutes} ${period}`;
    }
    else {
        return "Invalid timestamp";
    }
}

// Converts date into ISO format for use in datetime-local input
function timeToISO(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Returns 11:59 PM in ISO format
function endOfToday() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}T23:59`;
}

function truncateString(string, length) {
    if (string.length > length) {
        return string.substring(0, length) + "...";
    }
    else {
        return string
    }
}

// Makes all hyperlinks in an element clickable
function replaceHyperlinks(element) {
    if (element.innerHTML) {
        let regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/g;
        // Non matches
        let p1 = element.innerHTML.replaceAll("&amp;", "&").split(regex);
        // Matched URLs
        let p2 = element.innerHTML.replaceAll("&amp;", "&").match(regex);

        element.innerHTML = "";
        for (let i = 0; i < p1.length; i++) {
            element.innerHTML += p1[i];
            if (i < p1.length - 1) {
                element.innerHTML += `<a href="${p2[i]}">${p2[i]}</a>`;
            }
        }
    }
}

// Migrate "data" to "periodically-data"
document.getElementById("migrate").addEventListener("click", () => {
    let old = localStorage.getItem("data");
    if (old) {
        if (confirm("Old data was found, would you like to migrate? (Current data will be overwritten) 🤔")) {
            alert("Migrated! The page will be refreshed 🎉");
            localStorage.setItem("periodically-data", old);
            window.location.reload();
        }
    }
    else {
        alert("Unable to find old data 😭");
    }
});

// Hide "NEW" tag on buttons after first click
let seenButtons = JSON.parse(localStorage.getItem("periodically-seen-buttons") || "[]");
document.querySelectorAll("button[data-new]").forEach(button => {
    let id = button.getAttribute("data-new");
    if (seenButtons.includes(id)) {
        button.removeAttribute("data-new");
    }
    button.addEventListener("click", () => {
        button.removeAttribute("data-new");
        seenButtons.push(id);
        localStorage.setItem("periodically-seen-buttons", JSON.stringify(seenButtons));
    });
});

// Converts tasks into a string which can be shared elsewhere
function exportData() {
    let result = [];
    data.forEach((task, i) => {
        let string = `${i + 1}. ${task.title.trim()} (${timeToString(task.timestamp)})`;
        task.details.split("\n").forEach(line => {
            if (line) {
                string += `\n\t${line.trim()}`;
            }
        });
        result.push(string);
    });
    return result.join("\n\n");
}

document.querySelector("[data-open=export]").addEventListener("click", () => {
    document.getElementById("data-string").value = exportData();
});

document.getElementById("copy-data-string").addEventListener("click", () => {
    navigator.clipboard.writeText(exportData());
});