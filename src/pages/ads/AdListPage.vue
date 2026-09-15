<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Quảng cáo', disabled: true }];
const search = ref('');
const filterStatus = ref('');

const ads = ref([
  { id: 1, title: 'Khoá học Vue 3 Pro', type: 'pre_roll', impressions: 84200, clicks: 2840, status: 'active', startDate: '01/09/2026', endDate: '30/09/2026' },
  { id: 2, title: 'DevOps Bootcamp', type: 'banner', impressions: 41500, clicks: 980, status: 'active', startDate: '15/08/2026', endDate: '15/09/2026' },
  { id: 3, title: 'Hosting cloud giá rẻ', type: 'overlay', impressions: 28000, clicks: 450, status: 'paused', startDate: '05/09/2026', endDate: '05/10/2026' },
  { id: 4, title: 'React Native Course', type: 'mid_roll', impressions: 18200, clicks: 620, status: 'expired', startDate: '01/07/2026', endDate: '31/08/2026' }
]);

const filtered = computed(() => ads.value.filter(a =>
  (!search.value || a.title.toLowerCase().includes(search.value.toLowerCase())) &&
  (!filterStatus.value || a.status === filterStatus.value)
));

const typeLabel: Record<string, string> = { pre_roll: 'Pre-roll', mid_roll: 'Mid-roll', banner: 'Banner', overlay: 'Overlay' };
const typeColor: Record<string, string> = { pre_roll: 'primary', mid_roll: 'info', banner: 'warning', overlay: 'secondary' };
const statusColor: Record<string, string> = { active: 'success', paused: 'warning', expired: 'grey' };
const statusLabel: Record<string, string> = { active: 'Đang chạy', paused: 'Tạm dừng', expired: 'Hết hạn' };

function ctr(impressions: number, clicks: number) {
  return impressions ? ((clicks / impressions) * 100).toFixed(2) + '%' : '0%';
}
function fmt(n: number) { return n.toLocaleString('vi-VN'); }
</script>

<template>
  <BaseBreadcrumb title="Quản lý quảng cáo" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="4">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm quảng cáo..." variant="outlined" density="compact" hide-details single-line />
        </v-col>
        <v-col cols="6" sm="3">
          <v-select v-model="filterStatus" :items="[{title:'Tất cả',value:''},{title:'Đang chạy',value:'active'},{title:'Tạm dừng',value:'paused'},{title:'Hết hạn',value:'expired'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" prepend-icon="mdi-plus" size="small" to="/ads/create">Thêm quảng cáo</v-btn>
        </v-col>
      </v-row>
      <v-table density="compact">
        <thead>
          <tr><th>Tên chiến dịch</th><th>Loại</th><th class="text-right">Impressions</th><th class="text-right">Clicks</th><th class="text-right">CTR</th><th>Thời gian</th><th>Trạng thái</th><th style="width:60px"></th></tr>
        </thead>
        <tbody>
          <tr v-for="ad in filtered" :key="ad.id">
            <td class="font-weight-medium text-body-2">{{ ad.title }}</td>
            <td><v-chip :color="typeColor[ad.type]" size="x-small" variant="tonal">{{ typeLabel[ad.type] }}</v-chip></td>
            <td class="text-right text-body-2">{{ fmt(ad.impressions) }}</td>
            <td class="text-right text-body-2">{{ fmt(ad.clicks) }}</td>
            <td class="text-right text-body-2 font-weight-medium">{{ ctr(ad.impressions, ad.clicks) }}</td>
            <td class="text-caption text-medium-emphasis">{{ ad.startDate }} → {{ ad.endDate }}</td>
            <td><v-chip :color="statusColor[ad.status]" size="x-small" variant="tonal">{{ statusLabel[ad.status] }}</v-chip></td>
            <td><v-btn icon size="x-small" variant="text" :to="`/ads/\${ad.id}/edit`"><v-icon>mdi-pencil</v-icon></v-btn></td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="8" class="text-center text-medium-emphasis py-8">Không có quảng cáo nào</td></tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
