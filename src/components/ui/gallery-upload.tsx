import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Image, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';

interface ImageItem {
  path: string;  // URL or path to image
  sites: string; // Possibly metadata – adjust as needed
}

interface GalleryUploadProps {
  label: string;
  value: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  bucket?: string;
  maxImages?: number;
  maxSize?: number; // in MB
  className?: string;
}

const sanitizeFileName = (url?: string) => {
  if (!url) return '';

  const scrub = (raw: string) => raw.replace(/[\s\\/:*?"<>|]+/g, ' ').trim();
  const safeDecode = (raw: string) => {
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const parsed = new URL(url, base);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const fileName = segments.pop() || '';
    return scrub(safeDecode(fileName));
  } catch {
    const cleaned = url.split(/[?#]/)[0];
    const segments = cleaned.split('/').filter(Boolean);
    const fileName = segments.pop() || cleaned;
    return scrub(safeDecode(fileName));
  }
};

export const GalleryUpload = ({
  label,
  value = [],
  onChange,
  bucket = 'images',
  maxImages = 10,
  maxSize = 5,
  className = '',
}: GalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return;

    // Check limit
    if (value.length + files.length > maxImages) {
      toast({
        title: 'Error',
        description: `Maximum ${maxImages} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const newImages: ImageItem[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Error',
            description: `${file.name} is not an image file`,
            variant: 'destructive',
          });
          continue;
        }

        // Validate size
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: 'Error',
            description: `${file.name} exceeds ${maxSize}MB`,
            variant: 'destructive',
          });
          continue;
        }

        const response = await uploadService.uploadFile(file, bucket);

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data?.url) {
          // Extract just the filename from the URL
          const url = response.data.url;
          const filename = url.split('/').pop() || url;
          newImages.push({
            path: filename,
            sites: '',
          });
        }
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast({
          title: 'Success',
          description: `${newImages.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload some images',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFileSelect(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {value !== null && value.length > 0 && (
        <div className="space-y-2">
          {value.map((image, index) => (
            <div key={index} className="flex items-center gap-3 rounded-md border border-border bg-muted/10 px-3 py-2">
              <span className="text-sm font-medium text-muted-foreground break-all flex-1">
                {sanitizeFileName(image.path) || image.path}
              </span>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="shrink-0"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {value === null || value.length < maxImages && (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  {/* <Plus className="w-8 h-8 text-muted-foreground mb-2" /> */}
                  <p className="text-sm font-medium mb-1">Add more images</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to {maxSize}MB ({value.length}/{maxImages})
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};
