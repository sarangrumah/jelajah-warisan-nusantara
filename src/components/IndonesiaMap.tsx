import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

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

const IndonesiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'museum' | 'heritage'>('all');

  const locations: LocationData[] = [
    // Museums
    {
      id: '1',
      name: 'Museum Nasional',
      type: 'museum',
      coordinates: [-6.1751, 106.8200],
      region: 'Jawa',
      address: 'Jl. Medan Merdeka Barat No.12, Jakarta Pusat',
      description: 'Museum sejarah dan budaya Indonesia terlengkap',
      image: '/src/assets/museum-interior.jpg',
      openingHours: '08:00 - 16:00',
      ticketPrice: 'Rp 10.000',
      contact: '(021) 3868172'
    },
    {
      id: '2',
      name: 'Museum Geology',
      type: 'museum',
      coordinates: [-6.9002, 107.6186],
      region: 'Jawa',
      address: 'Jl. Diponegoro No.57, Bandung',
      description: 'Museum geologi dengan koleksi batuan dan fosil',
      image: '/src/assets/museum-interior.jpg',
      openingHours: '08:00 - 15:30',
      ticketPrice: 'Rp 5.000'
    },
    {
      id: '3',
      name: 'Museum Sangiran',
      type: 'museum',
      coordinates: [-7.4167, 110.8333],
      region: 'Jawa',
      address: 'Krikilan, Kalijambe, Sragen',
      description: 'Museum arkeologi dengan fosil manusia purba',
      image: '/src/assets/museum-interior.jpg',
      openingHours: '08:00 - 16:00',
      ticketPrice: 'Rp 7.500'
    },
    {
      id: '4',
      name: 'Museum Aceh',
      type: 'museum',
      coordinates: [5.5480, 95.3238],
      region: 'Sumatera',
      address: 'Jl. Sultan Alaiddin Mahmudsyah No.10, Banda Aceh',
      description: 'Museum budaya dan sejarah Aceh',
      image: '/src/assets/museum-interior.jpg',
      openingHours: '08:30 - 12:00, 14:00 - 17:00',
      ticketPrice: 'Gratis'
    },
    {
      id: '5',
      name: 'Museum Balanga',
      type: 'museum',
      coordinates: [-2.2088, 113.9213],
      region: 'Kalimantan',
      address: 'Jl. Tjilik Riwut Km.2.5, Palangka Raya',
      description: 'Museum budaya Dayak Kalimantan Tengah',
      image: '/src/assets/museum-interior.jpg',
      openingHours: '08:00 - 15:00',
      ticketPrice: 'Rp 3.000'
    },
    // Heritage Sites
    {
      id: 'h1',
      name: 'Candi Borobudur',
      type: 'heritage',
      coordinates: [-7.6079, 110.2038],
      region: 'Jawa',
      address: 'Borobudur, Magelang, Jawa Tengah',
      description: 'Candi Buddha terbesar di dunia dari abad ke-8',
      image: '/src/assets/hero-borobudur.jpg',
      openingHours: '06:00 - 17:00',
      ticketPrice: 'Rp 50.000'
    },
    {
      id: 'h2',
      name: 'Candi Prambanan',
      type: 'heritage',
      coordinates: [-7.7520, 110.4915],
      region: 'Jawa',
      address: 'Prambanan, Klaten, Jawa Tengah',
      description: 'Kompleks candi Hindu terbesar di Indonesia',
      image: '/src/assets/heritage-sites.jpg',
      openingHours: '06:00 - 18:00',
      ticketPrice: 'Rp 40.000'
    },
    {
      id: 'h3',
      name: 'Benteng Rotterdam',
      type: 'heritage',
      coordinates: [-5.1332, 119.4069],
      region: 'Sulawesi',
      address: 'Jl. Ujung Pandang, Makassar',
      description: 'Benteng peninggalan Belanda abad ke-17',
      image: '/src/assets/heritage-sites.jpg',
      openingHours: '08:00 - 18:00',
      ticketPrice: 'Rp 10.000'
    },
    {
      id: 'h4',
      name: 'Istana Maimun',
      type: 'heritage',
      coordinates: [3.5738, 98.6820],
      region: 'Sumatera',
      address: 'Jl. Brigadir Jenderal Katamso, Medan',
      description: 'Istana Kesultanan Deli berarsitektur Melayu-Islam',
      image: '/src/assets/heritage-sites.jpg',
      openingHours: '08:00 - 17:00',
      ticketPrice: 'Rp 5.000'
    },
    {
      id: 'h5',
      name: 'Taman Sari',
      type: 'heritage',
      coordinates: [-7.8075, 110.3644],
      region: 'Jawa',
      address: 'Patehan, Kraton, Yogyakarta',
      description: 'Kompleks taman air Keraton Yogyakarta',
      image: '/src/assets/heritage-sites.jpg',
      openingHours: '09:00 - 15:00',
      ticketPrice: 'Rp 7.000'
    }
  ];

  // Filter locations based on current filter
  const filteredLocations = filter === 'all' ? locations : locations.filter(loc => loc.type === filter);

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
    if (!map.current) return;

    // Clear existing markers
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current!.removeLayer(layer);
      }
    });

    // Create custom icon function
    const createCustomIcon = (location: LocationData) => {
      const color = location.type === 'museum' ? '#3b82f6' : '#10b981';
      const icon = location.type === 'museum' ? '🏛️' : '🏛️';
      
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
    filteredLocations.forEach((location) => {
      const marker = L.marker(location.coordinates, {
        icon: createCustomIcon(location),
      }).addTo(map.current!);

      // Create popup content with better button handling
      const popupContent = `
        <div style="padding: 16px; min-width: 280px; max-width: 320px;">
          <div style="margin-bottom: 12px;">
            <img src="${location.image}" alt="${location.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 4px; color: #1f2937;">${location.name}</h3>
            <span style="background-color: ${location.type === 'museum' ? '#3b82f6' : '#10b981'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; text-transform: uppercase;">${location.type}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px; line-height: 1.4;">${location.description}</p>
          <div style="margin-bottom: 12px;">
            <div style="margin-bottom: 6px;">
              <strong style="color: #374151; font-size: 12px;">📍 Alamat:</strong>
              <p style="color: #6b7280; font-size: 12px; margin: 2px 0;">${location.address}</p>
            </div>
            ${location.openingHours ? `
              <div style="margin-bottom: 6px;">
                <strong style="color: #374151; font-size: 12px;">🕒 Jam Buka:</strong>
                <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${location.openingHours}</span>
              </div>
            ` : ''}
            ${location.ticketPrice ? `
              <div style="margin-bottom: 6px;">
                <strong style="color: #374151; font-size: 12px;">💰 Tiket:</strong>
                <span style="color: #6b7280; font-size: 12px; margin-left: 4px;">${location.ticketPrice}</span>
              </div>
            ` : ''}
          </div>
          <div style="display: flex; gap: 8px; position: relative; z-index: 1000;">
            <button 
              class="popup-btn-detail"
              data-id="${location.id}"
              data-type="${location.type}"
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
              "
              onmouseover="this.style.backgroundColor='#2563eb'"
              onmouseout="this.style.backgroundColor='#3b82f6'"
            >
              Lihat Detail
            </button>
            <button 
              class="popup-btn-list"
              data-region="${location.region}"
              data-type="${location.type}"
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
              "
              onmouseover="this.style.backgroundColor='#059669'"
              onmouseout="this.style.backgroundColor='#10b981'"
            >
              Lihat Daftar
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        offset: [0, -16],
        closeButton: true,
        autoClose: false,
        className: 'custom-popup',
        maxWidth: 320
      });

      // Add click event listeners after popup opens
      marker.on('popupopen', () => {
        const popup = marker.getPopup();
        if (popup && popup.getElement()) {
          const popupElement = popup.getElement();
          
          // Add event listener for detail button
          const detailBtn = popupElement.querySelector('.popup-btn-detail');
          if (detailBtn) {
            detailBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = (detailBtn as HTMLElement).dataset.id;
              const type = (detailBtn as HTMLElement).dataset.type;
              if (type === 'museum') {
                navigate(`/museum/${id}`);
              } else {
                navigate(`/heritage/${id}`);
              }
            });
          }
          
          // Add event listener for list button
          const listBtn = popupElement.querySelector('.popup-btn-list');
          if (listBtn) {
            listBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const region = (listBtn as HTMLElement).dataset.region;
              const type = (listBtn as HTMLElement).dataset.type;
              if (type === 'museum') {
                navigate(`/museum?region=${region}`);
              } else {
                navigate(`/heritage?region=${region}`);
              }
            });
          }
        }
      });

      // Add hover effects
      marker.on('mouseover', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1.2)');
      });

      marker.on('mouseout', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1)');
      });
    });

  }, [filteredLocations, navigate]);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">
          Peta Interaktif Indonesia
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/20 text-blue-600 border-blue-500/30">
              🏛️ Museum: {locations.filter(l => l.type === 'museum').length}
            </Badge>
            <Badge variant="outline" className="bg-green-500/20 text-green-600 border-green-500/30">
              🏛️ Cagar Budaya: {locations.filter(l => l.type === 'heritage').length}
            </Badge>
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'museum' | 'heritage')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="museum">Museum</SelectItem>
              <SelectItem value="heritage">Cagar Budaya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Klik pada marker untuk melihat detail lokasi dan navigasi ke halaman museum atau cagar budaya
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