# 🦌 Reinsdyrregistreringsprosjekt

Dette er en MVP for reinsdyrregistrering, laget med **EJS, TailwindCSS og Express.js**.

## 📌 Funksjonalitet
- [x] Registrere reinsdyr og eiere
- [x] Søke etter reinsdyr via et søkefelt
- [x] Brukerautentisering (JWT)
- [x] Kartvisning av områder

## 🚀 Teknologi
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** EJS, TailwindCSS
- **Autentisering:** JWT, bcrypt
- **Hosting:** Lokalt på skoleVM

## 📂 Installasjon og kjøring

### 1️⃣ Klon repoet
```sh
 git clone https://github.com/ItIsYeDog/reinsdyrregistrering.git
 cd reinsdyrregistrering
```

### 2️⃣ Installer avhengigheter
```sh
npm install
```

### 3️⃣ Sett opp miljøvariabler
Lag en `.env`-fil i rotmappen og fyll inn:
```env
MONGO_URI="mongodb://localhost:27017/reinsdyrDB"
JWT_SECRET="dinhemmeligejwtkey"
PORT=3000
```

### 4️⃣ Seed databasen (valgfritt)
```sh
node scripts/seedFlokk.js
```

### 5️⃣ Start serveren
**Med nodemon (for utvikling):**
```sh
npm run dev
```

**Med PM2 (for produksjon):**
```sh
pm run start
```

## 🔗 Prosjektstyring
- [GitHub Projects](https://github.com/users/ItIsYeDog/projects/4)


## 📬 Kontakt
Har du spørsmål eller forbedringsforslag? Opprett en issue eller send en pull request!

