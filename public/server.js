const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
    const filePath = req.url === '/' ? '/index.html' : req.url;
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    if (filePath !== '/turnLightOn' && filePath !== '/turnLightOff') {
        fs.readFile(`.${filePath}`, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('Not found');
                } else {
                    res.writeHead(500);
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    } else if (filePath === '/turnLightOn') {
        exec('powershell.exe -File lightON.ps1', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning on light: ${error.message}`);
                res.writeHead(500);
                res.end('Error turning on light');
                return;
            }
            console.log('Light turned on');
            res.writeHead(200);
            res.end('Light turned on');
            
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
    } else if (filePath === '/turnLightOff') {
        exec('powershell.exe -File lightOFF.ps1', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error turning off light: ${error.message}`);
                res.writeHead(500);
                res.end('Error turning off light');
                return;
            }
            console.log('Light turned off');
            res.writeHead(200);
            res.end('Light turned off');
        });
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
