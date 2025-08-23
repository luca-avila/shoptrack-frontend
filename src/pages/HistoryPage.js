import { HistoryTable } from '../components/HistoryTable.js';
import { StockService } from '../api/stock.js';
import { AuthService } from '../api/auth.js';

export class HistoryPage {
    constructor(container, onBack) {
        this.container = container;
        this.onBack = onBack;
        this.historyTable = null;
    }

    async render() {
        this.container.innerHTML = '';
        
        // Create header
        const header = this.createHeader();
        this.container.appendChild(header);
        
        // Create content area
        const content = document.createElement('div');
        content.className = 'history-content';
        
        // Create history table container
        this.historyContainer = document.createElement('div');
        this.historyContainer.className = 'history-table-container';
        content.appendChild(this.historyContainer);
        
        this.container.appendChild(content);
        
        // Load history
        await this.loadHistory();
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'dashboard-header';
        
        const title = document.createElement('h1');
        title.textContent = 'Transaction History';
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        
        const user = AuthService.getUser();
        const username = document.createElement('span');
        username.textContent = `Welcome, ${user ? user.username : 'User'}!`;
        
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-secondary';
        backBtn.textContent = 'Back to Dashboard';
        backBtn.addEventListener('click', () => this.onBack());
        
        userInfo.appendChild(username);
        userInfo.appendChild(backBtn);
        
        header.appendChild(title);
        header.appendChild(userInfo);
        
        return header;
    }

    async loadHistory() {
        try {
            const history = await StockService.getHistory();
            this.renderHistoryTable(history);
        } catch (error) {
            this.showError('Failed to load history: ' + error.message);
        }
    }

    renderHistoryTable(history) {
        if (this.historyTable) {
            this.historyTable.destroy();
        }
        
        this.historyTable = new HistoryTable(this.historyContainer, history);
        this.historyTable.render();
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
}
