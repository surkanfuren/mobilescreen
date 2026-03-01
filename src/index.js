#!/usr/bin/env node

import { Command } from "commander";
import { loginCommand } from "./commands/login.js";
import { logoutCommand } from "./commands/logout.js";
import { whoamiCommand } from "./commands/whoami.js";
import { initCommand } from "./commands/init.js";

const program = new Command();

program.name("mobilescreen").description("MobileScreen CLI").version("0.1.0");

// Register subcommands
program.addCommand(initCommand);
program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(whoamiCommand);

// Parse the argv. This is what triggers the command matching.
program.parse(process.argv);
