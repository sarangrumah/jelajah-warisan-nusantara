import { useState, useEffect } from 'react';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { map, string } from 'zod';
interface SitesItem {
  id?: string;
  name: string;
  type: string;
  category: string;
  subtitle: string;
  description: string;
  address: string;
  location: string;
  images: Image[];
  latitude: string; // Form handles as string for input
  longitude: string; // Form handles as string for input
  opening_hours: string;
  phone:string;
  whatsapp:string;
  website:string;
  facilities:string;
  collection: string;
  img_banner: string;
  ticket_price:string;
  is_approved: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  type_relation? : Types
  categories_relation? : Categories
}

interface Image {
  path :string;
  sites: string;
}

interface Types {
  id :string;
  name: string;
}

interface Categories {
  id :string;
  name: string;
}

const SitesForm = ({ museum, onSave, onCancel, saving }: {
  museum: SitesItem;
  onSave: (data: SitesItem) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [formData, setFormData] = useState<SitesItem>({
    ...museum,
  });

  const [types, setTypes] = useState<Types[]>()
  const [categories, setCategories] = useState<Categories[]>()
  const [loading, setLoading] = useState(true);
  const [loadingCat, setLoadingCat] = useState(true);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ opening_hours?: string, facilities?: string }>({});

  // Opening hours (Senin..Minggu) state and helpers
  const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'] as const;
  type DayName = typeof DAYS[number];
  type DayEntry = { enabled: boolean; value: string };

  const initOpenHours = (): Record<DayName, DayEntry> => {
    const base: Record<DayName, DayEntry> = {
      Senin: { enabled: false, value: '' },
      Selasa: { enabled: false, value: '' },
      Rabu: { enabled: false, value: '' },
      Kamis: { enabled: false, value: '' },
      Jumat: { enabled: false, value: '' },
      Sabtu: { enabled: false, value: '' },
      Minggu: { enabled: false, value: '' },
    };
    try {
      if (formData.opening_hours) {
        const parsed = typeof formData.opening_hours === 'string'
          ? JSON.parse(formData.opening_hours)
          : formData.opening_hours;
        if (Array.isArray(parsed)) {
          parsed.forEach((obj: any) => {
            if (obj && typeof obj === 'object') {
              const day = Object.keys(obj)[0] as DayName;
              const val = obj[day];
              if (day && day in base && typeof val === 'string') {
                base[day] = { enabled: true, value: val };
              }
            }
          });
        }
      }
    } catch (_) {
      // ignore parse errors, keep defaults
    }
    return base;
  };

  const [openHours, setOpenHours] = useState<Record<DayName, DayEntry>>(initOpenHours);

  // Reinitialize opening hours when switching the edited site item
  useEffect(() => {
    setOpenHours(initOpenHours());
  }, [museum.id]);

  // Reflect openHours into formData.opening_hours as JSON array of objects
  useEffect(() => {
    const arr = DAYS
      .filter((d) => openHours[d].enabled && openHours[d].value.trim() !== '')
      .map((d) => ({ [d]: openHours[d].value.trim() }));
    setFormData((prev) => ({ ...prev, opening_hours: JSON.stringify(arr) }));
  }, [openHours]);

  useEffect(() => {
      fetchTypes();      
  }, []);

  useEffect(() => {
    if (formData.type != '') {
      setLoadingCat(true)
      fetchCategories(formData.type);  
    }
    
  }, [ formData.type]);


  const fetchTypes = async () => {
    try {
      const response = await TypesAndCategoriesSites.getAllTypes();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setTypes(response.data as Types[] || []);
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

  const fetchCategories = async (id) => {
    try {
      const response = await TypesAndCategoriesSites.getAllCategories(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCategories(response.data as Categories[] || []);
    } catch (error) {
      console.error('Error fetching museums:', error);
      toast({
        title: 'Error',
        description: 'Failed to load museums',
        variant: 'destructive',
      });
    } finally {
      setLoadingCat(false);
    }
  };
 
  // This ensures proper state updates
  const handleImageUpload = async (url: string) => {
    setFormData(prev => ({
      ...prev,
      img_banner: url
    }));
  };

  const handleGalleryUpload = async (urls: Image[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      onSave(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="type">Type</Label>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : 
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((e) => (
                <SelectItem value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>}
        </div>
        <div className="space-y-3">
          <Label htmlFor="category">Category</Label>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) :           
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            {
              <SelectContent>
                {categories != undefined  ? categories.map((e) => (
                  <SelectItem value={e.id}>{e.name}</SelectItem>
                )) : <></>}
              </SelectContent> 
            }
           
          </Select>}
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

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
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
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
            placeholder="106.8456"
          />
        </div>
      </div> */}


      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={2}
        />
      </div>

      <ImageUpload
        label="Main Image"
        value={formData.img_banner}
        onChange={handleImageUpload}
        bucket="images"
      />

      <GalleryUpload
        label="Gallery images"
        value={formData.images}
        onChange={handleGalleryUpload}
        bucket="images"
        maxImages={8}
      />



      <div className="space-y-2">
        <Label>Opening Hours</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center gap-3">
              <Checkbox
                id={`oh_${day}`}
                checked={openHours[day].enabled}
                onCheckedChange={(checked) =>
                  setOpenHours((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], enabled: !!checked },
                  }))
                }
              />
              <Label htmlFor={`oh_${day}`} className="w-20">
                {day}
              </Label>
              <Input
                placeholder="08.00-17.00"
                value={openHours[day].value}
                onChange={(e) =>
                  setOpenHours((prev) => ({
                    ...prev,
                    [day]: { ...prev[day], value: e.target.value },
                  }))
                }
                disabled={!openHours[day].enabled}
              />
            </div>
          ))}
        </div>
        {errors.opening_hours && (
          <p className="text-sm text-red-500">{errors.opening_hours}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev,
              phone: e.target.value
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">Whatsapp</Label>
          <Input
            id="whatsapp"
            type="whatsapp"
            value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev,
              whatsapp: e.target.value
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData(prev => ({ ...prev,
              website: e.target.value
            }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket_price">Ticket Price</Label>
        <Input
          id="ticket_price"
          value={formData.ticket_price}
          onChange={(e) => setFormData(prev => ({ ...prev,
            ticket_price: e.target.value
          }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="facilities">Facilities</Label>
        <Textarea
          id="facilities"
          value={formData.facilities}
          // placeholder=''
           onChange={(e) => setFormData(prev => ({ ...prev,
            facilities: e.target.value
          }))}
          rows={3}
        />
        {errors.opening_hours && (
          <p className="text-sm text-red-500">{errors.opening_hours}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection">Collection</Label>
        <Textarea
          id="collection"
          value={formData.collection}
          // placeholder=''
          onChange={(e) => setFormData(prev => ({ ...prev,
            collection: e.target.value
          }))}
          rows={3}
        />
        {errors.opening_hours && (
          <p className="text-sm text-red-500">{errors.opening_hours}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Publish Sites</Label>
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

const emptySites: SitesItem = {
  name: '',
  type: '',
  category: '',
  subtitle: '',
  description: '',
  address: '',
  location: '',
  images: [], // Array of Image objects, starts empty
  latitude: '',
  longitude: '',
  opening_hours: '', // or you could use {} if your form handles parsing
  phone: '',
  whatsapp: '',
  website: '',
  facilities: '',
  collection: '',
  img_banner: '',
  ticket_price: '',
  is_approved: false, // reasonable default
  is_active: true,    // often default to active
};

const SitesManagement = ({ userRole }: { userRole: string }) => {
  const [museums, setSitess] = useState<SitesItem[]>([]);
    const [museum, setSite] = useState<SitesItem>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSites, setEditingSites] = useState<SitesItem>(emptySites);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isDialogDelete, setIsDialogDelete] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await museumService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      setSitess(response.data as SitesItem[] || []);
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

  const saveSites = async (formData: SitesItem) => {
    setSaving(true);
    let response 
    try {
    

      if (editingSites?.id) {
        console.log("ini data form", formData)
        const response = await museumService.update(editingSites.id, formData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setSitess(prev => prev.map(m => 
          m.id === editingSites.id ? { ...m, ...formData } : m
        ));
        
        toast({
          title: 'Success',
          description: 'Sites updated successfully',
        });
      } else {
        response = await museumService.create(formData);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setSitess(prev => [response.data, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Sites created successfully',
        });
      }
      
      setEditingSites(emptySites);
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
      const response = await museumService.update(id, { is_active: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSitess(prev => prev.map(museum => 
        museum.id === id ? { ...museum, is_active: isPublished } : museum
      ));
      
      toast({
        title: 'Success',
        description: `Sites ${isPublished ? 'published' : 'unpublished'}`,
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

  const toggleApproved = async (id: string) => {
    try {
      const response = await museumService.approve(id);
      if (response.error) throw new Error(response.error);
      
      setSitess(prev => prev.map(events => 
        events.id === id ? { ...events, is_approved: response.data["is_approved"] } : events
      ));
      
      toast({
        title: 'Success',
        description: `Banner Approved`,
      });
      fetchSites();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await museumService.delete(id);
      if (response.error) throw new Error(response.error);
      
      // setBanners(prev => prev.map(banner => 
      //   banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      // ));
      
      toast({
        title: 'Success',
        description: `Banner Deleted`,
      });
      fetchSites()
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
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
          <h2 className="text-2xl font-bold">Sites & Heritage Management</h2>
          <p className="text-muted-foreground">Manage museums and heritage sites</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button onClick={() => setEditingSites(emptySites)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sites
            </Button> */}
            { userRole !== "approver" && userRole !== "viewer" ?             
              <Button onClick={() => setEditingSites(emptySites)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Sites
              </Button> : 
              <div></div>
            }
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingSites.id ? 'Edit Sites' : 'Add New Sites'}
              </DialogTitle>
              <DialogDescription>
                {editingSites.id ? 'Update museum information' : 'Create a new museum or heritage site'}
              </DialogDescription>
            </DialogHeader>
            <SitesForm
              museum={editingSites}
              onSave={saveSites}
              saving={saving}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {museum != null  ? <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
          <DialogContent className="max-w-4xl">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + museum.name + ' content'}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure want delete this' + museum.name + ' content'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="submit" disabled={isDialogOpen} onClick={() => toggleDelete(museum.id)}>
                    {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Trash className="w-4 h-4 mr-2" />
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : <div></div>}
      </div>
      

      {museums.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No museums created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Sites
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
                      <Badge variant={museum.is_active ? 'default' : 'secondary'}>
                        {museum.is_active ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant={museum.is_approved ? 'success' : 'secondary'}>
                        {museum.is_approved ? 'Approved' : 'Draft'}
                      </Badge>
                    </CardTitle>
                  </div>
                  { 
                    userRole == "admin" || userRole == "super-admin" ? <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={museum.is_active}
                          onCheckedChange={(checked) => togglePublished(museum.id, checked)}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingSites(museum);
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
                        setSite(museum)
                        setIsDialogDelete(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                      </div> : 
                      userRole == "approver" && !museum.is_approved? 
                      <div className="flex items-center space-x-2">
                          <Button
                            variant="success"
                            className="w-full"
                            onClick={() => toggleApproved(museum.id)}
                          >
                            Approve
                        </Button>
                      </div> 
                    : <div></div>
                      
                  }
                </div>
                <CardDescription className="flex items-center gap-2">
                  {museum.subtitle}
                  <Badge variant={'secondary'}>
                    {museum.type_relation.name}
                  </Badge>
                  <Badge variant={'secondary'}>
                    {museum.categories_relation.name}
                  </Badge>
                </CardDescription>
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
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                  <div>
                    <span className="font-medium">Address:</span>
                    <p className="text-muted-foreground line-clamp-2">
                      {museum.address || 'No description'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Website:</span>
                    <p className="text-muted-foreground">
                      {museum.website}
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

export default SitesManagement;
