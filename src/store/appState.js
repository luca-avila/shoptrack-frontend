class AppState {
    constructor() {
        this.state = {
            user: null,
            products: [],
            isLoading: false,
            error: null
        };
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    setUser(user) {
        this.setState({ user });
    }

    setProducts(products) {
        this.setState({ products });
    }

    setLoading(isLoading) {
        this.setState({ isLoading });
    }

    setError(error) {
        this.setState({ error });
    }

    clearError() {
        this.setState({ error: null });
    }

    getState() {
        return this.state;
    }
}

export const appState = new AppState();
