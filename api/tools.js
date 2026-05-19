const { getTools } = require('../lib/data');
module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  try {
    const tools = await getTools();
    tools.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.json({ success: true, data: tools });
  } catch (e) {
    res.status(500).json({ success: false, error: '读取数据失败' });
  }
};