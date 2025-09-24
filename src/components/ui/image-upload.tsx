import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Upload, X, Image, Loader2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (fileUrl: string) => void;
  bucket?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  preview?: boolean;
}

export const ImageUpload = ({
  label,
  value,
  onChange,
  bucket = 'images',
  accept = 'image/*',
  maxSize = 5,
  className = '',
  preview = true
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file) {return;}

    // Show local preview immediately
    setLocalPreview(URL.createObjectURL(file));

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      setLocalPreview(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: 'Error',
        description: `File size must be less than ${maxSize}MB`,
        variant: 'destructive',
      });
      setLocalPreview(null);
      return;
    }

    setUploading(true);
    try {
      const response = await uploadService.uploadFile(file, bucket);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.url) {
        let url = response.data.url;
        if (url && url.startsWith('/assets/')) {
          // Use as-is for preview
          console.log('[ImageUpload] Upload response url:', url, 'Used as-is for preview');
          onChange(url);
        } else if (url) {
          // Remove any directory path, keep only the filename
          const originalUrl = url;
          url = url.split('/').pop() || url;
          url = `/uploads/${bucket}/${url}`;
          console.log('[ImageUpload] Upload response url:', originalUrl, 'Normalized preview url:', url);
          onChange(url);
        }
        setLocalPreview(null); // Switch to uploaded image preview
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
      setLocalPreview(null);
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

  const displayUrl = assetUrl(value);

  // Show local preview if uploading and localPreview is set, otherwise show uploaded image
  const previewUrl = localPreview || (value ? displayUrl : null);

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
          {previewUrl && preview ? (
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <img
                      src={previewUrl}
                      alt="Full preview"
                      className="w-full h-auto rounded-md"
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                    setLocalPreview(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {localPreview && uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              )}
            </div>
          ) : (
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
          )}
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

      {value && !preview && (
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
