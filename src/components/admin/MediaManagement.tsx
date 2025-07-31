import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, Trash2, FileText, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface MediaItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  type: 'news' | 'publication' | 'press_release' | 'photo_gallery' | 'video';
  featured_image_url?: string;
  media_url?: string;
  author?: string;
  tags: string[];
  category?: string;
  published_at?: string;
  is_published: boolean;
  featured: boolean;
  download_count?: number;
  views_count?: number;
  created_at: string;
  updated_at: string;
}

const MediaManagement = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | MediaItem['type']>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaItems();
  }, []);

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data media',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMediaItem = async (item: Partial<MediaItem>) => {
    setSaving(true);
    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from('media_items')
          .update(item)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        
        setMediaItems(prev => prev.map(m => 
          m.id === editingItem.id ? { ...m, ...item } : m
        ));
        
        toast({
          title: 'Berhasil',
          description: 'Media berhasil diperbarui',
        });
      } else {
        const { data, error } = await supabase
          .from('media_items')
          .insert([item])
          .select()
          .single();
        
        if (error) throw error;
        
        setMediaItems(prev => [data, ...prev]);
        
        toast({
          title: 'Berhasil',
          description: 'Media berhasil ditambahkan',
        });
      }
      
      setEditingItem(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving media item:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan media',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteMediaItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMediaItems(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: 'Berhasil',
        description: 'Media berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting media item:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus media',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const updateData: any = { is_published: isPublished };
      if (isPublished && !mediaItems.find(m => m.id === id)?.published_at) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('media_items')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      setMediaItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      
      toast({
        title: 'Berhasil',
        description: `Media ${isPublished ? 'dipublikasikan' : 'diturunkan'}`,
      });
    } catch (error) {
      console.error('Error toggling media item:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status media',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'news':
      case 'press_release':
        return <FileText className="w-4 h-4" />;
      case 'photo_gallery':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: MediaItem['type']) => {
    const labels = {
      news: 'Berita',
      publication: 'Publikasi',
      press_release: 'Siaran Pers',
      photo_gallery: 'Galeri Foto',
      video: 'Video'
    };
    return labels[type];
  };

  const MediaForm = ({ item, onSave, onCancel }: {
    item?: MediaItem | null;
    onSave: (data: Partial<MediaItem>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      title: item?.title || '',
      content: item?.content || '',
      excerpt: item?.excerpt || '',
      type: item?.type || 'news' as MediaItem['type'],
      featured_image_url: item?.featured_image_url || '',
      media_url: item?.media_url || '',
      author: item?.author || '',
      tags: item?.tags?.join(', ') || '',
      category: item?.category || '',
      is_published: item?.is_published ?? false,
      featured: item?.featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const mediaData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };
      
      onSave(mediaData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Media</Label>
            <Select
              value={formData.type}
              onValueChange={(value: MediaItem['type']) => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">Berita</SelectItem>
                <SelectItem value="publication">Publikasi</SelectItem>
                <SelectItem value="press_release">Siaran Pers</SelectItem>
                <SelectItem value="photo_gallery">Galeri Foto</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Ringkasan</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            rows={2}
            placeholder="Ringkasan singkat untuk preview"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Konten</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            placeholder="Isi lengkap artikel/konten"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="featured_image_url">URL Gambar Utama</Label>
            <Input
              id="featured_image_url"
              value={formData.featured_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="media_url">URL Media Tambahan</Label>
            <Input
              id="media_url"
              value={formData.media_url}
              onChange={(e) => setFormData(prev => ({ ...prev, media_url: e.target.value }))}
              placeholder="https://example.com/video.mp4 atau https://example.com/document.pdf"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Penulis/Pembuat</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="museum, sejarah, budaya"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
            />
            <Label htmlFor="is_published">Publikasikan</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
            />
            <Label htmlFor="featured">Unggulan</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        </div>
      </form>
    );
  };

  const filteredItems = mediaItems.filter(item => 
    filterType === 'all' || item.type === filterType
  );

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
          <h2 className="text-2xl font-bold">Manajemen Media & Publikasi</h2>
          <p className="text-muted-foreground">Kelola berita, publikasi, dan konten media lainnya</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Media' : 'Tambah Media Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Perbarui informasi media' : 'Tambahkan media atau publikasi baru'}
              </DialogDescription>
            </DialogHeader>
            <MediaForm
              item={editingItem}
              onSave={saveMediaItem}
              onCancel={() => {
                setEditingItem(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Semua ({mediaItems.length})
        </Button>
        {(['news', 'publication', 'press_release', 'photo_gallery', 'video'] as const).map((type) => (
          <Button
            key={type}
            variant={filterType === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(type)}
          >
            {getTypeIcon(type)}
            <span className="ml-1">
              {getTypeLabel(type)} ({mediaItems.filter(m => m.type === type).length})
            </span>
          </Button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {filterType === 'all' 
                ? 'Belum ada media yang ditambahkan' 
                : `Belum ada ${getTypeLabel(filterType)} yang ditambahkan`
              }
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Media Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      {item.title}
                      <Badge variant="outline">
                        {getTypeLabel(item.type)}
                      </Badge>
                      {item.featured && (
                        <Badge variant="default">Unggulan</Badge>
                      )}
                      <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {item.author && `Oleh ${item.author} • `}
                      {item.category && `${item.category} • `}
                      {item.published_at && new Date(item.published_at).toLocaleDateString()}
                    </CardDescription>
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
                        setEditingItem(item);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Media</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus "{item.title}"? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMediaItem(item.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {item.excerpt && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.excerpt}
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Views:</span>
                    <p className="text-muted-foreground">{item.views_count || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium">Downloads:</span>
                    <p className="text-muted-foreground">{item.download_count || 0}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tags:</span>
                    <p className="text-muted-foreground">
                      {item.tags.length > 0 ? item.tags.slice(0, 3).join(', ') : 'Tidak ada'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Terakhir diperbarui:</span>
                    <p className="text-muted-foreground">
                      {new Date(item.updated_at).toLocaleDateString()}
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