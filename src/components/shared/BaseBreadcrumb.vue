<script setup lang="ts">
import { router } from '@/router';
import type { BreadcrumbType } from '@/types/common';

const props = defineProps({
  title: String,
  breadcrumbs: Array as () => BreadcrumbType[],
  icon: String
});

const onClickHandle = (item: BreadcrumbType) => {
  if (item.href) {
    router.push(item.href);
  }
}
</script>

<template>
  <v-row class="page-breadcrumb mb-0 mt-n2">
    <v-col cols="12" md="12">
      <v-card elevation="0" variant="text">
        <v-row no-gutters class="align-center">
          <v-col sm="12">
            <v-breadcrumbs :items="props.breadcrumbs" class="text-h6 pa-1 mb-0">
              <template v-slot:divider>
                <div class="d-flex align-center">
                  <SvgSprite name="custom-chevron-outline" style="width: 12px; height: 12px" />
                </div>
              </template>
              <template v-slot:item="{ item }">
                <v-breadcrumbs-item class="cursor-pointer" @click="onClickHandle(item)" :disabled="item.disabled">
                  {{ item.title }}
                </v-breadcrumbs-item>
              </template>
              <template v-slot:prepend>
                <router-link to="/" class="text-darkText text-h6 text-decoration-none v-breadcrumbs-item--link"> Trang chủ </router-link>
                <div class="d-flex align-center px-2">
                  <SvgSprite name="custom-chevron-outline" style="width: 12px; height: 12px" />
                </div>
              </template>
            </v-breadcrumbs>
            <h2 class="text-h2 font-weight-bold mb-0">{{ props.title }}</h2>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.page-breadcrumb {
  .v-breadcrumbs {
    overflow: auto;
  }
  .v-toolbar {
    background: transparent;
  }
  .v-breadcrumbs-item--link {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
