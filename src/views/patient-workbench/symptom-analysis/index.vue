<template>
  <div class="symptom-analysis-layout">
    <header class="patient-header-section">
      <div class="container">
        <PatientHeader
          :patient="patient"
          :visit-id="patient.visitId"
          @export="handleExport"
          @sync="handleSync"
        />

        <div class="stats-container">
          <div v-for="item in heroStats" :key="item.label" class="stat-card">
            <el-icon v-if="item.icon" class="stat-icon">
              <component :is="item.icon" />
            </el-icon>
            <div class="stat-body">
              <span class="stat-label">{{ item.label }}</span>
              <span class="stat-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="workspace-container">
      <div class="container">
        <aside class="workspace-sidebar">
          <div class="sidebar-header">
            <span class="sidebar-title">分析模块</span>
            <p class="sidebar-desc">根据工作流快速跳转到不同阶段</p>
          </div>

          <el-menu
            :default-active="activeModule"
            class="module-menu"
            @select="handleModuleChange"
            background-color="transparent"
            text-color="#1f2d3d"
            active-text-color="#409eff"
          >
            <el-menu-item v-for="module in moduleMenu" :key="module.key" :index="module.key">
              <el-icon class="menu-icon">
                <component :is="module.icon" />
              </el-icon>
              <div class="menu-content">
                <span class="menu-label">{{ module.label }}</span>
                <span class="menu-desc">{{ module.desc }}</span>
              </div>
            </el-menu-item>
          </el-menu>

          <div class="sidebar-footer">
            <el-alert
              title="提示：本系统仅提供辅助决策，请结合临床经验与检查结果。"
              type="warning"
              show-icon
              :closable="false"
              size="small"
            />
          </div>
        </aside>

        <section class="workspace-content">
          <transition name="module-fade" mode="out-in">
            <component
              :is="activeModuleComponent"
              :key="activeModule"
              v-bind="moduleProps"
              v-on="moduleListeners"
              class="module-content"
            />
          </transition>
        </section>
      </div>
    </main>

    <aside class="side-toolbar-container">
      <SideToolbar
        @density-change="handleDensityChange"
        @open-shortcuts="handleOpenShortcuts"
      />
    </aside>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  EditPen,
  Share,
  DataAnalysis,
  Connection,
  Collection,
  FirstAidKit,
  Timer,
  DataLine
} from '@element-plus/icons-vue'

import PatientHeader from './components/PatientHeader.vue'
import SideToolbar from './components/SideToolbar.vue'
import IntakeModule from './modules/IntakeModule.vue'
import NetworkModule from './modules/NetworkModule.vue'
import InsightModule from './modules/InsightModule.vue'
import FullGraphModule from './modules/FullGraphModule.vue'

const buildTimeline = () => ([
  { key: 'preprocess', title: '预处理', status: 'wait', duration: '≈0.8s' },
  { key: 'graph', title: '图谱检索', status: 'wait', duration: '≈1.2s' },
  { key: 'fusion', title: '融合打分', status: 'wait', duration: '≈1.0s' }
])

export default defineComponent({
  name: 'SymptomAnalysisView',
  components: {
    PatientHeader,
    SideToolbar,
    IntakeModule,
    NetworkModule,
    InsightModule,
    FullGraphModule
  },
  data() {
    return {
      activeModule: 'intake',
      moduleMenu: [
        { key: 'intake', label: '症状录入', desc: '多模态采集与标准化', icon: EditPen },
        { key: 'network', label: '关联图谱', desc: 'Neo4j 证据网络', icon: Share },
        { key: 'insight', label: '诊断洞察', desc: '候选排序与证据', icon: DataAnalysis },
        { key: 'fullgraph', label: '完整图谱', desc: '全部知识图谱可视化', icon: Connection }
      ],
      patient: {
        name: '张某某',
        age: 46,
        gender: '女',
        visitType: '门诊复诊',
        visitTime: '2025-09-25 09:30',
        visitId: 'M-20250925-001',
        allergies: ['青霉素'],
        alerts: ['高血压史', '偏头痛家族史']
      },
      inputTemplates: [
        {
          label: '偏头痛模板',
          content: '持续性搏动性头痛，伴随恶心、畏光，既往偏头痛史。'
        },
        {
          label: '脑供血不足',
          content: '间断性眩晕，站立时加重，伴随上肢麻木。'
        }
      ],
      normalizedSymptoms: [
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
      ],
      analysisParams: {
        alpha: 0.6,
        threshold: 0.35,
        topN: 5,
        age: 46,
        gender: 'F',
        onset: '48h 内',
        trigger: '情绪波动'
      },
      analysisStatus: 'idle',
      analysisTimeline: buildTimeline(),
      analysisTimers: [],
      graphData: {
        nodes: [
          { id: 'S-0001', label: '搏动性头痛', type: 'symptom', value: 0.8 },
          { id: 'S-0045', label: '恶心伴呕吐', type: 'symptom', value: 0.6 },
          { id: 'S-0120', label: '畏光', type: 'symptom', value: 0.4 },
          { id: 'D-1002', label: '偏头痛', type: 'disease', value: 0.9 },
          { id: 'D-1015', label: '脑膜炎', type: 'disease', value: 0.55 },
          { id: 'T-901', label: '颅脑 MRI', type: 'test', value: 0.3 }
        ],
        edges: [
          { source: 'S-0001', target: 'D-1002', weight: 0.8 },
          { source: 'S-0045', target: 'D-1002', weight: 0.6 },
          { source: 'S-0120', target: 'D-1002', weight: 0.5 },
          { source: 'S-0001', target: 'D-1015', weight: 0.3 },
          { source: 'D-1002', target: 'T-901', weight: 0.4 }
        ]
      },
      graphFilters: {
        nodeTypes: ['symptom', 'disease', 'test'],
        threshold: 0.3
      },
      diagnosisCandidates: [
        {
          code: 'D-1002',
          name: '偏头痛（未伴先兆）',
          score: 0.87,
          evidenceCount: 7,
          missingKey: ['神经系统查体'],
          guidelines: ['中华医学会神经病学分会偏头痛诊治指南(2022)']
        },
        {
          code: 'D-1015',
          name: '病毒性脑膜炎',
          score: 0.46,
          evidenceCount: 4,
          missingKey: ['发热', '颈抵抗'],
          guidelines: ['IDSA Viral Meningitis Guideline 2021']
        },
        {
          code: 'D-1302',
          name: '颈源性头痛',
          score: 0.31,
          evidenceCount: 3,
          missingKey: ['颈部影像', '颈部压痛'],
          guidelines: []
        }
      ],
      evidenceMap: {
        'D-1002': {
          matched: [
            { label: '搏动性头痛', weight: 0.8 },
            { label: '恶心伴呕吐', weight: 0.6 },
            { label: '畏光', weight: 0.5 }
          ],
          negatives: ['无发热', '无神经功能缺损'],
          contrib: [
            { label: '图谱证据', value: 0.62 },
            { label: 'LLM 综合评分', value: 0.25 },
            { label: '指南匹配', value: 0.13 }
          ],
          references: [
            {
              title: '2022 偏头痛诊治中国指南',
              url: 'https://example.org/guidelines/migraine-2022'
            },
            {
              title: 'UpToDate: Migraine in Adults',
              url: 'https://example.org/references/migraine-uptodate'
            }
          ]
        },
        'D-1015': {
          matched: [
            { label: '搏动性头痛', weight: 0.3 }
          ],
          negatives: ['缺少发热', '缺少颈抵抗'],
          contrib: [
            { label: '图谱证据', value: 0.28 },
            { label: 'LLM 综合评分', value: 0.18 }
          ],
          references: []
        },
        'D-1302': {
          matched: [
            { label: '搏动性头痛', weight: 0.2 }
          ],
          negatives: ['缺少颈部影像', '无颈部压痛'],
          contrib: [
            { label: '图谱证据', value: 0.12 },
            { label: 'LLM 综合评分', value: 0.19 }
          ],
          references: []
        }
      },
      selectedDisease: 'D-1002'
    }
  },
  computed: {
    activeModuleComponent() {
      const mapping = {
        intake: 'IntakeModule',
        network: 'NetworkModule',
        insight: 'InsightModule',
        fullgraph: 'FullGraphModule'
      }
      return mapping[this.activeModule] || 'IntakeModule'
    },
    moduleProps() {
      switch (this.activeModule) {
        case 'network':
          return {
            graphData: this.graphData,
            graphFilters: this.graphFilters,
            analysisTimeline: this.analysisTimeline,
            analysisStatus: this.analysisStatus
          }
        case 'insight':
          return {
            candidates: this.diagnosisCandidates,
            selected: this.selectedDisease,
            evidenceMap: this.evidenceMap
          }
        case 'fullgraph':
          return {}
        default:
          return {
            templates: this.inputTemplates,
            symptoms: this.normalizedSymptoms,
            params: this.analysisParams
          }
      }
    },
    moduleListeners() {
      switch (this.activeModule) {
        case 'network':
          return {
            'filters-change': this.handleFilterChange
          }
        case 'insight':
          return {
            select: this.handleCandidateSelect
          }
        case 'fullgraph':
          return {}
        default:
          return {
            'symptoms-extracted': this.handleSymptomsExtracted,
            'symptoms-update': this.handleSymptomsUpdate,
            'param-update': this.handleParamUpdate,
            analyze: this.startAnalysis,
            reset: this.resetAnalysis,
            'save-snapshot': this.handleSaveSnapshot
          }
      }
    },
    heroStats() {
      const topCandidate = this.diagnosisCandidates[0]
      return [
        {
          label: '已确认症状',
          value: `${this.normalizedSymptoms.length} 项`,
          icon: Collection
        },
        {
          label: '候选诊断',
          value: `${this.diagnosisCandidates.length} 项`,
          icon: FirstAidKit
        },
        {
          label: '当前进度',
          value: this.analysisStatus === 'done'
            ? '分析完成'
            : this.analysisStatus === 'processing'
              ? '分析进行中'
              : '待分析',
          icon: Timer
        },
        topCandidate && {
          label: '最高置信度',
          value: `${Math.round(topCandidate.score * 100)}%`,
          icon: DataLine
        }
      ].filter(Boolean)
    }
  },
  methods: {
    handleModuleChange(key) {
      this.activeModule = key
    },
    async handleExport() {
      try {
        // 收集患者信息
        const patientInfo = `患者${this.patient.name}，${this.patient.gender}，${this.patient.age}岁`
        
        // 收集症状关键词
        const keywords = this.normalizedSymptoms
          .map(s => s.label)
          .join(', ')
        
        if (!keywords) {
          ElMessage.warning('请先提取症状关键词')
          return
        }
        
        // 收集可能的疾病
        const diseases = this.candidates
          .slice(0, 3)
          .map(c => c.name)
          .join(', ')
        
        ElMessage.info('正在生成诊断报告...')
        
        const resp = await fetch('http://localhost:5000/api/medical/generate_report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            patient_info: patientInfo,
            keywords: keywords,
            diseases: diseases || '待进一步诊断'
          })
        })
        
        const data = await resp.json()
        if (resp.ok && data && data.report) {
          // 显示报告内容
          ElMessageBox.alert(data.report, '诊断报告', {
            confirmButtonText: '确定',
            type: 'info',
            customClass: 'report-message-box'
          })
          ElMessage.success('报告生成成功')
        } else {
          ElMessage.error(data?.error || '报告生成失败')
        }
      } catch (err) {
        console.error(err)
        ElMessage.error('生成报告时出错')
      }
    },
    handleSync() {
      ElMessage.success('示例：写回 EMR 成功')
    },
    handleSymptomsExtracted(symptoms) {
      this.normalizedSymptoms = symptoms
      this.analysisStatus = 'idle'
      this.resetTimeline()
      ElMessage.success(`示例：已抽取 ${symptoms.length} 条症状`)
    },
    handleSymptomsUpdate(symptoms) {
      this.normalizedSymptoms = symptoms
    },
    handleParamUpdate(key, value) {
      this.analysisParams = {
        ...this.analysisParams,
        [key]: value
      }
    },
    startAnalysis() {
      if (!this.normalizedSymptoms.length) {
        ElMessage.warning('请先抽取并确认症状信息')
        return
      }
      this.clearAnalysisTimers()
      this.analysisStatus = 'processing'
      this.analysisTimeline = this.analysisTimeline.map((step, index) => ({
        ...step,
        status: index === 0 ? 'current' : 'wait'
      }))
      ElMessage.info('开始联合分析：模拟触发后台流程')

      const stageUpdates = [
        () => {
          this.updateTimelineStatus(0, 'done')
          this.updateTimelineStatus(1, 'current')
        },
        () => {
          this.updateTimelineStatus(1, 'done')
          this.updateTimelineStatus(2, 'current')
        },
        () => {
          this.updateTimelineStatus(2, 'done')
          this.analysisStatus = 'done'
          ElMessage.success('分析完成（示例数据）')
        }
      ]

      stageUpdates.forEach((fn, idx) => {
        const timer = setTimeout(fn, (idx + 1) * 900)
        this.analysisTimers.push(timer)
      })
    },
    resetAnalysis() {
      this.clearAnalysisTimers()
      this.analysisStatus = 'idle'
      this.resetTimeline()
      ElMessage.info('已重置分析参数（示例）')
    },
    handleFilterChange(filters) {
      this.graphFilters = filters
    },
    handleCandidateSelect(code) {
      this.selectedDisease = code
      this.activeModule = 'insight'
    },
    handleDensityChange() {
      ElMessage.info('布局密度切换仅为示例')
    },
    handleOpenShortcuts() {
      ElMessageBox.alert(
        '示例快捷键：Alt + Shift + A 开始分析，Alt + Shift + S 保存快照。',
        '快捷键 (示例)',
        {
          confirmButtonText: '知道了'
        }
      )
    },
    handleSaveSnapshot() {
      ElMessage.success('示例：已保存当前分析快照')
    },
    updateTimelineStatus(index, status) {
      this.analysisTimeline = this.analysisTimeline.map((step, idx) => ({
        ...step,
        status: idx === index ? status : step.status
      }))
    },
    resetTimeline() {
      this.analysisTimeline = buildTimeline()
    },
    clearAnalysisTimers() {
      this.analysisTimers.forEach(timer => clearTimeout(timer))
      this.analysisTimers = []
    }
  },
  beforeUnmount() {
    this.clearAnalysisTimers()
  }
})
</script>

<style scoped lang="scss">
.symptom-analysis-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #f4f7fb 0%, #ffffff 60%);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
}

.patient-header-section {
  padding: 24px 0;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(31, 45, 61, 0.05);
  margin-bottom: 24px;

  .stats-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 20px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-radius: 12px;
      background: #ffffff;
      box-shadow: 0 6px 16px rgba(31, 45, 61, 0.06);
      border: 1px solid #f0f2f5;
      min-width: 160px;
      flex: 1;
      max-width: 240px;

      .stat-icon {
        font-size: 22px;
        color: #409eff;
        flex-shrink: 0;
      }

      .stat-body {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .stat-label {
          font-size: 12px;
          color: #909399;
          line-height: 1.4;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: #1f2d3d;
          line-height: 1.5;
        }
      }

      @media (max-width: 768px) {
        flex: 1 1 calc(50% - 8px);
        max-width: none;
      }

      @media (max-width: 480px) {
        flex: 1 1 100%;
      }
    }
  }
}

.workspace-container {
  flex: 1;
  padding-bottom: 40px;

  .container {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .workspace-sidebar {
    width: 260px;
    flex-shrink: 0;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(31, 45, 61, 0.05);
    padding: 24px 16px;
    height: calc(100vh - 220px);
    max-height: 800px;
    overflow-y: auto;

    .sidebar-header {
      padding: 0 8px 16px;
      border-bottom: 1px solid #f0f2f5;
      margin-bottom: 16px;

      .sidebar-title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2d3d;
        display: block;
      }

      .sidebar-desc {
        margin-top: 4px;
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }

    .module-menu {
      border: none;
      background: transparent;
      padding: 8px 0;

      :deep(.el-menu-item) {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px 12px;
        border-radius: 8px;
        margin-bottom: 8px;
        transition: all 0.2s ease;
        height: auto;
        line-height: 1.4;

        &.is-active {
          background-color: #e6f7ff;
          color: #409eff;
        }

        &:hover {
          background-color: #f5f7fa;
          color: #409eff;
        }

        .menu-icon {
          font-size: 16px;
          color: #409eff;
          flex-shrink: 0;
        }

        .menu-content {
          display: flex;
          flex-direction: column;

          .menu-label {
            font-size: 14px;
            font-weight: 500;
            color: #1f2d3d;
          }

          .menu-desc {
            font-size: 11px;
            color: #909399;
            line-height: 1.3;
          }
        }
      }
    }

    .sidebar-footer {
      margin-top: 24px;
      padding: 0 8px;

      :deep(.el-alert) {
        border-radius: 8px;
        padding: 12px;
      }
    }

    @media (max-width: 992px) {
      width: 220px;
    }

    @media (max-width: 768px) {
      display: none;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      height: 100vh;
      max-height: none;
    }
  }

  .workspace-content {
    flex: 1;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(31, 45, 61, 0.05);
    padding: 24px;
    min-height: calc(100vh - 220px);
    max-height: 800px;
    overflow-y: auto;

    .module-content {
      width: 100%;
    }

    .module-fade-enter-active,
    .module-fade-leave-active {
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .module-fade-enter-from,
    .module-fade-leave-to {
      opacity: 0;
      transform: translateY(8px);
    }

    @media (max-width: 768px) {
      padding: 16px;
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
  }
}

.side-toolbar-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(31, 45, 61, 0.1);
  padding: 8px;

  @media (max-width: 480px) {
    right: 10px;
    padding: 4px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c0c6cc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
