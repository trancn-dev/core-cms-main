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
  { title: 'Cài đặt chung', disabled: true }
];

const { form, saving, dirty, reset, save } = useSettingsForm({
  siteName: 'MediaHub VN',
  siteDescription: 'Nền tảng xem video học tập hàng đầu Việt Nam',
  siteUrl: 'https://mediahub.vn',
  contactEmail: 'admin@mediahub.vn',
  defaultLanguage: 'vi',
  allowRegistration: true,
  requireEmailVerification: true,
  maintenanceMode: false,
  videosPerPage: 24
});

const languages = [
  { title: 'Tiếng Việt', value: 'vi' },
  { title: 'English', value: 'en' }
];

const shortcuts = [
  { to: '/settings/storage', icon: 'mdi-cloud-upload-outline', title: 'Lưu trữ' },
  { to: '/settings/seo', icon: 'mdi-magnify', title: 'SEO' },
  { to: '/settings/email', icon: 'mdi-email-outline', title: 'Email' },
  { to: '/settings/admins', icon: 'mdi-lock-outline', title: 'Quản trị viên' }
];
</script>

<template>
  <BaseBreadcrumb title="Cài đặt chung" :breadcrumbs="breadcrumbs" />

  <v-form @submit.prevent="save">
    <v-row>
      <v-col cols="12" md="8" class="d-flex flex-column ga-5">
        <CmsFormCard title="Thông tin trang web">
          <CmsField v-slot="{ id }" label="Tên trang web">
            <v-text-field :id="id" v-model="form.siteName" variant="outlined" density="compact" hide-details />
          </CmsField>
          <CmsField v-slot="{ id }" label="Mô tả trang web">
            <v-textarea :id="id" v-model="form.siteDescription" variant="outlined" density="compact" hide-details rows="2" auto-grow />
          </CmsField>
          <v-row dense>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="URL trang web">
                <v-text-field :id="id" v-model="form.siteUrl" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Email liên hệ">
                <v-text-field :id="id" v-model="form.contactEmail" type="email" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Ngôn ngữ mặc định">
                <v-select :id="id" v-model="form.defaultLanguage" :items="languages" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
            <v-col cols="12" sm="6">
              <CmsField v-slot="{ id }" label="Số video mỗi trang">
                <v-text-field :id="id" v-model.number="form.videosPerPage" type="number" min="1" variant="outlined" density="compact" hide-details />
              </CmsField>
            </v-col>
          </v-row>
        </CmsFormCard>

        <CmsFormCard title="Tính năng hệ thống">
          <div>
            <CmsSwitchRow v-model="form.allowRegistration" label="Cho phép đăng ký tài khoản mới" />
            <CmsSwitchRow v-model="form.requireEmailVerification" label="Yêu cầu xác thực email" />
            <CmsSwitchRow
              v-model="form.maintenanceMode"
              label="Chế độ bảo trì"
              note="Trang công khai sẽ hiện thông báo bảo trì"
              color="warning"
            />
          </div>
        </CmsFormCard>
      </v-col>

      <v-col cols="12" md="4" class="d-flex flex-column ga-4">
        <CmsFormCard title="Cài đặt khác">
          <div>
            <router-link
              v-for="s in shortcuts"
              :key="s.to"
              :to="s.to"
              class="cms-info-row text-decoration-none text-darkText"
            >
              <span class="d-flex align-center ga-3">
                <v-icon size="18" color="secondary">{{ s.icon }}</v-icon>{{ s.title }}
              </span>
              <SvgSprite name="custom-chevron-outline" style="width: 12px; height: 12px; transform: rotate(-90deg)" />
            </router-link>
          </div>
        </CmsFormCard>

        <CmsFormActions submit-label="Lưu cài đặt" :loading="saving" :disabled="!dirty" @cancel="reset" />
      </v-col>
    </v-row>
  </v-form>
</template>
