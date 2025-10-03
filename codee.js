# -*- coding: utf-8 -*-
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

fromaddr = "mayurgabhale709@gmail.com"
toaddr = "codingmayur@gmail.com"

msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = "Subject of the Mail"

body = "This is the body of the mail."
msg.attach(MIMEText(body, 'plain'))

server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login(fromaddr, "syhqmnzfmjmqsojh")

server.sendmail(fromaddr, toaddr, msg.as_string())
server.quit()

print("✅ Email sent successfully!")