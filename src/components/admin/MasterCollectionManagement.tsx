import { useEffect, useState } from 'react';
import { collectionCategoryService, masterCollectionService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { Edit, Loader2, Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuillEditor from '@/components/ui/quill-editor';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';

interface MasterCollection {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  museum_name: string;
  discovered_year: string;
  condition: string;
  material: string;
  dimensions: string;
  origin: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  categories_id?: string | null;
  category?: CollectionCategory | null;
}

interface CollectionCategory {
  id: string;
  name: string;
}

const emptyCollection: MasterCollection = {
  title: '',
  subtitle: '',
  description: '',
  museum_name: '',
  discovered_year: '',
  condition: '',
  material: '',
  dimensions: '',
  origin: '',
  image_url: '',
  is_active: true,
  is_rejected: false,
  reason_rejected: '',
  categories_id: '',
};

const CollectionForm = ({
  value,
  onSave,
  onCancel,
  saving,
  categories,
  categoryLoading,
}: {
  value: MasterCollection;
  onSave: (data: MasterCollection) => void;
  onCancel: () => void;
  saving: boolean;
  categories: CollectionCategory[];
  categoryLoading: boolean;
}) => {
  const [formData, setFormData] = useState<MasterCollection>({ ...value });

  useEffect(() => {
    setFormData({ ...value });
  }, [value?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Name Collection</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categories_id">Category</Label>
        {categoryLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <Select
            value={formData.categories_id && formData.categories_id !== '' ? formData.categories_id : 'none'}
            onValueChange={(value) =>
              setFormData((p) => ({ ...p, categories_id: value === 'none' ? '' : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length === 0 ? (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="none">No category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <QuillEditor
          value={formData.description || ''}
          onChange={(html) => setFormData((p) => ({ ...p, description: html }))}
          height={100}
          placeholder="Describe the collection"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="museum_name">Museum</Label>
          <Input
            id="museum_name"
            value={formData.museum_name}
            onChange={(e) => setFormData((p) => ({ ...p, museum_name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discovered_year">Discovered Year</Label>
          <Input
            id="discovered_year"
            value={formData.discovered_year}
            onChange={(e) => setFormData((p) => ({ ...p, discovered_year: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Input
            id="condition"
            value={formData.condition}
            onChange={(e) => setFormData((p) => ({ ...p, condition: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => setFormData((p) => ({ ...p, material: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={formData.dimensions}
            onChange={(e) => setFormData((p) => ({ ...p, dimensions: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="origin">Origin</Label>
          <Input
            id="origin"
            value={formData.origin}
            onChange={(e) => setFormData((p) => ({ ...p, origin: e.target.value }))}
          />
        </div>
      </div>

      <ImageUpload
        label="Image Upload"
        value={formData.image_url}
        onChange={(url) => setFormData((p) => ({ ...p, image_url: url }))}
        bucket="hero-sections"
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((p) => ({ ...p, is_active: checked }))}
        />
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

const MasterCollectionManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<MasterCollection[]>([]);
  const [editing, setEditing] = useState<MasterCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CollectionCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const { toast } = useToast();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await masterCollectionService.getAll();
      if (res.error) {throw new Error(res.error)};
      const collections = (res.data as MasterCollection[] | undefined) || [];
      setItems(collections.map((item) => ({
        ...item,
        reason_rejected: item.reason_rejected ?? '',
      })));
    } catch (error) {
      console.error('Error toggling FAQ:', error);
      toast({ title: 'Error', description: 'Failed to load collections', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      const res = await collectionCategoryService.getAll();
      if (res.error) {throw new Error(res.error);} 
      setCategories(res.data || []);
    } catch (error) {
      console.error('Error fetch collection categories:', error);
      toast({ title: 'Error', description: 'Failed to load categories', variant: 'destructive' });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleSave = async (data: MasterCollection) => {
    setSaving(true);
    try {
      const payload: MasterCollection = {
        ...data,
        is_rejected: false,
        reason_rejected: '',
        categories_id: data.categories_id ? data.categories_id : null,
      };

      if (editing?.id) {
        const res = await masterCollectionService.update(editing.id, payload);
        if (res.error) {throw new Error(res.error)};
        toast({ title: 'Updated', description: 'Collection updated successfully' });
      } else {
        const res = await masterCollectionService.create(payload);
        if (res.error) {throw new Error(res.error)};
        toast({ title: 'Created', description: 'Collection created successfully' });
      }
      setOpen(false);
      setEditing(null);
      await fetchAll();
    } catch (error) {
      console.error('Error toggling collection:', error);
      toast({ title: 'Error', description: 'Failed to save collection', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await masterCollectionService.delete(id);
      if (res.error) {throw new Error(res.error)};
      toast({ title: 'Deleted', description: 'Collection deleted' });
      await fetchAll();
    } catch (error) {
      console.error('Error delete collection:', error);
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const res = await masterCollectionService.update(id, { is_active: isPublished });
      if (res.error) {throw new Error(res.error)};
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, is_active: isPublished } : r)));
      toast({ title: 'Success', description: `Collection ${isPublished ? 'published' : 'unpublished'}` });
    } catch (error) {
      console.error('Error publish collection:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const approveItem = async (id: string) => {
    try {
      const res = await masterCollectionService.approve(id);
      if (res.error) {throw new Error(res.error)};
      const updated = (res.data || {}) as Partial<MasterCollection>;
      setItems(prev => prev.map(it => it.id === id ? {
        ...it,
        is_approved: updated.is_approved ?? true,
        is_rejected: updated.is_rejected ?? false,
        is_active: updated.is_active ?? true,
        reason_rejected: '',
      } : it));
      toast({ title: 'Approved', description: 'Collection approved' });
      await fetchAll();
    } catch (error) {
      console.error('Error approve collection:', error);
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
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
      const res = await masterCollectionService.reject(rejectingId, trimmedReason);
      if (res.error) {throw new Error(res.error)};
      const updated = (res.data || {}) as Partial<MasterCollection>;
      setItems(prev => prev.map(it => it.id === rejectingId ? {
        ...it,
        is_approved: updated.is_approved ?? false,
        is_rejected: updated.is_rejected ?? true,
        is_active: updated.is_active ?? it.is_active,
        reason_rejected: updated.reason_rejected ?? trimmedReason,
      } : it));
      toast({ title: 'Rejected', description: 'Collection rejected' });
      closeRejectDialog();
      await fetchAll();
    } catch (error) {
      console.error('Error reject collection:', error);
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    } finally {
      setRejectSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Master Collection Management</h2>
          <p className="text-muted-foreground"> Manage Master Collection and Content</p>
        </div>
        <Button onClick={() => { setEditing(emptyCollection); setOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'Edit Collection' : 'Add Collection'}</DialogTitle>
            <DialogDescription>Fill the collection details</DialogDescription>
          </DialogHeader>
          {editing && (
            <CollectionForm
              value={editing}
              onSave={handleSave}
              onCancel={() => { setOpen(false); setEditing(null); }}
              saving={saving}
              categories={categories}
              categoryLoading={categoryLoading}
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
        title="Reject Collection"
      />

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Collections</CardTitle>
            <CardDescription>Create your first collection</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => { setEditing(emptyCollection); setOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
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
                    {userRole === 'admin' || userRole === 'super-admin' ? (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={it.is_active}
                          onCheckedChange={(checked) => togglePublished(it.id as string, checked)}
                        />
                      </div>
                    ) : null}
                    {(userRole === 'super-admin' || userRole === 'approver') && !it.is_approved && !it.is_rejected ? (
                      <>
                        <Button variant="success" size="sm" onClick={() => it.id && approveItem(it.id)}>
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => it.id && openRejectDialog(it.id)}>
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
                          categories_id: it.categories_id ?? it.category?.id ?? '',
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => it.id && handleDelete(it.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Museum:</span>
                    <p className="text-muted-foreground">{it.museum_name || '-'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Discovered Year:</span>
                    <p className="text-muted-foreground">{it.discovered_year || '-'}</p>
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

export default MasterCollectionManagement;
