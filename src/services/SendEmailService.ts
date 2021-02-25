import nodemailer, { Transporter } from "nodemailer";

class SendEmailService {
  private client: Transporter;
  constructor() {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    }).catch(err => console.log('error in create test account to send email', err));
  }

  async execute(to: string, subject: string, body: string) {
    console.log('client is', this.client);
    const message = await this.client.sendMail({
      from: '"NPS João" <noreply@nps.com>', 
      to,
      subject,
      html: body,
    });

    console.log('Message sent: %s', message.messageId);
    
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendEmailService;