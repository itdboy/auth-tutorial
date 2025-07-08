import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";
import dotenv from "dotenv";

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
    
    // Check if it's a Mailtrap limit error
    if (error.message && error.message.includes("limit")) {
      console.error("Mailtrap sending limit reached. Please upgrade your plan or wait for reset.");
      throw new Error("Email service temporarily unavailable. Please try again later.");
    }
    
    throw new Error("Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "912c5112-d9b5-4b58-96f9-427a5fbc47d5",
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


export const sendPasswordResetEmail = async (email, resetURL) => {

  const recipients = [{ email }];

  console.log("Sending password reset email to:", email);

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password Reset Request",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully.", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    
    // Check if it's a Mailtrap limit error
    if (error.message && error.message.includes("limit")) {
      console.error("Mailtrap sending limit reached. Please upgrade your plan or wait for reset.");
      throw new Error("Email service temporarily unavailable. Please try again later.");
    }
    
    throw new Error("Failed to send password reset email");
  }
}


export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE, 
      category: "Password Reset",
    });

    console.log("Password reset success email sent successfully.", response);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
  }
}