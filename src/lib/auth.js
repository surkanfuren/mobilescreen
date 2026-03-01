import { homedir } from "os";
import { join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";

const CONFIG_DIR = join(homedir(), ".mobilescreen");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function saveSession({ token, name, email }) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify({ token, name, email }, null, 2));
}

export function getSession() {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token ?? null;
}

export function clearToken() {
  if (existsSync(CONFIG_FILE)) unlinkSync(CONFIG_FILE);
}
