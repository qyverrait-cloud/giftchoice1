# Database Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with your database configuration:

```env
# Option 1: Use DATABASE_URL (recommended)
# Format: mysql://user:password@host:port/database_name
DATABASE_URL=mysql://username:password@host:port/database_name

# Option 2: Use individual MySQL variables
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=giftchoice
```

## Hostinger MySQL Configuration

For Hostinger MySQL database, use these variables:

```env
MYSQL_HOST=mysql.hostinger.com
MYSQL_PORT=3306
MYSQL_DATABASE=u123456789_giftchoice
MYSQL_USER=u123456789_admin
MYSQL_PASSWORD=your_mysql_password_here
```

Or use DATABASE_URL format:

```env
DATABASE_URL=mysql://u123456789_admin:your_password@mysql.hostinger.com:3306/u123456789_giftchoice
```

## Database Tables

The backend will automatically create the following tables when you first use the API:

- **products** - Product catalog
- **categories** - Product categories
- **orders** - Customer orders
- **contact_messages** - Contact form messages
- **social_media_posts** - Social media posts
- **promotional_banners** - Promotional banners

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=xyz&featured=true&search=term` - Filter products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/[id]` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders?status=pending&phone=1234567890` - Filter orders
- `GET /api/orders/[id]` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/[id]` - Update order (mainly status)

### Messages
- `GET /api/messages` - Get all messages
- `GET /api/messages?isRead=false` - Filter by read status
- `GET /api/messages/[id]` - Get single message
- `POST /api/messages` - Create message
- `PUT /api/messages/[id]` - Update message (mark as read)
- `DELETE /api/messages/[id]` - Delete message

## Testing the Connection

Once you've set up your `.env.local` file with the database URL, test the connection by:

1. Start the development server: `npm run dev`
2. Visit any API endpoint: `http://localhost:3000/api/products`
3. Check the console for connection status

The database tables will be created automatically on first use.

