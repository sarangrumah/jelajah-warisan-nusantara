import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface RegionData {
  name: string;
  museums: number;
  heritage: number;
  coordinates: [number, number];
  color: string;
}

const IndonesiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  const regions: RegionData[] = [
    { name: 'Sumatera', museums: 45, heritage: 123, coordinates: [101.0, 0.5], color: '#3b82f6' },
    { name: 'Jawa', museums: 187, heritage: 456, coordinates: [110.0, -7.5], color: '#10b981' },
    { name: 'Kalimantan', museums: 23, heritage: 78, coordinates: [114.0, -2.0], color: '#f59e0b' },
    { name: 'Sulawesi', museums: 34, heritage: 92, coordinates: [120.0, -2.5], color: '#8b5cf6' },
    { name: 'Papua', museums: 12, heritage: 34, coordinates: [140.0, -4.0], color: '#ef4444' },
    { name: 'Maluku & Nusa Tenggara', museums: 18, heritage: 56, coordinates: [125.0, -8.5], color: '#f97316' },
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [118.0, -2.6],
      zoom: 4.5,
      pitch: 0,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      // Add markers for each region
      regions.forEach((region) => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 40px;
          height: 40px;
          background-color: ${region.color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        `;
        markerElement.textContent = region.museums.toString();

        // Create popup content
        const popupContent = `
          <div class="p-4">
            <h3 class="font-bold text-lg mb-2">${region.name}</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span>Museum:</span>
                <span class="font-bold">${region.museums}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Cagar Budaya:</span>
                <span class="font-bold">${region.heritage}</span>
              </div>
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent);

        new mapboxgl.Marker(markerElement)
          .setLngLat(region.coordinates)
          .setPopup(popup)
          .addTo(map.current!);
      });
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
          Peta Interaktif Indonesia
        </h3>
        <p className="text-muted-foreground mb-6 text-center">
          Masukkan Mapbox token untuk menampilkan peta interaktif distribusi museum dan cagar budaya.
        </p>
        <div className="flex gap-4 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Masukkan Mapbox Public Token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit}>
            Tampilkan Peta
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Dapatkan token gratis di{' '}
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
      </div>
    );
  }

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
    </div>
  );
};

export default IndonesiaMap;