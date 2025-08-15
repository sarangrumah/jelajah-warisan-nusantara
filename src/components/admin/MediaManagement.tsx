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
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';

interface MediaItem {
  id?: string | null;
  title: string;
  type: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  file_url: string;
  is_published: boolean;
  published_at?: string | null;
  tags: any;
}


const MediaManagement = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();


  const emptyItem: Partial<MediaItem> = {
    title: '',
    type: 'news',
    category: '',
    excerpt: '',
    content: '',
    image_url: '',
    file_url: '',
    tags: [],
    is_published: true,
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await mediaService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMediaItems(response.data as MediaItem[] || []);
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

  const saveMediaItem = async (item: Partial<MediaItem>) => {
    setSaving(true);
    try {
      let response;

      if (item.id) {
        // Update existing media item
        response = await mediaService.update(item.id, item);
        if (response.error) throw new Error(response.error);

        setMediaItems(prev =>
          prev.map(existing =>
            existing.id === item.id ? { ...existing, ...item } as MediaItem : existing
          )
        );
      } else {
        // Create new media item
        // const newItem: Omit<MediaItem, 'id' | 'created_at'> = {
        //   title: item.title || '',
        //   type: item.type || '',
        //   category: item.category || '',
        //   excerpt: item.excerpt || '',
        //   content: item.content || '',
        //   image_url: item.image_url || '',
        //   file_url: item.file_url || '',
        //   tags: typeof item.tags === 'string'
        //     ? item.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        //     : (item.tags || []),
        //   is_published: item.is_published ?? true,
        //   published_at: item.is_published ? new Date().toISOString() : null,
        // };

        response = await mediaService.create(item);
        if (response.error) throw new Error(response.error);

        setMediaItems(prev => [response.data, ...prev]);
      }

      toast({
        title: 'Success',
        description: item.id
          ? 'Media item updated successfully'
          : 'Media item created successfully',
      });

      setIsDialogOpen(false);
      setEditingMedia(null);
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
      const response = await mediaService.update(id, { 
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMediaItems(prev => prev.map(item => 
        item.id === id ? { ...item, is_published: isPublished } : item
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

 const MediaForm = ({ 
  media, 
  onSave, 
  onCancel,
  saving 
}: {
  media: MediaItem;
  onSave: (data: MediaItem) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [formData, setFormData] = useState<MediaItem>(media);

  // Update form when media prop changes
  useEffect(() => {
    setFormData(media);
  }, [media]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: typeof formData.tags === 'string' 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : formData.tags || []
    });
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
          <Label htmlFor="type">Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="news">News</SelectItem>
              <SelectItem value="publication">Publication</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={editingMedia.excerpt}
            onChange={(e) => setEditingMedia(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            placeholder="Brief summary of the content"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={editingMedia.content}
            onChange={(e) => setEditingMedia(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            placeholder="Full content of the article/publication"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload
            label="Featured Image"
            value={editingMedia.image_url}
            onChange={(url) => setEditingMedia(prev => ({ ...prev, image_url: url }))}
            bucket="media"
            maxSize={5}
          />
          <div className="space-y-2">
            <Label htmlFor="file_url">File URL (for documents)</Label>
            <Input
              id="file_url"
              value={editingMedia.file_url}
              onChange={(e) => setEditingMedia(prev => ({ ...prev, file_url: e.target.value }))}
              placeholder="https://example.com/document.pdf"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={editingMedia.category}
              onChange={(e) => setEditingMedia(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Museum Events, Press Release"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={editingMedia.tags}
              onChange={(e) => setEditingMedia(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="heritage, museum, culture"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={editingMedia.is_published}
            onCheckedChange={(checked) => setEditingMedia(prev => ({ ...prev, is_published: checked }))}
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
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setTimeout(() => setEditingMedia(null), 300);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMedia(emptyItem as MediaItem)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingMedia?.id ? 'Edit Media Item' : 'Add New Media Item'}
              </DialogTitle>
            </DialogHeader>
            {editingMedia && (
              <MediaForm
                media={editingMedia}
                onSave={saveMediaItem}
                onCancel={() => setIsDialogOpen(false)}
                saving={saving}
              />
            )}
          </DialogContent>
        </Dialog>
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
                      <Badge variant={item.type === 'news' ? 'default' : item.type === 'publication' ? 'outline' : 'secondary'}>
                        {item.type}
                      </Badge>
                      <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(item.id, !item.is_published)}
                    >
                      {item.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Excerpt:</span>
                    <p className="text-muted-foreground line-clamp-2">
                      {item.excerpt || 'No excerpt'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>
                    <p className="text-muted-foreground">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Not published'}
                    </p>
                  </div>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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

export default MediaManagement;