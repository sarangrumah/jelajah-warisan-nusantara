import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function fixAdminPassword() {
  console.log('🔧 Fixing super admin password...\n');

  try {
    // Generate correct hash for 'admin123'
    const password = 'admin123';
    const newHash = await bcrypt.hash(password, 12);
    
    console.log('🔑 Generated new password hash for password:', password);
    console.log('🔑 New hash:', newHash.substring(0, 20) + '...');

    // Update the password hash in database
    const result = await query(
      'UPDATE users SET password_hash = $1 WHERE email = $2',
      [newHash, 'superadmin@museumbudaya.go.id']
    );

    if (result.rowCount && result.rowCount > 0) {
      console.log('✅ Password hash updated successfully!');
      
      // Test the new hash
      const userCheck = await query(
        'SELECT password_hash FROM users WHERE email = $1', 
        ['superadmin@museumbudaya.go.id']
      );
      
      if (userCheck.rows.length > 0) {
        const isValid = await bcrypt.compare(password, userCheck.rows[0].password_hash);
        console.log('🧪 Password validation test:', isValid ? '✅ Valid' : '❌ Still Invalid');
      }
    } else {
      console.log('❌ No user updated. User might not exist.');
    }

  } catch (error) {
    console.error('❌ Error fixing password:', error);
  }
}

// Run the fix
fixAdminPassword().then(() => {
  console.log('\n🎉 Password fix completed!');
  process.exit(0);
}).catch(error => {
  console.error('Fix script error:', error);
  process.exit(1);
});