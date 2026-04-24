<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'

import type { ViewBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: ViewBlockInfo
}>()

const emit = defineEmits<{ (event: 'change', block: ViewBlockInfo): void }>()

const { values, defineInputBinds } = useForm({
  initialValues: {
    fields: props.blockInfo.props.fields,
    fieldProps: props.blockInfo.props.fieldProps,
    data: props.blockInfo.props.data
  }
})

watch([values], ([newValues]) => {
  emit('change', { ...props.blockInfo, props: { ...props.blockInfo.props, ...newValues } })
})
</script>

<template>
  <div class="view-setting">
    <div>
      {{ props.blockInfo.type }}
    </div>
    <div class="view-section">
      <h4>字段定义</h4>
      <div class="fields-container">
        <div v-for="(field, key) in values.fields" :key="key" class="field-item">
          <input 
            class="field-input" 
            v-model="values.fields[key].type" 
            placeholder="字段类型" 
          />
        </div>
      </div>
    </div>
    <div class="view-section">
      <h4>字段属性</h4>
      <div class="field-props-container">
        <div v-for="(prop, index) in values.fieldProps" :key="index" class="field-prop-item">
          <input 
            type="number" 
            class="field-input" 
            v-model.number="prop.width" 
            placeholder="宽度" 
          />
          <div class="field-checkbox">
            <input 
              type="checkbox" 
              v-model="prop.visible" 
            />
            <label>可见</label>
          </div>
        </div>
      </div>
    </div>
    <div class="view-section">
      <h4>数据</h4>
      <div class="data-container">
        <div v-for="(item, index) in values.data" :key="index" class="data-item">
          <input 
            class="field-input" 
            v-model="item.id" 
            placeholder="ID" 
          />
          <input 
            class="field-input" 
            v-model="item.value" 
            placeholder="值" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-setting {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.view-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.view-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.fields-container,
.field-props-container,
.data-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-item,
.field-prop-item,
.data-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
}

.field-input {
  width: 100%;
  height: 28px;
  padding: 0 6px;
  border: 1px solid var(--color-gray-300);
  border-radius: 4px;
  outline-style: none;
  color: var(--color-gray-800);
}

.field-checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}
</style>