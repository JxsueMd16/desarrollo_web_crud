-- Seleccionar la base de datos
CREATE DATABASE IF NOT EXISTS bd_prueba;
USE bd_prueba;

-- Tabla principal de productos
CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Tabla relacionada 1–N: imágenes de productos
CREATE TABLE IF NOT EXISTS product_images (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id INT UNSIGNED NOT NULL,
  url VARCHAR(255) NOT NULL,
  alt_text VARCHAR(150) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product_id (product_id),
  CONSTRAINT fk_product_images_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insertar productos de ejemplo
INSERT INTO products (name, description, price) VALUES
('Laptop HP', 'Laptop de 15 pulgadas con procesador i5', 4500.00),
('Mouse Logitech', 'Mouse inalámbrico óptico', 150.00),
('Teclado Mecánico', 'Teclado retroiluminado RGB', 750.00),
('Monitor Samsung', 'Monitor de 24 pulgadas Full HD', 1200.00),
('Audífonos Sony', 'Audífonos con cancelación de ruido', 950.00),
('Impresora HP LaserJet', 'Impresora láser monocromática con conexión WiFi', 1800.00),
('Tablet Samsung Galaxy Tab', 'Pantalla de 10 pulgadas, 64GB de almacenamiento', 2200.00),
('Silla Ergonómica', 'Silla de oficina ergonómica con soporte lumbar', 1300.00);
