# Fix Database Connection Issue

## Problem
You're getting a connection error because your `DATABASE_URL` is using `localhost`, but Hostinger's MySQL database requires a **remote host**.

## Solution

### Step 1: Find Your Hostinger MySQL Host

1. Login to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Databases** → **MySQL Databases**
3. Find your database `u136829732_giftchoice1`
4. Check the **Host** or **Remote MySQL** section
5. You'll see something like:
   - `mysql.hostinger.com` OR
   - A specific IP address OR
   - Remote MySQL host

### Step 2: Update Your .env.local File

Open `.env.local` and update the `DATABASE_URL` with the correct host:

**Option A: If host is `mysql.hostinger.com`:**
```env
DATABASE_URL=mysql://u136829732_giftchoice1:Yash%239799@mysql.hostinger.com:3306/u136829732_giftchoice1
```
*(Note: Password mein `#` ko `%23` se replace kiya - URL encoding)*

**Option B: Use Individual Variables (Easier):**
```env
MYSQL_HOST=mysql.hostinger.com
MYSQL_PORT=3306
MYSQL_USER=u136829732_giftchoice1
MYSQL_PASSWORD=Yash#9799
MYSQL_DATABASE=u136829732_giftchoice1
```

**Option C: If Hostinger provides a different remote host:**
Replace `mysql.hostinger.com` with the actual host from your Hostinger panel.

### Step 3: Important Notes

1. **Password Encoding**: Agar password mein `#` hai, to DATABASE_URL mein use `%23` se replace karein (URL encoding)
2. **Remote Access**: Ensure remote MySQL access is enabled in Hostinger panel
3. **Firewall**: Check if your IP is allowed in Hostinger's Remote MySQL settings

### Step 4: Test Connection

1. Restart your dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/test-db`
3. Should show success message

## Alternative: Check Connection Details in phpMyAdmin

1. Open phpMyAdmin in Hostinger
2. Click on your database
3. At the top, check the **Server** information
4. The host will be shown there

## Still Having Issues?

1. **Check Hostinger MySQL Settings:**
   - Remote MySQL access enabled?
   - Your IP allowed?

2. **Use Individual Variables Instead:**
   ```env
   MYSQL_HOST=mysql.hostinger.com
   MYSQL_PORT=3306
   MYSQL_USER=u136829732_giftchoice1
   MYSQL_PASSWORD=Yash#9799
   MYSQL_DATABASE=u136829732_giftchoice1
   ```

3. **Contact Hostinger Support** if you can't find the remote MySQL host

