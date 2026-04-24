<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import type { NotesBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: NotesBlockInfo
}>()

const emit = defineEmits<{ (event: 'change', block: NotesBlockInfo): void }>()

const { values, defineInputBinds } = useForm({
  initialValues: {
    content: props.blockInfo.props.content
  }
})

const content = defineInputBinds('content')

watch([values], ([newValues]) => {
  emit('change', { ...props.blockInfo, props: { ...props.blockInfo.props, ...newValues } })
})
</script>

<template>
  <div class="notes-setting">
    <div>
      {{ props.blockInfo.type }}
    </div>
    <textarea class="content-textarea" v-bind="content" />
  </div>
</template>

<style scoped>
.notes-setting {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-textarea {
  width: 100%;
  height: 120px;
  margin-top: 8px;
  padding: 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  outline-style: none;
  color: var(--color-gray-800);
  resize: vertical;
}
</style>