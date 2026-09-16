<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { ChannelStatus } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';
import { slugify } from '@/utils/slugify';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isEdit = computed(() => !!route.params.id);

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Kênh', href: '/channels' },
  { title: isEdit.value ? 'Chỉnh sửa kênh' : 'Thêm kênh', disabled: true }
];

const users = [
  { id: 1, name: 'Nguyễn Văn An' },
  { id: 2, name: 'Trần Minh Đức' },
  { id: 3, name: 'Lê Thị Hoa' }
];
const statusOpts = statusFilterOptions('channel', '').slice(1);

const form = ref({
  name: '',
  slug: '',
  description: '',
  ownerId: null as number | null,
  status: 'active' as ChannelStatus,
  avatarFile: null as File | null,
  coverFile: null as File | null
});
const saving = ref(false);
const submitted = ref(false);

if (isEdit.value) {
  form.value = { name: 'Dev Việt Nam', slug: 'dev-viet-nam', description: 'Kênh lập trình web.', ownerId: 1, status: 'active', avatarFile: null, coverFile: null };
}

const errors = computed(() => ({
  name: submitted.value && !form.value.name.trim() ? 'Vui lòng nhập tên kênh' : '',
  slug: submitted.value && !form.value.slug.trim() ? 'Vui lòng nhập slug' : '',
  ownerId: submitted.value && !form.value.ownerId ? 'Vui lòng chọn chủ kênh' : ''
}));

async function onSubmit() {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean)) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 600));
  saving.value = false;
  toast.success(`Đã lưu kênh “${form.value.name}”.`);
  router.push('/channels');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa kênh' : 'Thêm kênh'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6" class="d-flex flex-column ga-4">
        <CmsFormCard title="Thông tin kênh">
          <CmsField v-slot="{ id }" label="Tên kênh" required :error="errors.name">
            <v-text-field
              :id="id"
              v-model="form.name"
              variant="outlined"
              density="compact"
              hide-details
              :error="!!errors.name"
              @update:model-value="form.slug = slugify($event)"
            />
          </CmsField>
          <CmsField v-slot="{ id }" label="Slug" required :error="errors.slug" hint="Dùng cho URL">
            <v-text-field :id="id" v-model="form.slug" variant="outlined" density="compact" hide-details :error="!!errors.slug" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Mô tả kênh">
            <v-textarea :id="id" v-model="form.description" variant="outlined" density="compact" hide-details rows="3" auto-grow />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Chủ kênh" required :error="errors.ownerId">
                <v-select
                  :id="id"
                  v-model="form.ownerId"
                  :items="users"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  hide-details
                  placeholder="Chọn chủ kênh"
                  :error="!!errors.ownerId"
                />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Trạng thái">
                <v-select :id="id" v-model="form.status" :items="statusOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
          <CmsField v-slot="{ id }" label="Ảnh đại diện kênh">
            <v-file-input :id="id" v-model="form.avatarFile" variant="outlined" density="compact" hide-details accept="image/*" prepend-icon="" prepend-inner-icon="mdi-image-outline" placeholder="Chọn ảnh…" />
          </CmsField>
          <CmsField v-slot="{ id }" label="Ảnh bìa kênh">
            <v-file-input :id="id" v-model="form.coverFile" variant="outlined" density="compact" hide-details accept="image/*" prepend-icon="" prepend-inner-icon="mdi-image-outline" placeholder="Chọn ảnh…" />
          </CmsField>
        </CmsFormCard>

        <CmsFormActions cancel-to="/channels" :submit-label="isEdit ? 'Lưu thay đổi' : 'Tạo kênh'" :loading="saving" />
      </v-col>
    </v-row>
  </v-form>
</template>
