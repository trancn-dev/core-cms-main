<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsStatusChip from '@/components/cms/CmsStatusChip.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Danh mục', disabled: true }];
const search = ref('');

type Row = { id: number; name: string; slug: string; parent: string | null; videos: number; status: 'active' | 'inactive' };

const categories = ref<Row[]>([
  { id: 1, name: 'Lập trình', slug: 'lap-trinh', parent: null, videos: 412, status: 'active' },
  { id: 2, name: 'Thiết kế', slug: 'thiet-ke', parent: null, videos: 210, status: 'active' },
  { id: 3, name: 'DevOps', slug: 'devops', parent: null, videos: 98, status: 'active' },
  { id: 4, name: 'Database', slug: 'database', parent: 'Lập trình', videos: 75, status: 'active' },
  { id: 5, name: 'Frontend', slug: 'frontend', parent: 'Lập trình', videos: 183, status: 'active' },
  { id: 6, name: 'Backend', slug: 'backend', parent: 'Lập trình', videos: 154, status: 'inactive' },
  { id: 7, name: 'Công cụ', slug: 'cong-cu', parent: null, videos: 66, status: 'active' }
]);

const filtered = computed(() =>
  categories.value.filter((c) => !search.value || c.name.toLowerCase().includes(search.value.toLowerCase()))
);

const deleteDialog = ref(false);
const pending = ref<Row | null>(null);

function openDelete(row: Row) {
  pending.value = row;
  deleteDialog.value = true;
}

function confirmDelete() {
  categories.value = categories.value.filter((c) => c.id !== pending.value?.id);
  deleteDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Danh sách danh mục" :breadcrumbs="breadcrumbs" />

  <CmsTableCard
    :columns="6"
    :count="filtered.length"
    :total="filtered.length"
    :items-per-page="Math.max(filtered.length, 1)"
    unit="danh mục"
    empty-title="Không tìm thấy danh mục nào"
  >
    <template #toolbar>
      <v-text-field
        v-model="search"
        class="cms-toolbar__search"
        prepend-inner-icon="mdi-magnify"
        placeholder="Tìm kiếm danh mục…"
        variant="outlined"
        density="compact"
        hide-details
        single-line
        clearable
      />
      <div class="cms-toolbar__spacer"></div>
      <v-btn color="primary" size="small" prepend-icon="mdi-plus" to="/categories/create">Thêm danh mục</v-btn>
    </template>

    <template #head>
      <tr>
        <th>Tên danh mục</th>
        <th style="width: 180px">Slug</th>
        <th style="width: 160px">Danh mục cha</th>
        <th style="width: 96px" class="cms-num">Số video</th>
        <th style="width: 120px">Trạng thái</th>
        <th style="width: 140px" class="cms-num">Thao tác</th>
      </tr>
    </template>

    <template #body>
      <tr v-for="cat in filtered" :key="cat.id">
        <td>
          <span class="cms-table__title">
            <span v-if="cat.parent" class="text-lightText mr-1">└</span>{{ cat.name }}
          </span>
        </td>
        <td class="text-lightText">{{ cat.slug }}</td>
        <td>{{ cat.parent || '—' }}</td>
        <td class="cms-num">{{ cat.videos.toLocaleString('vi-VN') }}</td>
        <td><CmsStatusChip type="category" :value="cat.status" /></td>
        <td class="cms-table__actions">
          <CmsRowActions :viewable="false" :edit-to="`/categories/${cat.id}/edit`" @delete="openDelete(cat)" />
        </td>
      </tr>
    </template>
  </CmsTableCard>

  <CmsConfirmDialog
    v-model="deleteDialog"
    :message="`Xoá danh mục “${pending?.name}”? Video bên trong không bị xoá. Hành động này không thể hoàn tác.`"
    @confirm="confirmDelete"
  />
</template>
