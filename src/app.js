import { AuthService } from './api/auth.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';

export class App {
    constructor(container) {
        this.container = container;
        this.currentPage = null;
        this.state = {
            user: null,
            isAuthenticated: false
        };
    }

    init() {
        this.checkAuth();
        this.render();
    }

    checkAuth() {
        const user = AuthService.getUser();
        const isAuthenticated = AuthService.isAuthenticated();
        
        this.state.user = user;
        this.state.isAuthenticated = isAuthenticated;
    }

    render() {
        if (this.state.isAuthenticated) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        this.currentPage = new LoginPage(
            this.container,
            () => this.handleLoginSuccess()
        );
        this.currentPage.render();
    }

    showRegister() {
        this.currentPage = new RegisterPage(
            this.container,
            () => this.handleLoginSuccess()
        );
        this.currentPage.render();
    }

    showDashboard() {
        this.currentPage = new DashboardPage(
            this.container,
            () => this.handleLogout()
        );
        this.currentPage.render();
    }

    handleLoginSuccess() {
        this.checkAuth();
        this.showDashboard();
    }

    handleLogout() {
        this.checkAuth();
        this.showLogin();
    }
}