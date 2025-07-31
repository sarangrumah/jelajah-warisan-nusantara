import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RegionData {
  name: string;
  museums: number;
  heritage: number;
  coordinates: [number, number];
  color: string;
}

const IndonesiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  const regions: RegionData[] = [
    { name: 'Sumatera', museums: 45, heritage: 123, coordinates: [0.5, 101.0], color: '#3b82f6' },
    { name: 'Jawa', museums: 187, heritage: 456, coordinates: [-7.5, 110.0], color: '#10b981' },
    { name: 'Kalimantan', museums: 23, heritage: 78, coordinates: [-2.0, 114.0], color: '#f59e0b' },
    { name: 'Sulawesi', museums: 34, heritage: 92, coordinates: [-2.5, 120.0], color: '#8b5cf6' },
    { name: 'Papua', museums: 12, heritage: 34, coordinates: [-4.0, 140.0], color: '#ef4444' },
    { name: 'Maluku & Nusa Tenggara', museums: 18, heritage: 56, coordinates: [-8.5, 125.0], color: '#f97316' },
  ];

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current, {
      center: [-2.6, 118.0],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map.current);

    // Create custom icon function
    const createCustomIcon = (region: RegionData) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 40px;
            height: 40px;
            background-color: ${region.color};
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">${region.museums}</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    };

    // Add markers for each region
    regions.forEach((region) => {
      const marker = L.marker(region.coordinates, {
        icon: createCustomIcon(region),
      }).addTo(map.current!);

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #1f2937;">${region.name}</h3>
          <div style="space-y: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="color: #6b7280;">Museum:</span>
              <span style="font-weight: bold; color: #1f2937;">${region.museums}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280;">Cagar Budaya:</span>
              <span style="font-weight: bold; color: #1f2937;">${region.heritage}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        offset: [0, -20],
        closeButton: true,
        autoClose: false,
        className: 'custom-popup'
      });

      // Add hover effects
      marker.on('mouseover', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1.1)');
      });

      marker.on('mouseout', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1)');
      });
    });

    // Set bounds to Indonesia
    const indonesiaBounds = L.latLngBounds(
      [-11.0, 95.0], // Southwest coordinates
      [6.0, 141.0]   // Northeast coordinates
    );
    map.current.setMaxBounds(indonesiaBounds);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Peta Interaktif Indonesia
      </h3>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Klik pada marker untuk melihat detail distribusi museum dan cagar budaya di setiap region
      </p>
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </div>
  );
};

export default IndonesiaMap;