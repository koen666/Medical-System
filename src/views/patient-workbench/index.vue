<template>
  <div class="ai-diagnosis-chat">
    <!-- 左侧导航栏 -->
    <aside class="left-navigation">
      <div class="nav-header">
        <div class="logo">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
                  fill="currentColor" opacity="0.2"/>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-3.82-.94-6.5-4.53-6.5-8.5V8.3l6.5-3.16 6.5 3.16V12c0 3.97-2.68 7.56-6.5 8.5z" 
                  fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        </div>
        <h1 class="app-title">AI 智能诊断</h1>
      </div>

      <nav class="nav-menu">
        <div 
          v-for="item in navigationItems" 
          :key="item.key"
          class="nav-item"
          :class="{ active: activeNav === item.key }"
          @click="activeNav = item.key"
        >
          <div class="nav-icon" v-html="item.icon"></div>
          <div class="nav-content">
            <span class="nav-label">{{ item.label }}</span>
            <span class="nav-desc">{{ item.desc }}</span>
          </div>
        </div>
      </nav>

      <div class="nav-footer">
        <button class="knowledge-base-btn" @click="goToKnowledgeBase">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" fill="currentColor"/>
          </svg>
          知识库浏览
        </button>
      </div>
    </aside>

    <!-- 中间对话区域 -->
    <main class="chat-main">
      <!-- 对话消息区（可滚动） -->
      <div class="messages-container" ref="messagesContainer">
        <div class="messages-wrapper">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <h2>欢迎使用 AI 智能诊断助手</h2>
            <p>请输入患者信息，我将为您提供专业的诊断分析</p>
            <div class="quick-examples">
              <div class="example-item" @click="useExample(0)">
                <span>示例：头痛患者</span>
              </div>
              <div class="example-item" @click="useExample(1)">
                <span>示例：发热咳嗽</span>
              </div>
            </div>
          </div>

          <!-- 对话消息列表 -->
          <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="msg.role">
            <!-- 用户消息 -->
            <div v-if="msg.role === 'user'" class="user-message">
              <div class="message-avatar user-avatar">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <div class="message-bubble user-bubble">
                <p class="message-text">{{ msg.content }}</p>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>

            <!-- AI 响应消息 -->
            <div v-else class="ai-message">
              <div class="message-avatar ai-avatar">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <div class="message-content ai-content">
                <!-- AI 响应卡片 -->
                <div class="ai-response-card">
                  <div class="response-header">
                    <span class="ai-badge">AI 诊断助手</span>
                    <span class="message-time">{{ msg.time }}</span>
                  </div>

                  <!-- 知识图谱展示 -->
                  <div class="graph-section">
                    <div class="section-title">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
                              fill="currentColor"/>
                      </svg>
                      知识图谱关联
                    </div>
                    <div class="graph-container">
                      <svg viewBox="0 0 600 300" class="knowledge-graph">
                        <!-- 中心节点 -->
                        <g class="node-group central">
                          <circle cx="300" cy="150" r="35" class="node-circle"/>
                          <text x="300" y="155" text-anchor="middle" class="node-label">症状集</text>
                        </g>
                        <!-- 症状节点 -->
                        <g class="node-group symptom">
                          <circle cx="180" cy="80" r="28" class="node-circle"/>
                          <text x="180" y="85" text-anchor="middle" class="node-label" font-size="11">{{ msg.keywords?.[0] || '头痛' }}</text>
                        </g>
                        <g class="node-group symptom">
                          <circle cx="420" cy="80" r="28" class="node-circle"/>
                          <text x="420" y="85" text-anchor="middle" class="node-label" font-size="11">{{ msg.keywords?.[1] || '发热' }}</text>
                        </g>
                        <g class="node-group symptom">
                          <circle cx="120" cy="150" r="24" class="node-circle"/>
                          <text x="120" y="155" text-anchor="middle" class="node-label" font-size="10">{{ msg.keywords?.[2] || '呕吐' }}</text>
                        </g>
                        <g class="node-group symptom">
                          <circle cx="480" cy="150" r="24" class="node-circle"/>
                          <text x="480" y="155" text-anchor="middle" class="node-label" font-size="10">{{ msg.keywords?.[3] || '恶心' }}</text>
                        </g>
                        <!-- 疾病节点 -->
                        <g class="node-group disease">
                          <circle cx="180" cy="240" r="32" class="node-circle"/>
                          <text x="180" y="245" text-anchor="middle" class="node-label" font-size="11">偏头痛</text>
                        </g>
                        <g class="node-group disease">
                          <circle cx="420" cy="240" r="32" class="node-circle"/>
                          <text x="420" y="245" text-anchor="middle" class="node-label" font-size="11">脑膜炎</text>
                        </g>
                        <!-- 连接线 -->
                        <line x1="275" y1="125" x2="200" y2="100" class="edge" stroke-width="2.5"/>
                        <line x1="325" y1="125" x2="400" y2="100" class="edge" stroke-width="2.5"/>
                        <line x1="270" y1="150" x2="144" y2="150" class="edge" stroke-width="2"/>
                        <line x1="330" y1="150" x2="456" y2="150" class="edge" stroke-width="2"/>
                        <line x1="275" y1="175" x2="200" y2="215" class="edge" stroke-width="3.5"/>
                        <line x1="325" y1="175" x2="400" y2="215" class="edge" stroke-width="2"/>
                      </svg>
                    </div>
                  </div>

                  <!-- 病历分析 -->
                  <div class="analysis-section">
                    <div class="section-title">
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" 
                              fill="currentColor"/>
                      </svg>
                      病历分析报告
                      <span class="confidence-badge">置信度: {{ msg.confidence || 87 }}%</span>
                    </div>

                    <!-- 诊断建议 -->
                    <div class="diagnosis-block">
                      <h4>诊断建议</h4>
                      <div class="diagnosis-items">
                        <div 
                          v-for="(d, idx) in (msg.diagnosis || defaultDiagnosis)" 
                          :key="idx"
                          class="diagnosis-card"
                          :class="`priority-${d.priority}`"
                        >
                          <div class="diag-header">
                            <span class="diag-rank">#{{ idx + 1 }}</span>
                            <span class="diag-name">{{ d.name }}</span>
                            <span class="diag-prob">{{ d.probability }}%</span>
                          </div>
                          <p class="diag-desc">{{ d.reason }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- 检查建议 -->
                    <div class="recommendations-block">
                      <h4>建议检查项目</h4>
                      <div class="rec-tags">
                        <span 
                          v-for="(rec, idx) in (msg.recommendations || defaultRecommendations)" 
                          :key="idx"
                          class="rec-tag"
                          :class="rec.priority"
                        >{{ rec.name }}</span>
                      </div>
                    </div>

                    <!-- 注意事项 -->
                    <div class="notes-block">
                      <h4>临床注意事项</h4>
                      <ul class="notes-list">
                        <li v-for="(note, idx) in (msg.notes || defaultNotes)" :key="idx">{{ note }}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 思考中 -->
          <div v-if="isAiThinking" class="message-item assistant">
            <div class="ai-message">
              <div class="message-avatar ai-avatar">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
                        fill="currentColor"/>
                </svg>
              </div>
              <div class="thinking-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关键词提取栏 -->
      <div class="keywords-bar" v-if="extractedKeywords.length > 0">
        <div class="keywords-header">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" 
                  fill="currentColor"/>
          </svg>
          <span>关键词提取</span>
          <span class="keywords-count">{{ extractedKeywords.length }} 项</span>
        </div>
        <div class="keywords-list">
          <div 
            v-for="(kw, index) in extractedKeywords" 
            :key="index"
            class="keyword-tag"
            :class="`intensity-${kw.intensity}`"
          >
            <span class="kw-text">{{ kw.text }}</span>
            <span class="kw-category">{{ kw.category }}</span>
          </div>
        </div>
      </div>

      <!-- 底部输入区 -->
      <div class="input-area">
        <div class="input-container">
          <div class="input-tools">
            <button class="tool-btn" @click="handleVoiceInput" :class="{ active: isRecording }" title="语音输入">语音输入</button>
            <button class="tool-btn" @click="handleUpload" title="上传病历">上传病历</button>
          </div>
          
          <textarea 
            ref="chatInput"
            v-model="userInput" 
            class="chat-input"
            placeholder="请描述患者信息...（Ctrl + Enter 发送）"
            @keydown.ctrl.enter="sendMessage"
            @input="handleInputChange"
            rows="1"
          ></textarea>
          
          <button class="send-button" @click="sendMessage" :disabled="!userInput.trim()">
            发送
          </button>
        </div>
      </div>
    </main>

    <!-- 右侧诊断进度 -->
    <aside class="right-progress">
      <div class="progress-header">
        <h3>诊断进度</h3>
        <span class="progress-percentage">{{ progressPercentage }}%</span>
      </div>
      
      <div class="progress-timeline">
        <div 
          v-for="(step, index) in diagnosisSteps" 
          :key="step.id"
          class="progress-step"
          :class="{ 
            completed: step.status === 'completed',
            active: step.status === 'active',
            pending: step.status === 'pending'
          }"
        >
          <div class="step-indicator">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-connector" v-if="index < diagnosisSteps.length - 1"></div>
          </div>
          <div class="step-content">
            <h4 class="step-title">{{ step.title }}</h4>
            <p class="step-desc">{{ step.desc }}</p>
            <div v-if="step.status === 'completed'" class="step-timestamp">
              {{ step.timestamp }}
            </div>
          </div>
        </div>
      </div>

      <div class="progress-actions">
        <button class="progress-btn" @click="handleExport">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" fill="currentColor"/>
          </svg>
          导出报告
        </button>
        <button class="progress-btn secondary" @click="clearChat">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
          清空对话
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 导航
const activeNav = ref('diagnosis')
const navigationItems = ref([
  {
    key: 'diagnosis',
    label: '智能诊断',
    desc: 'AI辅助诊断',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>`
  },
  {
    key: 'records',
    label: '病历管理',
    desc: '历史记录',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>`
  },
  {
    key: 'analytics',
    label: '数据分析',
    desc: '统计报表',
    icon: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor"/></svg>`
  }
])

// 对话消息
const messages = ref([])
const userInput = ref('')
const isAiThinking = ref(false)
const messagesContainer = ref(null)
const chatInput = ref(null)

// 关键词提取
const extractedKeywords = ref([])

// 语音和上传
const isRecording = ref(false)

// 默认数据
const defaultDiagnosis = [
  {
    name: '偏头痛（无先兆）',
    probability: 87,
    priority: 'high',
    reason: '患者主诉搏动性头痛，伴恶心呕吐、畏光，符合偏头痛典型表现'
  },
  {
    name: '病毒性脑膜炎',
    probability: 46,
    priority: 'medium',
    reason: '发热伴头痛，需排除颅内感染可能'
  },
  {
    name: '颈源性头痛',
    probability: 31,
    priority: 'low',
    reason: '需结合颈部体格检查及影像学资料'
  }
]

const defaultRecommendations = [
  { name: '血常规检查', priority: 'high' },
  { name: '头颅CT/MRI', priority: 'high' },
  { name: 'C反应蛋白', priority: 'medium' },
  { name: '脑脊液检查', priority: 'medium' }
]

const defaultNotes = [
  '密切观察患者体温变化，注意有无颈项强直等脑膜刺激征',
  '询问既往偏头痛病史及家族史，评估发作频率和诱因',
  '建议完善神经系统查体，排除局灶性神经功能缺损'
]

// 示例数据
const examples = [
  '患者张三，男性，45岁，主诉头痛3天，伴有发热38.5℃、恶心、呕吐。既往高血压病史5年，规律服药。',
  '患者李四，女性，28岁，发热2天，体温39℃，伴咳嗽、咽痛、全身乏力。无既往病史。'
]

// 诊断进度
const diagnosisSteps = ref([
  { id: 1, title: '信息采集', desc: '患者信息录入', status: 'pending', timestamp: '' },
  { id: 2, title: '关键词提取', desc: 'AI智能分析', status: 'pending', timestamp: '' },
  { id: 3, title: '图谱关联', desc: '知识图谱检索', status: 'pending', timestamp: '' },
  { id: 4, title: '诊断建议', desc: '生成分析报告', status: 'pending', timestamp: '' },
  { id: 5, title: '方案输出', desc: '治疗方案生成', status: 'pending', timestamp: '' }
])

const progressPercentage = computed(() => {
  const completed = diagnosisSteps.value.filter(s => s.status === 'completed').length
  const active = diagnosisSteps.value.filter(s => s.status === 'active').length
  return Math.round(((completed + active * 0.5) / diagnosisSteps.value.length) * 100)
})

// 方法
const goToKnowledgeBase = () => {
  router.push('/knowledge-base')
}

const useExample = (index) => {
  userInput.value = examples[index]
  nextTick(() => {
    sendMessage()
  })
}

const getCurrentTime = () => {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  let finalText = userInput.value
  let imageText = ''

  // 如果有待处理的图片，先识别图片文字（必须等待完成）
  if (pendingImageFile) {
    try {
      ElMessage.info('正在识别图片中的文字，请稍候...')
      const formData = new FormData()
      // 字段名必须为 'image'，文件对象直接传入
      formData.append('image', pendingImageFile, pendingImageFile.name)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000)
      const resp = await fetch('http://8.138.92.166:8000/image2text', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      const data = await resp.json()
      if (resp.ok && data && data.text) {
        imageText = data.text
        const fileMarkerPattern = /\[已上传图片:.*?\]\n/g
        const userText = finalText.replace(fileMarkerPattern, '').trim()
        finalText = imageText + (userText ? '\n' + userText : '')
        ElMessage.success(`图片文字识别完成: ${imageText.substring(0, 20)}...`)
      } else {
        ElMessage.error((data && data.error) || '图片识别失败，仅使用输入文字')
        finalText = finalText.replace(/\[已上传图片:.*?\]\n/g, '').trim()
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        ElMessage.error('图片识别超时，请检查网络或稍后重试')
      } else {
        ElMessage.error('图片识别出错: ' + err.message)
      }
      finalText = finalText.replace(/\[已上传图片:.*?\]\n/g, '').trim()
    } finally {
      pendingImageFile = null
    }
  }

  // 检查是否有有效文本
  if (!finalText.trim()) {
    ElMessage.warning('没有可用的文本内容')
    return
  }

  const userMessage = {
    role: 'user',
    content: finalText,
    time: getCurrentTime()
  }

  messages.value.push(userMessage)
  const inputText = finalText
  userInput.value = ''
  
  // 重置输入框高度
  nextTick(() => {
    if (chatInput.value) {
      chatInput.value.style.height = '24px'
    }
  })

  // 滚动到底部
  scrollToBottom()

  // 更新进度
  updateDiagnosisStep(1, 'completed')
  updateDiagnosisStep(2, 'active')

  // 提取关键词（使用合并后的文本）
  // 注意：这里已经是在图片识别完成之后才执行
  setTimeout(() => {
    extractKeywords(inputText)
    updateDiagnosisStep(2, 'completed')
    updateDiagnosisStep(3, 'active')
  }, 800)

  // 显示AI思考
  isAiThinking.value = true
  scrollToBottom()

  // 模拟AI响应
  setTimeout(() => {
    updateDiagnosisStep(3, 'completed')
    updateDiagnosisStep(4, 'active')

    setTimeout(() => {
      isAiThinking.value = false
      
      const aiMessage = {
        role: 'assistant',
        time: getCurrentTime(),
        keywords: extractedKeywords.value.slice(0, 4).map(k => k.text),
        confidence: 87,
        diagnosis: defaultDiagnosis,
        recommendations: defaultRecommendations,
        notes: defaultNotes
      }

      messages.value.push(aiMessage)
      
      updateDiagnosisStep(4, 'completed')
      updateDiagnosisStep(5, 'active')
      
      setTimeout(() => {
        updateDiagnosisStep(5, 'completed')
      }, 1000)

      scrollToBottom()
    }, 1500)
  }, 2000)
}

const extractKeywords = async (text) => {
  try {
    const resp = await fetch('http://8.138.92.166:8000/extract_keywords', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })
    const data = await resp.json()
    if (resp.ok && data && data.keywords) {
      const keywordsStr = data.keywords
      const keywordsList = keywordsStr.split(/[,，]/).map(k => k.trim()).filter(k => k)
      const keywords = keywordsList.map((keyword, index) => {
        let category = '症状'
        let intensity = 'medium'
        if (keyword.includes('岁')) category = '年龄'
        else if (keyword.includes('男') || keyword.includes('女')) category = '性别'
        else if (keyword.includes('天') || keyword.includes('周') || keyword.includes('月')) category = '病程'
        if (keyword.includes('严重') || keyword.includes('剧烈') || keyword.includes('高热')) intensity = 'high'
        else if (keyword.includes('轻微') || keyword.includes('轻度')) intensity = 'low'
        return {
          text: keyword,
          intensity: intensity,
          category: category,
          confidence: 0.95 - index * 0.05
        }
      })
      extractedKeywords.value = keywords
    } else {
      extractKeywordsLocally(text)
    }
  } catch (err) {
    extractKeywordsLocally(text)
  }
}

const extractKeywordsLocally = (text) => {
  // 简单的关键词提取模拟（作为备用方案）
  const keywords = []
  
  if (text.includes('头痛') || text.includes('头疼')) {
    keywords.push({ text: '头痛', intensity: 'high', category: '症状', confidence: 0.95 })
  }
  if (text.includes('发热') || text.includes('发烧')) {
    keywords.push({ text: '发热', intensity: 'high', category: '症状', confidence: 0.92 })
  }
  if (text.includes('呕吐')) {
    keywords.push({ text: '呕吐', intensity: 'medium', category: '症状', confidence: 0.88 })
  }
  if (text.includes('恶心')) {
    keywords.push({ text: '恶心', intensity: 'medium', category: '症状', confidence: 0.85 })
  }
  if (text.includes('咳嗽')) {
    keywords.push({ text: '咳嗽', intensity: 'medium', category: '症状', confidence: 0.83 })
  }
  if (text.includes('咽痛') || text.includes('喉咙痛')) {
    keywords.push({ text: '咽痛', intensity: 'medium', category: '症状', confidence: 0.80 })
  }
  if (text.includes('乏力') || text.includes('疲劳')) {
    keywords.push({ text: '乏力', intensity: 'low', category: '症状', confidence: 0.75 })
  }

  // 提取年龄
  const ageMatch = text.match(/(\d+)\s*岁/)
  if (ageMatch) {
    keywords.push({ text: `${ageMatch[1]}岁`, intensity: 'medium', category: '年龄', confidence: 0.99 })
  }

  // 提取性别
  if (text.includes('男性') || text.includes('男，')) {
    keywords.push({ text: '男性', intensity: 'medium', category: '性别', confidence: 0.99 })
  } else if (text.includes('女性') || text.includes('女，')) {
    keywords.push({ text: '女性', intensity: 'medium', category: '性别', confidence: 0.99 })
  }

  // 提取病程
  const durationMatch = text.match(/(\d+)\s*天/)
  if (durationMatch) {
    keywords.push({ text: `${durationMatch[1]}天`, intensity: 'medium', category: '病程', confidence: 0.95 })
  }

  extractedKeywords.value = keywords
}

// 自动调整输入框高度
const handleInputChange = () => {
  nextTick(() => {
    if (chatInput.value) {
      // 重置高度以获取正确的 scrollHeight
      chatInput.value.style.height = 'auto'
      
      // 计算新高度
      const scrollHeight = chatInput.value.scrollHeight
      const lineHeight = 24 // 单行高度（与 CSS 中的 line-height 对应）
      const maxHeight = 200 // 最大高度约 8-9 行
      
      // 如果内容高度大于一行，则自动调整
      if (scrollHeight > lineHeight) {
        chatInput.value.style.height = Math.min(scrollHeight, maxHeight) + 'px'
      } else {
        chatInput.value.style.height = lineHeight + 'px'
      }
    }
  })
}

const handleVoiceInput = async () => {
  if (!isRecording.value) {
    // 开始录音
    try {
      isRecording.value = true
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // 优先尝试浏览器支持的 wav/mp3，否则用 webm
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      } else if (MediaRecorder.isTypeSupported('audio/mp3')) {
        mimeType = 'audio/mp3';
      }
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      const audioChunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // 取 mimeType 后缀
        let ext = 'webm';
        if (mimeType === 'audio/wav') ext = 'wav';
        if (mimeType === 'audio/mp3') ext = 'mp3';
        const audioBlob = new Blob(audioChunks, { type: mimeType })
        stream.getTracks().forEach(track => track.stop())
        try {
          ElMessage.info('正在识别语音...')
          const formData = new FormData()
          // 字段名 audio，文件名带后缀
          formData.append('audio', audioBlob, `recording.${ext}`)
          const resp = await fetch('http://8.138.92.166:8000/audio2text', {
            method: 'POST',
            body: formData
          })
          let data = null
          try {
            data = await resp.json()
          } catch (e) {
            ElMessage.error('后端未返回有效 JSON')
            return
          }
          if (resp.ok && data && data.text) {
            userInput.value = data.text
            ElMessage.success('语音识别完成')
          } else {
            ElMessage.error((data && data.error) || '语音识别失败')
          }
        } catch (err) {
          console.error(err)
          ElMessage.error('语音识别过程出错')
        }
      }

      window._currentMediaRecorder = mediaRecorder
      mediaRecorder.start()
      ElMessage.info('录音中，再次点击停止')
    } catch (err) {
      console.error(err)
      ElMessage.error('无法访问麦克风，请检查权限')
      isRecording.value = false
    }
  } else {
    if (window._currentMediaRecorder && window._currentMediaRecorder.state !== 'inactive') {
      window._currentMediaRecorder.stop()
    }
    isRecording.value = false
  }
}

// 存储待处理的图片文件
let pendingImageFile = null

const handleUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.bmp'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 检查是否为图片文件
    const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp']
    if (imageTypes.includes(file.type)) {
      // 保存图片文件，等待用户发送时再识别
      pendingImageFile = file
      
      // 在输入框前面添加文件标记（保留原有内容）
      const prefix = `[已上传图片: ${file.name}]\n`
      if (!userInput.value.includes(prefix)) {
        userInput.value = prefix + userInput.value
      }
      
      ElMessage.success(`已添加图片: ${file.name}，可继续输入文字后按回车发送`)
    } else {
      // 其他文件类型（PDF、Word 等）暂时使用模拟数据
      userInput.value = `[已上传文件: ${file.name}]\n\n` + examples[0]
      ElMessage.info('已上传文件，暂时使用模拟数据')
    }
  }
  input.click()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const updateDiagnosisStep = (stepId, status) => {
  const step = diagnosisSteps.value.find(s => s.id === stepId)
  if (step) {
    step.status = status
    if (status === 'completed') {
      step.timestamp = getCurrentTime()
    }
  }
}

const handleExport = async () => {
  try {
    // 从最后一条消息中获取诊断信息
    const lastMessage = messages.value[messages.value.length - 1]
    // 兼容 role 字段判断
    if (!lastMessage || lastMessage.role !== 'assistant') {
      ElMessage.warning('请先进行诊断分析')
      return
    }

    // 收集患者信息
    const patientInfo = '患者基本信息待补充'
    
    // 收集症状关键词
    const keywords = extractedKeywords.value
      .map(k => k.text)
      .join(', ')
    
    if (!keywords) {
      ElMessage.warning('未提取到症状关键词')
      return
    }
    
    // 收集可能的疾病
    const diseases = lastMessage.diagnosis
      ? lastMessage.diagnosis.slice(0, 3).map(d => d.name).join(', ')
      : '待进一步诊断'
    
    ElMessage.info('正在生成诊断报告...')
    
    const resp = await fetch('http://8.138.92.166:8000/generate_report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patient_info: patientInfo,
        keywords: keywords,
        diseases: diseases
      })
    })
    const data = await resp.json()
    if (resp.ok && data && data.report) {
      alert(`诊断报告\n\n${data.report}`)
      ElMessage.success('报告生成成功')
    } else {
      ElMessage.error((data && data.error) || '报告生成失败')
    }
  } catch (err) {
    console.error(err)
    ElMessage.error('生成报告时出错')
  }
}

const clearChat = () => {
  if (messages.value.length === 0) return
  
  if (confirm('确定要清空所有对话吗？')) {
    messages.value = []
    extractedKeywords.value = []
    diagnosisSteps.value.forEach(step => {
      step.status = 'pending'
      step.timestamp = ''
    })
  }
}
</script>

<style scoped>
/* ===== 全局布局 ===== */
.ai-diagnosis-chat {
  display: flex;
  height: 100vh;
  background: #ffffff;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* ===== 左侧导航栏 ===== */
.left-navigation {
  width: 260px;
  background: #ffffff;
  color: #1f1f1f;
  display: flex;
  flex-direction: column;
  box-shadow: none;
  border-right: 1px solid #e5e5e5;
  z-index: 100;
  flex-shrink: 0;
}

.nav-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}

.logo {
  color: #1f1f1f;
  margin-bottom: 12px;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.5px;
  color: #1f1f1f;
}

.nav-menu {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 2px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  background: transparent;
  color: #6b6b6b;
}

.nav-item:hover {
  background: #f5f5f5;
  color: #1f1f1f;
}

.nav-item.active {
  background: #f0f0f0;
  color: #1f1f1f;
}

.nav-icon {
  color: #6b6b6b;
  flex-shrink: 0;
  font-size: 18px;
}

.nav-item.active .nav-icon {
  color: #1f1f1f;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

.nav-desc {
  font-size: 11px;
  opacity: 0.6;
}

.nav-footer {
  padding: 16px 12px;
  border-top: 1px solid #e5e5e5;
}

.knowledge-base-btn {
  width: 100%;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  color: #1f1f1f;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.knowledge-base-btn:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

/* ===== 中间聊天区域 ===== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 0;
}

/* 消息容器 */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #ffffff;
}

.messages-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: #6b6b6b;
}

.welcome-icon {
  margin-bottom: 20px;
  color: #1f1f1f;
}

.welcome-message h2 {
  font-size: 24px;
  color: #1f1f1f;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.welcome-message p {
  font-size: 16px;
  margin: 0 0 30px 0;
}

.quick-examples {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.example-item {
  padding: 12px 24px;
  background: #ffffff;
  color: #1f1f1f;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid #e5e5e5;
}

.example-item:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

/* 消息项 */
.message-item {
  margin-bottom: 24px;
  animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-message,
.ai-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: none;
}

.user-avatar {
  background: #1f1f1f;
  color: white;
}

.ai-avatar {
  background: #f0f0f0;
  color: #1f1f1f;
  border: 1px solid #e5e5e5;
}

/* 用户消息气泡 */
.message-bubble {
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.user-bubble {
  background: #1f1f1f;
  color: white;
  border-top-right-radius: 4px;
}

.message-text {
  margin: 0;
  line-height: 1.6;
  font-size: 14px;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
}

/* AI 响应内容 */
.message-content {
  flex: 1;
  max-width: 85%;
}

.ai-response-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
  box-shadow: none;
}

.response-header {
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-badge {
  font-size: 12px;
  font-weight: 500;
  color: #6b6b6b;
  padding: 4px 10px;
  background: #f5f5f5;
  border-radius: 12px;
}

/* 知识图谱部分 */
.graph-section {
  padding: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 16px;
}

.section-title svg {
  color: #6b6b6b;
}

.confidence-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: #1f1f1f;
  padding: 4px 10px;
  background: #f5f5f5;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}

.graph-container {
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e5e5;
}

.knowledge-graph {
  width: 100%;
  height: auto;
  display: block;
}

.node-group {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-group:hover .node-circle {
  filter: brightness(1.1);
}

.node-group.central .node-circle {
  fill: rgba(52, 152, 219, 0.15);
  stroke: #3498db;
  stroke-width: 2.5;
}

.node-group.symptom .node-circle {
  fill: rgba(46, 204, 113, 0.15);
  stroke: #2ecc71;
  stroke-width: 2;
}

.node-group.disease .node-circle {
  fill: rgba(231, 76, 60, 0.15);
  stroke: #e74c3c;
  stroke-width: 2;
}

.node-label {
  font-size: 12px;
  font-weight: 600;
  fill: #2c3e50;
  pointer-events: none;
}

.edge {
  stroke: #3498db;
  opacity: 0.5;
}

/* 病历分析部分 */
.analysis-section {
  padding: 20px;
}

.diagnosis-block,
.recommendations-block,
.notes-block {
  margin-bottom: 20px;
}

.diagnosis-block:last-child,
.recommendations-block:last-child,
.notes-block:last-child {
  margin-bottom: 0;
}

.diagnosis-block h4,
.recommendations-block h4,
.notes-block h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
}

.diagnosis-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.diagnosis-card {
  padding: 12px;
  border-radius: 8px;
  border-left: 3px solid;
  background: #fafafa;
  transition: all 0.15s ease;
}

.diagnosis-card:hover {
  background: #f5f5f5;
}

.diagnosis-card.priority-high {
  border-color: #1f1f1f;
  background: #fafafa;
}

.diagnosis-card.priority-medium {
  border-color: #6b6b6b;
  background: #fafafa;
}

.diagnosis-card.priority-low {
  border-color: #d0d0d0;
}

.diag-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.diag-rank {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #1f1f1f;
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diag-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.diag-prob {
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
}

.diag-desc {
  font-size: 12px;
  color: #6b6b6b;
  line-height: 1.6;
  margin: 0;
}

.rec-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rec-tag {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid;
}

.rec-tag.high {
  background: #fee;
  color: #e74c3c;
  border-color: #e74c3c;
}

.rec-tag.medium {
  background: #fff8e1;
  color: #f39c12;
  border-color: #f39c12;
}

.rec-tag.low {
  background: #f8f9fa;
  color: #7f8c8d;
  border-color: #e0e6ed;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notes-list li {
  padding: 8px 12px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-left: 3px solid #3498db;
  border-radius: 4px;
  font-size: 12px;
  color: #2c3e50;
  line-height: 1.6;
}

.notes-list li:last-child {
  margin-bottom: 0;
}

/* AI 思考中 */
.thinking-indicator {
  display: flex;
  gap: 6px;
  padding: 16px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e0e6ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.thinking-indicator .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3498db;
  animation: thinking 1.4s infinite;
}

.thinking-indicator .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-indicator .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* 关键词栏 */
.keywords-bar {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e0e6ed;
  border-bottom: 1px solid #e0e6ed;
}

.keywords-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #7f8c8d;
}

.keywords-header svg {
  color: #3498db;
}

.keywords-count {
  margin-left: auto;
  padding: 2px 8px;
  background: #3498db;
  color: white;
  border-radius: 10px;
  font-size: 11px;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 1200px;
  margin: 0 auto;
}

.keyword-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.keyword-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.keyword-tag.intensity-high {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

.keyword-tag.intensity-medium {
  background: linear-gradient(135deg, #ffa502 0%, #ff7f50 100%);
  color: white;
}

.keyword-tag.intensity-low {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.kw-text {
  font-weight: 700;
}

.kw-category {
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

/* 底部输入区 */
.input-area {
  padding: 16px 20px;
  background: white;
  border-top: 2px solid #e0e6ed;
}

.input-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: #f8f9fa;
  border: 2px solid #e0e6ed;
  border-radius: 12px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.input-container:focus-within {
  border-color: #3498db;
  background: white;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
}

.input-tools {
  display: flex;
  gap: 6px;
  align-items: center;
}

.tool-btn {
  border: none;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 1px solid #e0e6ed;
  padding: 6px 12px;
  font-size: 13px;
  white-space: nowrap;
}

.tool-btn:hover {
  background: #e9ecef;
  color: #3498db;
}

.tool-btn.active {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
  animation: pulse 1.5s infinite;
}

.chat-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 24px;
  color: #2c3e50;
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 24px;
  max-height: 200px;
  height: 24px;
  padding: 6px 8px;
  overflow-y: auto;
  transition: height 0.1s ease;
}

.chat-input::placeholder {
  color: #95a5a6;
}

/* 输入框滚动条样式 */
.chat-input::-webkit-scrollbar {
  width: 4px;
}

.chat-input::-webkit-scrollbar-track {
  background: transparent;
}

.chat-input::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 2px;
}

.chat-input::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}

/* 统一底部按钮和输入框高度 */
.send-button {
  border: none;
  background: #1f1f1f;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 18px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  box-shadow: none;
  flex-shrink: 0;
  white-space: nowrap;
}

.send-button:hover:not(:disabled) {
  background: #000000;
}

.send-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tool-btn {
  height: 48px;
}
.chat-input {
  min-height: 36px;
}

/* ===== 右侧进度栏 ===== */
.right-progress {
  width: 280px;
  background: white;
  box-shadow: none;
  border-left: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
}

.progress-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e5e5e5;
  text-align: center;
}

.progress-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 8px 0;
}

.progress-percentage {
  font-size: 32px;
  font-weight: 700;
  color: #1f1f1f;
}

.progress-timeline {
  flex: 1;
  padding: 20px;
}

.progress-step {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f5f5;
  color: #a0a0a0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 2px solid #e5e5e5;
}

.progress-step.completed .step-number {
  background: #1f1f1f;
  color: white;
  border-color: #1f1f1f;
  box-shadow: none;
}

.progress-step.active .step-number {
  background: #6b6b6b;
  color: white;
  border-color: #6b6b6b;
  box-shadow: none;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(107, 107, 107, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(107, 107, 107, 0); }
  100% { box-shadow: 0 0 0 0 rgba(107, 107, 107, 0); }
}

.step-connector {
  width: 3px;
  flex: 1;
  background: #e5e5e5;
  margin: 8px 0;
  transition: all 0.2s ease;
}

.progress-step.completed .step-connector {
  background: #1f1f1f;
}

.progress-step.active .step-connector {
  background: linear-gradient(180deg, #6b6b6b 0%, rgba(107, 107, 107, 0.3) 100%);
}

.step-content {
  flex: 1;
  padding-top: 6px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 4px 0;
}

.progress-step.pending .step-title {
  color: #a0a0a0;
}

.step-desc {
  font-size: 12px;
  color: #6b6b6b;
  margin: 0 0 6px 0;
}

.step-timestamp {
  font-size: 11px;
  color: #6b6b6b;
  font-weight: 500;
}

.progress-actions {
  padding: 20px;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.progress-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.progress-btn:not(.secondary) {
  background: #1f1f1f;
  color: white;
  box-shadow: none;
}

.progress-btn:not(.secondary):hover {
  background: #000000;
}

.progress-btn.secondary {
  background: white;
  color: #6b6b6b;
  border: 1px solid #e5e5e5;
}

.progress-btn.secondary:hover {
  background: #f5f5f5;
  border-color: #d0d0d0;
}

/* 滚动条样式 */
.messages-container::-webkit-scrollbar,
.right-progress::-webkit-scrollbar,
.nav-menu::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track,
.right-progress::-webkit-scrollbar-track,
.nav-menu::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.messages-container::-webkit-scrollbar-thumb,
.right-progress::-webkit-scrollbar-thumb,
.nav-menu::-webkit-scrollbar-thumb {
  background: #bdc3c7;
  border-radius: 3px;
}

.messages-container::-webkit-scrollbar-thumb:hover,
.right-progress::-webkit-scrollbar-thumb:hover,
.nav-menu::-webkit-scrollbar-thumb:hover {
  background: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .left-navigation {
    width: 220px;
  }
  
  .right-progress {
    width: 240px;
  }
}

@media (max-width: 1024px) {
  .right-progress {
    display: none;
  }
}

@media (max-width: 768px) {
  .left-navigation {
    width: 180px;
  }
  
  .message-bubble,
  .message-content {
    max-width: 100%;
  }
}
</style>

