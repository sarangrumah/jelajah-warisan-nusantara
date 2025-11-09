import { useState, useEffect } from 'react';
import { publicationService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import QuillEditor from '@/components/ui/quill-editor';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
import { FileUpload } from '@/components/ui/file-upload';

interface Publication {
  id: string;
  title: string;
  description: string;
  type: 'publication';
  category: string;
  year: string;
  size: string;
  pages: number;
  downloadCount: number;
  published_at: string;
  url: string;
  is_active: boolean;
  is_approved: boolean;
  is_rejected: boolean;
  reason_rejected?: string;
  created_at: string;
  updated_at: string;
}

const PublicationForm = ({ publication, onSave, onCancel, saving }: {
  publication: Publication;
  onSave: (data: Publication) => void;
  onCancel: () => void;
  saving: boolean
}) => {
  const [formData, setFormData] = useState<Publication>(publication);

  useEffect(() => {
    setFormData(publication);
  }, [publication]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
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
        <Label htmlFor="description">Description</Label>
        <QuillEditor
          value={formData.description || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, description: html }))}
          height={100}
          placeholder="Brief summary of the content"
        />
      </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="berita">Berita</SelectItem>
              <SelectItem value="artikel">Artikel</SelectItem>
              <SelectItem value="kemitraan">Kemitraan</SelectItem>
              <SelectItem value="pengumuman">Pengumuman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_at">Publish Date</Label>
          <Input
              id="published_at"
              type="date"
              value={formData.published_at ? formData.published_at.split('T')[0] : ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  published_at: value
                }));
              }}
              required
            />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pages">Pages</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">File Size</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
            placeholder="e.g., 12.5 MB"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            value={formData.year}
            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
            placeholder="e.g., 2023"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File (PDF Document)</Label>
        <FileUpload
          onSuccess={(url, size) => {
            setFormData(prev => ({
              ...prev,
              url: url,
              size: (size / 1024 / 1024).toFixed(2) + ' MB',
             }));
          }}
          onError={(error) => {
             // Handle error, e.g., show a toast
            console.error(error);
           }}
           bucket="publication"
          acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
        />
        {formData.url && (
        <div className="text-sm">
          Current file: <a href={formData.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">{formData.url.split('/').pop()}</a>
        </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Publish Publication</Label>
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

const emptyPublication: Publication = {
  id: "",
  title: "",
  description: "",
  type: 'publication',
  category: "berita",
  year: new Date().getFullYear().toString(),
  size: "0 MB",
  pages: 0,
  downloadCount: 0,
  published_at: new Date().toISOString().split('T')[0],
  url: "",
  is_active: false,
  is_approved: false,
  is_rejected: false,
  reason_rejected: '',
  created_at: "",
  updated_at: "",
};


const PublicationManagement = ({ userRole }: { userRole: string }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [publication, setPublication] = useState<Publication>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication>(emptyPublication);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isDialogDelete, setIsDialogDelete] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const response = await publicationService.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      const items = ((response.data as Publication[] | undefined) || []).filter(item => item.type === 'publication');
      setPublications(items.map(item => ({
        ...item,
        reason_rejected: item.reason_rejected ?? '',
      })));
    } catch (error) {
      console.error('Error fetching publications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load publications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePublication = async (item: Partial<Publication>) => {
    setSaving(true);
    try {
       const payload: Partial<Publication> = { ...item, type: 'publication' };

      if (item.id) {
        await publicationService.update(item.id, payload);
      } else {
        if (!payload.url) {
          toast({
            title: 'File required',
            description: 'Please upload a PDF document before saving.',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
        await publicationService.create(payload);
      }

      toast({
        title: 'Success',
        description: `Publication ${item.id ? 'updated' : 'created'} successfully`,
      });

      setIsDialogOpen(false);
      fetchPublications(); // Refresh list
    } catch (error) {
      console.error('Error saving publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to save publication',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await publicationService.update(id, { is_active: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setPublications(prev => prev.map(item =>
        item.id === id ? { ...item, is_active: isPublished } : item
      ));
      toast({
        title: 'Success',
        description: `Publication ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling publication status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update publication status',
        variant: 'destructive',
      });
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await publicationService.delete(id);
      if (response.error) {throw new Error(response.error);}
      
      // setBanners(prev => prev.map(banner => 
      //   banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      // ));
      
      toast({
        title: 'Success',
        description: `Publication Deleted`,
      });

      fetchPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete publication',
        variant: 'destructive',
      });
    }
  };

  const toggleApproved = async (id: string) => {
    try {
      const response = await publicationService.approve(id);
      if (response.error) {throw new Error(response.error);}
      
      const updated = (response.data || {}) as Partial<Publication>;

      setPublications(prev => prev.map(p =>
        p.id === id
          ? {
              ...p,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
              reason_rejected: '',
            }
          : p
      ));
      
      toast({
        title: 'Success',
        description: `Publication Approved`,
      });
      fetchPublications();
    } catch (error) {
      console.error('Error approving publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve publication',
        variant: 'destructive',
      });
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
      toast({
        title: 'Reason required',
        description: 'Please enter a rejection reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRejectSubmitting(true);
      const response = await publicationService.reject(rejectingId, trimmedReason);
      if (response.error) {throw new Error(response.error);}

      const updated = (response.data || {}) as Partial<Publication>;

      setPublications(prev => prev.map(p =>
        p.id === rejectingId
          ? {
              ...p,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
              reason_rejected: updated.reason_rejected ?? trimmedReason,
            }
          : p
      ));

      toast({
        title: 'Success',
        description: 'Publication rejected',
      });
      closeRejectDialog();
      fetchPublications();
    } catch (error) {
      console.error('Error rejecting publication:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject publication',
        variant: 'destructive',
      });
    } finally {
      setRejectSubmitting(false);
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
      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Reject Publication"
      />

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Publication Management</h2>
          <p className="text-muted-foreground">Manage publication documents</p>
        </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              { userRole !== "approver" && userRole !== "viewer" ? <Button onClick={() => setEditingPublication(emptyPublication)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Publication
              </Button> : <div></div>}
            </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingPublication.id ? 'Edit Publication' : 'Add New Publication'}
              </DialogTitle>
              <DialogDescription>
                {editingPublication.id ? 'Update publication information' : 'Create a new publication document'}
              </DialogDescription>
            </DialogHeader>
            <PublicationForm
              publication={editingPublication}
              onSave={savePublication}
              onCancel={() => {
                setEditingPublication(emptyPublication);
                setIsDialogOpen(false);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {publication != null  ? <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
          <DialogContent className="max-w-md">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + publication.title}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure you want to delete this publication?'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                      Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => toggleDelete(publication.id)}>
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : null}
      </div>
      {publications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No publications created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Publication
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {publications.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{item.title}</span>
                      <Badge variant="outline">{item.category}</Badge>
                       <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={item.is_approved ? 'success' : item.is_rejected ? 'destructive' : 'secondary'}>
                        {item.is_approved ? 'Approved' : item.is_rejected ? 'Rejected' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{item.year} • {item.pages} pages • {item.size}</CardDescription>
                   </div>
                {
                  userRole === "admin" || userRole === "super-admin" ? <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={item.is_active}
                        onCheckedChange={(checked) => togglePublished(item.id, checked)}
                      />
                    </div>
                    {(userRole === 'super-admin' || userRole === 'admin' || userRole === 'approver') && !item.is_approved && !item.is_rejected ? (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => toggleApproved(item.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRejectDialog(item.id)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPublication(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                     <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setPublication(item)
                        setIsDialogDelete(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                    </div> : userRole === "approver" && !item.is_approved && !item.is_rejected ? <div className="flex items-center space-x-2">
                        <Button
                          variant="success"
                          className="w-full"
                          onClick={() => toggleApproved(item.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => openRejectDialog(item.id)}
                        >
                          Reject
                        </Button>
                    </div> : <div></div>
                }
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <div
                      className="text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.description || 'No excerpt') }}
                    />
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>
                    <p className="text-muted-foreground">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                   <div>
                    <span className="font-medium">File URL:</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline line-clamp-1">
                      {item.url}
                    </a>
                  </div>
                </div>
                {item.is_rejected && item.reason_rejected?.trim() ? (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                    <p className="text-sm text-muted-foreground">{item.reason_rejected}</p>
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

export default PublicationManagement;