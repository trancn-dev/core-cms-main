<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const route = useRoute();
const breadcrumbs: BreadcrumbType[] = [{ title: 'Người dùng', href: '/users' }, { title: 'Chi tiết', disabled: true }];

const user = ref({
  id: route.params.id, name: 'Nguyễn Văn An', email: 'an@email.com',
  role: 'creator', status: 'active', createdAt: '10/01/2024',
  totalVideos: 84, totalViews: 2840000, subscribers: 128400
});

const recentVideos = ref([
  { id: 1, title: 'Hướng dẫn Vue 3', views: 128400, createdAt: '01/08/2026' },
  { id: 2, title: 'Pinia Store', views: 53200, createdAt: '18/08/2026' }
]);

const roleColor: Record<string, string> = { admin: 'error', moderator: 'warning', creator: 'info', viewer: 'success' };
function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb :title="user.name" :breadcrumbs="breadcrumbs" />
  <v-row class="mt-4">
    <v-col cols="12" md="4">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text class="text-center pa-6">
          <v-avatar :color="roleColor[user.role]" size="80" class="mb-3">
            <span class="text-h4 text-white">{{ user.name[0] }}</span>
          </v-avatar>
          <h3 class="text-h5 font-weight-bold">{{ user.name }}</h3>
          <div class="text-body-2 text-medium-emphasis">{{ user.email }}</div>
          <div class="d-flex justify-center gap-2 mt-2">
            <v-chip :color="roleColor[user.role]" size="small" variant="tonal">{{ user.role }}</v-chip>
            <v-chip :color="user.status === 'active' ? 'success' : 'error'" size="small" variant="tonal">{{ user.status === 'active' ? 'Hoạt động' : 'Bị cấm' }}</v-chip>
          </div>
        </v-card-text>
        <v-divider />
        <v-list density="compact">
          <v-list-item>
            <v-list-item-title class="text-body-2 text-medium-emphasis">Ngày tham gia</v-list-item-title>
            <template #append><span class="text-body-2">{{ user.createdAt }}</span></template>
          </v-list-item>
        </v-list>
        <v-card-actions class="pa-4 d-flex gap-2">
          <v-btn variant="tonal" color="primary" :to="`/users/\${user.id}/edit`" size="small" prepend-icon="mdi-pencil">Chỉnh sửa</v-btn>
          <v-btn variant="tonal" color="error" size="small" prepend-icon="mdi-account-cancel">Cấm</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-row class="mb-4">
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-primary">{{ user.totalVideos }}</div><div class="text-caption text-medium-emphasis">Video</div></v-card></v-col>
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-success">{{ fmt(user.subscribers) }}</div><div class="text-caption text-medium-emphasis">Subscribers</div></v-card></v-col>
        <v-col cols="4"><v-card rounded="lg" elevation="0" variant="outlined" class="text-center pa-4"><div class="text-h4 font-weight-bold text-warning">{{ fmt(user.totalViews) }}</div><div class="text-caption text-medium-emphasis">Tổng lượt xem</div></v-card></v-col>
      </v-row>
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Video gần đây</v-card-title>
        <v-divider />
        <v-table density="compact">
          <thead><tr><th>Tiêu đề</th><th class="text-right">Lượt xem</th><th>Ngày tạo</th></tr></thead>
          <tbody>
            <tr v-for="v in recentVideos" :key="v.id">
              <td><router-link :to="`/videos/\${v.id}`" class="text-primary text-decoration-none text-body-2">{{ v.title }}</router-link></td>
              <td class="text-right text-body-2">{{ fmt(v.views) }}</td>
              <td class="text-body-2 text-medium-emphasis">{{ v.createdAt }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-col>
  </v-row>
</template>
