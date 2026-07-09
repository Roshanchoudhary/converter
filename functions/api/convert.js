import { ScriptConverter } from '../../converter.js';

const converter = new ScriptConverter();

export async function onRequest(context) {
    const { request } = context;
    
    if (request.method === 'POST') {
        try {
            const { text, direction } = await request.json();
            
            if (!text) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: 'No text provided' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const result = converter.convert(text, direction);
            
            return new Response(JSON.stringify({ success: true, result }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            return new Response(JSON.stringify({ 
                success: false, 
                error: error.message 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
    return new Response('Method not allowed', { status: 405 });
}
