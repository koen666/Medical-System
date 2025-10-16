<template>
  <div class="module-insight">
    <el-row :gutter="24">
      <el-col :xs="24" :lg="10">
        <el-card class="module-card candidates-card" shadow="never">
          <template #header>
            <div class="card-header">
              <div>
                <span class="title">候选诊断</span>
                <p class="subtitle">Top-N 疾病候选，按置信度排序，可勾选对比</p>
              </div>
              <el-tag size="small" type="primary" effect="dark">LLM+图谱</el-tag>
            </div>
          </template>
          <DiagnosisCandidates :candidates="candidates" :selected="selected" @select="emitSelect" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card class="module-card evidence-card" shadow="never">
          <template #header>
            <div class="card-header">
              <div>
                <span class="title">证据解读</span>
                <p class="subtitle">展示贡献度、匹配症状、阴性证据与参考来源</p>
              </div>
              <el-tag v-if="selectedName" size="small" type="success" effect="dark">{{ selectedName }}</el-tag>
            </div>
          </template>
          <EvidencePanel :disease="selected" :evidence="evidence" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import DiagnosisCandidates from '../components/DiagnosisCandidates.vue'
import EvidencePanel from '../components/EvidencePanel.vue'

export default defineComponent({
  name: 'SymptomInsightModule',
  components: {
    DiagnosisCandidates,
    EvidencePanel
  },
  props: {
    candidates: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ''
    },
    evidenceMap: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    evidence() {
      return this.evidenceMap[this.selected]
    },
    selectedName() {
      const item = this.candidates.find(candidate => candidate.code === this.selected)
      return item ? item.name : ''
    }
  },
  methods: {
    emitSelect(value) {
      this.$emit('select', value)
    }
  }
})
</script>

<style scoped lang="scss">
.module-insight {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .module-card {
    border-radius: 16px;
    border: 1px solid rgba(245, 108, 108, 0.15);
    background: rgba(255, 255, 255, 0.96);
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
}
</style>
