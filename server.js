const express = require('express');
const cors = require('cors');
const ScriptConverter = require('./converter');

const app = express();
const converter = new ScriptConverter();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conversion endpoint
app.post('/api/convert', (req, res) => {
    try {
        const { text, direction } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                error: 'No text provided' 
            });
        }

        if (!direction || !['dev-to-tir', 'tir-to-dev'].includes(direction)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid direction. Use "dev-to-tir" or "tir-to-dev"' 
            });
        }

        const result = converter.convert(text, direction);
        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Converter API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
