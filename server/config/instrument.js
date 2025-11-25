// instrument.js
import * as Sentry from "@sentry/node";

try {
  // Initialize Sentry BEFORE the app starts
  Sentry.init({
    dsn: "https://ccc095624e1eec1785b1c9930a7817a5@o4510421210628096.ingest.us.sentry.io/4510421232844800",
    integrations: [
      Sentry.mongooseIntegration()
    ],
    profilesSampleRate: 0.1,    // Capture 10% of profiles to avoid overhead
  });
} catch (error) {
  console.error('Sentry initialization failed:', error);
}

// Export Sentry instance so server.js can use it
export { Sentry };

