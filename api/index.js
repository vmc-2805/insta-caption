// Vercel serverless entry point.
// All /api/* requests are rewritten here (see vercel.json) and handled by the Express app in server.js.
import app from '../server.js';

export default app;
