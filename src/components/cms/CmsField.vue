<script setup lang="ts">
/**
 * The one input pattern in this CMS: label sitting above the control.
 * Vuetify's floating label is not used anywhere — see artboard 01.
 */
defineProps<{
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}>();

// Vue 3.4 has no useId(); the control needs a stable id to bind the label to.
const id = `cms-field-${Math.random().toString(36).slice(2, 9)}`;
</script>

<template>
  <div class="cms-field">
    <label class="cms-field__label" :class="{ 'is-error': error }" :for="id">
      {{ label }}<span v-if="required" class="cms-field__required"> *</span>
    </label>

    <slot :id="id" />

    <div v-if="error || hint" class="cms-field__hint" :class="{ 'is-error': error }">
      {{ error || hint }}
    </div>
  </div>
</template>
