function handler(event) {
    const request = event.request;
    const uri = request.uri;
    const rawQueryString = request.querystring || {};
    let queryString = typeof rawQueryString === 'string' ? rawQueryString : '';

    if (typeof rawQueryString !== 'string') {
        for (const key in rawQueryString) {
            if (!Object.prototype.hasOwnProperty.call(rawQueryString, key)) continue;
            if (queryString) queryString += '&';
            queryString += `${encodeURIComponent(key)}=${encodeURIComponent(rawQueryString[key].value || '')}`;
        }
    }

    if (uri === '/index.html') {
        return request;
    }

    if (uri.endsWith('.html')) {
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: { value: `${uri.slice(0, -5)}${queryString ? `?${queryString}` : ''}` }
            }
        };
    }

    if (uri !== '/' && !uri.endsWith('/') && !uri.includes('.')) {
        request.uri = `${uri}.html`;
    }

    return request;
}