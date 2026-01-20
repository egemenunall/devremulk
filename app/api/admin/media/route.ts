import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthenticated } from '@/utils/auth';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// GET - Medya kütüphanesindeki tüm görselleri getir
export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { data: media, error } = await supabaseAdmin
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Medya listesi alınamadı:', error);
      return NextResponse.json(
        { error: 'Medya listesi alınamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST - Yeni medya yükle
export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosya adını oluştur
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Storage'a yükle
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('listing-images')
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Dosya yüklenemedi:', uploadError);
      return NextResponse.json(
        { error: 'Dosya yüklenemedi' },
        { status: 500 }
      );
    }

    // Public URL al
    const { data: urlData } = supabaseAdmin.storage
      .from('listing-images')
      .getPublicUrl(uploadData.path);

    // Medya kütüphanesine kaydet
    const { data: mediaData, error: dbError } = await supabaseAdmin
      .from('media_library')
      .insert([
        {
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Veritabanına kaydedilemedi:', dbError);
      // Storage'dan sil
      await supabaseAdmin.storage.from('listing-images').remove([uploadData.path]);
      return NextResponse.json(
        { error: 'Veritabanına kaydedilemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ media: mediaData }, { status: 201 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
