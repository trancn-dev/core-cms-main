<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';
import { videoService } from '@/apis/media';
import type { Video, VideoStatus } from '@/types/media';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Video', disabled: true }];

const loading = ref(false);
const videos = ref<Video[]>([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = 10;

const search = ref('');
const filterStatus = ref<VideoStatus | ''>('');

const statusOpts = [
  { title: 'Tất cả trạng thái', value: '' },
  { title: 'Đã xuất bản', value: 'published' },
  { title: 'Bản nháp', value: 'draft' },
  { title: 'Đang xử lý', value: 'processing' },
  { title: 'Bị khoá', value: 'blocked' }
];

const statusColor: Record<string, string> = { published: 'success', draft: 'grey', processing: 'warning', blocked: 'error' };
const statusLabel: Record<string, string> = { published: 'Đã xuất bản', draft: 'Bản nháp', processing: 'Đang xử lý', blocked: 'Bị khoá' };

const selected = ref<number[]>([]);
const deleteDialog = ref(false);

async function fetchVideos() {
  loading.value = true;
  const res = await videoService.getList({ search: search.value, status: filterStatus.value || undefined, page: page.value, limit: itemsPerPage });
  videos.value = res.items;
  total.value = res.total;
  loading.value = false;
}

onMounted(fetchVideos);

let searchTimer: ReturnType<typeof setTimeout>;
watch([search, filterStatus], () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { page.value = 1; fetchVideos(); }, 300);
});
watch(page, fetchVideos);

const totalPages = computed(() => Math.ceil(total.value / itemsPerPage));

function fmt(n: number) { return n.toLocaleString('vi-VN'); }
function fmtDuration(sec?: number) {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` : `${m}:${String(s).padStart(2,'0')}`;
}

async function confirmDelete() {
  for (const id of selected.value) await videoService.delete(id);
  selected.value = [];
  deleteDialog.value = false;
  fetchVideos();
}
</script>

<template>
  <BaseBreadcrumb title="Danh sách video" :breadcrumbs="breadcrumbs" />

  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <!-- Toolbar -->
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="5">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm kiếm video, kênh..." variant="outlined" density="compact" hide-details single-line clearable />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select v-model="filterStatus" :items="statusOpts" item-title="title" item-value="value" variant="outlined" density="compact" hide-details />
        </v-col>
        <v-col class="d-flex justify-end gap-2">
          <v-btn v-if="selected.length" color="error" variant="tonal" size="small" prepend-icon="mdi-delete" @click="deleteDialog = true">
            Xoá ({{ selected.length }})
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-plus" size="small" to="/videos/create">Thêm video</v-btn>
        </v-col>
      </v-row>

      <!-- Loading skeleton -->
      <template v-if="loading">
        <v-skeleton-loader v-for="i in 5" :key="i" type="table-row" />
      </template>

      <!-- Table -->
      <v-table v-else density="compact">
        <thead>
          <tr>
            <th style="width:40px">
              <v-checkbox density="compact" hide-details
                :model-value="selected.length === videos.length && videos.length > 0"
                :indeterminate="selected.length > 0 && selected.length < videos.length"
                @update:model-value="v => selected = v ? videos.map(x => x.id) : []" />
            </th>
            <th>Tiêu đề</th>
            <th>Kênh</th>
            <th>Danh mục</th>
            <th class="text-right">Lượt xem</th>
            <th>Thời lượng</th>
            <th>Trạng thái</th>
            <th style="width:80px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in videos" :key="v.id">
            <td><v-checkbox v-model="selected" :value="v.id" density="compact" hide-details /></td>
            <td>
              <div class="d-flex align-center gap-2">
                <v-img v-if="v.thumbnailUrl" :src="v.thumbnailUrl" width="56" height="32" rounded="sm" cover />
                <router-link :to="'/videos/' + v.id" class="text-primary text-decoration-none text-body-2 font-weight-medium">{{ v.title }}</router-link>
              </div>
            </td>
            <td class="text-body-2 text-medium-emphasis">
              {{ v.channel?.name }}
              <v-icon v-if="v.channel?.verified" size="12" color="info">mdi-check-decagram</v-icon>
            </td>
            <td class="text-body-2">{{ v.category?.name ?? '—' }}</td>
            <td class="text-right text-body-2 font-weight-medium">{{ fmt(v.viewsCount) }}</td>
            <td class="text-body-2">{{ fmtDuration(v.duration) }}</td>
            <td><v-chip :color="statusColor[v.status]" size="x-small" variant="tonal">{{ statusLabel[v.status] }}</v-chip></td>
            <td>
              <v-btn icon size="x-small" variant="text" :to="'/videos/' + v.id"><v-icon>mdi-eye</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" :to="'/videos/' + v.id + '/edit'"><v-icon>mdi-pencil</v-icon></v-btn>
            </td>
          </tr>
          <tr v-if="!videos.length && !loading">
            <td colspan="8">
              <div class="text-center text-medium-emphasis py-12">
                <v-icon size="48" class="mb-2 text-grey-lighten-2">mdi-video-off</v-icon>
                <div class="text-body-2">Không tìm thấy video nào</div>
                <v-btn class="mt-3" size="small" color="primary" to="/videos/create" prepend-icon="mdi-plus">Thêm video đầu tiên</v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Pagination -->
      <div v-if="total > itemsPerPage" class="d-flex align-center justify-space-between mt-4">
        <span class="text-body-2 text-medium-emphasis">Hiển thị {{ (page-1)*itemsPerPage+1 }}–{{ Math.min(page*itemsPerPage, total) }} / {{ fmt(total) }} video</span>
        <v-pagination v-model="page" :length="totalPages" density="compact" :total-visible="5" />
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="deleteDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">Xác nhận xoá</v-card-title>
      <v-card-text>Bạn chắc chắn muốn xoá {{ selected.length }} video đã chọn? Hành động này không thể hoàn tác.</v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="deleteDialog = false">Huỷ</v-btn>
        <v-btn color="error" variant="tonal" :loading="loading" @click="confirmDelete">Xoá</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
