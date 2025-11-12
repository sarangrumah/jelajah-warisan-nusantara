// Test script to diagnose email service issues
import nodemailer from 'nodemailer';

async function testEmailService() {
  console.log('🔍 Testing Email Service Configuration...\n');
  
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  console.log('📧 SMTP Configuration:');
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   User: ${user}`);
  console.log(`   From: ${fromEmail}`);
  console.log(`   Password: ${pass ? '*** (set)' : '❌ NOT SET'}`);
  
  if (!host || !user || !pass) {
    console.log('\n❌ SMTP configuration incomplete!');
    console.log('   Please check your backend/.env file');
    return;
  }

  console.log('\n🔧 Creating transporter...');
  
  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    console.log('✅ Transporter created successfully');
    
    // Test connection
    console.log('\n🔌 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    // Test sending email
    console.log('\n📤 Testing email sending...');
    const testEmail = {
      from: `"Test" <${fromEmail}>`,
      to: 'test@example.com',
      subject: 'Test Email from Museum System',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration.</p>'
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    
  } catch (error) {
    console.log('\n❌ Email service test failed:');
    console.log(`   Error: ${error.message}`);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Common Solutions:');
      console.log('   1. Check if the email password is correct');
      console.log('   2. For Gmail: Enable "Less secure app access" or use App Password');
      console.log('   3. Check if port 587 is blocked by firewall');
      console.log('   4. Verify SMTP host supports TLS/STARTTLS');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Common Solutions:');
      console.log('   1. Check SMTP host and port');
      console.log('   2. Verify internet connection');
      console.log('   3. Check firewall settings');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Common Solutions:');
      console.log('   1. Check SMTP host name');
      console.log('   2. Verify DNS resolution');
    }
  }
}

// Run the test
testEmailService();