-- Devre Mülk İlan Sitesi - Supabase Veritabanı Kurulumu
-- Bu SQL kodlarını Supabase Dashboard > SQL Editor'da çalıştırın

-- 1. listings tablosunu oluştur
CREATE TABLE IF NOT EXISTS listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    period TEXT NOT NULL,
    listing_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. listing_images tablosunu oluştur
CREATE TABLE IF NOT EXISTS listing_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. İndeksler oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_listings_listing_date ON listings(listing_date DESC);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_images_order ON listing_images(listing_id, "order");

-- 4. Row Level Security (RLS) politikalarını etkinleştir
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;

-- 5. RLS Politikaları

-- Herkes ilanları okuyabilir
CREATE POLICY "Herkes ilanları görüntüleyebilir"
    ON listings FOR SELECT
    USING (true);

-- Herkes ilan görsellerini okuyabilir
CREATE POLICY "Herkes ilan görsellerini görüntüleyebilir"
    ON listing_images FOR SELECT
    USING (true);

-- Authenticated kullanıcılar ilan ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Authenticated kullanıcılar ilan ekleyebilir"
    ON listings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated kullanıcılar ilan güncelleyebilir"
    ON listings FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated kullanıcılar ilan silebilir"
    ON listings FOR DELETE
    USING (auth.role() = 'authenticated');

-- Authenticated kullanıcılar görsel ekleyebilir/güncelleyebilir/silebilir
CREATE POLICY "Authenticated kullanıcılar görsel ekleyebilir"
    ON listing_images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated kullanıcılar görsel güncelleyebilir"
    ON listing_images FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated kullanıcılar görsel silebilir"
    ON listing_images FOR DELETE
    USING (auth.role() = 'authenticated');

-- 6. Storage Bucket oluşturma
-- Bu kısmı Supabase Dashboard > Storage bölümünden manuel olarak oluşturmanız gerekiyor:
-- - Bucket adı: "listing-images"
-- - Public bucket: Yes (Görsellerin herkese açık olması için)
-- 
-- Alternatif olarak, aşağıdaki SQL komutuyla da oluşturabilirsiniz:

INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage için RLS politikaları
CREATE POLICY "Herkes görselleri görüntüleyebilir"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'listing-images');

CREATE POLICY "Authenticated kullanıcılar görsel yükleyebilir"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated kullanıcılar görsel silebilir"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

-- Tamamlandı!
-- Artık Supabase yapılandırmanız hazır.
