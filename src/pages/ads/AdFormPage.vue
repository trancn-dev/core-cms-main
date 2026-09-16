<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import type { AdStatus, AdType } from '@/types/media';
import { statusFilterOptions } from '@/utils/statusMaps';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const isEdit = computed(() => !!route.params.id);
const breadcrumbs: BreadcrumbType[] = [
  { title: 'Quảng cáo', href: '/ads' },
  { title: isEdit.value ? 'Chỉnh sửa' : 'Thêm mới', disabled: true }
];

const typeOpts = statusFilterOptions('adType', '').slice(1);
// "expired" is set by the system when the end date passes, not chosen by hand
const statusOpts = statusFilterOptions('adStatus', '').slice(1).filter((o) => o.value !== 'expired');

const form = ref({
  title: '',
  type: 'pre_roll' as AdType,
  creativeUrl: '',
  targetUrl: '',
  skipAfter: null as number | null,
  startDate: null as string | null,
  endDate: null as string | null,
  status: 'active' as AdStatus
});
const saving = ref(false);
const submitted = ref(false);

if (isEdit.value) {
  form.value = {
    title: 'Khoá học Vue 3 Pro',
    type: 'pre_roll',
    creativeUrl: 'https://cdn.example.com/ad1.mp4',
    targetUrl: 'https://course.example.com',
    skipAfter: 5,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    status: 'active'
  };
}

const isVideoAd = computed(() => form.value.type === 'pre_roll' || form.value.type === 'mid_roll');

const errors = computed(() => ({
  title: submitted.value && !form.value.title.trim() ? 'Vui lòng nhập tên chiến dịch' : '',
  endDate:
    submitted.value && form.value.startDate && form.value.endDate && form.value.endDate < form.value.startDate
      ? 'Ngày kết thúc phải sau ngày bắt đầu'
      : ''
}));

async function onSubmit() {
  submitted.value = true;
  if (Object.values(errors.value).some(Boolean)) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 600));
  saving.value = false;
  toast.success(`Đã lưu chiến dịch “${form.value.title}”.`);
  router.push('/ads');
}
</script>

<template>
  <BaseBreadcrumb :title="isEdit ? 'Chỉnh sửa quảng cáo' : 'Thêm quảng cáo'" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="onSubmit">
    <v-row justify="center">
      <v-col cols="12" md="8" class="d-flex flex-column ga-4">
        <CmsFormCard title="Thông tin chiến dịch">
          <CmsField v-slot="{ id }" label="Tên chiến dịch" required :error="errors.title">
            <v-text-field :id="id" v-model="form.title" variant="outlined" density="compact" hide-details :error="!!errors.title" />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Loại quảng cáo" required>
                <v-select :id="id" v-model="form.type" :items="typeOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Trạng thái">
                <v-select :id="id" v-model="form.status" :items="statusOpts" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
          <CmsField v-slot="{ id }" label="URL tệp quảng cáo" hint="Video hoặc hình ảnh">
            <v-text-field :id="id" v-model="form.creativeUrl" variant="outlined" density="compact" hide-details placeholder="https://…" />
          </CmsField>
          <CmsField v-slot="{ id }" label="URL đích" hint="Mở khi người xem nhấp vào quảng cáo">
            <v-text-field :id="id" v-model="form.targetUrl" variant="outlined" density="compact" hide-details placeholder="https://…" />
          </CmsField>
          <CmsField v-if="isVideoAd" v-slot="{ id }" label="Bỏ qua sau (giây)" hint="Để trống nếu không cho phép bỏ qua">
            <v-text-field :id="id" v-model.number="form.skipAfter" type="number" min="0" variant="outlined" density="compact" hide-details />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField label="Ngày bắt đầu">
                <DatePicker v-model="form.startDate" placeholder="dd/mm/yyyy" />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField label="Ngày kết thúc" :error="errors.endDate">
                <DatePicker v-model="form.endDate" placeholder="dd/mm/yyyy" />
              </CmsField>
            </v-col>
          </v-row>
        </CmsFormCard>

        <CmsFormActions cancel-to="/ads" :submit-label="isEdit ? 'Lưu thay đổi' : 'Tạo chiến dịch'" :loading="saving" />
      </v-col>
    </v-row>
  </v-form>
</template>
