# 🚀 Hızlı Başlangıç Rehberi

TimeShare - Devre Mülk Platformu'nu 5 dakikada çalıştırın!

## ✅ Adım 1: Supabase Projesi Oluşturun (2 dakika)

1. [supabase.com](https://supabase.com) → "Start your project" → Giriş yapın
2. "New Project" butonuna tıklayın
3. Proje bilgilerini girin:
   - Name: `devremulk`
   - Database Password: Güçlü bir şifre (kaydedin!)
   - Region: Türkiye'ye yakın bölge seçin
4. "Create new project" → Bekleyin (1-2 dakika)

## ✅ Adım 2: Veritabanını Kurun (1 dakika)

1. Sol menüden **SQL Editor** seçin
2. "New query" butonuna tıklayın
3. `supabase-setup.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna basın ✓

## ✅ Adım 3: API Bilgilerini Alın (30 saniye)

1. Sol menüden **Settings** > **API** bölümüne gidin
2. Şu bilgileri kopyalayın:
   - **Project URL**
   - **anon public** key
   - **service_role** key ⚠️ (Bu key'i gizli tutun!)

## ✅ Adım 4: Environment Variables (30 saniye)

`.env.local` dosyasını açın ve bilgilerinizi yapıştırın:

```env
NEXT_PUBLIC_SUPABASE_URL=BURAYA_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=BURAYA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=BURAYA_SERVICE_ROLE_KEY
ADMIN_PASSWORD=devremulk2026
```

## ✅ Adım 5: Çalıştırın! (1 dakika)

```bash
npm run dev
```

## 🎉 Tamamlandı!

Site hazır: **http://localhost:3000**

### 📌 Önemli URL'ler:

- **Ana Sayfa**: http://localhost:3000
- **Admin Paneli**: http://localhost:3000/admin/gizli-panel
- **Admin Şifresi**: `devremulk2026`

## 📱 İlk İlanınızı Ekleyin

1. Admin paneline gidin (yukarıdaki URL)
2. Şifreyi girin: `devremulk2026`
3. "Yeni İlan Ekle" butonuna tıklayın
4. Formu doldurun ve görselleri sürükleyip bırakın
5. "Kaydet" butonuna basın
6. Ana sayfada ilanınızı görün! 🎊

## ❓ Sorun mu Yaşıyorsunuz?

### Bağlantı hatası alıyorum
- `.env.local` dosyasındaki bilgileri kontrol edin
- Supabase projesinin aktif olduğundan emin olun

### SQL hatası alıyorum
- SQL kodunun tamamını kopyaladığınızdan emin olun
- Kodun baştan sona doğru yapıştırıldığını kontrol edin

### Görseller yüklenmiyor
- Supabase Dashboard > Storage bölümünde `listing-images` bucket'ı kontrol edin
- Public bucket olarak işaretlendiğinden emin olun

## 📚 Daha Fazla Bilgi

- Detaylı kurulum: `SUPABASE_KURULUM.md`
- Proje dokümantasyonu: `README.md`

---

**Not**: Production'a alırken `.env.local` dosyasındaki `ADMIN_PASSWORD`'u mutlaka değiştirin!
