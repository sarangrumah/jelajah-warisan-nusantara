import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslate } from '@/hooks/useTranslate.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { mapSlidesWithImageUrl } from './helper';

const museumsImages = import.meta.glob('../assets/museums/*', { eager: true });

function getMuseumsImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
  const justFile = filename?.split('/').pop() || filename;
  const match = Object.entries(museumsImages).find(([path]) => path.endsWith(justFile));
  if (match) {
    return (match[1] as any).default;
  }
  // Fallback: try public/assets/museums/ for production
  if (justFile) {
    return `/assets/museums/${justFile}`;
  }
  return undefined;
}

const MapMarker = ({ location, map, types }: { location: any, map: L.Map, types: any[] }) => {
    const navigate = useNavigate();
    const { translatedText: name } = useTranslate(location.name || location.title);
    const { translatedText: subtitle } = useTranslate(location.subtitle);
    const { translatedText: address } = useTranslate(location.address);
    const { translatedText: openingHours } = useTranslate(location.openingHours);
    const { translatedText: ticketPrice } = useTranslate(location.ticketPrice);
    const { translatedText: addressLabel } = useTranslate('Alamat:');
    const { translatedText: seeDetailsLabel } = useTranslate('Lihat Detail');
    const { translatedText: seeListLabel } = useTranslate('Lihat Daftar');

    useEffect(() => {
        if (!map || !location.latitude || !location.longitude) { return; }

        const coords: [number, number] = [parseFloat(location.latitude), parseFloat(location.longitude)];

        const typeName = types.find((type) => type.id === location.type)?.name;
        const color = typeName === 'museum' ? '#3b82f6' : '#10b981';
        const icon = '🏛️';

        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                width: 32px;
                height: 32px;
                background-color: ${color};
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                cursor: pointer;
                transition: transform 0.2s ease;
              ">${icon}</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);
    
        const popupContent = `
          <div style="padding: 16px; min-width: 280px; max-width: 320px;">
            <div style="margin-bottom: 12px;">
              <img src="${getMuseumsImageUrl(location.image_url)}" alt="${name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
              <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #1f2937;">${name}</h3>
              <span style="background-color: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">${typeName}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px; line-height: 1.4;">${subtitle}</p>
            <div style="margin-bottom: 12px;">
              <div style="margin-bottom: 6px;">
                <strong style="color: #374151; font-size: 12px;">📍 ${addressLabel}</strong>
                <p style="color: #6b7280; font-size: 12px; margin: 2px 0;">${address}</p>
              </div>
              ${openingHours ? `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #374151; font-size: 12px;">🕒 Jam Buka:</strong>
                  <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${openingHours}</span>
                </div>
              ` : ''}
              ${ticketPrice ? `
                <div style="margin-bottom: 6px;">
                  <strong style="color: #374151; font-size: 12px;">💰 Tiket:</strong>
                  <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${ticketPrice}</span>
                </div>
              ` : ''}
            </div>
            <div style="display: flex; gap: 8px; position: relative; z-index: 10000;">
              <button
                class="popup-btn-detail"
                data-id="${location.id}"
                style="
                  flex: 1;
                  background-color: #3b82f6;
                  color: white;
                  padding: 10px 12px;
                  border: none;
                  border-radius: 6px;
                  font-size: 12px;
                  cursor: pointer;
                  font-weight: 500;
                  transition: background-color 0.2s ease;
                  pointer-events: auto;
                  position: relative;
                  z-index: 10001;
                "
                onmouseover="this.style.backgroundColor='#2563eb'"
                onmouseout="this.style.backgroundColor='#3b82f6'"
              >
                ${seeDetailsLabel}
              </button>
              <button
                class="popup-btn-list"
                data-typeid="${location.type}"
                style="
                  flex: 1;
                  background-color: #10b981;
                  color: white;
                  padding: 10px 12px;
                  border: none;
                  border-radius: 6px;
                  font-size: 12px;
                  cursor: pointer;
                  font-weight: 500;
                  transition: background-color 0.2s ease;
                  pointer-events: auto;
                  position: relative;
                  z-index: 10001;
                "
                onmouseover="this.style.backgroundColor='#059669'"
                onmouseout="this.style.backgroundColor='#10b981'"
              >
                ${seeListLabel}
              </button>
            </div>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
            autoPan: true,
            keepInView: true,
            offset: [0, -16],
            closeButton: true,
            autoClose: false,
            className: 'custom-popup',
            maxWidth: 320
        });
    
        marker.on('popupopen', () => {
            const popup = marker.getPopup();
            if (!map || !popup) { return; }
            const detailBtn = popup.getElement()?.querySelector('.popup-btn-detail');
            if (detailBtn) {
                detailBtn.addEventListener('click', () => navigate(`/museum/${location.id}`));
            }
            const listBtn = popup.getElement()?.querySelector('.popup-btn-list');
            if (listBtn) {
                listBtn.addEventListener('click', () => navigate(`/museums/${location.type}`));
            }
        });
    
        return () => {
          // Check if map and marker still exist before removing
          if (map && marker) {
            try {
              map.removeLayer(marker);
            } catch (e) {
              console.warn('Error removing marker:', e);
            }
          }
        };
    }, [map, location, types, name, subtitle, address, openingHours, ticketPrice, addressLabel, seeDetailsLabel, seeListLabel, navigate]);

    return null;
};

const IndonesiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [filter, setFilter] = useState<'all' | 'museum' | 'heritage'>('all');
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  
  const { translatedText: interactiveMapLabel } = useTranslate('Peta Interaktif');
  const { translatedText: allCategoriesLabel } = useTranslate('Semua Kategori');
  const { translatedText: museumLabel } = useTranslate('Museum');
  const { translatedText: heritageLabel } = useTranslate('Cagar Budaya');
  const { translatedText: clickMarkerLabel } = useTranslate('Klik penanda untuk detail lebih lanjut');
  const { translatedText: legendTitle } = useTranslate('Legenda:');
  const { translatedText: museumLegendText } = useTranslate('Museum');
  const { translatedText: heritageLegendText } = useTranslate('Cagar Budaya');

  const fetchLocations = async () => {
    try {
      const museum = await museumService.getAll();
      if (museum.error || museum.data.length === 0) {
        throw new Error('Error fetching museums: ' + museum.error);
      } else {
        const filteredMuseums = museum.data.filter((museum: any) => museum.is_active === true && museum.is_approved === true);
        setLocations(mapSlidesWithImageUrl(filteredMuseums));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }
  
  useEffect(() => {
    fetchLocations();
  },[])

  const fetchType = async () => {
    try {
      const response = await TypesAndCategoriesSites.getAllTypes();
      if (response.error || response.data.length === 0) {
        console.error('Error fetching types:', response.error);
      } else {
        setTypes(response.data);
      }
    } catch (error) {
      console.error('Error fetching museums:', error);
    }
  };
  
  useEffect(() => {
    fetchType();
  }, []);

  useEffect(() => {
    // Get museum type ID first, like in Museum.tsx and Heritage.tsx
    const museumTypeId = types.find((t) => t.name?.toLowerCase() === 'museum')?.id;
    
    if(filter === 'all') {
      setFilteredLocations(locations);
    } else if(filter === 'museum') {
      // Filter locations that match museum type ID
      const museumLocations = locations.filter(loc => loc.type === museumTypeId);
      setFilteredLocations(museumLocations);
    } else {
      // Filter locations that don't match museum type ID (heritage sites)
      const heritageLocations = locations.filter(loc => loc.type !== museumTypeId);
      setFilteredLocations(heritageLocations);
    }
  }, [filter, locations, types])

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) { return };

    mapInstance.current = L.map(mapContainer.current, {
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(mapInstance.current);

    const indonesiaBounds = L.latLngBounds(
      [-11.0, 95.0],
      [6.0, 141.0]
    );
    mapInstance.current.setMaxBounds(indonesiaBounds);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">
          {interactiveMapLabel}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-500/30">
              🏛️ {museumLabel}: {(() => {
                const museumTypeId = types.find((t) => t.name?.toLowerCase() === 'museum')?.id;
                return locations.filter(l => l.type === museumTypeId).length;
              })()}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
              🏛️ {heritageLabel}: {(() => {
                const museumTypeId = types.find((t) => t.name?.toLowerCase() === 'museum')?.id;
                return locations.filter(l => l.type !== museumTypeId).length;
              })()}
            </Badge>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'museum' | 'heritage')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{allCategoriesLabel}</SelectItem>
              <SelectItem value="museum">{museumLabel}</SelectItem>
              <SelectItem value="heritage">{heritageLabel}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />
        {mapInstance.current && filteredLocations.map(location => (
            <MapMarker key={location.id} location={location} map={mapInstance.current} types={types} />
        ))}
      </div>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs font-semibold text-foreground mb-2">{legendTitle}</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-white text-[8px]">🏛️</span>
            </div>
            <span className="text-xs text-foreground">{museumLegendText}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <span className="text-white text-[8px]">🏛️</span>
            </div>
            <span className="text-xs text-foreground">{heritageLegendText}</span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground mt-4 text-center text-sm">
        {clickMarkerLabel}
      </p>
       <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          z-index: 10000 !important;
          position: relative !important;
        }
        .custom-popup .leaflet-popup-tip {
          background: white !important;
          z-index: 10000 !important;
        }
        .custom-popup {
          z-index: 10000 !important;
        }
        .leaflet-popup-pane {
          z-index: 10000 !important;
        }
        .popup-btn-detail, .popup-btn-list {
          touch-action: manipulation !important;
          user-select: none !important;
          pointer-events: auto !important;
        }
        .popup-btn-detail:active, .popup-btn-list:active {
          transform: scale(0.95) !important;
        }
      `}</style>
    </div>
  );
};

export default IndonesiaMap;