import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <span
      // className={
      //   tw.text_base.md(tw.text_lg).mx_2.font_extrabold.inline.select_none
      // }
      style={{ fontFamily: 'IBM Plex Mono, monospace' }}
    >
      sveltris
    </span>
  ),
  project: {
    link: 'https://github.com/mokshit06/sveltris',
  },
  docsRepositoryBase: 'https://github.com/mokshit06/sveltris',
  footer: {
    text: 'Nextra Docs Template',
  },
};

export default config;
