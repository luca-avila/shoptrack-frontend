export class HistoryTable {
    constructor(container, history = []) {
        this.container = container;
        this.history = history;
        this.element = null;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'history-container';
        
        const title = document.createElement('h2');
        title.textContent = 'Transaction History';
        title.className = 'history-title';
        
        const table = document.createElement('table');
        table.className = 'history-table';
        
        // Create table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Action</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        `;
        
        // Create table body
        const tbody = document.createElement('tbody');
        
        if (this.history.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="6" class="empty-history">No transactions found</td>';
            tbody.appendChild(emptyRow);
        } else {
            this.history.forEach(transaction => {
                const row = document.createElement('tr');
                row.className = `transaction-row ${transaction.action}`;
                
                const date = new Date(transaction.created).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const total = (transaction.price * transaction.quantity).toFixed(2);
                
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${transaction.product_name}</td>
                    <td>
                        <span class="action-badge ${transaction.action}">
                            ${transaction.action.toUpperCase()}
                        </span>
                    </td>
                    <td>${transaction.quantity}</td>
                    <td>$${transaction.price}</td>
                    <td>$${total}</td>
                `;
                
                tbody.appendChild(row);
            });
        }
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        this.element.appendChild(title);
        this.element.appendChild(table);
        
        return this.element;
    }

    updateHistory(newHistory) {
        this.history = newHistory;
        if (this.element) {
            this.element.remove();
        }
        this.render();
    }

    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}
