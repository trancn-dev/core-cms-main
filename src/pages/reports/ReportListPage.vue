<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { ReportReason, ReportStatus, ReportType } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Báo cáo vi phạm', disabled: true }];
const filterStatus = ref<ReportStatus | ''>('');
const filterType = ref<ReportType | ''>('');
const statusOpts = statusFilterOptions('report', 'Tất cả trạng thái');
const typeOpts = statusFilterOptions('reportType', 'Tất cả loại');

type Row = { id: number; type: ReportType; content: string; contentId: number; reporter: string; reason: ReportReason; status: ReportStatus; createdAt: string };

const reports = ref<Row[]>([
  { id: 1, type: 'video', content: 'Hướng dẫn Vue 3', contentId: 1, reporter: 'Nguyễn Văn A', reason: 'spam', status: 'pending', createdAt: '04/09/2026' },
  { id: 2, type: 'comment', content: 'Spam link mua hàng giảm giá', contentId: 4, reporter: 'Lê Thị B', reason: 'spam', status: 'pending', createdAt: '04/09/2026' },
  { id: 3, type: 'video', content: 'PostgreSQL tối ưu query', contentId: 5, reporter: 'Trần C', reason: 'copyright', status: 'reviewed', createdAt: '03/09/2026' },
  { id: 4, type: 'video', content: 'Docker nâng cao', contentId: 4, reporter: 'Phạm D', reason: 'violence', status: 'resolved', createdAt: '02/09/2026' },
  { id: 5, type: 'comment', content: 'Bình luận phản cảm', contentId: 2, reporter: 'Hoàng E', reason: 'sexual', status: 'dismissed', createdAt: '01/09/2026' }
]);

const filtered = computed(() =>
  reports.value.filter(
    (r) => (!filterStatus.value || r.status === filterStatus.value) && (!filterType.value || r.type === filterType.value)
  )
);
</script>

<template>
  <BaseBreadcrumb title="Quản lý báo cáo vi phạm" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="7"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="báo cáo"
    empty-title="Không có báo cáo nào"
    empty-description="Không có báo cáo khớp với bộ lọc hiện tại."
  >
    <template #toolbar>
      <v-select
        v-model="filterStatus"
        :items="statusOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
      <v-select
        v-model="filterType"
        :items="typeOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />
    </template>

    <template #head>
      <tr>
        <th style="width: 110px">Loại</th>
        <th>Nội dung bị báo cáo</th>
        <th style="width: 160px">Người báo cáo</th>
        <th style="width: 160px">Lý do</th>
        <th style="width: 120px">Trạng thái</th>
        <th style="width: 110px">Ngày</th>
        <th style="width: 80px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="r in filtered" :key="r.id">
        <td><CmsStatusChip type="reportType" :value="r.type" /></td>
        <td style="max-width: 0">
          <router-link :to="`/reports/${r.id}`" class="cms-table__title">{{ r.content }}</router-link>
        </td>
        <td class="text-lightText">{{ r.reporter }}</td>
        <td><CmsStatusChip type="reportReason" :value="r.reason" /></td>
        <td><CmsStatusChip type="report" :value="r.status" /></td>
        <td class="text-lightText">{{ r.createdAt }}</td>
        <td class="cms-table__actions" style="width: 80px">
          <CmsRowActions :view-to="`/reports/${r.id}`" :editable="false" :deletable="false" />
        </td>
      </tr>
    </template>
  </CmsTableCard>
</template>
