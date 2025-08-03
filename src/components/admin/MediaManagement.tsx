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

const MediaManagement = () => {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const response = await mediaService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMediaItems(response.data || []);
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

  const saveMediaItem = async (formData: any) => {
    setSaving(true);
    try {
      const mediaData = {
        title: formData.title,
        type: formData.type,
        content: formData.content,
        excerpt: formData.excerpt,
        image_url: formData.image_url,
        file_url: formData.file_url,
        category: formData.category,
        tags: formData.tags?.split(',').map((tag: string) => tag.trim()).filter(Boolean) || [],
        is_published: formData.is_published,
        published_at: formData.is_published ? new Date().toISOString() : null,
      };

      if (editingMedia?.id) {
        const response = await mediaService.update(editingMedia.id, mediaData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setMediaItems(prev => prev.map(m => 
          m.id === editingMedia.id ? { ...m, ...mediaData } : m
        ));
        
        toast({
          title: 'Success',
          description: 'Media item updated successfully',
        });
      } else {
        const response = await mediaService.create(mediaData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setMediaItems(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Media item created successfully',
        });
      }
      
      setEditingMedia(null);
      setIsDialogOpen(false);
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

  const MediaForm = ({ media, onSave, onCancel }: {
    media?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: media?.title || '',
      type: media?.type || 'news',
      content: media?.content || '',
      excerpt: media?.excerpt || '',
      image_url: media?.image_url || '',
      file_url: media?.file_url || '',
      category: media?.category || '',
      tags: (media?.tags || []).join(', '),
      is_published: media?.is_published ?? true,
    });

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
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
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
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            placeholder="Brief summary of the content"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            placeholder="Full content of the article/publication"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload
            label="Featured Image"
            value={formData.image_url}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            bucket="media"
            maxSize={5}
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
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Museum Events, Press Release"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="heritage, museum, culture"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMedia(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
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
              onSave={saveMediaItem}
              onCancel={() => {
                setEditingMedia(null);
                setIsDialogOpen(false);
              }}
            />
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