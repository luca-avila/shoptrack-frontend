export class ProductForm {
    constructor(container, product = null, onSubmit, onCancel) {
        this.container = container;
        this.product = product;
        this.onSubmit = onSubmit;
        this.onCancel = onCancel;
        this.form = null;
    }

    render() {
        this.form = document.createElement('form');
        this.form.className = 'product-form';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = this.product ? 'Edit Product' : 'Add New Product';
        this.form.appendChild(title);
        
        // Create name field
        const nameGroup = this.createFieldGroup('name', 'Product Name *', 'text', this.product ? this.product.name : '', true);
        this.form.appendChild(nameGroup);
        
        // Create stock field
        const stockGroup = this.createFieldGroup('stock', 'Initial Stock *', 'number', this.product ? this.product.stock : '', true, '0');
        this.form.appendChild(stockGroup);
        
        // Create price field
        const priceGroup = this.createFieldGroup('price', 'Price *', 'number', this.product ? this.product.price : '', true, '0', '0.01');
        this.form.appendChild(priceGroup);
        
        // Create description field
        const descGroup = this.createTextareaGroup('description', 'Description', this.product ? this.product.description || '' : '');
        this.form.appendChild(descGroup);
        
        // Create form actions
        const actions = document.createElement('div');
        actions.className = 'form-actions';
        
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.className = 'btn btn-primary';
        submitBtn.textContent = this.product ? 'Update Product' : 'Create Product';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.id = 'cancel-btn';
        cancelBtn.textContent = 'Cancel';
        
        actions.appendChild(submitBtn);
        actions.appendChild(cancelBtn);
        this.form.appendChild(actions);

        this.setupEventListeners();
        this.container.appendChild(this.form);
    }

    createFieldGroup(name, label, type, value, required = false, min = null, step = null) {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.htmlFor = name;
        
        const input = document.createElement('input');
        input.type = type;
        input.id = name;
        input.name = name;
        input.value = value;
        if (required) input.required = true;
        if (min !== null) input.min = min;
        if (step !== null) input.step = step;
        
        group.appendChild(labelElement);
        group.appendChild(input);
        
        return group;
    }

    createTextareaGroup(name, label, value) {
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.htmlFor = name;
        
        const textarea = document.createElement('textarea');
        textarea.id = name;
        textarea.name = name;
        textarea.rows = '3';
        textarea.value = value;
        
        group.appendChild(labelElement);
        group.appendChild(textarea);
        
        return group;
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const cancelBtn = this.form.querySelector('#cancel-btn');
        cancelBtn.addEventListener('click', () => {
            this.onCancel();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            stock: parseInt(formData.get('stock')),
            price: parseFloat(formData.get('price')),
            description: formData.get('description') || null
        };

        this.onSubmit(data);
    }

    showError(message) {
        const existingError = this.form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        this.form.insertBefore(errorDiv, this.form.firstChild);
    }

    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Loading...';
    }

    hideLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = this.product ? 'Update Product' : 'Create Product';
    }

    destroy() {
        if (this.form) {
            this.form.remove();
        }
    }
}
