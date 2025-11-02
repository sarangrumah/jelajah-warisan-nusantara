import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, MapPin, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Select as Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categoriesLayananAsetArea, categoriesLayananAsetFasilitas, pemanfaatanAssetService } from '@/lib/api-services';
import { ImageCarousel } from '@/components/ui/image-carousel';

import { assetUrl } from '@/lib/asset-url';
const PLACEHOLDER_IMAGE = '/placeholder.svg';

function extractImagePaths(imageData: any): string[] {
  if (!imageData) {return [PLACEHOLDER_IMAGE]};
  
  // Handle JSON string arrays
  if (typeof imageData === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(imageData);
      if (Array.isArray(parsed)) {
        return parsed.map(item => {
          if (typeof item === 'string') {
            // Check if it's a UUID filename (no slashes, contains UUID pattern)
            if (!item.includes('/') && item.includes('-')) {
              return `/uploads/images/${item}`;
            }
            return item.startsWith('/uploads/') ? item : assetUrl(item) || PLACEHOLDER_IMAGE;
          }
          return PLACEHOLDER_IMAGE;
        }).filter(Boolean);
      }
    } catch (error) {
      // If parsing fails, treat as single string
      // Check if it's a UUID filename (no slashes, contains UUID pattern)
      console.error(error);
      if (!imageData.includes('/') && imageData.includes('-')) {
        return [`/uploads/images/${imageData}`];
      }
      return [imageData.startsWith('/uploads/') ? imageData : assetUrl(imageData) || PLACEHOLDER_IMAGE];
    }
  }
  
  // If it's an array, process all images
  if (Array.isArray(imageData)) {
    return imageData.map(item => {
      if (typeof item === 'string') {
        // Check if it's a UUID filename (no slashes, contains UUID pattern)
        if (!item.includes('/') && item.includes('-')) {
          return `/uploads/images/${item}`;
        }
        return item.startsWith('/uploads/') ? item : assetUrl(item) || PLACEHOLDER_IMAGE;
      }
      if (item && typeof item === 'object' && item.path) {
        const path = item.path;
        // Check if it's a UUID filename (no slashes, contains UUID pattern)
        if (!path.includes('/') && path.includes('-')) {
          return `/uploads/images/${path}`;
        }
        return path.startsWith('/uploads/') ? path : assetUrl(path) || PLACEHOLDER_IMAGE;
      }
      return PLACEHOLDER_IMAGE;
    }).filter(Boolean);
  }
  
  // If it's an object with path property
  if (imageData && typeof imageData === 'object' && imageData.path) {
    const path = imageData.path;
    // Check if it's a UUID filename (no slashes, contains UUID pattern)
    if (!path.includes('/') && path.includes('-')) {
      return [`/uploads/images/${path}`];
    }
    return [path.startsWith('/uploads/') ? path : assetUrl(path) || PLACEHOLDER_IMAGE];
  }
  
  return [PLACEHOLDER_IMAGE];
}
const PemanfaatanAset = () => {
	const { t } = useTranslation();
	const [searchTerm, setSearchTerm] = useState('');
	const [filterType, setFilterType] = useState('');
    const [categories, setCategories] = useState([]);
    const [filterCategories, setFilterCategories] = useState([]);
	const { pathname } = useLocation();
	const [assets, setAssets] = useState([]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const [assetsResponse, areaResponse, fasilitasResponse] = await Promise.all([
                    pemanfaatanAssetService.getAll(),
                    categoriesLayananAsetArea.getAllCategories(),
                    categoriesLayananAsetFasilitas.getAllCategories()
                ])
                if(assetsResponse.error || areaResponse.error || fasilitasResponse.error) {
                    console.error('Error fetching one or more categories:', areaResponse.error || fasilitasResponse.error);
                } else {
                    const combinedCategories = [
                        {label:'Area', items: areaResponse.data},
                        {label:'Fasilitas', items: fasilitasResponse.data}
                    ]
                    setCategories(combinedCategories);
                    setAssets(assetsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchAllCategories();
    }, []);

    const filteredAssets = assets.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filterCategories.length === 0) {
            return matchesSearch;
        }

        // Check if item matches any of the selected filters
        const matchesFilters = filterCategories.some(filter => {
            // Check if filter matches area (by name)
            const areaCategory = categories.find(cat => cat.label === 'Area');
            if (areaCategory) {
                const areaItem = areaCategory.items.find(area => area.name === filter);
                if (areaItem && item.area === areaItem.id) {
                    return true;
                }
            }
            
            // Check if filter matches any facility (by name)
            const fasilitasCategory = categories.find(cat => cat.label === 'Fasilitas');
            if (fasilitasCategory) {
                const fasilitasItem = fasilitasCategory.items.find(facility => facility.name === filter);
                if (fasilitasItem) {
                    let fasilitasData = item.fasilitas;
                    if (typeof fasilitasData === 'string') {
                        try {
                            fasilitasData = JSON.parse(fasilitasData);
                        } catch (error) {
                            console.error('Error parsing fasilitas JSON:', error);
                        }
                    }
                    
                    if (Array.isArray(fasilitasData) && fasilitasData.includes(fasilitasItem.id)) {
                        return true;
                    }
                }
            }
            
            return false;
        });

        return matchesSearch && matchesFilters;
    });

    const handleFilterTypeChange = (filterType) => {
        const item = categories
            .flatMap((category) => category.items)
            .find((item) => item.id === filterType);
            if (item && !filterCategories.includes(item.name)) {
            setFilterType(filterType)
            // setFilterType('');
            setFilterCategories((prevFilters) => [...prevFilters, item.name]);
        }
    }

    const deleteFilter = (filter) => {
        setFilterCategories((prevFilters) => {
            const updatedFilters = prevFilters.filter((category) => category !== filter);
            if (updatedFilters.length > 0) {
                const lastItem = updatedFilters[updatedFilters.length - 1];
                const itemId = categories
                    .flatMap((category) => category.items)
                    .find((item) => item.name === lastItem)?.id;
                setFilterType(itemId);
            } else {
                setFilterType('');
            }
            return updatedFilters;
        });
    }

    // Helper function to get category name by ID
    const getCategoryNameById = (id, categoryType) => {
        const category = categories.find(cat => cat.label === categoryType);
        if (category) {
            const item = category.items.find(item => item.id === id);
            return item ? item.name : id;
        }
        return id;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            {/* Hero Banner */}
            <section className="relative py-20 h-80 from-primary to-primary-glow flex items-center justify-center">
                <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {t('pemanfaatanAset.title')}
                </h1>
                <p className="text-xl">
                    {t('pemanfaatanAset.subtitle')}
                </p>
                </div>
            </section>
            {/* Search and Filter */}
            <section className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                        placeholder={t('filter.pemanfaatanAset.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                    <Select
                        value={filterType} 
                        onValueChange={handleFilterTypeChange}
                    >
                        <SelectTrigger className="w-full md:w-48">
                            <Filter size={20} className="mr-2" />
                            <SelectValue placeholder={'Semua'} />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((option) => (
                                <SelectGroup key={option.label}>
                                    <SelectLabel className='bg-background ps-0 py-3'>
                                        <span className='ms-3'>{option.label}</span>
                                    </SelectLabel>
                                    <div className='py-3'>
                                        {option.items.map((item) => (
                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                        ))}
                                    </div>
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex mt-2 gap-3'>
                    {filterCategories.map((filter, index) => (
                        <Badge key={index} variant="secondary" className='items-center gap-1'>
                            {filter}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-auto w-auto p-0 ml-1 rounded-full text-foreground/50 hover:text-foreground hover:bg-transparent"
                                onClick={() => deleteFilter(filter)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>

                {/* Results */}
                <div className="flex gap-5 mt-8">
                    <div className='px-5'>
                        <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-5'>
                            {filteredAssets.map((item) => (
                                <Link
                                key={item.id}
                                to={`/pemanfaatan-aset/${item.id}`}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        <div className="aspect-video overflow-hidden rounded-t-lg">
                                            <ImageCarousel
                                                images={extractImagePaths(item.image_url)}
                                                autoSlide={true}
                                                autoSlideInterval={3000}
                                                showControls={false}
                                                showDots={true}
                                                className="h-full"
                                            />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {item.title}
                                            </CardTitle>
                                            {/* <CardDescription>
                                                {item.description}
                                            </CardDescription> */}
                                            <div className='text-[#86807c] font-normal mt-2 flex flex-col gap-2'>
                                                <div>{`Lokasi : ${item.location}`}</div>
                                                    <div>{`Kategori : ${getCategoryNameById(item.category, 'Fasilitas')}`}</div>
                                                    <div>{`Area : ${getCategoryNameById(item.area, 'Area')}`}</div>
                                                <span>Fasilitas</span>
                                                <div className='px-5 py-2 border rounded-md'>
                                                    <ul>
                                                    {(() => {
                                                        let fasilitasData = item.fasilitas;
                                                        
                                                        // Handle JSON string
                                                        if (fasilitasData && typeof fasilitasData === 'string') {
                                                            try {
                                                                fasilitasData = JSON.parse(fasilitasData);
                                                            } catch (error) {
                                                                console.error('Error parsing fasilitas JSON:', error);
                                                            }
                                                        }
                                                        
                                                        if (fasilitasData && typeof fasilitasData === 'object' && fasilitasData.content) {
                                                            return (
                                                                <div
                                                                    className="text-[1rem] text-[#86807c] font-normal leading-none"
                                                                    dangerouslySetInnerHTML={{ __html: fasilitasData.content }}
                                                                />
                                                            );
                                                        } else if (Array.isArray(fasilitasData) && fasilitasData.length > 0) {
                                                            return fasilitasData.map((facilityId, index) => {
                                                                const facilityName = getCategoryNameById(facilityId, 'Fasilitas');
                                                                return (
                                                                    <li key={index} className='py-2 text-[1rem] text-[#86807c] font-normal leading-none'>{facilityName}</li>
                                                                );
                                                            });
                                                        }
                                                        return null;
                                                    })()}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <MapPin />
                                                        <span className='text-lg font-normal leading-none'>{`${item.short_location}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {(assets.length === 0 || filteredAssets.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                        {t('pemanfaatanAset.noData')}
                        </p>
                    </div>
                )}
            </section>
            <Footer />
        </div>
    )
}

export default PemanfaatanAset