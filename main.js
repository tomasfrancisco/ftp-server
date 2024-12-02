const FTPSrv = require("ftp-srv");
const fs = require("fs");
const path = require("path");

// Define the FTP server
const ftpServer = new FTPSrv({
  url: "ftp://0.0.0.0:21",
  pasv_url: "192.168.1.185", // Replace with your external IP address for external access
  anonymous: true, // Allow anonymous access
  greeting: "Welcome to the FTP server!",
});

// Set the directory to serve
const serveDirectory = path.join(__dirname, "public");

// Create the directory if it does not exist
if (!fs.existsSync(serveDirectory)) {
  fs.mkdirSync(serveDirectory);
}

// Log access
ftpServer.on("login", ({ connection, username, password }, resolve, reject) => {
  console.log(`User ${username} logged in`);

  // Define root directory
  connection.on("STOR", (fileName) => {
    console.log(`File uploaded: ${fileName}`);
  });
  connection.on("RETR", (fileName) => {
    console.log(`File downloaded: ${fileName}`);
  });

  // Allow anonymous login
  resolve({ root: serveDirectory });
});

// Start the FTP server
ftpServer
  .listen()
  .then(() => {
    console.log("FTP server is running...");
  })
  .catch((err) => {
    console.error("Error starting the FTP server:", err);
  });
