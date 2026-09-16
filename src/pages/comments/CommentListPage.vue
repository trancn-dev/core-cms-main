<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { CommentStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Bình luận', disabled: true }];
const search = ref('');
const filterStatus = ref<CommentStatus | ''>('');
const statusOpts = statusFilterOptions('comment', 'Tất cả trạng thái');
const selected = ref<number[]>([]);

type Row = { id: number; user: string; content: string; video: string; videoId: number; status: CommentStatus; time: string };

const comments = ref<Row[]>([
  { id: 1, user: 'Nguyễn Văn A', content: 'Video rất hay, cảm ơn bạn!', video: 'Hướng dẫn Vue 3', videoId: 1, status: 'approved', time: '03/09/2026 09:00' },
  { id: 2, user: 'Trần Thị B', content: 'Bạn có thể làm thêm phần nâng cao không?', video: 'Học TypeScript', videoId: 2, status: 'approved', time: '03/09/2026 10:15' },
  { id: 3, user: 'Lê Văn C', content: 'Phần này mình không hiểu lắm...', video: 'Hướng dẫn Vue 3', videoId: 1, status: 'pending', time: '04/09/2026 08:30' },
  { id: 4, user: 'Phạm D', content: 'Spam link mua hàng giảm giá nhé!', video: 'Docker', videoId: 4, status: 'rejected', time: '04/09/2026 11:00' },
  { id: 5, user: 'Hoàng E', content: 'Nội dung rất bổ ích!', video: 'Vuetify 3', videoId: 3, status: 'pending', time: '05/09/2026 07:45' }
]);

const filtered = computed(() =>
  comments.value.filter(
    (c) =>
      (!search.value ||
        c.user.toLowerCase().includes(search.value.toLowerCase()) ||
        c.content.toLowerCase().includes(search.value.toLowerCase())) &&
      (!filterStatus.value || c.status === filterStatus.value)
  )
);

const allChecked = computed(() => filtered.value.length > 0 && selected.value.length === filtered.value.length);
const someChecked = computed(() => selected.value.length > 0 && !allChecked.value);

function toggleAll(checked: boolean | null) {
  selected.value = checked ? filtered.value.map((c) => c.id) : [];
}

type BulkAction = 'approve' | 'reject' | 'delete';

const BULK: Record<BulkAction, { title: string; verb: string; color: 'success' | 'warning' | 'error'; icon: string }> = {
  approve: { title: 'Duyệt bình luận', verb: 'Duyệt', color: 'success', icon: 'mdi-check' },
  reject: { title: 'Từ chối bình luận', verb: 'Từ chối', color: 'warning', icon: 'mdi-cancel' },
  delete: { title: 'Xác nhận xoá', verb: 'Xoá', color: 'error', icon: 'mdi-delete' }
};

const bulkDialog = ref(false);
const bulkAction = ref<BulkAction>('approve');
const bulk = computed(() => BULK[bulkAction.value]);

function openBulk(action: BulkAction) {
  if (!selected.value.length) return;
  bulkAction.value = action;
  bulkDialog.value = true;
}

function confirmBulk() {
  if (bulkAction.value === 'delete') {
    comments.value = comments.value.filter((c) => !selected.value.includes(c.id));
  } else {
    const status: CommentStatus = bulkAction.value === 'approve' ? 'approved' : 'rejected';
    comments.value.forEach((c) => {
      if (selected.value.includes(c.id)) c.status = status;
    });
  }
  selected.value = [];
  bulkDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý bình luận" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="6"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="bình luận"
    empty-title="Không có bình luận nào"
    empty-description="Thử xoá bộ lọc để xem tất cả bình luận."
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm người dùng, nội dung…"
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
      <template v-if="selected.length">
        <v-btn color="success" variant="tonal" size="small" prepend-icon="mdi-check" @click="openBulk('approve')">
          Duyệt ({{ selected.length }})
        </v-btn>
        <v-btn color="warning" variant="tonal" size="small" prepend-icon="mdi-cancel" @click="openBulk('reject')">
          Từ chối
        </v-btn>
        <v-btn color="error" variant="tonal" size="small" prepend-icon="mdi-delete" @click="openBulk('delete')">
          Xoá
        </v-btn>
      </template>
    </template>

    <template #head>
      <tr>
        <th style="width: 44px">
          <v-checkbox
            density="compact"
            hide-details
            :model-value="allChecked"
            :indeterminate="someChecked"
            aria-label="Chọn tất cả bình luận"
            @update:model-value="toggleAll"
          />
        </th>
        <th style="width: 160px">Người dùng</th>
        <th>Nội dung</th>
        <th style="width: 180px">Video</th>
        <th style="width: 120px">Trạng thái</th>
        <th style="width: 140px">Thời gian</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="c in filtered" :key="c.id" :class="{ 'is-selected': selected.includes(c.id) }">
        <td>
          <v-checkbox v-model="selected" :value="c.id" density="compact" hide-details aria-label="Chọn bình luận" @click.stop />
        </td>
        <td class="font-weight-medium">{{ c.user }}</td>
        <td style="max-width: 0"><div class="text-truncate">{{ c.content }}</div></td>
        <td>
          <router-link :to="`/videos/${c.videoId}`" class="cms-table__title">{{ c.video }}</router-link>
        </td>
        <td><CmsStatusChip type="comment" :value="c.status" /></td>
        <td class="text-lightText">{{ c.time }}</td>
      </tr>
    </template>
  </CmsTableCard>

  <CmsConfirmDialog
    v-model="bulkDialog"
    :title="bulk.title"
    :confirm-label="bulk.verb"
    :color="bulk.color"
    :icon="bulk.icon"
    :message="`${bulk.verb} ${selected.length} bình luận đã chọn?${bulkAction === 'delete' ? ' Hành động này không thể hoàn tác.' : ''}`"
    @confirm="confirmBulk"
  />
</template>
