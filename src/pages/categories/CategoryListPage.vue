<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Danh mục', disabled: true }];
const search = ref('');
const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);

const categories = ref([
  { id: 1, name: 'Lập trình', slug: 'lap-trinh', parent: null, videos: 412, status: 'active' },
  { id: 2, name: 'Thiết kế', slug: 'thiet-ke', parent: null, videos: 210, status: 'active' },
  { id: 3, name: 'DevOps', slug: 'devops', parent: null, videos: 98, status: 'active' },
  { id: 4, name: 'Database', slug: 'database', parent: 'Lập trình', videos: 75, status: 'active' },
  { id: 5, name: 'Frontend', slug: 'frontend', parent: 'Lập trình', videos: 183, status: 'active' },
  { id: 6, name: 'Backend', slug: 'backend', parent: 'Lập trình', videos: 154, status: 'inactive' },
  { id: 7, name: 'Công cụ', slug: 'cong-cu', parent: null, videos: 66, status: 'active' }
]);

const filtered = computed(() => categories.value.filter(c => !search.value || c.name.toLowerCase().includes(search.value.toLowerCase())));

function openDelete(id: number) { deleteId.value = id; deleteDialog.value = true; }
function confirmDelete() { categories.value = categories.value.filter(c => c.id !== deleteId.value); deleteDialog.value = false; }
</script>

<template>
  <BaseBreadcrumb title="Danh sách danh mục" :breadcrumbs="breadcrumbs" />
  <v-card rounded="lg" elevation="0" variant="outlined" class="mt-4">
    <v-card-text>
      <v-row align="center" class="mb-4">
        <v-col cols="12" sm="6">
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm kiếm danh mục..." variant="outlined" density="compact" hide-details single-line />
        </v-col>
        <v-col class="text-right">
          <v-btn color="primary" prepend-icon="mdi-plus" size="small" to="/categories/create">Thêm danh mục</v-btn>
        </v-col>
      </v-row>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Tên danh mục</th><th>Slug</th><th>Danh mục cha</th>
            <th class="text-right">Số video</th><th>Trạng thái</th><th style="width:100px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in filtered" :key="cat.id">
            <td class="font-weight-medium text-body-2">
              <span v-if="cat.parent" class="text-medium-emphasis mr-1">└</span>{{ cat.name }}
            </td>
            <td class="text-body-2 text-medium-emphasis">{{ cat.slug }}</td>
            <td class="text-body-2">{{ cat.parent || '—' }}</td>
            <td class="text-right text-body-2">{{ cat.videos }}</td>
            <td>
              <v-chip :color="cat.status === 'active' ? 'success' : 'grey'" size="x-small" variant="tonal">
                {{ cat.status === 'active' ? 'Hoạt động' : 'Ẩn' }}
              </v-chip>
            </td>
            <td>
              <v-btn icon size="x-small" variant="text" :to="`/categories/\${cat.id}/edit`"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon size="x-small" variant="text" color="error" @click="openDelete(cat.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
  <v-dialog v-model="deleteDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">Xác nhận xoá</v-card-title>
      <v-card-text>Xoá danh mục này sẽ không xoá các video bên trong. Bạn có chắc không?</v-card-text>
      <v-card-actions class="pa-4 pt-0"><v-spacer />
        <v-btn variant="text" @click="deleteDialog = false">Huỷ</v-btn>
        <v-btn color="error" variant="tonal" @click="confirmDelete">Xoá</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
