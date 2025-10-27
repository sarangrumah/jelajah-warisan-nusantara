import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { merchandiseProductService, merchandiseCategoryService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface MerchandiseProduct {
  id: string;
  name: string;
  short_description?: string;
  description?: string;
  price: number;
  category_id?: string;
  images: string[];
  is_published: boolean;
  is_approved?: boolean;
  is_rejected?: boolean;
  whatsapp_number?: string;
  created_at?: string;
  updated_at?: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
}

interface MerchandiseCategory {
  id: string;
  name: string;
  description?: string;
  is_published: boolean;
}

const MerchandiseProductList = () => {
  const [products, setProducts] = useState<MerchandiseProduct[]>([]);
  const [categories, setCategories] = useState<MerchandiseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');

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
        console.error('Error fetching products:', productsResponse.error);
      } else {
        setProducts((productsResponse.data as MerchandiseProduct[]) || []);
      }

      if (categoriesResponse.error) {
        console.error('Error fetching categories:', categoriesResponse.error);
      } else {
        setCategories((categoriesResponse.data as MerchandiseCategory[]) || []);
      }
    } catch (error) {
      console.error('Error fetching merchandise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => 
      product.is_published && product.is_approved && !product.is_rejected
    );

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.short_description?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.name.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyClick = (product: MerchandiseProduct) => {
    const whatsappNumber = product.whatsapp_number || '6281234567890';
    const message = `Halo, saya tertarik dengan produk ${product.name} seharga ${formatPrice(product.price)}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Merchandise Collection</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Temukan berbagai merchandise menarik dari museum kami. Setiap pembelian mendukung pelestarian warisan budaya.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories
                .filter(category => category.is_published)
                .map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nama A-Z</SelectItem>
              <SelectItem value="price-low">Harga Terendah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Tidak ada produk yang sesuai dengan filter Anda.' 
              : 'Belum ada produk merchandise yang tersedia.'}
          </div>
          {(searchQuery || selectedCategory !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => {
            const imageUrl = product.images && product.images.length > 0 
              ? assetUrl(product.images[0]) || '/placeholder.svg'
              : '/placeholder.svg';

            return (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    {product.category && (
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                  {product.short_description && (
                    <CardDescription className="line-clamp-2">
                      {product.short_description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                </CardContent>
                
                <CardFooter className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/merchandise/${product.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      Detail
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleBuyClick(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Beli
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-muted-foreground">
        Menampilkan {filteredAndSortedProducts.length} dari {products.filter(p => p.is_published && p.is_approved && !p.is_rejected).length} produk
      </div>
    </div>
  );
};

export default MerchandiseProductList;