import { Form } from '../components/Form.js';
import { AuthService } from '../api/auth.js';

export class RegisterPage {
    constructor(container, onLoginSuccess) {
        this.container = container;
        this.onLoginSuccess = onLoginSuccess;
        this.form = null;
    }

    render() {
        // Add auth-page class for proper mobile centering
        this.container.parentElement.className = 'auth-page';
        
        this.form = new Form(this.container, {
            title: 'Create Account',
            fields: [
                { name: 'username', label: 'Username', type: 'text' },
                { name: 'password', label: 'Password', type: 'password' }
            ],
            submitText: 'Register',
            switchText: 'Already have an account?',
            switchLink: 'Login',
            onSubmit: async (data) => {
                await this.handleRegister(data);
            },
            onSwitch: () => {
                this.showLoginPage();
            }
        });

        this.form.render();
    }

    async handleRegister(data) {
        try {
            this.form.showLoading();
            await AuthService.register(data.username, data.password);
            this.form.showSuccess('Registration successful! Please login.');
            setTimeout(() => {
                this.showLoginPage();
            }, 2000);
        } catch (error) {
            this.form.showError(error.message);
        } finally {
            this.form.hideLoading();
        }
    }

    showLoginPage() {
        import('./LoginPage.js').then(module => {
            const LoginPage = module.LoginPage;
            new LoginPage(this.container, this.onLoginSuccess).render();
        });
    }
}
