<script setup lang="ts">
import { useFieldArray, useForm } from 'vee-validate'
import { watch } from 'vue'

import type { FormBlockInfo } from '@/types/block'

const props = defineProps<{
  blockInfo: FormBlockInfo
}>()

const emit = defineEmits<{ (event: 'change', block: FormBlockInfo): void }>()

const { values, defineInputBinds } = useForm({
  initialValues: {
    fields: props.blockInfo.props.fields
  }
})

const { fields, push, remove, swap, move } = useFieldArray('fields')

const addField = () => {
  push({
    type: 'text',
    label: '新字段',
    placeholder: '请输入',
    required: false,
    value: ''
  })
}

watch([values], ([newValues]) => {
  emit('change', { ...props.blockInfo, props: { ...props.blockInfo.props, ...newValues } })
})
</script>

<template>
  <div class="form-setting">
    <div>
      {{ props.blockInfo.type }}
    </div>
    <div class="fields-container">
      <div v-for="(field, index) in fields" :key="field.key" class="field-item">
        <input 
          class="field-input" 
          v-model="field.value.label" 
          placeholder="字段标签" 
        />
        <input 
          class="field-input" 
          v-model="field.value.type" 
          placeholder="字段类型" 
        />
        <input 
          class="field-input" 
          v-model="field.value.value" 
          placeholder="字段值" 
        />
        <input 
          class="field-input" 
          v-model="field.value.placeholder" 
          placeholder="占位符" 
        />
        <div class="field-checkbox">
          <input 
            type="checkbox" 
            v-model="field.value.required" 
          />
          <label>必填</label>
        </div>
        <button class="remove-button" @click="remove(index)">删除</button>
      </div>
    </div>
    <button class="add-button" @click="addField">添加字段</button>
  </div>
</template>

<style scoped>
.form-setting {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fields-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
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

.remove-button {
  width: fit-content;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
  font-size: 12px;
}

.add-button {
  margin-top: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-300);
  cursor: pointer;
  align-self: flex-start;
}
</style>