const { getTools } = require('../lib/data');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const tools = await getTools();
    const categories = ['全部', ...new Set(tools.map(t => t.category))];
    res.setHeader('Cache-Control', 's-maxage=60');
    res.json({ success: true, data: categories });
  } catch (e) {
    res.status(500).json({ success: false, error: '读取数据失败' });
  }
};