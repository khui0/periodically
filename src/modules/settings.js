const PREFIX = "periodically-";

document.querySelectorAll("[data-sync]").forEach(input => {
    const setting = PREFIX + input.getAttribute("data-sync");
    const stored = localStorage.getItem(setting);
    input.addEventListener("input", () => {
        const event = new Event("settingchange");
        localStorage.setItem(setting, input.value);
        document.dispatchEvent(event);
    });
    if (stored) {
        input.value = stored;
    }
});