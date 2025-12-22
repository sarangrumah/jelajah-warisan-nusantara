// Debug script to check why Museum Majapahit is not showing
// This will help identify the issue in the data fetching and mapping process

import { apiClient } from './src/lib/api-client.js';

async function debugMuseumDisplay() {
    console.log('🔍 Debugging Museum Display Issue...\n');
    
    try {
        // Step 1: Check raw API response
        console.log('1. Fetching raw museum data...');
        const rawResponse = await apiClient.getAll('tb_sites', { limit: 1000 });
        
        if (rawResponse.error) {
            console.error('❌ Error fetching museums:', rawResponse.error);
            return;
        }
        
        console.log('✅ Raw API response received');
        console.log('📊 Total museums in database:', rawResponse.data?.length || 0);
        
        // Step 2: Check if Museum Majapahit exists in raw data
        const majapahitMuseum = rawResponse.data?.find(museum => 
            museum.name?.toLowerCase().includes('majapahit') ||
            museum.title?.toLowerCase().includes('majapahit') ||
            museum.description?.toLowerCase().includes('majapahit')
        );
        
        if (majapahitMuseum) {
            console.log('\n🎯 Found Museum Majapahit in raw data:');
            console.log('Raw Museum data:', JSON.stringify(majapahitMuseum, null, 2));
        } else {
            console.log('\n❌ Museum Majapahit NOT found in raw database data');
            console.log('📋 All museum names in database:');
            rawResponse.data?.forEach((museum, index) => {
                console.log(`${index + 1}. ${museum.name || museum.title || 'NO NAME'} (ID: ${museum.id})`);
            });
            return;
        }
        
        // Step 3: Simulate the mapping process from MuseumManagement.tsx
        console.log('\n🔄 Simulating frontend mapping process...');
        
        const mappedMuseums = (rawResponse.data || []).map(m => ({
            ...m,
            // Map images relation to gallery_images
            gallery_images: m.images?.map((img) => ({ path: img.path, sites: m.id })) || [],
            // Map flat fields to contact_info
            contact_info: {
                phone: m.phone || '',
                email: '', // Not supported in DB
                website: m.website || ''
            },
            // Map is_active to is_published
            is_published: m.is_active,
            is_approved: m.is_approved,
            is_rejected: m.is_rejected,
            reason_rejected: m.reason_rejected,
            // Ensure type is handled (it's a UUID)
            type: m.type_relation?.id || m.type,
            // Map location from subtitle if location is missing in DB
            location: m.location || m.subtitle || ''
        }));
        
        console.log('✅ Mapping completed');
        console.log('📊 Mapped museums count:', mappedMuseums.length);
        
        // Step 4: Check if Museum Majapahit survived the mapping
        const mappedMajapahit = mappedMuseums.find(museum => 
            museum.name?.toLowerCase().includes('majapahit') ||
            museum.title?.toLowerCase().includes('majapahit')
        );
        
        if (mappedMajapahit) {
            console.log('\n🎯 Museum Majapahit survived mapping:');
            console.log('Mapped Museum data:', JSON.stringify(mappedMajapahit, null, 2));
        } else {
            console.log('\n❌ Museum Majapahit was filtered out during mapping!');
            console.log('This suggests there might be a filtering condition in the mapping that removed it.');
        }
        
        // Step 5: Check museum types
        console.log('\n🏷️ Checking museum types...');
        const typesResponse = await apiClient.getAll('tb_type_sites');
        
        if (typesResponse.data) {
            console.log('Available museum types:');
            typesResponse.data.forEach(type => {
                console.log(`- ${type.name} (ID: ${type.id})`);
            });
            
            if (majapahitMuseum) {
                console.log('\n🔍 Museum Majapahit type analysis:');
                console.log('Original type field:', majapahitMuseum.type);
                console.log('Mapped type field:', majapahitMuseum.type_relation?.id || majapahitMuseum.type);
                
                const typeMatch = typesResponse.data.find(t => t.id === (majapahitMuseum.type_relation?.id || majapahitMuseum.type));
                console.log('Type match found:', !!typeMatch);
                if (typeMatch) {
                    console.log('Matched type name:', typeMatch.name);
                }
            }
        }
        
        // Step 6: Check for any filtering conditions
        console.log('\n🔍 Checking for potential filtering issues...');
        
        if (majapahitMuseum) {
            console.log('Museum status analysis:');
            console.log('- is_active:', majapahitMuseum.is_active);
            console.log('- is_approved:', majapahitMuseum.is_approved);
            console.log('- is_rejected:', majapahitMuseum.is_rejected);
            console.log('- has images:', !!majapahitMuseum.images);
            console.log('- images count:', majapahitMuseum.images?.length || 0);
        }
        
    } catch (error) {
        console.error('❌ Error during debugging:', error);
    }
}

// Run the debug
debugMuseumDisplay().then(() => {
    console.log('\n🏁 Debugging completed');
    process.exit(0);
}).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});