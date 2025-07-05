import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

import dotenv from "dotenv";
import { mailtrapClient, sender } from "./mailtrap.config.js";
dotenv.config();

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];
  console.log("Sending verification verificationToken to:", verificationToken);
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Verification email sent successfully.", response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "1320984e-3d28-4c19-916a-edb41a9847f0",
      template_variables: {
        company_info_name: "Auth Company",
        name: name,
      },
    });

    console.log("Welcome email sent successfully.", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
