const { getPassword } = require('../../lib/data');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const { oldPassword, newPassword } = req.body;
    const adminPassword = await getPassword();
    if (oldPassword !== adminPassword) return res.status(400).json({ success: false, error: '原密码错误' });
    if (!newPassword || newPassword.length < 4) return res.status(400).json({ success: false, error: '新密码至少4位' });
    const { kv } = require('@vercel/kv');
    await kv.set('admin_password', newPassword);
    res.json({ success: true, message: '密码修改成功' });
  } catch (e) {
    res.status(500).json({ success: false, error: '操作失败' });
  }
};