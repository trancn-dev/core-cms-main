<script setup lang="ts">
/** Full-screen error page: illustration, h1 (38/600), explanation, way back. */
defineProps<{ image: string; title: string; description: string }>();
</script>

<template>
  <v-row no-gutters class="overflow-hidden bg-containerBg" style="min-height: 100vh">
    <v-col class="d-flex align-center justify-center pa-4">
      <div class="text-center d-flex flex-column align-center ga-3">
        <img :src="image" alt="" class="cms-error-page__img" />
        <h1 class="text-h1 mt-8 mb-0">{{ title }}</h1>
        <p class="text-body-1 text-lightText mb-0" style="max-width: 460px">{{ description }}</p>
        <v-btn color="primary" height="44" class="mt-2" to="/">Về trang chủ</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<style lang="scss">
.cms-error-page__img {
  width: 250px;
  height: 130px;

  @media (min-width: 768px) {
    width: 590px;
    height: 300px;
  }
}
</style>
