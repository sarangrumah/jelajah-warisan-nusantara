import { useEffect, useState } from 'react';
import { memoryWorldService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MultiImageUpload } from '@/components/ui/multi-image-upload';
import { ImageUpload } from '@/components/ui/image-upload';
import { Edit, Loader2, Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuillEditor from '@/components/ui/quill-editor';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';

interface MemoryWorldItem {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  date: string; // ISO string
  start_publish_date?: string;
  end_publish_date?: string;
  is_active: boolean;
  thumbnails?: string;
  gallery?: string[];
  created_at?: string;
  updated_at?: string;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
}

const emptyItem: MemoryWorldItem = {
  title: '',
  subtitle: '',
  description: '',
  date: '',
  start_publish_date: '',
  end_publish_date: '',
  is_active: true,
  thumbnails: '',
  gallery: [],
  is_rejected: false,
  reason_rejected: '',
  // categories_id: '',
};

// Convert to input[type=date] value (YYYY-MM-DD)
const toDateInput = (v?: string) => {
  if (!v) {return '';}
  // If already in YYYY-MM-DD, keep as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {return v;}
  const d = new Date(v);
  if (isNaN(d.getTime())) {return '';}
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// From input[type=date] back to payload string (keep YYYY-MM-DD)
const fromDateInput = (v?: string) => v || '';

const MemoryWorldForm = ({ value, onSave, onCancel, saving } : {
  value: MemoryWorldItem,
  onSave: (data: MemoryWorldItem) => void,
  onCancel: () => void,
  saving: boolean,
}) => {
  const [formData, setFormData] = useState<MemoryWorldItem>({
    ...value,
    date: toDateInput(value.date),
    start_publish_date: toDateInput(value.start_publish_date),
    end_publish_date: toDateInput(value.end_publish_date),
  });

  useEffect(() => {
    setFormData({
      ...value,
      date: toDateInput(value.date),
      start_publish_date: toDateInput(value.start_publish_date),
      end_publish_date: toDateInput(value.end_publish_date),
    });
  }, [value?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: fromDateInput(formData.date),
      start_publish_date: fromDateInput(formData.start_publish_date),
      end_publish_date: fromDateInput(formData.end_publish_date),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={formData.title} onChange={(e) => setFormData(p => ({...p, title: e.target.value}))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" value={formData.subtitle} onChange={(e) => setFormData(p => ({...p, subtitle: e.target.value}))} />
      </div>
    </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <QuillEditor
          value={formData.description || ''}
          onChange={(html) => setFormData(p => ({ ...p, description: html }))}
          height={100}
          placeholder="Describe this memory"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={formData.date || ''} onChange={(e) => setFormData(p => ({...p, date: e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_publish_date">Start Date</Label>
          <Input id="start_publish_date" type="date" value={formData.start_publish_date || ''} onChange={(e) => setFormData(p => ({...p, start_publish_date: e.target.value}))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_publish_date">End Date</Label>
          <Input id="end_publish_date" type="date" value={formData.end_publish_date || ''} onChange={(e) => setFormData(p => ({...p, end_publish_date: e.target.value}))} />
        </div>
      </div>

      <ImageUpload
        label="Thumbnail Image"
        value={formData.thumbnails || ''}
        onChange={(url) => setFormData(p => ({...p, thumbnails: url}))}
        bucket="hero-sections"
      />

      <MultiImageUpload
        label="Gallery (Images)"
        value={formData.gallery || []}
        onChange={(urls) => setFormData(p => ({...p, gallery: urls}))}
        bucket="hero-sections"
        maxItems={20}
      />

      <div className="flex items-center space-x-2">
        <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(p => ({...p, is_active: checked}))} />
        <Label htmlFor="is_active">Publish</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
};

const MemoryWorldManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<MemoryWorldItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const formatDateTime = (value?: string | null) => {
    if (!value) {return '-';}
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {return '-';}
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const fetchAll = async () => {
    try {
      const res = await memoryWorldService.getAll();
      if (res.error) {throw new Error(res.error);} 
      const data = (res.data as MemoryWorldItem[] | undefined) || [];
      setItems(data.map((item) => ({
        ...item,
        reason_rejected: item.reason_rejected ?? '',
      })));
    } catch (error) {
      console.error('Error fetch memory of world:', error);
      toast({ title: 'Error', description: 'Failed to load items', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (data: MemoryWorldItem) => {
    setSaving(true);
    try {
      // Convert string[] gallery back to object structure if needed by backend,
      // or send as is if backend supports it.
      // Based on previous code, it seemed to expect objects.
      // However, the prompt asks to update interfaces to string[].
      // I will send the data as is, assuming backend handles it or I've updated the interface correctly.
      // If the backend strictly needs objects, I might need to map it here.
      // For now, I'll assume the interface change implies a data structure change.
      
      const payload: any = {
        ...data,
        // Map string[] back to object array for backend compatibility if it hasn't been updated
        // The previous code used { path: string }
        gallery: data.gallery?.map(url => (typeof url === 'string' ? { path: url } : url)) || [],
        is_rejected: false,
        reason_rejected: '',
      };

      if (editing?.id) {
        const res = await memoryWorldService.update(editing.id, payload);
        if (res.error) {throw new Error(res.error);}
        toast({ title: 'Updated', description: 'Updated successfully' });
      } else {
        const res = await memoryWorldService.create(payload);
        if (res.error) {throw new Error(res.error);}
        toast({ title: 'Created', description: 'Created successfully' });
      }
      setOpen(false);
      setEditing(null);
      await fetchAll();
    } catch (error) {
      console.error('Error save memory of world:', error);
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const res = await memoryWorldService.update(id, { is_active: isPublished });
      if (res.error) {throw new Error(res.error);}
      setItems(prev => prev.map(it => it.id === id ? { ...it, is_active: isPublished } : it));
      toast({ title: 'Success', description: `Item ${isPublished ? 'published' : 'unpublished'}` });
    } catch (error) {
      console.error('Error publish memory of world:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const toggleApproved = async (id: string) => {
    try {
      const res = await memoryWorldService.approve(id);
      if (res.error) {throw new Error(res.error);}

      const updated = (res.data || {}) as Partial<MemoryWorldItem>;
      setItems(prev => prev.map(it =>
        it.id === id
          ? {
              ...it,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
              is_active: updated.is_active ?? it.is_active,
              reason_rejected: '',
            }
          : it
      ));

      toast({ title: 'Approved', description: 'Item approved successfully' });
      await fetchAll();
    } catch (error) {
      console.error('Error approving memory of world:', error);
      toast({ title: 'Error', description: 'Failed to approve item', variant: 'destructive' });
    }
  };

  const openRejectDialog = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectingId(null);
    setRejectReason('');
  };

  const submitReject = async () => {
    if (!rejectingId) {
      return;
    }

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      toast({ title: 'Reason required', description: 'Please enter a rejection reason.', variant: 'destructive' });
      return;
    }

    try {
      setRejectSubmitting(true);
      const res = await memoryWorldService.reject(rejectingId, trimmedReason);
      if (res.error) {throw new Error(res.error);}

      const updated = (res.data || {}) as Partial<MemoryWorldItem>;
      setItems(prev => prev.map(it =>
        it.id === rejectingId
          ? {
              ...it,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
              is_active: updated.is_active ?? it.is_active,
              reason_rejected: updated.reason_rejected ?? trimmedReason,
            }
          : it
      ));

      toast({ title: 'Rejected', description: 'Item rejected successfully' });
      closeRejectDialog();
      await fetchAll();
    } catch (error) {
      console.error('Error rejecting memory of world:', error);
      toast({ title: 'Error', description: 'Failed to reject item', variant: 'destructive' });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await memoryWorldService.delete(id);
      if (res.error) {throw new Error(res.error);}
      toast({ title: 'Deleted', description: 'Item deleted' });
      await fetchAll();
    } catch (error) {
      console.error('Error delete memory of world:', error);
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Memory of The World Management</h2>
          <p className="text-muted-foreground"> Manage Memory of The World and Content</p>
        </div>
        {(userRole === 'admin' || userRole === 'super-admin') && (
          <Button onClick={() => { setEditing(emptyItem); setOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Memory of The World
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Memory of The World' : 'Add Memory of The World'}</DialogTitle>
            <DialogDescription>Manage Memory of The World content</DialogDescription>
          </DialogHeader>
          {editing && (
            <MemoryWorldForm
              value={editing}
              onSave={saveItem}
              onCancel={() => { setOpen(false); setEditing(null); }}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>

      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Reject Memory Item"
      />

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Memory of The World items</CardTitle>
            <CardDescription>Create your first item</CardDescription>
          </CardHeader>
          <CardContent>
            {(userRole === 'admin' || userRole === 'super-admin') && (
              <Button onClick={() => { setEditing(emptyItem); setOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((it: any) => (
            <Card key={it.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {it.title}
                      <Badge variant={it.is_active ? 'default' : 'secondary'}>
                        {it.is_active ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={it.is_approved ? 'success' : it.is_rejected ? 'destructive' : 'secondary'}>
                        {it.is_approved ? 'Approved' : it.is_rejected ? 'Rejected' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{it.subtitle}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="is_active" checked={!!it.is_active} onCheckedChange={(checked) => togglePublished(it.id, checked)} />
                    </div>
                    {(userRole === 'super-admin' || userRole === 'approver') && !it.is_approved && !it.is_rejected ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => toggleApproved(it.id)}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openRejectDialog(it.id)}>
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing({
                          ...it,
                          // categories_id: it.categories_id ?? it.category?.id ?? '',
                          gallery: it.galleries?.map((g: any) => g.upload_file) || [],
                          thumbnails: it.thumbnails,
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteItem(it.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Date:</span>
                    <p className="text-muted-foreground">{formatDateTime(it.date)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Period:</span>
                    <p className="text-muted-foreground">
                      {formatDateTime(it.start_publish_date)} → {formatDateTime(it.end_publish_date)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{it.category?.name || '-'}</p>
                  </div>
                </div>
                {it.is_rejected && it.reason_rejected?.trim() ? (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Alasan Penolakan : </span>
                    <p className="text-muted-foreground">{it.reason_rejected}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryWorldManagement;
