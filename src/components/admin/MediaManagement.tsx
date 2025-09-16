import { useState, useEffect } from 'react';
import { mediaService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';

interface Media {
  id: string; 
  title: string;
  image_url: string 
  file_url: string ; 
  categories: string ;
  subtitle: string ; 
  description: string ;  
  source: string ; 
  author: string[] ; 
  is_active: boolean; 
  is_approved: boolean; 
  created_at: string; 
  updated_at: string ; 
  published_date : string;
}

const MediaForm = ({ media, onSave, onCancel, saving }: {
  media: Media;
  onSave: (data: Media) => void;
  onCancel: () => void;
  saving: boolean
}) => {
  // Normalize published_date for input[type=datetime-local]
  const toDateTimeInput = (value?: string) => {
    if (!value) {return '' as any;}
    const d = new Date(value);
    if (isNaN(d.getTime())) {return '' as any;}
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16) as any; // YYYY-MM-DDTHH:mm
  };

  const [formData, setFormData] = useState<Media>({
    ...media,
    published_date: toDateTimeInput(media.published_date) as any,
  });
  const [authorInput, setAuthorInput] = useState<string>(
    Array.isArray(media.author) ? media.author.join(', ') : ''
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...media,
      published_date: toDateTimeInput(media.published_date) as any,
    }));
    setAuthorInput(Array.isArray(media.author) ? media.author.join(', ') : '');
  }, [media]);

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
          rows={2}
          placeholder="Brief summary of the content"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Categories</Label>
          <Select value={formData.categories} onValueChange={(value) => setFormData(prev => ({ ...prev, categories: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Berita">Berita</SelectItem>
              <SelectItem value="Artikel">Artikel</SelectItem>
              <SelectItem value="Kemitraan">Kemitraan</SelectItem>
              <SelectItem value="Pengumuman">Pengumuman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="published_date">Publish Date</Label>
          <Input
              id="published_date"
              type="datetime-local"
              value={formData.published_date || ''}
              onChange={(e) => {
                const value = e.target.value;
                const isValid = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
                if (isValid || value === '') {
                  setFormData(prev => ({
                    ...prev,
                    published_date: value
                  }));
                }
              }}
              min="2020-01-01T00:00"
              max="2030-12-31T23:59"
              required
            />
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <input
          id="source"
          value={formData.author}
          onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
          placeholder="Full author of the article/publication"
        />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUpload
          label="Featured Image"
          value={formData.image_url}
          onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
          bucket="images"
        />
        <div className="space-y-2">
          <Label htmlFor="file_url">File URL (for documents)</Label>
          <Input
            id="file_url"
            value={formData.file_url}
            onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
            placeholder="https://example.com/document.pdf"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Author(s)</Label>
          <Input
            id="author"
            value={authorInput}
            onChange={(e) => {
              const raw = e.target.value;
              setAuthorInput(raw);
              const parsed = raw
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);
              setFormData((prev) => ({ ...prev, author: parsed }));
            }}
            onBlur={() => {
              const normalized = (formData.author || []).join(', ');
              setAuthorInput(normalized);
            }}
            placeholder="e.g., John Doe, Jane Smith"
          />
          <p className="text-sm text-muted-foreground">
            Separate multiple authors with commas
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Input
            id="source"
            value={formData.source}
            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            placeholder="heritage, museum, culture"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_published">Publish Media Item</Label>
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

const emptyMedia: Media = {
  id: "", // placeholder for "no ID"
  title: "",
  image_url: "",
  file_url: "",
  categories: "",
  subtitle: "",
  description: "",
  source: "",
  author: [],
  is_active: false,
  is_approved: false,
  created_at: "", // ISO string will be filled later, e.g., new Date().toISOString()
  updated_at: "",
  published_date: ""
};

const MediaManagement = ({ userRole }: { userRole: string }) => {
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [media, setMedia] = useState<Media>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media>(emptyMedia);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isDialogDelete, setIsDialogDelete] = useState(false);

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await mediaService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMediaItems(response.data as Media[] || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMediaItem = async (item: Partial<Media>) => {
    setSaving(true);
    try {
      let response;

      if (item.id) {
        // Update existing media item
        response = await mediaService.update(item.id, item);
        if (response.error) {throw new Error(response.error);}

        setMediaItems(prev =>
          prev.map(existing =>
            existing.id === item.id ? { ...existing, ...item } as Media : existing
          )
        );
      } else {
        // Create new media item

        response = await mediaService.create(item);
        if (response.error) {throw new Error(response.error);}

        setMediaItems(prev => [response.data, ...prev]);
      }

      toast({
        title: 'Success',
        description: item.id
          ? 'Media item updated successfully'
          : 'Media item created successfully',
      });

      setIsDialogOpen(false);
      setEditingMedia(emptyMedia);
    } catch (error) {
      console.error('Error saving media item:', error);
      toast({
        title: 'Error',
        description: 'Failed to save media item',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await mediaService.update(id, { is_active: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMediaItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_active: isPublished } : item
      ));
      toast({
        title: 'Success',
        description: `Media item ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling media item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update media item status',
        variant: 'destructive',
      });
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await mediaService.delete(id);
      if (response.error) {throw new Error(response.error);}
      
      // setBanners(prev => prev.map(banner => 
      //   banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      // ));
      
      toast({
        title: 'Success',
        description: `Media Deleted`,
      });

      fetchMediaItems()
    } catch (error) {
      console.error('Error toggling media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    }
  };

  const toggleApproved = async (id: string) => {
    try {
      const response = await mediaService.approve(id);
      if (response.error) {throw new Error(response.error);}
      
      setMediaItems(prev => prev.map(media => 
        media.id === id ? { ...media, is_approved: response.data["is_approved"] } : media
      ));
      
      toast({
        title: 'Success',
        description: `Media Approved`,
      });
      fetchMediaItems();
    } catch (error) {
      console.error('Error toggling Media:', error);
      toast({
        title: 'Error',
        description: 'Failed to update Media status',
        variant: 'destructive',
      });
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
          <h2 className="text-2xl font-bold">Media & Publication Management</h2>
          <p className="text-muted-foreground">Manage news articles and publications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            { userRole !== "approver" && userRole !== "viewer" ? <Button onClick={() => setEditingMedia(emptyMedia)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button> : <div></div>}
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingMedia ? 'Edit Media Item' : 'Add New Media Item'}
              </DialogTitle>
              <DialogDescription>
                {editingMedia ? 'Update media item information' : 'Create a new news article, publication, or document'}
              </DialogDescription>
            </DialogHeader>
            <MediaForm
              media={editingMedia}
              // onclick={() => setEditingMedia(emptyMedia as Media)}
              onSave={saveMediaItem}
              onCancel={() => {
                setEditingMedia(emptyMedia);
                setIsDialogOpen(false);
              }}
              saving={saving}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {media != null  ? <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
          <DialogContent className="max-w-4xl">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + media.title + ' content'}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure want delete this' + media.title + ' content'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="submit" disabled={isDialogOpen} onClick={() => toggleDelete(media.id)}>
                    {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Trash className="w-4 h-4 mr-2" />
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : <div></div>}
      </div>
      {mediaItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No media items created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Media Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mediaItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {item.title}
                      <Badge variant={item.categories === 'news' ? 'default' : item.categories === 'publication' ? 'outline' : 'secondary'}>
                        {item.categories}
                      </Badge>
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{item.subtitle}</CardDescription>
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
                    {(userRole === 'super-admin' || userRole === 'approver') && !item.is_approved ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => toggleApproved(item.id)}
                      >
                        Approve
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMedia(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // setEditingBanner(banner);
                        setMedia(item)
                        setIsDialogDelete(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                    </div> : userRole === "approver" && !item.is_approved ? <div className="flex items-center space-x-2">
                        <Button
                          variant="success"
                          className="w-full"
                          onClick={() => toggleApproved(item.id)}
                        >
                          Approve
                        </Button>
                    </div> : <div></div>
                }
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground line-clamp-2">
                      {item.description || 'No excerpt'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>
                    <p className="text-muted-foreground">
                      {item.published_date ? new Date(item.published_date).toLocaleDateString() : 'Not published'}
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaManagement;
