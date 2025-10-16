<template>
  <div class="extracted-symptoms">
    <div class="header">
      <h3>已抽取症状</h3>
      <el-tooltip content="医生可在此确认和加权症状，阴性症状请切换状态" placement="top">
        <el-icon><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
    <el-table
      v-if="editableSymptoms.length"
      :data="editableSymptoms"
      size="small"
      border
      height="260"
      class="symptom-table"
    >
      <el-table-column label="症状" min-width="150">
        <template #default="{ row }">
          <el-input v-model="row.label" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="严重度" width="120">
        <template #default="{ row }">
          <el-select v-model="row.severity" size="small">
            <el-option label="轻" value="轻" />
            <el-option label="中" value="中" />
            <el-option label="重" value="重" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="持续时间" width="140">
        <template #default="{ row }">
          <el-input v-model="row.duration" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="部位" width="120">
        <template #default="{ row }">
          <el-input v-model="row.side" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="权重" width="160">
        <template #default="{ row }">
          <div class="weight-cell">
            <el-slider v-model="row.weight" :min="0" :max="1" :step="0.1" show-input />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="阴性" width="80" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.negated" active-text="是" inactive-text="否" />
        </template>
      </el-table-column>
      <el-table-column width="60" align="center">
        <template #default="{ $index }">
          <el-button :icon="Delete" size="small" link @click="removeSymptom($index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="等待抽取或导入症状" :image-size="120" />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Delete, QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'ExtractedSymptoms',
  components: {
    Delete,
    QuestionFilled
  },
  props: {
    symptoms: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      editableSymptoms: []
    }
  },
  watch: {
    symptoms: {
      handler(val) {
        this.editableSymptoms = val.map(item => ({ ...item }))
      },
      immediate: true,
      deep: true
    },
    editableSymptoms: {
      handler(val) {
        this.$emit('update', val.map(item => ({ ...item })))
      },
      deep: true
    }
  },
  methods: {
    removeSymptom(index) {
      this.editableSymptoms.splice(index, 1)
    }
  }
})
</script>

<style scoped lang="scss">
.extracted-symptoms {
  margin-top: 12px;

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
    }
  }

  .symptom-table {
    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-slider__runway) {
      font-size: 12px;
    }

    .weight-cell {
      padding-right: 6px;
    }
  }
}
</style>
