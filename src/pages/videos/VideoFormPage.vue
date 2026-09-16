<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsTagInput from '@/components/cms/CmsTagInput.vue';
import CmsUploadDropzone, { type UploadStatus } from '@/components/cms/CmsUploadDropzone.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { VideoStatus } from '@/types/media';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isEdit = computed(() => !!route.params.id);

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Video', href: '/videos' },
  { title: isEdit.value ? 'Chỉnh sửa video' : 'Thêm video', disabled: true }
];

const form = ref({
  title: '',
  description: '',
  categoryId: null as number | null,
  channelId: null as number | null,
  playlistId: null as number | null,
  tags: [] as string[],
  status: 'draft' as VideoStatus,
  publishAt: null as string | null,
  allowComments: true
});

const categories = [
  { id: 1, name: 'Lập trình › Frontend' },
  { id: 2, name: 'Lập trình › Backend' },
  { id: 3, name: 'Thiết kế' },
  { id: 4, name: 'DevOps' },
  { id: 5, name: 'Database' },
  { id: 6, name: 'Công cụ' }
];
const channels = [
  { id: 1, name: 'Dev Việt Nam' },
  { id: 2, name: 'Code Pro' },
  { id: 3, name: 'Frontend Studio' },
  { id: 4, name: 'DevOps VN' },
  { id: 5, name: 'DB Master' }
];
const playlists = [
  { id: 1, name: 'Vue 3 cơ bản' },
  { id: 2, name: 'TypeScript nâng cao' },
  { id: 3, name: 'DevOps 101' }
];
const publishOpts: { value: VideoStatus; label: string }[] = [
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Xuất bản' },
  { value: 'unlisted', label: 'Không công khai' }
];

// ─── Upload ─────────────────────────────────────────────────────────────────
// Simulated until the Laravel upload endpoint / storage exists.
const upload = ref<{ status: UploadStatus; progress: number; fileName: string; size: number }>({
  status: 'idle',
  progress: 0,
  fileName: '',
  size: 0
});
let uploadTimer: ReturnType<typeof setInterval> | undefined;

const fmtSize = (bytes: number) =>
  bytes >= 1024 ** 3
    ? `${(bytes / 1024 ** 3).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} GB`
    : `${(bytes / 1024 ** 2).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} MB`;

const uploadMeta = computed(() => (upload.value.size ? fmtSize(upload.value.size) : ''));
const uploadHint = computed(() => {
  const u = upload.value;
  if (u.status === 'uploading') return `Đang tải lên ${u.progress}% · ${fmtSize((u.size * u.progress) / 100)} / ${fmtSize(u.size)}`;
  if (u.status === 'done') return 'Tải lên hoàn tất. Video sẽ được xử lý sau khi lưu.';
  return '';
});

function startUpload(files: File[]) {
  const file = files[0];
  upload.value = { status: 'uploading', progress: 0, fileName: file.name, size: file.size };
  runUpload();
}

function runUpload() {
  clearInterval(uploadTimer);
  upload.value.status = 'uploading';
  uploadTimer = setInterval(() => {
    upload.value.progress = Math.min(100, upload.value.progress + 7);
    if (upload.value.progress >= 100) {
      clearInterval(uploadTimer);
      upload.value.status = 'done';
    }
  }, 200);
}

function cancelUpload() {
  clearInterval(uploadTimer);
  upload.value = { status: 'idle', progress: 0, fileName: '', size: 0 };
}

onBeforeUnmount(() => clearInterval(uploadTimer));

if (isEdit.value) {
  form.value = {
    title: 'Hướng dẫn Vue 3 từ A đến Z',
    description: 'Khoá học 8 chương về Composition API, router và state management.',
    categoryId: 1,
    channelId: 1,
    playlistId: 1,
    tags: ['vue 3', 'frontend'],
    status: 'published',
    publishAt: '2026-09-16',
    allowComments: true
  };
  upload.value = { status: 'done', progress: 100, fileName: 'huong-dan-vue-3.mp4', size: 2.4 * 1024 ** 3 };
}

// ─── Submit ─────────────────────────────────────────────────────────────────
const saving = ref(false);
const submitted = ref(false);

const errors = computed(() => ({
  title: !form.value.title.trim() ? 'Vui lòng nhập tiêu đề' : '',
  channelId: !form.value.channelId ? 'Vui lòng chọn kênh' : '',
  categoryId: !form.value.categoryId ? 'Vui lòng chọn danh mục' : '',
  file: upload.value.status !== 'done' ? 'Vui lòng tải lên tệp video' : ''
}));
const shownError = (key: keyof typeof errors.value) => (submitted.value ? errors.value[key] : '');

async function onSubmit() {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean)) {
    toast.error('Không lưu được — kiểm tra lại các trường bắt buộc.');
    return;
  }
  saving.value = true;
  await new Promise((r) => setTimeout(r, 800));
  saving.value = false;
  toast.success(`Đã lưu video “${form.value.title}”.`);
  router.push('/videos');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa video' : 'Thêm video'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit">
    <v-row>
      <v-col cols="12" lg="8" class="d-flex flex-column ga-5">
        <CmsFormCard title="Tệp video">
          <CmsUploadDropzone
            :status="upload.status"
            :progress="upload.progress"
            :file-name="upload.fileName"
            :file-meta="uploadMeta"
            :hint="uploadHint"
            error-message="Tải lên thất bại — mất kết nối tới máy chủ lưu trữ. Có thể tiếp tục tải."
            @select="startUpload"
            @cancel="cancelUpload"
            @retry="runUpload"
          />
          <div v-if="shownError('file')" class="cms-field__hint is-error">{{ shownError('file') }}</div>
          <div v-if="upload.status === 'done'" class="d-flex justify-end">
            <v-btn variant="text" size="small" color="primary" @click="cancelUpload">Thay tệp khác</v-btn>
          </div>
        </CmsFormCard>

        <CmsFormCard title="Thông tin video">
          <CmsField v-slot="{ id }" label="Tiêu đề" required :error="shownError('title')">
            <v-text-field
              :id="id"
              v-model="form.title"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Nhập tiêu đề video…"
              :error="!!shownError('title')"
            />
          </CmsField>

          <CmsField v-slot="{ id }" label="Mô tả">
            <v-textarea
              :id="id"
              v-model="form.description"
              variant="outlined"
              density="compact"
              hide-details
              rows="3"
              auto-grow
              placeholder="Mô tả ngắn hiển thị dưới video…"
            />
          </CmsField>

          <CmsField label="Tags">
            <CmsTagInput v-model="form.tags" />
          </CmsField>
        </CmsFormCard>
      </v-col>

      <v-col cols="12" lg="4" class="d-flex flex-column ga-4">
        <CmsFormCard title="Xuất bản">
          <CmsField label="Trạng thái">
            <v-btn-toggle v-model="form.status" mandatory class="cms-segmented" variant="text">
              <v-btn v-for="o in publishOpts" :key="o.value" :value="o.value">{{ o.label }}</v-btn>
            </v-btn-toggle>
          </CmsField>

          <CmsField label="Thời điểm xuất bản" hint="Để trống để xuất bản ngay khi lưu">
            <DatePicker v-model="form.publishAt" placeholder="dd/mm/yyyy" />
          </CmsField>

          <v-switch
            v-model="form.allowComments"
            label="Cho phép bình luận"
            color="primary"
            density="compact"
            hide-details
            inset
          />
        </CmsFormCard>

        <CmsFormCard title="Phân loại">
          <CmsField v-slot="{ id }" label="Kênh" required :error="shownError('channelId')">
            <v-select
              :id="id"
              v-model="form.channelId"
              :items="channels"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Chọn kênh"
              :error="!!shownError('channelId')"
            />
          </CmsField>

          <CmsField v-slot="{ id }" label="Danh mục" required :error="shownError('categoryId')">
            <v-select
              :id="id"
              v-model="form.categoryId"
              :items="categories"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              placeholder="Chọn danh mục"
              :error="!!shownError('categoryId')"
            />
          </CmsField>

          <CmsField v-slot="{ id }" label="Playlist">
            <v-select
              :id="id"
              v-model="form.playlistId"
              :items="playlists"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              placeholder="Chưa chọn"
            />
          </CmsField>

          <div class="text-body-2 text-lightText">Bắt buộc: tiêu đề, kênh, danh mục, tệp video.</div>
        </CmsFormCard>

        <CmsFormActions cancel-to="/videos" :submit-label="isEdit ? 'Lưu thay đổi' : 'Tạo video'" :loading="saving" />
      </v-col>
    </v-row>
  </v-form>
</template>
