import React from "react";
import { useEffect,useState } from "react";
import { GoogleMap, useJsApiLoader,Circle,Polyline } from "@react-google-maps/api";
const containerStyle = {
  width: "82.8rem",
  height: "45.8rem",
};


function Main() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCCpvJNEowk2e6OOkeKWRhaQD-A-8SArSE",
  });
  const [map, setMap] = React.useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [path, setPath] = useState([]);
  
  const [pathColor, setPathColor] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };

          setCurrentLocation(newPosition);
          setPath((prevPath) => [...prevPath, newPosition]);

          // Change the path color to green
          setPathColor("green");
        });
      }
    };

    const locationInterval = setInterval(getLocation, 1000); // Update every 1 second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(locationInterval);
  }, []);


  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {currentLocation && (
        <Circle
          center={currentLocation}
          radius={10} // Specify the radius in meters
        />
      )}
       {path.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: "#00FF00", // Green path color
            strokeOpacity:2,
            strokeWeight: 10,
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <div className=" text-center">
    Your Map is Loading
    </div>
  );
}

export default Main;
