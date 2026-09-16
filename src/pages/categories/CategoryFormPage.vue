<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import { statusFilterOptions } from '@/utils/statusMaps';
import { slugify } from '@/utils/slugify';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isEdit = computed(() => !!route.params.id);

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Danh mục', href: '/categories' },
  { title: isEdit.value ? 'Chỉnh sửa' : 'Thêm mới', disabled: true }
];

const parentCategories = [
  { id: 0, name: 'Không có (danh mục gốc)' },
  { id: 1, name: 'Lập trình' },
  { id: 2, name: 'Thiết kế' },
  { id: 3, name: 'DevOps' }
];
const statusOpts = statusFilterOptions('category', '').slice(1);

const form = ref({ name: '', slug: '', description: '', parentId: 0, status: 'active', thumbnailFile: null as File | null });
const saving = ref(false);
const submitted = ref(false);

if (isEdit.value) {
  form.value = { name: 'Lập trình', slug: 'lap-trinh', description: 'Các video về lập trình.', parentId: 0, status: 'active', thumbnailFile: null };
}

const errors = computed(() => ({
  name: submitted.value && !form.value.name.trim() ? 'Vui lòng nhập tên danh mục' : '',
  slug: submitted.value && !form.value.slug.trim() ? 'Vui lòng nhập slug' : ''
}));

function onNameInput(name: string) {
  form.value.slug = slugify(name);
}

async function onSubmit() {
  submitted.value = true;
  if (errors.value.name || errors.value.slug) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 600));
  saving.value = false;
  toast.success(`Đã lưu danh mục “${form.value.name}”.`);
  router.push('/categories');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="d-flex flex-column ga-4">
        <CmsFormCard title="Thông tin danh mục">
          <CmsField v-slot="{ id }" label="Tên danh mục" required :error="errors.name">
            <v-text-field :id="id" v-model="form.name" variant="outlined" density="compact" hide-details :error="!!errors.name" @update:model-value="onNameInput" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Slug" required :error="errors.slug" hint="Dùng cho URL — chữ thường và dấu gạch ngang">
            <v-text-field :id="id" v-model="form.slug" variant="outlined" density="compact" hide-details :error="!!errors.slug" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Mô tả">
            <v-textarea :id="id" v-model="form.description" variant="outlined" density="compact" hide-details rows="3" auto-grow />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Danh mục cha">
                <v-select :id="id" v-model="form.parentId" :items="parentCategories" item-title="name" item-value="id" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Trạng thái">
                <v-select :id="id" v-model="form.status" :items="statusOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
          <CmsField v-slot="{ id }" label="Ảnh đại diện">
            <v-file-input
              :id="id"
              v-model="form.thumbnailFile"
              variant="outlined"
              density="compact"
              hide-details
              accept="image/*"
              prepend-icon=""
              prepend-inner-icon="mdi-image-outline"
              placeholder="Chọn ảnh…"
            />
          </CmsField>
        </CmsFormCard>

        <CmsFormActions cancel-to="/categories" :submit-label="isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'" :loading="saving" />
      </v-col>
    </v-row>
  </v-form>
</template>
