import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export function useLocation() {
  return useContext(LocationContext);
}

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState({
    city: "Detecting...",
    country: "",
    currency: "INR",
  });

  useEffect(() => {
    fetchLocation();
  }, []);

  async function fetchLocation() {
    // Try Browser Geolocation API first for precision
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode to get city name using Nominatim (free)
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`);
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Chennai";
            
            setUserLocation({
              city: city,
              country: data.address.country || "India",
              currency: "INR",
            });
          } catch (err) {
            console.error("Reverse geocoding failed, trying IP fallback...", err);
            fetchIPLocation();
          }
        },
        (err) => {
          console.error("Geolocation denied or failed, trying IP fallback...", err);
          fetchIPLocation();
        },
        { timeout: 10000 }
      );
    } else {
      fetchIPLocation();
    }
  }

  async function fetchIPLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      if (data.city) {
        setUserLocation({
          city: data.city,
          country: data.country_name || "India",
          currency: data.currency || "INR",
        });
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.error("IP fallback failed, using defaults", err);
      setUserLocation({ city: "Mumbai", country: "India", currency: "INR" });
    }
  }

  const value = {
    userLocation,
    fetchLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}
