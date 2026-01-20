Hostinger Deployment Files

Files in this folder:

- .next/standalone/ - Next.js standalone build (main files)
- .next/static/ - Static assets
- public/ - Public assets (images, etc.)
- package.json - Dependencies list
- package-lock.json - Lock file
- .htaccess - Apache rewrite rules

Upload Instructions:

1. Upload ALL contents of this folder to public_html on Hostinger
2. Upload node_modules/ folder (from project root) OR run npm install --production on server
3. Create Node.js app in Hostinger panel:
   - App Root: /public_html
   - Start Command: node .next/standalone/server.js
   - Port: 3000
4. Start the app

Detailed Guide:

See HOSTINGER_DEPLOY.md for complete instructions.

Important:

- Make sure Node.js app is running
- Enable Auto Start in Hostinger panel
- Install SSL certificate
- Test website after deployment
