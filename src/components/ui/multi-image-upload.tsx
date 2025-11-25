import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface MultiImageUploadProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  maxItems?: number;
  maxSizeMB?: number;
  className?: string;
  disabled?: boolean;
}

export const MultiImageUpload = ({
  label,
  value = [],
  onChange,
  bucket = 'images',
  maxItems = 10,
  maxSizeMB = 5,
  className = '',
  disabled = false,
}: MultiImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;
    
    if (value.length + files.length > maxItems) {
      toast({
        title: 'Error',
        description: `Maximum ${maxItems} images allowed`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Skipped',
            description: `${file.name} is not an image`,
            variant: 'destructive',
          });
          continue;
        }

        // Validate size
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast({
            title: 'Skipped',
            description: `${file.name} exceeds ${maxSizeMB}MB`,
            variant: 'destructive',
          });
          continue;
        }

        const response = await uploadService.uploadFile(file, bucket);
        
        if (response.error) {
          toast({
            title: 'Upload failed',
            description: `Failed to upload ${file.name}: ${response.error}`,
            variant: 'destructive',
          });
          continue;
        }

        if (response.data?.url) {
          newUrls.push(response.data.url);
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast({
          title: 'Success',
          description: `Uploaded ${newUrls.length} image(s)`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (indexToRemove: number) => {
    if (disabled) return;
    const newValue = value.filter((_, index) => index !== indexToRemove);
    onChange(newValue);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
              <img
                src={assetUrl(url)}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {!disabled && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxItems && !disabled && (
        <Card
          className={`border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
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
                  <div className="p-3 bg-muted rounded-full mb-3">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to {maxSizeMB}MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {value.length} / {maxItems} images
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        disabled={uploading || disabled}
      />
    </div>
  );
};