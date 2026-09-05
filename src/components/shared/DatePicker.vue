<template>
    <VueDatePicker
      v-bind="$attrs"
      :format-locale="vi"
      :auto-apply="props.autoApply"
      :dark="theme.current.value.dark"
      teleport-center
      select-text="Chọn"
      cancel-text="Hủy"
      time-picker
      v-if="props.isTimePicker"
    />
    <VueDatePicker
      v-bind="$attrs"
      :format-locale="vi"
      :auto-apply="props.autoApply"
      :enable-time-picker="false"
      :dark="theme.current.value.dark"
      teleport-center
      model-type="yyyy-MM-dd"
      :format="'dd/MM/yyyy'"
      v-else
    />
  </template>
  
  <script setup lang="ts">
  import VueDatePicker from '@vuepic/vue-datepicker';
  import { vi } from 'date-fns/locale';
  import { useTheme } from 'vuetify/lib/framework.mjs';
  const props = defineProps({
    autoApply: {
      type: Boolean,
      default: true
    },
    isTimePicker: {
      type: Boolean,
      default: false
    }
  });
  const theme = useTheme();
  </script>
  