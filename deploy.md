# Puno AppStore — DigitalOcean VPS Deployment Guide

> Next.js 16 + PostgreSQL + PM2 on Ubuntu 24.10 — `dream-insights` droplet

---

## Server Details

| Property | Value |
|----------|-------|
| **OS** | Ubuntu 24.10 (GNU/Linux 6.11.0-29-generic x86_64) |
| **Hostname** | dream-insights |
| **IP** | 159.89.166.23 |
| **Disk** | 47.35 GB (44% used) |
| **PostgreSQL** | 16.11 |
| **Deploy path** | `~/var/www/puno-appstore` |

---

## Prerequisites

- Node.js 18+ and npm
- PM2 (`npm i -g pm2`)
- PostgreSQL 16 with user `postgres`
- Git

### Install Node.js (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v && npm -v
```

---

## 1. SSH into the Server

```bash
ssh root@159.89.166.23
```

---

## 2. Clone the Repository

```bash
cd ~/var/www
git clone https://github.com/AMAN-JEET-SINGH/puno-appstore.git
cd puno-appstore
```

To pull latest changes:

```bash
cd ~/var/www/puno-appstore
git pull origin main
```

---

## 3. Set Up PostgreSQL

```bash
sudo -u postgres psql
```

Inside the `psql` shell:

```sql
-- Create the database
CREATE DATABASE pocketapk;

-- Connect to it
\c pocketapk

-- Exit psql
\q
```

> **Important:** The database name is `pocketapk`, NOT `puno-appstore`. Using `\c puno-appstore` will fail.

Load the schema:

```bash
sudo -u postgres psql -d pocketapk -f ~/var/www/puno-appstore/schema.sql
```

This creates two tables:
- `apps` — stores app metadata (name, developer, category, rating, etc.)
- `screenshots` — stores screenshot filenames linked to apps

### Set postgres password (if needed)

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'aman';"
```

---

## 4. Create the `.env` File

```bash
nano ~/var/www/puno-appstore/.env
```

Paste:

```env
DATABASE_URL=postgres://postgres:aman@localhost:5432/pocketapk
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=aman
DB_NAME=pocketapk
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

Also create `.env.local`:

```bash
nano ~/var/www/puno-appstore/.env.local
```

```env
DATABASE_URL=postgres://postgres:aman@localhost:5432/pocketapk
```

---

## 5. Install Dependencies

```bash
cd ~/var/www/puno-appstore
npm install
```

---

## 6. Seed the Database

Scrapes top apps/games from Google Play and populates the database. Takes ~30-45 minutes.

```bash
npm run seed
```

This fetches 30 apps from each of 49 categories (apps + games) and:
- Downloads icons and screenshots to `public/apps/<appId>/`
- Inserts app metadata into the `apps` table
- Inserts screenshot references into the `screenshots` table

---

## 7. Build the Next.js App

```bash
npm run build
```

If build fails with memory error:

```bash
NODE_OPTIONS="--max-old-space-size=1024" npm run build
```

---

## 8. Start with PM2

```bash
npm install -g pm2
PORT=3333 pm2 start npm --name "puno-appstore" -- start
```

Verify it's running:

```bash
pm2 status
pm2 logs puno-appstore
```

The app is now live at `http://159.89.166.23:3333`

### Persist across reboots

```bash
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints (it sets up the systemd service).

---

## 9. Nginx Reverse Proxy for `applications.techatt.com`

Route the subdomain to the Next.js app running on port 3333.

```bash
apt install -y nginx
```

**Disable the default site** (important — it will intercept requests otherwise):

```bash
rm /etc/nginx/sites-enabled/default
```

Create the config:

```bash
nano /etc/nginx/sites-available/puno-appstore
```

Paste:

```nginx
server {
    listen 80;
    server_name applications.techatt.com;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
ln -sf /etc/nginx/sites-available/puno-appstore /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

The app will be accessible at `http://applications.techatt.com`.

### Add SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d applications.techatt.com
```

---

## 10. (Optional) UFW Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'   # if using nginx
ufw allow 3333            # if accessing directly without nginx
ufw enable
```

---

## Common PM2 Commands

| Command | Description |
|---------|-------------|
| `pm2 status` | Check running processes |
| `pm2 logs puno-appstore` | View app logs |
| `pm2 restart puno-appstore` | Restart the app |
| `pm2 stop puno-appstore` | Stop the app |
| `pm2 delete puno-appstore` | Remove from PM2 |

---

## Redeployment (Quick Update)

```bash
cd ~/var/www/puno-appstore
git pull origin main
npm install
npm run build
pm2 restart puno-appstore
```

---

## Copy Static Assets (Alternative to Seeding on Server)

If you already seeded locally and have `public/apps/` with icons/screenshots, you can upload them instead:

```bash
# From your local machine
scp -r ./public/apps root@159.89.166.23:~/var/www/puno-appstore/public/
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `database "puno-appstore" does not exist` | The database name is `pocketapk`. Use `\c pocketapk` in psql. |
| Port 3333 not accessible | Check: `ss -tlnp \| grep 3333` and `ufw status` |
| PostgreSQL connection refused | `systemctl status postgresql` |
| Seed script fails | Verify `.env` has correct DB credentials and tables exist |
| Build fails | Ensure Node.js 18+: `node -v` |
| PM2 app won't start | `pm2 logs puno-appstore --lines 50` |
| Swap usage high (17%) | Consider adding swap: `fallocate -l 2G /swapfile` |
