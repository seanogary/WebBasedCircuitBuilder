import { initResize } from './viewport.js';
import { loadAssets } from './assetLoader.js';

export const init = async () => {
    initResize();
    await loadAssets();
}