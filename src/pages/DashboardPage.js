import { ProductCard } from '../components/ProductCard.js';
import { ProductForm } from '../components/ProductForm.js';
import { StockService } from '../api/stock.js';
import { AuthService } from '../api/auth.js';

export class DashboardPage {
    constructor(container, onLogout) {
        this.container = container;
        this.onLogout = onLogout;
        this.products = [];
        this.productCards = new Map();
        this.currentForm = null;
    }

    async render() {
        this.container.innerHTML = '';
        
        // Remove auth-page class when showing dashboard
        this.container.parentElement.classList.remove('auth-page');
        
        const header = this.createHeader();
        this.container.appendChild(header);
        
        const mainContent = document.createElement('div');
        mainContent.className = 'dashboard-content';
        
        this.productsContainer = document.createElement('div');
        this.productsContainer.className = 'products-grid';
        mainContent.appendChild(this.productsContainer);
        
        this.container.appendChild(mainContent);
        
        await this.loadProducts();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'dashboard-header';
        
        const title = document.createElement('h1');
        title.textContent = 'ShopTrack Dashboard';
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        const user = AuthService.getUser();
        const username = document.createElement('span');
        username.textContent = `Welcome, ${user ? user.username : 'User'}!`;
        
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.textContent = 'Add Product';
        addBtn.addEventListener('click', () => this.showAddProductForm());
        
        const historyBtn = document.createElement('button');
        historyBtn.className = 'btn btn-secondary';
        historyBtn.textContent = 'History';
        historyBtn.addEventListener('click', () => this.showHistory());
        
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-secondary';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', () => this.handleLogout());
        
        userInfo.appendChild(username);
        userInfo.appendChild(addBtn);
        userInfo.appendChild(historyBtn);
        userInfo.appendChild(logoutBtn);
        
        header.appendChild(title);
        header.appendChild(userInfo);
        
        return header;
    }

                async loadProducts() {
        try {
            this.products = await StockService.getAllProducts();
            this.renderProducts();
        } catch (error) {
            console.error('Load products error:', error);
            this.showError('Failed to load products: ' + error.message);
        }
    }

    renderProducts() {
        this.productsContainer.innerHTML = '';
        this.productCards.clear();
        
        if (this.products.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            
            const title = document.createElement('h3');
            title.textContent = 'No products yet';
            
            const message = document.createElement('p');
            message.textContent = 'Add your first product to get started!';
            
            emptyState.appendChild(title);
            emptyState.appendChild(message);
            this.productsContainer.appendChild(emptyState);
            return;
        }
        
        this.products.forEach(product => {
            const card = new ProductCard(
                product,
                (productData, action, quantity) => this.handleProductUpdate(productData, action, quantity),
                (productId) => this.handleProductDelete(productId)
            );
            
            const cardElement = card.render();
            this.productsContainer.appendChild(cardElement);
            this.productCards.set(product.id, card);
        });
    }

    async handleProductUpdate(productData, action, quantity) {
        if (typeof productData === 'object') {
            this.showEditProductForm(productData);
        } else {
            await this.handleStockOperation(productData, action, quantity);
        }
    }

    async handleStockOperation(productId, action, quantity) {
        try {
            if (action === 'addStock') {
                await StockService.addStock(productId, quantity);
            } else if (action === 'removeStock') {
                await StockService.removeStock(productId, quantity);
            }
            
            await this.loadProducts();
        } catch (error) {
            console.error('Stock operation error:', error);
            this.showError(error.message);
        }
    }

    async handleProductDelete(productId) {
        try {
            await StockService.deleteProduct(productId);
            await this.loadProducts();
        } catch (error) {
            this.showError('Failed to delete product: ' + error.message);
        }
    }

    showAddProductForm() {
        this.hideCurrentForm();
        
        const formContainer = document.createElement('div');
        formContainer.className = 'form-overlay';
        
        this.currentForm = new ProductForm(
            formContainer,
            null,
            async (data) => {
                await this.handleCreateProduct(data);
            },
            () => this.hideCurrentForm()
        );
        
        this.currentForm.render();
        this.container.appendChild(formContainer);
    }

    showEditProductForm(product) {
        this.hideCurrentForm();
        
        const formContainer = document.createElement('div');
        formContainer.className = 'form-overlay';
        
        this.currentForm = new ProductForm(
            formContainer,
            product,
            async (data) => {
                await this.handleUpdateProduct(product.id, data);
            },
            () => this.hideCurrentForm()
        );
        
        this.currentForm.render();
        this.container.appendChild(formContainer);
    }

    async handleCreateProduct(data) {
        try {
            if (this.currentForm) {
                this.currentForm.showLoading();
            }
            await StockService.createProduct(data);
            this.hideCurrentForm();
            await this.loadProducts();
        } catch (error) {
            if (this.currentForm) {
                this.currentForm.showError(error.message);
            } else {
                this.showError(error.message);
            }
        } finally {
            if (this.currentForm) {
                this.currentForm.hideLoading();
            }
        }
    }

    async handleUpdateProduct(productId, data) {
        try {
            if (this.currentForm) {
                this.currentForm.showLoading();
            }
            await StockService.updateProduct(productId, data);
            this.hideCurrentForm();
            await this.loadProducts();
        } catch (error) {
            console.error('handleUpdateProduct error:', error);
            if (this.currentForm) {
                this.currentForm.showError(error.message);
            } else {
                this.showError(error.message);
            }
        } finally {
            if (this.currentForm) {
                this.currentForm.hideLoading();
            }
        }
    }

    hideCurrentForm() {
        if (this.currentForm) {
            this.currentForm.destroy();
            this.currentForm = null;
            
            const overlay = this.container.querySelector('.form-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const existingError = this.container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        this.container.insertBefore(errorDiv, this.container.firstChild);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showHistory() {
        this.hideCurrentForm();
        
        import('./HistoryPage.js').then(module => {
            const HistoryPage = module.HistoryPage;
            new HistoryPage(this.container, () => this.render()).render();
        });
    }

    async handleLogout() {
        try {
            await AuthService.logout();
            this.onLogout();
        } catch (error) {
            console.error('Logout error:', error);
            this.onLogout();
        }
    }
}
