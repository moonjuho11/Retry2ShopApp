
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

async function readProducts() {
  try {
    const data = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

async function writeProducts(products) {
  try {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error writing products:', error);
    throw error;
  }
}

function validateProduct(product) {
  const errors = [];
  if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
    errors.push('name is required and must be a non-empty string');
  }
  if (product.price === undefined || product.price === null || isNaN(Number(product.price)) || Number(product.price) < 0) {
    errors.push('price is required and must be a positive number');
  }
  if (!product.imageUrl || typeof product.imageUrl !== 'string') {
    errors.push('imageUrl is required and must be a string');
  }
  if (!product.category || typeof product.category !== 'string' || product.category.trim() === '') {
    errors.push('category is required and must be a non-empty string');
  }
  if (product.stock !== undefined && product.stock !== null && (isNaN(Number(product.stock)) || Number(product.stock) < 0)) {
    errors.push('stock must be a non-negative number');
  }
  if (product.description && typeof product.description !== 'string') {
    errors.push('description must be a string');
  }
  return errors;
}

/**
 * GET /api/products/featured - Get featured products
 */
router.get('/featured', async (req, res) => {
  try {
    const products = await readProducts();
    const featured = products.filter(p => p.isFeatured);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

/**
 * GET /api/products/bestsellers - Get bestseller products
 */
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await readProducts();
    const bestsellers = products.filter(p => p.isBestSeller);
    res.json(bestsellers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bestseller products' });
  }
});

/**
 * GET /api/products - Get all products with optional search/category filter
 */
router.get('/', async (req, res) => {
  try {
    const products = await readProducts();
    let filtered = products;

    const { search, category } = req.query;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (category) {
      filtered = filtered.filter(p =>
        p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json(filtered);
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
    const { name, price, imageUrl, category, description, stock, isFeatured, isBestSeller, discount, rating } = req.body;

    const validationErrors = validateProduct({ name, price, imageUrl, category, description, stock });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const products = await readProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
      id: newId,
      name: name.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      stock: stock !== undefined && stock !== null ? parseInt(stock) : 0,
      isFeatured: isFeatured || false,
      isBestSeller: isBestSeller || false,
      discount: discount ? parseFloat(discount) : 0,
      rating: rating ? parseFloat(rating) : 4.0,
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
    const { name, price, imageUrl, category, description, stock, isFeatured, isBestSeller, discount, rating } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const validationErrors = validateProduct({ name, price, imageUrl, category, description, stock });
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const products = await readProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[productIndex] = {
      id: parseInt(id),
      name: name.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      stock: stock !== undefined && stock !== null ? parseInt(stock) : 0,
      isFeatured: isFeatured || false,
      isBestSeller: isBestSeller || false,
      discount: discount ? parseFloat(discount) : 0,
      rating: rating ? parseFloat(rating) : 4.0,
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
    res.json({ message: 'Product deleted successfully', product: deletedProduct[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
