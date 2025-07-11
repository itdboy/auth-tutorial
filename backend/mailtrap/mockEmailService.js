// Mock email service for development when Mailtrap limits are reached
export const mockEmailService = {
  sendVerificationEmail: async (email, verificationToken) => {
    console.log("🚀 MOCK EMAIL SERVICE 🚀");
    console.log("📧 Verification Email");
    console.log("To:", email);
    console.log("Verification Code:", verificationToken);
    console.log("📧 Email would be sent in production");
    return Promise.resolve({ success: true });
  },

  sendPasswordResetEmail: async (email, resetURL) => {
    console.log("🚀 MOCK EMAIL SERVICE 🚀");
    console.log("📧 Password Reset Email");
    console.log("To:", email);
    console.log("Reset URL:", resetURL);
    console.log("📧 Email would be sent in production");
    return Promise.resolve({ success: true });
  },

  sendWelcomeEmail: async (email, name) => {
    console.log("🚀 MOCK EMAIL SERVICE 🚀");
    console.log("📧 Welcome Email");
    console.log("To:", email);
    console.log("Name:", name);
    console.log("📧 Email would be sent in production");
    return Promise.resolve({ success: true });
  }
};
