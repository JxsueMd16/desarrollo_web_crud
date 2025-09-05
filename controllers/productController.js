// controllers/productController.js
const db = require('../db'); 

// CREATE: POST /api/products
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'name y price son requeridos' });
  }

  try {
    const [ins] = await db.pool.execute(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description || null, price]
    );
    const insertId = ins.insertId;

    const { rows } = await db.query('SELECT * FROM products WHERE id = ?', [insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[createProduct]', err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// READ ALL: GET /api/products
exports.getProducts = async (_req, res) => { 
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('[getProducts]', err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// READ ONE: GET /api/products/:id
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const r = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!r.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('[getProductById]', err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// UPDATE: PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    // Validar existencia
    const cur = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    if (!cur.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });

    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
      [name || null, description || null, price ?? 0, id]
    );

    const out = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json(out.rows[0]);
  } catch (err) {
    console.error('[updateProduct]', err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// DELETE: DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const cur = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    if (!cur.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });

    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[deleteProduct]', err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// GET /api/products/count
exports.countProducts = async (_req, res) => {
  try {
    const r = await db.query('SELECT COUNT(*) AS total FROM products');
    res.json({ total: Number(r.rows[0].total) });
  } catch (err) {
    console.error('[countProducts]', err);
    res.status(500).json({ error: 'Error al contar productos' });
  }
};

// GET /api/products/sum
exports.sumProducts = async (_req, res) => {
  try {
    const r = await db.query('SELECT COALESCE(SUM(price),0) AS total_price FROM products');
    res.json({ total_price: Number(r.rows[0].total_price) });
  } catch (err) {
    console.error('[sumProducts]', err);
    res.status(500).json({ error: 'Error al sumar precios' });
  }
};


// POST /api/products/:id/images  { url, alt_text }
exports.createImage = async (req, res) => {
  const { id } = req.params;
  const { url, alt_text } = req.body;
  if (!url) return res.status(400).json({ error: 'url es requerida' });

  try {
    const p = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    if (!p.rows.length) return res.status(404).json({ error: 'Producto no encontrado' });

    const [ins] = await db.pool.execute(
      'INSERT INTO product_images (product_id, url, alt_text) VALUES (?, ?, ?)',
      [id, url, alt_text || null]
    );
    const insertId = ins.insertId;

    const img = await db.query('SELECT * FROM product_images WHERE id = ?', [insertId]);
    res.status(201).json(img.rows[0]);
  } catch (err) {
    console.error('[createImage]', err);
    res.status(500).json({ error: 'Error al crear la imagen' });
  }
};

// GET /api/products/:id/images
exports.getImagesByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const r = await db.query(
      'SELECT id, product_id, url, alt_text, created_at FROM product_images WHERE product_id = ? ORDER BY id DESC',
      [id]
    );
    res.json(r.rows);
  } catch (err) {
    console.error('[getImagesByProduct]', err);
    res.status(500).json({ error: 'Error al listar imágenes' });
  }
};

// GET /products-view
exports.renderProductsView = async (_req, res) => {
  try {
    const [products, c, s] = await Promise.all([
      db.query('SELECT * FROM products ORDER BY id ASC'),
      db.query('SELECT COUNT(*) AS total FROM products'),
      db.query('SELECT COALESCE(SUM(price),0) AS total_price FROM products'),
    ]);

    res.render('index', {
      products: products.rows,
      stats: {
        total: Number(c.rows[0].total || 0),
        total_price: Number(s.rows[0].total_price || 0),
      }
    });
  } catch (err) {
    console.error('[renderProductsView]', err);
    res.status(500).send('Error cargando productos');
  }
};

// GET /products/:id/images-view
exports.renderImagesView = async (req, res) => {
  const { id } = req.params;
  try {
    const p = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!p.rows.length) return res.status(404).send('Producto no encontrado');

    const imgs = await db.query(
      'SELECT id, url, alt_text, created_at FROM product_images WHERE product_id = ? ORDER BY id DESC',
      [id]
    );

    res.render('images', { product: p.rows[0], images: imgs.rows });
  } catch (err) {
    console.error('[renderImagesView]', err);
    res.status(500).send('Error cargando imágenes');
  }
};
