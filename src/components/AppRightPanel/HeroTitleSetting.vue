<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import type { HeroTitleBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: HeroTitleBlockInfo
}>()

const emit = defineEmits<{ (event: 'change', block: HeroTitleBlockInfo): void }>()

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
  <div class="hero-title-setting">
    <div>
      {{ props.blockInfo.type }}
    </div>
    <input class="content-input" v-bind="content" />
  </div>
</template>

<style scoped>
.hero-title-setting {
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