#!/usr/bin/env node

/**
 * Debug script to check museum data and identify why museums aren't appearing
 */

console.log('🔍 Debugging Museum Data Flow...\n');

console.log('📋 Step 1: Check API Service Configuration');
console.log('   museumService.getPublished() should return:');
console.log('   - Only museums with is_approved=true AND is_active=true');
console.log('   - From tb_sites table');
console.log('   - With related type and category data\n');

console.log('📋 Step 2: Frontend Filtering Logic');
console.log('   Museum.tsx has TWO filtering stages:');
console.log('   Stage 1: API-level filtering (lines 61-66)');
console.log('     - museum.is_active === true');
console.log('     - museum.is_approved === true');
console.log('   Stage 2: Type-based filtering (lines 114-119)');
console.log('     - museum.type === museumId (where museumId is type with name "museum")\n');

console.log('📋 Step 3: Potential Issues');
console.log('   1. Type ID mismatch:');
console.log('      - museum.type might be a UUID from database');
console.log('      - museumId is found by searching types for name "museum"');
console.log('      - These might not match!\n');
console.log('   2. Data structure issues:');
console.log('      - Museum might not have type_relation populated');
console.log('      - Category filtering might be failing');
console.log('      - Search term might be filtering out results\n');

console.log('📋 Step 4: Debug Console Output');
console.log('   After adding debug logs, check browser console for:');
console.log('   - "DEBUG: Raw API response:" - shows full API response');
console.log('   - "DEBUG: Museum [name] - is_active: [bool], is_approved: [bool]"');
console.log('   - "DEBUG: Found museum type ID:" - shows the type ID being used');
console.log('   - "DEBUG: Type matching - museum.type: [value] museumId: [value] matches: [bool]"');
console.log('   - "DEBUG: Final filtered museums count:" - shows final result\n');

console.log('📋 Step 5: Quick Fix Options');
console.log('   Option A: Disable type filtering temporarily');
console.log('   Option B: Fix type ID matching logic');
console.log('   Option C: Use type_relation.name instead of type ID');
console.log('   Option D: Check if museums are using correct type values\n');

console.log('🧪 Next Steps:');
console.log('1. Check browser console for debug output');
console.log('2. Verify museum.type values in database');
console.log('3. Check if type ID matching is working correctly');
console.log('4. Apply appropriate fix based on findings\n');

console.log('💡 Most Likely Issue:');
console.log('The museum.type field might contain a UUID, while museumId');
console.log('is looking for a type with name "museum". The comparison fails.');
console.log('Solution: Use museum.type_relation?.name === "museum" instead.');