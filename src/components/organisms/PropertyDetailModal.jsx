import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";

const PropertyDetailModal = ({ 
  propertyId, 
  isOpen, 
  onClose, 
  onToggleFavorite,
  getPropertyById 
}) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && propertyId) {
      loadProperty();
    }
  }, [isOpen, propertyId]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      const data = await getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error("Failed to load property:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const nextImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {loading ? (
            <div className="p-8">
              <Loading type="skeleton" />
            </div>
          ) : property ? (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {property.address}
                  </h2>
                  <p className="text-gray-600">
                    {property.city}, {property.state} {property.zipCode}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onToggleFavorite(property.Id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ApperIcon 
                      name="Heart" 
                      size={24} 
                      className={property.isFavorite ? "text-red-500 fill-current" : "text-gray-600"} 
                    />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ApperIcon name="X" size={24} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Gallery */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-100">
                      <img
                        src={property.images[currentImageIndex]}
                        alt={`Property ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Image Navigation */}
                      {property.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                          >
                            <ApperIcon name="ChevronLeft" size={20} />
                          </button>
                          
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                          >
                            <ApperIcon name="ChevronRight" size={20} />
                          </button>

                          {/* Image Indicators */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {property.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentImageIndex 
                                    ? "bg-white" 
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6 space-y-6">
                    {/* Price & Type */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(property.price)}
                          {property.listingType === 'Rent' && (
                            <span className="text-lg font-normal text-gray-600">/month</span>
                          )}
                        </div>
                        <Badge variant="primary">
                          For {property.listingType}
                        </Badge>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Bed" size={20} className="text-gray-400" />
                        <span className="font-medium">{property.bedrooms}</span>
                        <span className="text-gray-600">bed{property.bedrooms !== 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Bath" size={20} className="text-gray-400" />
                        <span className="font-medium">{property.bathrooms}</span>
                        <span className="text-gray-600">bath{property.bathrooms !== 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="Square" size={20} className="text-gray-400" />
                        <span className="font-medium">{formatSquareFeet(property.squareFeet)}</span>
                        <span className="text-gray-600">sqft</span>
                      </div>
                      
                      {property.lotSize && (
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="TreePine" size={20} className="text-gray-400" />
                          <span className="font-medium">{formatSquareFeet(property.lotSize)}</span>
                          <span className="text-gray-600">lot</span>
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Property Type</span>
                        <p className="font-medium">{property.propertyType}</p>
                      </div>
                      
                      {property.yearBuilt && (
                        <div>
                          <span className="text-gray-500">Year Built</span>
                          <p className="font-medium">{property.yearBuilt}</p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {property.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 leading-relaxed">
                          {property.description}
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    {property.features && property.features.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Features</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {property.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <ApperIcon name="Check" size={16} className="text-success" />
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <Button variant="primary" size="large" className="w-full">
                        <ApperIcon name="Phone" size={20} className="mr-2" />
                        Contact Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <p className="text-center text-gray-600">Property not found</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PropertyDetailModal;