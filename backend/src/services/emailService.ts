import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.warn('SMTP configuration not found. Email service will not work.');
      return;
    }

    this.transporter = nodemailer.createTransporter({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized. Check SMTP configuration.');
      return false;
    }

    try {
      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
      
      await this.transporter.sendMail({
        from: `"Museum dan Cagar Budaya" <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      console.log(`Password reset email sent successfully to: ${options.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/auth/reset-password/${resetToken}`;

    const subject = 'Reset Password - Museum dan Cagar Budaya';
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            max-width: 120px;
            height: auto;
        }
        .content {
            padding: 30px 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #2563eb; margin: 0;">Museum dan Cagar Budaya</h1>
            <p style="color: #6c757d; margin: 5px 0 0 0;">Sistem Manajemen Konten</p>
        </div>
        
        <div class="content">
            <h2 style="color: #2d3748; margin-bottom: 20px;">Reset Password Anda</h2>
            
            <p>Halo,</p>
            
            <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah ini untuk membuat password baru:</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <p>Atau salin dan tempel link berikut di browser Anda:</p>
            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                ${resetUrl}
            </p>
            
            <div class="warning">
                <strong>Perhatian:</strong> Link ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.
            </div>
            
            <p>Jika Anda mengalami kesulitan atau memiliki pertanyaan, silakan hubungi tim support kami.</p>
            
            <p>Salam hormat,<br>Tim Museum dan Cagar Budaya</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Museum dan Cagar Budaya. Semua hak dilindungi.</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        </div>
    </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  async sendPasswordResetSuccessEmail(email: string): Promise<boolean> {
    const subject = 'Password Berhasil Diubah - Museum dan Cagar Budaya';
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Berhasil Diubah</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #e9ecef;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .success-icon {
            color: #10b981;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #2563eb; margin: 0;">Museum dan Cagar Budaya</h1>
            <p style="color: #6c757d; margin: 5px 0 0 0;">Sistem Manajemen Konten</p>
        </div>
        
        <div class="content">
            <div class="success-icon">✓</div>
            <h2 style="color: #10b981; margin-bottom: 20px;">Password Berhasil Diubah</h2>
            
            <p>Password akun Anda telah berhasil diubah.</p>
            <p>Jika Anda tidak melakukan perubahan ini, segera hubungi tim support kami.</p>
            
            <p>Salam hormat,<br>Tim Museum dan Cagar Budaya</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Museum dan Cagar Budaya. Semua hak dilindungi.</p>
            <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        </div>
    </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();