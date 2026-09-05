<script setup lang="ts">
import { ref } from 'vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();

// themes color options
const themeColors = ref([
  {
    name: 'DefaultTheme',
    title: 'Default',
    bg: 'themeDefault'
  },
  {
    name: 'LightTheme1',
    title: 'Theme 1',
    bg: 'themeLightTheme1'
  },
  {
    name: 'LightTheme2',
    title: 'Theme 2',
    bg: 'themeLightTheme2'
  },
  {
    name: 'LightTheme3',
    title: 'Theme 3',
    bg: 'themeLightTheme3'
  },
  {
    name: 'LightTheme4',
    title: 'Theme 4',
    bg: 'themeLightTheme4'
  },
  {
    name: 'LightTheme5',
    title: 'Theme 5',
    bg: 'themeLightTheme5'
  },
  {
    name: 'LightTheme6',
    title: 'Theme 6',
    bg: 'themeLightTheme6'
  },
  {
    name: 'LightTheme7',
    title: 'Theme 7',
    bg: 'themeLightTheme7'
  },
  {
    name: 'LightTheme8',
    title: 'Theme 8',
    bg: 'themeLightTheme8'
  }
]);

// Dark Theme Colors
const DarkthemeColors = ref([
  { name: 'DarkDefaultTheme', title: 'Default', bg: 'themeDarkDefault' },
  { name: 'DarkTheme1', title: 'Theme 1', bg: 'themeDark1' },
  { name: 'DarkTheme2', title: 'Theme 2', bg: 'themeDark2' },
  { name: 'DarkTheme3', title: 'Theme 3', bg: 'themeDark3' },
  { name: 'DarkTheme4', title: 'Theme 4', bg: 'themeDark4' },
  { name: 'DarkTheme5', title: 'Theme 5', bg: 'themeDark5' },
  { name: 'DarkTheme6', title: 'Theme 6', bg: 'themeDark6' },
  { name: 'DarkTheme7', title: 'Theme 7', bg: 'themeDark7' },
  { name: 'DarkTheme8', title: 'Theme 8', bg: 'themeDark8' }
]);

// themes font Family options
const fontFamily = ref(['Inter-var', 'Inter', 'Roboto', 'Poppins', 'Public sans']);
// themes font Family options

function clearoptions() {
  customizer.actTheme = 'DefaultTheme';
  customizer.setHorizontalLayout = false;
  customizer.inputBg = false;
  customizer.boxed = false;
  customizer.fontTheme = 'Inter-var';
}
</script>

<!------------------------------------->
<!-- Customizer -->
<!------------------------------------->
<template>
  <v-btn
    class="customizer-btn ml-sm-2 ml-1"
    icon
    color="white"
    aria-label="customizer button"
    rounded="sm"
    variant="flat"
    @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
  >
    <div class="text-primary">
      <SvgSprite name="custom-setting-2" style="width: 28px; height: 28px" />
    </div>
  </v-btn>
  <v-navigation-drawer app temporary elevation="24" location="right" border="0" v-model="customizer.Customizer_drawer" width="360">
    <v-row class="ma-0">
      <v-col cols="12" class="pa-0">
        <div class="pa-5 d-flex justify-space-between align-center">
          <div class="text-h5">Settings</div>
          <div>
            <v-btn
              variant="text"
              icon
              aria-label="close"
              color="error"
              rounded="md"
              density="compact"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
            >
              <SvgSprite name="custom-close" style="width: 18px; height: 18px; transform: rotate(45deg)" />
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <perfect-scrollbar style="height: calc(100vh - 69px)">
      <div>
        <v-row class="ma-0">
          <v-col cols="12" class="pa-0">
            <div class="px-6">
              <h6 class="text-subtitle-1 mb-0">Menu Orientation</h6>
              <p class="text-caption mb-0">Choose Vertical or Horizontal Menu Orientation</p>
              <!-- sidebar layout -->
              <v-radio-group class="custom-radio mx-n2 mt-2 mb-3" v-model="customizer.setHorizontalLayout" hide-details>
                <v-radio :value="false" color="primary" class="ma-2 text-center" label="Vertical">
                  <img src="@/assets/images/customizer/vertical.svg" alt="menu layout" />
                </v-radio>
                <v-radio :value="true" color="primary" class="ma-2 text-center" label="Horizontal">
                  <img src="@/assets/images/customizer/horizontal.svg" alt="menu layout" />
                </v-radio>
              </v-radio-group>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- Preset color -->
              <!------------------------------------->
              <h6 class="text-subtitle-1 mb-0 mt-5">Color Scheme</h6>
              <p class="text-caption mb-0">Choose your primary theme color</p>
              <v-card-item class="pa-0 mt-3 mb-4">
                <v-card-text class="px-1 py-0 colors-scheme">
                  <v-item-group mandatory v-model="customizer.actTheme" class="d-flex flex-wrap ga-1">
                    <v-item v-slot="{ isSelected, toggle }" v-for="theme in themeColors" :key="theme.name" :value="theme.name">
                      <div class="d-flex flex-column bg-gray100 rounded-md" @click="toggle" :class="isSelected ? 'Selected' : ''">
                        <div :class="theme.bg" style="padding: 8px; height: 68px; border-radius: 4px">
                          <div class="text-surface">
                            <SvgSprite name="custom-checked" style="width: 24px; height: 24px" v-if="isSelected" />
                          </div>
                        </div>
                      </div>
                    </v-item>
                  </v-item-group>
                </v-card-text>
              </v-card-item>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- end Preset color -->
              <!------------------------------------->
              <!------------------------------------->
              <!-- Dark Preset color -->
              <!------------------------------------->
              <h6 class="text-subtitle-1 mb-0 mt-5">Dark Preset Color</h6>
              <p class="text-caption mb-0">Choose your primary theme color for dark mode</p>
              <v-card-item class="pa-0 mt-3 mb-4">
                <v-card-text class="px-1 py-0 colors-scheme">
                  <v-item-group mandatory v-model="customizer.actTheme" class="d-flex flex-wrap ga-1">
                    <v-item v-slot="{ isSelected, toggle }" v-for="theme in DarkthemeColors" :key="theme.name" :value="theme.name">
                      <div class="d-flex flex-column bg-gray100 rounded-md" @click="toggle" :class="isSelected ? 'Selected' : ''">
                        <div :class="theme.bg" style="padding: 8px; height: 68px; border-radius: 4px">
                          <div class="text-surface">
                            <SvgSprite name="custom-checked" style="width: 24px; height: 24px" v-if="isSelected" />
                          </div>
                        </div>
                      </div>
                    </v-item>
                  </v-item-group>
                </v-card-text>
              </v-card-item>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- end dark Preset color -->
              <!------------------------------------->
              <!------------------------------------->
              <!------------------------------------->
              <!-- Boxed Container -->
              <!------------------------------------->
              <h6 class="text-subtitle-1 mb-0 mt-5">Layout Width</h6>
              <p class="text-caption mb-0">Choose fluid or container layout</p>
              <v-radio-group class="custom-radio mx-n2 mt-2 mb-3" v-model="customizer.boxed" hide-details>
                <v-radio :value="false" color="primary" class="ma-2 text-center" label="Fluid">
                  <img src="@/assets/images/customizer/fluid.svg" alt="layout" />
                </v-radio>
                <v-radio :value="true" color="primary" class="ma-2 text-center" label="Container">
                  <img src="@/assets/images/customizer/container.svg" alt="layout" />
                </v-radio>
              </v-radio-group>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- End Box Container -->
              <!------------------------------------->
              <!------------------------------------->
              <!-- Input Outlined With Filled -->
              <!------------------------------------->
              <h6 class="text-subtitle-1 mb-0 mt-5">Input Background</h6>
              <p class="text-caption mb-0">Choose option with background or without background for input</p>
              <v-radio-group class="custom-radio input-radio mx-n2 mt-2 mb-4" v-model="customizer.inputBg" hide-details>
                <v-radio :value="true" color="primary" class="ma-2 input-bg px-3" label="With Background"> </v-radio>
                <v-radio :value="false" color="primary" class="ma-2 without-bg px-3" label="No Background"> </v-radio>
              </v-radio-group>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- End Input Outlined With Filled -->
              <!------------------------------------->
              <!------------------------------------->
              <!-- Font Family -->
              <!------------------------------------->
              <h6 class="text-subtitle-1 mb-0 mt-5">Font Family</h6>
              <p class="text-caption mb-0">Choose your font family.</p>
              <v-radio-group v-model="customizer.fontTheme" hide-details class="custom-font mt-2 mb-3">
                <v-radio v-for="font in fontFamily" :key="font" :value="font" color="primary" class="mb-2 text-center">
                  <template v-slot:label>
                    <h5 :class="`${font} text-h5 mb-0`">Aa</h5>
                    <span class="text-caption text-lightText">{{ font }}</span>
                  </template>
                </v-radio>
              </v-radio-group>
              <v-divider></v-divider>
              <!------------------------------------->
              <!-- end Font Family -->
              <!------------------------------------->
              <!------------------------------------->
              <div class="d-flex py-4">
                <v-btn color="error" variant="tonal" rounded="md" block @click="clearoptions"> Reset </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
<style lang="scss">
@import '@/scss/_variables.scss';
.customizer-accordion {
  .v-expansion-panel-title {
    padding: 16px;
  }
  .v-expansion-panel {
    border-width: 0;
    border-top: 1px solid rgb(var(--v-theme-borderLight));
    border-radius: 0;
    &.v-expansion-panel--active {
      .v-expansion-panel-title--active {
        .v-expansion-panel-title__overlay {
          background: transparent;
        }
      }
    }
    .v-expansion-panel-text__wrapper {
      padding: 16px;
      border-top: none;
    }
  }
  .v-expansion-panel-title {
    &:hover {
      > .v-expansion-panel-title__overlay {
        opacity: 0;
      }
    }
  }
}
.custom-radio {
  .v-selection-control-group {
    flex-direction: row;
    .v-selection-control {
      align-items: center;
      justify-content: center;
      flex: 1 0 0%;
      display: block;
      border-radius: 12px;
      box-shadow: 0 0 0 2px rgb(var(--v-theme-borderLight));
      .v-label {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
      &.v-selection-control--dirty {
        box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
        width: 100%;
        flex: 1;
      }
      .v-selection-control__wrapper {
        z-index: -1;
        width: unset;
        height: unset;
        display: block;
        img {
          height: 62px;
          margin: 8px;
        }
        .v-selection-control__input {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
.colors-scheme {
  .Selected {
    width: 78px;
  }
}
.input-bg {
  background-color: rgb(var(--v-theme-containerBg)) !important;
}
.without-bg {
  background-color: rgb(var(--v-theme-surface)) !important;
}
.input-radio {
  .v-selection-control-group {
    .v-selection-control {
      height: 30px;
      width: 100%;
      border-radius: 4px;
      .v-label {
        padding-top: 0;
        opacity: 1;
        position: relative;
        font-size: 0.75rem;
      }
    }
  }
}
.custom-font {
  .v-selection-control-group {
    flex-direction: row;
    flex-wrap: wrap;
    .v-selection-control__wrapper {
      display: none;
    }
    .v-selection-control {
      border-radius: 4px;
      margin: 6px;
      padding: 8px;
      min-width: 80px;
      box-shadow: 0 0 0 2px rgb(var(--v-theme-borderLight));
      .v-label {
        display: block;
        text-align: center;
        --v-medium-emphasis-opacity: 1;
      }
      &.v-selection-control--dirty {
        box-shadow: 0 0 0 2px rgb(var(--v-theme-primary));
      }
    }
  }
  .v-selection-control {
    justify-content: center;
  }
}
</style>
