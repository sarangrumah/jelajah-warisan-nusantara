import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadService } from '@/lib/api-services';

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

  const sanitizeFileName = (url?: string) => {
    if (!url) {return ''};

    const scrub = (raw: string) => raw.replace(/[\s\\/:*?"<>|]+/g, ' ').trim();
    const safeDecode = (raw: string) => {
      try {
        return decodeURIComponent(raw);
      } catch (_) {
        return raw;
      }
    };

    try {
      const base = typeof window !== 'undefined' ? window.location.origin : import.meta.env.VITE_API_URL || '';
      const parsed = new URL(url, base);
      const segments = parsed.pathname.split('/').filter(Boolean);
      const fileName = segments.pop() || '';
      return scrub(safeDecode(fileName));
    } catch (_) {
      const cleaned = url.split(/[?#]/)[0];
      const segments = cleaned.split('/').filter(Boolean);
      const fileName = segments.pop() || cleaned;
      return scrub(safeDecode(fileName));
    }
  };

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;
    const activeCount = (value || []).filter((item) => !item.is_deleted).length;
    if (activeCount + files.length > maxItems) {
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

  const removeItem = (target: MediaItem) => {
    const current = value || [];
    const idx = current.indexOf(target);
    if (idx === -1) {return;}
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

  const activeItems = (value || []).filter((m) => !m.is_deleted);

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>

      {activeItems.length > 0 && (
        <div className="space-y-2">
          {activeItems.map((m) => {
            const label = sanitizeFileName(m.path) || m.path;
            return (
              <div key={`${m.id ?? m.path}`} className="flex items-center gap-3 rounded-md border border-border bg-muted/10 px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground break-all flex-1">
                  {label}
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="shrink-0"
                  onClick={() => removeItem(m)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {(activeItems.length < maxItems) && (
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
