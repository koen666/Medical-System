<template>
  <el-card shadow="never" class="patient-header">
    <div class="info">
      <div class="primary">
        <h2>{{ patient.name }}</h2>
        <el-tag :type="patient.gender === '男' ? 'primary' : 'danger'" size="small">{{ patient.gender }}</el-tag>
        <el-tag size="small">{{ patient.age }} 岁</el-tag>
      </div>
      <div class="meta">
        <span>就诊类型：{{ patient.visitType }}</span>
        <span>就诊时间：{{ patient.visitTime }}</span>
        <span>就诊号：{{ visitId }}</span>
      </div>
      <div class="alerts" v-if="patient.alerts && patient.alerts.length">
        <el-tag
          v-for="alert in patient.alerts"
          :key="alert"
          type="warning"
          size="small"
        >
          {{ alert }}
        </el-tag>
      </div>
      <div class="allergies" v-if="patient.allergies && patient.allergies.length">
        过敏史：
        <el-tag
          v-for="item in patient.allergies"
          :key="item"
          type="danger"
          size="small"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>
    <div class="actions">
      <el-button type="primary" :icon="UploadFilled" @click="emit('sync')">写回 EMR</el-button>
      <el-button :icon="Download" @click="emit('export')">导出摘要</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { UploadFilled, Download } from '@element-plus/icons-vue'

defineProps({
  patient: {
    type: Object,
    required: true
  },
  visitId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['sync', 'export'])
</script>

<style scoped lang="scss">
.patient-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 18px;
  padding: 20px 28px;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 18px 36px rgba(31, 45, 61, 0.08);
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 15% 20%, rgba(64, 158, 255, 0.18), transparent 65%),
      radial-gradient(circle at 85% 0%, rgba(245, 108, 108, 0.18), transparent 60%);
    opacity: 0.9;
    z-index: 0;
  }

  .info {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .primary {
      display: flex;
      align-items: center;
      gap: 8px;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .meta {
      display: flex;
      align-items: center;
      gap: 16px;
      color: #606266;
      font-size: 13px;
    }

    .alerts,
    .allergies {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      font-size: 13px;
      color: #f56c6c;
    }
  }

  .actions {
    position: relative;
    z-index: 1;
    display: flex;
    gap: 12px;
  }
}
</style>
