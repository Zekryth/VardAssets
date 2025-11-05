// Programmatic Vite build to avoid bin permission/ESM issues in CI
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure working directory is frontend-vue
process.chdir(__dirname);

const { build } = await import('vite');
await build();
