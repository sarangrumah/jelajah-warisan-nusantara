import { useState, useEffect } from 'react';
import { contentService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Edit, Save, X, Plus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
import RichTextEditor from '../ui/rich-text-editor';
import QuillEditor from '@/components/ui/quill-editor';
import { sanitizeHtml } from '@/lib/sanitize-html';
// Utility to fix broken HTML tags like < p > to <p>
function fixBrokenHtmlTags(html: string): string {
  if (!html) { return html; }
  return html.replace(/<\s*([a-zA-Z0-9]+)\s*>/g, '<$1>')
             .replace(/<\s*\/\s*([a-zA-Z0-9]+)\s*>/g, '</$1>');
}

// Helper to render a plain text preview from potential HTML input
function stripHtml(input?: string): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '').trim();
}

export interface Company {
  id?: string;
  name: string;
  brand?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  aboutus?: string;
  vision?: string;
  mission?: string;
  latitude?: string;
  longitude?: string;
  is_active?: boolean;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;

  company_leadership?: CompanyLeadership[];
  company_visitor?: CompanyVisitor[];
}

export interface CompanyLeadership {
  id?: string;
  name: string;
  position: string;
  is_active: boolean;
  company_id?: string;
  created_by?: string;
  updated_by?: string;
  is_deleted: boolean,
}

export interface CompanyVisitor {
  id?: string;
  visitor_count: string;
  year: string;
  is_active: boolean;
  company_id?: string;
  created_by?: string;
  updated_by?: string;
  is_deleted: boolean,
}

// === EMPTY VALUES ===
const EmptyLeadership: CompanyLeadership = {
  name: '',
  position: '',
  is_active: true,
  company_id: '',
  is_deleted: false,
};

const EmptyVisitor: CompanyVisitor = {
  visitor_count: '',
  year: '',
  is_active: true,
  company_id: '',
  is_deleted: false,
};

const EmptyCompany: Company = {
  id: '',
  name: '',
  brand: '',
  address: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  aboutus: '',
  vision: '',
  mission: '',
  latitude: '',
  longitude: '',
  is_active: true,
  is_approved: false,
  created_at: '',
  updated_at: '',
  created_by: '',
  updated_by: '',
  company_leadership: [],
  company_visitor: []
};

// === Leadership Form Component ===
const LeadershipForm = ({
  leadership,
  onChange,
  onRemove
}: {
  leadership: CompanyLeadership;
  onChange: (updated: CompanyLeadership) => void;
  onRemove: () => void;
}) => {
  return (
    <div className="border p-4 rounded-lg space-y-3 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Leader Name</Label>
          <Input
            value={leadership.name}
            onChange={(e) =>
              onChange({ ...leadership, name: e.target.value })
            }
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Position</Label>
          <Input
            value={leadership.position}
            onChange={(e) =>
              onChange({ ...leadership, position: e.target.value })
            }
            placeholder="CEO"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={leadership.is_active}
          onCheckedChange={(checked) =>
            onChange({ ...leadership, is_active: checked })
          }
        />
        <Label>Active</Label>
      </div>
    </div>
  );
};

// === Visitor Form Component ===
const VisitorForm = ({
  visitor,
  onChange,
  onRemove
}: {
  visitor: CompanyVisitor;
  onChange: (updated: CompanyVisitor) => void;
  onRemove: () => void;
}) => {
  return (
    <div className="border p-4 rounded-lg space-y-3 relative">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Visitor Count</Label>
          <Input
            type="number"
            value={visitor.visitor_count}
            onChange={(e) =>
              onChange({ ...visitor, visitor_count: e.target.value })
            }
            placeholder="1000"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Year</Label>
          <Input
            value={visitor.year}
            onChange={(e) =>
              onChange({ ...visitor, year: e.target.value })
            }
            placeholder="2024"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={visitor.is_active}
          onCheckedChange={(checked) =>
            onChange({ ...visitor, is_active: checked })
          }
        />
        <Label>Active</Label>
      </div>
    </div>
  );
};

// === Main Profile Form ===
const ProfileForm = ({
  profile,
  changing,
  onSave,
  onCancel,
  saving
}: {
  profile: Company;
  changing: (data: Company) => void;
  onSave: (data: Company) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const handleFieldChange = (field: keyof Company, value: any) => {
    changing({ ...profile, [field]: value });
  };

  const addLeadership = () => {
    const newLeadership = { ...EmptyLeadership, };
    changing({
      ...profile,
      company_leadership: [...(profile.company_leadership || []), newLeadership]
    });
  };

  const updateLeadership = (index: number, updated: CompanyLeadership) => {
    const list = [...(profile.company_leadership || [])];
    list[index] = updated;
    changing({ ...profile, company_leadership: list });
  };

  const removeLeadership = (index: number) => {
    const list = [...(profile.company_leadership || [])];
    const item = list[index];

    // Mark for deletion if has ID
    if (item.id && typeof item.id === 'string') {
      list[index] = { ...item, is_deleted: true };
    } else {
      list.splice(index, 1);
    }

    changing({ ...profile, company_leadership: list });
  };

  const addVisitor = () => {
    const newVisitor = { ...EmptyVisitor };
    changing({
      ...profile,
      company_visitor: [...(profile.company_visitor || []), newVisitor]
    });
  };

  const updateVisitor = (index: number, updated: CompanyVisitor) => {
    const list = [...(profile.company_visitor || [])];
    list[index] = updated;
    changing({ ...profile, company_visitor: list });
  };

  const removeVisitor = (index: number) => {
    const list = [...(profile.company_visitor || [])];
    const item = list[index];

    if (item.id && typeof item.id === 'string') {
      list[index] = { ...item, is_deleted: true };
    } else {
      list.splice(index, 1);
    }

    changing({ ...profile, company_visitor: list });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input
            value={profile.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Brand</Label>
          <Input
            value={profile.brand || ''}
            onChange={(e) => handleFieldChange('brand', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={profile.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={profile.website || ''}
            onChange={(e) => handleFieldChange('website', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={profile.phone || ''}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Whatsapp</Label>
          <Input
            value={profile.whatsapp || ''}
            onChange={(e) => handleFieldChange('whatsapp', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Latitude</Label>
          <Input
            value={profile.latitude || ''}
            onChange={(e) => handleFieldChange('latitude', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Longitude</Label>
          <Input
            value={profile.longitude || ''}
            onChange={(e) => handleFieldChange('longitude', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Address</Label>
        <QuillEditor
          value={profile.address || ''}
          onChange={(html) => handleFieldChange('address', html)}
          height={100}
          placeholder="Company address"
        />
      </div>

      <div className="space-y-2">
        <Label>About Us</Label>
        <QuillEditor
          value={profile.aboutus || ''}
          onChange={(html) => handleFieldChange('aboutus', html)}
          height={100}
          placeholder="Describe the company"
        />
      </div>

      <div className="space-y-2">
        <Label>Vision</Label>
        <QuillEditor
          value={profile.vision || ''}
          onChange={(html) => handleFieldChange('vision', html)}
          height={100}
          placeholder="Write vision…"
        />
      </div>

      <div className="space-y-2">
        <Label>Mission</Label>
        <QuillEditor
          value={profile.mission || ''}
          onChange={(html) => handleFieldChange('mission', html)}
          height={100}
          placeholder="Write mission…"
        />
      </div>

      {/* === Leadership Section === */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Leadership</h3>
          <Button type="button" variant="outline" size="sm" onClick={addLeadership}>
            <Plus className="w-4 h-4 mr-1" />
            Add Leader
          </Button>
        </div>

        {profile.company_leadership?.map((item, index) => (
          !item.is_deleted && (
            <LeadershipForm
              key={item.id || `leader-${index}`}
              leadership={item}
              onChange={(updated) => updateLeadership(index, updated)}
              onRemove={() => removeLeadership(index)}
            />
          )
        ))}
      </div>

      {/* === Visitor Section === */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Visitor Stats</h3>
          <Button type="button" variant="outline" size="sm" onClick={addVisitor}>
            <Plus className="w-4 h-4 mr-1" />
            Add Year
          </Button>
        </div>

        {profile.company_visitor?.map((item, index) => (
          !item.is_deleted && (
            <VisitorForm
              key={item.id || `visitor-${index}`}
              visitor={item}
              onChange={(updated) => updateVisitor(index, updated)}
              onRemove={() => removeVisitor(index)}
            />
          )
        ))}
      </div>

      <div className="flex justify-end space-x-2 pt-6">
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

const CompanyProfileManagement =  ({ userRole }: { userRole: string }) => {
  const [profiles, setProfiles] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Company>(EmptyCompany);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await contentService.getAll();
      if (response.error) {throw new Error(response.error)};
      // Filter company profiles on the client side for now
      const companyProfiles = (response.data as Company[]|| []);
      setProfiles(companyProfiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load company profiles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (formData: Company) => {
    setSaving(true);
    try {
      // const profileData = {
      //   section_key: 'company_profile',
      //   title: formData.title,
      //   content: {
      //     logo_url: formData.content.logo_url || "",
      //     company_name: formData.content.company_name || "",
      //     description: formData.content.description || "",
      //     vision: formData.content.vision || "",
      //     mission: formData.content.mission || "",
      //     history: formData.content.history || "",
      //     contact_info: {
      //       address: formData.content.contact_info?.address || "",
      //       phone: formData.content.contact_info?.phone || "",
      //       email: formData.content.contact_info?.email || "",
      //       website: formData.content.contact_info?.website || "",
      //     },
      //     services: Array.isArray(formData.content.services) 
      //       ? formData.content.services 
      //       : [],
      //     values: Array.isArray(formData.content.values) 
      //       ? formData.content.values 
      //       : []
      //   },
      //   is_published: formData.is_published,
      // };

      let response;
      console.log("ini form datanya", formData)
      if (editingProfile?.id) {
        response = await contentService.update(editingProfile.id, formData);
        if (response.error) {throw new Error(response.error)};
        
        setProfiles(prev => 
          prev.map(profile => 
            profile.id === editingProfile.id 
              ? { ...profile, ...response.data, updated_at: new Date().toISOString() }
              : profile
          )
        );
      } else {
        response = await contentService.create(formData);
        if (response.error) {throw new Error(response.error)};
        
       setProfiles(prev => [{ ...response.data, updated_at: new Date().toISOString() }, ...prev]);
      }
      
      toast({
        title: 'Success',
        description: editingProfile?.id 
          ? 'Company profile updated successfully' 
          : 'Company profile created successfully',
      });
      
      setEditingProfile(EmptyCompany);
      setIsDialogOpen(false);
      fetchProfiles()
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save company profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      const response = await contentService.update(id, { is_published: isPublished });
      if (response.error) {throw new Error(response.error)};
      
      setProfiles(prev => prev.map(profile => 
        profile.id === id ? { ...profile, is_published: isPublished } : profile
      ));
      
      toast({
        title: 'Success',
        description: `Profile ${isPublished ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile status',
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
      <style>{`
        .rich-content ol { list-style: decimal; margin-left: 1.25rem; padding-left: 1rem; }
        .rich-content ul { list-style: disc; margin-left: 1.25rem; padding-left: 1rem; }
        .rich-content li { margin-left: 0.25rem; }
      `}</style>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Company Profile</h2>
          <p className="text-muted-foreground">company information and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {profiles.length === 0 ? (
              <Button onClick={() => setEditingProfile(EmptyCompany)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            ) : null}
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>
                {editingProfile ? 'Edit Company Profile' : 'Add New Company Profile'}
              </DialogTitle>
              <DialogDescription>
                {editingProfile
                  ? 'Update company profile information'
                  : 'Create a new company profile section'}
              </DialogDescription>
            </DialogHeader>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto py-4">
              <ProfileForm
                profile={editingProfile}
                changing={setEditingProfile}
                onSave={saveProfile}
                onCancel={() => {
                  setEditingProfile(EmptyCompany);
                  setIsDialogOpen(false);
                }}
                saving={saving}
              />
            </div>

            {/* Optional: Footer with actions can go here if not in ProfileForm */}
          </DialogContent>
        </Dialog>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No company profiles created yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Profile
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.name}
                      {/* <Badge variant={profile.is_published ? 'default' : 'secondary'}>
                        {profile.is_published ? 'Published' : 'Draft'}
                      </Badge> */}
                       <div className="flex justify-between items-start">
                        <Badge>
                          {profile.brand}
                        </Badge>
                       </div>
                    </CardTitle>
                    {/* <CardDescription>

                    </CardDescription> */}
                  </div>
                  {userRole !== "approver" && userRole !== "viewer" ?                   
                    <div className="flex items-center space-x-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublished(profile.id, !profile.is_published)}
                    >
                      {profile.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button> */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProfile(profile);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div> : <div></div>}

                </div>
              </CardHeader>
              <CardContent>
                {/* About Us */}
                <div className='pb-2'>
                  <div className='pb-2'>
                    <span className="font-medium">About Us</span>
                  </div>
                  <div className="border p-4 rounded-lg space-y-3 relative">
                    <div className='pb-2'>
                      <p className="text-muted-foreground line-clamp-2">
                        {stripHtml(profile.aboutus) || 'No description'}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className='pb-2'>
                        <span className="font-medium">Vision</span>
                        <div
                          className="rich-content text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(fixBrokenHtmlTags(profile.vision || 'No description')) }}
                        />
                      </div>
                      <div className='pb-2'>
                        <span className="font-medium">Mission</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {stripHtml(profile.mission) || 'No description'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Location */}
                <div className='pb-2'>
                  <div className='pb-2'>
                    <span className="font-medium">Information Location</span>
                  </div>
                  <div className="border p-4 rounded-lg space-y-3 relative">
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-muted-foreground line-clamp-2">
                        {stripHtml(profile.address) || 'No longitude'}
                      </p>
                    </div>
                    <div className="flex gap-4 text-m">
                      <div>
                        <span className="font-medium">Latitude:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.latitude || 'No latitude'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Longitude:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.longitude || 'No longitude'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Contact */}
                <div className='pb-2'>
                  <div className='pb-2'>
                    <span className="font-medium">Information Contact</span>
                  </div>
                  <div className="border p-4 rounded-lg space-y-3 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-m">
                      <div>
                        <span className="font-medium">Phone:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.phone || 'No Email'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Whatsapp:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.whatsapp || 'No Whatsapp'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-m">
                      <div>
                        <span className="font-medium">Email:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.email || 'No Email'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">website:</span>
                        <p className="text-muted-foreground line-clamp-2">
                          {profile.website || 'No Whatsapp'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Leader */}
                <div className='pb-2'>
                  <div className='pb-2'>
                    <span className="font-medium">Leader</span>
                  </div>
                  <div className="border p-4 rounded-lg space-y-3 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.company_leadership?.map((e, idx) => (
                        <div key={e.id ?? `leader-view-${idx}`} className='flex gap-4'>
                          <div className='pb-2'>
                            <span className="font-medium">Name</span>
                            <p className="text-muted-foreground line-clamp-2">
                              {e.name || 'No name'}
                            </p>
                            <span className="font-medium">Position</span>
                            <p className="text-muted-foreground line-clamp-2">
                              {e.position || 'No position'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Visitor */}
                <div className='pb-2'>
                  <div className='pb-2'>
                    <span className="font-medium">Visitor</span>
                  </div>
                  <div className="border p-4 rounded-lg space-y-3 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.company_visitor?.map((e, idx) => (
                        <div key={e.id ?? `visitor-view-${idx}`} className='flex gap-4'>
                          <div className='pb-2'>
                            <span className="font-medium">Year</span>
                            <p className="text-muted-foreground line-clamp-2">
                              {e.year || 'No name'}
                            </p>
                            <span className="font-medium">Count</span>
                            <p className="text-muted-foreground line-clamp-2">
                              {e.visitor_count || 'No position'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default CompanyProfileManagement;
