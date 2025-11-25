// instrument.js
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry BEFORE the app starts
Sentry.init({
  dsn: "https://ccc095624e1eec1785b1c9930a7817a5@o4510421210628096.ingest.us.sentry.io/4510421232844800",
  integrations: [
    nodeProfilingIntegration(), // Enable profiling
    Sentry.mongooseIntegration()
  ],
//  tracesSampleRate: 1.0,      // Capture 100% transactions
  profilesSampleRate: 1.0,    // Capture 100% profiles
});

// Optional: custom profiling example
Sentry.profiler.startProfiler();

Sentry.startSpan({
  name: "startup-transaction",
  op: "startup",
}, () => {
  // Code inside this block is profiled
});

// Export Sentry instance so server.js can use it
export { Sentry };
