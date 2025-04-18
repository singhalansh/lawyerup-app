import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import MultiSelect from "./ui/multiselect";
import LawyerCard from "./LawyerCard";
import Navbar from "./Navbar";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAP_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

// Remove this line as it's redundant with mapLibraries
const libraries = ["places"];

// Keep this one
const mapLibraries = ["places"];

const radiusOptions = [5, 10, 25, 50, 100, 500]; // in kilometers
const practiceOptions = [
  "Civil",
  "Criminal",
  "Corporate",
  "Family",
  "Property",
  "Labor",
];

function SearchLawyers() {
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(10);
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const searchInputRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("distance");
  const [sortOrder, setSortOrder] = useState("asc");

  // Initialize Google Places Service when map is loaded
  useEffect(() => {
    if (mapLoaded && map && window.google && window.google.maps) {
      try {
        // Create a div element for the Places service
        const placesDiv = document.createElement('div');
        placesDiv.style.display = 'none';
        document.body.appendChild(placesDiv);
        
        // Initialize the Places service with this div instead of the map
        placesServiceRef.current = new window.google.maps.places.PlacesService(placesDiv);
      } catch (err) {
        console.error("Error initializing Places service:", err);
        setError(
          "Failed to initialize Google Places service. Please try again later."
        );
      }
    }
  }, [mapLoaded, map]);

  // Get user's current location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Apply filters whenever lawyers or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [lawyers, selectedTypes, sortBy, sortOrder]);

  const getUserLocation = () => {
    setLoading(true);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          searchLawyers({ lat: latitude, lng: longitude }, radius);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Could not get your location. Using default location instead."
          );
          searchLawyers(defaultCenter, radius);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError(
        "Geolocation is not supported by your browser. Using default location."
      );
      searchLawyers(defaultCenter, radius);
    }
  };

  const handlePlaceSelect = (place) => {
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setUserLocation(location);
    setSearchQuery(place.formatted_address);
    searchLawyers(location, radius);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRadiusChange = (e) => {
    const newRadius = parseInt(e.target.value);
    setRadius(newRadius);
    searchLawyers(userLocation, newRadius);
  };

  const handleMapClick = (e) => {
    if (!mapLoaded) return;

    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setUserLocation(newLocation);
    searchLawyers(newLocation, radius);
  };

  const handleTypeChange = (e) => {
    setSelectedTypes(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const searchLawyers = (location, radiusKm) => {
    setLoading(true);
    setError(null);
    
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps API not loaded");
      setError("Google Maps API is not loaded. Please refresh the page and try again.");
      setLoading(false);
      return;
    }
    
    // Check if Places service is initialized
    if (!placesServiceRef.current) {
      console.error("Places service not initialized");
      setError(
        "Google Places service is not ready. Please try again in a moment."
      );
      setLoading(false);
      return;
    }

    try {
      // Use textSearch instead of nearbySearch for more reliable results
      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: radiusKm * 1000, // Convert to meters
        query: "lawyer attorney law firm",
        type: "lawyer"
      };

      // Create an array to store all results
      let allResults = [];
      
      // Function to handle search results and pagination
      const handleSearchResults = (results, status, pagination) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Add current page of results to our collection
          allResults = [...allResults, ...results];
          
          // If there are more results and we have pagination, get the next page
          if (pagination && pagination.hasNextPage) {
            pagination.nextPage();
          } else {
            // We've got all results, process them
            const lawyersData = allResults.map((place) => {
              // Get a random practice area for each lawyer (for demo purposes)
              const randomPracticeAreas = [];
              const numAreas = Math.floor(Math.random() * 4) + 1; // 1-4 practice areas
              
              for (let i = 0; i < numAreas; i++) {
                const randomIndex = Math.floor(Math.random() * practiceOptions.length);
                if (!randomPracticeAreas.includes(practiceOptions[randomIndex])) {
                  randomPracticeAreas.push(practiceOptions[randomIndex]);
                }
              }
              
              // Calculate distance
              const distanceValue = calculateDistance(
                location.lat,
                location.lng,
                place.geometry.location.lat(),
                place.geometry.location.lng()
              );
              
              // Format data to match LawyerCard component expectations
              return {
                id: place.place_id,
                name: place.name,
                location: place.formatted_address || place.vicinity,
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                photoURL: place.photos && place.photos.length > 0 
                  ? place.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 })
                  : null,
                distance: distanceValue.toFixed(1),
                type: randomPracticeAreas,
                yearsOfExperience: Math.floor(Math.random() * 20) + 1, // Random experience (1-20 years)
                consultationFees: Math.floor(Math.random() * 2000) + 500, // Random fees (500-2500)
                verified: Math.random() > 0.5, // 50% chance of being verified
                qualification: ["LLB", "LLM", "JD"][Math.floor(Math.random() * 3)], // Random qualification
                availableNow: Math.random() > 0.7, // 30% chance of being available now
                email: `${place.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                gender: Math.random() > 0.5 ? "Male" : "Female", // Random gender
              };
            });
            setLawyers(lawyersData);
            setError(null);
            setLoading(false);
          }
        } else {
          console.error("Places search failed:", status);
          setLawyers([]);
          setError(getPlacesErrorMessage(status));
          setLoading(false);
        }
      };

      // Start the search with our callback that handles pagination
      placesServiceRef.current.textSearch(request, handleSearchResults);
    } catch (err) {
      console.error("Error in searchLawyers:", err);
      setError(
        "An error occurred while searching for lawyers. Please try again."
      );
      setLawyers([]);
      setLoading(false);
    }
  };

  const getPlacesErrorMessage = (status) => {
    switch (status) {
      case window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS:
        return "No lawyers found in this area. Try increasing the search radius.";
      case window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT:
        return "Too many requests. Please try again later.";
      case window.google.maps.places.PlacesServiceStatus.REQUEST_DENIED:
        return "Request was denied. Please check your API key configuration.";
      default:
        return "An error occurred while searching. Please try again.";
    }
  };

  const applyFilters = () => {
    let filtered = [...lawyers];

    // Sort results
    if (sortBy === "distance") {
      filtered.sort((a, b) => {
        return sortOrder === "asc"
          ? parseFloat(a.distance) - parseFloat(b.distance)
          : parseFloat(b.distance) - parseFloat(a.distance);
      });
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => {
        return sortOrder === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      });
    }

    setFilteredLawyers(filtered);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
    return R * c;
  };

  const renderMarkerIcon = () => {
    if (!mapLoaded) return null;

    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#059669",
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: "#ffffff",
    };
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSortBy("distance");
    setSortOrder("asc");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 p-4 md:p-6">
          Find Lawyers Near You
        </h1>

        {error && (
          <div className="mx-4 md:mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Location
                </label>
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Enter a location"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={getUserLocation}
                  className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Use My Current Location
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with filters */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Filters
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Radius
                  </label>
                  <select
                    value={radius}
                    onChange={handleRadiusChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  >
                    {radiusOptions.map((option) => (
                      <option key={option} value={option}>
                        Within {option} km
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={handleSortChange}
                      className="w-3/4 p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="distance">Distance</option>
                      <option value="rating">Rating</option>
                    </select>
                    <button
                      onClick={toggleSortOrder}
                      className="flex-1 p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      {sortOrder === "asc" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mx-auto"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>

              {/* Map in sidebar */}
              <div className="bg-white rounded-lg shadow-md p-4 hidden md:block">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Map View
                </h2>
                <LoadScript
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  libraries={mapLibraries}
                  onLoad={() => setMapLoaded(true)}
                  loadingElement={<div>Loading Maps...</div>}
                >
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={userLocation}
                    zoom={12}
                    onClick={handleMapClick}
                    onLoad={(map) => setMap(map)}
                  >
                    {/* User location marker */}
                    {mapLoaded && (
                      <Marker
                        position={userLocation}
                        icon={renderMarkerIcon()}
                      />
                    )}

                    {/* Search radius circle */}
                    {mapLoaded && (
                      <Circle
                        center={userLocation}
                        radius={radius * 1000}
                        options={{
                          fillColor: "#10B981",
                          fillOpacity: 0.2,
                          strokeColor: "#059669",
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                        }}
                      />
                    )}

                    {/* Lawyer markers */}
                    {mapLoaded &&
                      filteredLawyers.map((lawyer) => (
                        <Marker
                          key={lawyer.id}
                          position={{
                            lat: lawyer.latitude,
                            lng: lawyer.longitude,
                          }}
                          onClick={() => {
                            if (map) {
                              map.panTo({
                                lat: lawyer.latitude,
                                lng: lawyer.longitude,
                              });
                              map.setZoom(15);
                            }
                          }}
                        />
                      ))}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>

            {/* Main content - Lawyer listings */}
            <div className="md:w-2/3 lg:w-3/4">
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
                  <p className="mt-2 text-gray-600">Searching for lawyers...</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <h2 className="text-xl font-semibold p-4 bg-teal-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-teal-700">
                      {filteredLawyers.length} Lawyers Found
                    </span>
                    <span className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                      Within {radius} km
                    </span>
                  </h2>

                  {filteredLawyers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No lawyers found in this area. Try adjusting your search
                      radius or location.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredLawyers.map((lawyer) => (
                        <LawyerCard key={lawyer.id} lawyer={lawyer} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchLawyers;
