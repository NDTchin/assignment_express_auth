const express = require('express');
const { authenticateToken, permissionMiddleware } = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/users', permissionMiddleware('view_users'), (req, res) => {
    res.send([{ username: '1' }, { username: '2' }]);
});

router.post('/users', permissionMiddleware('edit_users'), (req, res) => {
    res.send('Tạo mới người dùng');
});

router.delete('/users/:id', permissionMiddleware('delete_users'), (req, res) => {
    res.send(`XÓa user id ${req.params.id} `);
});

module.exports = router;