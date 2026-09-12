# ERD — MUI Jakarta Timur Web

Database: Supabase Postgres. Auth ditangani oleh `auth.users` (Supabase Auth); tabel `profiles` menyimpan data tambahan + role, di-link 1:1 ke `auth.users.id`.

## Diagram (ringkas)

```mermaid
erDiagram
  USERS ||--|| PROFILES : "auth.users.id = profiles.id"
  PROFILES ||--o{ COMMENTS : "menulis"
  PROFILES ||--o{ NEWS : "updated_by"
  PROFILES ||--o{ FATWA : "updated_by"
  PROFILES ||--o{ FAQ_TANYA_ULAMA : "updated_by"
  PROFILES ||--o{ PENGURUS : "updated_by"
  PROFILES ||--o{ BIDANG_KOMISI : "updated_by"
  PROFILES ||--o{ HERO_SLIDE : "updated_by"
  NEWS ||--o{ COMMENTS : "menerima"
  FATWA ||--o{ COMMENTS : "menerima"
  FAQ_TANYA_ULAMA ||--o{ COMMENTS : "menerima"
  SETTINGS {
    string key PK
    jsonb value
  }

  PROFILES {
    uuid id PK "= auth.users.id"
    string username
    string first_name
    string last_name
    string avatar_url
    enum role "USER | ADMIN | SUPER_ADMIN"
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }

  NEWS {
    uuid id PK
    string slug
    string title
    string category
    text excerpt
    text body
    string image_url
    boolean featured
    enum status "DRAFT | PUBLISHED"
    timestamptz published_at
    uuid updated_by FK
    timestamptz created_at
    timestamptz updated_at
  }

  FATWA {
    uuid id PK
    string slug
    string number
    string title
    enum category "MUAMALAH | IBADAH_KESEHATAN | DIREKTORI_KONTEMPORER"
    text body
    enum status "DRAFT | PUBLISHED"
    uuid updated_by FK
    timestamptz created_at
    timestamptz updated_at
  }

  FAQ_TANYA_ULAMA {
    uuid id PK
    text question
    text answer
    string category
    int sort_order
    enum status "DRAFT | PUBLISHED"
    uuid updated_by FK
    timestamptz created_at
    timestamptz updated_at
  }

  PENGURUS {
    uuid id PK
    string name
    string position
    string photo_url
    string period
    int sort_order
    uuid updated_by FK
    timestamptz updated_at
  }

  BIDANG_KOMISI {
    uuid id PK
    string slug
    string name
    text description
    string chair_name
    jsonb members
    uuid updated_by FK
    timestamptz updated_at
  }

  HERO_SLIDE {
    uuid id PK
    string image_url
    string title
    string link_url
    int sort_order
    boolean active
    uuid updated_by FK
  }

  COMMENTS {
    uuid id PK
    string content_type "news | fatwa | faq"
    uuid content_id
    uuid author_id FK
    text body
    timestamptz created_at
    boolean is_deleted
    uuid deleted_by FK
  }
```

## Catatan Desain
- **Soft delete** untuk `COMMENTS` (`is_deleted` + `deleted_by`) agar moderasi admin tetap punya audit trail, bukan hard delete.
- **`status` DRAFT/PUBLISHED** pada semua modul konten agar admin bisa menyiapkan draft sebelum tayang.
- **`updated_by`** pada setiap modul konten untuk audit "siapa mengubah terakhir".
- **`SETTINGS`** tabel key-value generik untuk: lokasi default jadwal sholat (`default_location`), kredensial integrasi IG/YouTube (terenkripsi di Supabase Vault, bukan disimpan plaintext di tabel biasa), dan flag lain.
- Row Level Security (RLS) Supabase:
  - `profiles`: user hanya bisa baca/update baris miliknya sendiri; admin/super_admin bisa baca semua.
  - Tabel konten (`news`, `fatwa`, dll): `SELECT` terbuka untuk status `PUBLISHED` (anon + authenticated), `INSERT/UPDATE/DELETE` hanya role `ADMIN`/`SUPER_ADMIN` (dicek lewat fungsi `is_admin()` yang membaca `profiles.role`).
  - `comments`: `INSERT` untuk authenticated user (harus `author_id = auth.uid()`), `DELETE` untuk pemilik komentar ATAU admin/super_admin.
- Prisma schema (`prisma/schema.prisma`) akan diperluas merefleksikan ERD ini, tapi migrasi dieksekusi lewat Supabase (SQL migration), Prisma hanya untuk type-safety query di server actions/API routes.
