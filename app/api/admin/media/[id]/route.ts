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

// DELETE - Medyayı sil
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
    const mediaId = resolvedParams.id;

    // Medya bilgisini al
    const { data: media, error: fetchError } = await supabaseAdmin
      .from('media_library')
      .select('file_url')
      .eq('id', mediaId)
      .single();

    if (fetchError) {
      console.error('Medya bilgisi alınamadı:', fetchError);
      return NextResponse.json(
        { error: 'Medya bulunamadı' },
        { status: 404 }
      );
    }

    // Storage'dan sil
    if (media.file_url) {
      try {
        const url = new URL(media.file_url);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf('listing-images');
        if (bucketIndex !== -1) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          
          const { error: storageError } = await supabaseAdmin.storage
            .from('listing-images')
            .remove([filePath]);

          if (storageError) {
            console.error('Storage\'dan silme hatası:', storageError);
          }
        }
      } catch (urlError) {
        console.error('URL parse hatası:', urlError);
      }
    }

    // Veritabanından sil
    const { error: deleteError } = await supabaseAdmin
      .from('media_library')
      .delete()
      .eq('id', mediaId);

    if (deleteError) {
      console.error('Medya silinemedi:', deleteError);
      return NextResponse.json(
        { error: 'Medya silinemedi' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
