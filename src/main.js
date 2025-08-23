import { App } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const appContainer = document.getElementById('app');
        const app = new App(appContainer);
        app.init();
    } catch (error) {
        console.error('Failed to start app:', error);
        const appElement = document.getElementById('app');
        if (appElement) {
            appElement.innerHTML = '<p>Error loading app</p>';
        }
    }
});