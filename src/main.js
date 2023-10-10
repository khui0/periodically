import "./reset.css";
import "./style.css";
import "./periodically.css";
import "remixicon/fonts/remixicon.css";

import { v4 as uuidv4 } from "uuid";
import pluralize from "pluralize";
import * as time from "./time.js";
import * as ui from "./ui.js";

let data = JSON.parse(localStorage.getItem("periodically-data") || "[]");
document.body.className = localStorage.getItem("periodically-theme") || "";

updateTasks();
setInterval(updatePastDue, 100);

// Keyboard shortcuts
document.addEventListener("keydown", e => {
    if (document.activeElement == document.body) {
        const input = document.getElementById("create-input");
        const modifiers = e.ctrlKey || e.altKey;
        const allowed = [
            "Enter",
            "Backspace",
        ];
        if (!modifiers && e.key && e.key.length === 1 || allowed.includes(e.key)) {
            input.focus();
        }
    }
    else if (document.getElementById("create-modal").hasAttribute("open")) {
        if (e.ctrlKey && e.key == "Enter") {
            createTask();
        }
    }
});

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

// Create new task
function createTask() {
    const title = document.getElementById("title").value;
    const details = document.getElementById("details").value;
    const date = document.getElementById("date").value;
    if (title?.trim() && date?.trim()) {
        const uuid = setTask(title, details, date);
        const index = data.findIndex(item => item.uuid == uuid);
        const element = appendTask(index, uuid, title, time.timeToString(date), details);
        fadeIn(element);
        updateStatus();
        document.getElementById("create-modal").close();
        document.getElementById("create-input").blur();
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
    // Sort data by date
    data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
    localStorage.setItem("periodically-data", JSON.stringify(data));
    return item.uuid;
}

// Add task to DOM
function appendTask(index, uuid, title, date, details) {
    const feed = document.getElementById("feed");
    const task = document.createElement("div");
    task.setAttribute("data-uuid", uuid);
    task.innerHTML = `<h2>${title}</h2>
<p>${date}</p>
<p>${details && insertAnchors(details)}</p>
<div class="controls">
    <button class="icon" data-complete><i class="ri-check-fill"></i></button>
    <button class="icon" data-edit><i class="ri-pencil-fill"></i></button>
    <button class="icon" data-delete><i class="ri-delete-bin-6-fill"></i></button>
</div>`;
    feed.insertBefore(task, feed.childNodes[index]);
    addEvents(task);
    return task;
}

// Add events to task
function addEvents(element) {
    const uuid = element.getAttribute("data-uuid");
    // Hover events
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
        fadeOut(element, () => { element.remove() });
        // Remove item from data object
        data = data.filter(item => item.uuid != uuid);
        localStorage.setItem("periodically-data", JSON.stringify(data));
        updateStatus();
    });
    controls.querySelector("[data-edit]").addEventListener("click", e => {
        const task = data.find(item => item.uuid == uuid);
        const index = data.findIndex(item => item.uuid == uuid);
        appendTask(index, task.uuid, "REPLACED", "2023-10-10", "test");
        element.remove();
        updateStatus();
    });
    controls.querySelector("[data-delete]").addEventListener("click", e => {
        // Remove task from DOM
        fadeOut(element, () => { element.remove() });
        // Remove item from data object
        data = data.filter(item => item.uuid != uuid);
        localStorage.setItem("periodically-data", JSON.stringify(data));
        updateStatus();
    });
}

// Fade element in
function fadeIn(element, callback) {
    const duration = 100;
    element.animate([
        { opacity: 0 },
        { opacity: 1 },
    ], {
        duration,
        fill: "forwards",
    });
    callback && setTimeout(callback, duration);
}

// Fade element out
function fadeOut(element, callback) {
    const duration = 100;
    element.animate([
        { opacity: 1 },
        { opacity: 0 },
    ], {
        duration,
        fill: "forwards",
    });
    callback && setTimeout(callback, duration);
}

// Update tasks
function updateTasks() {
    for (let i = 0; i < data.length; i++) {
        appendTask(i, data[i].uuid, data[i].title, time.timeToString(data[i].timestamp), data[i].details);
    }
    updateStatus();
}

// Update status to show remaining tasks
function updateStatus() {
    const status = document.getElementById("status");
    status.textContent = `${pluralize("task", data.length, true)} remaining`;
}

// Update past due tasks
function updatePastDue() {
    const current = Date.now();
    for (let i = 0; i < data.length; i++) {
        if (current > data[i].timestamp) {
            document.querySelector(`[data-uuid="${data[i].uuid}"]`).className = "warning";
        }
    }
}

// Replace links with anchor elements
function insertAnchors(html) {
    const regex = /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\+.~#?&//=]*/g;
    const p1 = html.replaceAll("&amp;", "&").split(regex);
    const p2 = html.replaceAll("&amp;", "&").match(regex);
    html = "";
    for (let i = 0; i < p1.length; i++) {
        html += p1[i];
        if (i < p1.length - 1) {
            html += `<a href="${p2[i]}">${p2[i]}</a>`;
        }
    }
    return html;
}