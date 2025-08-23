export class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        const handler = this.routes.get(path);
        if (handler) {
            this.currentRoute = path;
            handler();
        } else {
            console.error(`Route not found: ${path}`);
        }
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    // Simple hash-based routing
    init() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'dashboard';
            this.navigate(hash);
        });

        // Initial route
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.navigate(hash);
    }
}

export const router = new Router();
