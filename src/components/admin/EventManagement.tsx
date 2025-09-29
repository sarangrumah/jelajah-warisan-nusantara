import { useState, useEffect, useRef } from 'react';
import { EventsService, TypesAndCategoriesEvent, museumService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { map, string } from 'zod';
import QuillEditor from '@/components/ui/quill-editor';

interface EventItem {
  id?: string;
  name: string;
  category: string;
  subtitle?: string;
  description?: string;
  sites_id?: string;                 // Foreign key to tb_sites
  location?: string;
  address?: string;
  start_published_date: string;    // ISO date string
  end_published_date: string;      // ISO date string
  start_date: string;              // ISO date string
  end_date: string;                // ISO date string
  contact?: string;
  website?: string;
  banner_img?: string;
  ticket_price?: string;
  ticket_url?: string;
  is_free?: boolean;
  is_active: boolean;
  is_approved: boolean;
  is_rejected?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  Sites: SitesItem
}

interface SitesItem {
  id?: string;
  name: string;
  type: string;
  category: string;
  subtitle: string;
  description: string;
  address: string;
  location: string;
  // images: Image[];
  latitude: string; // Form handles as string for input
  longitude: string; // Form handles as string for input
  opening_hours: string;
  phone:string;
  whatsapp:string;
  website:string;
  facilities:string;
  img_banner: string;
  ticket_price:string;
  is_approved: boolean;
  is_rejected?: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  type_relation? : Types
  categories_relation? : Categories
}

interface Types {
  id :string;
  name: string;
}

interface Categories {
  id :string;
  name: string;
}

const EventForm = ({ museum, onSave, onCancel, saving }: {
  museum: EventItem;
  onSave: (data: EventItem) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  // Helpers to normalize date values for inputs
  const toDateInput = (value?: string) => {
    if (!value) {return ''};
    const d = new Date(value);
    if (isNaN(d.getTime())) {return ''};
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const toDateTimeInput = (value?: string) => {
    if (!value) {return ''};
    const d = new Date(value);
    if (isNaN(d.getTime())) {return ''};
    const tzOffset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - tzOffset * 60000);
    return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  };

  const [formData, setFormData] = useState<EventItem>({
    ...museum,
    is_free: museum.is_free ?? false,
    start_published_date: toDateTimeInput(museum.start_published_date),
    end_published_date: toDateTimeInput(museum.end_published_date),
    start_date: toDateInput(museum.start_date),
    end_date: toDateInput(museum.end_date),
  });

  const previousTicketPriceRef = useRef<string>('');

  // Keep inputs in sync when switching edited event
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...museum,
      is_free: museum.is_free ?? false,
      start_published_date: toDateTimeInput(museum.start_published_date),
      end_published_date: toDateTimeInput(museum.end_published_date),
      start_date: toDateInput(museum.start_date),
      end_date: toDateInput(museum.end_date),
    }));
    if (museum.is_free) {
      previousTicketPriceRef.current = museum.ticket_price || '';
    }
  }, [museum]);

  const [sites, setSites] = useState<SitesItem[]>()
  const [categories, setCategories] = useState<Categories[]>()
  const [loading, setLoading] = useState(true);
  const [loadingCat, setLoadingCat] = useState(true);
  const { toast } = useToast();
  const [errors, setErrors] = useState<{ opening_hours?: string, facilities?: string }>({});
  const [useSites, setUseSites] = useState<boolean>(false)

  useEffect(() => {
      fetchSites();    
      fetchCategories()  
  }, []);

  useEffect(() => {

    if (formData.sites_id !== null && !useSites) {
      setUseSites(true)
    }

    if (sites != undefined && useSites) {
      sites.filter((e) => {
        if (formData.sites_id === e.id) {
          formData.address = e.address
        }
      })
    }

  }, [formData.sites_id]);

  useEffect(() => {
    if (!useSites && formData.sites_id != null) {
       formData.address = ''
       formData.sites_id = null
    } else {
      if (sites != undefined) {
      sites.filter((e) => {
          if (formData.sites_id === e.id) {
            formData.address = e.address
          }
        })
      }
    }
  }, [useSites])

  // Ensure address follows useSites toggle and selected site
  useEffect(() => {
    if (!useSites) {
      setFormData(prev => ({ ...prev, address: '' }));
      return;
    }
    if (sites && formData.sites_id) {
      const selected = sites.find((e) => e.id === formData.sites_id);
      setFormData(prev => ({ ...prev, address: selected?.address ?? '' }));
    }
  }, [useSites, formData.sites_id, sites])

  const fetchSites = async () => {
    try {
      const response = await museumService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setSites(response.data as SitesItem[] || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await TypesAndCategoriesEvent.getAllCategories();
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCategories(response.data as Categories[] || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
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
      banner_img: url
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

      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <Checkbox
            id="use-sites"
            checked={useSites}
            onCheckedChange={(checked) => setUseSites(!!checked)}
          />
          <Label htmlFor="use-sites">Use Sites</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {useSites ? 
        <div className="space-y-3">
          <Label htmlFor="sites">Sites</Label>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : <Select value={formData.sites_id} onValueChange={(value) => setFormData(prev => ({ ...prev, sites_id  : value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Sites" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((e) => (
                <SelectItem value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>}
        </div> : 
        null}
        <div className="space-y-3">
          <Label htmlFor="category">Category</Label>
          {loadingCat ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) :           
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            {
              <SelectContent>
                {categories.map((e) => (
                  <SelectItem value={e.id}>{e.name}</SelectItem>
                ))}
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
          height={180}
          placeholder="Describe the event"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <QuillEditor
          value={formData.address || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, address: html }))}
          height={140}
          placeholder="Enter venue address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <QuillEditor
          value={formData.location || ''}
          onChange={(html) => setFormData(prev => ({ ...prev, location: html }))}
          height={140}
          placeholder="Enter location details"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_published_date">Start Publish Date</Label>
          <Input
          id="start_published_date"
          type="datetime-local"
          value={formData.start_published_date || ''}
          onChange={(e) => {
            const value = e.target.value;
            const isValid = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
            if (isValid || value === '') {
              setFormData(prev => ({
                ...prev,
                start_published_date: value
              }));
            }
          }}
          min="2020-01-01T00:00"
          max="2030-12-31T23:59"
          required
        />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_publish_date">End Publish Date</Label>
          <Input
              id="end_publish_date"
              type="datetime-local"
              value={formData.end_published_date || ''}
              onChange={(e) => {
                const value = e.target.value;
                const isValid = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
                if (isValid || value === '') {
                  setFormData(prev => ({
                    ...prev,
                    end_published_date: value
                  }));
                }
              }}
              min="2020-01-01T00:00"
              max="2030-12-31T23:59"
              required
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
          />
        </div>
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="opening_hours">Opening Hours (JSON format)</Label>
        <QuillEditor
          id="opening_hours"
          value={JSON.stringify(formData.opening_hours, null, 1)}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, opening_hours: value }));

            try {
              const parsed = JSON.parse(value);
              // Only update as object if valid
              setFormData(prev => ({ ...prev, opening_hours: parsed }));
            } catch (e) {
              // Invalid JSON → keep as string (temporary)
            }
          }}
          placeholder='{"monday": "09:00-17:00", "tuesday": "09:00-17:00"}'
          rows={3}
        />
        {errors.opening_hours && (
          <p className="text-sm text-red-500">{errors.opening_hours}</p>
        )}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact">Contact</Label>
          <Input
            id="contact"
            value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev,
              contact: e.target.value
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
              const next = { ...prev, is_free: checked } as EventItem;
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
          onChange={(e) => setFormData(prev => ({ ...prev, ticket_price: e.target.value }))}
          disabled={formData.is_free}
          placeholder={formData.is_free ? 'Free event' : 'e.g., 50000'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket_url">Ticket URL</Label>
        <Input
          id="ticket_url"
          value={formData.ticket_url || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, ticket_url: e.target.value }))}
          disabled={formData.is_free}
          placeholder={formData.is_free ? 'Free event (no ticket link)' : 'https://example.com'}
        />
      </div>

      {console.log('ImageUpload value (banner_img):', formData.banner_img)}
      <ImageUpload
        label="Banner Image"
        value={formData.banner_img}
        onChange={handleImageUpload}
        bucket="events"
      /> 

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Publish Event</Label>
      </div>
      
      {/* <div className="space-y-2">
        <Label htmlFor="facilities">Facilities (JSON format)</Label>
        <QuillEditor
          id="facilities"
          value={JSON.stringify(formData.facilities, null, 1)}
          onChange={(e) => {
            const value = e.target.value;
            setFormData(prev => ({ ...prev, facilities: value }));

            try {
              const parsed = JSON.parse(value);
              // Only update as object if valid
              setFormData(prev => ({ ...prev, facilities: parsed }));
            } catch (e) {
              // Invalid JSON → keep as string (temporary)
            }
          }}
          placeholder='{
            "parking": true,
            "wheelchair_access": true,
            "restrooms": true,
            "cafe": false,
            "gift_shop": true,
            "wifi": true
          }'
          rows={3}
        />
        {errors.opening_hours && (
          <p className="text-sm text-red-500">{errors.opening_hours}</p>
        )}
      </div> */}

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

  const emptyEvent: EventItem = {
  id: '',
  name: '',
  category: '',
  subtitle: '',
  description: '',
  sites_id: null,                     // Will be set when selecting a site
  location: '',
  address: '',
  start_published_date: new Date().toISOString(),        // e.g., new Date().toISOString()
  end_published_date: new Date().toISOString(),
  start_date: '',
  end_date: '',
  contact: '',
  website: '',
  banner_img: '',
  ticket_price: '',
  ticket_url: '',
  is_free: false,
  is_active: true,
  is_approved: false,
  is_rejected: false,
  created_at: '',
  updated_at: '',
  created_by: '',
  updated_by: '',
  Sites: null
};

const EventManagement = ({ userRole }: { userRole: string }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [event, setEvent] = useState<EventItem>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem>(emptyEvent);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isDialogDelete, setIsDialogDelete] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await EventsService.getAll();
      
      if (response.error) {
        throw new Error(response.error);
      }
      const normalized = (response.data as EventItem[] || []).map((item) => ({
        ...item,
        is_free: item.is_free ?? false,
      }));
      setEvents(normalized);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEvent = async (formData: EventItem) => {
    setSaving(true);
    let response 
    try {
      const payload: EventItem = {
        ...formData,
        is_rejected: false,
      };
    
      if (editingEvent?.id) {
        const response = await EventsService.update(editingEvent.id, payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        setEvents(prev => prev.map(m => 
          m.id === editingEvent.id ? { ...m, ...payload, is_free: payload.is_free ?? false } : m
        ));
        
        toast({
          title: 'Success',
          description: 'Event updated successfully',
        });
      } else {
        response = await EventsService.create(payload);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        const created = response.data as EventItem;
        setEvents(prev => [{ ...created, is_free: created?.is_free ?? false }, ...prev]);
        
        toast({
          title: 'Success',
          description: 'Event created successfully',
        });
      }
      
      setEditingEvent(emptyEvent);
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
      const response = await EventsService.update(id, { is_active: isPublished });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setEvents(prev => prev.map(museum => 
        museum.id === id ? { ...museum, is_active: isPublished } : museum
      ));
      
      toast({
        title: 'Success',
        description: `Event ${isPublished ? 'published' : 'unpublished'}`,
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
      const response = await EventsService.approve(id);
      if (response.error) {throw new Error(response.error)};
      
      const updated = (response.data || {}) as Partial<EventItem>;

      setEvents(prev => prev.map(events => 
        events.id === id
          ? {
              ...events,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
            }
          : events
      ));
      
      toast({
        title: 'Success',
        description: `Banner Approved`,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
  };

  const toggleRejected = async (id: string) => {
    try {
      const response = await EventsService.reject(id);
      if (response.error) {throw new Error(response.error)};

      const updated = (response.data || {}) as Partial<EventItem>;

      setEvents(prev => prev.map(events =>
        events.id === id
          ? {
              ...events,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
            }
          : events
      ));

      toast({
        title: 'Success',
        description: `Event Rejected`,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject event',
        variant: 'destructive',
      });
    }
  };

  const toggleDelete = async (id: string) => {
    try {
      setIsDialogDelete(false)
      const response = await EventsService.delete(id);
      if (response.error) {throw new Error(response.error)};
      
      // setBanners(prev => prev.map(banner => 
      //   banner.id === id ? { ...banner, is_approved: response.data["is_approved"] } : banner
      // ));
      
      toast({
        title: 'Success',
        description: `Banner Deleted`,
      });

      fetchEvents()
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
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Manage Event and Content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            { userRole !== "approver" && userRole !== "viewer" ?             
              <Button onClick={() => setEditingEvent(emptyEvent)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
              </Button> : 
              <div></div>
            }
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEvent.id ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent.id ? 'Update event information' : 'Create a new Manage event'}
              </DialogDescription>
            </DialogHeader>
            <EventForm
              museum={editingEvent}
              onSave={saveEvent}
              saving={saving}
              onCancel={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center">
        {event != null  ? <Dialog open={isDialogDelete} onOpenChange={setIsDialogDelete}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                  <DialogTitle>
                  {'Delete ' + event.name + ' content'}
                  </DialogTitle>
                  <DialogDescription>
                  {'Are you sure want delete this' + event.name + ' content'}
                  </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogDelete(false)}>
                  <X className="w-4 h-4 mr-2" />
                      Cancel
                  </Button>
                  <Button type="submit" disabled={isDialogOpen} onClick={() => toggleDelete(event.id)}>
                    {isDialogOpen && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Trash className="w-4 h-4 mr-2" />
                      Delete
                  </Button>
              </div>
          </DialogContent>
        </Dialog > : <div></div>}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No events created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {events.map((museum) => (
            <Card key={museum.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                  <CardTitle className="flex items-center gap-2">
                      {museum.name}
                      <Badge variant={museum.is_active ? 'default' : 'secondary'}>
                        {museum.is_active ? 'Published' : 'Draft'}
                      </Badge>
                      {museum.is_free ? (
                        <Badge variant="outline">
                          Free
                        </Badge>
                      ) : null}
                      <Badge variant={museum.is_approved ? 'success' : museum.is_rejected ? 'destructive' : 'secondary'}>
                        {museum.is_approved ? 'Approved' : museum.is_rejected ? 'Rejected' : 'Pending'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{museum.subtitle}</CardDescription>                    
                    <CardDescription>{museum.location}</CardDescription>
                  </div>
                { 
                  userRole === "admin" || userRole === "super-admin" ? <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={museum.is_active}
                        onCheckedChange={(checked) => togglePublished(museum.id, checked)}
                      />
                    </div>
                    {(userRole === 'super-admin' || userRole === 'approver') && !museum.is_approved && !museum.is_rejected ? (
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
                          onClick={() => toggleRejected(museum.id)}
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(museum);
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
                        setEvent(museum)
                        setIsDialogDelete(true);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                    </div> : userRole === "approver" && !museum.is_approved && !museum.is_rejected ? <div className="flex items-center space-x-2">
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
                          onClick={() => toggleRejected(museum.id)}
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
                  <div>
                    <span className="font-medium">Ticket:</span>
                    <p className="text-muted-foreground">
                      {museum.is_free ? 'Free' : museum.ticket_price ? museum.ticket_price : 'Not set'}
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

export default EventManagement;
