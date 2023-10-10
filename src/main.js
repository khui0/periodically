import "./reset.css";
import "./style.css";
import "./periodically.css";
import "remixicon/fonts/remixicon.css";

import { v4 as uuidv4 } from "uuid";
import pluralize from "pluralize";
import * as time from "./time.js";
import * as ui from "./ui.js";

const feed = document.getElementById("feed");

let data = JSON.parse(localStorage.getItem("periodically-data") || "[]");
document.body.className = localStorage.getItem("periodically-theme") || "";

updateTasks();
setInterval(updatePastDue, 100);

// Show create task modal
document.getElementById("create-input").addEventListener("keydown", e => {
    if (e.key != "Enter") {
        return;
    }
    // Transfer title to modal
    document.getElementById("title").value = e.target.value;
    e.target.value = "";
    // Set default date
    document.getElementById("date").value = time.endOfToday();
    // Show modal
    ui.show(document.getElementById("create-modal"), "Create", [
        {
            text: "Cancel",
            close: true,
        },
        {
            text: "Create",
            close: true,
            onclick: createTask,
        },
    ]);
});

// Create task on Ctrl + Enter
document.getElementById("title").addEventListener("keydown", e => {
    if (e.ctrlKey && e.key == "Enter") {
        createTask();
    }
});

// Create new task
function createTask() {
    const title = document.getElementById("title").value;
    const details = document.getElementById("details").value;
    const date = document.getElementById("date").value;
    if (title?.trim() && date?.trim()) {
        setTask(title, details, date);
        updateTasks();
        document.getElementById("create-modal").close();
    }
}

// Add task to data object
function setTask(title, details, timestamp, uuid) {
    const item = {
        "title": title.trim(),
        "details": details.trim(),
        "timestamp": timestamp || Date.now(),
        "uuid": uuid || uuidv4(),
    };
    // Remove item with same uuid
    const existing = data.findIndex(item => item.uuid == uuid);
    if (existing != -1) {
        data.splice(existing, 1);
    }
    // Add new item to data object
    data.push(item);
    localStorage.setItem("periodically-data", JSON.stringify(data));
    return item.uuid;
}

// Add task to DOM
function appendTask(uuid, title, date, details) {
    const task = document.createElement("div");
    task.setAttribute("data-uuid", uuid);
    task.innerHTML = `<h2>${title}</h2>
<p>${date}</p>
<p>${details}</p>
<div class="controls">
    <button class="icon" data-complete><i class="ri-check-fill"></i></button>
    <button class="icon" data-edit><i class="ri-pencil-fill"></i></button>
    <button class="icon" data-delete><i class="ri-delete-bin-6-fill"></i></button>
</div>`;
    feed.append(task);
    addEvents(task);
}

// Add events to task
function addEvents(element) {
    const uuid = element.getAttribute("data-uuid");
    let visible = false;
    element.addEventListener("mouseover", e => {
        element.classList.add("hover");
        visible = true;
    });
    element.addEventListener("mouseout", e => {
        element.classList.remove("hover");
        visible = false;
    });
    element.addEventListener("click", e => {
        if (!visible) {
            element.classList.add("hover");
            visible = true;
        }
        else {
            element.classList.remove("hover");
            visible = false;
        }
    });
    // Button click events
    const controls = element.querySelector("div.controls");
    controls.querySelector("[data-complete]").addEventListener("click", e => {
        // Remove task from DOM
        element.remove();
        // Remove item from data object
        data = data.filter(item => item.uuid != uuid);
        localStorage.setItem("periodically-data", JSON.stringify(data));
        updateStatus();
    });
    controls.querySelector("[data-edit]").addEventListener("click", e => {
        const task = data.find(item => item.uuid == uuid);
        console.log(task);
        document.getElementById("task").showModal();
        updateStatus();
    });
    controls.querySelector("[data-delete]").addEventListener("click", e => {
        // Remove task from DOM
        element.remove();
        // Remove item from data object
        data = data.filter(item => item.uuid != uuid);
        localStorage.setItem("periodically-data", JSON.stringify(data));
        updateStatus();
    });
}

// Update feed
function updateTasks() {
    feed.innerHTML = "";
    data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
    for (let i = 0; i < data.length; i++) {
        appendTask(data[i].uuid, data[i].title, time.timeToString(data[i].timestamp), data[i].details);
    }
}

// Update past due tasks
function updatePastDue() {
    let current = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (current > data[i].timestamp) {
            document.getElementById(data[i].uuid).querySelector("p").className = "warning";
        }
    }
}

// Detect links and replace them with anchor elements
function insertAnchors(element) {
    if (element.innerHTML) {
        let regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/g;
        let p1 = element.innerHTML.replaceAll("&amp;", "&").split(regex);
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