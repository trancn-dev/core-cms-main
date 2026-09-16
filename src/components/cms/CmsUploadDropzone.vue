<script setup lang="ts">
import { computed, ref } from 'vue';
import { TONE_COLORS, type StatusTone } from '@/utils/statusMaps';

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'failed';

const props = withDefaults(
  defineProps<{
    status?: UploadStatus;
    /** 0–100. Drives the bar and the percentage in the hint. */
    progress?: number;
    fileName?: string;
    /** e.g. "2,4 GB · 1080p · tải lên 12/09/2026". */
    fileMeta?: string;
    /** Line under the bar, e.g. "Còn khoảng 3 phút · 1,5 / 2,4 GB". */
    hint?: string;
    errorMessage?: string;
    accept?: string;
    /** Requirements line shown in the idle state. */
    requirements?: string;
    /** Offer the "pick from media library" button. */
    library?: boolean;
  }>(),
  {
    status: 'idle',
    progress: 0,
    accept: 'video/*',
    requirements: 'MP4, MOV, MKV · tối đa 5 GB',
    library: true
  }
);

const emit = defineEmits<{
  select: [files: File[]];
  cancel: [];
  retry: [];
  library: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);

const isIdle = computed(() => props.status === 'idle');
const isBusy = computed(() => props.status === 'uploading' || props.status === 'processing');
const isFailed = computed(() => props.status === 'failed');

const zoneClass = computed(() => ({
  'cms-dropzone--over': dragOver.value,
  'cms-dropzone--idle': isIdle.value && !dragOver.value,
  'cms-dropzone--filled': !isIdle.value
}));

const statusMeta = computed<{ label: string; tone: StatusTone }>(() => {
  switch (props.status) {
    case 'uploading':
      return { label: 'Đang tải lên', tone: 'warning' };
    case 'processing':
      return { label: 'Đang xử lý', tone: 'warning' };
    case 'done':
      return { label: 'Hoàn tất', tone: 'success' };
    case 'failed':
      return { label: 'Thất bại', tone: 'error' };
    default:
      return { label: '', tone: 'grey' };
  }
});

const chipColors = computed(() => TONE_COLORS[statusMeta.value.tone]);

function onDrop(e: DragEvent) {
  dragOver.value = false;
  const files = Array.from(e.dataTransfer?.files ?? []);
  if (files.length) emit('select', files);
}

function onPick(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? []);
  if (files.length) emit('select', files);
  // Allow picking the same file again after a cancel
  (e.target as HTMLInputElement).value = '';
}
</script>

<template>
  <div
    class="cms-dropzone"
    :class="zoneClass"
    @dragover.prevent="dragOver = true"
    @dragleave.prevent="dragOver = false"
    @drop.prevent="onDrop"
  >
    <input ref="inputRef" type="file" :accept="accept" class="d-none" @change="onPick" />

    <!-- Idle: the whole zone is the drop target -->
    <div v-if="isIdle" class="d-flex flex-column align-center ga-3 pa-8 text-center">
      <v-icon size="40">mdi-cloud-upload-outline</v-icon>
      <div class="text-subtitle-1">Kéo tệp vào đây hoặc chọn từ máy</div>
      <div class="text-body-2" style="opacity: 0.8">{{ requirements }}</div>
      <div class="d-flex ga-2 mt-1 flex-wrap justify-center">
        <v-btn color="primary" size="small" @click="inputRef?.click()">Chọn tệp</v-btn>
        <v-btn v-if="library" variant="outlined" size="small" @click="emit('library')">
          Chọn từ thư viện media
        </v-btn>
      </div>
    </div>

    <!-- A file is attached: show it, its progress and its state -->
    <div v-else class="pa-4 d-flex flex-column ga-3">
      <div class="d-flex align-center ga-3">
        <div class="cms-table__thumb" style="width: 64px; height: 40px">
          <v-icon size="18" color="lightText">mdi-movie-outline</v-icon>
        </div>
        <div class="flex-grow-1" style="min-width: 0">
          <div class="text-subtitle-1">{{ fileName }}</div>
          <div class="text-body-2 text-lightText">{{ fileMeta }}</div>
        </div>
        <span class="cms-chip" :class="[`bg-${chipColors.bg}`, `text-${chipColors.fg}`]">
          {{ statusMeta.label }}
        </span>
        <v-btn v-if="isBusy" variant="outlined" size="small" @click="emit('cancel')">Huỷ</v-btn>
      </div>

      <v-progress-linear
        v-if="isBusy || isFailed"
        :model-value="progress"
        :color="isFailed ? 'error' : 'primary'"
        height="6"
        rounded
        :indeterminate="status === 'processing'"
      />

      <div v-if="hint" class="text-body-2 text-lightText">{{ hint }}</div>

      <div v-if="isFailed" class="d-flex align-center ga-3 pa-3 rounded-md bg-lighterror">
        <v-icon size="20" color="error">mdi-alert-circle</v-icon>
        <div class="flex-grow-1 text-body-2">{{ errorMessage }}</div>
        <v-btn color="error" size="small" @click="emit('retry')">Tiếp tục tải</v-btn>
      </div>
    </div>
  </div>
</template>
