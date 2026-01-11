# Supabase Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin ve giriş yapın
2. "New Project" butonuna tıklayın
3. Proje bilgilerini girin:
   - **Name**: devremulk
   - **Database Password**: Güçlü bir şifre belirleyin (kaydedin!)
   - **Region**: Size en yakın bölgeyi seçin
4. "Create new project" butonuna tıklayın
5. Proje oluşturulurken bekleyin (birkaç dakika sürebilir)

## 2. API Bilgilerini Alma

Proje oluşturulduktan sonra:

1. Sol menüden **Settings** > **API** bölümüne gidin
2. Aşağıdaki bilgileri kopyalayın:
   - **Project URL** (URL kısmında)
   - **anon public** key (API Keys kısmında)
   - **service_role** key (API Keys kısmında) ⚠️ **Bu key'i gizli tutun!**

3. Bu bilgileri `.env.local` dosyasına ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=buraya_project_url_yapistirin
NEXT_PUBLIC_SUPABASE_ANON_KEY=buraya_anon_key_yapistirin
SUPABASE_SERVICE_ROLE_KEY=buraya_service_role_key_yapistirin
ADMIN_PASSWORD=devremulk2026
```

⚠️ **ÖNEMLİ**: `service_role` key'i tüm güvenlik kurallarını bypass eder. Bu key'i asla GitHub'a commit etmeyin veya frontend kodunda kullanmayın!

## 3. Veritabanı Tablolarını Oluşturma

1. Supabase Dashboard'da sol menüden **SQL Editor** seçeneğine tıklayın
2. "New query" butonuna tıklayın
3. `supabase-setup.sql` dosyasının içeriğini kopyalayıp yapıştırın
4. "Run" butonuna tıklayarak SQL kodlarını çalıştırın
5. Başarılı mesajı görmelisiniz

## 4. Storage Bucket Kontrolü

1. Sol menüden **Storage** bölümüne gidin
2. `listing-images` adında bir bucket olmalı (SQL koduyla oluşturuldu)
3. Eğer yoksa, "New bucket" butonuna tıklayın:
   - **Name**: listing-images
   - **Public bucket**: ✓ (işaretli olmalı)
   - "Create bucket" butonuna tıklayın

## 5. Admin Kullanıcısı Oluşturma (Opsiyonel)

Eğer admin panelinde daha güvenli authentication istiyorsanız:

1. Sol menüden **Authentication** > **Users** bölümüne gidin
2. "Add user" butonuna tıklayın
3. Email ve şifre girin (admin olarak kullanacağınız)
4. "Create user" butonuna tıklayın

> **Not**: Mevcut implementasyonda basit şifre kontrolü kullanılıyor (devremulk2026). İsterseniz bu Supabase Auth ile değiştirilebilir.

## 6. Kurulumu Test Etme

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin ve sitenin çalıştığını kontrol edin.

## Sorun Giderme

### Supabase bağlantı hatası alıyorsanız:

1. `.env.local` dosyasındaki URL ve KEY bilgilerini kontrol edin
2. Supabase projesinin aktif olduğundan emin olun
3. Tarayıcı konsolunda hata mesajlarını kontrol edin

### SQL hatası alıyorsanız:

1. SQL Editor'da her komutu tek tek çalıştırmayı deneyin
2. Tabloların zaten var olup olmadığını kontrol edin
3. RLS politikalarının doğru şekilde ayarlandığını kontrol edin

## Kurulum Tamamlandı! 🎉

Artık sitenizi kullanmaya başlayabilirsiniz:
- Ana sayfa: `http://localhost:3000`
- Admin paneli: `http://localhost:3000/admin/gizli-panel`
