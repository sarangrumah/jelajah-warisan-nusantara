import { useState, useEffect } from 'react';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
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
  img_banner: string;
  gallery_images: { path: string; sites: string }[];
  latitude: string; // Form handles as string for input
  longitude: string; // Form handles as string for input
  opening_hours: any; // JSON string in form
  contact_info: {
    phone: string;
    email: string;
    website: string;
  };
  is_published: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  created_at?: string;
  updated_at?: string;
}

  const MuseumForm = ({ museum, onSave, onCancel, saving, types }: {
    museum: MuseumItem;
    onSave: (data: MuseumItem) => void;
    onCancel: () => void;
    saving: boolean;
    types: any[];
  }) => {
    const [formData, setFormData] = useState<MuseumItem>({
      ...museum,
      gallery_images: Array.isArray(museum.gallery_images) ? museum.gallery_images.map(img => typeof img === 'string' ? { path: img, sites: '' } : img) : []
    });

    // This ensures proper state updates
    const handleImageUpload = async (url: string) => {
      setFormData(prev => ({
        ...prev,
        img_banner: url
      }));
    };

    const handleGalleryUpload = async (images: { path: string; sites: string }[]) => {
      setFormData(prev => ({
        ...prev,
        gallery_images: images
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
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
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
          value={formData.img_banner}
          onChange={(url) => setFormData(prev => ({ ...prev, img_banner: url }))}
          bucket="museum"
        />

        <GalleryUpload
          label="Gallery Images"
          value={formData.gallery_images}
          onChange={handleGalleryUpload}
          bucket="museum"
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
  type: '',
  description: '',
  location: '',
  address: '',
  img_banner: '',
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
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMuseum, setEditingMuseum] = useState<MuseumItem>(emptyMuseum);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [museumsResponse, typesResponse] = await Promise.all([
        museumService.getAll({ limit: 1000 }),
        TypesAndCategoriesSites.getAllTypes()
      ]);
      
      console.log('Museums Response:', museumsResponse);
      console.log('Types Response:', typesResponse);

      if (museumsResponse.error) throw new Error(museumsResponse.error);
      
      // Map backend data to frontend model
      const rawMuseums = museumsResponse.data as any[] || [];
      console.log('Raw museums count:', rawMuseums.length);
      
      // Debug: Check if Museum Majapahit exists in raw data
      const majapahitMuseum = rawMuseums.find(m => 
        m.name?.toLowerCase().includes('majapahit') ||
        m.title?.toLowerCase().includes('majapahit')
      );
      console.log('Museum Majapahit in raw data:', !!majapahitMuseum);
      if (majapahitMuseum) {
        console.log('Majapahit museum raw data:', {
          id: majapahitMuseum.id,
          name: majapahitMuseum.name,
          title: majapahitMuseum.title,
          is_active: majapahitMuseum.is_active,
          is_approved: majapahitMuseum.is_approved,
          type: majapahitMuseum.type,
          type_relation: majapahitMuseum.type_relation
        });
      }
      
      const mappedMuseums = rawMuseums.map(m => {
        const mapped = {
          ...m,
          // Map images relation to gallery_images
          gallery_images: m.images?.map((img: any) => ({ path: img.path, sites: m.id })) || [],
          // Map flat fields to contact_info
          contact_info: {
            phone: m.phone || '',
            email: '', // Not supported in DB
            website: m.website || ''
          },
          // Map is_active to is_published
          is_published: m.is_active,
          is_approved: m.is_approved,
          is_rejected: m.is_rejected,
          reason_rejected: m.reason_rejected,
          // Ensure type is handled (it's a UUID)
          type: m.type_relation?.id || m.type,
          // Map location from subtitle if location is missing in DB
          location: m.location || m.subtitle || ''
        };
        
        // Debug: Log each museum during mapping
        if (mapped.name?.toLowerCase().includes('majapahit')) {
          console.log('Mapping Majapahit museum:', {
            id: mapped.id,
            name: mapped.name,
            type: mapped.type,
            is_published: mapped.is_published,
            location: mapped.location
          });
        }
        
        return mapped;
      });
      
      console.log('Mapped museums count:', mappedMuseums.length);
      console.log('Museum names:', mappedMuseums.map(m => m.name || m.title).filter(Boolean));

      setMuseums(mappedMuseums);
      setTypes(typesResponse.data || []);
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
      // Transform data for backend
      const payload = {
        ...formData,
        // Rename gallery_images to images for backend
        images: formData.gallery_images,
        // Flatten contact info
        phone: formData.contact_info.phone,
        website: formData.contact_info.website,
        // Map is_published to is_active
        is_active: formData.is_published,
        // Ensure latitude/longitude are handled correctly (empty string is fine for varchar, but null is safer if empty)
        latitude: formData.latitude === '' ? null : formData.latitude,
        longitude: formData.longitude === '' ? null : formData.longitude,
        // Parse opening hours if string
        opening_hours: typeof formData.opening_hours === 'string'
          ? JSON.parse(formData.opening_hours)
          : formData.opening_hours,
      };

      // Remove nested contact_info and gallery_images from payload to avoid confusion
      delete (payload as any).contact_info;
      delete (payload as any).gallery_images;
      // Remove is_published as it's mapped to is_active
      delete (payload as any).is_published;

      if (editingMuseum?.id) {
        const response = await museumService.update(editingMuseum.id, payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Refresh list to get updated data with relations
        fetchData();
        
        toast({
          title: 'Success',
          description: 'Museum updated successfully',
        });
      } else {
        response = await museumService.create(payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Refresh list
        fetchData();
        
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
      // Map is_published to is_active
      const response = await museumService.update(id, { is_active: isPublished });
      
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
              types={types}
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
          {/* Debug: Show all museum names */}
          <div className="p-4 bg-gray-100 rounded mb-4">
            <h3 className="font-bold">DEBUG: All Museums ({museums.length})</h3>
            <div className="text-sm">
              {museums.map((m, idx) => (
                <div key={m.id || idx}>
                  {idx + 1}. {(m as any).name || (m as any).title || 'NO NAME'} (ID: {m.id}) - Published: {m.is_published ? 'Yes' : 'No'}
                </div>
              ))}
            </div>
          </div>
          
          {museums.map((museum) => (
            <Card key={museum.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {museum.name}
                      <Badge variant="outline">
                        {types.find(t => t.id === museum.type)?.name || museum.type}
                      </Badge>
                      <Badge variant={museum.is_published ? 'default' : 'secondary'}>
                        {museum.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {museum.is_approved && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Approved
                        </Badge>
                      )}
                      {museum.is_rejected && (
                        <Badge variant="destructive">
                          Rejected
                        </Badge>
                      )}
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
