export default async function handler(request, response) {
    const { url } = request.query;

    if (!url) {
        return response.status(400).json({ error: 'URL parameter is required' });
    }

    // Allow only Yahoo Finance URLs for security
    if (!url.includes('yahoo.com')) {
        return response.status(403).json({ error: 'Only Yahoo Finance URLs are allowed' });
    }

    try {
        const apiResponse = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const data = await apiResponse.json();

        // Set CORS headers
        response.setHeader('Access-Control-Allow-Credentials', true);
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        response.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );

        return response.status(200).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return response.status(500).json({ error: 'Failed to fetch data' });
    }
}
