<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const id = route.params.id;

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Video', href: '/videos' },
  { title: 'Chi tiết video', disabled: true }
];

const video = ref({
  id, title: 'Hướng dẫn Vue 3 từ A đến Z',
  description: 'Video hướng dẫn chi tiết Vue 3 từ cơ bản đến nâng cao. Nội dung bao gồm Composition API, Pinia, Vue Router và nhiều hơn nữa.',
  channel: 'Dev Việt Nam', category: 'Lập trình',
  tags: ['vue3', 'javascript', 'frontend'],
  views: 128400, likes: 4820, dislikes: 120, comments: 324,
  duration: '1:24:00', status: 'published',
  publishedAt: '01/08/2026', createdAt: '28/07/2026',
  thumbnail: 'https://picsum.photos/seed/vue3/640/360'
});

const comments = ref([
  { id: 1, user: 'Nguyễn Văn A', content: 'Video rất hay, cảm ơn bạn!', time: '2 ngày trước', status: 'approved', likes: 12 },
  { id: 2, user: 'Trần Thị B', content: 'Bạn có thể làm thêm phần nâng cao không?', time: '3 ngày trước', status: 'approved', likes: 8 },
  { id: 3, user: 'Lê Văn C', content: 'Phần này mình không hiểu lắm...', time: '4 ngày trước', status: 'pending', likes: 2 }
]);

const statusColor: Record<string, string> = { published: 'success', draft: 'grey', processing: 'warning', blocked: 'error' };
const commentStatusColor: Record<string, string> = { approved: 'success', pending: 'warning', rejected: 'error' };

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb :title="video.title" :breadcrumbs="breadcrumbs" />

  <v-row class="mt-4">
    <v-col cols="12" lg="8">
      <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
        <v-img :src="video.thumbnail" aspect-ratio="16/9" cover class="rounded-t-lg bg-grey-lighten-3">
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-icon size="64" color="grey-lighten-1">mdi-video</v-icon>
            </div>
          </template>
          <div class="d-flex align-center justify-center fill-height">
            <v-btn icon="mdi-play-circle" size="x-large" color="white" variant="text" />
          </div>
        </v-img>
        <v-card-text>
          <h2 class="text-h5 font-weight-bold mb-2">{{ video.title }}</h2>
          <div class="d-flex flex-wrap align-center gap-3 text-medium-emphasis text-body-2 mb-3">
            <span><v-icon size="14">mdi-eye</v-icon> {{ fmt(video.views) }} lượt xem</span>
            <span><v-icon size="14">mdi-thumb-up</v-icon> {{ fmt(video.likes) }}</span>
            <span><v-icon size="14">mdi-thumb-down</v-icon> {{ fmt(video.dislikes) }}</span>
            <span><v-icon size="14">mdi-comment</v-icon> {{ fmt(video.comments) }} bình luận</span>
            <span><v-icon size="14">mdi-clock-outline</v-icon> {{ video.duration }}</span>
          </div>
          <p class="text-body-2 text-medium-emphasis">{{ video.description }}</p>
          <div class="d-flex flex-wrap gap-1 mt-3">
            <v-chip v-for="tag in video.tags" :key="tag" size="x-small" variant="tonal">{{ tag }}</v-chip>
          </div>
        </v-card-text>
      </v-card>

      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Bình luận ({{ comments.length }})</v-card-title>
        <v-divider />
        <v-list lines="two">
          <v-list-item v-for="c in comments" :key="c.id">
            <template #prepend>
              <v-avatar color="primary" size="36">{{ c.user[0] }}</v-avatar>
            </template>
            <v-list-item-title class="text-body-2 font-weight-medium">{{ c.user }}</v-list-item-title>
            <v-list-item-subtitle class="text-body-2">{{ c.content }}</v-list-item-subtitle>
            <template #append>
              <div class="d-flex flex-column align-end gap-1">
                <v-chip :color="commentStatusColor[c.status]" size="x-small" variant="tonal">{{ c.status }}</v-chip>
                <span class="text-caption text-medium-emphasis">{{ c.time }}</span>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>

    <v-col cols="12" lg="4">
      <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
        <v-card-title class="pa-4 pb-2 text-h6">Thông tin</v-card-title>
        <v-divider />
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Trạng thái</v-list-item-title>
            <template #append><v-chip :color="statusColor[video.status]" size="x-small" variant="tonal">{{ video.status }}</v-chip></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Kênh</v-list-item-title>
            <template #append><span class="text-body-2">{{ video.channel }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Danh mục</v-list-item-title>
            <template #append><span class="text-body-2">{{ video.category }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Ngày xuất bản</v-list-item-title>
            <template #append><span class="text-body-2">{{ video.publishedAt }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Ngày tạo</v-list-item-title>
            <template #append><span class="text-body-2">{{ video.createdAt }}</span></template>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-4 pt-0 d-flex gap-2">
          <v-btn variant="tonal" color="primary" :to="`/videos/\${id}/edit`" prepend-icon="mdi-pencil" size="small">Chỉnh sửa</v-btn>
          <v-btn variant="tonal" color="error" prepend-icon="mdi-lock" size="small">Khoá video</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
