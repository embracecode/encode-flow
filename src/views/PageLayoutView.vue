<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppEditorRenderer from '@/components/AppEditorRenderer/AppEditorRenderer.vue'
import AppLeftPanel from '@/components/AppLeftPanel/AppLeftPanel.vue'
import AppRightPanel from '@/components/AppRightPanel/AppRightPanel.vue'
import { useAppEditorStore } from '@/stores/appEditor'

const appEditorStore = useAppEditorStore()

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    appEditorStore.undo()
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
    event.preventDefault()
    appEditorStore.redo()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="layout-wrapper">
    <AppLeftPanel />
    <AppEditorRenderer />
    <AppRightPanel />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}

.layout-setting {
  position: relative;
  z-index: 6;
  width: var(--panel-width);
  box-shadow: var(--color-gray-300) -1px 0 0;
}
</style>
