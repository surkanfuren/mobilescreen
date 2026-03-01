import { Command } from "commander";
import { select } from "@inquirer/prompts";
import { mkdirSync } from "fs";
import { join } from "path";
import { getSession } from "../lib/auth.js";
import { apiFetch } from "../lib/api.js";
import { runLogin } from "./login.js";

const C = "\x1b[36m"; // cyan
const B = "\x1b[1m";  // bold
const R = "\x1b[0m";  // reset

const BANNER = `
${C}  ##      ##    ######    ########    ######  ##        ########
  ####  ####  ##      ##  ##    ##      ##    ##        ##
  ##  ##  ##  ##      ##  ########    ##      ##        ######
  ##      ##  ##      ##  ##    ##      ##    ##        ##
  ##      ##    ######    ########    ######  ########  ########

    ########    ########  ########    ########  ########  ##      ##
    ##          ##          ##    ##    ##        ##        ####    ##
      ######    ##          ########    ######    ######    ##  ##  ##
            ##  ##          ##  ##      ##        ##        ##    ####
    ########      ########  ##    ##    ########  ########  ##      ##${R}`;

export const initCommand = new Command("init")
  .description("Initialize MobileScreen in the current project")
  .action(async () => {
    try {
      await run();
    } catch (error) {
      if (error.name === "ExitPromptError") {
        process.exit(0);
      }
      console.error(error.message);
      process.exit(1);
    }
  });

async function run() {
    console.log(BANNER);
    console.log(
      "You're about to initialize a MobileScreen project in this directory:\n",
    );
    console.log(`${B}  ${process.cwd()}${R}\n`);

    if (!getSession()?.token) {
      try {
        await runLogin();
      } catch (error) {
        console.error("Login failed:", error.message);
        process.exit(1);
      }
    }

    const res = await apiFetch("projects");

    if (!res.ok) {
      const body = await res.text().catch(() => "(no body)");
      console.error(`Failed to fetch projects (${res.status}): ${body}`);
      process.exit(1);
    }

    const projectList = await res.json();

    if (projectList.length === 0) {
      console.error(
        "No projects found. Create a project at mobilescreen.co first.",
      );
      process.exit(1);
    }

    const projectId = await select({
      message: "Select a project:",
      choices: projectList.map((p) => ({
        name: `${p.name}  \x1b[3m\x1b[2m${p.appStoreConnect?.bundleId ?? ""}\x1b[0m`,
        value: p.id,
      })),
    });

    const selected = projectList.find((p) => p.id === projectId);

    const dirs = [
      join("screenshots", "ios", "iPhone"),
      join("screenshots", "ios", "iPad"),
      join("screenshots", "android", "phone"),
      join("screenshots", "android", "tablet"),
    ];

    for (const dir of dirs) {
      mkdirSync(dir, { recursive: true });
    }

    console.log(
      `\nInitialized with project: ${selected.name} (${selected.appStoreConnect?.bundleId})`,
    );
}
