/**
 * Health check endpoint
 */
export async function onRequest(context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    };

    return new Response(JSON.stringify({
        status: 'OK',
        service: 'Devanagari-Tirhuta Converter',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime ? process.uptime() : 0,
        environment: 'Cloudflare Pages'
    }), {
        status: 200,
        headers
    });
}
