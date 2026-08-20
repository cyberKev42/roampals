# RoamPals

A gamified walking app for iOS and Android: your real-world steps are counted
on-device, and hitting step thresholds spawns creatures and items you collect.

Steps are not read from HealthKit or Google Fit — they are derived from raw
accelerometer data by a custom step-detection algorithm, so the same logic runs
identically on both platforms.

## Stack

**Mobile app** — React Native 0.81 · React 19 · Expo 54 · Expo Router ·
TypeScript · Zustand · NativeWind · Reanimated 4 · react-native-svg · D3

**Backend** — Java 17 · Spring Boot 4.1 · Spring Security + JWT (jjwt) ·
Spring Data JPA · PostgreSQL (H2 for tests) · Docker Compose

```
frontend/   Expo app (file-based routing under src/app)
backend/    Spring Boot API
docker-compose.yml   PostgreSQL for local development
```

## Step detection

`frontend/src/hooks/use-accelerometer-steps.ts` samples the accelerometer at
50 Hz and runs each sample through:

1. **Low-pass filter** (`ALPHA = 0.98`) maintains a slow-moving gravity
   baseline, so the algorithm survives the phone changing orientation.
2. **Peak detection** against that baseline, with a `0.4` magnitude threshold
   to separate walking from incidental jitter.
3. **Cooldown** of 450 ms between counted steps, above the ~300 ms floor for a
   human stride, which rejects double-counting on a single impact.
4. **Warm-up** of 500 ms after start, discarding the settling period when the
   baseline is still converging.

Counts are buffered to `AsyncStorage` so steps survive an app restart, and a
`last_closed_timestamp` lets the app award spawns earned while it was closed.

## Setup

Requires Node 20+, JDK 17, and Docker.

### 1. Environment

```bash
cp .env.example .env                    # backend + database
cp frontend/.env.example frontend/.env  # mobile app
```

Fill in both files:

- `JWT_TOKEN_SECRET` — **required**, the backend will refuse to start without
  it. Generate one with `openssl rand -hex 64`.
- `EXPO_PUBLIC_OPENWEATHER_API_KEY` — free key from
  [openweathermap.org/api](https://openweathermap.org/api), used for the
  weather badge on the walk screen.

### 2. Database

```bash
docker compose up -d   # PostgreSQL on localhost:5439
```

### 3. Backend

`docker compose` reads the root `.env` automatically, but Spring Boot does not,
so export the secret when running the API directly:

```bash
cd backend
export $(grep -v '^#' ../.env | xargs)
./mvnw spring-boot:run   # http://localhost:8090
```

### 4. App

```bash
cd frontend
npm install
npx expo start
```

Step counting needs real accelerometer hardware — use a physical device via
Expo Go or a development build, not a simulator.

## Notes on secrets

`EXPO_PUBLIC_*` variables are inlined into the JavaScript bundle at build time.
Keeping the OpenWeather key in `.env` keeps it out of version control, but it is
still extractable from a shipped build; a key that must stay private belongs
behind a backend proxy route.
