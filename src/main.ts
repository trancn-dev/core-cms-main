import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue3-easy-data-table/dist/style.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';

import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueTablerIcons from 'vue-tabler-icons';
// Plugins & Common
import ToastPlugin from 'vue-toast-notification';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import DatePicker from '@/components/shared/DatePicker.vue';
import SvgSprite from '@/components/shared/SvgSprite.vue';
import PaginationCommon from '@/components/shared/PaginationCommon.vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

//i18
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';

const i18n = createI18n({
  locale: 'en',
  messages: messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.component('EasyDataTable', Vue3EasyDataTable);
app.component('DatePicker', DatePicker);
app.component('PaginationCommon', PaginationCommon);
app.component('SvgSprite', SvgSprite);
app.component('BaseBreadcrumb', BaseBreadcrumb);
app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(pinia);
app.use(VueTablerIcons);
app.use(i18n);
app.use(ToastPlugin);
app.use(vuetify).mount('#app');
