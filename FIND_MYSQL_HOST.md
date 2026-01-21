# How to Find Your Hostinger MySQL Host

## Step 1: Login to Hostinger
1. Go to https://hpanel.hostinger.com
2. Login with your credentials

## Step 2: Find MySQL Database
1. Click on **"Databases"** in the left menu
2. Click on **"MySQL Databases"**
3. Find your database: `u136829732_giftchoice1`

## Step 3: Check Connection Details
Look for one of these:
- **Host** or **Server** field
- **Remote MySQL** section
- **Connection String** or **Connection Details**

The host will be something like:
- `mysql.hostinger.com` (most common)
- Or a specific IP address
- Or `localhost` (only if you're on the server itself)

## Step 4: Check Remote MySQL Access
1. In MySQL Databases section, look for **"Remote MySQL"** or **"Access Hosts"**
2. Make sure your current IP is allowed
3. Or add `%` to allow all IPs (less secure, but for testing)

## Common Hostinger MySQL Hosts:
- `mysql.hostinger.com`
- `localhost` (only works on Hostinger server, not from your PC)
- Sometimes an IP like `185.xxx.xxx.xxx`

