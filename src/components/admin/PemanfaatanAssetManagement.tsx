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
  CardFooter,
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ChevronsUpDown,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
}

interface AssetImage {
  path: string;
  sites: string;
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
  category_relation?: CategoryOption | CategoryOption[] | null;
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
      .filter((item) => Boolean(item) && item.path !== '') as AssetImage[];
  }

  if (typeof raw === 'string') {
    if (raw.trim() === '') {
      return [];
    }
    try {
      // First decode HTML entities, then parse JSON
      const decoded = raw.replace(/"/g, '"');
      const parsed = JSON.parse(decoded);
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
  return JSON.stringify(images.map((image) => {
    // Extract only the filename from the path
    const path = image.path;
    if (path.startsWith('/uploads/')) {
      return path.split('/').pop() || path;
    }
    // If it's already just a filename (no path), return as is
    if (!path.includes('/')) {
      return path;
    }
    // For any other path format, extract just the filename
    return path.split('/').pop() || path;
  }));
};

const extractImagePaths = (imageData: any): string[] => {
  if (!imageData) return [];
  
  // If it's already a string URL, return as array
  if (typeof imageData === 'string') {
    return [imageData.startsWith('/uploads/') ? imageData : imageData];
  }
  
  // If it's an array, process all images
  if (Array.isArray(imageData)) {
    return imageData.map(item => {
      if (typeof item === 'string') {
        return item.startsWith('/uploads/') ? item : item;
      }
      if (item && typeof item === 'object' && item.path) {
        return item.path.startsWith('/uploads/') ? item.path : item.path;
      }
      return '';
    }).filter(Boolean);
  }
  
  // If it's an object with path property
  if (imageData && typeof imageData === 'object' && imageData.path) {
    return [imageData.path.startsWith('/uploads/') ? imageData.path : imageData.path];
  }
  
  return [];
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

const parseCategoryIds = (raw: unknown): string[] => {
  if (!raw && raw !== 0) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw
      .map((value) =>
        typeof value === 'string' || typeof value === 'number'
          ? String(value).trim()
          : ''
      )
      .filter((value) => value.length > 0);
  }

  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  if (typeof raw === 'number') {
    return [String(raw)];
  }

  return [];
};

const formatCategoryValue = (ids: string[]): string =>
  ids
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .join(',');

const extractCategoryIds = (
  categoryValue: unknown,
  relation?: CategoryOption | CategoryOption[] | null
): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  parseCategoryIds(categoryValue).forEach((id) => {
    if (!seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  });

  if (!relation) {
    return result;
  }

  const relationArray = Array.isArray(relation) ? relation : [relation];
  relationArray.forEach((entry) => {
    if (!entry) {
      return;
    }
    const entryId = String(entry.id ?? '').trim();
    if (entryId && !seen.has(entryId)) {
      seen.add(entryId);
      result.push(entryId);
    }
  });

  return result;
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
  if (!cleaned || cleaned === '<p><br></p>') {
    return '';
  }
  return cleaned;
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
  const initialCategoryIds = useMemo(
    () => extractCategoryIds(value.category, value.category_relation),
    [value.category, value.category_relation]
  );

  const [formData, setFormData] = useState<PemanfaatanAsset>({
    ...value,
    category: formatCategoryValue(initialCategoryIds),
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(initialCategoryIds);
  const [categoryPopoverOpen, setCategoryPopoverOpen] = useState(false);

  useEffect(() => {
    const derivedCategoryIds = extractCategoryIds(value.category, value.category_relation);
    setFormData({
      ...value,
      category: formatCategoryValue(derivedCategoryIds),
    });
    setSelectedCategoryIds(derivedCategoryIds);
  }, [value]);

  useEffect(() => {
    setFormData((prev) => {
      const nextCategory = formatCategoryValue(selectedCategoryIds);
      if (prev.category === nextCategory) {
        return prev;
      }
      return { ...prev, category: nextCategory };
    });
  }, [selectedCategoryIds]);

  const selectedCategoryOptions = useMemo(() => {
    const optionMap = new Map<string, CategoryOption>(
      facilityCategories.map((category) => [category.id, category])
    );
    return selectedCategoryIds
      .map((id) => optionMap.get(id))
      .filter((option): option is CategoryOption => Boolean(option));
  }, [facilityCategories, selectedCategoryIds]);

  const categoryButtonText = useMemo(() => {
    if (selectedCategoryIds.length === 0) {
      return 'Select categories';
    }

    if (selectedCategoryIds.length === 1) {
      const onlyId = selectedCategoryIds[0];
      const label =
        selectedCategoryOptions.find((option) => option.id === onlyId)?.name ||
        facilityCategories.find((category) => category.id === onlyId)?.name ||
        onlyId;
      return label;
    }

    const firstId = selectedCategoryIds[0];
    const firstLabel =
      selectedCategoryOptions.find((option) => option.id === firstId)?.name ||
      facilityCategories.find((category) => category.id === firstId)?.name ||
      firstId;

    return `${firstLabel} + ${selectedCategoryIds.length - 1} more`;
  }, [facilityCategories, selectedCategoryIds, selectedCategoryOptions]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategoryIds((prev) => {
      if (checked) {
        if (prev.includes(categoryId)) {
          return prev;
        }
        return [...prev, categoryId];
      }
      return prev.filter((id) => id !== categoryId);
    });
  };

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
          <Label htmlFor="category">Category</Label>
          <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                id="category"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={categoryPopoverOpen}
                className="w-full justify-between"
              >
                <span className="truncate text-left">
                  {categoryButtonText}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(22rem,90vw)] p-0">
              <ScrollArea className="max-h-56">
                <div className="flex flex-col gap-1 p-2">
                  {facilityCategories.length === 0 ? (
                    <p className="px-2 py-1 text-sm text-muted-foreground">No categories available.</p>
                  ) : (
                    facilityCategories.map((category) => {
                      const isChecked = selectedCategoryIds.includes(category.id);
                      return (
                        <label
                          key={category.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleCategoryChange(category.id, checked === true)
                            }
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          {selectedCategoryIds.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedCategoryIds.map((id) => {
                const option = facilityCategories.find((category) => category.id === id);
                const label = option?.name || id;
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1 pl-2"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(id, false)}
                      className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-muted"
                      aria-label={`Remove ${label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          ) : null}
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
        bucket="pemanfaatan-assets"
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PemanfaatanAsset | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const { toast } = useToast();

  const canEdit = useMemo(
    () => userRole === 'admin' || userRole === 'super-admin',
    [userRole]
  );

  const canApprove = useMemo(
    () => userRole === 'approver' || userRole === 'super-admin',
    [userRole]
  );

  const facilityCategoryMap = useMemo(
    () => new Map(facilityCategories.map((category) => [category.id, category.name])),
    [facilityCategories]
  );

  const getCategoryBadges = (asset: PemanfaatanAsset) => {
    const ids = extractCategoryIds(asset.category, asset.category_relation);
    const relationEntries: CategoryOption[] = Array.isArray(asset.category_relation)
      ? asset.category_relation.filter((entry): entry is CategoryOption => Boolean(entry))
      : asset.category_relation
      ? [asset.category_relation]
      : [];
    const relationMap = new Map<string, string>(
      relationEntries.map((entry) => [entry.id, entry.name])
    );

    return ids.map((id) => ({
      id,
      name: relationMap.get(id) ?? facilityCategoryMap.get(id) ?? id,
    }));
  };

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
        assets.map((item) => {
          const categoryRelation = (item as any).category_relation as
            | CategoryOption
            | CategoryOption[]
            | null
            | undefined;
          const normalizedCategory = formatCategoryValue(
            extractCategoryIds(item.category, categoryRelation)
          );

          return {
            ...item,
            image_url: deserializeImages((item as any).image_url),
            reason_rejected: item.reason_rejected ?? '',
            area: item.area ?? '',
            category: normalizedCategory,
            category_relation: categoryRelation ?? null,
            description: jsonValueToQuillContent((item as any).description),
            fasilitas: jsonValueToQuillContent((item as any).fasilitas),
            fasilitas_tambahan: jsonValueToQuillContent((item as any).fasilitas_tambahan),
            ketentuan_umum: jsonValueToQuillContent((item as any).ketentuan_umum),
            description_raw: (item as any).description,
            fasilitas_raw: (item as any).fasilitas,
            fasilitas_tambahan_raw: (item as any).fasilitas_tambahan,
            ketentuan_umum_raw: (item as any).ketentuan_umum,
          };
        })
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

      const normalizedCategoryValue = formatCategoryValue(parseCategoryIds(data.category));

      const payload = {
        title: data.title,
        short_location: data.short_location,
        location: data.location,
        area: data.area || null,
        category: normalizedCategoryValue || null,
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

  const openDeleteDialog = (asset: PemanfaatanAsset) => {
    setDeletingItem(asset);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingItem(null);
    setDeleteSubmitting(false);
  };

  const deleteItem = async () => {
    if (!deletingItem?.id) {
      return;
    }
    try {
      setDeleteSubmitting(true);
      const response = await pemanfaatanAssetService.delete(deletingItem.id);
      if (response.error) {
        throw new Error(response.error);
      }
      toast({ title: 'Deleted', description: 'Asset deleted successfully' });
      closeDeleteDialog();
      await fetchAll();
    } catch (error) {
      console.error('Error deleting pemanfaatan asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive',
      });
    } finally {
      setDeleteSubmitting(false);
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
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {deletingItem?.title ? `Delete ${deletingItem.title}` : 'Delete Asset'}
            </DialogTitle>
            <DialogDescription>
              {deletingItem?.title
                ? `This action cannot be undone. ${deletingItem.title} will be permanently removed.`
                : 'This action cannot be undone. The selected asset will be permanently removed.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={closeDeleteDialog}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteItem}
              disabled={deleteSubmitting}
            >
              {deleteSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
          {items.map((item) => {
            const categoryBadges = getCategoryBadges(item);

            return (
              <Card key={item.id} className="flex flex-col">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                    <CardDescription>
                      {item.short_location || 'No short location'}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {item.is_active && <Badge>Published</Badge>}
                    {item.is_approved ? (
                      <Badge variant="success">Approved</Badge>
                    ) : item.is_rejected ? (
                      <Badge variant="destructive">Rejected</Badge>
                    ) : (
                      // <Badge variant="outline">Pending Approval</Badge>
                      <></>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Area</span>
                    <p>
                      {item.area_relation?.name ||
                        areas.find((area) => area.id === item.area)?.name ||
                        '—'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Category</span>
                    {categoryBadges.length ? (
                      <div className="flex flex-wrap gap-2">
                        {categoryBadges.map((category) => (
                          <Badge
                            key={`${item.id ?? 'asset'}-${category.id}`}
                            variant="outline"
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p>—</p>
                    )}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <span className="font-medium text-muted-foreground">Address</span>
                    <p>{item.location || '—'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 text-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Capacity</span>
                    <p>{item.kapasitas || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Dimensions</span>
                    <p>{item.ukuran || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Price</span>
                    <p>{item.tarif || '—'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-medium text-muted-foreground">Overtime</span>
                    <p>{item.overtime || '—'}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="font-medium text-muted-foreground">Description</span>
                  <p className="text-muted-foreground">
                    {summarizeJsonField(item.description_raw ?? item.description)}
                  </p>
                </div>
                {item.is_rejected && item.reason_rejected?.trim() ? (
                  <div className="rounded-md bg-destructive/10 p-3">
                    <span className="font-medium">Alasan Penolakan: </span>
                    <span className="text-muted-foreground">{item.reason_rejected}</span>
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex-col items-start gap-3">
                {canEdit && item.id ? (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!!item.is_active}
                      onCheckedChange={(checked) => togglePublish(item.id!, checked)}
                    />
                    <span className="text-sm">Publish</span>
                  </div>
                ) : null}
                <div className="flex w-full flex-wrap gap-2">
                  {canEdit && item.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openWithAsset(item)}
                      className="flex-1 sm:flex-none"
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
                      className="flex-1 sm:flex-none"
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
                      className="flex-1 sm:flex-none"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  {canEdit && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(item)}
                      className="flex-1 sm:flex-none"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              </CardFooter>
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
