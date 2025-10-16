<template>
  <div class="side-toolbar">
    <el-tooltip content="切换信息密度" placement="left">
      <el-button circle :icon="ZoomIn" size="small" @click="emit('density-change')" />
    </el-tooltip>
    <el-tooltip content="快捷键说明" placement="left">
      <el-button circle :icon="Lightning" size="small" type="primary" @click="emit('open-shortcuts')" />
    </el-tooltip>
    <el-tooltip content="导出设置（演示中禁用）" placement="left">
      <el-button circle :icon="Setting" size="small" disabled />
    </el-tooltip>
  </div>
</template>

<script setup>
import { ZoomIn, Lightning, Setting } from '@element-plus/icons-vue'

const emit = defineEmits(['density-change', 'open-shortcuts'])
</script>

<style scoped lang="scss">
.side-toolbar {
  position: fixed;
  right: 36px;
  bottom: 88px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 16px 32px rgba(31, 45, 61, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  z-index: 20;

  :deep(.el-button) {
    box-shadow: none;
  }
}
</style>
