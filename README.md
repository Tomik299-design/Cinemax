# CineMax 🎬

Moderní full-stack streamovací platforma postavená na Next.js 15, TypeScript, Tailwind CSS, Prisma a PostgreSQL. Tmavé UI s glassmorphism efekty, neon akcenty a plynulými animacemi.

## ✨ Funkce

**Veřejná část**
- Hero banner s rotujícími doporučenými filmy
- Horizontální carousely (Continue Watching, Latest, Top Rated)
- Vyhledávání v reálném čase + filtry (žánr, rok, hodnocení)
- Detail filmu s přehrávačem (YouTube trailer / vlastní video URL)
- Oblíbené filmy, sledování rozkoukaného
- Uživatelské účty (email + heslo přes NextAuth)
- Plně responzivní (mobil/tablet/desktop)
- Infinite scroll na stránce s filmy

**Admin panel (`/admin`)**
- Chráněno middlewarem — pouze role `ADMIN`
- Vyhledání filmu na TMDb a automatické načtení metadat (plakát, popis, žánry, rok, hodnocení)
- Ruční úprava všech polí, přidání YouTube traileru a vlastní video URL
- Správa kategorií/žánrů
- Přehled statistik (návštěvnost, top filmy, žánry)
- Log admin akcí (audit log)

## 🧱 Tech stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS** — dark theme (#0B0F19) + red akcent (#FF3040)
- **Framer Motion** — animace
- **Prisma + PostgreSQL**
- **NextAuth v5** — credentials provider (email/heslo)
- **TMDb API** — metadata filmů
- **react-player** — YouTube trailery / video stream
- **Cloudinary** (volitelné) — upload vlastních obrázků

## 🚀 Instalace

### 1. Závislosti

```bash
npm install
```

### 2. Databáze (PostgreSQL)

Spusť si lokální Postgres (nebo použij Supabase / Neon / Railway) a zkopíruj `.env.example` do `.env`:

```bash
cp .env.example .env
```

Vyplň `DATABASE_URL`, např.:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/cinemax"
```

### 3. TMDb API klíč

1. Zaregistruj se na [themoviedb.org](https://www.themoviedb.org/signup)
2. V nastavení účtu → API → vyžádej API klíč (Developer)
3. Zkopíruj **API Read Access Token** do `.env`:

```
TMDB_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiJ9..."
```

### 4. NextAuth secret

```bash
openssl rand -base64 32
```

Vlož výstup do `NEXTAUTH_SECRET` v `.env`.

### 5. Migrace databáze a seed

Lokálně pro rychlý vývoj (bez historie migrací):
```bash
npm run db:push
npm run db:seed
```

Pro produkční flow s historií migrací (doporučeno, viz sekce Nasazení níže):
```bash
npx prisma migrate dev --name init
npm run db:seed
```

**Vytvořené přístupy po seedu:**
| Role  | Email                | Heslo     |
|-------|-----------------------|-----------|
| Admin | admin@cinemax.com     | admin123  |
| User  | demo@cinemax.com      | user123   |

⚠️ **Po nasazení do produkce hesla změň!**

### 6. Spuštění

```bash
npm run dev
```

Otevři [http://localhost:3000](http://localhost:3000) — veřejná část.
Otevři [http://localhost:3000/admin](http://localhost:3000/admin) — admin panel (přihlas se jako admin).

## 📁 Struktura projektu

```
cinemax/
├── prisma/
│   ├── schema.prisma       # databázové modely (User, Movie, Genre, Favorite, WatchHistory, AdminLog)
│   └── seed.ts             # ukázková data
├── src/
│   ├── app/
│   │   ├── page.tsx                 # homepage
│   │   ├── movies/[id]/page.tsx     # detail filmu
│   │   ├── movies/page.tsx          # browse + filtry + infinite scroll
│   │   ├── search/page.tsx          # vyhledávání
│   │   ├── favorites/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── login/page.tsx
│   │   ├── admin/                   # admin panel (chráněno middlewarem)
│   │   │   ├── page.tsx             # dashboard
│   │   │   ├── movies/              # CRUD filmů
│   │   │   ├── categories/          # správa žánrů
│   │   │   ├── logs/                # audit log
│   │   │   └── stats/               # statistiky
│   │   └── api/                     # API routes (movies, favorites, watch-history, tmdb, admin, genres, auth)
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   ├── movies/                  # MovieCard, MovieCarousel, HeroBanner, MoviePlayer, MovieGrid
│   │   ├── admin/                   # AddMovieForm, AdminCategoriesClient
│   │   └── ui/                      # SearchBar, GenreFilter
│   ├── lib/                         # prisma, auth, tmdb, admin-log
│   ├── types/                       # TypeScript typy
│   └── middleware.ts                # ochrana /admin, /profile, /favorites
```

## 🔒 Bezpečnost

- Hesla hashována pomocí `bcryptjs`
- `/admin/*` chráněno middlewarem — vyžaduje session s `role === "ADMIN"`
- Všechny admin API routy znovu validují roli na serveru (defense in depth)
- Filmy se přidávají výhradně přes TMDb metadata + legální YouTube/video URL — žádné nelegální zdroje

## 🎨 Design tokeny

| Token | Hodnota |
|---|---|
| Background | `#0B0F19` |
| Accent | `#FF3040` |
| Card radius | `24px` |
| Glass efekt | `backdrop-blur(20px)` + `rgba(17,24,39,0.7)` |

## 🚀 Nasazení na Render + Supabase

Tento postup odpovídá stacku, který používáš u StoryForge / NexusChat: **Render Web Service** (Node server) + **Supabase Postgres**.

### 1. Supabase — vytvoř projekt a získej connection strings

1. [supabase.com](https://supabase.com) → New Project → vyber region (nejlépe Frankfurt, blízko Render Frankfurt regionu)
2. Settings → Database → **Connection string**:
   - **Connection pooling** (port `6543`, `pgbouncer=true`) → tohle je tvoje `DATABASE_URL`
   - **Direct connection** (port `5432`) → tohle je tvoje `DIRECT_URL` (potřebné pro migrace)
3. Heslo si zkopíruj při vytváření projektu (Supabase ho ukáže jen jednou)

> **Proč dvě URL?** Render web service běží jako dlouho žijící proces a otevírá víc DB spojení najednou. Supabase má limit na přímá spojení, proto appka běží přes pooler (6543), ale Prisma migrace potřebují přímé spojení (5432) — to řeší `directUrl` v `schema.prisma`.

### 2. GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TVUJ_ucet/cinemax.git
git push -u origin main
```

### 3. Render — Web Service

**Možnost A — přes `render.yaml` (Blueprint, doporučeno):**

1. Render Dashboard → **New** → **Blueprint**
2. Vyber svůj GitHub repo `cinemax` — Render najde `render.yaml` automaticky
3. Render vytvoří službu `cinemax`, ale `sync: false` proměnné musíš doplnit ručně (viz krok 4)

**Možnost B — manuálně:**

1. Render Dashboard → **New** → **Web Service**
2. Připoj GitHub repo
3. Nastav:
   - **Region**: Frankfurt (stejně jako Supabase, kvůli latenci)
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   - **Start Command**: `npm run start`
   - **Node version**: 20

### 4. Environment Variables na Render

V Render Dashboardu → tvoje služba → **Environment** → doplň:

| Klíč | Hodnota |
|---|---|
| `DATABASE_URL` | Supabase pooling string (port 6543) |
| `DIRECT_URL` | Supabase direct string (port 5432) |
| `NEXTAUTH_URL` | `https://cinemax.onrender.com` (přesná URL tvé Render služby) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` (nebo necháš Render vygenerovat) |
| `TMDB_ACCESS_TOKEN` | tvůj TMDb Read Access Token |
| `YOUTUBE_API_KEY` | volitelné |
| `CLOUDINARY_*` | volitelné |

⚠️ `NEXTAUTH_URL` musí přesně odpovídat veřejné URL — jinak přihlášení nebude fungovat (redirect mismatch).

### 5. Deploy

Render automaticky spustí build (`prisma migrate deploy` vytvoří tabulky v Supabase) a po buildu appku nastartuje.

### 6. Seed dat (jednorázově)

Render Shell (záložka **Shell** u tvé služby) nebo lokálně s produkční `DATABASE_URL`/`DIRECT_URL` v `.env`:

```bash
npm run db:seed
```

Vytvoří admin účet (`admin@cinemax.com` / `admin123`) a ukázkové filmy. **Po seedu si v `/admin` heslo změň** (zatím nemáme self-service změnu hesla — buď přes Supabase Table Editor přímo v `users` tabulce, nebo si dopiš endpoint).

### 7. Další deploye

Při každém `git push` na `main` Render automaticky:
1. `npm install`
2. `prisma generate`
3. `prisma migrate deploy` — nasadí jen nové migrace (ty staré se nepřepisují)
4. `next build`
5. restart se `npm run start`

Pokud změníš `schema.prisma`, vygeneruj migraci **lokálně** (potřebuješ připojení k DB):

```bash
npx prisma migrate dev --name nazev_zmeny
git add prisma/migrations
git commit -m "Add migration: nazev_zmeny"
git push
```

Render při dalším deployi tu migraci automaticky nasadí přes `migrate deploy`.

### Render free tier — pozor na "cold start"

Pokud používáš Render free/starter plán, služba po ~15 minutách nečinnosti "usíná" a první request po probuzení trvá několik sekund navíc. Pro produkční nasazení doporučuju aspoň Starter plán s always-on.

## 📝 Licence

Tento projekt slouží jako šablona/ukázka. Při nasazení do produkce zajisti, že veškerý obsah (videa, trailery) pochází z legálních zdrojů a máš na něj odpovídající licenční oprávnění.
