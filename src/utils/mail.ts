import nodemailer from "nodemailer";

interface MailOptions {
  link: string;
  to: string;
}
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

const mail = {
  async sendVerificationMail(options: MailOptions) {
    await transport.sendMail({
      to: options.to,
      from: process.env.VERIFICATION_MAIL,
      subject: "Auth Verification",
      html: `
    <div>
    <div>
    <p>please click this <a href="${options.link}"> link</a> to verify your account</p>
    </div>
    </div>
    `,
    });
  },
};

export default mail;
