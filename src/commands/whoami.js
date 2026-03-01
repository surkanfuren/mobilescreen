import { Command } from "commander";
import { apiFetch } from "../lib/api.js";

export const whoamiCommand = new Command("whoami")
  .description("Show the currently logged-in user")
  .action(async () => {
    const res = await apiFetch("me");

    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(`Failed to fetch user info (${res.status}): ${body}`);
      process.exit(1);
    }

    const user = await res.json();
    console.log(`${user.name} (${user.email})`);
  });
