<script setup lang="ts">
import { SmoothDndContainer } from '@/components/SmoothDnd/SmoothDndContainer'
import { SmoothDndDraggable } from '@/components/SmoothDnd/SmoothDndDraggable'
import { nanoid } from 'nanoid'
import { ChartLine, Form, HamburgerButton, ImageFiles } from '@icon-park/vue-next'

const flowBlocks = [
  { type: 'input', label: '输入节点', icon: ImageFiles },
  { type: 'output', label: '输出节点', icon: Form },
  { type: 'default', label: '默认节点', icon: ChartLine },
  { type: 'custom', label: '自定义节点', icon: HamburgerButton },
  { type: 'edge', label: '连接线', icon: ChartLine }
]

const getFlowBlockDefaultData = (type: string) => {
  const id = nanoid()
  if (type === 'edge') {
    return {
      id,
      type: 'edge',
      label: '连接线',
      source: '',
      target: '',
      animated: true
    }
  }
  return {
    id,
    type,
    label: `节点 ${id.substring(0, 4)}`,
    position: { x: 0, y: 0 },
    class: 'light'
  }
}

// 处理拖拽开始事件
const handleDragStart = (event: DragEvent, blockType: string) => {
  if (event.dataTransfer) {
    const payload = getFlowBlockDefaultData(blockType)
    event.dataTransfer.setData('application/json', JSON.stringify(payload))
    // 设置拖拽效果
    event.dataTransfer.effectAllowed = 'copy'
    // 创建一个简单的拖拽图像
    const dragImage = document.createElement('div')
    dragImage.style.width = '40px'
    dragImage.style.height = '40px'
    dragImage.style.backgroundColor = '#1edb5b'
    dragImage.style.borderRadius = '8px'
    dragImage.style.display = 'flex'
    dragImage.style.alignItems = 'center'
    dragImage.style.justifyContent = 'center'
    dragImage.style.color = 'white'
    dragImage.style.fontSize = '12px'
    dragImage.style.fontWeight = 'bold'
    dragImage.textContent = payload.label
    document.body.appendChild(dragImage)
    event.dataTransfer.setDragImage(dragImage, 20, 20)
    // 拖拽结束后移除临时元素
    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }
}

// 处理拖拽结束事件
const handleDragEnd = () => {
  // 清理拖拽状态
  const dragImage = document.querySelector('.smooth-dnd-ghost')
  if (dragImage) {
    dragImage.remove()
  }
  // 清除所有可能的拖拽状态
  document.querySelectorAll('.smooth-dnd-drag-start').forEach(el => {
    el.classList.remove('smooth-dnd-drag-start')
  })
}
</script>

<template>
  <div class="flow-blocks-drawer-wrapper">
    <h3 class="drawer-title">流程图节点</h3>

    <smooth-dnd-container
      behaviour="copy"
      group-name="flow-blocks"
      orientation="vertical"
      :get-child-payload="
        (index: number) => {
          const { type } = flowBlocks[index]
          return getFlowBlockDefaultData(type)
        }
      "
      @drag-end="handleDragEnd"
      tag="div"
      class="blocks-list"
    >
      <smooth-dnd-draggable v-for="d in flowBlocks" :key="d.type">
        <div 
          class="blocks-item"
          draggable="true"
          @dragstart="handleDragStart($event, d.type)"
          @dragend="handleDragEnd"
        >
          <div class="block-icon-wrapper">
            <component :is="d.icon" />
          </div>
          <span class="block-label">{{ d.label }}</span>
        </div>
      </smooth-dnd-draggable>
    </smooth-dnd-container>
  </div>
</template>

<style scoped>
.flow-blocks-drawer-wrapper {
  width: 100%;
}

.drawer-title {
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bolder);
  margin-bottom: 8px;
}

.blocks-list {
  --grid-item-color: #1edb5b;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px;
  margin: 0 -12px;
  padding-bottom: 8px;
}

.blocks-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  transition: background-color 0.125s ease 0s;
  padding: 8px 0;
  cursor: grab;
  user-select: none;
}

.blocks-item:hover {
  background-color: var(--color-gray-200);
}

.block-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
  border-radius: 8px;
  color: var(--color-white);
  font-size: var(--font-size-large);
  background-color: var(--grid-item-color);
}

.block-label {
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-bold);
}
</style>
