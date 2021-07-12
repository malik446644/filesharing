import init from './init.js';
import checkSettings from './checkSettings.js';

(async () => {
    await checkSettings();
    init();
})()