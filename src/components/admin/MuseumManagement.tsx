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
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Museum {
  id: string;
  name: string;
  description: string;
  type: 'museum' | 'heritage_site';
  location: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  images: string[];
  opening_hours?: string;
  admission_fee?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  facilities: string[];
  collections?: string[];
  historical_significance?: string;
  visitor_guidelines?: string;
  is_published: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const MuseumManagement = () => {
  const [museums, setMuseums] = useState<Museum[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<Museum | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'museum' | 'heritage_site'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      const { data, error } = await supabase
        .from('museums')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMuseums(data || []);
    } catch (error) {
      console.error('Error fetching museums:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data museum',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMuseum = async (museum: Partial<Museum>) => {
    setSaving(true);
    try {
      if (editingMuseum?.id) {
        const { error } = await supabase
          .from('museums')
          .update(museum)
          .eq('id', editingMuseum.id);
        
        if (error) throw error;
        
        setMuseums(prev => prev.map(m => 
          m.id === editingMuseum.id ? { ...m, ...museum } : m
        ));
        
        toast({
          title: 'Berhasil',
          description: 'Museum berhasil diperbarui',
        });
      } else {
        const { data, error } = await supabase
          .from('museums')
          .insert([museum])
          .select()
          .single();
        
        if (error) throw error;
        
        setMuseums(prev => [data, ...prev]);
        
        toast({
          title: 'Berhasil',
          description: 'Museum berhasil ditambahkan',
        });
      }
      
      setEditingMuseum(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving museum:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan museum',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteMuseum = async (id: string) => {
    try {
      const { error } = await supabase
        .from('museums')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMuseums(prev => prev.filter(m => m.id !== id));
      
      toast({
        title: 'Berhasil',
        description: 'Museum berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting museum:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus museum',
        variant: 'destructive',
      });
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('museums')
        .update({ is_published: isPublished })
        .eq('id', id);
      
      if (error) throw error;
      
      setMuseums(prev => prev.map(museum => 
        museum.id === id ? { ...museum, is_published: isPublished } : museum
      ));
      
      toast({
        title: 'Berhasil',
        description: `Museum ${isPublished ? 'dipublikasikan' : 'diturunkan'}`,
      });
    } catch (error) {
      console.error('Error toggling museum:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status museum',
        variant: 'destructive',
      });
    }
  };

  const MuseumForm = ({ museum, onSave, onCancel }: {
    museum?: Museum | null;
    onSave: (data: Partial<Museum>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: museum?.name || '',
      description: museum?.description || '',
      type: museum?.type || 'museum' as 'museum' | 'heritage_site',
      location: museum?.location || '',
      address: museum?.address || '',
      coordinates: {
        lat: museum?.coordinates?.lat || 0,
        lng: museum?.coordinates?.lng || 0,
      },
      images: museum?.images?.join('\n') || '',
      opening_hours: museum?.opening_hours || '',
      admission_fee: museum?.admission_fee || '',
      contact_info: {
        phone: museum?.contact_info?.phone || '',
        email: museum?.contact_info?.email || '',
        website: museum?.contact_info?.website || '',
      },
      facilities: museum?.facilities?.join('\n') || '',
      collections: museum?.collections?.join('\n') || '',
      historical_significance: museum?.historical_significance || '',
      visitor_guidelines: museum?.visitor_guidelines || '',
      is_published: museum?.is_published ?? true,
      featured: museum?.featured ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const museumData = {
        ...formData,
        images: formData.images.split('\n').filter(img => img.trim()),
        facilities: formData.facilities.split('\n').filter(f => f.trim()),
        collections: formData.collections.split('\n').filter(c => c.trim()),
        coordinates: formData.coordinates.lat && formData.coordinates.lng ? formData.coordinates : null,
      };
      
      onSave(museumData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Museum/Cagar Budaya</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'museum' | 'heritage_site') => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="museum">Museum</SelectItem>
                <SelectItem value="heritage_site">Cagar Budaya</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={formData.coordinates.lat}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={formData.coordinates.lng}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">URL Gambar (satu per baris)</Label>
          <Textarea
            id="images"
            value={formData.images}
            onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
            rows={3}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="opening_hours">Jam Buka</Label>
            <Input
              id="opening_hours"
              value={formData.opening_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, opening_hours: e.target.value }))}
              placeholder="Senin-Jumat: 08:00-16:00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admission_fee">Harga Tiket</Label>
            <Input
              id="admission_fee"
              value={formData.admission_fee}
              onChange={(e) => setFormData(prev => ({ ...prev, admission_fee: e.target.value }))}
              placeholder="Gratis / Rp 5.000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telepon</Label>
            <Input
              id="phone"
              value={formData.contact_info.phone}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, phone: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact_info.email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, email: e.target.value }
              }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.contact_info.website}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                contact_info: { ...prev.contact_info, website: e.target.value }
              }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilities">Fasilitas (satu per baris)</Label>
          <Textarea
            id="facilities"
            value={formData.facilities}
            onChange={(e) => setFormData(prev => ({ ...prev, facilities: e.target.value }))}
            rows={3}
            placeholder="Parkir&#10;Toilet&#10;Cafeteria"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="collections">Koleksi (satu per baris)</Label>
          <Textarea
            id="collections"
            value={formData.collections}
            onChange={(e) => setFormData(prev => ({ ...prev, collections: e.target.value }))}
            rows={3}
            placeholder="Artefak Prasejarah&#10;Benda Seni Tradisional"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="historical_significance">Signifikansi Sejarah</Label>
          <Textarea
            id="historical_significance"
            value={formData.historical_significance}
            onChange={(e) => setFormData(prev => ({ ...prev, historical_significance: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitor_guidelines">Panduan Pengunjung</Label>
          <Textarea
            id="visitor_guidelines"
            value={formData.visitor_guidelines}
            onChange={(e) => setFormData(prev => ({ ...prev, visitor_guidelines: e.target.value }))}
            rows={3}
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

  const filteredMuseums = museums.filter(museum => 
    filterType === 'all' || museum.type === filterType
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
          <h2 className="text-2xl font-bold">Manajemen Museum & Cagar Budaya</h2>
          <p className="text-muted-foreground">Kelola daftar museum dan situs cagar budaya</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMuseum(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Museum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingMuseum ? 'Edit Museum' : 'Tambah Museum/Cagar Budaya Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingMuseum ? 'Perbarui informasi museum' : 'Tambahkan museum atau cagar budaya baru'}
              </DialogDescription>
            </DialogHeader>
            <MuseumForm
              museum={editingMuseum}
              onSave={saveMuseum}
              onCancel={() => {
                setEditingMuseum(null);
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Semua ({museums.length})
        </Button>
        <Button
          variant={filterType === 'museum' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('museum')}
        >
          Museum ({museums.filter(m => m.type === 'museum').length})
        </Button>
        <Button
          variant={filterType === 'heritage_site' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType('heritage_site')}
        >
          Cagar Budaya ({museums.filter(m => m.type === 'heritage_site').length})
        </Button>
      </div>

      {filteredMuseums.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {filterType === 'all' 
                ? 'Belum ada museum atau cagar budaya yang ditambahkan' 
                : `Belum ada ${filterType === 'museum' ? 'museum' : 'cagar budaya'} yang ditambahkan`
              }
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah {filterType === 'all' ? 'Museum/Cagar Budaya' : filterType === 'museum' ? 'Museum' : 'Cagar Budaya'} Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMuseums.map((museum) => (
            <Card key={museum.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {museum.name}
                      <Badge variant={museum.type === 'museum' ? 'default' : 'secondary'}>
                        {museum.type === 'museum' ? 'Museum' : 'Cagar Budaya'}
                      </Badge>
                      {museum.featured && (
                        <Badge variant="outline">Unggulan</Badge>
                      )}
                      <Badge variant={museum.is_published ? 'default' : 'secondary'}>
                        {museum.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{museum.location}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(museum.id, !museum.is_published)}
                    >
                      {museum.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMuseum(museum);
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
                          <AlertDialogTitle>Hapus Museum</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus "{museum.name}"? Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMuseum(museum.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {museum.description.substring(0, 200)}...
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Jam Buka:</span>
                    <p className="text-muted-foreground">{museum.opening_hours || 'Belum diatur'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Tiket:</span>
                    <p className="text-muted-foreground">{museum.admission_fee || 'Belum diatur'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Fasilitas:</span>
                    <p className="text-muted-foreground">{museum.facilities.length} item</p>
                  </div>
                  <div>
                    <span className="font-medium">Terakhir diperbarui:</span>
                    <p className="text-muted-foreground">
                      {new Date(museum.updated_at).toLocaleDateString()}
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

export default MuseumManagement;