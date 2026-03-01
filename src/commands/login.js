import { Command } from "commander";
import { createServer } from "http";
import open from "open";
import { saveSession, getSession } from "../lib/auth.js";
import { WEBSITE_URL } from "../lib/config.js";

const CALLBACK_PORT = 51432;

function waitForCallback() {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const cors = {
        "Access-Control-Allow-Origin": WEBSITE_URL,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      };

      if (req.method === "OPTIONS") {
        res.writeHead(204, cors);
        res.end();
        return;
      }

      if (req.method === "POST" && req.url === "/callback") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            res.writeHead(200, { "Content-Type": "application/json", ...cors });
            res.end(JSON.stringify({ ok: true }));
            res.on("finish", () => server.close());
            resolve(payload);
          } catch {
            res.writeHead(400, cors);
            res.end();
            reject(new Error("Invalid callback payload from website"));
          }
        });
        return;
      }

      res.writeHead(404);
      res.end();
    });

    server.listen(CALLBACK_PORT, "127.0.0.1", async () => {
      const authUrl = `${WEBSITE_URL}/cli-auth?port=${CALLBACK_PORT}`;
      console.log("Opening browser to authenticate...");
      console.log(`If the browser doesn't open, visit:\n${authUrl}\n`);
      await open(authUrl);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        reject(
          new Error(
            `Port ${CALLBACK_PORT} is already in use. ` +
              `Close the other process and try again.`,
          ),
        );
      } else {
        reject(err);
      }
    });
  });
}

export async function runLogin() {
  const existing = getSession();
  if (existing?.token && existing?.name) {
    console.log(`Already logged in as ${existing.name} (${existing.email}).`);
    console.log('Run "mobilescreen logout" first to switch accounts.');
    return;
  }

  const { token, email, name } = await waitForCallback();

  if (!token) {
    console.error("Authentication failed: no token received.");
    process.exit(1);
  }

  saveSession({ token, name, email });
  console.log(`\nLogged in as ${name} (${email})`);
}

export const loginCommand = new Command("login")
  .description("Authenticate with MobileScreen")
  .action(async () => {
    try {
      await runLogin();
    } catch (error) {
      console.error("Login failed:", error.message);
      process.exit(1);
    }
  });
