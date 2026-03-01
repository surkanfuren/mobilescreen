const dev = process.env.MOBILESCREEN_ENV === "dev";

export const WEBSITE_URL = dev
  ? "http://localhost:5173"
  : "https://mobilescreen.co";

export const API_URL = dev
  ? "http://127.0.0.1:5001/screen-app-c52f7/us-central1"
  : "https://us-central1-screen-app-c52f7.cloudfunctions.net";
