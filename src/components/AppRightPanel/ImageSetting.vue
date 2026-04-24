<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import type { ImageBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: ImageBlockInfo
}>()

const emit = defineEmits<{ (event: 'change', block: ImageBlockInfo): void }>()

const { values, defineInputBinds } = useForm({
  initialValues: {
    url: props.blockInfo.props.url
  }
})

const url = defineInputBinds('url')

watch([values], ([newValues]) => {
  emit('change', { ...props.blockInfo, props: { ...props.blockInfo.props, ...newValues } })
})
</script>

<template>
  <div class="image-setting">
    <div>
      {{ props.blockInfo.type }}
    </div>
    <input class="content-input" v-bind="url" placeholder="请输入图片 URL" />
  </div>
</template>

<style scoped>
.image-setting {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.content-input {
  width: 100%;
  height: 32px;
  margin-top: 8px;
  padding: 0 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  outline-style: none;
  color: var(--color-gray-800);
}
</style>