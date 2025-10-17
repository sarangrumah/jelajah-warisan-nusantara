import { useEffect, useMemo, useState } from 'react';
import {
  pemanfaatanAssetCategories,
  pemanfaatanAssetService,
} from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import QuillEditor from '@/components/ui/quill-editor';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHtml } from '@/lib/sanitize-html';
import {
  Edit,
  Loader2,
  Plus,
  Save,
  Trash,
  X,
  Check,
  Ban,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface AssetImage {
  path: string;
  sites?: string;
}

interface PemanfaatanAsset {
  id?: string;
  title: string;
  short_location: string;
  location: string;
  area: string;
  category: string;
  description: string;
  fasilitas: string;
  fasilitas_tambahan: string;
  ketentuan_umum: string;
  kapasitas: string;
  ukuran: string;
  tarif: string;
  overtime: string;
  image_url: AssetImage[];
  is_active: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  created_at?: string;
  updated_at?: string;
  area_relation?: CategoryOption | null;
  category_relation?: CategoryOption | null;
  description_raw?: unknown;
  fasilitas_raw?: unknown;
  fasilitas_tambahan_raw?: unknown;
  ketentuan_umum_raw?: unknown;
}

const emptyAsset: PemanfaatanAsset = {
  title: '',
  short_location: '',
  location: '',
  area: '',
  category: '',
  description: '',
  fasilitas: '',
  fasilitas_tambahan: '',
  ketentuan_umum: '',
  kapasitas: '',
  ukuran: '',
  tarif: '',
  overtime: '',
  image_url: [],
  is_active: true,
  is_rejected: false,
  reason_rejected: '',
  description_raw: null,
  fasilitas_raw: null,
  fasilitas_tambahan_raw: null,
  ketentuan_umum_raw: null,
};

const deserializeImages = (raw: unknown): AssetImage[] => {
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') {
          return { path: item, sites: '' };
        }
        if (item && typeof item === 'object' && 'path' in item) {
          const entry = item as Record<string, unknown>;
          return {
            path: String(entry.path ?? ''),
            sites: typeof entry.sites === 'string' ? entry.sites : '',
          };
        }
        return null;
      })
      .filter((item): item is AssetImage => Boolean(item) && item.path !== '');
  }

  if (typeof raw === 'string') {
    if (raw.trim() === '') {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return deserializeImages(parsed);
      }
    } catch (error) {
      // Value was likely a plain URL string; fall through to treat as single image
      return [{ path: raw, sites: '' }];
    }
    return [];
  }

  return [];
};

const serializeImages = (images: AssetImage[]): string => {
  if (!images || images.length === 0) {
    return '[]';
  }
  return JSON.stringify(images.map((image) => image.path));
};

const stripHtml = (html: string) => html
  .replace(/&nbsp;/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const jsonValueToQuillContent = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {return '';}
    try {
      const parsed = JSON.parse(trimmed);
      return jsonValueToQuillContent(parsed);
    } catch (_) {
      return trimmed;
    }
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {return '';}
    if (value.length === 1) {return jsonValueToQuillContent(value[0]);}
    return JSON.stringify(value, null, 2);
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.content === 'string') {
      const content = obj.content.trim();
      if (content === '' || content === '<p><br></p>') {
        return '';
      }
      return obj.content;
    }
    return JSON.stringify(obj, null, 2);
  }

  return String(value);
};

const summarizeJsonField = (value: unknown) => {
  const content = jsonValueToQuillContent(value);
  if (!content) {
    return 'No data';
  }
  const plain = stripHtml(content);
  if (!plain) {
    return 'No data';
  }
  return plain.length > 100 ? `${plain.slice(0, 157)}...` : plain;
};

const prepareRichTextPayload = (value: string): string => {
  const cleaned = sanitizeHtml(value || '').trim();
  const isEmpty = cleaned === '' || cleaned === '<p><br></p>';
  const content = isEmpty ? '' : cleaned;
  return JSON.stringify({ content });
};

const PemanfaatanAssetForm = ({
  value,
  areas,
  facilityCategories,
  saving,
  onCancel,
  onSave,
}: {
  value: PemanfaatanAsset;
  areas: CategoryOption[];
  facilityCategories: CategoryOption[];
  saving: boolean;
  onCancel: () => void;
  onSave: (data: PemanfaatanAsset) => void;
}) => {
  const [formData, setFormData] = useState<PemanfaatanAsset>({ ...value });

  useEffect(() => {
    setFormData({ ...value });
  }, [value]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Asset Name</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="short_location">Location</Label>
          <Input
            id="short_location"
            value={formData.short_location}
            onChange={(event) => setFormData((prev) => ({ ...prev, short_location: event.target.value }))}
            placeholder="e.g., Jakarta"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Address</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
          placeholder="Complete address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Area</Label>
          <Select
            value={formData.area || 'none'}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, area: value === 'none' ? '' : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select area</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category || 'none'}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value === 'none' ? '' : value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select category</SelectItem>
              {facilityCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <QuillEditor
          value={formData.description || ''}
          onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
          height={100}
          placeholder="Describe this asset"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fasilitas">Main Facilities</Label>
        <QuillEditor
          value={formData.fasilitas || ''}
          onChange={(html) => setFormData((prev) => ({ ...prev, fasilitas: html }))}
          height={100}
          placeholder="List main facilities"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fasilitas_tambahan">Additional Facilities</Label>
        <QuillEditor
          value={formData.fasilitas_tambahan || ''}
          onChange={(html) => setFormData((prev) => ({ ...prev, fasilitas_tambahan: html }))}
          height={100}
          placeholder="Describe additional facilities"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ketentuan_umum">General Requirements</Label>
        <QuillEditor
          value={formData.ketentuan_umum || ''}
          onChange={(html) => setFormData((prev) => ({ ...prev, ketentuan_umum: html }))}
          height={100}
          placeholder="State terms and conditions"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kapasitas">Capacity</Label>
          <Input
            id="kapasitas"
            value={formData.kapasitas}
            onChange={(event) => setFormData((prev) => ({ ...prev, kapasitas: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ukuran">Dimensions</Label>
          <Input
            id="ukuran"
            value={formData.ukuran}
            onChange={(event) => setFormData((prev) => ({ ...prev, ukuran: event.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tarif">Price</Label>
          <Input
            id="tarif"
            value={formData.tarif}
            onChange={(event) => setFormData((prev) => ({ ...prev, tarif: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="overtime">Overtime</Label>
          <Input
            id="overtime"
            value={formData.overtime}
            onChange={(event) => setFormData((prev) => ({ ...prev, overtime: event.target.value }))}
            placeholder="e.g., Additional overtime policy"
          />
        </div>
      </div>

      <GalleryUpload
        label="Image Upload"
        value={formData.image_url}
        onChange={(images) => setFormData((prev) => ({ ...prev, image_url: images }))}
        bucket="hero-sections"
        maxImages={10}
      />

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Publish</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
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

const PemanfaatanAssetManagement = ({ userRole }: { userRole: string }) => {
  const [items, setItems] = useState<PemanfaatanAsset[]>([]);
  const [areas, setAreas] = useState<CategoryOption[]>([]);
  const [facilityCategories, setFacilityCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PemanfaatanAsset>(emptyAsset);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const { toast } = useToast();

  const canEdit = useMemo(
    () => userRole === 'admin' || userRole === 'super-admin',
    [userRole]
  );

  const canApprove = useMemo(
    () => userRole === 'approver' || userRole === 'super-admin',
    [userRole]
  );

  useEffect(() => {
    fetchAll();
    fetchCategories();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const response = await pemanfaatanAssetService.getAll();
      if (response.error) {
        throw new Error(response.error);
      }
      const assets = (response.data as PemanfaatanAsset[] | undefined) || [];
      setItems(
        assets.map((item) => ({
          ...item,
          image_url: deserializeImages((item as any).image_url),
          reason_rejected: item.reason_rejected ?? '',
          area: item.area ?? '',
          category: item.category ?? '',
          description: jsonValueToQuillContent((item as any).description),
          fasilitas: jsonValueToQuillContent((item as any).fasilitas),
          fasilitas_tambahan: jsonValueToQuillContent((item as any).fasilitas_tambahan),
          ketentuan_umum: jsonValueToQuillContent((item as any).ketentuan_umum),
          description_raw: (item as any).description,
          fasilitas_raw: (item as any).fasilitas,
          fasilitas_tambahan_raw: (item as any).fasilitas_tambahan,
          ketentuan_umum_raw: (item as any).ketentuan_umum,
        }))
      );
    } catch (error) {
      console.error('Error fetching pemanfaatan asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pemanfaatan asset data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const [areaResponse, facilityResponse] = await Promise.all([
        pemanfaatanAssetCategories.getAreas(),
        pemanfaatanAssetCategories.getFacilities(),
      ]);

      if (areaResponse.error) {
        throw new Error(areaResponse.error);
      }

      if (facilityResponse.error) {
        throw new Error(facilityResponse.error);
      }

      setAreas((areaResponse.data as CategoryOption[] | undefined) || []);
      setFacilityCategories((facilityResponse.data as CategoryOption[] | undefined) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async (data: PemanfaatanAsset) => {
    setSaving(true);
    try {
      const normalizeField = (value: string, fieldName: string) => {
        try {
          return prepareRichTextPayload(value || '');
        } catch (error) {
          toast({
            title: 'Invalid content',
            description: `${fieldName} contains invalid content.`,
            variant: 'destructive',
          });
          throw error;
        }
      };

      const normalizedDescription = normalizeField(data.description || '', 'Description');
      const normalizedFacilities = normalizeField(data.fasilitas || '', 'Main Facilities');
      const normalizedAdditional = normalizeField(data.fasilitas_tambahan || '', 'Additional Facilities');
      const normalizedRequirements = normalizeField(data.ketentuan_umum || '', 'General Requirements');

      const payload = {
        title: data.title,
        short_location: data.short_location,
        location: data.location,
        area: data.area || null,
        category: data.category || null,
        description: normalizedDescription,
        fasilitas: normalizedFacilities,
        fasilitas_tambahan: normalizedAdditional,
        ketentuan_umum: normalizedRequirements,
        kapasitas: data.kapasitas,
        ukuran: data.ukuran,
        tarif: data.tarif,
        overtime: data.overtime,
        image_url: serializeImages(data.image_url || []),
        is_active: data.is_active,
        is_rejected: false,
        reason_rejected: '',
      };

      if (editing.id) {
        const response = await pemanfaatanAssetService.update(editing.id, payload);
        if (response.error) {
          throw new Error(response.error);
        }
        toast({ title: 'Updated', description: 'Asset updated successfully' });
      } else {
        const response = await pemanfaatanAssetService.create(payload);
        if (response.error) {
          throw new Error(response.error);
        }
        toast({ title: 'Created', description: 'Asset created successfully' });
      }

      setDialogOpen(false);
      setEditing({ ...emptyAsset });
      await fetchAll();
    } catch (error) {
      console.error('Error saving pemanfaatan asset:', error);
      if (!(error instanceof SyntaxError)) {
        toast({
          title: 'Error',
          description: 'Failed to save asset',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, nextActive: boolean) => {
    try {
      const response = await pemanfaatanAssetService.update(id, { is_active: nextActive });
      if (response.error) {
        throw new Error(response.error);
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_active: nextActive } : item))
      );
      toast({
        title: 'Success',
        description: `Asset ${nextActive ? 'published' : 'unpublished'}`,
      });
    } catch (error) {
      console.error('Error toggling publish state:', error);
      toast({
        title: 'Error',
        description: 'Failed to update publish state',
        variant: 'destructive',
      });
    }
  };

  const approveItem = async (id: string) => {
    try {
      const response = await pemanfaatanAssetService.approve(id);
      if (response.error) {
        throw new Error(response.error);
      }
      const updated = (response.data || {}) as Partial<PemanfaatanAsset>;
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_approved: updated.is_approved ?? true,
                is_rejected: updated.is_rejected ?? false,
                reason_rejected: '',
              }
            : item
        )
      );
      toast({ title: 'Approved', description: 'Asset approved successfully' });
      await fetchAll();
    } catch (error) {
      console.error('Error approving pemanfaatan asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve asset',
        variant: 'destructive',
      });
    }
  };

  const openReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectDialogOpen(true);
  };

  const closeReject = () => {
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
        description: 'Please provide a rejection reason.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRejectSubmitting(true);
      const response = await pemanfaatanAssetService.reject(rejectingId, trimmedReason);
      if (response.error) {
        throw new Error(response.error);
      }

      const updated = (response.data || {}) as Partial<PemanfaatanAsset>;
      setItems((prev) =>
        prev.map((item) =>
          item.id === rejectingId
            ? {
                ...item,
                is_approved: updated.is_approved ?? false,
                is_rejected: updated.is_rejected ?? true,
                reason_rejected: updated.reason_rejected ?? trimmedReason,
              }
            : item
        )
      );

      toast({ title: 'Rejected', description: 'Asset rejected successfully' });
      closeReject();
      await fetchAll();
    } catch (error) {
      console.error('Error rejecting pemanfaatan asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject asset',
        variant: 'destructive',
      });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    const confirmed = window.confirm('Delete this asset? This action cannot be undone.');
    if (!confirmed) {
      return;
    }
    try {
      const response = await pemanfaatanAssetService.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      toast({ title: 'Deleted', description: 'Asset deleted successfully' });
      await fetchAll();
    } catch (error) {
      console.error('Error deleting pemanfaatan asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
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

  const handleDialogToggle = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditing({ ...emptyAsset });
    }
  };

  const openWithAsset = (asset: PemanfaatanAsset) => {
    setEditing({
      ...asset,
      description: jsonValueToQuillContent(asset.description_raw ?? asset.description),
      fasilitas: jsonValueToQuillContent(asset.fasilitas_raw ?? asset.fasilitas),
      fasilitas_tambahan: jsonValueToQuillContent(asset.fasilitas_tambahan_raw ?? asset.fasilitas_tambahan),
      ketentuan_umum: jsonValueToQuillContent(asset.ketentuan_umum_raw ?? asset.ketentuan_umum),
      image_url: asset.image_url ? [...asset.image_url] : [],
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing({ ...emptyAsset });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Layanan Pemanfaatan Aset</h2>
          <p className="text-muted-foreground">
            Kelola data layanan pemanfaatan aset beserta proses approvalnya.
          </p>
        </div>
        {canEdit && (
          <Dialog open={dialogOpen} onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Pemanfaatan Aset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{editing.id ? 'Edit Pemanfaatan Aset' : 'Add Pemanfaatan Aset'}</DialogTitle>
                <DialogDescription>
                  Lengkapi informasi sesuai kebutuhan layanan pemanfaatan aset.
                </DialogDescription>
              </DialogHeader>
              <PemanfaatanAssetForm
                value={editing}
                areas={areas}
                facilityCategories={facilityCategories}
                saving={saving}
                onCancel={() => handleDialogToggle(false)}
                onSave={handleSave}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No data yet</CardTitle>
            <CardDescription>Start by adding a new layanan pemanfaatan aset.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {items.map((item) => {
            const firstImage = item.image_url[0]?.path;
            return (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        {item.short_location || 'No short location'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {item.is_active && <Badge>Published</Badge>}
                      {item.is_approved ? (
                        <Badge variant="success">Approved</Badge>
                      ) : item.is_rejected ? (
                        <Badge variant="destructive">Rejected</Badge>
                      ) : (
                        <Badge variant="outline">Pending Approval</Badge>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Area</span>
                      <p className="text-sm">
                        {item.area_relation?.name ||
                          areas.find((area) => area.id === item.area)?.name ||
                          '—'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm font-medium text-muted-foreground">Category</span>
                      <p className="text-sm">
                        {item.category_relation?.name ||
                          facilityCategories.find((category) => category.id === item.category)?.name ||
                          '—'}
                      </p>
                    </div>
                  </div>
                  {item.reason_rejected && item.is_rejected && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                      <p className="font-medium text-destructive">Alasan Penolakan</p>
                      <p className="text-destructive/90">{item.reason_rejected}</p>
                    </div>
                  )}
                </CardHeader>
                {firstImage && (
                  <div className="px-6">
                    <img
                      src={firstImage}
                      alt={item.title}
                      className="h-48 w-full rounded-md object-cover"
                    />
                  </div>
                )}
                <CardContent className="flex-1 space-y-3 pt-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-sm">{item.location || '—'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                      <p className="text-sm">{item.kapasitas || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Dimensions</p>
                      <p className="text-sm">{item.ukuran || '—'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Price</p>
                      <p className="text-sm">{item.tarif || '—'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overtime</p>
                      <p className="text-sm">{item.overtime || '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm text-muted-foreground">
                      {summarizeJsonField(item.description_raw ?? item.description)}
                    </p>
                  </div>
                </CardContent>
                <div className="px-6 pb-4 flex flex-wrap items-center justify-between gap-3">
                  {canEdit && item.id && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={!!item.is_active}
                          onCheckedChange={(checked) => togglePublish(item.id!, checked)}
                        />
                        <span className="text-sm">Publish</span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 ml-auto">
                    {canEdit && item.id && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openWithAsset(item)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    {canApprove && !item.is_approved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveItem(item.id!)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {canApprove && !item.is_rejected && !item.is_approved && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openReject(item.id!)}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    )}
                    {canEdit && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(item.id!)}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <RejectReasonDialog
        open={rejectDialogOpen}
        onClose={closeReject}
        reason={rejectReason}
        onReasonChange={setRejectReason}
        onSubmit={submitReject}
        loading={rejectSubmitting}
        title="Reject Pemanfaatan Aset"
        description="Tambahkan alasan mengapa layanan ini ditolak. Pesan ini akan terlihat oleh penyunting."
      />
    </div>
  );
};

export default PemanfaatanAssetManagement;
