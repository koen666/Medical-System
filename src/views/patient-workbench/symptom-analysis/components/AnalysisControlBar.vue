<template>
  <div class="analysis-control-bar">
    <el-form :model="localParams" size="small" label-position="top" label-width="120px" class="control-form">
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="融合系数 α (图谱 vs LLM)">
            <el-slider v-model="localParams.alpha" :min="0" :max="1" :step="0.05" show-input />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="边权阈值">
            <el-slider v-model="localParams.threshold" :min="0" :max="1" :step="0.05" show-input />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="8">
          <el-form-item label="Top-N 候选数">
            <el-input-number v-model="localParams.topN" :min="3" :max="10" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄">
            <el-input-number v-model="localParams.age" :min="0" :max="120" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别">
            <el-select v-model="localParams.gender">
              <el-option label="女" value="F" />
              <el-option label="男" value="M" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-form-item label="起病时间">
            <el-input v-model="localParams.onset" placeholder="如：48h 内" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="诱发因素">
            <el-input v-model="localParams.trigger" placeholder="如：睡眠不足、情绪波动" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="actions">
      <el-button type="primary" :icon="Cpu" @click="emitAnalyze">开始分析</el-button>
      <el-button :icon="DocumentAdd" @click="$emit('save-snapshot')">保存快照</el-button>
      <el-button :icon="RefreshLeft" @click="emitReset">恢复默认</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Cpu, DocumentAdd, RefreshLeft } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'AnalysisControlBar',
  components: {
    Cpu,
    DocumentAdd,
    RefreshLeft
  },
  props: {
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localParams: { ...this.params }
    }
  },
  watch: {
    params: {
      handler(val) {
        this.localParams = { ...val }
      },
      deep: true
    },
    localParams: {
      handler(val) {
        Object.keys(val).forEach(key => {
          this.$emit('update:param', key, val[key])
        })
      },
      deep: true
    }
  },
  methods: {
    emitAnalyze() {
      this.$emit('analyze')
    },
    emitReset() {
      this.$emit('reset')
    }
  }
})
</script>

<style scoped lang="scss">
.analysis-control-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .control-form {
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #606266;
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
