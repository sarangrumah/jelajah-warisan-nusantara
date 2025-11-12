// Simple test to check email service
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking environment variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '*** (set)' : '❌ NOT SET');
console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL);

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.log('\n❌ SMTP configuration missing!');
  console.log('Please check your backend/.env file');
} else {
  console.log('\n✅ SMTP configuration found');
  console.log('Try restarting the backend server to load new environment variables');
}