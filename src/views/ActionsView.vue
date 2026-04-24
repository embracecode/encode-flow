<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import FlowEditor from '@/components/FlowEditor/FlowEditor.vue'
import FlowBlocksDrawer from '@/components/FlowEditor/FlowBlocksDrawer.vue'
import { SmartOptimization } from '@icon-park/vue-next'
import { useActionsEditorStore } from '@/stores/actionsEditor'

const actionsEditorStore = useActionsEditorStore()

type DrawerMode = 'blocks' | null

const isDrawerShown = ref<DrawerMode>('blocks')

const toggleDrawer = (drawerMode: DrawerMode = null) => {
  if (isDrawerShown.value === drawerMode) {
    isDrawerShown.value = null
    return
  }
  isDrawerShown.value = drawerMode
}

const handleKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    actionsEditorStore.undo()
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
    event.preventDefault()
    actionsEditorStore.redo()
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
    <div class="app-left-panel-wrapper">
      <div class="app-left-panel-bar" :style="{ boxShadow: 'var(--color-gray-300) 1px 0px 0px' }">
        <div
          :class="['app-left-panel-item', isDrawerShown === 'blocks' && 'active']"
          @click="toggleDrawer('blocks')"
        >
          <SmartOptimization size="20" :style="{ lineHeight: 0.7 }" />
        </div>
      </div>
      <Transition name="app-left-panel-drawer">
        <div v-if="!!isDrawerShown" class="app-left-panel-drawer">
          <div class="app-left-panel-drawer-content">
            <FlowBlocksDrawer />
          </div>
        </div>
      </Transition>
    </div>
    <FlowEditor />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}

.app-left-panel-wrapper {
  position: relative;
  display: flex;
  z-index: 4;
  height: 100%;
  box-shadow: var(--color-gray-300) 1px 0 0;
}

.app-left-panel-bar {
  width: 60px;
  height: 100%;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-left-panel-item {
  display: flex;
  margin: 8px 0;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-700);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
}

.app-left-panel-item.active {
  color: var(--color-text);
  background-color: var(--color-gray-200);
}

.app-left-panel-item:hover {
  background-color: var(--color-gray-200);
  transition: all 0.2s ease-in-out;
}

.app-left-panel-drawer {
  width: calc(var(--panel-width) - 60px);
  height: 100%;
  box-shadow: var(--color-gray-300) 1px 0 0;
  overflow: hidden;
}

.app-left-panel-drawer-enter-active,
.app-left-panel-drawer-leave-active {
  transition: width 0.1s cubic-bezier(0.3, 0.1, 0.3, 1);
}

.app-left-panel-drawer-enter-from,
.app-left-panel-drawer-leave-to {
  width: 0;
}

.app-left-panel-drawer-content {
  width: calc(var(--panel-width) - 60px);
  height: 100%;
  padding: 16px;
}
</style>
