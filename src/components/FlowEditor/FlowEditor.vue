<script setup lang="ts">
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

import { Log,Resting, Shuffle } from '@icon-park/vue-next'
import { Background, Controls, MiniMap } from '@vue-flow/additional-components'
import { isNode, Panel, useVueFlow,VueFlow } from '@vue-flow/core'
import { ref, watch, onMounted, onUnmounted } from 'vue'

import { useActionsEditorStore } from '@/stores/actionsEditor'

/**
 * useVueFlow provides all event handlers and store properties
 * You can pass the composable an object that has the same properties as the VueFlow component props
 */
const { onNodeDragStop, onConnect, addEdges, setTransform, toObject, project } = useVueFlow()

const actionsEditorStore = useActionsEditorStore()
const elements = ref(actionsEditorStore.elements)

// 监听 elements 变化，同步到 store
watch(elements, (newElements) => {
  actionsEditorStore.updateElements(newElements)
}, { deep: true })

/**
 * This is a Vue Flow event-hook which can be listened to from anywhere you call the composable, instead of only on the main component
 *
 * onPaneReady is called when view pane & nodes have visible dimensions
 */
// onPaneReady(({ fitView }) => {})

onNodeDragStop((e) => {
  console.log('drag stop', e)
  // 当节点拖拽停止时，elements 已经通过 v-model 自动更新
  // watch 监听器会自动同步到 store
})

/**
 * onConnect is called when a new connection is created.
 * You can add additional properties to your new edge (like a type or label) or block the creation altogether
 */
onConnect((params) => {
  addEdges(params)
  // 当创建新连接时，elements 已经通过 addEdges 自动更新
  // watch 监听器会自动同步到 store
})

// 添加键盘快捷键支持
function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
    event.preventDefault()
    actionsEditorStore.undo()
  } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
    event.preventDefault()
    actionsEditorStore.redo()
  }
}

// 处理拖拽到编辑器的功能
function handleDrop(event: DragEvent) {
  console.log('drop', event)
  if (!event.dataTransfer) return
  
  try {
    const payload = JSON.parse(event.dataTransfer.getData('application/json'))
    if (payload) {
      // 处理节点类型的物料
      if (payload.type !== 'edge') {
        // 计算鼠标在流程图中的位置
        const vueFlowElement = document.querySelector('.basic-flow') as HTMLElement
        if (vueFlowElement) {
          const rect = vueFlowElement.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          
          // 将屏幕坐标转换为流程图坐标
          const position = project({ x, y })
          
          // 设置节点位置
          payload.position = position
          
          // 添加新节点到元素列表
          elements.value = [...elements.value, payload]
        }
      } else {
        // 处理连接线类型的物料
        // 连接线需要用户手动连接两个节点，这里只是添加到元素列表
        // 实际连接需要用户通过Vue Flow的界面操作
        elements.value = [...elements.value, payload]
      }
    }
  } catch (e) {
    console.error('Failed to parse drag payload:', e)
  }
  
}

/**
 * To update node properties you can simply use your elements v-model and mutate the elements directly
 * Changes should always be reflected on the graph reactively, without the need to overwrite the elements
 */
function updatePos() {
  elements.value.forEach((el: any) => {
    if (isNode(el)) {
      el.position = {
        x: Math.random() * 400,
        y: Math.random() * 400
      }
    }
  })
  // elements 已经直接修改，watch 监听器会自动同步到 store
}

/**
 * toObject transforms your current graph data to an easily persist-able object
 */
function logToObject() {
  return console.log(toObject())
}

/**
 * Resets the current view pane transformation (zoom & pan)
 */
function resetTransform() {
  return setTransform({ x: 0, y: 0, zoom: 1 })
}

onMounted(() => {
  // 添加拖拽事件监听器
  const vueFlowElement = document.querySelector('.basic-flow') as HTMLElement
  if (vueFlowElement) {
    vueFlowElement.addEventListener('drop', handleDrop)
    vueFlowElement.addEventListener('dragover', (e) => e.preventDefault())
    vueFlowElement.addEventListener('dragenter', (e) => e.preventDefault())
    vueFlowElement.addEventListener('dragleave', (e) => e.preventDefault())
  }
  
  // 添加全局dragend事件监听器，确保拖拽结束后清除拖拽效果
  window.addEventListener('dragend', (e) => {
    // 确保拖拽结束后清除拖拽效果
    if (e.dataTransfer) {
      e.dataTransfer.clearData()
    }
  })
  
  // 添加键盘事件监听器
  window.addEventListener('keydown', handleKeydown)
})

// 清理事件监听器
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  
  // 清理拖拽事件监听器
  const vueFlowElement = document.querySelector('.basic-flow') as HTMLElement
  if (vueFlowElement) {
    vueFlowElement.removeEventListener('drop', handleDrop)
  }
})
</script>

<template>
  <VueFlow
    v-model="elements"
    class="basic-flow"
    :default-viewport="{ zoom: 1.5 }"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <Background :gap="12" />

    <MiniMap />

    <Controls />

    <Panel position="top-right" class="controls">
      <div class="control-btn" title="Reset Transform" @click="resetTransform">
        <Resting />
      </div>

      <div class="control-btn" title="Shuffle Node Positions" @click="updatePos">
        <Shuffle />
      </div>

      <div class="control-btn" title="Log `toObject`" @click="logToObject">
        <Log />
      </div>
    </Panel>
  </VueFlow>
</template>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css');
@import url('https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css');

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: var(--color-gray-100);
  border: 1px solid var(--color-gray-300);
  box-shadow: rgb(0 0 0 / 10%) 1px 2px 20px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--color-gray-800);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.control-btn:hover {
  background-color: var(--color-gray-300);
  transition: all 0.2s ease-in-out;
}
</style>
