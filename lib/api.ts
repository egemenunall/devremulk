import { supabase } from './supabase';
import { Listing, ListingWithImages, FilterParams, ListingImage } from './types';

// Tüm ilanları getir (filtreleme ile)
export async function getListings(filters?: FilterParams): Promise<ListingWithImages[]> {
  let query = supabase
    .from('listings')
    .select('*')
    .order('listing_date', { ascending: false });

  // Filtreleme uygula
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.period) {
    query = query.eq('period', filters.period);
  }
  if (filters?.startDate) {
    query = query.gte('listing_date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('listing_date', filters.endDate);
  }

  const { data: listings, error } = await query;

  if (error) {
    console.error('İlanlar getirilirken hata:', error);
    return [];
  }

  if (!listings || listings.length === 0) {
    return [];
  }

  // Her ilan için görselleri getir
  const listingsWithImages: ListingWithImages[] = await Promise.all(
    listings.map(async (listing) => {
      const { data: images } = await supabase
        .from('listing_images')
        .select('*')
        .eq('listing_id', listing.id)
        .order('order', { ascending: true });

      return {
        ...listing,
        images: images || [],
      };
    })
  );

  return listingsWithImages;
}

// Tek bir ilanı getir (ID ile)
export async function getListingById(id: string): Promise<ListingWithImages | null> {
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !listing) {
    console.error('İlan getirilirken hata:', error);
    return null;
  }

  const { data: images } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', listing.id)
    .order('order', { ascending: true });

  return {
    ...listing,
    images: images || [],
  };
}

// Yeni ilan oluştur
export async function createListing(
  listing: Omit<Listing, 'id' | 'created_at'>
): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .insert([listing])
    .select()
    .single();

  if (error) {
    console.error('İlan oluşturulurken hata:', error);
    return null;
  }

  return data;
}

// İlan güncelle
export async function updateListing(
  id: string,
  updates: Partial<Omit<Listing, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('İlan güncellenirken hata:', error);
    return false;
  }

  return true;
}

// İlan sil
export async function deleteListing(id: string): Promise<boolean> {
  // Önce görselleri sil
  const { data: images } = await supabase
    .from('listing_images')
    .select('image_url')
    .eq('listing_id', id);

  if (images) {
    for (const image of images) {
      // Storage'dan görsel dosyasını sil
      const path = image.image_url.split('/').pop();
      if (path) {
        await supabase.storage.from('listing-images').remove([path]);
      }
    }
  }

  // İlanı sil (cascade ile görseller de silinir)
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('İlan silinirken hata:', error);
    return false;
  }

  return true;
}

// Görsel yükle
export async function uploadImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('listing-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Görsel yüklenirken hata:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('listing-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// İlana görsel ekle
export async function addImageToListing(
  listingId: string,
  imageUrl: string,
  order: number
): Promise<ListingImage | null> {
  const { data, error } = await supabase
    .from('listing_images')
    .insert([
      {
        listing_id: listingId,
        image_url: imageUrl,
        order,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Görsel eklenirken hata:', error);
    return null;
  }

  return data;
}

// Görseli sil
export async function deleteImage(imageId: string): Promise<boolean> {
  // Önce görsel bilgisini al
  const { data: image } = await supabase
    .from('listing_images')
    .select('image_url')
    .eq('id', imageId)
    .single();

  if (image) {
    // Storage'dan dosyayı sil
    const path = image.image_url.split('/').pop();
    if (path) {
      await supabase.storage.from('listing-images').remove([path]);
    }
  }

  // Veritabanından kayıdı sil
  const { error } = await supabase
    .from('listing_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Görsel silinirken hata:', error);
    return false;
  }

  return true;
}

// Mevcut dönemleri getir (benzersiz)
export async function getUniquePeriods(): Promise<string[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('period');

  if (error || !data) {
    return [];
  }

  const uniquePeriods = [...new Set(data.map((item) => item.period))];
  return uniquePeriods.filter(Boolean);
}
