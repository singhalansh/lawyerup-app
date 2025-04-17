import { useState, useEffect, useRef } from "react";
import { useFirebase } from "../context/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import MultiSelect from "./ui/multiselect";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_MAP_API_KEY;

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const practiceOptions = [
  "Civil",
  "Criminal",
  "Corporate",
  "Family",
  "Property",
  "Labor",
];

function LawyerProfileSetup({ user, onComplete }) {
  const { getDefaultAvatarUrl } = useFirebase();
  const db = getFirestore();
  const [formData, setFormData] = useState({
    name: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || getDefaultAvatarUrl(user.uid),
    age: "",
    gender: "",
    location: "",
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    yearsOfExperience: "",
    qualification: "",
    contact: "",
    consultationFees: "",
    type: [],
  });

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [map, setMap] = useState(null);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Automatically fetch the user's current location
    getUserLocation();
    if (window.google) {
      initializeAutocomplete();
    }
  }, []);

  useEffect(() => {
    if (searchInputRef.current && window.google) {
      initializeAutocomplete();
    }
  }, [window.google]);

  const initializeAutocomplete = () => {
    if (searchInputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        { types: ["geocode"] }
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          handlePlaceSelect(place);
        }
      });
    }
  };

  const handlePlaceSelect = (place) => {
    const location = place.geometry.location;
    setFormData({
      ...formData,
      latitude: location.lat(),
      longitude: location.lng(),
      location: place.formatted_address,
    });
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          updateLocation(defaultCenter.lat, defaultCenter.lng);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      updateLocation(defaultCenter.lat, defaultCenter.lng);
    }
  };

  const updateLocation = (latitude, longitude) => {
    setFormData((prevData) => ({
      ...prevData,
      latitude,
      longitude,
    }));
    fetchLocationDetails(latitude, longitude);
  };

  const fetchLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          location: data.results[0].formatted_address,
        }));
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    updateLocation(lat, lng);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChange = (e) => {
    if (e.target.name === "type") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare user data
      const userData = {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        location: formData.location,
        coordinates: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        photoURL: formData.photoURL,
        yearsOfExperience: formData.yearsOfExperience,
        qualification: formData.qualification,
        contact: formData.contact,
        consultationFees: formData.consultationFees,
        type: formData.type,
        createdAt: new Date(),
        updatedAt: new Date(),
        userType: "lawyer",
      };

      // Reference to the user document
      const userDocRef = doc(db, "users", user.uid);

      // Set/update the document
      await setDoc(userDocRef, userData, { merge: true });

      onComplete(); // Proceed after successful save
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Complete Your Lawyer Profile
        </h2>

        {/* Profile Image Display */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={formData.photoURL}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
        />

        <div className="flex gap-4 mb-3">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex gap-4 mb-3">
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />

          <input
            type="number"
            name="consultationFees"
            placeholder="Consultation Fees"
            value={formData.consultationFees}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Location:
          </label>
          <input
            type="text"
            ref={searchInputRef}
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for your location"
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <LoadScript
          googleMapsApiKey={GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: formData.latitude, lng: formData.longitude }}
            zoom={10}
            onClick={handleMapClick}
            onLoad={(map) => setMap(map)}
          >
            <Marker
              position={{ lat: formData.latitude, lng: formData.longitude }}
            />
          </GoogleMap>
        </LoadScript>

        <div className="flex justify-between items-center mt-2 mb-3">
          <p className="text-sm text-gray-600">
            Selected Location:{" "}
            {formData.location || "Fetching your location..."}
          </p>
          <button
            onClick={getUserLocation}
            className="text-sm text-teal-600 hover:text-teal-800 font-medium"
          >
            Use Current Location
          </button>
        </div>

        <div className="flex gap-4 mb-3">
          <input
            type="number"
            name="yearsOfExperience"
            placeholder="Years of Experience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 shadow-sm"
          />
        </div>

        <MultiSelect
          name="type"
          label="Practice Type(s):"
          options={practiceOptions}
          value={formData.type}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-all font-medium shadow"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default LawyerProfileSetup;
