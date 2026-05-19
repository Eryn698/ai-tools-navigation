const { kv } = require('@vercel/kv');

// 工具列表缓存（读取时优先从KV读取）
const DEFAULT_TOOLS = [
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

// 获取工具列表
async function getTools() {
  try {
    const data = await kv.get('tools');
    if (data) {
      return data;
    }
  } catch (e) {
    // KV未配置时用默认数据
  }
  return DEFAULT_TOOLS;
}

// 保存工具列表
async function saveTools(tools) {
  await kv.set('tools', tools);
}

// 获取密码配置
async function getPassword() {
  try {
    return await kv.get('admin_password') || 'admin123';
  } catch (e) {
    return 'admin123';
  }
}

module.exports = { getTools, saveTools, getPassword, DEFAULT_TOOLS };
