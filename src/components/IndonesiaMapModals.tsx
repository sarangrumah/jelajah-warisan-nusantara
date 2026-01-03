import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, MapPin, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { useTranslate } from '@/hooks/useTranslate';
import { museumService, heritageService } from '@/lib/api-services';
import { mapSlidesWithImageUrl } from './helper';

interface MuseumHeritageDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    name?: string;
    title?: string;
    subtitle?: string;
    address?: string;
    openingHours?: string;
    ticketPrice?: string;
    image_url?: string;
    type: string;
  };
  types: any[];
}

export const MuseumHeritageDetailModal: React.FC<MuseumHeritageDetailModalProps> = ({
  open,
  onClose,
  item,
  types
}) => {
  const { translatedText: detailTitle } = useTranslate('Detail Lengkap');
  const { translatedText: addressLabel } = useTranslate('Alamat:');
  const { translatedText: openingHoursLabel } = useTranslate('Jam Buka:');
  const { translatedText: ticketPriceLabel } = useTranslate('Harga Tiket:');
  const { translatedText: closeLabel } = useTranslate('Tutup');
  
  const getMuseumsImageUrl = (filename: string) => {
    if (!filename) { return undefined };
    
    // Check if the filename is just a filename (no path) and might be an uploaded file
    if (typeof filename === 'string' && !filename.includes('/') && !filename.includes('\\')) {
      // This is likely just a filename from the database, assume it's in uploads/museum/
      return `/uploads/museum/${filename}`;
    }
    
    // For uploaded images, use as-is
    if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
      return filename;
    }
    
    if (
      typeof filename === 'string' &&
      (filename.startsWith('http://') ||
        filename.startsWith('https://') ||
        filename.startsWith('/assets/'))
    ) {
      return filename;
    }
    const justFile = filename?.split('/').pop() || filename;
    return `/assets/museums/${justFile}`;
  };

  const typeName = types.find((type) => type.id === item.type)?.name;
  const color = typeName === 'museum' ? '#3b82f6' : '#10b981';
  const icon = '🏛️';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{icon}</span>
            {item.name || item.title}
            <Badge 
              variant="outline" 
              style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}50` }}
            >
              {typeName}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {item.image_url && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img
                src={getMuseumsImageUrl(item.image_url)}
                alt={item.name || item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {item.subtitle && (
            <p className="text-muted-foreground">{item.subtitle}</p>
          )}
          
          <div className="grid gap-4">
            {item.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">{addressLabel}</span>
                  <p className="text-muted-foreground">{item.address}</p>
                </div>
              </div>
            )}
            
            {item.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">{openingHoursLabel}</span>
                  <p className="text-muted-foreground">{item.openingHours}</p>
                </div>
              </div>
            )}
            
            {item.ticketPrice && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="font-medium">{ticketPriceLabel}</span>
                  <p className="text-muted-foreground">{item.ticketPrice}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              {closeLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface MuseumHeritageListModalProps {
  open: boolean;
  onClose: () => void;
  typeId: string;
  types: any[];
}

export const MuseumHeritageListModal: React.FC<MuseumHeritageListModalProps> = ({
  open,
  onClose,
  typeId,
  types
}) => {
  const { translatedText: listTitle } = useTranslate('Daftar Lengkap');
  const { translatedText: closeLabel } = useTranslate('Tutup');
  const { translatedText: noItemsLabel } = useTranslate('Belum ada data');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const typeName = types.find((type) => type.id === typeId)?.name;
  const color = typeName === 'museum' ? '#3b82f6' : '#10b981';
  const icon = '🏛️';

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const service = typeName === 'museum' ? museumService : heritageService;
        const response = await service.getPublished();
        
        if (!response.error && response.data) {
          const mappedItems = mapSlidesWithImageUrl(response.data);
          setItems(mappedItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open && typeId) {
      fetchItems();
    }
  }, [open, typeId, typeName]);

  const getMuseumsImageUrl = (filename: string) => {
    if (!filename) { return undefined };
    
    // Check if the filename is just a filename (no path) and might be an uploaded file
    if (typeof filename === 'string' && !filename.includes('/') && !filename.includes('\\')) {
      // This is likely just a filename from the database, assume it's in uploads/museum/
      return `/uploads/museum/${filename}`;
    }
    
    // For uploaded images, use as-is
    if (typeof filename === 'string' && filename.startsWith('/uploads/')) {
      return filename;
    }
    
    if (
      typeof filename === 'string' &&
      (filename.startsWith('http://') ||
        filename.startsWith('https://') ||
        filename.startsWith('/assets/'))
    ) {
      return filename;
    }
    const justFile = filename?.split('/').pop() || filename;
    return `/assets/museums/${justFile}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{icon}</span>
            {listTitle} {typeName === 'museum' ? 'Museum' : 'Cagar Budaya'}
            <Badge 
              variant="outline" 
              style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}50` }}
            >
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{noItemsLabel}</p>
          </div>
        ) : (
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{item.name || item.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      style={{ backgroundColor: `${color}20`, color: color, borderColor: `${color}50` }}
                    >
                      {typeName}
                    </Badge>
                  </div>
                  {item.subtitle && (
                    <p className="text-muted-foreground text-sm">{item.subtitle}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {item.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground line-clamp-2">{item.address}</span>
                      </div>
                    )}
                    {item.openingHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.openingHours}</span>
                      </div>
                    )}
                  </div>
                  
                  {item.image_url && (
                    <div className="mt-3">
                      <img
                        src={getMuseumsImageUrl(item.image_url)}
                        alt={item.name || item.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {closeLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};