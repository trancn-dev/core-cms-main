<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Báo cáo vi phạm', disabled: true }];
const filterStatus = ref('');
const filterType = ref('');

const reports = ref([
  { id: 1, type: 'video', content: 'Hướng dẫn Vue 3', contentId: 1, reporter: 'Nguyễn Văn A', reason: 'spam', status: 'pending', createdAt: '04/09/2026' },
  { id: 2, type: 'comment', content: 'Spam link mua hàng giảm giá', contentId: 4, reporter: 'Lê Thị B', reason: 'spam', status: 'pending', createdAt: '04/09/2026' },
  { id: 3, type: 'video', content: 'PostgreSQL tối ưu query', contentId: 5, reporter: 'Trần C', reason: 'copyright', status: 'reviewed', createdAt: '03/09/2026' },
  { id: 4, type: 'video', content: 'Docker nâng cao', contentId: 4, reporter: 'Phạm D', reason: 'violence', status: 'resolved', createdAt: '02/09/2026' },
  { id: 5, type: 'comment', content: 'Bình luận phản cảm', contentId: 2, reporter: 'Hoàng E', reason: 'sexual', status: 'dismissed', createdAt: '01/09/2026' }
]);

const filtered = computed(() => reports.value.filter(r =>
  (!filterStatus.value || r.status === filterStatus.value) &&
  (!filterType.value || r.type === filterType.value)
));

const statusColor: Record<string, string> = { pending: 'warning', reviewed: 'info', resolved: 'success', dismissed: 'grey' };
const statusLabel: Record<string, string> = { pending: 'Chờ xử lý', reviewed: 'Đang xem', resolved: 'Đã xử lý', dismissed: 'Bỏ qua' };
const reasonLabel: Record<string, string> = { spam: 'Spam', violence: 'Bạo lực', copyright: 'Bản quyền', sexual: 'Nhạy cảm', other: 'Khác' };
const reasonColor: Record<string, string> = { spam: 'warning', violence: 'error', copyright: 'info', sexual: 'purple', other: 'grey' };
</script>

<template>
  <BaseBreadcrumb title="Quản lý báo cáo vi phạm" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row class="mb-4">
        <v-col cols="6" sm="3">
          <v-select v-model="filterStatus" :items="[{title:'Tất cả',value:''},{title:'Chờ xử lý',value:'pending'},{title:'Đang xem',value:'reviewed'},{title:'Đã xử lý',value:'resolved'},{title:'Bỏ qua',value:'dismissed'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col cols="6" sm="3">
          <v-select v-model="filterType" :items="[{title:'Tất cả',value:''},{title:'Video',value:'video'},{title:'Bình luận',value:'comment'}]" item-title="title" item-value="value" label="Loại" variant="outlined" density="compact" hide-details />
        </v-col>
      </v-row>
      <v-table density="compact">
        <thead>
          <tr><th>Loại</th><th>Nội dung bị báo cáo</th><th>Người báo cáo</th><th>Lý do</th><th>Trạng thái</th><th>Ngày</th><th style="width:60px"></th></tr>
        </thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id">
            <td><v-chip :color="r.type === 'video' ? 'primary' : 'secondary'" size="x-small" variant="tonal">{{ r.type === 'video' ? 'Video' : 'Comment' }}</v-chip></td>
            <td class="text-body-2" style="max-width:200px"><div class="text-truncate">{{ r.content }}</div></td>
            <td class="text-body-2 text-medium-emphasis">{{ r.reporter }}</td>
            <td><v-chip :color="reasonColor[r.reason]" size="x-small" variant="tonal">{{ reasonLabel[r.reason] }}</v-chip></td>
            <td><v-chip :color="statusColor[r.status]" size="x-small" variant="tonal">{{ statusLabel[r.status] }}</v-chip></td>
            <td class="text-caption text-medium-emphasis">{{ r.createdAt }}</td>
            <td><v-btn icon size="x-small" variant="text" :to="`/reports/\${r.id}`"><v-icon>mdi-eye</v-icon></v-btn></td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7" class="text-center text-medium-emphasis py-8">Không có báo cáo nào</td></tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>
