<template>
  <v-row no-gutters class="overflow-hidden bg-containerBg" style="min-height: 100vh">
    <v-col class="d-flex align-center justify-center">
      <div class="text-center">
        <div class="CardMediaWrapper">
          <img src="@/assets/images/maintenance/img-error-404.svg" alt="404" />
        </div>
        <h1 class="text-h1 mt-16">Không tìm thấy trang này</h1>
        <p class="text-h6 text-lightText">Trang bạn truy cập không tồn tại. Vui lòng nhập URL chính xác</p>
        <v-btn variant="flat" color="primary" class="mt-2" rounded="md" to="/">Về trang chủ</v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<style lang="scss">
.CardMediaWrapper {
  max-width: 720px;
  margin: 0 auto;
  position: relative;

  >img {
    @media (min-width: 0px) {
      width: 250px;
      height: 130px;
    }

    @media (min-width: 768px) {
      width: 590px;
      height: 300px;
    }
  }
}
</style>
