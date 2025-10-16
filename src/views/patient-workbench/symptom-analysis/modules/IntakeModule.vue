<template>
  <div class="module-intake">
    <el-row :gutter="24" class="row-section">
      <el-col :xs="24" :lg="24">
        <el-card class="module-card input-card" shadow="never">
          <template #header>
            <div class="card-header">
              <div>
                <span class="title">症状采集与标准化</span>
                <p class="subtitle">支持文本、语音转写与病例文档快速录入</p>
              </div>
              <el-tag size="small" type="info" effect="dark">多模态</el-tag>
            </div>
          </template>
          <SymptomInputPanel :templates="templates" @symptoms-extracted="emitExtracted" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="row-section">
      <el-col :xs="24" :lg="24">
        <el-card class="module-card structured-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="title">结构化症状清单</span>
              <el-tag size="small" type="warning" effect="plain">需医生确认</el-tag>
            </div>
          </template>
          <ExtractedSymptoms :symptoms="symptoms" @update="emitUpdated" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="row-section">
      <el-col :xs="24" :lg="24">
        <el-card class="module-card control-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span class="title">联合分析参数</span>
              <el-tooltip content="调整图谱与大模型权重、候选数量等参数" placement="top">
                <el-icon>
                  <Setting />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <AnalysisControlBar
            :params="params"
            @update:param="emitParamUpdate"
            @analyze="emitAnalyze"
            @reset="emitReset"
            @save-snapshot="emitSnapshot"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import SymptomInputPanel from '../components/SymptomInputPanel.vue'
import ExtractedSymptoms from '../components/ExtractedSymptoms.vue'
import AnalysisControlBar from '../components/AnalysisControlBar.vue'

export default defineComponent({
  name: 'SymptomIntakeModule',
  components: {
    SymptomInputPanel,
    ExtractedSymptoms,
    AnalysisControlBar,
    Setting
  },
  props: {
    templates: {
      type: Array,
      default: () => []
    },
    symptoms: {
      type: Array,
      default: () => []
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    emitExtracted(payload) {
      this.$emit('symptoms-extracted', payload)
    },
    emitUpdated(payload) {
      this.$emit('symptoms-update', payload)
    },
    emitParamUpdate(key, value) {
      this.$emit('param-update', key, value)
    },
    emitAnalyze() {
      this.$emit('analyze')
    },
    emitReset() {
      this.$emit('reset')
    },
    emitSnapshot() {
      this.$emit('save-snapshot')
    }
  }
})
</script>

<style scoped lang="scss">
.module-intake {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .row-section {
    display: flex;
    justify-content: center;
  }

  .module-card {
    width: 100%;
    border-radius: 16px;
    border: 1px solid rgba(64, 158, 255, 0.12);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(6px);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .title {
        display: block;
        font-size: 16px;
        font-weight: 600;
        color: #1f2d3d;
      }

      .subtitle {
        margin: 4px 0 0;
        font-size: 12px;
        color: #909399;
      }

      .el-icon {
        color: #409eff;
        font-size: 16px;
      }
    }
  }

  .structured-card {
    margin-top: 0;
  }

  .control-card {
    margin-top: 0;
  }
}
</style>
