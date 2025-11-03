import propertiesData from "@/services/mockData/properties.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for favorites (in real app this would be backend/localStorage)
let favoriteProperties = new Set([2, 5, 8]); // Some initial favorites

class PropertyService {
  async getAll() {
    await delay(300);
    
    // Return properties with current favorite status
    return propertiesData.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));
  }

  async getById(id) {
    await delay(200);
    
    const property = propertiesData.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error("Property not found");
    }
    
    return {
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    };
  }

  async getFavorites() {
    await delay(250);
    
    const favorites = propertiesData
      .filter(property => favoriteProperties.has(property.Id))
      .map(property => ({
        ...property,
        isFavorite: true
      }));
    
    return favorites;
  }

  async toggleFavorite(id) {
    await delay(100);
    
    const propertyId = parseInt(id);
    if (favoriteProperties.has(propertyId)) {
      favoriteProperties.delete(propertyId);
      return false; // Not favorited anymore
    } else {
      favoriteProperties.add(propertyId);
      return true; // Now favorited
    }
  }

  async searchProperties(filters = {}) {
    await delay(400);
    
    let results = [...propertiesData];

    // Filter by location
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      results = results.filter(property => 
        property.city.toLowerCase().includes(searchTerm) ||
        property.state.toLowerCase().includes(searchTerm) ||
        property.zipCode.includes(searchTerm) ||
        property.address.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by listing type
    if (filters.listingType && filters.listingType !== 'All') {
      results = results.filter(property => property.listingType === filters.listingType);
    }

    // Filter by price range
    if (filters.minPrice) {
      results = results.filter(property => property.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(property => property.price <= filters.maxPrice);
    }

    // Filter by minimum bedrooms
    if (filters.minBeds) {
      results = results.filter(property => property.bedrooms >= filters.minBeds);
    }

    // Filter by minimum bathrooms
    if (filters.minBaths) {
      results = results.filter(property => property.bathrooms >= filters.minBaths);
    }

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      results = results.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }

// Add favorite status
    
    // Apply filters
    let filtered = [...properties];
    
    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.address?.toLowerCase().includes(locationLower) ||
        property.city?.toLowerCase().includes(locationLower) ||
        property.state?.toLowerCase().includes(locationLower) ||
        property.zipCode?.toString().includes(locationLower)
      );
    }
    
    // Listing type filter
    if (filters.listingType) {
      filtered = filtered.filter(property => 
        property.listingType === filters.listingType
      );
    }
    
    // Price range filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => 
        property.price >= filters.minPrice
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => 
        property.price <= filters.maxPrice
      );
    }
    
    // Beds and baths filters
    if (filters.minBeds) {
      filtered = filtered.filter(property => 
        property.bedrooms >= filters.minBeds
      );
    }
    if (filters.minBaths) {
      filtered = filtered.filter(property => 
        property.bathrooms >= filters.minBaths
      );
    }
    
    // Property types filter
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }
    
    // Square footage filters
    if (filters.minSquareFeet) {
      filtered = filtered.filter(property => 
        property.squareFeet && property.squareFeet >= filters.minSquareFeet
      );
    }
    if (filters.maxSquareFeet) {
      filtered = filtered.filter(property => 
        property.squareFeet && property.squareFeet <= filters.maxSquareFeet
      );
    }
    
    // Lot size filters
    if (filters.minLotSize) {
      filtered = filtered.filter(property => 
        property.lotSize && property.lotSize >= filters.minLotSize
      );
    }
    if (filters.maxLotSize) {
      filtered = filtered.filter(property => 
        property.lotSize && property.lotSize <= filters.maxLotSize
      );
    }
    
    // Year built filters
    if (filters.minYearBuilt) {
      filtered = filtered.filter(property => 
        property.yearBuilt && property.yearBuilt >= filters.minYearBuilt
      );
    }
    if (filters.maxYearBuilt) {
      filtered = filtered.filter(property => 
        property.yearBuilt && property.yearBuilt <= filters.maxYearBuilt
      );
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(property => {
        if (!property.features) return false;
        return filters.features.every(feature => property.features.includes(feature));
      });
    }
    
    return filtered;
    results = results.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));

    return results;
  }

  // Get properties by listing type for homepage
  async getByListingType(listingType = 'Buy', limit = 6) {
    await delay(300);
    
    let properties = propertiesData.filter(property => property.listingType === listingType);
    
    // Limit results
    if (limit) {
      properties = properties.slice(0, limit);
    }
    
    return properties.map(property => ({
      ...property,
      isFavorite: favoriteProperties.has(property.Id)
    }));
  }
}

export default new PropertyService();