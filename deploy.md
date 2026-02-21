# PocketAPP — DigitalOcean VPS Deployment Guide

> Next.js 16 + PostgreSQL + PM2 on Ubuntu — served on port **3201**

---

## Prerequisites (already on your VPS)

- Node.js (v18+)
- PM2 (`npm i -g pm2`)
- PostgreSQL with user `postgres` / password `aman`
- Git

---

## 1. Push Your Code to a Git Repo

On your **local machine**, make sure everything is committed and pushed:

```bash
git init
git add -A
git commit -m "initial commit"
git remote add origin git@github.com:YOUR_USER/PocketAPP.git
git push -u origin main
```

> Make sure `.env`, `.env.local`, and `node_modules/` are in `.gitignore`.

---

## 2. SSH into Your VPS

```bash
ssh root@YOUR_DROPLET_IP
```

---

## 3. Clone the Project

```bash
cd /var/www
git clone git@github.com:YOUR_USER/PocketAPP.git pocketapp
cd pocketapp
```

---

## 4. Set Up PostgreSQL

```bash
# Switch to postgres system user
sudo -u postgres psql
```

Inside the `psql` shell:

```sql
-- Set the password (if not already set)
ALTER USER postgres WITH PASSWORD 'aman';

-- Create the database
CREATE DATABASE pocketapk;

-- Connect to it
\c pocketapk

-- Exit psql
\q
```

Now load the schema:

```bash
sudo -u postgres psql -d pocketapk -f /var/www/pocketapp/schema.sql
```

---

## 5. Create the `.env` File

```bash
nano /var/www/pocketapp/.env
```

Paste:

```env
DATABASE_URL=postgres://postgres:aman@localhost:5432/pocketapk
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=aman
DB_NAME=pocketapk
PORT=3201
```

Save and exit (`Ctrl+X`, `Y`, `Enter`).

---

## 6. Install Dependencies & Build

```bash
cd /var/www/pocketapp
npm install
npm run build
```

---

## 7. Copy Static App Assets

If you have scraped app icons/screenshots locally in `public/apps/`, you need them on the server too. From your **local machine**:

```bash
scp -r ./public/apps root@YOUR_DROPLET_IP:/var/www/pocketapp/public/
```

Or you can re-run the seed script on the server after deployment:

```bash
npm run seed
```

---

## 8. Start with PM2

```bash
PORT=3201 pm2 start npm --name "pocketapp" -- start
```

Verify it's running:

```bash
pm2 status
pm2 logs pocketapp
```

Your site is now live at `http://YOUR_DROPLET_IP:3201`

### Save PM2 process list (survives reboot)

```bash
pm2 save
pm2 startup
```

Run the command that `pm2 startup` prints (it sets up the systemd service).

---

## 9. (Optional) Nginx Reverse Proxy

If you want to serve on port 80/443 with a domain name:

```bash
sudo apt install nginx -y
```

Create a config:

```bash
sudo nano /etc/nginx/sites-available/pocketapp
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3201;
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
sudo ln -s /etc/nginx/sites-available/pocketapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Add free SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 10. (Optional) Set Up UFW Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # if using nginx
sudo ufw allow 3201            # if accessing directly without nginx
sudo ufw enable
```

---

## Common PM2 Commands

| Command | Description |
|---|---|
| `pm2 status` | Check running processes |
| `pm2 logs pocketapp` | View app logs |
| `pm2 restart pocketapp` | Restart the app |
| `pm2 stop pocketapp` | Stop the app |
| `pm2 delete pocketapp` | Remove from PM2 |

---

## Redeployment (after code changes)

```bash
cd /var/www/pocketapp
git pull origin main
npm install
npm run build
pm2 restart pocketapp
```

---

## Troubleshooting

**App won't start?**
```bash
pm2 logs pocketapp --lines 50
```

**Database connection refused?**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if the user/password works
psql -U postgres -h localhost -d pocketapk
```

**Port 3201 not accessible?**
```bash
# Check if the app is listening
ss -tlnp | grep 3201

# Check firewall
sudo ufw status
```

**Build fails with memory error?**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=1024" npm run build
```
