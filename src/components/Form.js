export class Form {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.form = null;
    }

    render() {
        this.container.innerHTML = '';
        
        this.form = document.createElement('form');
        this.form.className = 'auth-form';
        
        const title = document.createElement('h2');
        title.textContent = this.config.title;
        this.form.appendChild(title);
        
        this.config.fields.forEach(field => {
            const fieldGroup = this.createFieldGroup(field);
            this.form.appendChild(fieldGroup);
        });
        
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary';
        submitButton.textContent = this.config.submitText;
        this.form.appendChild(submitButton);
        
        if (this.config.switchText) {
            const switchContainer = this.createSwitchLink();
            this.form.appendChild(switchContainer);
        }
        
        this.container.appendChild(this.form);
        
        this.setupEventListeners();
    }

    createFieldGroup(field) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = field.name;
        
        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.name;
        input.name = field.name;
        input.required = true;
        
        fieldGroup.appendChild(label);
        fieldGroup.appendChild(input);
        
        return fieldGroup;
    }

    createSwitchLink() {
        const switchContainer = document.createElement('p');
        switchContainer.className = 'form-switch';
        
        const switchText = document.createTextNode(this.config.switchText + ' ');
        
        const switchLink = document.createElement('a');
        switchLink.href = '#';
        switchLink.className = 'switch-link';
        switchLink.textContent = this.config.switchLink;
        
        switchContainer.appendChild(switchText);
        switchContainer.appendChild(switchLink);
        
        return switchContainer;
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const switchLink = this.form.querySelector('.switch-link');
        if (switchLink) {
            switchLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.config.onSwitch();
            });
        }
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        this.config.onSubmit(data);
    }

    showError(message) {
        // Remove existing messages
        const existingError = this.form.querySelector('.error-message');
        const existingSuccess = this.form.querySelector('.success-message');
        if (existingError) {
            existingError.remove();
        }
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert at the top of the form
        this.form.insertBefore(errorDiv, this.form.firstChild);
    }

    showSuccess(message) {
        // Remove existing messages
        const existingError = this.form.querySelector('.error-message');
        const existingSuccess = this.form.querySelector('.success-message');
        if (existingError) {
            existingError.remove();
        }
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Create new success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Insert at the top of the form
        this.form.insertBefore(successDiv, this.form.firstChild);
    }

    showLoading() {
        const button = this.form.querySelector('button[type="submit"]');
        button.disabled = true;
        button.textContent = 'Loading...';
    }

    hideLoading() {
        const button = this.form.querySelector('button[type="submit"]');
        button.disabled = false;
        button.textContent = this.config.submitText;
    }

    clearForm() {
        this.form.reset();
        const errorMessage = this.form.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}