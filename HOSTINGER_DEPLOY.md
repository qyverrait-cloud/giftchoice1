# 🚀 Hostinger पर Deploy करें - Complete Guide

## 📋 Overview

यह guide आपको step-by-step बताएगा कि कैसे आपकी Next.js website को Hostinger के Node.js hosting पर deploy करें।

---

## ✅ Step 1: Local Build करें (पहले यह करें)

### 1.1 Dependencies Install करें

```bash
npm install
```

### 1.2 Production Build करें

```bash
npm run build
```

**Expected Output:**
- `.next` folder create होगा
- `.next/standalone` folder बनेगा (Hostinger के लिए)
- Build successful message दिखेगा

### 1.3 Local Test करें (Optional)

```bash
npm start
```

Browser में `http://localhost:3000` check करें - सब कुछ काम कर रहा होना चाहिए।

---

## 📁 Step 2: Files तैयार करें (Hostinger के लिए)

### Files/Folders जो Hostinger पर upload करने हैं:

**Essential Files:**
- ✅ `.next/standalone/` (entire folder) - **यह सबसे important है!**
- ✅ `.next/static/` (entire folder)
- ✅ `public/` (entire folder)
- ✅ `package.json`
- ✅ `package-lock.json`
- ✅ `node_modules/` (entire folder) - **या server पर install करें**

**Note:** `standalone` mode में Next.js automatically सभी dependencies bundle कर देता है, लेकिन `node_modules` भी चाहिए कुछ packages के लिए।

---

## 🌐 Step 3: Hostinger Panel में Setup करें

### 3.1 Hostinger Panel Login करें

1. [hpanel.hostinger.com](https://hpanel.hostinger.com) पर जाएं
2. Login करें
3. अपना domain select करें

### 3.2 Node.js Application Create करें

1. **Website** section → **Node.js** click करें
2. **Create Node.js App** button click करें
3. Settings fill करें:

   ```
   App Name: gift-choice
   Node.js Version: 18.x या 20.x (recommended: 18.x)
   App Mode: Production
   App Root: /public_html (या जहां files upload करेंगे)
   App URL: आपका domain (example: yourdomain.com)
   Start Command: node .next/standalone/server.js
   Port: 3000 (या auto-detect)
   ```

4. **Create** click करें

---

## 📤 Step 4: Files Upload करें

### Method 1: File Manager से (Recommended)

1. **File Manager** में `public_html` folder खोलें
2. **Upload** button click करें
3. ये folders/files upload करें:
   - `.next/standalone/` (entire folder)
   - `.next/static/` (entire folder)
   - `public/` (entire folder)
   - `package.json`
   - `package-lock.json`
   - `node_modules/` (entire folder - बड़ा है, time लगेगा)

**Upload Time:** 15-30 minutes (connection speed पर depend करता है)

### Method 2: FTP/SFTP से (तेज हो सकता है)

1. **FileZilla** या **WinSCP** install करें
2. Hostinger Panel → **FTP Accounts** → Credentials लें
3. Connect करें
4. Local से Remote में files drag & drop करें

---

## ⚙️ Step 5: Server पर Setup करें

### 5.1 SSH Access (अगर available है)

**Hostinger Panel** → **Advanced** → **SSH Access**

```bash
# SSH में connect करें
ssh u123456789@yourdomain.com -p 65002

# public_html में जाएं
cd public_html

# Dependencies install करें (अगर node_modules upload नहीं किया)
npm install --production

# Build verify करें (अगर जरूरत हो)
# npm run build (अगर server पर build करना हो)
```

### 5.2 File Permissions Set करें

```bash
chmod -R 755 public_html
chmod 644 package.json
```

---

## 🚀 Step 6: Node.js App Start करें

1. Hostinger Panel → **Node.js** section
2. अपनी app find करें (`gift-choice`)
3. **Start** button click करें
4. **Auto Start** enable करें (automatic start के लिए)
5. Wait करें (30-60 seconds)

---

## 🔧 Step 7: Configuration

### 7.1 Port और URL Verify करें

Node.js app panel में check करें:
- **Port:** 3000 (या जो set किया है)
- **Status:** Running
- **URL:** आपका domain

### 7.2 .htaccess File (अगर जरूरत हो)

`public_html` में `.htaccess` file create करें:

```apache
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

**Note:** यह जरूरी है अगर Node.js app port 3000 पर चल रही है और आपको root domain पर access चाहिए।

---

## 🔒 Step 8: SSL Certificate Install करें

1. Hostinger Panel → **SSL** section
2. **Install SSL** click करें
3. **Let's Encrypt** select करें (Free)
4. Domain select करें
5. **Force HTTPS** enable करें

---

## ✅ Step 9: Testing करें

### 9.1 Website Check करें

1. Browser में `https://yourdomain.com` open करें
2. Check करें:
   - ✅ Homepage load हो रहा है
   - ✅ Logo दिख रहा है
   - ✅ Products display हो रहे हैं
   - ✅ Navigation काम कर रहा है

### 9.2 Admin Panel Test करें

1. `https://yourdomain.com/admin/login` पर जाएं
2. Login करें:
   - **Phone:** `97999 64364`
   - **Password:** `Yash#9799`
3. Admin panel features test करें

---

## 🐛 Troubleshooting

### Problem 1: Website नहीं खुल रहा

**Solutions:**
- Node.js app running है या नहीं check करें
- Port number verify करें
- `.htaccess` file check करें
- Browser cache clear करें

### Problem 2: 500 Error

**Solutions:**
- Node.js logs check करें (Hostinger Panel → Node.js → Logs)
- `node_modules` install हुआ है या नहीं check करें
- File permissions verify करें
- Build successful हुआ था या नहीं check करें

### Problem 3: Static Files नहीं Load हो रहे

**Solutions:**
- `.next/static/` folder upload हुआ है या नहीं check करें
- `public/` folder paths verify करें
- File permissions check करें

### Problem 4: Port Already in Use

**Solutions:**
- Hostinger Panel में port number change करें
- App restart करें
- अन्य apps check करें जो same port use कर रही हैं

---

## 📝 Important Notes

1. **Standalone Mode:** Next.js `standalone` mode use कर रहे हैं - यह सभी dependencies bundle करता है
2. **Node Modules:** `node_modules` folder upload करना recommended है (कुछ packages के लिए)
3. **Static Files:** `.next/static/` folder जरूरी है - images और assets के लिए
4. **Port:** Default port 3000 है, लेकिन Hostinger auto-detect कर सकता है
5. **Auto Start:** Enable करें ताकि server restart पर app automatically start हो

---

## 🔄 Updates Deploy करना

### Method 1: Manual Upload

1. Local में changes करें
2. `npm run build` run करें
3. नए files upload करें:
   - `.next/standalone/`
   - `.next/static/`
   - Updated files
4. Node.js app restart करें

### Method 2: Git Integration (अगर available है)

1. Hostinger Panel → **Git** section
2. Repository connect करें
3. Auto-deploy enable करें
4. Push करें - automatic deploy हो जाएगा

---

## ✅ Quick Checklist

- [ ] Local build successful
- [ ] `.next/standalone/` folder created
- [ ] `.next/static/` folder created
- [ ] Node.js app created in Hostinger
- [ ] Files uploaded (standalone, static, public)
- [ ] node_modules uploaded या installed
- [ ] Node.js app started
- [ ] Auto Start enabled
- [ ] SSL certificate installed
- [ ] Website tested
- [ ] Admin panel tested

---

## 🔑 Important Credentials

**Admin Panel:**
- URL: `https://yourdomain.com/admin/login`
- Phone: `97999 64364`
- Password: `Yash#9799`

**Hostinger Panel:**
- URL: [hpanel.hostinger.com](https://hpanel.hostinger.com)

---

## 💡 Tips

1. **Build Locally:** हमेशा local में build करके test करें before upload
2. **Backup:** पहले से existing website का backup लें
3. **Node Version:** Node.js 18.x recommended है
4. **File Size:** `node_modules` बड़ा है - upload में time लगेगा
5. **Logs:** Problem होने पर Node.js logs check करें

---

## 🎉 Done!

आपकी website अब Hostinger पर live है! 🚀

**अगर किसी step में problem हो तो बताएं!**

