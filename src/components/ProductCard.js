export class ProductCard {
    constructor(product, onUpdate, onDelete) {
        this.product = product;
        this.onUpdate = onUpdate;
        this.onDelete = onDelete;
        this.element = null;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'product-card';
        
        // Create product header
        const header = document.createElement('div');
        header.className = 'product-header';
        
        const title = document.createElement('h3');
        title.textContent = this.product.name;
        
        const actions = document.createElement('div');
        actions.className = 'product-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-edit';
        editBtn.textContent = 'Edit';
        editBtn.dataset.action = 'edit';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.dataset.action = 'delete';
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        header.appendChild(title);
        header.appendChild(actions);
        
        // Create product info
        const info = document.createElement('div');
        info.className = 'product-info';
        
        const stockInfo = document.createElement('p');
        const stockLabel = document.createElement('strong');
        stockLabel.textContent = 'Stock: ';
        const stockSpan = document.createElement('span');
        stockSpan.className = 'stock-amount';
        stockSpan.textContent = this.product.stock;
        stockInfo.appendChild(stockLabel);
        stockInfo.appendChild(stockSpan);
        
        const priceInfo = document.createElement('p');
        const priceLabel = document.createElement('strong');
        priceLabel.textContent = 'Price: ';
        const priceText = document.createTextNode('$' + this.product.price);
        priceInfo.appendChild(priceLabel);
        priceInfo.appendChild(priceText);
        
        info.appendChild(stockInfo);
        info.appendChild(priceInfo);
        
        if (this.product.description) {
            const descInfo = document.createElement('p');
            const descLabel = document.createElement('strong');
            descLabel.textContent = 'Description: ';
            const descText = document.createTextNode(this.product.description);
            descInfo.appendChild(descLabel);
            descInfo.appendChild(descText);
            info.appendChild(descInfo);
        }
        
        // Create stock actions
        const stockActions = document.createElement('div');
        stockActions.className = 'stock-actions';
        
        const inputGroup = document.createElement('div');
        inputGroup.className = 'stock-input-group';
        
        const stockInput = document.createElement('input');
        stockInput.type = 'number';
        stockInput.className = 'stock-input';
        stockInput.placeholder = 'Quantity';
        stockInput.min = '1';
        
        const buyBtn = document.createElement('button');
        buyBtn.className = 'btn btn-buy';
        buyBtn.textContent = 'Buy';
        buyBtn.dataset.action = 'buy';
        
        const sellBtn = document.createElement('button');
        sellBtn.className = 'btn btn-sell';
        sellBtn.textContent = 'Sell';
        sellBtn.dataset.action = 'sell';
        
        inputGroup.appendChild(stockInput);
        inputGroup.appendChild(buyBtn);
        inputGroup.appendChild(sellBtn);
        stockActions.appendChild(inputGroup);
        
        // Assemble the card
        this.element.appendChild(header);
        this.element.appendChild(info);
        this.element.appendChild(stockActions);
        
        this.setupEventListeners();
        return this.element;
    }

    setupEventListeners() {
        const editBtn = this.element.querySelector('[data-action="edit"]');
        const deleteBtn = this.element.querySelector('[data-action="delete"]');
        const buyBtn = this.element.querySelector('[data-action="buy"]');
        const sellBtn = this.element.querySelector('[data-action="sell"]');
        const stockInput = this.element.querySelector('.stock-input');

        editBtn.addEventListener('click', () => {
            this.onUpdate(this.product);
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this product?')) {
                this.onDelete(this.product.id);
            }
        });

        buyBtn.addEventListener('click', () => {
            const quantity = parseInt(stockInput.value);
            if (quantity && quantity > 0) {
                this.handleStockAction('buy', quantity);
                stockInput.value = '';
            }
        });

        sellBtn.addEventListener('click', () => {
            const quantity = parseInt(stockInput.value);
            if (quantity && quantity > 0) {
                this.handleStockAction('sell', quantity);
                stockInput.value = '';
            }
        });
    }

    async handleStockAction(action, quantity) {
        try {
            if (action === 'buy') {
                await this.onUpdate(this.product.id, 'addStock', quantity);
            } else {
                await this.onUpdate(this.product.id, 'removeStock', quantity);
            }
        } catch (error) {
            alert(error.message);
        }
    }

    updateStock(newStock) {
        const stockElement = this.element.querySelector('.stock-amount');
        stockElement.textContent = newStock;
    }
}
