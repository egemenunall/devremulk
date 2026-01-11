# TimeShare - Devre Mülk İlan Platformu

Profesyonel ve modern bir devre mülk ilan platformu. Next.js 14, Tailwind CSS ve Supabase ile geliştirilmiştir.

## Özellikler

- 🏠 **İlan Listesi**: Tüm devre mülk ilanlarını tarihe göre sıralı görüntüleme
- 🔍 **Gelişmiş Filtreleme**: Fiyat, dönem ve tarih aralığına göre filtreleme
- 📸 **Görsel Galeri**: Her ilan için çoklu görsel desteği ve slider
- 🔐 **Admin Paneli**: Gizli URL ile korunan admin paneli
- ➕ **İlan Yönetimi**: İlan ekleme, düzenleme ve silme
- 📱 **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- 🎨 **Modern UI**: Temiz ve minimal arayüz tasarımı

## Teknolojiler

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel (önerilir)

## Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Supabase Projesini Kurun

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editor'da `supabase-setup.sql` dosyasını çalıştırın
4. Storage bölümünden `listing-images` bucket'ının oluşturulduğunu kontrol edin

Detaylı kurulum için `SUPABASE_KURULUM.md` dosyasına bakın.

### 3. Environment Variables

`.env.local` dosyasını oluşturun ve Supabase bilgilerinizi ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=devremulk2026
```

⚠️ **ÖNEMLİ**: `service_role` key'i asla GitHub'a commit etmeyin!

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Site `http://localhost:3000` adresinde çalışacaktır.

## Kullanım

### Ana Sayfa

- Ana sayfada tüm ilanları görebilirsiniz
- Filtreleme bölümünden fiyat, dönem ve tarih aralığına göre filtreleme yapabilirsiniz
- İlan kartlarına tıklayarak detay sayfasına gidebilirsiniz

### İlan Detay Sayfası

- İlanın tüm bilgilerini görüntüleyin
- Görsel galerisinde gezinin (birden fazla görsel varsa)
- Ana sayfaya geri dönün

### Admin Paneli

**URL**: `http://localhost:3000/admin/gizli-panel`  
**Şifre**: `devremulk2026`

Admin panelinde:
- Yeni ilan ekleyin
- Mevcut ilanları düzenleyin
- İlanları silin
- Çoklu görsel yükleyin

## Proje Yapısı

```
/app
  /page.tsx                           # Ana sayfa
  /layout.tsx                         # Root layout
  /not-found.tsx                      # 404 sayfası
  /listings/[id]/page.tsx            # İlan detay sayfası
  /admin
    /gizli-panel
      /page.tsx                       # Admin giriş
      /dashboard
        /page.tsx                     # Admin dashboard
        /layout.tsx                   # Admin auth kontrolü
  /api
    /admin
      /login/route.ts                # Login API
      /logout/route.ts               # Logout API

/components
  /ListingCard.tsx                   # İlan kartı
  /FilterBar.tsx                     # Filtreleme bileşeni
  /ImageGallery.tsx                  # Görsel galerisi
  /AdminListingForm.tsx              # İlan formu
  /AdminListingList.tsx              # İlan listesi (admin)
  /ImageUploader.tsx                 # Görsel yükleme

/lib
  /supabase.ts                       # Supabase client
  /types.ts                          # TypeScript tipleri
  /api.ts                            # API fonksiyonları

/utils
  /auth.ts                           # Auth yardımcıları
```

## Veritabanı Şeması

### listings

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID | Primary key |
| name | TEXT | İlan adı |
| description | TEXT | İlan açıklaması |
| price | NUMERIC | Fiyat |
| period | TEXT | Dönem (Haftalık, Aylık, vb.) |
| listing_date | DATE | İlan tarihi |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### listing_images

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID | Primary key |
| listing_id | UUID | İlan ID (Foreign Key) |
| image_url | TEXT | Görsel URL |
| order | INTEGER | Sıralama |
| created_at | TIMESTAMP | Oluşturulma zamanı |

## Deployment

### Vercel'e Deploy Etme

1. GitHub'a push yapın
2. [Vercel](https://vercel.com) hesabı oluşturun
3. "New Project" ile GitHub repo'nuzu bağlayın
4. Environment variables'ı ekleyin
5. Deploy edin

### Environment Variables (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_secure_password
```

## Güvenlik Notları

- Admin şifresi `.env.local` dosyasında saklanır
- Production'da güçlü bir şifre kullanın
- Supabase RLS politikaları ile veritabanı korunur
- Admin rotaları middleware ile güvence altındadır

## Geliştirme

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## Lisans

Bu proje özel kullanım içindir.

## Destek

Herhangi bir sorun yaşarsanız `SUPABASE_KURULUM.md` dosyasındaki "Sorun Giderme" bölümüne bakın.

---

© 2026 TimeShare
