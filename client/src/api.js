const API_URL = 'http://localhost:5000/api/v1';

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
};

export const register = async (email, username, password) => {
    const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, username, password }),
    });
    const data = await response.json();
    return data;
};
