import { useState, useEffect } from 'react';
import { museumService } from '@/lib/api-services';
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
import { GalleryUpload } from '@/components/ui/gallery-upload';

interface MuseumItem {
  id?: string | null;
  name: string;
  type: string;
  description: string;
  location: string;
  address: string;
  image_url: string;
  gallery_images: string[];
  latitude: string; // Form handles as string for input
  longitude: string; // Form handles as string for input
  opening_hours: any; // JSON string in form
  contact_info: {
    phone: string;
    email: string;
    website: string;
  };
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

  const MuseumForm = ({ museum, onSave, onCancel, saving }: {
    museum: MuseumItem;
    onSave: (data: MuseumItem) => void;
    onCancel: () => void;
    saving: boolean;
  }) => {
    const [formData, setFormData] = useState<MuseumItem>({
      ...museum,
      gallery_images: Array.isArray(museum.gallery_images) ? museum.gallery_images : []
    });

    // This ensures proper state updates
    const handleImageUpload = async (url: string) => {
      setFormData(prev => ({
        ...prev,
        image_url: url
      }));
    };

    const handleGalleryUpload = async (urls: string[]) => {
      setFormData(prev => ({
        ...prev,
        gallery_images: urls
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
        onSave(formData);
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                <SelectItem value="museum">Museum</SelectItem>
                <SelectItem value="heritage">Heritage Site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={2}
            />
          </div>
        </div>

        <ImageUpload
          label="Main Image"
          value={formData.image_url}
          onChange={handleImageUpload}
          bucket="images"
        />

        <GalleryUpload
          label="Gallery Images"
          value={formData.gallery_images}
          onChange={handleGalleryUpload}
          bucket="images"
          maxImages={8}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              placeholder="-6.2088"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              placeholder="106.8456"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="opening_hours">Opening Hours (JSON format)</Label>
          <Textarea
            id="opening_hours"
            value={formData.opening_hours}
            onChange={(e) => setFormData(prev => ({ ...prev, opening_hours: e.target.value }))}
            placeholder='{"monday": "09:00-17:00", "tuesday": "09:00-17:00"}'
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.contact_info.phone}
               onChange={(e) => setFormData(prev => ({ ...prev, contact_info: {
                ...prev.contact_info,
                phone: e.target.value
              }}))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.contact_info.email}
               onChange={(e) => setFormData(prev => ({ ...prev, contact_info: {
                ...prev.contact_info,
                email: e.target.value
              }}))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.contact_info.website}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_info: {
                ...prev.contact_info,
                website: e.target.value
              }}))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={formData.is_published}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
          />
          <Label htmlFor="is_published">Publish Museum</Label>
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

  const emptyMuseum: MuseumItem = {
  name: '',
  type: 'museum',
  description: '',
  location: '',
  address: '',
  image_url: '',
  gallery_images: [],
  latitude: null,
  longitude: null,
  opening_hours: "{}",
  contact_info: {
    phone: '',
    email: '',
    website: ''
  },
  is_published: true
  };
const MuseumManagement = () => {
  const [museums, setMuseums] = useState<MuseumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<MuseumItem>(emptyMuseum);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMuseums();
  }, []);

  const fetchMuseums = async () => {
    try {
      const response = await museumService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMuseums(response.data as MuseumItem[] || []);
    } catch (error) {
      console.error('Error fetching museums:', error);
      toast({
        title: 'Error',
        description: 'Failed to load museums',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMuseum = async (formData: MuseumItem) => {
    setSaving(true);
    let response 
    try {
      const museumData: MuseumItem = {
        ...formData,
        gallery_images: formData.gallery_images,
        latitude: formData.latitude ,
        longitude: formData.longitude,
        opening_hours: typeof formData.opening_hours === 'string' 
          ? JSON.parse(formData.opening_hours)
          : formData.opening_hours,
        contact_info: {
          phone: formData.contact_info.phone,
          email: formData.contact_info.email,
          website: formData.contact_info.website
        }
      };

      if (editingMuseum?.id) {
        const response = await museumService.update(editingMuseum.id, museumData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setMuseums(prev => prev.map(m => 
          m.id === editingMuseum.id ? { ...m, ...museumData } : m
        ));
        
        toast({
          title: 'Success',
          description: 'Museum updated successfully',
        });
      } else {
        response = await museumService.create(museumData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setMuseums(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Museum created successfully',
        });
      }
      
      setEditingMuseum(emptyMuseum);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving museum:', error);
      toast({
        title: 'Error',
        description: 'Failed to save museum',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await museumService.update(id, { is_published: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setMuseums(prev => prev.map(museum => 
        museum.id === id ? { ...museum, is_published: isPublished } : museum
      ));
      
      toast({
        title: 'Success',
        description: `Museum ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling museum:', error);
      toast({
        title: 'Error',
        description: 'Failed to update museum status',
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
          <h2 className="text-2xl font-bold">Museum & Heritage Management</h2>
          <p className="text-muted-foreground">Manage museums and heritage sites</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMuseum(emptyMuseum)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Museum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingMuseum ? 'Edit Museum' : 'Add New Museum'}
              </DialogTitle>
              <DialogDescription>
                {editingMuseum ? 'Update museum information' : 'Create a new museum or heritage site'}
              </DialogDescription>
            </DialogHeader>
            <MuseumForm
              museum={editingMuseum}
              onSave={saveMuseum}
              saving={saving}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {museums.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No museums created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Museum
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {museums.map((museum) => (
            <Card key={museum.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {museum.name}
                      <Badge variant={museum.type === 'museum' ? 'default' : 'outline'}>
                        {museum.type}
                      </Badge>
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="text-muted-foreground line-clamp-2">
                      {museum.description || 'No description'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Last updated:</span>
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