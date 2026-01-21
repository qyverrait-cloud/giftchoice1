# How to Get MySQL Host from Hostinger

## Method 1: Check Database Details Page
1. Click on the database name: **"u136829732_giftchoice1"**
2. Or click the **three dots (⋮)** menu next to your database
3. Look for **"Connection Details"** or **"Host"** field

## Method 2: Check phpMyAdmin
1. Click **"Enter phpMyAdmin"** button
2. Once phpMyAdmin opens, look at the top
3. You'll see connection info like:
   - **Server:** `mysql.hostinger.com` or an IP
   - **User:** `u136829732_giftchoice1`
   - **Database:** `u136829732_giftchoice1`

## Method 3: Check Remote MySQL Section
1. In Hostinger panel, go to **"Databases"** → **"MySQL Databases"**
2. Look for **"Remote MySQL"** or **"Access Hosts"** section
3. The host might be listed there

## Common Hostinger MySQL Hosts:
- `mysql.hostinger.com` (most common)
- `localhost` (only works on Hostinger server itself)
- Sometimes: `185.xxx.xxx.xxx` (IP address)

## What You Need:
Once you find the host, update `.env.local`:
```env
MYSQL_HOST=the_host_you_found
```

