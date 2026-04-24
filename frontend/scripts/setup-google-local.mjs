/**
 * Ensures frontend/.env exists and opens Google Cloud → Credentials in the default browser.
 * You must paste your Web client ID into VITE_GOOGLE_CLIENT_ID yourself (Google does not allow bots to create it).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.join(__dirname, '..');
const envPath = path.join(frontendRoot, '.env');
const examplePath = path.join(frontendRoot, '.env.example');

if (!fs.existsSync(examplePath)) {
  console.error('Missing frontend/.env.example');
  process.exit(1);
}

if (!fs.existsSync(envPath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log('Created frontend/.env from .env.example');
} else {
  console.log('frontend/.env already exists (left unchanged). Edit VITE_GOOGLE_CLIENT_ID there.');
}

const url = 'https://console.cloud.google.com/apis/credentials';
if (process.platform === 'win32') {
  spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
} else if (process.platform === 'darwin') {
  spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
} else {
  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

console.log('Opened Google Cloud Credentials in your browser.');
console.log('Create or open a Web application OAuth client, copy the Client ID, set VITE_GOOGLE_CLIENT_ID in frontend/.env, then: npm run dev');
