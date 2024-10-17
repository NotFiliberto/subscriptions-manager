import SMTPTransport from "nodemailer/lib/smtp-transport"

export const mailSettings = {
	mail_options: {
		host: "smtp.gmail.com",
		port: 587,
		SMTPAuth: false,
		mail_sender: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS,
		password_sender: process.env.OUTLOOK_EMAIL_PASSWORD,
	},
}

export const smtpOptions: SMTPTransport.Options = {
	host: mailSettings.mail_options.host,
	port: mailSettings.mail_options.port,
	//secure: mailSettings.mail_options.SMTPAuth ? true : false,
	auth: {
		user: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS,
		pass: process.env.OUTLOOK_EMAIL_PASSWORD,
	},
	from: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS,
	envelope: { from: process.env.NEXT_PUBLIC_OUTLOOK_EMAIL_ADDRESS },
}
