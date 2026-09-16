<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsInfoRow from '@/components/cms/CmsInfoRow.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsStatCard from '@/components/cms/CmsStatCard.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { CommentStatus, VideoStatus } from '@/types/media';

const route = useRoute();
const toast = useToast();
const id = route.params.id;

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Video', href: '/videos' },
  { title: 'Chi tiết video', disabled: true }
];

const video = ref({
  id,
  title: 'Hướng dẫn Vue 3 từ A đến Z',
  description:
    'Video hướng dẫn chi tiết Vue 3 từ cơ bản đến nâng cao. Nội dung bao gồm Composition API, Pinia, Vue Router và nhiều hơn nữa.',
  channel: 'Dev Việt Nam',
  category: 'Lập trình',
  tags: ['vue3', 'javascript', 'frontend'],
  views: 128400,
  likes: 4820,
  comments: 324,
  duration: '1:24:00',
  status: 'published' as VideoStatus,
  publishedAt: '01/08/2026',
  createdAt: '28/07/2026',
  thumbnail: 'https://picsum.photos/seed/vue3/640/360'
});

const comments = ref<{ id: number; user: string; content: string; time: string; status: CommentStatus }[]>([
  { id: 1, user: 'Nguyễn Văn A', content: 'Video rất hay, cảm ơn bạn!', time: '2 ngày trước', status: 'approved' },
  { id: 2, user: 'Trần Thị B', content: 'Bạn có thể làm thêm phần nâng cao không?', time: '3 ngày trước', status: 'approved' },
  { id: 3, user: 'Lê Văn C', content: 'Phần này mình không hiểu lắm...', time: '4 ngày trước', status: 'pending' }
]);

const fmt = (n: number) => n.toLocaleString('vi-VN');

const blockDialog = ref(false);
const isBlocked = () => video.value.status === 'blocked';

function confirmBlock() {
  video.value.status = isBlocked() ? 'draft' : 'blocked';
  blockDialog.value = false;
  toast.success(isBlocked() ? 'Đã khoá video.' : 'Đã mở khoá video.');
}
</script>

<template>
  <BaseBreadcrumb :title="video.title" :breadcrumbs="breadcrumbs">
    <template #actions>
      <v-btn
        :color="isBlocked() ? 'success' : 'error'"
        variant="tonal"
        size="small"
        :prepend-icon="isBlocked() ? 'mdi-check' : 'mdi-cancel'"
        @click="blockDialog = true"
      >
        {{ isBlocked() ? 'Mở khoá' : 'Khoá video' }}
      </v-btn>
      <v-btn color="primary" size="small" prepend-icon="mdi-pencil" :to="`/videos/${id}/edit`">Chỉnh sửa</v-btn>
    </template>
  </BaseBreadcrumb>

  <v-row>
    <v-col cols="12" lg="8" class="d-flex flex-column ga-5">
      <v-card variant="outlined" rounded="lg" elevation="0" class="overflow-hidden">
        <v-img :src="video.thumbnail" aspect-ratio="16/9" cover class="bg-gray100">
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon size="48" color="lightText">mdi-movie-outline</v-icon>
            </div>
          </template>
          <div class="d-flex align-center justify-center fill-height">
            <v-btn icon size="x-large" color="white" variant="text" aria-label="Phát video">
              <v-icon size="56">mdi-play-circle</v-icon>
            </v-btn>
          </div>
        </v-img>
        <div class="pa-4 d-flex flex-column ga-3">
          <p class="text-body-1 text-lightText mb-0">{{ video.description }}</p>
          <div class="d-flex flex-wrap ga-2">
            <span v-for="tag in video.tags" :key="tag" class="cms-chip cms-chip--sm bg-lightprimary text-onLightprimary">
              {{ tag }}
            </span>
          </div>
        </div>
      </v-card>

      <v-row dense>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-eye" label="Lượt xem" :value="fmt(video.views)" tone="primary" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-thumb-up-outline" label="Lượt thích" :value="fmt(video.likes)" tone="success" />
        </v-col>
        <v-col cols="12" sm="4">
          <CmsStatCard icon="mdi-comment-outline" label="Bình luận" :value="fmt(video.comments)" tone="info" />
        </v-col>
      </v-row>

      <CmsFormCard :title="`Bình luận gần đây (${comments.length})`">
        <div>
          <div v-for="c in comments" :key="c.id" class="cms-info-row align-start">
            <div class="d-flex ga-3" style="min-width: 0">
              <v-avatar color="lightprimary" size="32">
                <span class="text-onLightprimary text-body-2 font-weight-bold">{{ c.user[0] }}</span>
              </v-avatar>
              <div style="min-width: 0">
                <div class="font-weight-medium">{{ c.user }}</div>
                <div class="text-lightText">{{ c.content }}</div>
              </div>
            </div>
            <div class="d-flex flex-column align-end ga-1 flex-shrink-0">
              <CmsStatusChip type="comment" :value="c.status" />
              <span class="text-caption text-lightText">{{ c.time }}</span>
            </div>
          </div>
        </div>
        <div class="d-flex justify-end">
          <v-btn variant="text" color="primary" size="small" to="/comments">Xem tất cả →</v-btn>
        </div>
      </CmsFormCard>
    </v-col>

    <v-col cols="12" lg="4">
      <CmsFormCard title="Thông tin">
        <div>
          <CmsInfoRow label="Trạng thái"><CmsStatusChip type="video" :value="video.status" /></CmsInfoRow>
          <CmsInfoRow label="Kênh" :value="video.channel" />
          <CmsInfoRow label="Danh mục" :value="video.category" />
          <CmsInfoRow label="Thời lượng" :value="video.duration" />
          <CmsInfoRow label="Ngày xuất bản" :value="video.publishedAt" />
          <CmsInfoRow label="Ngày tạo" :value="video.createdAt" />
        </div>
      </CmsFormCard>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="blockDialog"
    :title="isBlocked() ? 'Mở khoá video' : 'Khoá video'"
    :confirm-label="isBlocked() ? 'Mở khoá' : 'Khoá'"
    :color="isBlocked() ? 'success' : 'error'"
    :icon="isBlocked() ? 'mdi-check' : 'mdi-cancel'"
    :message="
      isBlocked()
        ? `Mở khoá “${video.title}”? Video sẽ chuyển về bản nháp.`
        : `Khoá “${video.title}”? Người xem sẽ không truy cập được video này.`
    "
    @confirm="confirmBlock"
  />
</template>
