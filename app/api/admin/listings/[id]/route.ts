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

// PUT - İlan güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from('listings')
      .update(body)
      .eq('id', id);

    if (error) {
      console.error('İlan güncellenirken hata:', error);
      return NextResponse.json(
        { error: 'İlan güncellenemedi', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// DELETE - İlan sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { id } = await params;

    // Önce görselleri al ve storage'dan sil
    const { data: images } = await supabaseAdmin
      .from('listing_images')
      .select('image_url')
      .eq('listing_id', id);

    if (images && images.length > 0) {
      const filePaths = images
        .map((img) => {
          const url = img.image_url;
          const parts = url.split('/');
          return parts[parts.length - 1];
        })
        .filter(Boolean);

      if (filePaths.length > 0) {
        await supabaseAdmin.storage.from('listing-images').remove(filePaths);
      }
    }

    // İlanı sil (cascade ile görseller de silinir)
    const { error } = await supabaseAdmin.from('listings').delete().eq('id', id);

    if (error) {
      console.error('İlan silinirken hata:', error);
      return NextResponse.json(
        { error: 'İlan silinemedi', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Sunucu hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
