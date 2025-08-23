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
        
        // Create header
        const header = this.createHeader();
        this.container.appendChild(header);
        
        // Create main content area
        const mainContent = document.createElement('div');
        mainContent.className = 'dashboard-content';
        
        // Create products container
        this.productsContainer = document.createElement('div');
        this.productsContainer.className = 'products-grid';
        mainContent.appendChild(this.productsContainer);
        
        this.container.appendChild(mainContent);
        
        // Load products
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
            console.log('Loading products...');
            this.products = await StockService.getAllProducts();
            console.log('Products loaded:', this.products);
            this.renderProducts();
        } catch (error) {
            console.error('Load products error:', error);
            this.showError('Failed to load products: ' + error.message);
        }
    }

    renderProducts() {
        this.productsContainer.innerHTML = '';
        
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
            // Edit product
            this.showEditProductForm(productData);
        } else {
            // Stock operation (productData is productId)
            await this.handleStockOperation(productData, action, quantity);
        }
    }

    async handleStockOperation(productId, action, quantity) {
        try {
            console.log('Handling stock operation:', action, quantity, 'for product:', productId);
            
            if (action === 'addStock') {
                const result = await StockService.addStock(productId, quantity);
                console.log('Add stock result:', result);
            } else if (action === 'removeStock') {
                const result = await StockService.removeStock(productId, quantity);
                console.log('Remove stock result:', result);
            }
            
            // Refresh products to get updated stock
            console.log('Refreshing products...');
            await this.loadProducts();
            console.log('Products refreshed');
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
            this.currentForm.showLoading();
            await StockService.createProduct(data);
            this.hideCurrentForm();
            await this.loadProducts();
        } catch (error) {
            this.currentForm.showError(error.message);
        } finally {
            this.currentForm.hideLoading();
        }
    }

    async handleUpdateProduct(productId, data) {
        try {
            this.currentForm.showLoading();
            await StockService.updateProduct(productId, data);
            this.hideCurrentForm();
            await this.loadProducts();
        } catch (error) {
            this.currentForm.showError(error.message);
        } finally {
            this.currentForm.hideLoading();
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
        
        // Remove existing error
        const existingError = this.container.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        this.container.insertBefore(errorDiv, this.container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showHistory() {
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
            this.onLogout(); // Still logout even if API call fails
        }
    }
}
