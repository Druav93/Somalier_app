# Pour — AI Sommelier & Bartender

An AI-powered pairing app that identifies dishes and bottles via photo and recommends wine, whiskey, and cocktails. Built with Expo (React Native), Supabase, and OpenAI gpt-4o.

## Setup

### 1. Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo`
- EAS CLI: `npm install -g eas-cli`
- Supabase account
- OpenAI API key

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | OpenAI API key (used in Supabase Edge Function only) |

### 4. Supabase Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users extended profile
create table public.taste_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  sweetness int2 default 3 check (sweetness between 1 and 5),
  body int2 default 3 check (body between 1 and 5),
  acidity int2 default 3 check (acidity between 1 and 5),
  smokiness int2 default 2 check (smokiness between 1 and 5),
  preferred_categories text[] default '{wine,cocktail}',
  created_at timestamptz default now()
);

-- Pairings (AI results)
create table public.pairings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  image_url text,
  dish_description text not null,
  occasion text,
  category text not null check (category in ('wine', 'whiskey', 'cocktail')),
  pairings jsonb not null default '[]',
  is_favorite boolean default false,
  user_rating int2 check (user_rating between 1 and 5),
  user_notes text,
  created_at timestamptz default now()
);

-- Bar inventory
create table public.bar_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  producer text,
  category text not null check (category in ('wine', 'whiskey', 'cocktail')),
  image_url text,
  created_at timestamptz default now()
);

-- Favorites (for quick lookups)
create table public.favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  pairing_id uuid references public.pairings not null,
  created_at timestamptz default now(),
  unique(user_id, pairing_id)
);

-- RLS Policies
alter table public.taste_profiles enable row level security;
alter table public.pairings enable row level security;
alter table public.bar_items enable row level security;
alter table public.favorites enable row level security;

create policy "Users manage own taste profile"
  on public.taste_profiles for all using (auth.uid() = user_id);

create policy "Users manage own pairings"
  on public.pairings for all using (auth.uid() = user_id);

create policy "Users manage own bar"
  on public.bar_items for all using (auth.uid() = user_id);

create policy "Users manage own favorites"
  on public.favorites for all using (auth.uid() = user_id);

-- Storage bucket for pairing images
insert into storage.buckets (id, name, public) values ('pairings', 'pairings', true);

create policy "Authenticated users upload pairing images"
  on storage.objects for insert with check (
    bucket_id = 'pairings' and auth.role() = 'authenticated'
  );

create policy "Public read pairing images"
  on storage.objects for select using (bucket_id = 'pairings');
```

### 5. Supabase Edge Function (OpenAI proxy)

Deploy the edge function to protect your OpenAI API key:

```bash
supabase functions deploy pair --no-verify-jwt
supabase secrets set OPENAI_API_KEY=sk-...
```

### 6. Run

```bash
# Start Expo dev server
npx expo start

# Android (with device/emulator connected)
npx expo start --android

# iOS
npx expo start --ios
```

### 7. Build for Play Store

```bash
# Development APK (for testing)
eas build --profile development --platform android

# Production AAB (for Play Store)
eas build --profile production --platform android
```

## Project Structure

```
app/
  _layout.tsx          # Root layout (fonts, providers)
  index.tsx            # Entry redirect (onboarding vs home)
  onboarding/          # 3-step onboarding flow
    index.tsx          # Welcome + bottle hero
    taste-profile.tsx  # Palate sliders
    categories.tsx     # Drink category selection
  (tabs)/
    _layout.tsx        # Tab bar
    index.tsx          # Home screen
    camera.tsx         # Photo capture + AI pairing
    bar.tsx            # My Bar inventory
    cocktail.tsx       # Cocktail mode
    profile.tsx        # User profile

components/
  ui/                  # Reusable UI (GlassCard, PressableScale, etc.)
  animations/          # Animated components (MeshBackground, BottleHero)

constants/theme.ts     # Design tokens (colors, spacing, typography)
store/                 # Zustand stores
data/pairings.ts       # 100 curated pairings seed data
types/index.ts         # TypeScript types
```

## Design System

- **Glassmorphism**: BlurView cards with 40–80 intensity, white 8–15% opacity overlays
- **Palette**: Deep midnight base (`#0A0E27`) with burgundy (`#7B1E3A`) and gold (`#D4AF37`) accents
- **Typography**: Fraunces (serif display) + Inter (body)
- **Animations**: Reanimated 3, spring physics (damping 15, stiffness 100), 60fps target
