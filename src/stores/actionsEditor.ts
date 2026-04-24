import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initialElements } from '@/components/FlowEditor/initial-elements'

export const useActionsEditorStore = defineStore('actionsEditor', () => {
  const elements = ref(initialElements)
  const history = ref([JSON.parse(JSON.stringify(initialElements))])
  const historyIndex = ref(0)

  function recordHistory() {
    const newState = JSON.parse(JSON.stringify(elements.value))
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    history.value.push(newState)
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
    historyIndex.value++
  }

  function updateElements(newElements: typeof elements.value) {
    elements.value = newElements
    recordHistory()
  }

  function addElements(newElements: typeof elements.value) {
    elements.value = [...elements.value, ...newElements]
    recordHistory()
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  return { elements, updateElements, addElements, undo, redo }
})
