export async function api(path, method = 'GET', body) {
    const token = localStorage.getItem('token');

    const res = await fetch ( path , {
        method,
        headers: {
            'Content-Type' : 'application/json',
            ...(token ? {Authorization : `Bearer ${token}`} : {})
        },
        body : body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();

    if(!res.ok) {
        const error = new Error(data.error || 'Something went wrong, try later');
        error.status = res.status;
        throw error;
    }

    return data;
}