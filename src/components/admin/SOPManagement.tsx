import { useEffect, useState } from 'react';
import { sopService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';
import FileUploadPDF from '@/components/FileUploadPDF';

type SopCategory = 'Peraturan' | 'SOP';

interface SOPItem {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  publish_date?: string; // ISO string
  category: SopCategory;
  document_url?: string;
  author: string;
  is_active: boolean;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

const emptySOP: SOPItem = {
  title: '',
  subtitle: '',
  description: '',
  publish_date: '',
  category: 'SOP',
  document_url: '',
  author: '',
  is_active: true,
  is_approved: false,
};

const SOPForm = ({ sop, onSave, onCancel, saving }: {
  sop?: SOPItem;
  onSave: (data: SOPItem) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  // Normalize publish_date for input[type=datetime-local]
  const toDateTimeInput = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const [formData, setFormData] = useState<SOPItem>({
    ...(sop || emptySOP),
    publish_date: toDateTimeInput(sop?.publish_date),
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...(sop || emptySOP),
      publish_date: toDateTimeInput(sop?.publish_date),
    }));
  }, [sop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="publish_date">Publish Date</Label>
          <Input
            id="publish_date"
            type="datetime-local"
            value={formData.publish_date || ''}
            onChange={(e) => {
              const value = e.target.value;
              const isValid = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
              if (isValid || value === '') {
                setFormData(prev => ({ ...prev, publish_date: value }));
              }
            }}
            min="2020-01-01T00:00"
            max="2035-12-31T23:59"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as SopCategory }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Peraturan">Peraturan</SelectItem>
              <SelectItem value="SOP">SOP</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            required
          />
        </div>
      </div>

      <FileUploadPDF
        bucket="documents"
        label="Document Upload (PDF)"
        onUploadComplete={(url) => setFormData(prev => ({ ...prev, document_url: url }))}
        required={false}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={!!formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Is Active</Label>
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

const SOPManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<SOPItem[]>([]);
  const [selected, setSelected] = useState<SOPItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<SOPItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await sopService.getAll();
      if (response.error) throw new Error(response.error);
      setItems((response.data as unknown as SOPItem[]) || []);
    } catch (error) {
      console.error('Error fetching SOP items:', error);
      toast({ title: 'Error', description: 'Failed to load SOP items', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const saveItem = async (formData: SOPItem) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        const response = await sopService.update(editingItem.id, formData);
        if (response.error) throw new Error(response.error);
        setItems(prev => prev.map(i => (i.id === editingItem.id ? { ...i, ...formData } : i)));
        toast({ title: 'Success', description: 'SOP updated successfully' });
      } else {
        const response = await sopService.create(formData);
        if (response.error) throw new Error(response.error);
        setItems(prev => [response.data as unknown as SOPItem, ...prev]);
        toast({ title: 'Success', description: 'SOP created successfully' });
      }
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving SOP:', error);
      toast({ title: 'Error', description: 'Failed to save SOP', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await sopService.update(id, { is_active: isActive });
      if (response.error) throw new Error(response.error);
      setItems(prev => prev.map(i => (i.id === id ? { ...i, is_active: isActive } : i)));
      toast({ title: 'Success', description: `Item ${isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
      console.error('Error toggling active:', error);
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const toggleApproved = async (id: string) => {
    try {
      const response = await sopService.approve(id);
      if (response.error) throw new Error(response.error);
      setItems(prev => prev.map(i => (i.id === id ? { ...i, is_approved: (response as any).data?.is_approved } : i)));
      toast({ title: 'Success', description: 'SOP approved' });
      fetchItems();
    } catch (error) {
      console.error('Error approving SOP:', error);
      toast({ title: 'Error', description: 'Failed to approve SOP', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false);
      const response = await sopService.delete(id);
      if (response.error) throw new Error(response.error);
      toast({ title: 'Success', description: 'SOP deleted' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting SOP:', error);
      toast({ title: 'Error', description: 'Failed to delete SOP', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SOP Management</h2>
          <p className="text-muted-foreground">Manage SOP and Regulations documents</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {userRole === 'admin' ? (
              <Button onClick={() => setEditingItem(emptySOP)}>
                <Plus className="w-4 h-4 mr-2" />
                Add SOP
              </Button>
            ) : (
              <></>
            )}
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? 'Edit SOP' : 'Add New SOP'}</DialogTitle>
              <DialogDescription>
                {editingItem?.id ? 'Update SOP information' : 'Create new SOP/Regulation entry'}
              </DialogDescription>
            </DialogHeader>
            <SOPForm
              sop={editingItem || emptySOP}
              onSave={saveItem}
              onCancel={() => {
                setEditingItem(null);
                setIsDialogOpen(false);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {selected ? (
          <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{'Delete ' + selected.title + ' document'}</DialogTitle>
                <DialogDescription>{'Are you sure you want to delete ' + selected.title + '?'}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isDialogOpen} onClick={() => handleDelete(selected.id!)}>
                  {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div></div>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No SOP items created yet</p>
            <Button onClick={() => { setEditingItem(emptySOP); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Create First SOP
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {item.title}
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant={item.is_approved ? 'success' : 'secondary'}>
                        {item.is_approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{item.subtitle}</CardDescription>
                  </div>
                  {userRole === 'admin' || userRole === 'super-admin' ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={item.is_active}
                          onCheckedChange={(checked) => toggleActive(item.id!, checked)}
                        />
                      </div>
                      {(userRole === 'super-admin' || userRole === 'approver') && !item.is_approved ? (
                        <Button variant="success" size="sm" onClick={() => toggleApproved(item.id!)}>
                          Approve
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelected(item);
                          setIsDialogDelete(true);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : userRole === 'approver' && !item.is_approved ? (
                    <div className="flex items-center space-x-2">
                      <Button variant="success" className="w-full" onClick={() => toggleApproved(item.id!)}>
                        Approve
                      </Button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Publish date:</span>
                    <p className="text-muted-foreground">
                      {item.publish_date ? new Date(item.publish_date).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Author:</span>
                    <p className="text-muted-foreground">{item.author || '-'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{item.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Document:</span>
                    <p className="text-muted-foreground truncate">
                      {item.document_url ? (
                        <a className="text-primary underline" href={item.document_url} target="_blank" rel="noreferrer">View Document</a>
                      ) : (
                        'No document'
                      )}
                    </p>
                  </div>
                </div>
                {item.description && (
                  <div className="mt-4">
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SOPManagement;
