<script setup lang="ts">
import CmsErrorPage from '@/components/cms/CmsErrorPage.vue';
import image from '@/assets/images/maintenance/img-error-404.svg';
</script>

<template>
  <CmsErrorPage
    :image="image"
    title="Không tìm thấy trang"
    description="Trang bạn truy cập không tồn tại hoặc đã bị chuyển đi. Kiểm tra lại đường dẫn."
  />
</template>
