const fs = require('fs');
const formidable = require('formidable');
const path = require('path');

module.exports = function(app) {
  // Route to manage image file uploads
  app.post('/api/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "../images");
    
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true }); // Create directory if it doesn't exist
    }
    
    form.uploadDir = uploadFolder;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log("Error parsing the files:", err);
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }

      // Assuming a single file for this example
      const oldPath = files.image.filepath;
      const newPath = path.join(uploadFolder, files.image.originalFilename);
      
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.log("Error saving the file:", err);
          return res.status(500).json({
            status: "Fail",
            message: "Failed to save the image",
            error: err,
          });
        }

        // Send result to the client if all is good
        res.json({
          result: 'OK',
          data: { filename: files.image.originalFilename, size: files.image.size },
          numberOfImages: 1,
          message: "Upload successful",
          imageUrl: `/images/${files.image.originalFilename}` // Include the image URL
        });
      });
    });
  });
};
