import fs from 'node:fs';

const b64 = fs.readFileSync('public/logo.jpg').toString('base64');
console.log('Logo base64 length:', b64.length);

const tsContent = `// Base64 encoded logo image to ensure 100% reliable rendering on any deployment platform
export const LOGO_BASE64 = "data:image/jpeg;base64,${b64}";
`;

fs.writeFileSync('src/data/logoBase64.ts', tsContent);
console.log('Successfully written src/data/logoBase64.ts');
