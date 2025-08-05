const express           = require('express');
const authenticateToken = require('../middleware/auth');
const router            = express.Router();

router.use('/user', require('../api/user'));
router.use('/kategori',authenticateToken ,require('../api/kategori'));
router.use('/video', authenticateToken , require('../api/video'));
router.use('/tps', authenticateToken, require('../api/tps'));
router.use('/sampah', authenticateToken ,require('../api/sampah'));
router.use('/service', authenticateToken ,require('../api/service'));
router.use('/layanan', authenticateToken ,require('../api/layanan'));

module.exports = router;
