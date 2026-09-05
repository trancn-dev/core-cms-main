import { helpers } from '@vuelidate/validators';

export const alphabetNumbericRegex = helpers.regex(/^[a-zA-Z0-9]*$/);
export const phoneRegex = helpers.regex(/^0\d+$/);
