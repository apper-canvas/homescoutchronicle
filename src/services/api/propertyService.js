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

// Additional filtering for advanced features
    if (filters.minSquareFeet) {
      results = results.filter(property => 
        property.squareFeet && property.squareFeet >= filters.minSquareFeet
      );
    }
    if (filters.maxSquareFeet) {
      results = results.filter(property => 
        property.squareFeet && property.squareFeet <= filters.maxSquareFeet
      );
    }
    
    // Lot size filters
    if (filters.minLotSize) {
      results = results.filter(property => 
        property.lotSize && property.lotSize >= filters.minLotSize
      );
    }
    if (filters.maxLotSize) {
      results = results.filter(property => 
        property.lotSize && property.lotSize <= filters.maxLotSize
      );
    }
    
    // Year built filters
    if (filters.minYearBuilt) {
      results = results.filter(property => 
        property.yearBuilt && property.yearBuilt >= filters.minYearBuilt
      );
    }
    if (filters.maxYearBuilt) {
      results = results.filter(property => 
        property.yearBuilt && property.yearBuilt <= filters.maxYearBuilt
      );
    }
    
    // Features filter
    if (filters.features && filters.features.length > 0) {
      results = results.filter(property => {
        if (!property.features) return false;
        return filters.features.every(feature => property.features.includes(feature));
      });
    }

    // Add favorite status to results
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