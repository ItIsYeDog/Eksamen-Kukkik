# 🦌 Reinsdyrregistreringsprosjekt

Dette er en MVP for reinsdyrregistrering, laget med **EJS, TailwindCSS og Express.js**.

## 📌 Funksjonalitet
- [x] Registrere reinsdyr og eiere
- [x] Søke etter reinsdyr via et søkefelt
- [x] Brukerautentisering (JWT)
- [x] Kartvisning av områder

## 🚀 Teknologi
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: EJS, TailwindCSS
- **Autentisering**: JWT, bcrypt
- **Hosting**: Lokalt på skole-VM

## 📂 Oppsett
### 1️⃣ Installer nødvendige pakker
```sh
sudo apt update && sudo apt install nginx curl -y
```

### 2️⃣ Installer Node.js med FNM (Fast Node Manager)
```sh
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install --lts
fnm use
```

### 3️⃣ Installer PM2 for prosesshåndtering
```sh
npm install -g pm2
```

### 4️⃣ Klon prosjektet og gi riktige tillatelser
```sh
git clone https://github.com/ItIsYeDog/Eksamen-Kukkik.git
sudo chown -R $USER:$USER Eksamen-Kukkik
cd Eksamen-Kukkik
```

### 5️⃣ Installer avhengigheter
```sh
npm install
```

### 6️⃣ Opprett en `.env`-fil
Opprett en `.env`-fil i prosjektets rotmappe med riktig MongoDB-tilkobling og JWT-secret:
```sh
touch .env
nano .env
```
Fyll inn:
```
MONGO_URI=(Din MongoDB link)
JWT_SECRET=(Din Secret Nøkkel)
PORT=(Din Port)
```
Lagre filen (CTRL + X, Y, ENTER).

### 7️⃣ Konfigurer brannmur
```sh
sudo ufw allow 22/tcp  # SSH
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow out to (MongoDB IP) port 27017  # MongoDB
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
```

### 8️⃣ Start Node-serveren med PM2
```sh
pm2 start app.js
pm2 save
pm2 startup
```

### 9️⃣ Sett opp Nginx som reverse proxy
```sh
sudo nano /etc/nginx/sites-available/default
```
Legg til følgende konfigurasjon:
```
server {
    listen 80;
    server_name (Domenet du vil treffe);

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

Lagre og test konfigurasjonen:
```sh
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 🔍 Debugging
Se status for brannmur:
```sh
sudo ufw status verbose
```
Se PM2-prosesser:
```sh
pm2 list
```
Se server-logger:
```sh
pm2 logs
```

---
🚀 **Nå er prosjektet oppe og kjører!** 🦌

