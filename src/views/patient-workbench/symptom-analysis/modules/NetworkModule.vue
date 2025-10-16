<template>
  <div class="module-network">
    <el-row :gutter="24">
      <el-col :xs="24" :lg="16">
        <el-card class="module-card graph-card" shadow="never">
          <template #header>
            <div class="card-header">
              <div>
                <span class="title">症状-疾病关系图</span>
                <p class="subtitle">基于 Neo4j 子图的实时证据网络，可筛选节点类型和边权</p>
              </div>
              <el-tag size="small" type="success" effect="dark">互动</el-tag>
            </div>
          </template>
          <GraphView :graph-data="graphData" :filters="graphFilters" @filters-change="emitFilters" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="module-card timeline-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="title">分析进度</span>
              <el-tag size="small" :type="statusTagType">{{ statusText }}</el-tag>
            </div>
          </template>
          <AnalysisTimeline :steps="analysisTimeline" :status="analysisStatus" />
        </el-card>
        <el-card class="module-card insight-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="title">数据概览</span>
            </div>
          </template>
          <div class="insight-list">
            <div class="insight-item">
              <span class="label">节点数量</span>
              <span class="value">{{ nodeCount }}</span>
            </div>
            <div class="insight-item">
              <span class="label">边数量</span>
              <span class="value">{{ edgeCount }}</span>
            </div>
            <div class="insight-item">
              <span class="label">阈值过滤</span>
              <span class="value">≥ {{ (graphFilters.threshold * 100).toFixed(0) }}%</span>
            </div>
            <div class="insight-item">
              <span class="label">展示类型</span>
              <span class="value">{{ nodeTypeText }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import GraphView from '../components/GraphView.vue'
import AnalysisTimeline from '../components/AnalysisTimeline.vue'

export default defineComponent({
  name: 'SymptomNetworkModule',
  components: {
    GraphView,
    AnalysisTimeline
  },
  props: {
    graphData: {
      type: Object,
      default: () => ({ nodes: [], edges: [] })
    },
    graphFilters: {
      type: Object,
      default: () => ({ nodeTypes: [], threshold: 0.3 })
    },
    analysisTimeline: {
      type: Array,
      default: () => []
    },
    analysisStatus: {
      type: String,
      default: 'idle'
    }
  },
  computed: {
    nodeCount() {
      return this.graphData.nodes.length
    },
    edgeCount() {
      return this.graphData.edges.length
    },
    nodeTypeText() {
      if (!this.graphFilters.nodeTypes || !this.graphFilters.nodeTypes.length) return '全部'
      const mapping = {
        symptom: '症状',
        disease: '疾病',
        test: '检查'
      }
      return this.graphFilters.nodeTypes.map(type => mapping[type] || type).join(' / ')
    },
    statusText() {
      switch (this.analysisStatus) {
        case 'processing':
          return '正在分析'
        case 'done':
          return '分析完成'
        case 'error':
          return '分析失败'
        default:
          return '待开始'
      }
    },
    statusTagType() {
      switch (this.analysisStatus) {
        case 'processing':
          return 'warning'
        case 'done':
          return 'success'
        case 'error':
          return 'danger'
        default:
          return 'info'
      }
    }
  },
  methods: {
    emitFilters(payload) {
      this.$emit('filters-change', payload)
    }
  }
})
</script>

<style scoped lang="scss">
.module-network {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .module-card {
    border-radius: 16px;
    border: 1px solid rgba(103, 194, 58, 0.15);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .title {
        font-size: 16px;
        font-weight: 600;
        color: #1f2d3d;
      }

      .subtitle {
        margin: 4px 0 0;
        font-size: 12px;
        color: #909399;
      }
    }
  }

  .timeline-card {
    margin-bottom: 24px;
  }

  .insight-card {
    .insight-list {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .insight-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(90deg, rgba(64, 158, 255, 0.08), rgba(64, 158, 255, 0));
        border-radius: 12px;

        .label {
          font-size: 13px;
          color: #606266;
        }

        .value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2d3d;
        }
      }
    }
  }
}
</style>
