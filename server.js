require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/greet', async (req, res) => {
    const { name, birthday } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        // Create an image with Sharp
        const width = 600;
        const height = 300;
        const backgroundColor = { r: 173, g: 216, b: 230, alpha: 1 }; // Light blue background

        const svgImage = `
            <svg width="${width}" height="${height}">
                <rect x="0" y="0" width="100%" height="100%" fill="rgb(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b})"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="black">${birthday === today ? 'Happy Birthday, ' + name + '!' : 'Hello, ' + name + '. Your birthday is on ' + birthday + '.'}</text>
            </svg>
        `;

        const imageBuffer = Buffer.from(svgImage);

        // Resize the image
        const image = await sharp(imageBuffer)
            .resize(width, height)
            .png()
            .toBuffer();

        // Convert the image to base64
        const base64Data = image.toString('base64');

        res.json({ image: base64Data });
    } catch (error) {
        console.error('Error generating image:', error.message);
        res.status(500).json({ error: 'Error generating image' });
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
