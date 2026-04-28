
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ordersFilePath = path.join(__dirname, '../data/orders.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

/**
 * Read orders from JSON file
 */
async function readOrders() {
  try {
    const data = await fs.readFile(ordersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

/**
 * Write orders to JSON file
 */
async function writeOrders(orders) {
  try {
    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.error('Error writing orders:', error);
    throw error;
  }
}

/**
 * Read products from JSON file
 */
async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

/**
 * Generate unique order ID
 */
function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

/**
 * Validate order data
 */
function validateOrder(order) {
  const errors = [];

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('items is required and must be a non-empty array');
  } else {
    order.items.forEach((item, index) => {
      if (!item.id || isNaN(item.id)) {
        errors.push(`items[${index}].id is required and must be a number`);
      }
      if (!item.quantity || isNaN(item.quantity) || item.quantity < 1) {
        errors.push(`items[${index}].quantity is required and must be at least 1`);
      }
      if (item.price === undefined || isNaN(item.price) || item.price < 0) {
        errors.push(`items[${index}].price is required and must be a non-negative number`);
      }
    });
  }

  if (!order.customerEmail || typeof order.customerEmail !== 'string' || !order.customerEmail.includes('@')) {
    errors.push('customerEmail is required and must be a valid email');
  }

  if (!order.customerName || typeof order.customerName !== 'string' || order.customerName.trim() === '') {
    errors.push('customerName is required and must be a non-empty string');
  }

  if (!order.shippingAddress || typeof order.shippingAddress !== 'string' || order.shippingAddress.trim() === '') {
    errors.push('shippingAddress is required and must be a non-empty string');
  }

  if (order.totalAmount === undefined || isNaN(order.totalAmount) || order.totalAmount < 0) {
    errors.push('totalAmount is required and must be a non-negative number');
  }

  return errors;
}

/**
 * POST /api/orders - Create new order
 */
router.post('/', async (req, res) => {
  try {
    const { items, customerName, customerEmail, shippingAddress, totalAmount } = req.body;

    // Validate request data
    const validationErrors = validateOrder({
      items,
      customerName,
      customerEmail,
      shippingAddress,
      totalAmount
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    // Verify products exist and have sufficient stock
    const products = await readProducts();
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.id} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Deduct stock from products
    for (const item of items) {
      const productIndex = products.findIndex(p => p.id === item.id);
      products[productIndex].stock -= item.quantity;
    }
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

    // Create order
    const orders = await readOrders();
    const newOrder = {
      id: generateOrderId(),
      items: items,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.push(newOrder);
    await writeOrders(orders);

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * GET /api/orders - Get all orders (admin endpoint)
 */
router.get('/', async (req, res) => {
  try {
    const orders = await readOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
