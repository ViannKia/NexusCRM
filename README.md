# 🚀 NEXUS - Customer Relationship Management Modern

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?logo=shadcnui)

## 📋 Tentang Project

**Nexus** adalah aplikasi Customer Relationship Management (CRM) modern yang dirancang untuk membantu tim penjualan dan pemasaran dalam:

- 📊 **Manajemen Kontak & Perusahaan** - Pusat data pelanggan terpusat
- 🎯 **Pipeline Penjualan** - Visualisasi deal dengan drag-drop Kanban
- 📝 **Pelacakan Aktivitas** - Catat panggilan, email, meeting, dan tugas
- 📈 **Dashboard Analytics** - Pantau performa penjualan secara real-time
- 🏢 **Manajemen Tim** - Role-based access control (Admin, Manager, Sales)

## ✨ Fitur Utama

### ✅ Core CRM
- 🔐 **Autentikasi Multi-User** (Admin, Manager, Sales) dengan Supabase Auth
- 👥 **Manajemen Kontak** - CRUD, search, pagination, soft delete
- 🏛️ **Manajemen Perusahaan** - Lihat semua kontak dalam satu perusahaan
- 📋 **Pipeline Kanban** - Drag-drop deal antar stage (Lead → Proposal → Won)
- 📝 **Aktivitas & Tasks** - Log panggilan, email, meeting dengan deadline
- 📊 **Dashboard Interaktif** - Metrik real-time & grafik penjualan

### 🎨 Teknis Unggulan
- ⚡ **Server Components** - Performa optimal dengan Next.js 16
- 🛡️ **Row Level Security (RLS)** - Keamanan data level database
- 📱 **Responsive Design** - Akses dari desktop, tablet, dan mobile
- 🌓 **Dark Mode Support** - Tampilan modern dengan tema gelap/terang
- 🧩 **Feature-Based Architecture** - Kode modular, reusable, maintainable

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Bahasa** | TypeScript 5 (Strict Mode) |
| **Database** | Supabase (PostgreSQL 14+) |
| **Auth** | Supabase Auth (RLS) |
| **Styling** | Tailwind CSS 4 + shadcn/ui |
| **Form** | React Hook Form + Zod |
| **Drag & Drop** | @dnd-kit/core |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

## 🗂️ Struktur Database

**6 Tabel Inti + RLS Policies**

| Tabel | Fungsi | Fitur Keamanan |
|-------|--------|----------------|
| `profiles` | Memperluas auth.users dengan data CRM (role, nama lengkap) | RLS: User hanya lihat profil sendiri |
| `companies` | Manajemen perusahaan klien | RLS: Sales hanya lihat assigned companies |
| `contacts` | Manajemen kontak (perusahaan, status, assign ke sales) | RLS: Sales hanya lihat assigned contacts |
| `pipeline_stages` | Stage pipeline: Lead, Proposal, Won | Public read (semua user) |
| `deals` | Pipeline penjualan (title, value, stage, contact) | RLS: Sales hanya lihat assigned deals |
| `activities` | Log aktivitas & tasks (call, email, meeting, task) | RLS: User hanya lihat aktivitas sendiri |

**Fitur Database Unggulan:**
- 🔐 **Row Level Security (RLS)** - Admin full akses, sales hanya data sendiri
- 🗑️ **Soft Delete** - Data tidak hilang permanen (`deleted_at`)
- ⚡ **Indexes** - Optimasi query (`assigned_to`, `status`, `stage_id`, `contact_id`)
- 📝 **Auto Timestamp** - Trigger untuk `updated_at`
- 🔗 **Foreign Keys** - `ON DELETE RESTRICT` menjaga integritas data

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js 18+ atau 20+
- npm atau yarn
- Akun Supabase (gratis)

### Langkah Instalasi

```bash
# Clone repository
git clone https://github.com/username/nexus-crm.git

# Masuk ke folder project
cd nexus-crm

# Install dependensi
npm install

# Install shadcn/ui components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input label card dialog form table select skeleton avatar

# Copy environment variables
cp .env.example .env.local

# Jalankan development server
npm run dev
```

## 👨‍💻 Author

**Adrianus Vianto Eban Kia**

- GitHub: [@ViannKia](https://github.com/ViannKia)
- LinkedIn: [@ViannKia](https://linkedin.com/in/viannkia)

## 📄 License

MIT License - Copyright (c) 2026 Adrianus Vianto Eban Kia
