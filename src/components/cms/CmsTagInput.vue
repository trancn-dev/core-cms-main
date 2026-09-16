<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder?: string;
  }>(),
  { placeholder: 'Thêm tag rồi nhấn Enter…' }
);

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const draft = ref('');

function addTag() {
  const value = draft.value.trim();
  if (!value) return;
  if (!props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value]);
  }
  draft.value = '';
}

function removeTag(tag: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((t) => t !== tag)
  );
}

/** Backspace on an empty draft removes the last tag. */
function onBackspace() {
  if (draft.value === '' && props.modelValue.length) {
    emit('update:modelValue', props.modelValue.slice(0, -1));
  }
}
</script>

<template>
  <div class="cms-tag-input">
    <span
      v-for="tag in modelValue"
      :key="tag"
      class="cms-tag-input__tag"
      role="button"
      :aria-label="`Xoá tag ${tag}`"
      @click="removeTag(tag)"
    >
      {{ tag }}
      <v-icon size="14">mdi-close</v-icon>
    </span>

    <input
      v-model="draft"
      type="text"
      class="cms-tag-input__input"
      :placeholder="placeholder"
      @keydown.enter.prevent="addTag"
      @keydown.delete="onBackspace"
      @blur="addTag"
    />
  </div>
</template>
