import { Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { getUploadedImageUrl } from '@/lib/asset-url';

interface MediaPreviewItem {
  id: string;
  title: string;
  image_url?: string;
  categories?: string;
  subtitle?: string;
  description?: string;
  source?: string;
  author?: string[] | string;
  published_date?: string;
  created_at?: string;
}

interface MediaPreviewDialogProps {
  item: MediaPreviewItem | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

/**
 * Review dialog shown before approving a news/media item: renders the article
 * the way visitors will see it so approvers can verify the full content.
 */
export const MediaPreviewDialog = ({ item, open, onClose, onApprove, onReject }: MediaPreviewDialogProps) => {
  if (!item) {
    return null;
  }

  const publishedDate = item.published_date || item.created_at;
  const authorText = Array.isArray(item.author) ? item.author.join(', ') : item.author;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) { onClose(); } }}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Berita</DialogTitle>
          <DialogDescription>
            Periksa konten berikut sebagaimana akan tampil di halaman pengunjung sebelum melakukan Approve atau Reject.
          </DialogDescription>
        </DialogHeader>

        <article className="space-y-4">
          {item.image_url ? (
            <div className="aspect-video overflow-hidden rounded-lg border border-border">
              <img
                src={getUploadedImageUrl(item.image_url, 'images')}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {item.categories ? <Badge variant="secondary">{item.categories}</Badge> : null}
            {publishedDate ? (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(publishedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            ) : null}
            {authorText ? (
              <span className="flex items-center gap-1">
                <User size={14} />
                {authorText}
              </span>
            ) : null}
          </div>

          <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
          {item.subtitle ? (
            <p className="text-lg text-muted-foreground">{item.subtitle}</p>
          ) : null}

          <div
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description || '') }}
          />

          {item.source ? (
            <p className="text-sm text-muted-foreground">Sumber: {item.source}</p>
          ) : null}
        </article>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="destructive" onClick={() => onReject(item.id)}>
            Reject
          </Button>
          <Button variant="success" onClick={() => onApprove(item.id)}>
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
