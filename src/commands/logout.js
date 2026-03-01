import { Command } from "commander";
import { clearToken, getSession } from "../lib/auth.js";

export const logoutCommand = new Command("logout")
  .description("Log out and remove stored credentials")
  .action(() => {
    const session = getSession();
    if (!session?.token) {
      console.log("You are not logged in.");
      return;
    }
    clearToken();
    console.log(`Logged out ${session.name} (${session.email}).`);
  });
