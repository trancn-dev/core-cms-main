import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { icons } from './mdi-icon';
import type { IconSet, IconProps } from 'vuetify';
import { h } from 'vue';
import * as mdiJs from '@mdi/js';

function mdiNameToCamel(name: string): string {
  const clean = name.startsWith('mdi-') ? name.slice(4) : name;
  return 'mdi' + clean.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

// Allows using "mdi-video", "mdi-eye", etc. with the SVG icon set
const mdiDynamicSet: IconSet = {
  component: (props: IconProps) => {
    const icon = String(props.icon);
    if (icon.startsWith('mdi-')) {
      const camel = mdiNameToCamel(icon);
      const path = (mdiJs as Record<string, string>)[camel];
      if (path) {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', class: 'v-icon__svg', style: 'fill:currentColor;width:1em;height:1em', 'aria-hidden': 'true' }, [
          h('path', { d: path })
        ]);
      }
    }
    return h('i', { class: icon });
  }
};
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import {
  DefaultTheme,
  LightTheme1,
  LightTheme2,
  LightTheme3,
  LightTheme4,
  LightTheme5,
  LightTheme6,
  LightTheme7,
  LightTheme8
} from '@/theme/LightTheme';
import {
  DarkDefaultTheme,
  DarkTheme1,
  DarkTheme6,
  DarkTheme7,
  DarkTheme8,
  DarkTheme5,
  DarkTheme2,
  DarkTheme3,
  DarkTheme4
} from '@/theme/DarkTheme';

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi: mdiDynamicSet
    }
  },
  theme: {
    defaultTheme: 'DefaultTheme',
    themes: {
      DefaultTheme,
      LightTheme1,
      LightTheme2,
      LightTheme3,
      LightTheme4,
      LightTheme5,
      LightTheme6,
      LightTheme7,
      LightTheme8,
      DarkDefaultTheme,
      DarkTheme1,
      DarkTheme8,
      DarkTheme7,
      DarkTheme6,
      DarkTheme5,
      DarkTheme2,
      DarkTheme3,
      DarkTheme4
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});
