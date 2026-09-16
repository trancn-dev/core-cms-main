<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsEmptyState from '@/components/cms/CmsEmptyState.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import { videoService } from '@/apis/media';
import type { Video, VideoStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Video', disabled: true }];

const loading = ref(false);
const error = ref<string | null>(null);
const videos = ref<Video[]>([]);
const total = ref(0);
const page = ref(1);
const itemsPerPage = 10;

const search = ref('');
const filterStatus = ref<VideoStatus | ''>('');

const statusOpts = statusFilterOptions('video', 'Tất cả trạng thái');

const selected = ref<number[]>([]);
const deleteDialog = ref(false);
const deleting = ref(false);

async function fetchVideos() {
  loading.value = true;
  error.value = null;
  try {
    const res = await videoService.getList({
      search: search.value,
      status: filterStatus.value || undefined,
      page: page.value,
      limit: itemsPerPage
    });
    videos.value = res.items;
    total.value = res.total;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Máy chủ không phản hồi. Dữ liệu đã lưu vẫn an toàn.';
    videos.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchVideos);

let searchTimer: ReturnType<typeof setTimeout>;
watch([search, filterStatus], () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    fetchVideos();
  }, 300);
});
watch(page, fetchVideos);

const allChecked = computed(() => videos.value.length > 0 && selected.value.length === videos.value.length);
const someChecked = computed(() => selected.value.length > 0 && !allChecked.value);
const hasFilter = computed(() => Boolean(search.value || filterStatus.value));

function toggleAll(checked: boolean | null) {
  selected.value = checked ? videos.value.map((v) => v.id) : [];
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN');
}

function fmtDuration(sec?: number) {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function fmtDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('vi-VN');
}

const pendingDelete = ref<Video | null>(null);

const deleteMessage = computed(() =>
  pendingDelete.value
    ? `Bạn chắc chắn muốn xoá “${pendingDelete.value.title}”? Hành động này không thể hoàn tác.`
    : `Bạn chắc chắn muốn xoá ${selected.value.length} video đã chọn? Hành động này không thể hoàn tác.`
);

function askDeleteOne(video: Video) {
  pendingDelete.value = video;
  deleteDialog.value = true;
}

function askDeleteSelected() {
  pendingDelete.value = null;
  deleteDialog.value = true;
}

async function confirmDelete() {
  deleting.value = true;
  try {
    const ids = pendingDelete.value ? [pendingDelete.value.id] : selected.value;
    for (const id of ids) await videoService.delete(id);
    selected.value = [];
    pendingDelete.value = null;
    deleteDialog.value = false;
    fetchVideos();
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <BaseBreadcrumb title="Danh sách video" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="8"
    :loading="loading"
    :error="error"
    :count="videos.length"
    :total="total"
    :page="page"
    :items-per-page="itemsPerPage"
    unit="video"
    :thumb-column="1"
    :chip-column="6"
    @update:page="page = $event"
    @retry="fetchVideos"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm video, kênh…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <v-select
        v-model="filterStatus"
        :items="statusOpts"
        item-title="title"
        item-value="value"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 180px"
      />

      <div class="cms-toolbar__spacer"></div>

      <v-btn
        v-if="selected.length"
        color="error"
        variant="tonal"
        size="small"
        prepend-icon="mdi-delete"
        @click="askDeleteSelected"
      >
        Xoá ({{ selected.length }})
      </v-btn>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/videos/create">Thêm video</v-btn>
    </template>

    <template #head>
      <tr>
        <th style="width: 44px">
          <v-checkbox
            density="compact"
            hide-details
            :model-value="allChecked"
            :indeterminate="someChecked"
            aria-label="Chọn tất cả video"
            @update:model-value="toggleAll"
          />
        </th>
        <th>Tiêu đề</th>
        <th style="width: 150px">Kênh</th>
        <th style="width: 120px">Danh mục</th>
        <th style="width: 96px" class="cms-num">Lượt xem</th>
        <th style="width: 96px" class="cms-num">Thời lượng</th>
        <th style="width: 120px">Trạng thái</th>
        <th style="width: 140px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="v in videos" :key="v.id" :class="{ 'is-selected': selected.includes(v.id) }">
        <td>
          <v-checkbox
            v-model="selected"
            :value="v.id"
            density="compact"
            hide-details
            :aria-label="`Chọn ${v.title}`"
            @click.stop
          />
        </td>
        <td>
          <div class="d-flex align-center ga-3" style="min-width: 0">
            <div class="cms-table__thumb">
              <v-img v-if="v.thumbnailUrl" :src="v.thumbnailUrl" width="56" height="32" cover />
              <v-icon v-else size="16" color="lightText">mdi-image-outline</v-icon>
            </div>
            <div style="min-width: 0">
              <router-link :to="`/videos/${v.id}`" class="cms-table__title">{{ v.title }}</router-link>
              <div class="cms-table__sub">{{ fmtDate(v.createdAt) }}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="d-flex align-center ga-1" style="min-width: 0">
            <span class="text-truncate">{{ v.channel?.name }}</span>
            <v-tooltip v-if="v.channel?.verified" text="Kênh đã xác thực">
              <template #activator="{ props: tip }">
                <v-icon v-bind="tip" size="14" color="info">mdi-check-decagram</v-icon>
              </template>
            </v-tooltip>
          </div>
        </td>
        <td class="text-lightText">{{ v.category?.name ?? '—' }}</td>
        <td class="cms-num">{{ fmt(v.viewsCount) }}</td>
        <td class="cms-num text-lightText">{{ fmtDuration(v.duration) }}</td>
        <td><CmsStatusChip type="video" :value="v.status" /></td>
        <td class="cms-table__actions">
          <CmsRowActions
            :view-to="`/videos/${v.id}`"
            :edit-to="`/videos/${v.id}/edit`"
            @delete="askDeleteOne(v)"
          />
        </td>
      </tr>
    </template>

    <template #empty>
      <CmsEmptyState
        title="Không tìm thấy video nào"
        :description="
          hasFilter
            ? 'Thử xoá bộ lọc, hoặc thêm video đầu tiên vào thư viện.'
            : 'Thêm video đầu tiên vào thư viện để bắt đầu.'
        "
      >
        <template #actions>
          <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/videos/create">
            Thêm video đầu tiên
          </v-btn>
        </template>
      </CmsEmptyState>
    </template>
  </CmsTableCard>

  <CmsConfirmDialog
    v-model="deleteDialog"
    :message="deleteMessage"
    :loading="deleting"
    @confirm="confirmDelete"
  />
</template>
