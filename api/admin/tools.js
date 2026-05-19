const { getTools, saveTools } = require('../../lib/data');

function authMiddleware(req, res) {
  const token = req.headers['authorization'];
  const { getPassword } = require('../../lib/data');
  // 异步验证改为同步跳过（在handler里验证）
  return true; // 实际验证在handler中
}

module.exports = async (req, res) => {
  try {
    // 所有管理接口需要密码验证
    const { getPassword } = require('../../lib/data');
    const adminPassword = await getPassword();
    const token = req.headers['authorization'];
    if (token !== 'Bearer ' + adminPassword) {
      return res.status(401).json({ success: false, error: '未授权' });
    }

    const { kv } = require('@vercel/kv');

    if (req.method === 'GET') {
      const tools = await getTools();
      tools.sort((a, b) => (a.order || 0) - (b.order || 0));
      return res.json({ success: true, data: tools });
    }

    if (req.method === 'POST') {
      const tools = await getTools();
      const { name, url, icon, category, description } = req.body;
      if (!name || !url) return res.status(400).json({ success: false, error: '名称和URL必填' });
      const newTool = {
        id: Date.now().toString(),
        name: name.trim(),
        url: url.trim(),
        icon: (icon || '🔧').trim(),
        category: (category || '未分类').trim(),
        description: (description || '').trim(),
        order: tools.length,
        createdAt: new Date().toISOString(),
      };
      tools.push(newTool);
      await saveTools(tools);
      return res.json({ success: true, data: newTool });
    }

    if (req.method === 'PUT') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ success: false, error: '缺少id参数' });
      const tools = await getTools();
      const idx = tools.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: '工具不存在' });
      const { name, url, icon, category, description, order } = req.body;
      if (name) tools[idx].name = name.trim();
      if (url) tools[idx].url = url.trim();
      if (icon) tools[idx].icon = icon.trim();
      if (category) tools[idx].category = category.trim();
      if (description !== undefined) tools[idx].description = description.trim();
      if (order !== undefined) tools[idx].order = order;
      await saveTools(tools);
      return res.json({ success: true, data: tools[idx] });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ success: false, error: '缺少id参数' });
      let tools = await getTools();
      const idx = tools.findIndex(t => t.id === id);
      if (idx === -1) return res.status(404).json({ success: false, error: '工具不存在' });
      const deleted = tools.splice(idx, 1)[0];
      await saveTools(tools);
      return res.json({ success: true, data: deleted });
    }

    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: '操作失败: ' + e.message });
  }
};