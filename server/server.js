const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'tools.json');
const CONFIG_FILE = path.join(__dirname, 'data', 'config.json');

// 密码配置
let adminPassword = 'admin123'; // 默认密码，首次登录后请修改
if (fs.existsSync(CONFIG_FILE)) {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    adminPassword = config.password || adminPassword;
  } catch (e) {}
}

// 初始化数据文件
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  const defaultTools = [
    { id: '1', name: '星洞AI', url: 'https://x.lk888.ai/', icon: '🌟', category: 'AI聚合平台', description: 'AI大模型聚合平台，支持AI对话、AI绘画、AI视频、AI智能体等多种功能', order: 0 },
    { id: '2', name: 'ChatGPT', url: 'https://chat.openai.com', icon: '💬', category: '文本生成', description: 'OpenAI开发的强大对话AI，支持写作、编程、翻译等多种任务', order: 1 },
    { id: '3', name: 'Claude', url: 'https://claude.ai', icon: '🤖', category: '文本生成', description: 'Anthropic开发的AI助手，擅长长文本分析和安全对话', order: 2 },
    { id: '4', name: 'Gemini', url: 'https://gemini.google.com', icon: '💎', category: '文本生成', description: 'Google开发的AI助手，多模态能力强大', order: 3 },
    { id: '5', name: 'Midjourney', url: 'https://www.midjourney.com', icon: '🎨', category: '图像生成', description: '顶级AI图像生成工具，艺术风格多样，质量出色', order: 4 },
    { id: '6', name: 'Stable Diffusion', url: 'https://stablediffusionweb.com', icon: '🖼️', category: '图像生成', description: '开源AI图像生成模型，支持本地部署和自定义训练', order: 5 },
    { id: '7', name: 'DALL·E', url: 'https://openai.com/dall-e', icon: '🎭', category: '图像生成', description: 'OpenAI图像生成工具，支持文本描述生成图片', order: 6 },
    { id: '8', name: 'Runway', url: 'https://runwayml.com', icon: '🎬', category: '视频生成', description: 'AI视频编辑和生成工具，支持文本生成视频', order: 7 },
    { id: '9', name: 'Pika', url: 'https://pika.art', icon: '✨', category: '视频生成', description: 'AI视频生成工具，快速将文本或图片转换为短视频', order: 8 },
    { id: '10', name: 'GitHub Copilot', url: 'https://github.com/features/copilot', icon: '👨‍💻', category: '编程助手', description: 'AI代码助手，支持多种编程语言，实时代码补全', order: 9 },
    { id: '11', name: 'Cursor', url: 'https://cursor.sh', icon: '🖱️', category: '编程助手', description: 'AI驱动的代码编辑器，支持智能重构和代码解释', order: 10 },
    { id: '12', name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: '🎙️', category: '语音合成', description: 'AI语音合成工具，生成自然流畅的多语言语音', order: 11 },
    { id: '13', name: 'Notion AI', url: 'https://www.notion.so', icon: '📝', category: '办公效率', description: '集成AI助手的笔记工具，支持智能写作和知识管理', order: 12 },
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaultTools, null, 2), 'utf-8');
}

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== 前台API（公开） ==========

// 获取所有工具
app.get('/api/tools', (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    tools.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json({ success: true, data: tools });
  } catch (e) {
    res.status(500).json({ success: false, error: '读取数据失败' });
  }
});

// 获取所有分类
app.get('/api/categories', (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const categories = ['全部', ...new Set(tools.map(t => t.category))];
    res.json({ success: true, data: categories });
  } catch (e) {
    res.status(500).json({ success: false, error: '读取数据失败' });
  }
});

// ========== 管理后台API（需要密码） ==========

// 验证密码中间件
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || token !== `Bearer ${adminPassword}`) {
    return res.status(401).json({ success: false, error: '未授权' });
  }
  next();
}

// 登录
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === adminPassword) {
    res.json({ success: true, token: adminPassword });
  } else {
    res.status(401).json({ success: false, error: '密码错误' });
  }
});

// 修改密码
app.post('/api/admin/change-password', authMiddleware, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (oldPassword !== adminPassword) {
    return res.status(400).json({ success: false, error: '原密码错误' });
  }
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ success: false, error: '新密码至少4位' });
  }
  adminPassword = newPassword;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify({ password: adminPassword }, null, 2), 'utf-8');
  res.json({ success: true, message: '密码修改成功' });
});

// 添加工具
app.post('/api/admin/tools', authMiddleware, (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const { name, url, icon, category, description } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, error: '名称和URL必填' });
    }
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
    fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2), 'utf-8');
    res.json({ success: true, data: newTool });
  } catch (e) {
    res.status(500).json({ success: false, error: '操作失败' });
  }
});

// 更新工具
app.put('/api/admin/tools/:id', authMiddleware, (req, res) => {
  try {
    const tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const idx = tools.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: '工具不存在' });
    }
    const { name, url, icon, category, description, order } = req.body;
    if (name) tools[idx].name = name.trim();
    if (url) tools[idx].url = url.trim();
    if (icon) tools[idx].icon = icon.trim();
    if (category) tools[idx].category = category.trim();
    if (description !== undefined) tools[idx].description = description.trim();
    if (order !== undefined) tools[idx].order = order;
    fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2), 'utf-8');
    res.json({ success: true, data: tools[idx] });
  } catch (e) {
    res.status(500).json({ success: false, error: '操作失败' });
  }
});

// 删除工具
app.delete('/api/admin/tools/:id', authMiddleware, (req, res) => {
  try {
    let tools = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const idx = tools.findIndex(t => t.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: '工具不存在' });
    }
    const deleted = tools.splice(idx, 1)[0];
    fs.writeFileSync(DATA_FILE, JSON.stringify(tools, null, 2), 'utf-8');
    res.json({ success: true, data: deleted });
  } catch (e) {
    res.status(500).json({ success: false, error: '操作失败' });
  }
});

// 前台首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 管理后台
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🤖 AI工具导航后台已启动！
  🌐 前台地址: http://localhost:${PORT}
  🔧 管理后台: http://localhost:${PORT}/admin
  🔑 默认密码: ${adminPassword}
  `);
});
