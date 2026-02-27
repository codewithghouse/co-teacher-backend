import nodemailer from 'nodemailer';

export class EmailService {
    private static getTransporter() {
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const isGmail = host.includes('gmail.com');

        const config: any = {
            host: isGmail ? undefined : host,
            service: isGmail ? 'gmail' : undefined,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        };
        return nodemailer.createTransport(config);
    }

    static async sendEmail(to: string, subject: string, body: string, html?: string) {
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;

        console.log(`[EmailService] Attempting to send email. User: ${user ? user : 'NOT SET'}`);

        if (!user || user === 'your_email@gmail.com' || !pass || pass === 'your_app_password_here') {
            console.warn("[EmailService] SMTP credentials are not configured or still using placeholders.");
            return {
                success: false,
                message: "SMTP user/pass is still using placeholders in .env file. Please check line 26 & 27."
            };
        }

        try {
            const transporter = this.getTransporter();
            const info = await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME || 'Co-Teacher AI'}" <${user}>`,
                to,
                subject,
                text: body,
                html: html || body.replace(/\n/g, '<br>'),
            });

            console.log(`[EmailService] Email sent successfully: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error: any) {
            console.error("[EmailService] Error occurred while sending email:", error.message);
            // Don't throw, return success false with message
            return {
                success: false,
                message: `Failed to send email: ${error.message}. Please check if your 'App Password' is correct.`
            };
        }
    }
}
