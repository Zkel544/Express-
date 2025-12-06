const express  = require('express');
const router   = express.Router();
const cors     = require('cors');

const User     = require('../modules/user');
const Tps      = require('../modules/tps');
const Layanan  = require('../modules/layanan');
const Service  = require('../modules/service');
const Sampah   = require('../modules/sampah');

router.use(express.json());
router.use(cors());

router.get('/count', async (req, res) => {
  try {
    const userCount    = await User.countDocuments();
    const tpsCount     = await Tps.countDocuments();
    const layananCount = await Layanan.countDocuments();

    res.status(200).json({
      users: userCount,
      tps: tpsCount,
      layanan: layananCount
    });
  } catch (err) {
    console.error('GET /dashboard/count error:', err);
    res.status(500).json({ message: 'Gagal mengambil data count' });
  }
});

router.get('/chart-service', async (req, res) => {
  try {
    const chartData = await Service.aggregate([
      {
        $group: {
          _id: "$status",   
          total: { $sum: 1 }
        }
      }
    ]);

    const statuses = ["ditindak", "diproses", "ditolak", "selesai"];
    const result = statuses.map(st => {
      const found = chartData.find(d => d._id === st);
      return {
        status: st,
        total: found ? found.total : 0
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('GET /dashboard/chart-service error:', err);
    res.status(500).json({ message: 'Gagal mengambil data chart' });
  }
});

router.get('/chart-sampah', async (req, res) => {
  try {
    const chartData = await Sampah.find({})
      .select("name harga satuan")
      .sort({ harga: -1 })
      .limit(5); 

    res.status(200).json(chartData);
  } catch (err) {
    console.error('GET /dashboard/chart-sampah error:', err);
    res.status(500).json({ message: 'Gagal mengambil data chart sampah' });
  }
});


module.exports = router;
