<template>
  <v-row class="justify-center justify-lg-end" v-if="totalPages > 1 && props.records?.items.length > 0">
    <v-col cols="12" lg="5">
      <v-pagination
        v-model="currentPage"
        density="compact"
        class="left-pagination"
        active-color="primary"
        :length="totalPages"
      />
    </v-col>
  </v-row>
  <div v-else></div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
const props = defineProps({
  records: {
    type: Object
  },
  filter: {
    type: Object
  }
});

let timeout: ReturnType<typeof setTimeout> | null = null;
const emit = defineEmits(['getRecords', 'changePage']);
const currentPage = ref<number>(props.records?.page || 1);

const totalPages = computed(() => {
  if (props.records?.total != 0 && props.records?.limit != 0) {
    return Math.ceil(props.records?.total / props.records?.limit);
  } else {
    return 0;
  }
});
// Hooks
watch(
  () => currentPage,
  (newValue) => {
    if (newValue.value != props.filter?.page) {
      emit('changePage', newValue);
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.filter,
  () => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      currentPage.value = props.filter?.page;
      emit('getRecords');
    }, 300);
  },
  { deep: true, immediate: true }
);
onUnmounted(async () => {
  if (timeout) {
    clearTimeout(timeout);
  }
});
</script>
