import { App } from './app.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const appContainer = document.getElementById('app');
        const app = new App(appContainer);
        app.init();
        console.log('ShopTrack app started successfully!');
    } catch (error) {
        console.error('Failed to start app:', error);
        document.getElementById('app').innerHTML = '<p>Error loading app</p>';
    }
});