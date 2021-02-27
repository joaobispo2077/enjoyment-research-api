import { resolve } from 'path';
import fs from 'fs';
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";

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
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
    const templateFileContent = fs.readFileSync(npsPath).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse({
      name: to,
      title: subject,
      description: body
    });

    console.log('client is', this.client);
    const message = await this.client.sendMail({
      from: '"NPS João" <noreply@nps.com>', 
      to,
      subject,
      html: html,
    });

    console.log('Message sent: %s', message.messageId);
    
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendEmailService;