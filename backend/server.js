const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// 1. Endpoint Test Server
app.get('/', (req, res) => {
  res.json({ message: "KANTOONG AI Multi-Tenant Backend is Running!" });
});

// 2. Endpoint Ambil Konfigurasi Bisnis & Katalog Produk Berdasarkan Slug
app.get('/api/business/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const business = await prisma.business.findUnique({
      where: { slug },
      include: { products: true } // Mengambil produk terkait toko ini secara otomatis!
    });

    if (!business) {
      return res.status(404).json({ error: "Bisnis tidak ditemukan" });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Endpoint Buat Order / Checkout ala WhatsApp
app.post('/api/orders', async (req, res) => {
  try {
    const { businessId, customerName, items, totalAmount } = req.body;

    const newOrder = await prisma.order.create({
      data: {
        businessId,
        customerName,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json({ message: "Order berhasil dibuat!", newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan Server di Port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Kantoong AI menyala di http://localhost:${PORT}`);
});