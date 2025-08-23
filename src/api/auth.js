import { API_CONFIG } from './config.js';

export class AuthService {
    static async login(username, password) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
                method: 'POST',
                headers: API_CONFIG.headers,
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async logout() {
        try {
            const token = this.getToken();
            await fetch(`${API_CONFIG.baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${token}`
                }
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static isAuthenticated() {
        return !!this.getToken();
    }
}