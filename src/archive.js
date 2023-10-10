import * as time from "./time.js";
import * as ui from "./ui.js";

document.getElementById("archive").addEventListener("click", e => {
    ui.show(document.getElementById("archive-modal"), "Archive", [
        {
            text: "Close",
            close: true,
        },
    ]);
});