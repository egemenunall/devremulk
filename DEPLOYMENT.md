# 🚀 Deployment Rehberi - Vercel ile Deploy

Bu rehber, TimeShare projesini GitHub'a yükleyip Vercel ile deploy etmeniz için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

✅ Tüm değişiklikler Git'e commit edildi!

## 1️⃣ GitHub'a Yükleme

### Yeni GitHub Repository Oluştur

1. **GitHub'a git**: https://github.com/new
2. **Repository adı**: `devremulk` (veya istediğiniz bir isim)
3. **Visibility**: `Public` veya `Private` seçin
4. **ÖNEMLİ**: ✅ "Add a README file" seçeneğini **SEÇMEYİN** (zaten README var)
5. **.gitignore** ve **license** SEÇMEYİN
6. **"Create repository"** butonuna tıklayın

### Repository'yi Bağla ve Push Et

GitHub size gösterecek ama kısaca:

```bash
# GitHub repo URL'nizi ekleyin (GitHub'dan kopyalayın)
git remote add origin https://github.com/KULLANICI_ADINIZ/devremulk.git

# Main branch'i push edin
git branch -M main
git push -u origin main
```

## 2️⃣ Vercel ile Deploy

### Adım 1: Vercel'e Giriş Yap

1. **Vercel'e git**: https://vercel.com
2. GitHub hesabınızla giriş yapın
3. **"Import Project"** veya **"Add New Project"** tıklayın

### Adım 2: GitHub Repository'sini İçe Aktar

1. GitHub reponuzu seçin (`devremulk`)
2. **"Import"** butonuna tıklayın

### Adım 3: Environment Variables (Çevre Değişkenleri) Ekle

**ÇOK ÖNEMLİ**: Deploy etmeden önce Supabase bilgilerini ekleyin!

Vercel dashboard'unda **"Environment Variables"** bölümüne şunları ekleyin:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=devremulk2026
```

**Nereden alınır?**
- Supabase Dashboard → Project Settings → API
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (GİZLİ!)

### Adım 4: Deploy Et

1. **"Deploy"** butonuna tıklayın
2. ☕ 2-3 dakika bekleyin
3. ✅ Deploy tamamlandı!

## 3️⃣ Deploy Sonrası

### Sitenizi Kontrol Edin

Vercel size bir URL verecek:
```
https://devremulk.vercel.app
```

veya

```
https://your-project-name.vercel.app
```

### Test Edin

1. ✅ Ana sayfa çalışıyor mu?
2. ✅ İlanlar sayfası çalışıyor mu?
3. ✅ Admin paneline giriş yapabiliyor musunuz?
   - `/admin` → Şifre: `devremulk2026`

## 4️⃣ Özel Domain (İsteğe Bağlı)

Kendi domain'inizi bağlamak için:

1. Vercel Dashboard → Project Settings → Domains
2. Domain adınızı girin
3. DNS ayarlarını yapın (Vercel size gösterecek)

## 🔄 Gelecekte Güncelleme Yaparken

Her değişiklik yaptığınızda:

```bash
git add .
git commit -m "açıklama buraya"
git push
```

Vercel otomatik olarak yeni versiyonu deploy edecek! 🎉

## 🆘 Sorun Giderme

### Build Hatası
- Vercel Dashboard → Deployments → Failed deployment → "View Function Logs"
- Genellikle environment variables eksiktir

### Supabase Bağlantı Hatası
- Environment variables doğru mu kontrol edin
- Supabase RLS kuralları aktif mi?

### Admin Panel Açılmıyor
- `ADMIN_PASSWORD` environment variable'ı ekli mi?

## 📱 Mobil Test

Deploy edildikten sonra mobilde test etmeyi unutmayın:
- iOS Safari
- Android Chrome
- Responsive tasarım

---

## ✅ Checklist

- [ ] GitHub repository oluşturuldu
- [ ] Kod GitHub'a push edildi
- [ ] Vercel hesabı oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deploy başarılı
- [ ] Site açılıyor
- [ ] Admin panel çalışıyor
- [ ] Supabase bağlantısı çalışıyor
- [ ] Mobilde test edildi

🎉 **Başarılar! Siteniz artık canlıda!**
