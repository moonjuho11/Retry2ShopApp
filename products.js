
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

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
 * Write products to JSON file
 */
async function writeProducts(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw error;
  }
}

/**
 * Validate product data
 */
function validateProduct(product) {
  const errors = [];

  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }

  if (!product.price || typeof product.price !== 'number' || product.price < 0) {
    errors.push('price is required and must be a positive number');
  }

  if (!product.imageUrl || typeof product.imageUrl !== 'string') {
    errors.push('imageUrl is required and must be a string');
  }

  if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }

  if (product.stock !== undefined && (typeof product.stock !== 'number' || product.stock < 0)) {
    errors.push('stock must be a non-negative number');
  }

  if (product.description && typeof product.description !== 'string') {
    errors.push('description must be a string');
  }

  return errors;
}

/**
 * GET /api/products - Get all products
 */
router.get('/', async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * GET /api/products/:id - Get single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const products = await readProducts();
    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * POST /api/products - Create new product
 */
router.post('/', async (req, res) => {
  try {
    const { name, price, imageUrl, category, description, stock } = req.body;

    // Validate required fields
    const validationErrors = validateProduct({
      name,
      price,
      imageUrl,
      category,
      description,
      stock
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const products = await readProducts();

    // Generate new ID (max existing ID + 1)
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name: name.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      stock: stock ? parseInt(stock) : 0
    };

    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * PUT /api/products/:id - Update product
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, imageUrl, category, description, stock } = req.body;

    // Validate ID format
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Validate required fields
    const validationErrors = validateProduct({
      name,
      price,
      imageUrl,
      category,
      description,
      stock
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product
    products[productIndex] = {
      id: parseInt(id),
      name: name.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      stock: stock ? parseInt(stock) : 0
    };

    await writeProducts(products);
    res.json(products[productIndex]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

/**
 * DELETE /api/products/:id - Delete product
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1);
    await writeProducts(products);

    res.json({
      message: 'Product deleted successfully',
      product: deletedProduct[0]
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
