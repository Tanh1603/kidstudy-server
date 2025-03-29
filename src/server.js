import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  path: ".env.development",
});

const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
