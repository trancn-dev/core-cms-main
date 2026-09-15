<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Bình luận', disabled: true }];
const search = ref('');
const filterStatus = ref('');
const selected = ref<number[]>([]);
const bulkDialog = ref(false);
const bulkAction = ref('');

const comments = ref([
  { id: 1, user: 'Nguyễn Văn A', content: 'Video rất hay, cảm ơn bạn!', video: 'Hướng dẫn Vue 3', videoId: 1, status: 'approved', time: '03/09/2026 09:00' },
  { id: 2, user: 'Trần Thị B', content: 'Bạn có thể làm thêm phần nâng cao không?', video: 'Học TypeScript', videoId: 2, status: 'approved', time: '03/09/2026 10:15' },
  { id: 3, user: 'Lê Văn C', content: 'Phần này mình không hiểu lắm...', video: 'Hướng dẫn Vue 3', videoId: 1, status: 'pending', time: '04/09/2026 08:30' },
  { id: 4, user: 'Phạm D', content: 'Spam link mua hàng giảm giá nhé!', video: 'Docker', videoId: 4, status: 'rejected', time: '04/09/2026 11:00' },
  { id: 5, user: 'Hoàng E', content: 'Nội dung rất bổ ích!', video: 'Vuetify 3', videoId: 3, status: 'pending', time: '05/09/2026 07:45' }
]);

const filtered = computed(() => comments.value.filter(c =>
  (!search.value || c.user.toLowerCase().includes(search.value.toLowerCase()) || c.content.includes(search.value)) &&
  (!filterStatus.value || c.status === filterStatus.value)
));

const statusColor: Record<string, string> = { approved: 'success', pending: 'warning', rejected: 'error', deleted: 'grey' };
const statusLabel: Record<string, string> = { approved: 'Đã duyệt', pending: 'Chờ duyệt', rejected: 'Từ chối', deleted: 'Đã xoá' };

function openBulk(action: string) {
  if (!selected.value.length) return;
  bulkAction.value = action; bulkDialog.value = true;
}
function confirmBulk() {
  const newStatus = bulkAction.value === 'approve' ? 'approved' : bulkAction.value === 'reject' ? 'rejected' : 'deleted';
  if (newStatus === 'deleted') {
    comments.value = comments.value.filter(c => !selected.value.includes(c.id));
  } else {
    comments.value.forEach(c => { if (selected.value.includes(c.id)) c.status = newStatus; });
  }
  selected.value = []; bulkDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý bình luận" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="4">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm bình luận..." variant="outlined" density="compact" hide-details single-line />
        </v-col>
        <v-col cols="6" sm="3">
          <v-select v-model="filterStatus" :items="[{title:'Tất cả',value:''},{title:'Chờ duyệt',value:'pending'},{title:'Đã duyệt',value:'approved'},{title:'Từ chối',value:'rejected'}]" item-title="title" item-value="value" label="Trạng thái" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col v-if="selected.length" class="d-flex gap-2 justify-end">
          <v-btn color="success" variant="tonal" size="small" @click="openBulk('approve')">Duyệt ({{ selected.length }})</v-btn>
          <v-btn color="warning" variant="tonal" size="small" @click="openBulk('reject')">Từ chối</v-btn>
          <v-btn color="error" variant="tonal" size="small" @click="openBulk('delete')">Xoá</v-btn>
        </v-col>
      </v-row>
      <v-table density="compact">
        <thead>
          <tr>
            <th style="width:40px">
              <v-checkbox density="compact" hide-details :model-value="selected.length === filtered.length && filtered.length > 0" :indeterminate="selected.length > 0 && selected.length < filtered.length" @update:model-value="v => selected = v ? filtered.map(x => x.id) : []" />
            </th>
            <th>Người dùng</th><th>Nội dung</th><th>Video</th><th>Trạng thái</th><th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td><v-checkbox v-model="selected" :value="c.id" density="compact" hide-details /></td>
            <td class="font-weight-medium text-body-2">{{ c.user }}</td>
            <td class="text-body-2" style="max-width:250px"><div class="text-truncate">{{ c.content }}</div></td>
            <td class="text-body-2"><router-link :to="`/videos/\${c.videoId}`" class="text-primary text-decoration-none">{{ c.video }}</router-link></td>
            <td><v-chip :color="statusColor[c.status]" size="x-small" variant="tonal">{{ statusLabel[c.status] }}</v-chip></td>
            <td class="text-caption text-medium-emphasis">{{ c.time }}</td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="6" class="text-center text-medium-emphasis py-8">Không có bình luận nào</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="bulkDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">Xác nhận</v-card-title>
      <v-card-text>Thực hiện hành động "{{ bulkAction }}" với {{ selected.length }} bình luận đã chọn?</v-card-text>
      <v-card-actions class="pa-4 pt-0"><v-spacer />
        <v-btn variant="text" @click="bulkDialog = false">Huỷ</v-btn>
        <v-btn color="primary" variant="tonal" @click="confirmBulk">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
