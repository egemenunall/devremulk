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

// DELETE - Görseli sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const resolvedParams = await params;
    const imageId = resolvedParams.id;

    // Önce görselin URL'sini al (storage'dan silmek için)
    const { data: image, error: fetchError } = await supabaseAdmin
      .from('listing_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      console.error('Görsel bilgisi alınamadı:', fetchError);
      return NextResponse.json(
        { error: 'Görsel bulunamadı' },
        { status: 404 }
      );
    }

    // Storage'dan görseli sil
    if (image.image_url) {
      try {
        // URL'den dosya yolunu çıkar
        const url = new URL(image.image_url);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('listing-images');
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          
          const { error: storageError } = await supabaseAdmin.storage
            .from('listing-images')
            .remove([filePath]);

          if (storageError) {
            console.error('Storage\'dan silme hatası:', storageError);
            // Storage hatası olsa bile veritabanından silmeye devam et
          }
        }
      } catch (urlError) {
        console.error('URL parse hatası:', urlError);
        // URL parse hatası olsa bile veritabanından silmeye devam et
      }
    }

    // Veritabanından görseli sil
    const { error: deleteError } = await supabaseAdmin
      .from('listing_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Görsel silinemedi:', deleteError);
      return NextResponse.json(
        { error: 'Görsel silinemedi', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
