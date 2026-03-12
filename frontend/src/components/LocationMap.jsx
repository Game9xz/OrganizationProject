import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useLongdoMap } from '../hooks/useLongdoMap';

const LocationMap = forwardRef(({ onLocationChange, initialLocation }, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isMapReady = useLongdoMap('391bb8f4015c8ab179b4714d3f2942bb');

  const searchLocation = (keyword) => {
    if (mapInstanceRef.current && window.longdo && mapInstanceRef.current.Search) {
      // Use general search for better address and POI matching
      mapInstanceRef.current.Search.search(keyword, {
        limit: 1,
        callback: (results) => {
          if (results && results.data && results.data.length > 0) {
            const { lon, lat, name, address } = results.data[0];
            const fullAddress = name || address || keyword;
            
            mapInstanceRef.current.location({ lon, lat }, true);
            if (markerRef.current && typeof markerRef.current.location === 'function') {
              markerRef.current.location({ lon, lat });
            } else if (window.longdo.Marker) {
              // If marker doesn't exist, create one
              const marker = createMarker({ lon, lat }, mapInstanceRef.current);
              markerRef.current = marker;
            }
            onLocationChange({ lon, lat, address: fullAddress });
          }
        }
      });
    }
  };

  useImperativeHandle(ref, () => ({
    searchLocation
  }));

  const createMarker = (location, map) => {
    if (!window.longdo || !window.longdo.Marker) return null;
    
    const marker = new window.longdo.Marker({
      lon: location.lon,
      lat: location.lat,
      draggable: true,
    });
    
    // Handle click on marker (OverlayClick)
    marker.on('click', (e) => {
      const loc = e.target.location();
      if (loc) {
        const { lon, lat } = loc;
        getAddress(lon, lat, (address) => {
          onLocationChange({ lon, lat, address });
        });
      }
    });

    // Handle dragging (OverlayChange)
    marker.on('drag', (e) => {
      if (e && e.target && typeof e.target.location === 'function') {
        const loc = e.target.location();
        if (loc) {
          const { lon, lat } = loc;
          // While dragging, we can update coordinates but maybe skip heavy Geocoder calls 
          // to keep it smooth, or use a throttle. For now, let's keep it consistent.
          getAddress(lon, lat, (address) => {
            onLocationChange({ lon, lat, address });
          });
        }
      }
    });

    // Handle drag end (OverlayDrop)
    marker.on('drop', (e) => {
      const loc = e.target.location();
      if (loc) {
        const { lon, lat } = loc;
        getAddress(lon, lat, (address) => {
          onLocationChange({ lon, lat, address });
        });
      }
    });

    map.Overlays.add(marker);
    return marker;
  };

  const getAddress = (lon, lat, callback) => {
    if (window.longdo && window.longdo.Geocoder) {
      new window.longdo.Geocoder().location({ lon, lat }, (result) => {
        if (result) {
          const subdistrict = result.subdistrict ? `${result.subdistrict}, ` : "";
          const district = result.district ? `${result.district}, ` : "";
          const province = result.province ? result.province : "";
          const road = result.road ? `${result.road}, ` : "";
          const address = `${road}${subdistrict}${district}${province}`.replace(/, $/, '');
          callback(address);
        } else {
          callback("");
        }
      });
    } else {
      callback("");
    }
  };

  useEffect(() => {
    if (isMapReady && mapRef.current && !mapInstanceRef.current) {
      try {
        const longdo = window.longdo;
        if (!longdo || !longdo.Map) {
          console.warn("Longdo Map API is ready but longdo.Map is not available yet.");
          return;
        }
        
        const map = new longdo.Map({
          placeholder: mapRef.current,
          crosshair: false, // Remove the red '+' in the middle
        });
        mapInstanceRef.current = map;

        // Add standard map controls
        map.Ui.add(longdo.StaticControl.Zoom);
        map.Ui.add(longdo.StaticControl.LayerSelector);

        const startLocation =
          initialLocation && typeof initialLocation === 'object' && initialLocation.lon && initialLocation.lat
            ? { lon: initialLocation.lon, lat: initialLocation.lat }
            : { lon: 100.5383, lat: 13.7649 };

        map.location(startLocation, true);

        const marker = createMarker(startLocation, map);
        markerRef.current = marker;

        map.on('click', (e) => {
          if (e && e.location) {
            const { lon, lat } = e.location;
            if (markerRef.current && typeof markerRef.current.location === 'function') {
              markerRef.current.location({ lon, lat });
            } else if (longdo.Marker) {
              const marker = createMarker({ lon, lat }, map);
              markerRef.current = marker;
            }
            getAddress(lon, lat, (address) => {
              onLocationChange({ lon, lat, address: address });
            });
          }
        });

        // Add a checkResize call after a short delay to ensure correct rendering in sidebars/modals
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.checkResize();
          }
        }, 300);

        // Search from within map is removed to use the external input in Modal
      } catch (err) {
        console.error("Error initializing Longdo Map:", err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        // Clear map instance safely
        try {
          if (typeof mapInstanceRef.current.destroy === 'function') {
            mapInstanceRef.current.destroy();
          }
        } catch (e) {
          console.warn("Longdo Map destroy failed:", e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [isMapReady]);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const startLocation =
        initialLocation && typeof initialLocation === 'object' && initialLocation.lon && initialLocation.lat
          ? { lon: initialLocation.lon, lat: initialLocation.lat }
          : { lon: 100.5383, lat: 13.7649 };
      mapInstanceRef.current.location(startLocation, true);
      markerRef.current.location(startLocation);
    }
  }, [initialLocation]);

  return <div ref={mapRef} style={{ width: '100%', height: '300px', borderRadius: '16px' }}></div>;
});

export default LocationMap;
