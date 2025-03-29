import app from "./app.js";
import dotenv from "dotenv";
import http from "http";

// Load environment variables
dotenv.config({
  path: ".env.development",
});
const port = process.env.PORT || 3000;

// Start server
const server = http.createServer(app);  
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
