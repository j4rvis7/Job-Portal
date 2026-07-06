/**
 * server.js
 * Entry point — starts the Express server.
 */

// ── Global Error Guards ────────────────────────────────────────────────────────
// Node v24 crashes on unhandled rejections by default.
// We catch them here so a MongoDB connection failure doesn't kill the whole server.
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

process.on("unhandledRejection", (reason) => {
  console.error("⚠️  Unhandled Promise Rejection (server kept alive):", reason?.message || reason);
});

process.on("uncaughtException", (err) => {
  console.error("⚠️  Uncaught Exception (server kept alive):", err.message);
});

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || "development"}`);
});
