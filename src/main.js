import { App } from './app.js';


document.addEventListener('DOMContentLoaded', () => {
    try {
        const app = new App();
        app.init();
        console.log('App started successfully!');
    } catch (error) {
        console.error('Failed to start app:', error);
        document.getElementById('app').innerHTML = '<p>Error loading app</p>';
    }
});