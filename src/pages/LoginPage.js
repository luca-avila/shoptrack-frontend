import { Form } from '../components/Form.js';
import { AuthService } from '../api/auth.js';

export class LoginPage {
    constructor(container, onLoginSuccess) {
        this.container = container;
        this.onLoginSuccess = onLoginSuccess;
        this.form = null;
    }

    render() {
        // Add auth-page class for proper mobile centering
        this.container.parentElement.classList.add('auth-page');
        
        this.form = new Form(this.container, {
            title: 'Login to ShopTrack',
            fields: [
                { name: 'username', label: 'Username', type: 'text' },
                { name: 'password', label: 'Password', type: 'password' }
            ],
            submitText: 'Login',
            switchText: "Don't have an account?",
            switchLink: 'Register',
            onSubmit: async (data) => {
                await this.handleLogin(data);
            },
            onSwitch: () => {
                this.showRegisterPage();
            }
        });

        this.form.render();
    }

    async handleLogin(data) {
        try {
            this.form.showLoading();
            await AuthService.login(data.username, data.password);
            this.onLoginSuccess();
        } catch (error) {
            this.form.showError(error.message);
        } finally {
            this.form.hideLoading();
        }
    }

    showRegisterPage() {
        import('./RegisterPage.js').then(module => {
            const RegisterPage = module.RegisterPage;
            new RegisterPage(this.container, this.onLoginSuccess).render();
        });
    }
}