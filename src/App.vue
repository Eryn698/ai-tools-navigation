<template>
  <div :class="isDark ? 'dark' : ''">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- 导航栏 -->
      <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                🤖 AI工具导航
              </h1>
              <button
                @click="isDark = !isDark"
                class="sm:hidden p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg"
              >
                {{ isDark ? '☀️' : '🌙' }}
              </button>
            </div>
            <div class="flex items-center gap-4 flex-1 sm:flex-initial">
              <div class="flex-1 sm:w-96">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索AI工具..."
                  class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button
                @click="isDark = !isDark"
                class="hidden sm:block p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg"
              >
                {{ isDark ? '☀️' : '🌙' }}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- 分类筛选 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- 工具卡片网格 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <a
            v-for="tool in filteredTools"
            :key="tool.name"
            :href="tool.url"
            target="_blank"
            rel="noopener noreferrer"
            class="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 transition-all duration-200"
          >
            <div class="flex items-start gap-4 mb-3">
              <div class="text-4xl">{{ tool.icon }}</div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ tool.name }}
                </h3>
                <span class="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {{ tool.category }}
                </span>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {{ tool.description }}
            </p>
          </a>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredTools.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            没有找到匹配的AI工具 😅
          </p>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
            © 2026 AI工具导航 | 收录优质AI工具，提升工作效率 🚀
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isDark = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('全部')

const tools = ref([
  { name: '星洞AI', url: 'https://x.lk888.ai/', icon: '🌟', category: 'AI聚合平台', description: 'AI大模型聚合平台，支持AI对话、AI绘画、AI视频、AI智能体等多种功能' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '💬', category: '文本生成', description: 'OpenAI开发的强大对话AI，支持写作、编程、翻译等多种任务' },
  { name: 'Claude', url: 'https://claude.ai', icon: '🤖', category: '文本生成', description: 'Anthropic开发的AI助手，擅长长文本分析和安全对话' },
  { name: 'Gemini', url: 'https://gemini.google.com', icon: '💎', category: '文本生成', description: 'Google开发的AI助手，多模态能力强大' },
  { name: 'Midjourney', url: 'https://www.midjourney.com', icon: '🎨', category: '图像生成', description: '顶级AI图像生成工具，艺术风格多样，质量出色' },
  { name: 'Stable Diffusion', url: 'https://stablediffusionweb.com', icon: '🖼️', category: '图像生成', description: '开源AI图像生成模型，支持本地部署和自定义训练' },
  { name: 'DALL·E', url: 'https://openai.com/dall-e', icon: '🎭', category: '图像生成', description: 'OpenAI图像生成工具，支持文本描述生成图片' },
  { name: 'Runway', url: 'https://runwayml.com', icon: '🎬', category: '视频生成', description: 'AI视频编辑和生成工具，支持文本生成视频' },
  { name: 'Pika', url: 'https://pika.art', icon: '✨', category: '视频生成', description: 'AI视频生成工具，快速将文本或图片转换为短视频' },
  { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', icon: '👨‍💻', category: '编程助手', description: 'AI代码助手，支持多种编程语言，实时代码补全' },
  { name: 'Cursor', url: 'https://cursor.sh', icon: '🖱️', category: '编程助手', description: 'AI驱动的代码编辑器，支持智能重构和代码解释' },
  { name: 'ElevenLabs', url: 'https://elevenlabs.io', icon: '🎙️', category: '语音合成', description: 'AI语音合成工具，生成自然流畅的多语言语音' },
  { name: 'Notion AI', url: 'https://www.notion.so', icon: '📝', category: '办公效率', description: '集成AI助手的笔记工具，支持智能写作和知识管理' },
])

const categories = computed(() => {
  return ['全部', ...new Set(tools.value.map(t => t.category))]
})

const filteredTools = computed(() => {
  return tools.value.filter(tool => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.category.toLowerCase().includes(q)
    const matchCat = selectedCategory.value === '全部' || tool.category === selectedCategory.value
    return matchSearch && matchCat
  })
})
</script>
