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

  async execute(to: string, subject: string, variables: object, path: string) {
   
    const templateFileContent = fs.readFileSync(path).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse(variables);

    console.log('client is', this.client);
    const message = await this.client.sendMail({
      from: '"NPS João" <noreply@nps.com>', 
      to,
      subject,
      html: html,
    });

    console.log('Message sent: %s', message.messageId);
    const messageSended = nodemailer.getTestMessageUrl(message);
    console.log('Preview URL: %s', messageSended);
    return messageSended;
  }
}

export default new SendEmailService;