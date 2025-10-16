<template>
  <div class="analysis-timeline">
    <el-steps :active="activeIndex" finish-status="success" align-center>
      <el-step
        v-for="(step, index) in steps"
        :key="step.key"
        :title="step.title"
        :description="formatDescription(step, index)"
        :status="statusMap(step.status)"
      />
    </el-steps>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AnalysisTimeline',
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    status: {
      type: String,
      default: 'idle'
    }
  },
  computed: {
    activeIndex() {
      const index = this.steps.findIndex(step => step.status === 'current')
      if (index !== -1) return index
      if (this.status === 'done') return this.steps.length
      return 0
    }
  },
  methods: {
    statusMap(status) {
      switch (status) {
        case 'done':
          return 'success'
        case 'error':
          return 'error'
        case 'current':
          return 'process'
        default:
          return 'wait'
      }
    },
    formatDescription(step, index) {
      if (step.status === 'done') return `耗时 ${step.duration || '--'}`
      if (step.status === 'current') return '执行中'
      if (step.status === 'error') return step.error || '失败'
      return index === 0 ? '待开始' : ''
    }
  }
})
</script>

<style scoped lang="scss">
.analysis-timeline {
  width: 100%;
  padding: 4px 0;

  :deep(.el-step__main) {
    .el-step__title {
      font-size: 13px;
      font-weight: 600;
    }
    .el-step__description {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
