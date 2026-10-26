# Deployment Guide: Putting Study Library on the Internet

Written for the owner of this project, who is deploying it for the first time. Related reading: [OPERATIONS.md](OPERATIONS.md) (architecture), [AUTH_SETUP.md](AUTH_SETUP.md) (accounts and login).

## 1. Short answers

| Question | Answer |
| --- | --- |
| Do I need a WAR file? | **No.** A WAR file is a Java/Tomcat format. This app is Node.js (Express server + a React build made with Webpack). You deploy it by running `pnpm build` and then `pnpm serve`. There is nothing to convert. |
| Can I use my E: drive as the server? | **Yes.** Set `STUDY_CONTENT_DIR` to a folder on E: and the app serves your documents, images and media from it. |
| Can I reach it from anywhere in the world? | **Yes**, using a tunnel (recommended) or router port-forwarding (not recommended). |
| Can it cost nothing? | **Mostly.** Software and the tunnel are free. Your own electricity and internet are the cost. A custom domain (about 10 USD/year) is the only optional purchase. Free `*.trycloudflare.com` or `*.ts.net` addresses work without one. |
| Do I need to install certificates (HTTPS)? | **No**, if you use Cloudflare Tunnel or Tailscale Funnel. They provide HTTPS certificates automatically. You only need certificates if you expose the PC directly, which this guide advises against. |
| Do I need Amazon / cloud subscriptions? | **No.** Cloud hosting is optional. See section 3 for why a free cloud host is a poor fit for this particular app. |

## 2. Important facts about this app that decide the hosting choice

1. **Runtime:** Node 22.13 or newer (the built-in SQLite module needs a command-line flag on 22.5 to 22.12; Node 24 LTS is a safe choice), and pnpm. Production start command is `pnpm serve` (see `scripts/serve.mjs`), default port 4444.
2. **Accounts use a local SQLite file** (`data/study-library.sqlite`). `.env.example` says production accounts require a *durable, single-instance* disk, and that ephemeral hosting is unsupported for identities.
3. **Free cloud hosts (Render free, etc.) have ephemeral disks.** Every redeploy, restart or idle spin-down wipes local files, which would delete user accounts **and every saved Markdown file** (they live in the same SQLite file). That is why the existing `render.yaml` uses Supabase for books, but accounts and saved Markdown would still be lost unless you switch to owner-password mode (which has no personal accounts and so no saved Markdown) or add a Postgres identity adapter (not built yet; see OPERATIONS.md). Render's own documentation confirms that free web services have no persistent disk and spin down after 15 minutes without traffic; only paid services can attach a disk.
4. **Your books and videos are large.** Free cloud tiers give roughly 1 GB (Supabase free storage) or none. Your E: drive has terabytes.

**Conclusion:** hosting on your own PC with the E: drive is the best fit for this app, and it is free.

### 2a. Which computer should host it? (your PC, a new PC, or the cloud)

There is no "cloud AI" service you need. Hosting only means a computer that is always on, runs `pnpm serve`, and is reachable from the internet. Your three real choices:

| Choice | When it makes sense |
| --- | --- |
| **Your current PC (start here)** | You leave it on anyway and want it free. The app is light (a Node process and a SQLite file; a small group of users needs a few hundred MB of memory and almost no CPU), so you do not need to build or buy a new PC. |
| **A dedicated small PC later** | When other people depend on it every day, or you want to reboot, game or experiment on your own PC without taking the site down. A low-power mini PC is plenty. [OPERATIONS.md](OPERATIONS.md) section 4 describes that route. |
| **A cloud server (VPS)** | You do not want to depend on home power and internet. Typically a few US dollars a month for a small Linux server with its own disk; check current prices. Anything that resets its disk (free tiers) will lose accounts and saved files. |

Things to fix on a PC that "never shuts down", because those are what actually take a home server offline:

- **Windows Update restarts.** Set Active hours, and run the app as a Windows service (Step 5) so it starts by itself after a reboot, even before anyone logs in.
- **Sleep and hibernate.** Set both to Never (Settings, System, Power).
- **Power cuts.** A small UPS is optional but worthwhile if the PC is a desktop.
- **Keeping the app and your personal use apart.** The tunnel exposes only this one app, not your files, but bind the server to `127.0.0.1` (Step 3) so nothing else on your network can reach it directly.
- **Backups.** An SSD is not a backup (see "Using the 2 TB SSD" below).

### 2b. Using the extra 2 TB SSD

Put everything that must survive on it, then point the app at those folders. Example if the SSD is drive `D:` (use your own letter):

```text
D:\study-library\content                   STUDY_CONTENT_DIR   notes, PDFs, ebooks, images
D:\study-library\media                     WATCH_MEDIA_DIR     video and audio (create this folder first)
D:\study-library\data\study-library.sqlite PERSONAL_DB_PATH    accounts AND every user's saved Markdown files
D:\study-library\backups                   output of pnpm db:backup
```

The SQLite file is the one thing you cannot recreate: it holds every account and every saved Markdown file. Back it up with:

```powershell
pnpm db:backup D:\study-library\backups
```

This takes a consistent copy even while the server is running (it was tested against a live and a stopped database). Schedule it daily with Windows Task Scheduler (action `pnpm.cmd`, arguments `db:backup D:\study-library\backups`, start in the project folder). A copy on the same SSD protects you from deletion and corruption but not from the drive dying, so also copy the backups folder and your content to another disk or cloud storage now and then. Test a restore occasionally by opening a backup file with a copy of the app (`PERSONAL_DB_PATH` pointing at it).

## 3. Options compared

| Option | Cost | Your E: drive used? | Accounts safe? | Best for |
| --- | --- | --- | --- | --- |
| **A. Own PC + Cloudflare Tunnel** (recommended) | Free (domain optional) | Yes | Yes (disk is durable) | Public site for everyone |
| **B. Own PC + Tailscale Funnel** | Free | Yes | Yes | Public site without buying a domain; simplest |
| **C. Own PC + Tailscale (private only)** | Free | Yes | Yes | Just you and family; not public |
| **D. Render free + Supabase** | Free | No (1 GB limit) | **No** (no disk, and it sleeps after 15 idle minutes) | Demo with owner-password mode only. A paid Render service with a persistent disk would keep accounts, but then a small VPS is usually simpler. |
| **E. Oracle Cloud "Always Free" VM** | Free tier, card needed to sign up | No (cloud disk) | Yes | 24/7 hosting without leaving your PC on. Reports in 2026 say Oracle reduced the free Ampere allowance (from 4 CPUs and 24 GB to 2 CPUs and 12 GB); confirm the current limits on Oracle's site before relying on it. |
| **F. Router port-forwarding** | Free | Yes | Yes | Not recommended: exposes your home network, needs manual certificates, breaks with changing IP or CGNAT |
| **G. Small paid VPS** (any provider) | A few USD per month | No (its own disk) | Yes | Always on, fixed address, no home network involved. Install Node, clone the repo, run as a service behind Caddy or Cloudflare Tunnel. |

Limits of hosting from home: the app is only up while the PC is on and online, your upload speed is the download speed for visitors, and some ISPs (CGNAT) block inbound connections. Tunnels (A, B) work even behind CGNAT because the PC connects outward.

Limits of the free tunnels: Cloudflare's published policy prohibits streaming video through its network on non-video plans, and it is unclear whether that covers tunnel traffic, so do not serve large video publicly through a free Cloudflare Tunnel without checking their current terms (study notes, PDFs and the Markdown editor are fine). Tailscale Funnel only listens on ports 443, 8443 and 10000 and has fixed bandwidth limits you cannot change. For video, keep Watch private (Option C) or use a server whose provider allows it.

## 4. Step by step: Option A (Cloudflare Tunnel on your Windows PC)

### Step 1: Install prerequisites
```powershell
winget install OpenJS.NodeJS      # must be v22.5 or newer
corepack enable
corepack prepare pnpm@11.28.3 --activate
```

### Step 2: Prepare the folders on the big drive
Create the folders from section 2b (on the 2 TB SSD, or `E:` if you prefer), for example `D:\study-library\content`, `D:\study-library\media`, `D:\study-library\data` and `D:\study-library\backups`. Put your documents, books and images in `content`, in the same layout as the repo's `study-content/` folder, and video and audio in `media`.

### Step 3: Create the production `.env`
In the project root, copy `.env.example` to `.env` and set at least:
```ini
NODE_ENV=production
PORT=4444
STUDY_SERVER_HOST=127.0.0.1
STORAGE_MODE=filesystem
STUDY_CONTENT_DIR=D:/study-library/content
WATCH_MEDIA_DIR=D:/study-library/media
WATCH_ALLOWED_DRIVE=D
PERSONAL_DB_PATH=D:/study-library/data/study-library.sqlite
MAX_UPLOAD_BYTES=104857600

AUTH_MODE=accounts
AUTH_PUBLIC_ORIGIN=https://library.yourdomain.com
AUTH_SESSION_SECRET=<64+ random characters, see below>
AUTH_SIGNUP_ENABLED=false
AUTH_TRUST_PROXY=127.0.0.1
AUTH_ALLOW_PERSISTENT_SQLITE=true
```
Write Windows paths with forward slashes as above (or without quotes). Inside double quotes, `\n` in a path such as `"D:\new"` is read as a line break.
Generate the secret with:
```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Keep `.env` out of git (it is already covered by `.gitignore`). Set `AUTH_SIGNUP_ENABLED=true` only while you create the accounts you need, then turn it off again. If you also want login via Google or Microsoft, follow AUTH_SETUP.md.

What was verified for these settings (with the real `pnpm serve` on a spare port and a script that sends the `X-Forwarded-Proto: https` header a tunnel sends; no real tunnel was available in this session): the server loads `.env` from the project root by itself (real environment variables take priority), so no system environment variables are needed. `AUTH_TRUST_PROXY=127.0.0.1` is the right value for a tunnel running on the same PC: the tunnel connects from the PC itself and tells the app the visitor used HTTPS. Without it, production mode refuses every request with `426` because it cannot tell the connection is HTTPS. `STUDY_SERVER_HOST=127.0.0.1` makes the app reachable only from this PC (through the tunnel), not from your Wi-Fi.

### Step 4: Build and test locally
```powershell
cd "E:\New repos for portfolio\Study-entertain-library"
pnpm install --frozen-lockfile
pnpm build
pnpm serve
```
Open http://localhost:4444/api/health: it should answer `{"ok":true,...}`. Because production mode insists on HTTPS, the home page itself only works through the tunnel in Step 6 (a plain `http://localhost:4444/` page answers `426`). To try the full app locally before going public, run `pnpm dev:local` instead (development mode, plain HTTP).

Note: `pnpm build` previously produced a bundle that crashed with "jsxDEV is not a function" unless the `NODE_ENV=production` environment variable happened to be set. That is fixed in `webpack.config.mjs`, and `pnpm test:build` now fails if it ever returns.

### Step 5: Run it automatically (survive reboots)
Pick one. Both were not run in this session, so test a reboot yourself:
- **Task Scheduler:** Create a task, trigger "At startup", action `pnpm.cmd` with argument `serve`, start-in set to the project folder, "Run whether user is logged on or not", and on the Settings tab "If the task fails, restart every 1 minute".
- **NSSM** (a free service wrapper), in an Administrator PowerShell:
  ```powershell
  nssm install StudyLibrary "C:\Program Files\nodejs\node.exe" "scripts\serve.mjs"
  nssm set StudyLibrary AppDirectory "E:\New repos for portfolio\Study-entertain-library"
  nssm set StudyLibrary Start SERVICE_AUTO_START
  nssm start StudyLibrary
  ```
  NSSM restarts the app if it exits.

Also: set the Windows power plan to never sleep. Check after the next Windows Update restart that the site came back on its own.

### Step 6: Make it public with Cloudflare Tunnel
1. Create a free Cloudflare account.
2. **With a domain** (about 10 USD/year from any registrar, added to Cloudflare): in Zero Trust, go to Networks, Tunnels, create a tunnel, install the Windows connector (`cloudflared`) as a service using the command Cloudflare shows you, then add a public hostname `library.yourdomain.com` pointing to `http://localhost:4444`.
3. **Without a domain:** `cloudflared tunnel --url http://localhost:4444` gives a random `https://xxxx.trycloudflare.com` address. It is free but the address changes each time and is meant for testing, not permanent use.
4. Set `AUTH_PUBLIC_ORIGIN` in `.env` to the final `https://` address, then restart the app.

HTTPS is handled by Cloudflare. You install no certificates, and you open no router ports.

### Step 7: Verify from outside
Open the public URL on your phone using mobile data (not your home Wi-Fi), then check each of these:

1. The sign-in page loads over HTTPS and shows **Continue as guest**.
2. As a guest, the Features tab loads and the Markdown preview tab renders what you type. Try Scroll sync, the dark/light toggle and dragging the divider.
3. Temporarily set `AUTH_SIGNUP_ENABLED=true`, restart, create your account, then set it back to `false` and restart.
4. Open **Markdown**, type something, press Save, rename the file and save again.
5. Sign out and sign in again: your files are listed.
6. Restart the app (or reboot the PC): sign in and confirm the files are still there.
7. Open a PDF, an image and, if you use it, a video.

## 5. Option B: Tailscale Funnel (no domain, simplest)
1. Install Tailscale (free personal plan) on the PC and sign in.
2. In the Tailscale admin console, enable HTTPS and Funnel for your tailnet.
3. Run: `tailscale funnel 4444`
4. You get a public address like `https://your-pc.your-tailnet.ts.net`. Set it as `AUTH_PUBLIC_ORIGIN`.

For private-only access (Option C), use `tailscale serve` instead of `funnel`, or just install Tailscale on your phone and open `http://your-pc:4444`.

The app must be told the visitor used HTTPS, which a proxy does with the `X-Forwarded-Proto` header. This was verified for that header in general but not with a real Tailscale Funnel. If every page answers `426` through Funnel, Funnel is not sending it; use Cloudflare Tunnel instead. Funnel only listens on ports 443, 8443 and 10000 and has fixed bandwidth limits.

## 6. Options E and G: Always-on cloud server (if you do not want your PC running 24/7)
1. Create the VM (Ubuntu), install Node 22.13+ (or 24 LTS), pnpm, git.
2. `git clone` the repo, create `.env`, run `pnpm install --frozen-lockfile && pnpm build`.
3. Run with `pm2` or a systemd service, and put Cloudflare Tunnel or Caddy in front for HTTPS.
4. Your large media will not fit on a free disk, so upload only what fits, or keep media on your home server.

## 7. Security checklist before sharing the link

- [ ] `AUTH_SESSION_SECRET` is long and random, and `.env` is not committed to git.
- [ ] `AUTH_SIGNUP_ENABLED=false` unless you want strangers to register.
- [ ] Only the tunnel is exposed; no router port-forwarding, no RDP or SSH exposed.
- [ ] Windows Update is on, and Windows Defender is active.
- [ ] Run `pnpm db:backup` daily (it saves accounts and every user's saved Markdown files), and copy the backups and your content folder to a second disk or cloud storage regularly. A backup you have never restored is only an assumption (see OPERATIONS.md section 9).
- [ ] `STUDY_SERVER_HOST=127.0.0.1`, so the app is reachable only through the tunnel.
- [ ] **Copyright:** only publish books, movies and documents you have the right to share. Making copyrighted movies available to the public can get your tunnel account or ISP service suspended and may be illegal. For personal use, keep it private (Option C) or behind login with signup disabled.
- [ ] Cloudflare's policy prohibits streaming video on non-video plans and it is unclear whether tunnels are covered; check the current terms before serving video publicly. Tailscale Funnel has fixed bandwidth limits.
- [ ] Tell users that saved Markdown files are stored on your server in plain text (the database is not encrypted), and that you can read them if you open the database.

## 8. Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Site works on localhost, not from outside | Tunnel not running, or it points at the wrong port. Use `http://localhost:4444`. |
| Login works then logs out immediately | `AUTH_PUBLIC_ORIGIN` does not exactly match the public `https://` URL, or `AUTH_TRUST_PROXY` is wrong. |
| Site is down after a reboot | App and `cloudflared` are not registered as services (Step 5, Step 6). |
| Large uploads fail | Raise `MAX_UPLOAD_BYTES`; Cloudflare's free plan also caps request body size at 100 MB. |
| Server fails to start with an auth error | `AUTH_ALLOW_PERSISTENT_SQLITE` or `AUTH_SESSION_SECRET` is missing in production mode. |
| Videos stutter | Home upload speed is the limit. Check your plan's upload Mbps. |
| Every page answers `426` / "Use the configured HTTPS library address" | The request reached the app without the HTTPS signal. Open the public `https://` address, not `http://localhost:4444`, and check `AUTH_TRUST_PROXY=127.0.0.1` and that the tunnel runs on the same PC. |
| Watch shows an error or empty list, and `/api/media` returns 500 | The `WATCH_MEDIA_DIR` folder does not exist. Create it. |
| Saving a Markdown file says "Verify your email" | Email sending is configured (`RESEND_API_KEY`) and the account is not verified yet. Verify it from the email link, or leave email unconfigured for a private server. |
| Saved Markdown files or accounts vanished after a restart or redeploy | The SQLite file was on a disk that resets (free cloud tier, or a container without a volume). Move `PERSONAL_DB_PATH` to a persistent disk and restore from a `pnpm db:backup` copy. |
| Saving says "already have a file with that name" | File names are unique per account, ignoring upper and lower case. Pick another name. |

## 9. Recommended path

1. Run it on your PC with `pnpm serve` and test on localhost (Step 4).
2. Share with yourself over Tailscale (Option C) to test from your phone.
3. When ready for others, switch to Cloudflare Tunnel with a domain (Option A) or Tailscale Funnel (Option B).
4. Add the Windows service, backups and the security checklist before sharing the link widely.

## 10. Sources checked for this guide

These were consulted on 2026-10-22. Terms and limits change, so confirm them before you depend on them.

- [Render: Deploy for Free](https://render.com/docs/free) and [Render: Persistent Disks](https://render.com/docs/disks) (free web services spin down after 15 minutes, have an ephemeral filesystem, and cannot attach a disk).
- [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) (ports 443, 8443 and 10000; non-configurable bandwidth limits).
- [Cloudflare: Delivering videos with Cloudflare](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/delivering-videos-with-cloudflare/index.md) (video streaming policy; this page does not settle whether it applies to Tunnel traffic).
- [InfoQ on Oracle Cloud free tier limits](https://infoq.com/news/2026/07/oracle-cloud-free-tier-limits/) and community reports of a reduced Always Free Ampere allowance (secondary sources; confirm on Oracle's site).
