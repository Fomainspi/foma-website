async function handler(event) {
    const request = event.request;
    const uri = request.uri;
    const rawQueryString = request.querystring || {};
    const queryString = typeof rawQueryString === 'string'
        ? rawQueryString
        : Object.entries(rawQueryString)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.value || '')}`)
            .join('&');
    const location = path => queryString ? `${path}?${queryString}` : path;

    if (uri === '/index.html') {
        return request;
    }

    if (uri.endsWith('.html')) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: { value: location(uri.slice(0, -5)) }
            }
        };
    }

    if (uri !== '/' && !uri.endsWith('/') && !uri.includes('.')) {
        request.uri = `${uri}.html`;
    }

    return request;
}