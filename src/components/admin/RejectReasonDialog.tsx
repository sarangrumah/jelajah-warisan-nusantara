import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useId } from 'react';

interface RejectReasonDialogProps {
  open: boolean;
  reason: string;
  loading?: boolean;
  title?: string;
  description?: string;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function RejectReasonDialog({
  open,
  reason,
  loading = false,
  title = 'Reject Item',
  description = 'Please provide a short explanation for this rejection. The message will be visible to editors.',
  onReasonChange,
  onSubmit,
  onClose,
}: RejectReasonDialogProps) {
  const textareaId = useId();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {!nextOpen && onClose();}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor={textareaId}>Reason</Label>
            <Textarea
              id={textareaId}
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Explain the rejection reason"
              rows={4}
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Keep it concise and clear. Editors will see this note.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onSubmit}
            disabled={loading || reason.trim().length === 0}
          >
            {loading ? 'Submitting…' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
