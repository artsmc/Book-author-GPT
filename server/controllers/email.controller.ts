import { UtilController } from "./util.controller";
import Mailgun = require('mailgun-js');
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });
class EmailController extends UtilController {
    constructor() {
        super();
    }
    sendMessage(template, destination, tag,vars) {
      const data = {
        from: 'Melville Admin <admin@melville.app>',
        to: `${destination}`,
        template: `${template}`,
        'o:tracking-opens': 'yes',
        'o:tag': [`${tag}`],
        'h:X-Mailgun-Variables': JSON.stringify({
          ...{
            siteUrl: process.env.API_HOST, 
          },
          ...{
            email: destination
          },
          ...vars
        })
      };
      mailgun.messages().send(data, (error, body) => {
        if (error) {
          console.log(error);
        }
      });
    }


      
}
export const emailController = new EmailController();