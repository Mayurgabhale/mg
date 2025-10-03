Hangup (SIGHUP)
  File "Solution.py", line 27
SyntaxError: Non-ASCII character '\xe2' in file Solution.py on line 27, but no encoding declared; see http://python.org/dev/peps/pep-0263/ for details
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

fromaddr = "mayurgabhale709@gmail.com"
toaddr = "codingmayur@gmail.com"

# create message
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = "Subject of the Mail"

# mail body
body = "This is the body of the mail."
msg.attach(MIMEText(body, 'plain'))

# connect to Gmail SMTP server
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()  # secure the connection
server.login(fromaddr, "syhqmnzfmjmqsojh")  # use your App Password

# send email
server.sendmail(fromaddr, toaddr, msg.as_string())
server.quit()

print("✅ Email sent successfully!")
