import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (fileUrl: string) => void;
  bucket?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export const ImageUpload = ({
  label,
  value,
  onChange,
  bucket = 'images',
  accept = 'image/*',
  maxSize = 5,
  className = '',
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) {return;}

    // No preview logic

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      // No preview logic
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'Error',
        description: `File size must be less than ${maxSize}MB`,
        variant: 'destructive',
      });
      // No preview logic
      return;
    }

    setUploading(true);
    try {
      const response = await uploadService.uploadFile(file, bucket);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.name) {
        // Always use the backend's returned filename for all further operations
        const backendFilename = response.data.name;
        onChange(backendFilename);
        // No preview logic
        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      // No preview logic
    } finally {
      setUploading(false);
      // Clear the file input to prevent issues
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const clearImage = () => {    
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Helper: Extract filename from any path
  // Robust filename extraction: handles /assets/images/hero-section/filename.jpg, /uploads/images/filename.jpg, etc.
  // No preview logic

  // Admin preview: always try /uploads/images/filename first, fallback to assetUrl(value)
  // No preview logic: just upload controls and validation

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
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
                <Image className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to {maxSize}MB
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {value && (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {value}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
