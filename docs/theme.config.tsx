import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <img src="/sveltris-logo.png" width="30px" />
      <span
        // className={
        //   tw.text_base.md(tw.text_lg).mx_2.font_extrabold.inline.select_none
        // }
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontWeight: 'bold',
          fontSize: '1.125rem',
        }}
      >
        sveltris
      </span>
    </div>
  ),
  project: {
    link: 'https://github.com/mokshit06/sveltris',
  },
  docsRepositoryBase: 'https://github.com/mokshit06/sveltris',
  footer: {
    text: 'MIT 2023 © Mokshit Jain',
  },
};

export default config;
