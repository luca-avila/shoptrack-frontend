import { API_CONFIG } from './config.js';

export class AuthService {
    static async login(username, password) {
        // POST to /auth/login
    }

    static async logout() {
        // Clear local storage, etc.
    }

    static getToken() {
        // Get token from localStorage
    }
}