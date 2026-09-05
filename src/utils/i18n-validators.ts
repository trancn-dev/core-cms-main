import * as validators from '@vuelidate/validators';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  locale: 'vi',
  messages: {
    vi: {
      validations: {
        required: 'Vui lòng nhập {prop}.',
        requiredIf: 'Vui lòng nhập {prop}.',
        maxLength: 'Vui lòng nhập tối đa {max} kí tự.',
        minLength: 'Vui lòng nhập tối thiểu {min} kí tự',
        email: 'Vui lòng nhập đúng định dạng email',
        numeric: 'Giá trị phải là số',
        maxValue: 'Giá trị tối đa phải dưới {max}',
        fileMaxSize: 'Kích thước file phải nhỏ hơn {max} MB',
        errors: 'Dữ liệu nhập chưa hoàn thành. Vui lòng kiểm tra các trường tô đỏ.'
      }
    }
  }
});
const { createI18nMessage } = validators;

const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) });
const fileMaxSize = (sizeFile: number, maxSize: number) => {
  if (sizeFile != undefined) return sizeFile <= maxSize;
  return false;
};
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true });
export const minLength = withI18nMessage(validators.minLength, { withArguments: true });
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true });
export const email = withI18nMessage(validators.email);
export const fileSizeMaxValidator = (maxSize: number) =>
  withI18nMessage((sizeFile: number) => fileMaxSize(sizeFile, maxSize), {
    withArguments: false,
    messageParams: (params) => ({
      ...params,
      max: maxSize / (1024 * 1024)
    })
  });
export const messageFormError = i18n.global.t('validations.errors');
