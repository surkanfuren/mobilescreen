# MobileScreen CLI

Command-line tool for [MobileScreen](https://mobilescreen.co) — generate App Store and Play Store screenshots from your raw device screenshots.

## Requirements

- **Node.js** 18 or later

## Installation

```bash
npm install -g @mobilescreen/cli
```

Or run with `npx` without installing:

```bash
npx @mobilescreen/cli <command>
```

## Commands

### `mobilescreen login`

Authenticate with your MobileScreen account. Opens your browser to sign in; the CLI stores your session locally.

```bash
mobilescreen login
```

- If you're already logged in, you'll be told to run `logout` first to switch accounts.
- Credentials are stored in `~/.mobilescreen/config.json`.

---

### `mobilescreen logout`

Clear your stored credentials and sign out.

```bash
mobilescreen logout
```

---

### `mobilescreen whoami`

Print the currently logged-in user (name and email).

```bash
mobilescreen whoami
```

---

### `mobilescreen init`

Set up MobileScreen in the current directory. Use this inside your app project.

1. **Login** — If you're not logged in, you'll be prompted to run the login flow.
2. **Project** — You'll choose one of your MobileScreen projects (created at [mobilescreen.co](https://mobilescreen.co)).
3. **Folders** — The CLI creates this structure for your raw screenshots:

   ```
   screenshots/
   ├── ios/
   │   ├── iPhone/
   │   └── iPad/
   └── android/
       ├── phone/
       └── tablet/
   ```

```bash
mobilescreen init
```

Place your raw screenshots in the right device folders, then use the MobileScreen web app to generate and upload to App Store Connect / Google Play.

## Typical workflow

1. **Sign in**

   ```bash
   mobilescreen login
   ```

2. **Create a project** at [mobilescreen.co](https://mobilescreen.co) if you don’t have one.

3. **Initialize** in your app repo

   ```bash
   cd /path/to/your-app
   mobilescreen init
   ```

4. **Add screenshots** into `screenshots/ios/` and `screenshots/android/` as needed.

5. **Generate & upload** via the MobileScreen dashboard.

## License

MIT
