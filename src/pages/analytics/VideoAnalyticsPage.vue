<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsStatCard from '@/components/cms/CmsStatCard.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsLineChart from '@/components/cms/CmsLineChart.vue';
import type { BreadcrumbType } from '@/types/common';
import type { StatusTone } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Thống kê', disabled: true }];

const ranges = [
  { value: 7, label: '7 ngày' },
  { value: 30, label: '30 ngày' },
  { value: 90, label: '90 ngày' }
];
const range = ref(7);

const summaryStats: { icon: string; label: string; value: string; tone: StatusTone }[] = [
  { label: 'Tổng lượt xem', value: '284.320', icon: 'mdi-eye', tone: 'primary' },
  { label: 'Thời gian xem (giờ)', value: '48.240', icon: 'mdi-clock-outline', tone: 'success' },
  { label: 'Lượt thích', value: '12.840', icon: 'mdi-thumb-up-outline', tone: 'warning' },
  { label: 'Người đăng ký mới', value: '1.240', icon: 'mdi-account-plus-outline', tone: 'info' }
];

const topVideos = [
  { id: 1, title: 'Hướng dẫn Vue 3 từ A đến Z', views: 128400, watchTime: 18240, likes: 4820, ctr: 8.4 },
  { id: 2, title: 'Học TypeScript trong 1 giờ', views: 97200, watchTime: 12800, likes: 3640, ctr: 7.2 },
  { id: 3, title: 'Vuetify 3 — UI Components', views: 84500, watchTime: 10200, likes: 2980, ctr: 6.8 },
  { id: 4, title: 'Docker cho người mới bắt đầu', views: 72100, watchTime: 9600, likes: 2540, ctr: 5.9 },
  { id: 5, title: 'PostgreSQL — Tối ưu Query', views: 61800, watchTime: 8400, likes: 2120, ctr: 5.1 }
];

// Mock series until the analytics endpoint exists
const labels = computed(() =>
  Array.from({ length: range.value }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (range.value - 1 - i));
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  })
);
const views = computed(() => Array.from({ length: range.value }, (_, i) => Math.round(38000 + i * 900 + Math.sin(i * 1.1) * 5200)));

const fmt = (n: number) => n.toLocaleString('vi-VN');
</script>

<template>
  <BaseBreadcrumb title="Thống kê" :breadcrumbs="breadcrumbs">
    <template #actions>
      <v-btn-toggle v-model="range" mandatory class="cms-segmented" style="width: auto" variant="text">
        <v-btn v-for="r in ranges" :key="r.value" :value="r.value" style="min-width: 76px">{{ r.label }}</v-btn>
      </v-btn-toggle>
    </template>
  </BaseBreadcrumb>

  <v-row>
    <v-col v-for="s in summaryStats" :key="s.label" cols="12" sm="6" lg="3">
      <CmsStatCard v-bind="s" />
    </v-col>
  </v-row>

  <v-card variant="outlined" rounded="lg" elevation="0" class="my-5">
    <v-card-text>
      <div class="text-h5">Lượt xem theo ngày</div>
      <div class="text-caption text-lightText">{{ range }} ngày gần nhất</div>
      <CmsLineChart :labels="labels" :current="views" current-label="Lượt xem" />
    </v-card-text>
  </v-card>

  <div class="text-h5 mb-2">Video hiệu suất cao</div>
  <CmsTableCard :columns="6" :count="topVideos.length">
    <template #head>
      <tr>
        <th style="width: 44px">#</th>
        <th>Tiêu đề video</th>
        <th style="width: 110px" class="cms-num">Lượt xem</th>
        <th style="width: 140px" class="cms-num">Thời gian xem (giờ)</th>
        <th style="width: 110px" class="cms-num">Lượt thích</th>
        <th style="width: 80px" class="cms-num">CTR</th>
      </tr>
    </template>
    <template #body>
      <tr v-for="(v, i) in topVideos" :key="v.id">
        <td class="text-lightText font-weight-medium">{{ i + 1 }}</td>
        <td><router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link></td>
        <td class="cms-num">{{ fmt(v.views) }}</td>
        <td class="cms-num">{{ fmt(v.watchTime) }}</td>
        <td class="cms-num">{{ fmt(v.likes) }}</td>
        <td class="cms-num font-weight-medium">{{ v.ctr.toLocaleString('vi-VN') }}%</td>
      </tr>
    </template>
  </CmsTableCard>
</template>
