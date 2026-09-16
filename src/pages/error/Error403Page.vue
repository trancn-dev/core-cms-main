<script setup lang="ts">
import CmsErrorPage from '@/components/cms/CmsErrorPage.vue';
import image from '@/assets/images/maintenance/img-error-500.svg';
</script>

<template>
  <CmsErrorPage
    :image="image"
    title="Không có quyền truy cập"
    description="Tài khoản của bạn không được phép xem trang này. Liên hệ quản trị viên nếu cần cấp quyền."
  />
</template>
