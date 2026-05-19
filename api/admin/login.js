const { getPassword } = require('../../lib/data');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const { password } = req.body;
    const adminPassword = await getPassword();
    if (password === adminPassword) {
      res.json({ success: true, token: adminPassword });
    } else {
      res.status(401).json({ success: false, error: '密码错误' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: '登录失败' });
  }
};