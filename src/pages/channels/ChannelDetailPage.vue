<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const id = route.params.id;
const breadcrumbs: BreadcrumbType[] = [{ title: 'Kênh', href: '/channels' }, { title: 'Chi tiết', disabled: true }];

const channel = ref({
  id, name: 'Dev Việt Nam', slug: 'dev-viet-nam',
  description: 'Kênh chia sẻ kiến thức lập trình web, framework hiện đại và công nghệ mới nhất.',
  owner: 'Nguyễn Văn An', email: 'an@devvn.com',
  subscribers: 128400, totalViews: 2840000, videos: 84,
  status: 'active', verified: true, createdAt: '15/03/2024'
});

const recentVideos = ref([
  { id: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', views: 128400, status: 'published', createdAt: '01/08/2026' },
  { id: 2, title: 'Pinia — Quản lý state trong Vue', views: 53200, status: 'published', createdAt: '18/08/2026' },
  { id: 3, title: 'Vue Router 4 Nâng cao', views: 38100, status: 'draft', createdAt: '25/08/2026' }
]);

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb :title="channel.name" :breadcrumbs="breadcrumbs" />
  <v-row class="mt-4">
    <v-col cols="12" lg="4">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text class="text-center pa-6">
          <v-avatar color="primary" size="80" rounded="lg" class="mb-3">
            <span class="text-h4 text-white">{{ channel.name[0] }}</span>
          </v-avatar>
          <h3 class="text-h5 font-weight-bold">
            {{ channel.name }}
            <v-icon v-if="channel.verified" size="20" color="info">mdi-check-decagram</v-icon>
          </h3>
          <div class="text-caption text-medium-emphasis">/{{ channel.slug }}</div>
          <p class="text-body-2 text-medium-emphasis mt-2">{{ channel.description }}</p>
        </v-card-text>
        <v-divider />
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Chủ kênh</v-list-item-title>
            <template #append><span class="text-body-2">{{ channel.owner }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Email</v-list-item-title>
            <template #append><span class="text-body-2">{{ channel.email }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Ngày tạo</v-list-item-title>
            <template #append><span class="text-body-2">{{ channel.createdAt }}</span></template>
          </v-list-item>
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Trạng thái</v-list-item-title>
            <template #append><v-chip color="success" size="x-small" variant="tonal">Hoạt động</v-chip></template>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-4 d-flex gap-2">
          <v-btn variant="tonal" color="primary" :to="`/channels/\${id}/edit`" size="small" prepend-icon="mdi-pencil">Chỉnh sửa</v-btn>
          <v-btn variant="tonal" color="error" size="small" prepend-icon="mdi-cancel">Đình chỉ</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" lg="8">
      <v-row class="mb-4">
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-primary">{{ channel.videos }}</div><div class="text-caption text-medium-emphasis">Video</div></v-card></v-col>
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-success">{{ fmt(channel.subscribers) }}</div><div class="text-caption text-medium-emphasis">Subscribers</div></v-card></v-col>
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-warning">{{ fmt(channel.totalViews) }}</div><div class="text-caption text-medium-emphasis">Tổng lượt xem</div></v-card></v-col>
      </v-row>
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Video gần đây</v-card-title>
        <v-divider />
        <v-table density="compact">
          <thead><tr><th>Tiêu đề</th><th class="text-right">Lượt xem</th><th>Trạng thái</th><th>Ngày tạo</th></tr></thead>
          <tbody>
            <tr v-for="v in recentVideos" :key="v.id">
              <td><router-link :to="`/videos/\${v.id}`" class="text-primary text-decoration-none text-body-2">{{ v.title }}</router-link></td>
              <td class="text-right text-body-2">{{ fmt(v.views) }}</td>
              <td><v-chip :color="v.status === 'published' ? 'success' : 'grey'" size="x-small" variant="tonal">{{ v.status === 'published' ? 'Đã xuất bản' : 'Bản nháp' }}</v-chip></td>
              <td class="text-body-2 text-medium-emphasis">{{ v.createdAt }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-card-actions><v-btn variant="text" color="primary" size="small" to="/videos">Xem tất cả video →</v-btn></v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
