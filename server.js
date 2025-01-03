const express = require('express');
const multer = require('multer');
const ftp = require('basic-ftp');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.memoryStorage();  // Use memory storage for in-memory files
const upload = multer({ storage: storage });

// Serve static files (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Function to upload file to FTP
async function uploadToFTP(fileBuffer, filename) {
 const client = new ftp.Client();
 client.ftp.verbose = true;  // Optional: enables verbose logging
 client.ftp.timeout = 60000;  // Set timeout to 60 seconds
 client.ftp.useCompression = false;  // Disable compression if causing issues

 try {
  // Connect to FTP server
  await client.access(ftpDetails);
  console.log("Connected to FTP server");

  // Upload the file buffer to FTP
  await client.uploadFrom(fileBuffer, `${filename}`);
  console.log("File uploaded successfully");

 } catch (err) {
  console.error("Error uploading file:", err);
 } finally {
  client.close();  // Close the FTP connection
 }
}

// FTP connection details
const ftpDetails = {
 host: "148.72.90.43",
 user: "GoldCouncil",
 password: "Asdf@1234#",
 secure: false,
};

// Define routes
app.post('/upload', upload.single('file'), async (req, res) => {
 if (!req.file) {
  return res.status(400).send('No file uploaded');
 }

 try {
  // Create a readable stream from the file buffer
  const stream = require('stream');
  const readableStream = new stream.PassThrough();
  readableStream.end(req.file.buffer);

  console.log(readableStream)

  // Upload file to FTP using the received file buffer
  await uploadToFTP(readableStream, req.file.originalname);
  res.send('File uploaded to FTP successfully');
 } catch (err) {
  res.status(500).send('Error uploading file to FTP');
 }
});

// Start the server
app.listen(PORT, () => {
 console.log(`Express server running at http://localhost:${PORT}`);
});

module.exports = app;
