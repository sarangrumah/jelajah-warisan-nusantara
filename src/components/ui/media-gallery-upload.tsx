import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface MediaItem {
  id?: string;
  path: string;
  is_deleted?: boolean;
}

interface Props {
  label: string;
  value: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  bucket?: string;
  maxItems?: number;
  maxSizeMB?: number;
  className?: string;
}

export const MediaGalleryUpload = ({
  label,
  value = [],
  onChange,
  bucket = 'memory-thumbnails',
  maxItems = 20,
  maxSizeMB = 50,
  className = '',
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const isImageType = (type: string) => type.startsWith('image/');
  const isVideoType = (type: string) => type.startsWith('video/');

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;
    if (value.length + files.length > maxItems) {
      toast({ title: 'Error', description: `Maximum ${maxItems} items allowed`, variant: 'destructive' });
      return;
    }
    setUploading(true);
    const added: MediaItem[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!(isImageType(file.type) || isVideoType(file.type))) {
          toast({ title: 'Skipped', description: `${file.name} is not an image/video`, variant: 'destructive' });
          continue;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast({ title: 'Skipped', description: `${file.name} exceeds ${maxSizeMB}MB`, variant: 'destructive' });
          continue;
        }
        const res = await uploadService.uploadFile(file, bucket);
        if (res.error || !res.data?.url) {
          toast({ title: 'Upload failed', description: res.error || 'Unknown error', variant: 'destructive' });
          continue;
        }
        added.push({ path: res.data.url });
      }
      if (added.length) {
        onChange([...(value || []), ...added]);
        toast({ title: 'Uploaded', description: `${added.length} file(s) uploaded` });
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (idx: number) => {
    const current = value || [];
    const item = current[idx];
    // If item has id, mark as deleted so backend can delete it.
    if (item && item.id) {
      const next = current.map((it, i) => (i === idx ? { ...it, is_deleted: true } : it));
      onChange(next);
    } else {
      // Item not persisted yet; drop it from payload
      const next = current.filter((_, i) => i !== idx);
      onChange(next);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {value && value.filter((m) => !m.is_deleted).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.filter((m) => !m.is_deleted).map((m, idx) => {
            const src = assetUrl(m.path);
            const ext = src.split('?')[0].split('#')[0].toLowerCase();
            const isVideo = /\.(mp4|webm|ogg)$/i.test(ext);
            return (
              <div key={idx} className="relative group">
                {isVideo ? (
                  <video src={src} controls className="w-full h-24 object-cover rounded-md" />
                ) : (
                  <img src={src} alt={`Media ${idx + 1}`} className="w-full h-24 object-cover rounded-md" />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAt(idx)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {(!value || value.length < maxItems) && (
        <Card className={`border-2 border-dashed cursor-pointer transition-colors`} onClick={() => inputRef.current?.click()}>
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
                  <p className="text-sm font-medium mb-1">Add images or videos</p>
                  <p className="text-xs text-muted-foreground">Up to {maxItems} items, {maxSizeMB}MB each</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Input ref={inputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
    </div>
  );
};
