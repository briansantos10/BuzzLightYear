const express = require("express");
const app = express();
const path = require("path");
const { exec } = require('child_process');

// Serve static files from the public and build folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/turnLightOn", (req, res) => {
  exec('powershell.exe -File lightON.ps1', (error, stdout, stderr) => {
      if (error) {
          console.error(`Error turning on light: ${error.message}`);
          res.status(500).send('Error turning on light');
          return;
      }
      console.log('Light turned on');
      res.status(200).send('Light turned on');
      
      setTimeout(() => {
          exec('powershell.exe -File lightOFF.ps1', (error, stdout, stderr) => {
              if (error) {
                  console.error(`Error turning off light: ${error.message}`);
                  return;
              }
              console.log('Light turned off automatically after 5 seconds');
          });
      }, 5000); 
  });
});

// Handle turning the light off
app.get("/turnLightOff", (req, res) => {
  exec('powershell.exe -File lightOFF.ps1', (error, stdout, stderr) => {
      if (error) {
          console.error(`Error turning off light: ${error.message}`);
          res.status(500).send('Error turning off light');
          return;
      }
      console.log('Light turned off');
      res.status(200).send('Light turned off');
  });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
