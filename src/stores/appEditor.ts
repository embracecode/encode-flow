import { defineStore } from 'pinia'
import { ref, inject } from 'vue'

import { blocks as blocksData } from '@/mocks/blocks'
import type { BlockInfo } from '@/types/block'
import { blocksMapSymbol } from '../setup'

export const useAppEditorStore = defineStore('appEditor', () => {
  const currentBlockId = ref<string | null>(null)
  const blocks = ref(blocksData)
  const history = ref<typeof blocksData[]>([JSON.parse(JSON.stringify(blocksData))])
  const historyIndex = ref(0)

  const injectedBlocksMap = inject(blocksMapSymbol)
  function selectBlock(id: string) {
    currentBlockId.value = id
  }

  function recordHistory() {
    const newState = JSON.parse(JSON.stringify(blocks.value))
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }
    history.value.push(newState)
    console.log('history.value', history.value)
    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
    historyIndex.value++
  }

  function updateBlocks(newBlocks: typeof blocksData) {
    blocks.value = newBlocks
    recordHistory()
    console.log('blocks.value', blocks.value)
  }

  function updateBlock(id: string, newBlock: BlockInfo) {
    // blocks.value = blocks.value.map((block) => {
    //   if (block.id === id) {
    //     return newBlock
    //   }
    //   return block
    // })
    for (const block of blocks.value) {
      if (block.id === id) {
        Object.assign(block, newBlock)
        break
      }
    }
    recordHistory()
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      blocks.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      blocks.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    }
  }

  return { currentBlockId, blocks, selectBlock, updateBlocks, updateBlock, undo, redo }
})
