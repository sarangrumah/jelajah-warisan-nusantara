
import { useState, useEffect, useRef } from 'react';
import { museumService, TypesAndCategoriesSites } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Trash, HelpCircle, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import QuillEditor from '@/components/ui/quill-editor';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
import { SortableList } from '@/components/admin/SortableList';
import { useReorder } from '@/hooks/useReorder';
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
  ticket_url?: string;
  is_free?: boolean;
  display_order?: number;
  is_approved: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
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
    is_free: museum.is_free ?? false,
  });
  const previousTicketPriceRef = useRef<string>('');

  useEffect(() => {
    setFormData({
      ...museum,
      is_free: museum.is_free ?? false,
      images: museum.images === null ? [] : museum.images
    });
    if (museum.is_free) {
      previousTicketPriceRef.current = museum.ticket_price || '';
    }
  }, [museum]);

  const [types, setTypes] = useState<Types[]>()
  const [categories, setCategories] = useState<Categories[]>()
  const [loading, setLoading] = useState(true);
  const [_loadingCat, setLoadingCat] = useState(true);
  const { toast } = useToast();
  const [_errors, _setErrors] = useState<{ opening_hours?: string, facilities?: string }>({});

  // Opening hours (Senin..Minggu) state and helpers
  const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu', "Tutup"] as const;
  type DayName = typeof DAYS[number];
  type DayEntry = { enabled: boolean; value: string };

  const initOpenHours = (): Record<DayName, DayEntry> => {
    const base: Record<DayName, DayEntry> = {
      Senin: { enabled: false, value: '08.00-17.00' },
      Selasa: { enabled: false, value: '08.00-17.00' },
      Rabu: { enabled: false, value: '08.00-17.00' },
      Kamis: { enabled: false, value: '08.00-17.00' },
      Jumat: { enabled: false, value: '08.00-17.00' },
      Sabtu: { enabled: false, value: '08.00-17.00' },
      Minggu: { enabled: false, value: '08.00-17.00' },
      Tutup: {enabled: false, value: ''}
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
    } catch {
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
    if (formData.type !== '') {
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to load museums',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (id: string) => {
    try {
      const response = await TypesAndCategoriesSites.getAllCategories(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCategories(response.data as Categories[] || []);
    } catch {
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
              {types && types.map((e) => (
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
                {categories !== undefined  ? categories.map((e) => (
                  <SelectItem value={e.id}>{e.name}</SelectItem>
                )) : <></>}
              </SelectContent> 
            }
           
          </Select>}
        </div>
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
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <QuillEditor
          value={formData.address || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, address: html }))}
          height={100}
          placeholder="Brief summary of the content"
        />
      </div>

      <ImageUpload
        label="Main Image"
        value={formData.img_banner}
        onChange={handleImageUpload}
        bucket="sites"
      />

      <GalleryUpload
        label="Gallery images"
        value={formData.images}
        onChange={handleGalleryUpload}
        bucket="sites"
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
                    [day]: { ...prev[day], 
                      enabled: !!checked,
                     }
                  }))
                }
              />
              <Label htmlFor={`oh_${day}`} className="w-20">
                {day}
              </Label>
              <Input
                placeholder={day === "Tutup" ? "" : "08.00-17.00"}
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
        {_errors.opening_hours && (
          <p className="text-sm text-red-500">{_errors.opening_hours}</p>
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

      <div className="flex items-center space-x-2">
        <Switch
          id="is_free"
          checked={!!formData.is_free}
          onCheckedChange={(checked) => {
            setFormData(prev => {
              const next = { ...prev, is_free: checked } as SitesItem;
              if (checked) {
                previousTicketPriceRef.current = prev.ticket_price || '';
                next.ticket_price = '0';
              } else {
                next.ticket_price = previousTicketPriceRef.current || '';
              }
              return next;
            });
          }}
        />
        <Label htmlFor="is_free">Mark as Free Event</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket_price">Ticket Price</Label>
        <Input
          id="ticket_price"
          value={formData.ticket_price}
          onChange={(e) => setFormData(prev => ({ ...prev,
            ticket_price: e.target.value
          }))}
          disabled={formData.is_free}
          placeholder={formData.is_free ? 'Free entry' : 'e.g., 50000'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket_url">Ticket URL</Label>
        <Input
          id="ticket_url"
          value={formData.ticket_url || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, ticket_url: e.target.value }))}
          disabled={formData.is_free}
          placeholder={formData.is_free ? 'Free entry (no ticket link)' : 'https://example.com'}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="facilities">Facilities</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>
              Gunakan koma untuk memisahkan. Contoh: Parkir, Toilet, Kafeteria, Toko Souvenir, Audio Guide, WiFi
            </TooltipContent>
          </Tooltip>
        </div>
        <QuillEditor
          value={formData.facilities || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, facilities: html }))}
          height={100}
           placeholder="Parkir, Toilet, Kafeteria, Toko Souvenir, Audio Guide, WiFi"
        />
        {_errors.opening_hours && (
          <p className="text-sm text-red-500">{_errors.opening_hours}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection">Collection</Label>
        <QuillEditor
          value={formData.collection || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, collection: html }))}
          height={100}
        />
        {_errors.opening_hours && (
          <p className="text-sm text-red-500">{_errors.opening_hours}</p>
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
  ticket_url: '',
  is_free: false,
  is_approved: false, // reasonable default
  is_rejected: false,
  reason_rejected: '',
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderType, setReorderType] = useState<string>('');
  const [siteTypes, setSiteTypes] = useState<Types[]>([]);
  const { saveOrder, saving: savingOrder } = useReorder('tb_sites');

  useEffect(() => {
    fetchSites();
    TypesAndCategoriesSites.getAllTypes().then((response) => {
      if (!response.error) {
        const fetchedTypes = (response.data as Types[]) || [];
        setSiteTypes(fetchedTypes);
        if (fetchedTypes.length > 0) {
          setReorderType((prev) => prev || fetchedTypes[0].id);
        }
      }
    });
  }, []);

  const fetchSites = async () => {
    try {
      const response = await museumService.getAll({ limit: 100 }); // Admin sees all museums
      
      if (response.error) {
        throw new Error(response.error);
      }
      const normalized = (response.data as SitesItem[] || []).map((item) => ({
        ...item,
        is_free: item.is_free ?? false,
        reason_rejected: item.reason_rejected ?? '',
      }));
      setSitess(normalized);
    } catch {
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
      const payload: SitesItem = {
        ...formData,
        is_free: formData.is_free ?? false,
        is_rejected: false,
        reason_rejected: '',
      };
    
      if (editingSites?.id) {
        const response = await museumService.update(editingSites.id, payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setSitess(prev => prev.map(m => 
          m.id === editingSites.id ? { ...m, ...payload, is_free: payload.is_free ?? false } : m
        ));
        
        toast({
          title: 'Success',
          description: 'Sites updated successfully',
        });
      } else {
        response = await museumService.create(payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        const created = response.data as SitesItem;
        setSitess(prev => [{
          ...created,
          is_free: created?.is_free ?? false,
          reason_rejected: created?.reason_rejected ?? '',
        }, ...prev]);
        toast({
          title: 'Success',
          description: 'Sites created successfully',
        });
      }

        fetchSites()

      setEditingSites(emptySites);
      setIsDialogOpen(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save museum',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const _togglePublished = async (id: string, isPublished: boolean) => {
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
    } catch {
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
      if (response.error) {throw new Error(response.error);} 
      
      const updated = (response.data || {}) as Partial<SitesItem>;

      setSitess(prev => prev.map(events => 
        events.id === id
          ? {
              ...events,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
              reason_rejected: '',
            }
          : events
      ));
      
      toast({
        title: 'Success',
        description: `Banner Approved`,
      });
      fetchSites();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
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
      const response = await museumService.reject(rejectingId, trimmedReason);
      if (response.error) {throw new Error(response.error);}

      const updated = (response.data || {}) as Partial<SitesItem>;

      setSitess(prev => prev.map(events =>
        events.id === rejectingId
          ? {
              ...events,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
              reason_rejected: updated.reason_rejected ?? trimmedReason,
            }
          : events
      ));

      toast({
        title: 'Success',
        description: `Museum rejected`,
      });
      closeRejectDialog();
      fetchSites();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to reject museum',
        variant: 'destructive',
      });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await museumService.delete(id);
      if (response.error) {throw new Error(response.error);}
      
      toast({
        title: 'Success',
        description: `Banner Deleted`,
      });
      fetchSites()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
  };

  const reorderItems = museums
    .filter((site) => site.type === reorderType)
    .sort((a, b) => (a.display_order ?? Number.MAX_SAFE_INTEGER) - (b.display_order ?? Number.MAX_SAFE_INTEGER));

  const handleReorder = async (newItems: SitesItem[]) => {
    // Renumber 1..n within the selected type and persist
    const renumbered = newItems.map((item, index) => ({ ...item, display_order: index + 1 }));
    setSitess(prev => prev.map(site => {
      const updated = renumbered.find(r => r.id === site.id);
      return updated ? { ...site, display_order: updated.display_order } : site;
    }));
    await saveOrder(renumbered);
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
          <h2 className="text-2xl font-bold">Museum Management</h2>
          <p className="text-muted-foreground">Manage Museum and Content</p>
        </div>
        <div className="flex items-center gap-2">
        {userRole !== "approver" && userRole !== "viewer" ? (
          <Button variant={reorderMode ? 'default' : 'outline'} onClick={() => setReorderMode(prev => !prev)}>
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {reorderMode ? 'Selesai Mengurutkan' : 'Atur Urutan'}
          </Button>
        ) : null}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            { userRole !== "approver" && userRole !== "viewer" ?             
              <Button onClick={() => setEditingSites(emptySites)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Museum
              </Button> : 
              <div></div>
            }
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingSites.id ? 'Edit Museum' : 'Add New Museum'}
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
      </div>

      <div className="flex justify-between items-center">
        {museum ? <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
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

      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Reject Museum"
      />

      {reorderMode ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atur Urutan Tampilan</CardTitle>
            <CardDescription>
              Seret kartu atau ketik nomor urutan untuk mengubah posisi. Urutan ini menentukan tampilan di halaman pengunjung.
            </CardDescription>
            <div className="max-w-xs pt-2">
              <Select value={reorderType} onValueChange={setReorderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  {siteTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {reorderItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Tidak ada data untuk tipe ini</p>
            ) : (
              <SortableList
                items={reorderItems}
                getId={(site) => site.id!}
                disabled={savingOrder}
                onOrderChange={handleReorder}
                renderItem={(site) => (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate">{site.name}</span>
                    <Badge variant={site.is_active ? 'default' : 'secondary'}>
                      {site.is_active ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                )}
              />
            )}
          </CardContent>
        </Card>
      ) : museums.length === 0 ? (
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
                      <Badge variant={museum.is_approved ? 'success' : museum.is_rejected ? 'destructive' : 'secondary'}>
                        {museum.is_approved ? 'Approved' : museum.is_rejected ? 'Rejected' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    {museum.subtitle ? (
                      <CardDescription>{museum.subtitle}</CardDescription>
                    ) : null}
                  </div>
                  { 
                    userRole === "admin" || userRole === "super-admin" ? <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={museum.is_active}
                          onCheckedChange={(checked) => _togglePublished(museum.id, checked)}
                        />
                      </div>
                      {(userRole === 'super-admin' || userRole === 'admin') && !museum.is_approved && !museum.is_rejected ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => toggleApproved(museum.id)}
                          >
                            Approve
                          </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openRejectDialog(museum.id)}
                        >
                            Reject
                          </Button>
                        </>
                      ) : null}
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
                      userRole === "approver" && !museum.is_approved && !museum.is_rejected ? 
                      <div className="flex items-center space-x-2">
                          <Button
                            variant="success"
                            className="w-full"
                            onClick={() => toggleApproved(museum.id)}
                          >
                            Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => openRejectDialog(museum.id)}
                        >
                          Reject
                        </Button>
                      </div> 
                    : <div></div>
                      
                  }
                </div>
                <CardDescription className="flex items-center gap-2">
                  {museum.subtitle}
                  <Badge variant={'secondary'}>
                    {museum.type_relation?.name}
                  </Badge>
                  <Badge variant={'secondary'}>
                    {museum.categories_relation?.name}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Description:</span>
                    <div
                      className="text-muted-foreground line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(museum.description || 'No description') }}
                    />
                  </div>
                  <div>
                    <span className="font-medium">Last updated:</span>
                    <p className="text-muted-foreground">
                      {(museum.updated_at ?? museum.created_at)
                        ? new Date(museum.updated_at ?? museum.created_at).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                 <div>
                   <span className="font-medium">Address:</span>
                   <div
                     className="text-muted-foreground line-clamp-2"
                     dangerouslySetInnerHTML={{ __html: sanitizeHtml(museum.address || 'No description') }}
                   />
                 </div>
                 <div>
                   <span className="font-medium">Website:</span>
                   <p className="text-muted-foreground">
                     {museum.website}
                   </p>
                 </div>
               </div>
                {museum.is_rejected && museum.reason_rejected?.trim() ? (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Alasan Penolakan : </span>
                    <p className="text-muted-foreground">{museum.reason_rejected}</p>
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

export default SitesManagement;
