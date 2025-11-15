# Nova Transformations

**Eine transformative App für persönliche Heilung und Selbsterkenntnis.**

Nova Transformations führt Nutzer durch einen 9-stufigen Prozess der Selbstreflexion und Transformation. Die App kombiniert bewährte psychologische Methoden mit KI-gestützter Analyse, um tiefgreifende Erkenntnisse und nachhaltige Veränderungen zu ermöglichen.

---

## 🚀 Schnellstart mit Docker (Empfohlene Methode)

**Die einfachste und schnellste Art, die Nova-App zu starten!**

Mit Docker läuft die komplette App (Frontend + Backend + Datenbank) mit einem einzigen Befehl. Keine manuelle Installation von Node.js, MySQL oder anderen Abhängigkeiten nötig!

### Voraussetzungen

- **Docker** und **Docker Compose** installiert ([Download hier](https://www.docker.com/get-started))
- Das war's! 🎉

### 3 Schritte zum Start

#### 1️⃣ **Umgebungsvariablen konfigurieren**

Kopiere die Beispiel-Datei und passe sie an:

```bash
cp .env.docker.example .env
```

Öffne `.env` und ändere mindestens diese Werte:

```env
# WICHTIG: Ändere diese Werte für Produktion!
JWT_SECRET=dein-super-geheimes-jwt-secret-hier-eingeben
DB_ROOT_PASSWORD=dein-sicheres-root-passwort
DB_PASSWORD=dein-sicheres-db-passwort
```

**Tipp:** Generiere ein sicheres JWT-Secret:
```bash
openssl rand -base64 32
```

#### 2️⃣ **App starten**

Führe diesen Befehl aus:

```bash
docker-compose up --build
```

Docker wird automatisch:
- ✅ Die Datenbank (MySQL) starten
- ✅ Die App bauen und starten
- ✅ Adminer (Datenbank-UI) starten

#### 3️⃣ **App öffnen**

Warte, bis du diese Nachricht siehst:
```
app  | Server running on http://localhost:3000/
```

Dann öffne:
- **App**: [http://localhost:3000](http://localhost:3000)
- **Datenbank-UI (Adminer)**: [http://localhost:8080](http://localhost:8080)

### 🛠️ Weitere Docker-Befehle

```bash
# App im Hintergrund starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# App stoppen
docker-compose down

# App stoppen + Datenbank löschen (Neustart)
docker-compose down -v

# Nur die App neu bauen
docker-compose up --build app
```

### 📊 Adminer (Datenbank-UI)

Zugriff auf die Datenbank über Adminer:

1. Öffne [http://localhost:8080](http://localhost:8080)
2. Login-Daten:
   - **System**: MySQL
   - **Server**: `db`
   - **Username**: `nova_user` (oder dein `DB_USER` aus `.env`)
   - **Password**: `nova_password` (oder dein `DB_PASSWORD` aus `.env`)
   - **Database**: `nova_transformations` (oder dein `DB_NAME` aus `.env`)

---

## 💻 Alternative: Manuelle Installation (ohne Docker)

Wenn du Docker nicht nutzen möchtest, kannst du die App auch manuell installieren:

## 🌟 Kernfunktionen

- **9-Stufen-Transformationsprozess**: Strukturierte Reise von Gedanken über Gefühle bis zur Neuerschaffung des Selbst
- **KI-gestützte Analyse**: Personalisierte Erkenntnisse und Spiegelung durch Nova AI
- **Schattenarbeit**: Tiefenpsychologische Integration unterdrückter Aspekte
- **PDF-Protokolle**: Automatisch generierte Erkenntnisse und Manifestations-Dokumente
- **Themenbasierte Beispiele**: 8 Lebensthemen (Beziehungen, Karriere, Gesundheit, etc.)
- **Audio-Heilung**: KI-generierte Heilungsmeditationen

---

## 🏗️ Architektur-Übersicht

### **Frontend (Client)**
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: tRPC React Query
- **Routing**: Wouter (lightweight React router)

### **Backend (Server)**
- **Framework**: Express 4 + Node.js
- **API**: tRPC 11 (End-to-End Type Safety)
- **Authentication**: Manus OAuth
- **Database ORM**: Drizzle ORM

### **Datenbank**
- **Type**: MySQL/TiDB (via Drizzle ORM)
- **Schema**: `drizzle/schema.ts`
- **Migrations**: Automatisch via `pnpm db:push`

### **Externe Services**
- **AI**: OpenAI GPT-4 (Analyse, Spiegelung, Audio-Generierung)
- **Storage**: S3-kompatibel (PDF-Speicherung, Audio-Dateien)
- **Auth**: Manus OAuth (SSO)

---

## 📁 Projektstruktur

```
transformations-app/
├── client/                 # Frontend (React)
│   ├── src/
│   │   ├── pages/         # Seiten-Komponenten (Smart Components)
│   │   ├── components/    # Wiederverwendbare UI-Komponenten
│   │   │   ├── ui/       # shadcn/ui Komponenten
│   │   │   └── transformation/  # Step-Komponenten (NEW!)
│   │   ├── hooks/         # Custom React Hooks
│   │   ├── contexts/      # React Contexts (Theme, etc.)
│   │   ├── lib/           # Utils, Constants & Types (NEW!)
│   │   │   ├── constants.ts
│   │   │   ├── types.ts   # Single Source of Truth für Types
│   │   │   ├── transformationExamples.ts
│   │   │   └── ...
│   │   └── _core/         # Core Framework Code
│   └── public/            # Statische Assets
├── server/                # Backend (Express + tRPC)
│   ├── routers.ts         # tRPC API Routen
│   ├── db.ts              # Datenbank-Helpers
│   └── _core/             # Core Framework Code
├── drizzle/               # Datenbank-Schema & Migrationen
│   └── schema.ts
├── shared/                # Gemeinsame Types (Frontend + Backend)
├── storage/               # S3-Helpers
└── package.json           # Dependencies & Scripts
```

---

## 🚀 Lokale Entwicklung

### **Voraussetzungen**

- Node.js 22.x
- pnpm (Package Manager) - empfohlen, oder npm
- MySQL/TiDB Datenbank
- OpenAI API Key

### **Automatisches Setup (Empfohlen) ⚡**

Das Projekt enthält ein automatisiertes Setup-Skript, das alle Schritte für Sie ausführt:

```bash
# 1. Projekt entpacken und in Verzeichnis wechseln
cd transformations-app

# 2. Setup-Skript ausführen
bash setup.sh
```

**Das Skript führt automatisch aus:**
- ✅ Installation aller Dependencies (`pnpm install`)
- ✅ Erstellung der `.env`-Datei aus Vorlage
- ✅ Synchronisation des Datenbank-Schemas (`pnpm db:push`)

**Nach dem Setup:**
1. Füllen Sie die `.env`-Datei mit Ihren Secrets aus
2. Starten Sie den Dev-Server: `pnpm dev`
3. Öffnen Sie `http://localhost:3000`

---

### **Manuelle Installation**

Falls Sie das Setup manuell durchführen möchten:

1. **Repository klonen / ZIP entpacken**
   ```bash
   cd transformations-app
   ```

2. **Dependencies installieren**
   ```bash
   pnpm install
   ```

3. **Environment Variables einrichten**

   Erstelle eine `.env` Datei im Root-Verzeichnis:

   ```env
   # Datenbank
   DATABASE_URL="mysql://user:password@host:port/database"

   # OpenAI
   OPENAI_API_KEY="sk-..."

   # Manus OAuth (wenn vorhanden)
   JWT_SECRET="your-secret"
   OAUTH_SERVER_URL="https://api.manus.im"
   VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"
   VITE_APP_ID="your-app-id"

   # S3 Storage (optional)
   S3_ENDPOINT="..."
   S3_ACCESS_KEY="..."
   S3_SECRET_KEY="..."
   S3_BUCKET="..."
   ```

4. **Datenbank-Schema pushen**
   ```bash
   pnpm db:push
   ```

5. **Development Server starten**
   ```bash
   pnpm dev
   ```

   Die App läuft auf: `http://localhost:3000`

---

## 📦 Deployment

### **Replit**

1. ZIP hochladen und entpacken
2. Secrets in Replit Secrets Panel hinzufügen
3. `pnpm install`
4. `pnpm dev`

### **Vercel / Netlify**

1. Repository verbinden
2. Build Command: `pnpm build`
3. Output Directory: `dist`
4. Environment Variables hinzufügen

### **Railway / Heroku**

1. Repository verbinden
2. Start Command: `pnpm start`
3. Environment Variables hinzufügen

---

## 🛠️ Wichtige Scripts

```bash
# Development
pnpm dev              # Start dev server (Frontend + Backend)

# Database
pnpm db:push          # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio (DB GUI)

# Build
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm typecheck        # TypeScript type checking
pnpm lint             # ESLint
```

---

## 🎨 Design-System

### **Farbpalette**

- **Primary**: `#183847` (Dunkelblau) → `#2C5F6F` (Hellblau)
- **Accent**: `#A6805B` (Gold)
- **Text**: `#FFFFFF` (Weiß)

### **Komponenten-Bibliothek**

- **shadcn/ui**: Moderne, accessible UI-Komponenten
- **Custom Components**: 
  - `StepContainer` - Gradient Background
  - `StepCard` - Glassmorphism Card
  - `StepHeader` - Progress Indicator

---

## 📚 Code-Dokumentation

Alle Schlüsselkomponenten und Hooks sind mit JSDoc-Kommentaren dokumentiert:

- **Komponenten**: `@purpose`, `@props`, `@returns`, `@example`
- **Hooks**: Ausführliche Beschreibung von State, Logic und Return Values
- **Inline-Kommentare**: Erklärung komplexer Logik und "magischer Zahlen"

Beispiel:
```typescript
/**
 * Custom hook for managing PDF download workflow
 * 
 * @purpose Handles the entire PDF generation and download process:
 * 1. Starts a background job on the server
 * 2. Polls job status every 3 seconds
 * 3. Displays rotating loading messages
 * 4. Provides download function when ready
 * 
 * @param {number} sessionId - ID of the transformation session
 * @param {PDFType} type - Type of PDF to generate ('erkenntnis' | 'manifest')
 * 
 * @returns {Object} PDF download state and controls
 */
export function usePDFDownload(sessionId: number, type: PDFType) {
  // ...
}
```

---

## 🔐 Sicherheit

- **Authentication**: Manus OAuth (SSO)
- **Authorization**: Role-based (Admin/User)
- **API**: tRPC (Type-safe, keine REST-Endpoints)
- **Database**: Prepared Statements via Drizzle ORM
- **Secrets**: Niemals im Code, nur in Environment Variables

---

## 🤝 Beitragen

Dieses Projekt ist privat. Für Fragen oder Verbesserungsvorschläge:

**Kontakt**: Nova Transformations Team

---

## 📄 Lizenz

Proprietary - Alle Rechte vorbehalten

---

## 🙏 Danksagungen

- **Manus Platform**: Infrastruktur & OAuth
- **OpenAI**: KI-Analyse & Audio-Generierung
- **shadcn/ui**: UI-Komponenten
- **tRPC**: Type-safe API

---

**Built with ❤️ by Nova**

*Echte Transformation beginnt hier.*

