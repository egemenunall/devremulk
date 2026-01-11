'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getListings } from '@/lib/api';
import { ListingWithImages } from '@/lib/types';
import AdminListingForm from '@/components/AdminListingForm';
import AdminListingList from '@/components/AdminListingList';

export default function AdminDashboard() {
  const [listings, setListings] = useState<ListingWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingWithImages | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setLoading(true);
    const data = await getListings();
    setListings(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/gizli-panel');
  };

  const handleAddNew = () => {
    setEditingListing(null);
    setShowForm(true);
  };

  const handleEdit = (listing: ListingWithImages) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingListing(null);
    loadListings();
  };

  const handleDelete = async () => {
    loadListings();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Siteyi Görüntüle
              </a>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add New Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Yeni İlan Ekle
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <AdminListingForm
            listing={editingListing}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}

        {/* Listings List */}
        {!showForm && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
              </div>
            ) : (
              <AdminListingList
                listings={listings}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
