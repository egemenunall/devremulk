import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/utils/auth';
import { createClient } from '@supabase/supabase-js';

// Service role client (RLS bypass için)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// POST - Görsel yükle ve listing'e ekle
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const listingId = formData.get('listing_id') as string;
    const order = formData.get('order') as string;

    if (!file || !listingId) {
      return NextResponse.json({ error: 'Dosya ve listing ID gerekli' }, { status: 400 });
    }

    // Dosya adı oluştur
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

    // Dosyayı buffer'a dönüştür
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Storage'a yükle
    const { error: uploadError } = await supabaseAdmin.storage
      .from('listing-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Görsel yüklenirken hata:', uploadError);
      return NextResponse.json(
        { error: 'Görsel yüklenemedi', details: uploadError.message },
        { status: 500 }
      );
    }

    // Public URL al
    const { data: urlData } = supabaseAdmin.storage
      .from('listing-images')
      .getPublicUrl(fileName);

    // Veritabanına kaydet
    const { data: image, error: dbError } = await supabaseAdmin
      .from('listing_images')
      .insert([
        {
          listing_id: listingId,
          image_url: urlData.publicUrl,
          order: parseInt(order || '0'),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Görsel kaydedilirken hata:', dbError);
      // Storage'dan dosyayı sil
      await supabaseAdmin.storage.from('listing-images').remove([fileName]);
      return NextResponse.json(
        { error: 'Görsel kaydedilemedi', details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
