<script setup lang="ts">
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import CmsFormCard from '@/components/cms/CmsFormCard.vue';
import CmsField from '@/components/cms/CmsField.vue';
import CmsSwitchRow from '@/components/cms/CmsSwitchRow.vue';
import CmsFormActions from '@/components/cms/CmsFormActions.vue';
import type { BreadcrumbType } from '@/types/common';
import { useSettingsForm } from '@/composables/useSettingsForm';

const breadcrumbs: BreadcrumbType[] = [
  { title: 'Cài đặt', disabled: true },
  { title: 'SEO', disabled: true }
];

const { form, saving, dirty, reset, save } = useSettingsForm({
  metaTitle: 'MediaHub VN — Nền tảng video học tập',
  metaDescription: 'Xem hàng ngàn video học tập chất lượng cao về lập trình, thiết kế và nhiều chủ đề khác.',
  metaKeywords: 'video học tập, lập trình, thiết kế, devops',
  googleAnalyticsId: '',
  enableSitemap: true,
  enableOpenGraph: true
});
</script>

<template>
  <BaseBreadcrumb title="Cài đặt SEO" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="save">
    <v-row justify="center">
      <v-col cols="12" md="8" class="d-flex flex-column ga-4">
        <CmsFormCard title="SEO mặc định">
          <CmsField v-slot="{ id }" label="Meta title mặc định" :hint="`${form.metaTitle.length}/60 ký tự`">
            <v-text-field :id="id" v-model="form.metaTitle" variant="outlined" density="compact" hide-details />
          </CmsField>
          <CmsField v-slot="{ id }" label="Meta description mặc định" :hint="`${form.metaDescription.length}/160 ký tự`">
            <v-textarea :id="id" v-model="form.metaDescription" variant="outlined" density="compact" hide-details rows="2" auto-grow />
          </CmsField>
          <CmsField v-slot="{ id }" label="Meta keywords" hint="Các từ khoá cách nhau bởi dấu phẩy">
            <v-text-field :id="id" v-model="form.metaKeywords" variant="outlined" density="compact" hide-details />
          </CmsField>
          <CmsField v-slot="{ id }" label="Google Analytics ID (GA4)">
            <v-text-field :id="id" v-model="form.googleAnalyticsId" variant="outlined" density="compact" hide-details placeholder="G-XXXXXXXXXX" />
          </CmsField>
        </CmsFormCard>

        <CmsFormCard title="Tự động hoá">
          <div>
            <CmsSwitchRow v-model="form.enableSitemap" label="Tự động tạo sitemap.xml" />
            <CmsSwitchRow v-model="form.enableOpenGraph" label="Bật thẻ Open Graph" note="Hiển thị ảnh và mô tả khi chia sẻ lên mạng xã hội" />
          </div>
        </CmsFormCard>

        <CmsFormActions submit-label="Lưu cài đặt" :loading="saving" :disabled="!dirty" @cancel="reset" />
      </v-col>
    </v-row>
  </v-form>
</template>
