# Fix Remote MySQL Access Denied Error

## Problem:
Error: "Access denied for user 'u136829732_giftchoice1'@'2409:40d4:5051:a973:38a5:497a:260a:4fa9'"

This means:
- ✅ Connection is reaching the server (good!)
- ❌ Your IP address is NOT whitelisted in Remote MySQL

## Solution:

### Step 1: Go to Hostinger Remote MySQL
1. Login to Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Find **"Remote MySQL"** section or tab
4. Click on it

### Step 2: Add Your IP Address
You have two options:

**Option A: Add Your Specific IP (More Secure)**
- Your IPv6: `2409:40d4:5051:a973:38a5:497a:260a:4fa9`
- Add this to the "Access Hosts" or "Allowed IPs" list
- Click "Add" or "Save"

**Option B: Allow All IPs (For Testing - Less Secure)**
- Add `%` to allow all IP addresses
- This is easier for testing but less secure
- You can restrict it later

### Step 3: Wait a Few Minutes
- Changes may take 1-2 minutes to propagate
- Don't restart server immediately

### Step 4: Test Again
- Restart dev server: `npm run dev`
- Visit: `http://localhost:3000/api/init-db`

## Alternative: Check Password
If Remote MySQL is already enabled, the password might be wrong:
- Verify password in Hostinger panel
- Make sure there are no extra spaces
- Password: `Yash#9799` (with # symbol)

## Still Not Working?
1. Check if Remote MySQL feature is available in your Hostinger plan
2. Contact Hostinger support
3. Or use local MySQL for development

