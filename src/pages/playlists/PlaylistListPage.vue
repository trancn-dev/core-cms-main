<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';
import type { PlaylistVisibility } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Playlist', disabled: true }];
const search = ref('');
const filterVisibility = ref<PlaylistVisibility | ''>('');
const visibilityOpts = statusFilterOptions('playlist', 'Tất cả quyền truy cập');

type Row = { id: number; title: string; owner: string; videos: number; visibility: PlaylistVisibility; createdAt: string };

const playlists = ref<Row[]>([
  { id: 1, title: 'Vue 3 Series', owner: 'Nguyễn Văn An', videos: 12, visibility: 'public', createdAt: '10/07/2026' },
  { id: 2, title: 'DevOps Roadmap', owner: 'Phạm Văn Hùng', videos: 8, visibility: 'public', createdAt: '20/07/2026' },
  { id: 3, title: 'Database Mastery', owner: 'Hoàng Thị Mai', videos: 6, visibility: 'private', createdAt: '01/08/2026' },
  { id: 4, title: 'Frontend Skills', owner: 'Lê Thị Hoa', videos: 15, visibility: 'unlisted', createdAt: '10/08/2026' },
  { id: 5, title: 'Bookmark Yêu thích', owner: 'Trần Minh Đức', videos: 24, visibility: 'private', createdAt: '15/08/2026' }
]);

const filtered = computed(() => {
  const q = search.value.toLowerCase();
  return playlists.value.filter(
    (p) =>
      (!q || p.title.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)) &&
      (!filterVisibility.value || p.visibility === filterVisibility.value)
  );
});

const deleteDialog = ref(false);
const pending = ref<Row | null>(null);

function openDelete(row: Row) {
  pending.value = row;
  deleteDialog.value = true;
}

function confirmDelete() {
  playlists.value = playlists.value.filter((p) => p.id !== pending.value?.id);
  deleteDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý playlist" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="6"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="playlist"
    empty-title="Không tìm thấy playlist nào"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm playlist, chủ sở hữu…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <v-select
        v-model="filterVisibility"
        :items="visibilityOpts"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 200px"
      />
    </template>

    <template #head>
      <tr>
        <th>Tên playlist</th>
        <th style="width: 180px">Chủ sở hữu</th>
        <th style="width: 96px" class="cms-num">Số video</th>
        <th style="width: 150px">Quyền truy cập</th>
        <th style="width: 120px">Ngày tạo</th>
        <th style="width: 140px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="p in filtered" :key="p.id">
        <td>
          <router-link :to="`/playlists/${p.id}`" class="cms-table__title">{{ p.title }}</router-link>
        </td>
        <td class="text-lightText">{{ p.owner }}</td>
        <td class="cms-num">{{ p.videos }}</td>
        <td><CmsStatusChip type="playlist" :value="p.visibility" /></td>
        <td class="text-lightText">{{ p.createdAt }}</td>
        <td class="cms-table__actions">
          <CmsRowActions :view-to="`/playlists/${p.id}`" :editable="false" @delete="openDelete(p)" />
        </td>
      </tr>
    </template>
  </CmsTableCard>

  <CmsConfirmDialog
    v-model="deleteDialog"
    :message="`Xoá playlist “${pending?.title}”? Video trong playlist không bị xoá. Hành động này không thể hoàn tác.`"
    @confirm="confirmDelete"
  />
</template>
