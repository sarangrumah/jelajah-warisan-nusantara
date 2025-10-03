import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { defaultAssets } from '@/../database/default-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const collectionImages = import.meta.glob('../assets/images/*', { eager: true });
const PLACEHOLDER_IMAGE = '/placeholder.svg';
function getAssetImageUrl(filename: string) {
  if (
    typeof filename === 'string' &&
    (filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('/assets/'))
  ) {
    return filename;
  }
//   Try to resolve using Vite's import
  const match = Object.entries(collectionImages).find(([path]) => path.endsWith(filename));
  return match ? (match[1] as { default: string }).default : PLACEHOLDER_IMAGE;
}
const PemanfaatanAset = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterArea, setFilterArea] = useState([]);
    const [filterFacilities, setFilterFacilities] = useState([]);
    const { pathname } = useLocation();
    const [assets, setAssets] = useState([]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        setAssets(defaultAssets);
    }, []);

    const filteredAssets = assets.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        if (filterArea.length > 0 && filterFacilities.length === 0) {
            return matchesSearch && filterArea.includes(item.area);
        } else if(filterFacilities.length > 0 && filterArea.length === 0) {
            return matchesSearch && filterFacilities.some(facility => item.facilities.includes(facility));
        } else if(filterFacilities.length > 0 && filterArea.length > 0) {
            return matchesSearch && filterArea.includes(item.area) && filterFacilities.some(facility => item.facilities.includes(facility));
        } else {
            return matchesSearch
        }
    });

    const handleAreasChange = (value, isChecked) => {
        if (isChecked) {
            setFilterArea((prevFilters) => [...prevFilters, value]);
        } else {
            setFilterArea((prevFilters) => prevFilters.filter((area) => area !== value));
        }
    };

    const handleFacilitiesChange = (value, isChecked) => {
        if (isChecked) {
            setFilterFacilities((prevFilters) => [...prevFilters, value]);
        } else {
            setFilterFacilities((prevFilters) => prevFilters.filter((facility) => facility !== value));
        }
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
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                        <Input
                        placeholder={t('filter.pemanfaatanAset.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="flex gap-5">
                    <div className='w-1/4'>
                        <div className='pb-5'>
                            <span>Area</span>
                            <div className='flex flex-col gap-2 mt-2'>
                                <div className='flex gap-2'>
                                    <Checkbox 
                                        id='indoor' 
                                        value='indoor' 
                                        checked={filterArea.includes('indoor')}
                                        onCheckedChange={(isChecked) => handleAreasChange('indoor', isChecked)}
                                    />
                                    <Label htmlFor='indoor'>Indoor</Label>
                                </div>
                                <div className='flex gap-2'>
                                    <Checkbox
                                        id='outdoor' 
                                        value='outdoor' 
                                        checked={filterArea.includes('outdoor')}
                                        onCheckedChange={(isChecked) => handleAreasChange('outdoor', isChecked)}
                                    />
                                    <Label htmlFor='outdoor'>Outdoor</Label>
                                </div>
                                <div className='flex gap-2'>
                                    <Checkbox 
                                        id='semi-outdoor' 
                                        value='semi-outdoor' 
                                        checked={filterArea.includes('semi-outdoor')}
                                        onCheckedChange={(isChecked) => handleAreasChange('semi-outdoor', isChecked)}
                                    />
                                    <Label htmlFor='semi-outdoor'>Semi Outdoor</Label>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='pt-5'>
                            <span>Fasilitas</span>
                            <div className='flex flex-col gap-2 mt-2'>
                                <div className='flex gap-2'>
                                    <Checkbox 
                                        id='jasa-fotografi' 
                                        value='jasa-fotografi' 
                                        checked={filterFacilities.includes('jasa-fotografi')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('jasa-fotografi', isChecked)}
                                    />
                                    <Label htmlFor='jasa-fotografi'>Jasa Fotografi</Label>
                                </div>
                                <div className='flex gap-2'>
                                    <Checkbox 
                                        id='sound-system' 
                                        value='sound-system' 
                                        checked={filterFacilities.includes('sound-system')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('sound-system', isChecked)}
                                    />
                                    <Label htmlFor='sound-system'>Sound System</Label>
                                </div>
                                <div className='flex gap-2'>
                                    <Checkbox 
                                        id='lighting-system' 
                                        value='lighting-system' 
                                        checked={filterFacilities.includes('lighting-system')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('lighting-system', isChecked)}
                                    />
                                    <Label htmlFor='lighting-system'>Lighting System</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Checkbox 
                                        id='sewa-perlengkapan' 
                                        value='sewa-perlengkapan' 
                                        checked={filterFacilities.includes('sewa-perlengkapan')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('sewa-perlengkapan', isChecked)}
                                    />
                                    <Label htmlFor='sewa-perlengkapan'>Sewa Perlengkapan</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Checkbox 
                                        id='sewa-transportasi' 
                                        value='sewa-transportasi' 
                                        checked={filterFacilities.includes('sewa-transportasi')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('sewa-transportasi', isChecked)}
                                    />
                                    <Label htmlFor='sewa-transportasi'>Sewa Transportasi</Label>
                                </div>
                                <div className="flex gap-2">
                                    <Checkbox 
                                        id='alat-berat' 
                                        value='alat-berat' 
                                        checked={filterFacilities.includes('alat-berat')}
                                        onCheckedChange={(isChecked) => handleFacilitiesChange('alat-berat', isChecked)}
                                    />
                                    <Label htmlFor='alat-berat'>Alat Berat</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-3/4 pe-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
                            {filteredAssets.map((item) => (
                                <Link 
                                key={item.id} 
                                to={`/pemanfaatan-aset/${item.id}`}
                                >
                                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                                        <div className="aspect-video overflow-hidden rounded-t-lg pt-5">
                                        <img
                                            src={(getAssetImageUrl(item.imageUrl?.split('/').pop() || item.imageUrl))}
                                            alt={item.title}
                                            className="w-full h-full object-contain object-center"
                                        />
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="text-lg">
                                                {item.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {item.description}
                                            </CardDescription>
                                            <div className='text-[#86807c] font-normal mt-2 flex flex-col gap-2'>
                                                <div>{`Lokasi : ${item.location}`}</div>
                                                <div>{`Kategori : ${item.category}`}</div>
                                                <div>{`Area : ${item.area}`}</div>
                                                <span>Fasilitas</span>
                                                <div className='px-5 py-2 border rounded-md'>
                                                    <ul>
                                                    {item.facilities.length > 0 && item.facilities.map((facility, index) => (
                                                        <li key={index} className='py-2 text-[1rem] text-[#86807c] font-normal leading-none'>{`${facility}`}</li>
                                                        ))}
                                                    </ul>    
                                                </div>
                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <MapPin />
                                                        <span className='text-lg font-normal leading-none'>{`${item.shortLocation}`}</span>
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

                {assets.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                        {t('No memories found. Try adjusting your search or filter.')}
                        </p>
                    </div>
                )}
            </section>
            <Footer />
        </div>
    )
}

export default PemanfaatanAset