<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Thống kê & Analytics', disabled: true }];
const rangeFilter = ref('7d');

const summaryStats = [
  { label: 'Tổng lượt xem', value: '284.320', icon: 'mdi-eye', color: 'primary' },
  { label: 'Watch time (giờ)', value: '48.240', icon: 'mdi-clock-outline', color: 'success' },
  { label: 'Lượt thích', value: '12.840', icon: 'mdi-thumb-up', color: 'warning' },
  { label: 'Subscribers mới', value: '1.240', icon: 'mdi-account-plus', color: 'info' }
];

const topVideos = [
  { id: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', views: 128400, watchTime: 18240, likes: 4820, ctr: '8.4%' },
  { id: 2, title: 'Học TypeScript trong 1 giờ', views: 97200, watchTime: 12800, likes: 3640, ctr: '7.2%' },
  { id: 3, title: 'Vuetify 3 — UI Components', views: 84500, watchTime: 10200, likes: 2980, ctr: '6.8%' },
  { id: 4, title: 'Docker cho người mới bắt đầu', views: 72100, watchTime: 9600, likes: 2540, ctr: '5.9%' },
  { id: 5, title: 'PostgreSQL — Tối ưu Query', views: 61800, watchTime: 8400, likes: 2120, ctr: '5.1%' }
];

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb title="Thống kê & Analytics" :breadcrumbs="breadcrumbs" />

  <div class="mt-4 mb-4">
    <v-btn-toggle v-model="rangeFilter" mandatory rounded="lg" density="compact" color="primary">
      <v-btn value="7d" size="small">7 ngày</v-btn>
      <v-btn value="30d" size="small">30 ngày</v-btn>
      <v-btn value="90d" size="small">90 ngày</v-btn>
      <v-btn value="all" size="small">Tất cả</v-btn>
    </v-btn-toggle>
  </div>

  <v-row class="mb-4">
    <v-col v-for="s in summaryStats" :key="s.label" cols="12" sm="6" lg="3">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text>
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="text-caption text-medium-emphasis mb-1">{{ s.label }}</div>
              <div class="text-h4 font-weight-bold">{{ s.value }}</div>
            </div>
            <v-avatar :color="s.color" size="48" rounded="lg">
              <v-icon :icon="s.icon" size="24" color="white" />
            </v-avatar>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
    <v-card-title class="pa-4 pb-2 text-h6">Lượt xem theo ngày</v-card-title>
    <v-divider />
    <v-card-text class="pa-4">
      <div class="d-flex align-center justify-center bg-grey-lighten-4 rounded-lg" style="height:200px">
        <div class="text-center text-medium-emphasis">
          <v-icon size="48" class="mb-2">mdi-chart-line</v-icon>
          <div class="text-body-2">Biểu đồ lượt xem theo ngày<br/>(Tích hợp ApexCharts / Chart.js)</div>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-card rounded="lg" elevation="0" variant="outlined">
    <v-card-title class="pa-4 pb-2 text-h6">Top video hiệu suất cao</v-card-title>
    <v-divider />
    <v-table density="compact">
      <thead>
        <tr><th>#</th><th>Tiêu đề video</th><th class="text-right">Lượt xem</th><th class="text-right">Watch Time (giờ)</th><th class="text-right">Lượt thích</th><th class="text-right">CTR</th></tr>
      </thead>
      <tbody>
        <tr v-for="(v, i) in topVideos" :key="v.id">
          <td class="text-medium-emphasis text-body-2">{{ i + 1 }}</td>
          <td><router-link :to="`/videos/\${v.id}`" class="text-primary text-decoration-none text-body-2">{{ v.title }}</router-link></td>
          <td class="text-right text-body-2">{{ fmt(v.views) }}</td>
          <td class="text-right text-body-2">{{ fmt(v.watchTime) }}</td>
          <td class="text-right text-body-2">{{ fmt(v.likes) }}</td>
          <td class="text-right text-body-2 font-weight-medium text-success">{{ v.ctr }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>
