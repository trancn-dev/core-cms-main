<script setup lang="ts">
import { ref } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Tags', disabled: true }];

const tags = ref([
  { id: 1, name: 'vue3', videos: 128, editing: false, draft: '' },
  { id: 2, name: 'javascript', videos: 312, editing: false, draft: '' },
  { id: 3, name: 'typescript', videos: 204, editing: false, draft: '' },
  { id: 4, name: 'frontend', videos: 186, editing: false, draft: '' },
  { id: 5, name: 'docker', videos: 75, editing: false, draft: '' },
  { id: 6, name: 'postgresql', videos: 63, editing: false, draft: '' },
  { id: 7, name: 'pinia', videos: 42, editing: false, draft: '' },
  { id: 8, name: 'vuetify', videos: 38, editing: false, draft: '' },
  { id: 9, name: 'devops', videos: 90, editing: false, draft: '' },
  { id: 10, name: 'git', videos: 55, editing: false, draft: '' }
]);

const newTag = ref('');
const search = ref('');
const deleteDialog = ref(false);
const deleteId = ref<number | null>(null);

function startEdit(tag: typeof tags.value[0]) {
  tags.value.forEach(t => { t.editing = false; });
  tag.draft = tag.name; tag.editing = true;
}
function saveEdit(tag: typeof tags.value[0]) {
  if (tag.draft.trim()) tag.name = tag.draft.trim();
  tag.editing = false;
}
function addTag() {
  const name = newTag.value.trim();
  if (!name) return;
  tags.value.push({ id: Date.now(), name, videos: 0, editing: false, draft: '' });
  newTag.value = '';
}
function openDelete(id: number) { deleteId.value = id; deleteDialog.value = true; }
function confirmDelete() { tags.value = tags.value.filter(t => t.id !== deleteId.value); deleteDialog.value = false; }
</script>

<template>
  <BaseBreadcrumb title="Quản lý Tags" :breadcrumbs="breadcrumbs" />
  <v-row class="mt-4">
    <v-col cols="12" md="4">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-title class="pa-4 pb-2 text-h6">Thêm tag mới</v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-text-field v-model="newTag" label="Tên tag" variant="outlined" density="compact" placeholder="Nhập tên tag..." @keydown.enter="addTag" class="mb-3" />
          <v-btn color="primary" block :disabled="!newTag.trim()" @click="addTag">Thêm tag</v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card rounded="lg" elevation="0" variant="outlined">
        <v-card-text>
          <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Tìm kiếm tag..." variant="outlined" density="compact" hide-details single-line class="mb-4" />
          <v-table density="compact">
            <thead><tr><th>Tên tag</th><th class="text-right">Số video</th><th style="width:100px"></th></tr></thead>
            <tbody>
              <tr v-for="tag in tags.filter(t => !search || t.name.includes(search.toLowerCase()))" :key="tag.id">
                <td>
                  <div v-if="tag.editing" class="d-flex align-center gap-2">
                    <v-text-field v-model="tag.draft" variant="outlined" density="compact" hide-details autofocus @keydown.enter="saveEdit(tag)" @keydown.esc="tag.editing = false" style="max-width:200px" />
                    <v-btn icon size="x-small" color="success" variant="text" @click="saveEdit(tag)"><v-icon>mdi-check</v-icon></v-btn>
                  </div>
                  <v-chip v-else size="small" variant="tonal" @click="startEdit(tag)" style="cursor:pointer">{{ tag.name }}</v-chip>
                </td>
                <td class="text-right text-body-2 text-medium-emphasis">{{ tag.videos }}</td>
                <td>
                  <v-btn icon size="x-small" variant="text" @click="startEdit(tag)"><v-icon>mdi-pencil</v-icon></v-btn>
                  <v-btn icon size="x-small" variant="text" color="error" @click="openDelete(tag.id)"><v-icon>mdi-delete</v-icon></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="deleteDialog" max-width="420">
    <v-card rounded="lg">
      <v-card-title class="pa-4 text-h6">Xác nhận xoá tag</v-card-title>
      <v-card-text>Tag sẽ bị xoá khỏi tất cả video liên quan. Bạn có chắc không?</v-card-text>
      <v-card-actions class="pa-4 pt-0"><v-spacer />
        <v-btn variant="text" @click="deleteDialog = false">Huỷ</v-btn>
        <v-btn color="error" variant="tonal" @click="confirmDelete">Xoá</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
