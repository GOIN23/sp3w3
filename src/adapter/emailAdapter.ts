import nodemailer from "nodemailer";
import { userDb } from "../types/typeUser";

export const emailAdapter = {
  async sendEmail(userCode: string, email: string) {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: "testestuser22@gmail.com",
        pass: "hmoi odon lzcv rbgc",
      },
    });
    const info = await transporter.sendMail({
      from: "alida", // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      html: `
      <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${userCode}'>complete registration</a>
      </p>`,
    });

    return info;
  },
};
