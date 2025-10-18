import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { useContentTranslation } from '@/hooks/useContentTranslation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { mapSlidesWithImageUrl } from './helper';

interface LocationData {
  id: string;
  name: string;
  type: 'museum' | 'heritage';
  coordinates: [number, number];
  region: string;
  address: string;
  description: string;
  image: string;
  openingHours?: string;
  ticketPrice?: string;
  contact?: string;
}

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

const IndonesiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'museum' | 'heritage'>('all');
  const [locations, setLocations] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { translatedContent: translatedLocations } = useContentTranslation(locations);
  const { translatedContent: translatedTypes } = useContentTranslation(types);

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
  // Filter locations based on current filter
  useEffect(() => {
    if(filter === 'all') {
      setFilteredLocations(locations);
    } else if(filter === 'museum') {
      setFilteredLocations(locations.filter(loc => (translatedTypes || types).find((type) => type.id === loc.type)?.name === 'museum'));
    } else {
      setFilteredLocations(locations.filter(loc => (translatedTypes || types).find((type) => type.id === loc.type)?.name !== 'museum'));
    }
  }, [filter, locations, types, translatedTypes])

  useEffect(() => {
    if (!mapContainer.current || map.current) { return };

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

  // Update markers when filter changes
  useEffect(() => {
    if (!map.current) { return };

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current!.removeLayer(layer);
      }
    });

    // Create custom icon function
    const createCustomIcon = (location: LocationData) => {
      const typeName = (translatedTypes || types).find((type) => type.id === location.type)?.name;
      const color = typeName === 'museum' ? '#3b82f6' : '#10b981';
      const icon = '🏛️';
      return L.divIcon({
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
    };
    // Add markers for filtered locations
    (translatedLocations || filteredLocations).forEach((location) => {
      if (!location.latitude || !location.longitude) { return };
      let coords: [number, number];
      try {
        coords = [parseFloat(location.latitude), parseFloat(location.longitude)];
        // coords = JSON.parse(location.coordinates);
      } catch {
        return;
      }
      const marker = L.marker(coords, {
        icon: createCustomIcon(location),
      }).addTo(map.current!);

      // Create popup content with better button handling
      const popupContent = `
        <div style="padding: 16px; min-width: 280px; max-width: 320px;">
          <div style="margin-bottom: 12px;">
            <img src="${getMuseumsImageUrl(location.image_url)}" alt="${fixBrokenHtmlTags(location.name || location.title)}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #1f2937;">${fixBrokenHtmlTags(location.name || location.title)}</h3>
            <span style="background-color: ${(translatedTypes || types).find((type) => type.id === location.type)?.name === 'museum' ? '#3b82f6' : '#10b981'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">${(translatedTypes || types).find((type) => type.id === location.type)?.name}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px; line-height: 1.4;">${fixBrokenHtmlTags(location.subtitle)}</p>
          <div style="margin-bottom: 12px;">
            <div style="margin-bottom: 6px;">
              <strong style="color: #374151; font-size: 12px;">📍 ${t('map.addressLabel')}</strong>
              <p style="color: #6b7280; font-size: 12px; margin: 2px 0;">${fixBrokenHtmlTags(location.address)}</p>
            </div>
            ${location.openingHours ? `
              <div style="margin-bottom: 6px;">
                <strong style="color: #374151; font-size: 12px;">🕒 Jam Buka:</strong>
                <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${fixBrokenHtmlTags(location.openingHours)}</span>
              </div>
            ` : ''}
            ${location.ticketPrice ? `
              <div style="margin-bottom: 6px;">
                <strong style="color: #374151; font-size: 12px;">💰 Tiket:</strong>
                <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${fixBrokenHtmlTags(location.ticketPrice)}</span>
              </div>
            ` : ''}
          </div>
          <div style="display: flex; gap: 8px; position: relative; z-index: 10000;">
            <button
              class="popup-btn-detail"
              data-id="${location.id}"
              data-type="${(translatedTypes || types).find((type) => type.id === location.type)?.name}"
              data-typeid="${(translatedTypes || types).find((type) => type.id === location.type)?.id}"
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
              ${t('map.seeDetails')}
            </button>
            <button
              class="popup-btn-list"
              data-region="${location.region}"
              data-type="${(translatedTypes || types).find((type) => type.id === location.type)?.name}"
              data-typeid="${(translatedTypes || types).find((type) => type.id === location.type)?.id}"
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
              ${t('map.seeList')}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        autoPan: true,
        // autoPanPadding: L.point(50, 50), // jarak aman dari tepi peta
        keepInView: true,
        offset: [0, -16],
        closeButton: true,
        autoClose: false,
        className: 'custom-popup',
        maxWidth: 320
      });

      // Add click event listeners after popup opens
      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        if (!map.current || !popup) { return };

        const popupEl = popup.getElement();
        if (!popupEl) { return };

        if ((popupEl as any)._styled) { return };
        (popupEl as any)._styled = true;

        const mapSize = map.current.getSize();
        const markerPoint = map.current.latLngToContainerPoint(marker.getLatLng());
        const tip = popupEl.querySelector('.leaflet-popup-tip') as HTMLElement;
        if (!tip) { return };

        // reset
        ['top', 'bottom', 'left', 'right'].forEach((pos) => {
          tip.style.removeProperty(pos);
        });

        // default: atas marker
        popupEl.style.setProperty('transform-origin', 'bottom center');
        tip.style.setProperty('bottom', '-12px');

        // atur posisi sesuai lokasi marker di map
        if (markerPoint.y < mapSize.y / 3) {
          // bawah
          popupEl.style.setProperty('transform-origin', 'top center');
          tip.style.setProperty('top', '-12px');
        } else if (markerPoint.x < mapSize.x / 3) {
          // kanan
          popupEl.style.setProperty('transform-origin', 'center left');
          tip.style.setProperty('left', '-12px');
        } else if (markerPoint.x > (mapSize.x * 2) / 3) {
          // kiri
          popupEl.style.setProperty('transform-origin', 'center right');
          tip.style.setProperty('right', '-12px');
        }

        // Add event listener for detail button
        const detailBtn = popupEl.querySelector('.popup-btn-detail');
        if (detailBtn) {
          detailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = (detailBtn as HTMLElement).dataset.id;
            navigate(`/museum/${id}`);
            // const type = (detailBtn as HTMLElement).dataset.type;
            // if (type === 'museum') {
            //   navigate(`/museum/${id}`);
            // } else {
            //   navigate(`/heritage/${id}`);
            // }
          });
        }
        
        // Add event listener for list button
        const listBtn = popupEl.querySelector('.popup-btn-list');
        if (listBtn) {
          listBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const typeid = (detailBtn as HTMLElement).dataset.typeid;
            navigate(`/museums/${typeid}`);
            // const type = (listBtn as HTMLElement).dataset.type;
            // if (type === 'museum') {
            //   navigate(`/museums/${typeid}`);
            // } else {
            //   navigate(`/heritage`);
            // }
          });
        }
      });

      // Add hover effects
      marker.on('mouseover', function() {
        const el = this.getElement();
        if (el) {
          el.style.transition = 'transform 0.2s ease';
          el.style.transform += 'scale(1.2)'; 
        }
      });

      marker.on('mouseout', function() {
        const el = this.getElement();
        if (el) {
          el.style.transform = el.style.transform.replace(" scale(1.2)", ""); // balikin lagi
        }
      });
    });

  }, [filteredLocations, types, navigate, translatedLocations, translatedTypes, t]);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">
          {t('map.interactiveMap')}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-500/30">
              🏛️ Museum: {locations.filter(l => l.type === '12bc00a9-ba1a-4562-940d-4e33bb26acdc').length}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
              🏛️ Cagar Budaya: {locations.filter(l => l.type !== '12bc00a9-ba1a-4562-940d-4e33bb26acdc').length}
            </Badge>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'museum' | 'heritage')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filter.museum.categoryAll')}</SelectItem>
              <SelectItem value="museum">{t('filter.museum.categoryMuseum')}</SelectItem>
              <SelectItem value="heritage">{t('filter.museum.categoryHeritage')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        {t('map.clickMarker')}
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