<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id);

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Video', href: '/videos' },
  { title: isEdit.value ? 'Chỉnh sửa video' : 'Thêm video', disabled: true }
];

const form = ref({
  title: '',
  description: '',
  categoryId: '',
  channelId: '',
  tags: [] as string[],
  status: 'draft',
  allowComments: true,
  isFeatured: false,
  videoFile: null as File | null,
  thumbnailFile: null as File | null
});

const tagInput = ref('');
const saving = ref(false);

const categories = [
  { id: 1, name: 'Lập trình' }, { id: 2, name: 'Thiết kế' },
  { id: 3, name: 'DevOps' }, { id: 4, name: 'Database' }, { id: 5, name: 'Công cụ' }
];
const channels = [
  { id: 1, name: 'Dev Việt Nam' }, { id: 2, name: 'Code Pro' },
  { id: 3, name: 'Frontend Studio' }, { id: 4, name: 'DevOps VN' }
];
const statusOpts = [
  { title: 'Bản nháp', value: 'draft' },
  { title: 'Đã xuất bản', value: 'published' },
  { title: 'Không danh sách', value: 'unlisted' }
];

if (isEdit.value) {
  form.value = {
    title: 'Hướng dẫn Vue 3 từ A đến Z',
    description: 'Video hướng dẫn chi tiết Vue 3 từ cơ bản đến nâng cao.',
    categoryId: '1', channelId: '1',
    tags: ['vue3', 'javascript', 'frontend'],
    status: 'published', allowComments: true, isFeatured: false,
    videoFile: null, thumbnailFile: null
  };
}

function addTag() {
  const t = tagInput.value.trim();
  if (t && !form.value.tags.includes(t)) form.value.tags.push(t);
  tagInput.value = '';
}

async function onSubmit() {
  saving.value = true;
  await new Promise(r => setTimeout(r, 800));
  saving.value = false;
  router.push('/videos');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa video' : 'Thêm video mới'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit" class="mt-4">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-h6">Thông tin video</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-text-field v-model="form.title" label="Tiêu đề *" variant="outlined" density="compact" placeholder="Nhập tiêu đề video..." class="mb-3" />
            <v-textarea v-model="form.description" label="Mô tả" variant="outlined" density="compact" rows="4" placeholder="Mô tả nội dung video..." class="mb-3" />
            <div class="text-body-2 font-weight-medium mb-1">Tags</div>
            <div class="d-flex align-center gap-2 mb-2">
              <v-text-field v-model="tagInput" variant="outlined" density="compact" placeholder="Thêm tag rồi nhấn Enter" hide-details @keydown.enter.prevent="addTag" class="flex-grow-1" />
              <v-btn variant="tonal" density="compact" @click="addTag">Thêm</v-btn>
            </div>
            <div class="d-flex flex-wrap gap-1 mb-3">
              <v-chip v-for="tag in form.tags" :key="tag" size="small" closable @click:close="form.tags = form.tags.filter(t => t !== tag)">{{ tag }}</v-chip>
            </div>
          </v-card-text>
        </v-card>

        <v-card rounded="lg" elevation="0" variant="outlined">
          <v-card-title class="pa-4 pb-2 text-h6">Tệp video & hình ảnh</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-file-input v-model="form.videoFile" label="Chọn file video" variant="outlined" density="compact" accept="video/*" prepend-icon="" prepend-inner-icon="mdi-video-plus" class="mb-3" />
            <v-file-input v-model="form.thumbnailFile" label="Ảnh thumbnail" variant="outlined" density="compact" accept="image/*" prepend-icon="" prepend-inner-icon="mdi-image-plus" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-h6">Xuất bản</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-select v-model="form.status" :items="statusOpts" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" class="mb-3" />
            <v-switch v-model="form.allowComments" label="Cho phép bình luận" density="compact" color="primary" hide-details class="mb-2" />
            <v-switch v-model="form.isFeatured" label="Video nổi bật" density="compact" color="primary" hide-details />
          </v-card-text>
        </v-card>

        <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
          <v-card-title class="pa-4 pb-2 text-h6">Phân loại</v-card-title>
          <v-divider />
          <v-card-text class="pa-4">
            <v-select v-model="form.categoryId" :items="categories" item-title="name" item-value="id" label="Danh mục" variant="outlined" density="compact" class="mb-3" />
            <v-select v-model="form.channelId" :items="channels" item-title="name" item-value="id" label="Kênh" variant="outlined" density="compact" />
          </v-card-text>
        </v-card>

        <div class="d-flex gap-2">
          <v-btn variant="outlined" to="/videos" class="flex-grow-1">Huỷ</v-btn>
          <v-btn color="primary" type="submit" :loading="saving" class="flex-grow-1">{{ isEdit ? 'Lưu thay đổi' : 'Tạo video' }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>
