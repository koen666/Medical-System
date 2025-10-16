<template>
  <div class="diagnosis-candidates">
    <el-radio-group v-model="localSelected" class="candidate-list" @change="emitSelect">
      <el-card
        v-for="item in candidates"
        :key="item.code"
        shadow="hover"
        :class="['candidate-card', { active: item.code === localSelected }]"
      >
        <el-radio :label="item.code" class="title">{{ item.name }}</el-radio>
        <div class="score-row">
          <el-progress :percentage="Math.round(item.score * 100)" :stroke-width="10" :color="progressColor(item.score)" />
          <span class="score-label">置信度 {{ (item.score * 100).toFixed(0) }}%</span>
        </div>
        <div class="meta">
          <el-tag size="small" type="info">证据 {{ item.evidenceCount }}</el-tag>
          <el-tag v-if="item.missingKey && item.missingKey.length" size="small" type="warning">
            缺失 {{ item.missingKey.length }} 项
          </el-tag>
        </div>
        <ul class="missing-list" v-if="item.missingKey && item.missingKey.length">
          <li v-for="miss in item.missingKey" :key="miss">{{ miss }}</li>
        </ul>
        <div class="guideline" v-if="item.guidelines && item.guidelines.length">
          <span>参考指南：</span>
          <ul>
            <li v-for="guide in item.guidelines" :key="guide">{{ guide }}</li>
          </ul>
        </div>
      </el-card>
    </el-radio-group>

    <el-alert
      v-if="!candidates.length"
      title="暂无候选诊断，请先完成症状抽取和分析。"
      type="info"
      :closable="false"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DiagnosisCandidates',
  props: {
    candidates: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localSelected: this.selected
    }
  },
  watch: {
    selected(val) {
      this.localSelected = val
    }
  },
  methods: {
    emitSelect(value) {
      this.$emit('select', value)
    },
    progressColor(score) {
      if (score >= 0.75) return '#67C23A'
      if (score >= 0.5) return '#E6A23C'
      return '#F56C6C'
    }
  }
})
</script>

<style scoped lang="scss">
.diagnosis-candidates {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .candidate-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .candidate-card {
      border-radius: 10px;
      transition: border 0.2s ease;

      &.active {
        border-color: #409eff;
      }

      .title {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
      }

      .score-row {
        display: flex;
        align-items: center;
        gap: 12px;

        .score-label {
          font-size: 12px;
          color: #606266;
        }
      }

      .meta {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }

      .missing-list {
        margin: 8px 0 0;
        padding-left: 16px;
        color: #f56c6c;
        font-size: 12px;
      }

      .guideline {
        margin-top: 8px;
        font-size: 12px;
        color: #606266;

        ul {
          margin: 4px 0 0;
          padding-left: 16px;
        }
      }
    }
  }
}
</style>
