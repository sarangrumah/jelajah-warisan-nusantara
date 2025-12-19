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
    const response = await contentService.getAll();
    
    if (response.error) {
      throw new Error(response.error);
    }

    const companies = response.data as CompanyProfile[];
    
    // Find the first active and approved company profile
    const activeCompany = companies.find(company => 
      company.is_active === true && company.is_approved === true
    );

    if (activeCompany) {
      return {
        orgName: activeCompany.name || 'Museum dan Cagar Budaya',
        ministry: activeCompany.brand || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
        phone: activeCompany.phone || '+62 21 12345678',
        email: activeCompany.email || 'info@museumbudaya.go.id',
        address: activeCompany.address || 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110',
        website: activeCompany.website
      };
    }

    // Fallback to default values if no active company profile found
    return {
      orgName: 'Museum dan Cagar Budaya',
      ministry: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
      phone: '+62 21 12345678',
      email: 'info@museumbudaya.go.id',
      address: 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110'
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    
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
    
    // Find the first active and approved company profile
    const activeCompany = companies.find(company => 
      company.is_active === true && company.is_approved === true
    );

    return activeCompany || null;
  } catch (error) {
    console.error('Error fetching active company profile:', error);
    return null;
  }
};