import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image, Loader2, Plus } from 'lucide-react';
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

export const GalleryUpload = ({
  label,
  value = [], // ✅ Fixed: default to empty array
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


  console.log(value === null || value.length < maxImages)
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
    const newImages: ImageItem[] = []; // ✅ Will store objects

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
          // ✅ Push object matching ImageItem interface
          // ⚠️ You need to define what "sites" means — placeholder used here
          newImages.push({
            path: response.data.url,
            sites: '', // TODO: Replace with actual logic if needed
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

      {/* Existing images grid */}
      {value !== null && value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.path}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                  <Plus className="w-8 h-8 text-muted-foreground mb-2" />
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