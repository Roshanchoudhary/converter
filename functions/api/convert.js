// Import the converter class
import { ScriptConverter } from '../../src/converter.js';

// Create converter instance
const converter = new ScriptConverter();

/**
 * Handle POST requests to /api/convert
 */
export async function onRequest(context) {
    const { request } = context;
    
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
        return new Response(null, { 
            status: 204, 
            headers 
        });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Method not allowed. Use POST.' 
        }), { 
            status: 405, 
            headers 
        });
    }

    try {
        // Parse request body
        const body = await request.json();
        const { text, direction = 'auto' } = body;

        // Validate input
        if (!text || typeof text !== 'string') {
            return new Response(JSON.stringify({ 
                success: false, 
                error: 'Invalid input: text is required and must be a string' 
            }), { 
                status: 400, 
                headers 
            });
        }

        // Perform conversion
        const result = converter.convert(text, direction);

        if (!result.success) {
            return new Response(JSON.stringify(result), { 
                status: 400, 
                headers 
            });
        }

        // Return successful response
        return new Response(JSON.stringify({
            success: true,
            result: result.result,
            direction: result.direction,
            metadata: {
                originalLength: result.originalLength,
                resultLength: result.resultLength,
                detectedScript: result.detectedScript,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }
        }), { 
            status: 200, 
            headers 
        });

    } catch (error) {
        console.error('Conversion error:', error);
        
        return new Response(JSON.stringify({ 
            success: false, 
            error: 'Internal server error: ' + error.message 
        }), { 
            status: 500, 
            headers 
        });
    }
}
