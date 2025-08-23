import { API_CONFIG } from './config.js';
import { AuthService } from './auth.js';

export class StockService {
    static async getAllProducts() {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/`, {
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch products');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async getProduct(id) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}`, {
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch product');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async createProduct(productData) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create product');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(id, productData) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}`, {
                method: 'PUT',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update product');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

            static async deleteProduct(id) {
            try {
                const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}`, {
                    method: 'DELETE',
                    headers: {
                        ...API_CONFIG.headers,
                        'Authorization': `Bearer ${AuthService.getToken()}`
                    }
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Failed to delete product');
                }
    
                const result = await response.json();
                return result;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }

    static async addStock(id, quantity) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}/stock`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({ stock: quantity })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add stock');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async removeStock(id, quantity) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}/stock`, {
                method: 'DELETE',
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                },
                body: JSON.stringify({ stock: quantity })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to remove stock');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async getHistory() {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/history`, {
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch history');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('History API error:', error);
            throw error;
        }
    }

    static async getProductHistory(id) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}/stock/${id}/history`, {
                headers: {
                    ...API_CONFIG.headers,
                    'Authorization': `Bearer ${AuthService.getToken()}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch product history');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}
