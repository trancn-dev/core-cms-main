<script setup lang="ts">
import { router } from '@/router';
import type { BreadcrumbType } from '@/types/common';

const props = defineProps({
  title: String,
  breadcrumbs: Array as () => BreadcrumbType[],
  icon: String,
  /** Right-aligned caption, e.g. "Cập nhật 16/09/2026 · 09:24". */
  meta: String
});

const onClickHandle = (item: BreadcrumbType) => {
  if (item.href) {
    router.push(item.href);
  }
};
</script>

<template>
  <div class="cms-page-header page-breadcrumb mb-4">
    <div>
      <div class="cms-page-header__crumbs">
        <router-link to="/">Trang chủ</router-link>
        <template v-for="(item, i) in props.breadcrumbs" :key="i">
          <SvgSprite name="custom-chevron-outline" style="width: 12px; height: 12px" />
          <span
            :class="item.disabled ? 'text-darkText' : 'cursor-pointer'"
            @click="!item.disabled && onClickHandle(item)"
            >{{ item.title }}</span
          >
        </template>
      </div>
      <h2 class="text-h2 mb-0">{{ props.title }}</h2>
    </div>

    <div class="d-flex align-center ga-3">
      <span v-if="props.meta" class="cms-page-header__meta">{{ props.meta }}</span>
      <slot name="actions" />
    </div>
  </div>
</template>
