import { contentService } from './api-services';

export interface CompanyProfile {
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
  is_rejected?: boolean;
  reason_rejected?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface FooterCompanyData {
  orgName: string;
  ministry: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
}

/**
 * Get company profile data for footer display
 * Returns the first active and approved company profile, or falls back to defaults
 */
export const getFooterCompanyData = async (): Promise<FooterCompanyData> => {
  try {
    console.log('🔍 Fetching company profile data...');
    const response = await contentService.getAll();
    console.log('📡 API Response:', response);
    
    if (response.error) {
      console.error('❌ API Error:', response.error);
      // Still try to use the response data even if there's an error
    }

    const companies = response.data as CompanyProfile[];
    console.log('📋 Companies found:', companies);
    
    if (!companies || companies.length === 0) {
      console.log('⚠️ No companies found in response, using defaults');
      return {
        orgName: 'Museum dan Cagar Budaya',
        ministry: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
        phone: '+62 21 12345678',
        email: 'info@museumbudaya.go.id',
        address: 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110'
      };
    }
    
    // Use the first available company (since is_active/is_approved fields aren't returned)
    const activeCompany = companies[0];
    console.log('🔄 Using first available company...');
    
    console.log('✅ Using company:', activeCompany);

    if (activeCompany) {
      // Clean HTML tags from address
      const cleanAddress = activeCompany.address ? 
        activeCompany.address.replace(/<[^>]*>/g, '').trim() : 
        'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110';
      
      const result = {
        orgName: activeCompany.name || 'Museum dan Cagar Budaya',
        ministry: activeCompany.brand || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
        phone: activeCompany.phone || '+62 21 12345678',
        email: activeCompany.email || 'info@museumbudaya.go.id',
        address: cleanAddress,
        website: activeCompany.website
      };
      console.log('🎯 Final result:', result);
      return result;
    }

    // Final fallback
    console.log('⚠️ No company available, using hardcoded defaults');
    return {
      orgName: 'Museum dan Cagar Budaya',
      ministry: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
      phone: '+62 21 12345678',
      email: 'info@museumbudaya.go.id',
      address: 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110'
    };
  } catch (error) {
    console.error('💥 Error fetching company profile:', error);
    
    // Return default values on error
    return {
      orgName: 'Museum dan Cagar Budaya',
      ministry: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
      phone: '+62 21 12345678',
      email: 'info@museumbudaya.go.id',
      address: 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110'
    };
  }
};

/**
 * Get the first active company profile (for general use)
 */
export const getActiveCompanyProfile = async (): Promise<CompanyProfile | null> => {
  try {
    const response = await contentService.getAll();
    
    if (response.error) {
      throw new Error(response.error);
    }

    const companies = response.data as CompanyProfile[];
    
    // Return the first available company
    return companies[0] || null;
  } catch (error) {
    console.error('Error fetching active company profile:', error);
    return null;
  }
};