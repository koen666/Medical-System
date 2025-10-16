<template>
  <div class="evidence-panel">
    <div v-if="disease && evidence" class="content">
      <h3>证据贡献</h3>
      <div class="contrib-bars" v-if="evidence.contrib && evidence.contrib.length">
        <div v-for="item in evidence.contrib" :key="item.label" class="bar-item">
          <span class="label">{{ item.label }}</span>
          <el-progress :percentage="Math.round(item.value * 100)" :stroke-width="10" />
        </div>
      </div>

      <h4>匹配症状</h4>
      <ul class="matched-list">
        <li v-for="item in evidence.matched" :key="item.label">
          <span>{{ item.label }}</span>
          <el-tag type="success" size="small">权重 {{ (item.weight * 100).toFixed(0) }}%</el-tag>
        </li>
      </ul>

      <h4 v-if="evidence.negatives && evidence.negatives.length">阴性证据</h4>
      <ul v-if="evidence.negatives && evidence.negatives.length" class="negatives">
        <li v-for="item in evidence.negatives" :key="item">{{ item }}</li>
      </ul>

      <h4 v-if="evidence.references && evidence.references.length">参考来源</h4>
      <ul v-if="evidence.references && evidence.references.length" class="references">
        <li v-for="ref in evidence.references" :key="ref.title">
          <el-icon><Link /></el-icon>
          <a :href="ref.url" target="_blank" rel="noopener noreferrer">{{ ref.title }}</a>
        </li>
      </ul>
    </div>
    <el-empty v-else description="请选择候选诊断查看详细证据" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Link } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'EvidencePanel',
  components: {
    Link
  },
  props: {
    disease: {
      type: String,
      default: ''
    },
    evidence: {
      type: Object,
      default: null
    }
  }
})
</script>

<style scoped lang="scss">
.evidence-panel {
  min-height: 320px;

  .content {
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    h4 {
      margin: 0;
      font-size: 14px;
      color: #606266;
    }

    .contrib-bars {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .bar-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .matched-list,
    .negatives,
    .references {
      margin: 0;
      padding-left: 16px;
      font-size: 12px;
      color: #606266;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .matched-list li {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .references li {
      display: flex;
      align-items: center;
      gap: 6px;

      a {
        color: #409eff;
      }
    }
  }
}
</style>
