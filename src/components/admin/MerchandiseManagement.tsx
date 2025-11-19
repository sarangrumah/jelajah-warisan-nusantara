
import { useState, useEffect } from 'react';
import { merchandiseProductService, merchandiseCategoryService } from '@/lib/api-services';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Package,
  Tag,
  Edit3,
  Trash2,
  Plus,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ui/image-upload';
import { RejectReasonDialog } from '@/components/admin/RejectReasonDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MerchandiseCategory {
  id?: string;
  name: string;
  description?: string;
  image_url?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MerchandiseProduct {
  id?: string;
  name: string;
  description?: string;
  short_description?: string;
  price: number;
  category_id?: string;
  images: string[];
  is_published: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  reason_rejected?: string;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
  category?: MerchandiseCategory;
}

const MerchandiseManagement = ({ userRole }: { userRole: string }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<MerchandiseProduct[]>([]);
  const [categories, setCategories] = useState<MerchandiseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MerchandiseProduct | null>(null);
  const [editingCategory, setEditingCategory] = useState<MerchandiseCategory | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);
  const { toast } = useToast();

  const emptyProduct: MerchandiseProduct = {
    name: '',
    description: '',
    short_description: '',
    price: 0,
    category_id: '',
    images: [],
    is_published: true,
    whatsapp_number: '',
  };

  const emptyCategory: MerchandiseCategory = {
    name: '',
    description: '',
    image_url: '',
    is_published: true,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        merchandiseProductService.getAll(),
        merchandiseCategoryService.getAll()
      ]);

      if (productsResponse.error) {
        throw new Error(productsResponse.error);
      }
      if (categoriesResponse.error) {
        throw new Error(categoriesResponse.error);
      }

      setProducts((productsResponse.data as MerchandiseProduct[]) || []);
      setCategories((categoriesResponse.data as MerchandiseCategory[]) || []);
    } catch (error) {
      console.error('Error fetching merchandise data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data merchandise',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (productData: MerchandiseProduct) => {
    setSaving(true);
    try {
      let response;
      if (productData.id) {
        response = await merchandiseProductService.update(productData.id, productData);
        if (response.error) {
          throw new Error(response.error);
        }
        
        setProducts(prev => prev.map(p => 
          p.id === productData.id ? { ...p, ...productData } : p
        ));
      } else {
        response = await merchandiseProductService.create(productData);
        if (response.error) {
          throw new Error(response.error);
        }
        setProducts(prev => [response.data as MerchandiseProduct, ...prev]);
      }

      toast({
        title: 'Berhasil',
        description: productData.id ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan',
      });
      
      setShowProductDialog(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan produk',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const saveCategory = async (categoryData: MerchandiseCategory) => {
    setSaving(true);
    try {
      let response;
      if (categoryData.id) {
        response = await merchandiseCategoryService.update(categoryData.id, categoryData);
        if (response.error) {
          throw new Error(response.error);
        }
        
        setCategories(prev => prev.map(c =>
          c.id === categoryData.id ? { ...c, ...categoryData } : c
        ));
      } else {
        response = await merchandiseCategoryService.create(categoryData);
        if (response.error) {
          throw new Error(response.error);
        }
        setCategories(prev => [response.data as MerchandiseCategory, ...prev]);
      }

      toast({
        title: 'Berhasil',
        description: categoryData.id ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan',
      });
      
      setShowCategoryDialog(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan kategori',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await merchandiseProductService.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      setProducts(prev => prev.filter(product => product.id !== id));
      toast({
        title: 'Berhasil',
        description: 'Produk berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus produk',
        variant: 'destructive',
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await merchandiseCategoryService.delete(id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCategories(prev => prev.filter(category => category.id !== id));
      toast({
        title: 'Berhasil',
        description: 'Kategori berhasil dihapus',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus kategori',
        variant: 'destructive',
      });
    }
  };

  const toggleProductPublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await merchandiseProductService.update(id, { is_published: !currentStatus });
      if (response.error) {
        throw new Error(response.error);
      }
      
      setProducts(prev => prev.map(product =>
        product.id === id ? { ...product, is_published: !currentStatus } : product
      ));
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status produk',
        variant: 'destructive',
      });
    }
  };

  const toggleCategoryPublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await merchandiseCategoryService.update(id, { is_published: !currentStatus });
      if (response.error) {
        throw new Error(response.error);
      }
      
      setCategories(prev => prev.map(category =>
        category.id === id ? { ...category, is_published: !currentStatus } : category
      ));
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengubah status kategori',
        variant: 'destructive',
      });
    }
  };

  const approveProduct = async (id: string) => {
    try {
      const response = await merchandiseProductService.approve(id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      const updated = response.data as MerchandiseProduct;
      setProducts(prev => prev.map(product =>
        product.id === id
          ? {
              ...product,
              is_approved: updated.is_approved ?? true,
              is_rejected: updated.is_rejected ?? false,
              reason_rejected: '',
            }
          : product
      ));
      
      toast({
        title: 'Berhasil',
        description: 'Produk disetujui',
      });
    } catch (error) {
      console.error('Error approving product:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyetujui produk',
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
        title: 'Alasan diperlukan',
        description: 'Silakan masukkan alasan penolakan',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRejectSubmitting(true);
      const response = await merchandiseProductService.reject(rejectingId, trimmedReason);
      if (response.error) {
        throw new Error(response.error);
      }

      const updated = response.data as MerchandiseProduct;
      setProducts(prev => prev.map(product =>
        product.id === rejectingId
          ? {
              ...product,
              is_approved: updated.is_approved ?? false,
              is_rejected: updated.is_rejected ?? true,
              reason_rejected: updated.reason_rejected ?? trimmedReason,
            }
          : product
      ));

      toast({
        title: 'Berhasil',
        description: 'Produk ditolak',
      });
      closeRejectDialog();
    } catch (error) {
      console.error('Error rejecting product:', error);
      toast({
        title: 'Error',
        description: 'Gagal menolak produk',
        variant: 'destructive',
      });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Merchandise</h2>
          <p className="text-muted-foreground">
            Kelola produk dan kategori merchandise museum
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <Package className="w-4 h-4 mr-2 inline" />
            Produk
          </button>
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag className="w-4 h-4 mr-2 inline" />
            Kategori
          </button>
        </div>
      </div>

      <RejectReasonDialog
        open={rejectDialogOpen}
        reason={rejectReason}
        loading={rejectSubmitting}
        onReasonChange={(value) => setRejectReason(value)}
        onSubmit={submitReject}
        onClose={closeRejectDialog}
        title="Tolak Produk"
        description="Berikan alasan penolakan produk ini"
      />

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Daftar Produk</h3>
              <p className="text-muted-foreground">
                Kelola produk merchandise museum
              </p>
            </div>
            
            <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
              <DialogTrigger asChild>
                {userRole !== "approver" && userRole !== "viewer" ? (
                  <Button
                    onClick={() => {
                      setEditingProduct(emptyProduct);
                      setShowProductDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Produk
                  </Button>
                ) : null}
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct?.id ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    Isi informasi produk merchandise
                  </DialogDescription>
                </DialogHeader>
                
                {editingProduct && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Produk</Label>
                        <Input
                          id="name"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct(prev => ({ ...prev, name: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Harga</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="short_description">Deskripsi Singkat</Label>
                      <Input
                        id="short_description"
                        value={editingProduct.short_description || ''}
                        onChange={(e) =>
                          setEditingProduct(prev => ({ ...prev, short_description: e.target.value }))
                        }
                        placeholder="Deskripsi singkat untuk tampilan card"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi Lengkap</Label>
                      <textarea
                        id="description"
                        value={editingProduct.description || ''}
                        onChange={(e) =>
                          setEditingProduct(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Deskripsi lengkap produk"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_id">Kategori</Label>
                      <Select
                        value={editingProduct.category_id || ''}
                        onValueChange={(value) =>
                          setEditingProduct(prev => ({ ...prev, category_id: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id!}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                      <Input
                        id="whatsapp_number"
                        value={editingProduct.whatsapp_number || ''}
                        onChange={(e) =>
                          setEditingProduct(prev => ({ ...prev, whatsapp_number: e.target.value }))
                        }
                        placeholder="Contoh: 6281234567890"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Gambar Produk</Label>
                      <ImageUpload
                        label="Upload Gambar Produk"
                        value={editingProduct.images[0] || ''}
                        onChange={(url) => {
                          if (url) {
                            setEditingProduct(prev => ({
                              ...prev,
                              images: [url, ...prev.images.slice(1)]
                            }));
                          }
                        }}
                        bucket="merchandise"
                      />
                      <p className="text-sm text-muted-foreground">
                        Gambar pertama akan digunakan sebagai gambar utama
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_published"
                        checked={editingProduct.is_published}
                        onCheckedChange={(checked) =>
                          setEditingProduct(prev => ({ ...prev, is_published: checked }))
                        }
                      />
                      <Label htmlFor="is_published">Publikasikan</Label>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowProductDialog(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => editingProduct && saveProduct(editingProduct)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingProduct?.id ? 'Perbarui' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant={product.is_published ? 'default' : 'secondary'}>
                          {product.is_published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant={product.is_approved ? 'success' : product.is_rejected ? 'destructive' : 'secondary'}>
                          {product.is_approved ? 'Approved' : product.is_rejected ? 'Rejected' : 'Pending'}
                        </Badge>
                      </div>
                      <CardDescription>{product.short_description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatPrice(product.price)}</span>
                        {product.category && (
                          <span>Kategori: {product.category.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={product.is_published}
                        onCheckedChange={() => toggleProductPublished(product.id!, product.is_published)}
                      />
                      {(userRole === 'super-admin' || userRole === 'approver') && !product.is_approved && !product.is_rejected ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => approveProduct(product.id!)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openRejectDialog(product.id!)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : null}
                      {userRole !== "approver" && userRole !== "viewer" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductDialog(true);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProduct(product.id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  )}
                  {product.images.length > 0 && (
                    <div className="flex gap-2">
                      {product.images.slice(0, 3).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                      {product.images.length > 3 && (
                        <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                          +{product.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                  {product.is_rejected && product.reason_rejected?.trim() && (
                    <div className="mt-4 text-sm">
                      <span className="font-medium">Alasan Penolakan: </span>
                      <p className="text-muted-foreground">{product.reason_rejected}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {products.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Belum ada produk
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Mulai dengan menambahkan produk merchandise pertama Anda.
                  </p>
                  {userRole !== "approver" && userRole !== "viewer" && (
                    <Button
                      onClick={() => {
                        setEditingProduct(emptyProduct);
                        setShowProductDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Produk
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">Daftar Kategori</h3>
              <p className="text-muted-foreground">
                Kelola kategori merchandise
              </p>
            </div>
            
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogTrigger asChild>
                {userRole !== "approver" && userRole !== "viewer" ? (
                  <Button
                    onClick={() => {
                      setEditingCategory(emptyCategory);
                      setShowCategoryDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Kategori
                  </Button>
                ) : null}
              </DialogTrigger>
              
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory?.id ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    Isi informasi kategori merchandise
                  </DialogDescription>
                </DialogHeader>
                
                {editingCategory && (
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="category_name">Nama Kategori</Label>
                      <Input
                        id="category_name"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory(prev => ({ ...prev, name: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_description">Deskripsi</Label>
                      <textarea
                        id="category_description"
                        value={editingCategory.description || ''}
                        onChange={(e) =>
                          setEditingCategory(prev => ({ ...prev, description: e.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Deskripsi kategori"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Gambar Kategori</Label>
                      <ImageUpload
                        label="Upload Gambar Kategori"
                        value={editingCategory.image_url || ''}
                        onChange={(url) => setEditingCategory(prev => ({ ...prev, image_url: url }))}
                        bucket="merchandise"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="category_published"
                        checked={editingCategory.is_published}
                        onCheckedChange={(checked) =>
                          setEditingCategory(prev => ({ ...prev, is_published: checked }))
                        }
                      />
                      <Label htmlFor="category_published">Publikasikan</Label>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCategoryDialog(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => editingCategory && saveCategory(editingCategory)}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {editingCategory?.id ? 'Perbarui' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant={category.is_published ? 'default' : 'secondary'}>
                          {category.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      {category.description && (
                        <CardDescription>{category.description}</CardDescription>
                      )}
                    </div>
                    {userRole !== "approver" && userRole !== "viewer" && (
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.is_published}
                          onCheckedChange={() => toggleCategoryPublished(category.id!, category.is_published)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryDialog(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCategory(category.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {category.image_url && (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <div className="text-sm text-muted-foreground">
                    {products.filter(p => p.category_id === category.id).length} produk
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {categories.length === 0 && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Tag className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Belum ada kategori
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Mulai dengan menambahkan kategori merchandise pertama Anda.
                  </p>
                  {userRole !== "approver" && userRole !== "viewer" && (
                    <Button
                      onClick={() => {
                        setEditingCategory(emptyCategory);
                        setShowCategoryDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Kategori
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchandiseManagement;