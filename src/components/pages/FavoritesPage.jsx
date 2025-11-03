import React, { useState } from "react";
import { toast } from "react-toastify";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyDetailModal from "@/components/organisms/PropertyDetailModal";
import { useFavoriteProperties } from "@/hooks/useProperties";
import propertyService from "@/services/api/propertyService";

const FavoritesPage = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  
  const { 
    favorites, 
    loading, 
    error, 
    loadFavorites, 
    removeFavorite 
  } = useFavoriteProperties();

  const handleToggleFavorite = async (propertyId) => {
    try {
      await removeFavorite(propertyId);
      toast.success("Property removed from favorites");
    } catch (error) {
      toast.error("Failed to remove from favorites");
    }
  };

  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  const handleCloseModal = () => {
    setSelectedPropertyId(null);
  };

  const getPropertyById = async (propertyId) => {
    try {
      return await propertyService.getById(propertyId);
    } catch (err) {
      console.error("Error loading property:", err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Saved Properties
          </h1>
          <p className="text-gray-600">
            Keep track of properties you're interested in
          </p>
        </div>

        {/* Properties Grid */}
        <PropertyGrid
          properties={favorites}
          loading={loading}
          error={error}
          onRetry={loadFavorites}
          onToggleFavorite={handleToggleFavorite}
          onViewDetails={handleViewDetails}
          title="Your Favorites"
        />
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        propertyId={selectedPropertyId}
        isOpen={!!selectedPropertyId}
        onClose={handleCloseModal}
        onToggleFavorite={handleToggleFavorite}
        getPropertyById={getPropertyById}
      />
    </div>
  );
};

export default FavoritesPage;