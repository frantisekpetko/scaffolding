const BASIC_URL = 'http://localhost:3000/api/'

class Fetch   {

    static defaultHeaders = () => {
        return new Headers();
    };

    static getRequest = (url: string) => {
        //req.mode = 'no-cors';
        return new Request(url);
    };

    static defaultProps = () => {
        return { credentials: import.meta.env.DEV ? 'include' : 'same-origin' }
        //mode: 'no-cors'
    };

    static get = (url: string, customProps: { credentials: string } | any = Fetch.defaultProps, customHeaders: Headers = Fetch.defaultHeaders()) => {
        return fetch(Fetch.getRequest(url), { ...Fetch.defaultProps, ...customProps, headers: customHeaders, method: 'GET' } as RequestInit)
    };

    static post = (url: string, data: unknown, customProps = Fetch.defaultProps, customHeaders = Fetch.defaultHeaders()) => {
        return fetch(Fetch.getRequest(url), {...Fetch.defaultProps, ...customProps, headers: customHeaders, body: data, method: 'POST'} as RequestInit)
    };

    static put = (url: string, data: unknown, customProps = Fetch.defaultProps, customHeaders = Fetch.defaultHeaders()) => {
        return fetch(Fetch.getRequest(url), {...Fetch.defaultProps, ...customProps, headers: customHeaders, body: data, method: 'PUT'} as RequestInit)
    };

    static delete = (url: string, data: unknown, customProps = Fetch.defaultProps, customHeaders = Fetch.defaultHeaders()) => {
        return fetch(Fetch.getRequest(url), {...Fetch.defaultProps, ...customProps, headers: customHeaders, body: data, method: 'DELETE'} as RequestInit)
    }
}

export class JsonFetch {
    static defaultHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return headers;
    };

    static get(url: string, customProps:{ credentials: string } | any = Fetch.defaultProps, customHeaders = JsonFetch.defaultHeaders()) {
        return Fetch.get(`${BASIC_URL}${url}`, customProps, customHeaders);
    };

    static post(url: string, data: unknown, customProps:{ credentials: string } | any = Fetch.defaultProps, customHeaders = JsonFetch.defaultHeaders()) {
        return Fetch.post(`${BASIC_URL}${url}`, JSON.stringify(data), customProps, customHeaders);
    };

    static put(url: string, data: unknown, customProps:{ credentials: string } | any = Fetch.defaultProps, customHeaders = JsonFetch.defaultHeaders()) {
        return Fetch.put(`${BASIC_URL}${url}`, JSON.stringify(data), customProps, customHeaders);
    };

    static delete(url: string, data?: unknown, customProps:{ credentials: string } | any = Fetch.defaultProps, customHeaders = JsonFetch.defaultHeaders()) {
        return Fetch.delete(`${BASIC_URL}${url}`, JSON.stringify(data), customProps, customHeaders);
    }
}


