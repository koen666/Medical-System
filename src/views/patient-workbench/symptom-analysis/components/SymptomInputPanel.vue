<template>
  <div class="symptom-input-panel">
    <el-tabs v-model="activeTab" stretch>
      <el-tab-pane label="文本输入" name="text">
        <div class="text-input">
          <el-input
            type="textarea"
            v-model="textContent"
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder="请输入或粘贴问诊得到的症状信息，可使用快捷模板"
          />
          <div class="templates" v-if="templates && templates.length">
            <span class="templates-label">快捷模板：</span>
            <el-tag
              v-for="item in templates"
              :key="item.label"
              effect="plain"
              size="small"
              @click="applyTemplate(item.content)"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </div>
        <el-alert
          class="mt-12"
          type="info"
          :closable="false"
          title="系统会自动抽取症状实体，医生可在下方结构化列表中二次校对"
        />
      </el-tab-pane>
      <el-tab-pane label="语音转写" name="voice">
        <div class="voice-input">
          <div class="voice-controls">
            <el-button
              class="mic-btn"
              :class="{ recording: isRecording }"
              :icon="Microphone"
              @click="toggleRecording"
            >
              {{ isRecording ? '停止录音' : '开始录音' }}
            </el-button>

            <span class="voice-status" v-if="isRecording">
              <i class="record-dot"></i>
              录音中 {{ recordDuration }}
            </span>
            <span class="voice-status" v-else-if="uploading">
              <el-icon><Loading /></el-icon>
              正在识别，请稍候…
            </span>
          </div>

          <audio
            v-if="recordedUrl"
            :src="recordedUrl"
            controls
            class="audio-preview"
          ></audio>

          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 10 }"
            v-model="voiceTranscription"
            placeholder="语音转写内容将在此显示，可手动修订"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="病例文档" name="document">
        <div class="document-input">
          <el-upload drag action="#" :show-file-list="false" :auto-upload="false" @change="simulateDocParse">
            <el-icon><UploadFilled /></el-icon>
            <div class="el-upload__text">拖拽文件或点击上传（支持 PDF / Word / 图片）</div>
            <template #tip>
              <div class="el-upload__tip">演示态：上传将注入示例症状列表。</div>
            </template>
          </el-upload>
          <el-timeline v-if="docExtraction.length" class="mt-12">
            <el-timeline-item
              v-for="item in docExtraction"
              :key="item.time"
              :timestamp="item.time"
              placement="top"
            >
              <el-card shadow="never">
                <h4>{{ item.title }}</h4>
                <p>{{ item.content }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="actions">
      <el-button type="primary" :icon="MagicStick" @click="emitExtraction">抽取症状</el-button>
      <el-button :icon="Refresh" @click="resetInputs">重置</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { MagicStick, Refresh, Microphone, Loading, UploadFilled } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SymptomInputPanel',
  components: {
    MagicStick,
    Refresh,
    Microphone,
    Loading,
    UploadFilled
  },
  props: {
    templates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'text',
      textContent: '',
      voiceTranscription: '',
      isRecording: false,
      uploading: false,
      recordStartAt: null,
      recordTimer: null,
      recordDuration: '00:00',
      recordedUrl: '',
      docExtraction: [],
      mediaStream: null,
      mediaRecorder: null,
      audioChunks: []
    }
  },
  methods: {
    startRecordTimer() {
      this.clearRecordTimer()
      this.recordStartAt = Date.now()
      this.recordDuration = '00:00'
      this.recordTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - this.recordStartAt) / 1000)
        const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
        const ss = String(elapsed % 60).padStart(2, '0')
        this.recordDuration = `${mm}:${ss}`
      }, 1000)
    },
    applyTemplate(content) {
      this.textContent = `${this.textContent}\n${content}`.trim()
    },
    async toggleRecording() {
      if (!this.isRecording) {
        await this.startRecording()
      } else {
        await this.stopRecording()
      }
    },
    async startRecording() {
      try {
        this.voiceTranscription = ''
        this.uploading = false
        this.audioChunks = []
        this.recordedUrl = ''
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mimeType = 'audio/webm'
        this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType })
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data)
          }
        }
        this.mediaRecorder.onstop = async () => {
          const blob = new Blob(this.audioChunks, { type: mimeType })
          if (this.recordedUrl) {
            URL.revokeObjectURL(this.recordedUrl)
          }
          this.recordedUrl = URL.createObjectURL(blob)
          await this.uploadAndTranscribe(blob)
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop())
            this.mediaStream = null
          }
          this.clearRecordTimer()
        }

        this.startRecordTimer()
        this.isRecording = true
        this.mediaRecorder.start()
        ElMessage.info('录音已开始')
      } catch (err) {
        console.error(err)
        ElMessage.error('无法开始录音，请检查麦克风权限或浏览器支持')
        this.clearRecordTimer()
      }
    },
    async stopRecording() {
      try {
        if (this.mediaRecorder && this.isRecording) {
          this.isRecording = false
          this.mediaRecorder.stop()
          ElMessage.info('录音已停止，开始识别...')
          this.clearRecordTimer()
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('停止录音失败')
        this.clearRecordTimer()
      }
    },
    clearRecordTimer() {
      if (this.recordTimer) {
        clearInterval(this.recordTimer)
        this.recordTimer = null
      }
      this.recordStartAt = null
    },
    async uploadAndTranscribe(blob) {
      try {
        this.uploading = true
        const form = new FormData()
        form.append('audio', blob, 'recording.webm')
        const resp = await fetch('http://localhost:5000/api/medical/audio2text', {
          method: 'POST',
          body: form
        })
        const data = await resp.json()
        if (resp.ok && data) {
          const raw = data.text || ''
          const cleaned = raw.replace(/^这段音频的原始内容是[:：]\s*/i, '').trim()
          this.voiceTranscription = cleaned
          ElMessage.success('语音识别完成')
        } else {
          ElMessage.error(data?.error || '识别失败')
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('上传或识别过程出错')
      } finally {
        this.uploading = false
      }
    },
    resetInputs() {
      this.textContent = ''
      this.voiceTranscription = ''
      this.docExtraction = []
      if (this.recordedUrl) {
        URL.revokeObjectURL(this.recordedUrl)
        this.recordedUrl = ''
      }
      this.clearRecordTimer()
      ElMessage.info('已重置输入内容')
    },
    async simulateDocParse(uploadFile) {
      const file = uploadFile.raw
      if (!file) {
        ElMessage.warning('未找到文件')
        return
      }

      // 检查是否为图片文件
      const imageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp']
      if (imageTypes.includes(file.type)) {
        await this.extractTextFromImage(file)
      } else {
        // 非图片文件使用模拟数据
        ElMessage.info(`模拟解析 ${file.name}`)
        this.docExtraction = [
          {
            time: '2025-09-24 08:30',
            title: '门诊问诊摘要',
            content: '主诉：48小时搏动性头痛，伴恶心畏光。既往偏头痛史。'
          },
          {
            time: '2025-09-24 09:00',
            title: '体格检查',
            content: '神经系统查体(-)，无颈抵抗。血压 130/85mmHg。'
          }
        ]
      }
    },
    async extractTextFromImage(file) {
      try {
        ElMessage.info('正在识别图片中的文字...')
        const form = new FormData()
        form.append('image', file)
        
        const resp = await fetch('http://localhost:5000/api/medical/image2text', {
          method: 'POST',
          body: form
        })
        
        const data = await resp.json()
        if (resp.ok && data && data.text) {
          const currentTime = new Date().toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          }).replace(/\//g, '-')
          
          this.docExtraction = [
            {
              time: currentTime,
              title: '图片文字识别结果',
              content: data.text
            }
          ]
          
          // 将识别的文字也填充到文本输入框
          this.textContent = data.text
          this.activeTab = 'text'
          
          ElMessage.success('图片文字识别完成')
        } else {
          ElMessage.error(data?.error || '图片识别失败')
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('图片识别过程出错')
      }
    },
    buildDemoSymptoms() {
      return [
        {
          code: 'S-0001',
          label: '搏动性头痛',
          severity: '中',
          duration: '48小时',
          side: '双侧',
          weight: 0.8,
          negated: false
        },
        {
          code: 'S-0045',
          label: '恶心伴呕吐',
          severity: '轻',
          duration: '24小时',
          side: '全身',
          weight: 0.6,
          negated: false
        },
        {
          code: 'S-0120',
          label: '畏光',
          severity: '轻',
          duration: '48小时',
          side: '双眼',
          weight: 0.4,
          negated: false
        }
      ]
    },
    async emitExtraction() {
      // 获取当前激活标签页的文本内容
      let inputText = ''
      if (this.activeTab === 'text') {
        inputText = this.textContent
      } else if (this.activeTab === 'voice') {
        inputText = this.voiceTranscription
      } else if (this.activeTab === 'document' && this.docExtraction.length > 0) {
        inputText = this.docExtraction.map(item => item.content).join('\n')
      }

      if (!inputText || !inputText.trim()) {
        ElMessage.warning('请先输入或录入症状信息')
        return
      }

      try {
        ElMessage.info('正在提取症状关键词...')
        
        const resp = await fetch('http://localhost:5000/api/medical/extract_keywords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: inputText })
        })
        
        const data = await resp.json()
        if (resp.ok && data && data.keywords) {
          // 解析关键词字符串为数组
          const keywordsStr = data.keywords
          const keywordsList = keywordsStr.split(/[,，]/).map(k => k.trim()).filter(k => k)
          
          // 转换为症状对象格式
          const symptoms = keywordsList.map((keyword, index) => ({
            code: `S-${String(index + 1).padStart(4, '0')}`,
            label: keyword,
            severity: '中',
            duration: '未指定',
            side: '全身',
            weight: 0.8 - index * 0.1,
            negated: false
          }))
          
          this.$emit('symptoms-extracted', symptoms)
          ElMessage.success(`已提取 ${symptoms.length} 条症状关键词`)
        } else {
          // 如果 API 调用失败，使用演示数据
          ElMessage.warning('关键词提取失败，使用演示数据')
          const sample = this.buildDemoSymptoms()
          this.$emit('symptoms-extracted', sample)
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('提取关键词时出错，使用演示数据')
        const sample = this.buildDemoSymptoms()
        this.$emit('symptoms-extracted', sample)
      }
    }
  },
  beforeUnmount() {
    if (this.recordedUrl) {
      URL.revokeObjectURL(this.recordedUrl)
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop())
    }
    this.clearRecordTimer()
  }
})
</script>

<style scoped lang="scss">
.symptom-input-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .text-input {
    position: relative;

    .templates {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
      align-items: center;

      .templates-label {
        font-size: 12px;
        color: #909399;
      }

      :deep(.el-tag) {
        cursor: pointer;
      }
    }
  }

  .voice-input,
  .document-input {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .helper {
      color: #909399;
      font-size: 13px;
      margin: 0;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .mt-12 {
    margin-top: 12px;
  }

  .voice-input {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .voice-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mic-btn {
      border-radius: 24px;
      padding: 10px 16px;
      transition: all 0.2s ease;
    }
    .mic-btn.recording {
      background: #f56c6c;
      border-color: #f56c6c;
      color: #fff;
      position: relative;
    }
    .mic-btn.recording::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      border-radius: 24px;
      box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.6);
      animation: pulse 1.6s ease-out infinite;
    }

    .voice-status {
      color: #606266;
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .record-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #f56c6c;
      animation: blink 1s linear infinite;
      display: inline-block;
    }

    .audio-preview {
      width: 100%;
      margin-top: 4px;
    }
  }

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.25; }
    100% { opacity: 1; }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.6); }
    70% { box-shadow: 0 0 0 12px rgba(245, 108, 108, 0); }
    100% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
  }
}
</style>
