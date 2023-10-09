import webfontDownload from "vite-plugin-webfont-dl";

export default {
    base: "/periodically/",
    plugins: [
        webfontDownload(),
    ],
};