import containerQueries from "@tailwindcss/container-queries";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [typography, containerQueries, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "base-100": "#ffffff",
          "base-200": "#ebebeb",
          "base-300": "#d3d3d3",
          "base-content": "#000000",
        },
        dark: {
          "base-100": "#141414",
          "base-200": "#1d1d1d",
          "base-300": "#262626",
          "base-content": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
