/* The build hook always creates this handler from the current API and workspace source. */
module.exports = require("./dist/vercel/handler.cjs").default;

// Stripe signature verification needs the original, unparsed request bytes.
module.exports.config = { api: { bodyParser: false } };
