import { cp } from 'node:fs/promises';
const source = new URL('../dist/', import.meta.url);
const destination = new URL('../../src/api-gateway/src/main/resources/static/', import.meta.url);
await cp(source, destination, { recursive: true });
console.log('Built frontend copied to the gateway static resources.');
