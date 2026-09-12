// Sri Lanka Agricultural Regions & Proximity Calculator

const REGION_COORDINATES = {
  'Ampara': { lat: 7.2912, lng: 81.6724, province: 'Eastern Province' },
  'Batticaloa': { lat: 7.7310, lng: 81.6747, province: 'Eastern Province' },
  'Kandy': { lat: 7.2906, lng: 80.6337, province: 'Central Province' },
  'Nuwara Eliya': { lat: 6.9497, lng: 80.7891, province: 'Central Province' },
  'Kurunegala': { lat: 7.4863, lng: 80.3623, province: 'North Western Province' },
  'Puttalam': { lat: 8.0362, lng: 79.8283, province: 'North Western Province' },
  'Badulla': { lat: 6.9934, lng: 81.0550, province: 'Uva Province' },
  'Anuradhapura': { lat: 8.3114, lng: 80.4037, province: 'North Central Province' },
  'Polonnaruwa': { lat: 7.9403, lng: 81.0188, province: 'North Central Province' },
  'Colombo': { lat: 6.9271, lng: 79.8612, province: 'Western Province' },
};

/**
 * Calculates Haversine distance in kilometers between two geographic coordinates
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Finds approximate distance between two Sri Lankan locations by name
 */
function getDistanceBetweenLocations(locA, locB) {
  const cleanA = Object.keys(REGION_COORDINATES).find(r => locA.toLowerCase().includes(r.toLowerCase())) || 'Ampara';
  const cleanB = Object.keys(REGION_COORDINATES).find(r => locB.toLowerCase().includes(r.toLowerCase())) || 'Ampara';

  const coordA = REGION_COORDINATES[cleanA];
  const coordB = REGION_COORDINATES[cleanB];

  return calculateHaversineDistance(coordA.lat, coordA.lng, coordB.lat, coordB.lng);
}

module.exports = {
  REGION_COORDINATES,
  calculateHaversineDistance,
  getDistanceBetweenLocations,
};
