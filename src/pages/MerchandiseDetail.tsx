import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ShoppingCart, Package, Tag, Info } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { merchandiseProductService } from '@/lib/api-services';
import { assetUrl } from '@/lib/asset-url';

interface MerchandiseProduct {
  id: string;
  name: string;
  description?: string;
  short_description?: string;
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

const MerchandiseDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<MerchandiseProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      if (!id) {
        return;
      }
      
      const response = await merchandiseProductService.getById(id);
      if (response.error) {
        console.error('Error fetching product:', response.error);
        setProduct(null);
      } else {
        setProduct(response.data as MerchandiseProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleBuyClick = () => {
    if (!product) {
      return;
    }
    
    const whatsappNumber = product.whatsapp_number || '6281234567890';
    const message = `Halo, saya tertarik dengan produk ${product.name} seharga ${formatPrice(product.price)}. Apakah masih tersedia?`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('merchandise.productNotFound')}</h1>
          <p className="text-muted-foreground mb-8">
            {t('merchandise.productNotFoundMessage')}
          </p>
          <Button asChild>
            <Link to="/merchandise">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('merchandise.backToMerchandise')}
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const mainImage = product.images && product.images.length > 0 
    ? assetUrl(product.images[selectedImageIndex]) || '/placeholder.svg'
    : '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => {
                  const thumbnailUrl = assetUrl(image) || '/placeholder.svg';
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <Badge className="mb-2" variant="secondary">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </div>
              {product.short_description && (
                <p className="text-lg text-muted-foreground mb-6">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="flex-1"
                onClick={handleBuyClick}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('merchandise.buyNow')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1"
                asChild
              >
                <Link to="/merchandise">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  {t('merchandise.backToMerchandise')}
                </Link>
              </Button>
            </div>

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {t('merchandise.productInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Deskripsi</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Package className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('merchandise.category')}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category?.name || t('merchandise.noCategory')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Tag className="text-primary" size={20} />
                    <div>
                      <p className="font-semibold">{t('merchandise.status')}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.is_approved ? t('merchandise.available') : t('merchandise.awaitingApproval')}
                      </p>
                    </div>
                  </div>
                </div>

                {product.whatsapp_number && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">{t('merchandise.contactSeller')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('merchandise.contactSellerMessage', { number: product.whatsapp_number })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('merchandise.purchaseInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {t('merchandise.purchaseInfoItems', { returnObjects: true }).map((item: string, index: number) => (
                  <p key={index}>• {item}</p>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MerchandiseDetail;