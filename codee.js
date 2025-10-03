i want to send email on emai to onahe emia 

npm install mailersend @react-email/components

import * as React from 'react';
import { Html, Button } from "@react-email/components";

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}




import { render } from '@react-email/components';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { Email } from './email';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

const sentFrom = new Sender("you@yourdomain.com", "Your name");
const recipients = [
  new Recipient("your@client.com", "Your Client")
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject("This is a Subject")
  .setHtml(emailHtml)

await mailerSend.email.send(emailParams);





