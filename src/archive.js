import * as time from "./time.js";
import * as ui from "./ui.js";

document.getElementById("archive").addEventListener("click", e => {
    updateArchive();
    ui.show(document.getElementById("archive-modal"), "Archive", [
        {
            text: "Close",
            close: true,
        },
    ]);
});

function updateArchive() {
    const list = document.getElementById("archive-list");
    list.innerHTML = "";
    const archive = JSON.parse(localStorage.getItem("periodically-archive")) || [];
    for (let i = 0; i < archive.length; i++) {
        const item = archive[i];
        appendArchive(item.uuid, item.title, time.timeToString(item.timestamp), item.details);
    }
}

function appendArchive(uuid, title, date, details) {
    const list = document.getElementById("archive-list");
    const task = document.createElement("div");
    task.setAttribute("data-uuid", uuid);
    task.innerHTML = `<h2>${title}</h2>
<p>${date}</p>
<p>${details}</p>
<div class="controls">
    <button class="icon" data-restore><i class="ri-arrow-go-back-fill"></i></button>
    <button class="icon" data-delete><i class="ri-delete-bin-6-fill"></i></button>
</div>`;
    list.append(task);
    addEvents(task);
    return task;
}

function addEvents(element) {
    ui.addHover(element);
    const uuid = element.getAttribute("data-uuid");
    // Button click events
    const controls = element.querySelector("div.controls");
    // Restore task
    controls.querySelector("[data-restore]").addEventListener("click", e => {
        let data = JSON.parse(localStorage.getItem("periodically-data")) || [];
        let archive = JSON.parse(localStorage.getItem("periodically-archive")) || [];
        const index = archive.findIndex(item => item.uuid == uuid);
        const task = archive[index];
        // Add item to data array
        
        data.push(task);
        data.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
        localStorage.setItem("periodically-data", JSON.stringify(data));
        // Remove item from archive array
        archive.splice(index, 1);
        localStorage.setItem("periodically-archive", JSON.stringify(archive));
        // Close modal
        document.getElementById("archive-modal").close();
    });
    // Delete task
    controls.querySelector("[data-delete]").addEventListener("click", e => {
        // Remove task from DOM
        ui.fadeOut(element, 100, () => { element.remove() });
        // Remove item from archive array
    });
}