<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { AdStatus, AdType } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Quảng cáo', disabled: true }];
const search = ref('');
const filterStatus = ref<AdStatus | ''>('');
const statusOpts = statusFilterOptions('adStatus', 'Tất cả trạng thái');

type Row = { id: number; title: string; type: AdType; impressions: number; clicks: number; status: AdStatus; startDate: string; endDate: string };

const ads = ref<Row[]>([
  { id: 1, title: 'Khoá học Vue 3 Pro', type: 'pre_roll', impressions: 84200, clicks: 2840, status: 'active', startDate: '01/09/2026', endDate: '30/09/2026' },
  { id: 2, title: 'DevOps Bootcamp', type: 'banner', impressions: 41500, clicks: 980, status: 'active', startDate: '15/08/2026', endDate: '15/09/2026' },
  { id: 3, title: 'Hosting cloud giá rẻ', type: 'overlay', impressions: 28000, clicks: 450, status: 'paused', startDate: '05/09/2026', endDate: '05/10/2026' },
  { id: 4, title: 'React Native Course', type: 'mid_roll', impressions: 18200, clicks: 620, status: 'expired', startDate: '01/07/2026', endDate: '31/08/2026' }
]);

const filtered = computed(() =>
  ads.value.filter(
    (a) =>
      (!search.value || a.title.toLowerCase().includes(search.value.toLowerCase())) &&
      (!filterStatus.value || a.status === filterStatus.value)
  )
);

function ctr(impressions: number, clicks: number) {
  return impressions ? ((clicks / impressions) * 100).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + '%' : '0%';
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN');
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý quảng cáo" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="8"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="chiến dịch"
    empty-title="Không có quảng cáo nào"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm chiến dịch…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <v-select
        v-model="filterStatus"
        :items="statusOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
      <div class="cms-toolbar__spacer"></div>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/ads/create">Thêm quảng cáo</v-btn>
    </template>

    <template #head>
      <tr>
        <th>Tên chiến dịch</th>
        <th style="width: 120px">Loại</th>
        <th style="width: 110px" class="cms-num">Lượt hiển thị</th>
        <th style="width: 96px" class="cms-num">Lượt nhấp</th>
        <th style="width: 80px" class="cms-num">CTR</th>
        <th style="width: 190px">Thời gian</th>
        <th style="width: 120px">Trạng thái</th>
        <th style="width: 100px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="ad in filtered" :key="ad.id">
        <td>
          <router-link :to="`/ads/${ad.id}/edit`" class="cms-table__title">{{ ad.title }}</router-link>
        </td>
        <td><CmsStatusChip type="adType" :value="ad.type" /></td>
        <td class="cms-num">{{ fmt(ad.impressions) }}</td>
        <td class="cms-num">{{ fmt(ad.clicks) }}</td>
        <td class="cms-num font-weight-medium">{{ ctr(ad.impressions, ad.clicks) }}</td>
        <td class="text-lightText">{{ ad.startDate }} → {{ ad.endDate }}</td>
        <td><CmsStatusChip type="adStatus" :value="ad.status" /></td>
        <td class="cms-table__actions" style="width: 100px">
          <CmsRowActions :viewable="false" :deletable="false" :edit-to="`/ads/${ad.id}/edit`" />
        </td>
      </tr>
    </template>
  </CmsTableCard>
</template>
