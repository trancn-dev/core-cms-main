<script setup lang="ts">
import { ref, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsTableCard from '@/components/cms/CmsTableCard.vue';
import CmsRowActions from '@/components/cms/CmsRowActions.vue';
import CmsConfirmDialog from '@/components/cms/CmsConfirmDialog.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import type { BreadcrumbType } from '@/types/common';

const breadcrumbs: BreadcrumbType[] = [{ title: 'Tags', disabled: true }];

type Tag = { id: number; name: string; videos: number; editing: boolean; draft: string };

const tags = ref<Tag[]>([
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

const filtered = computed(() => tags.value.filter((t) => !search.value || t.name.includes(search.value.toLowerCase())));

function startEdit(tag: Tag) {
  tags.value.forEach((t) => (t.editing = false));
  tag.draft = tag.name;
  tag.editing = true;
}

function saveEdit(tag: Tag) {
  if (tag.draft.trim()) tag.name = tag.draft.trim();
  tag.editing = false;
}

function addTag() {
  const name = newTag.value.trim();
  if (!name) return;
  tags.value.push({ id: Date.now(), name, videos: 0, editing: false, draft: '' });
  newTag.value = '';
}

const deleteDialog = ref(false);
const pending = ref<Tag | null>(null);

function openDelete(tag: Tag) {
  pending.value = tag;
  deleteDialog.value = true;
}

function confirmDelete() {
  tags.value = tags.value.filter((t) => t.id !== pending.value?.id);
  deleteDialog.value = false;
}
</script>

<template>
  <BaseBreadcrumb title="Quản lý tags" :breadcrumbs="breadcrumbs" />

  <v-row>
    <v-col cols="12" md="4">
      <CmsFormCard title="Thêm tag mới">
        <CmsField v-slot="{ id }" label="Tên tag" required>
          <v-text-field
            :id="id"
            v-model="newTag"
            variant="outlined"
            density="compact"
            hide-details
            placeholder="Nhập tên tag…"
            @keydown.enter="addTag"
          />
        </CmsField>
        <v-btn color="primary" block :disabled="!newTag.trim()" @click="addTag">Thêm tag</v-btn>
      </CmsFormCard>
    </v-col>

    <v-col cols="12" md="8">
      <CmsTableCard
        :columns="3"
        :count="filtered.length"
        :total="filtered.length"
        :items-per-page="Math.max(filtered.length, 1)"
        unit="tag"
        empty-title="Không tìm thấy tag nào"
      >
        <template #toolbar>
          <v-text-field
            v-model="search"
            class="cms-toolbar__search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Tìm kiếm tag…"
            variant="outlined"
            density="compact"
            hide-details
            single-line
            clearable
          />
        </template>

        <template #head>
          <tr>
            <th>Tên tag</th>
            <th style="width: 96px" class="cms-num">Số video</th>
            <th style="width: 140px" class="cms-num">Thao tác</th>
          </tr>
        </template>

        <template #body>
          <tr v-for="tag in filtered" :key="tag.id">
            <td>
              <div v-if="tag.editing" class="d-flex align-center ga-2">
                <v-text-field
                  v-model="tag.draft"
                  variant="outlined"
                  density="compact"
                  hide-details
                  autofocus
                  style="max-width: 220px"
                  @keydown.enter="saveEdit(tag)"
                  @keydown.esc="tag.editing = false"
                />
                <v-btn class="cms-icon-btn" variant="flat" size="small" aria-label="Lưu" @click.stop="saveEdit(tag)">
                  <v-icon size="17" color="success">mdi-check</v-icon>
                </v-btn>
              </div>
              <span v-else class="cms-chip bg-lightprimary text-onLightprimary cms-chip--sm">{{ tag.name }}</span>
            </td>
            <td class="cms-num">{{ tag.videos.toLocaleString('vi-VN') }}</td>
            <td class="cms-table__actions">
              <CmsRowActions :viewable="false" @edit="startEdit(tag)" @delete="openDelete(tag)" />
            </td>
          </tr>
        </template>
      </CmsTableCard>
    </v-col>
  </v-row>

  <CmsConfirmDialog
    v-model="deleteDialog"
    :message="`Xoá tag “${pending?.name}” khỏi tất cả video liên quan? Hành động này không thể hoàn tác.`"
    @confirm="confirmDelete"
  />
</template>
