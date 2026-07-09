import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ScriptConverter } from './src/converter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const converter = new ScriptConverter();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conversion endpoint
app.post('/api/convert', (req, res) => {
    try {
        const { text, direction = 'auto' } = req.body;
        
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Invalid input: text is required'
            });
        }

        const result = converter.convert(text, direction);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Devanagari-Tirhuta Converter',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 API endpoint: http://localhost:${PORT}/api/convert`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
