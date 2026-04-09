/* eslint-disable no-unused-vars */
// @ts-nocheck

// Thêm để ko báo lỗi enum bị unused

export enum CREATE_BY {
  MANUAL = 'manual',
  GPT = 'gpt',
  CRAWL_CAMPAIGN = 'crawl_campaign',
}

export enum CB {
  JOB_POSTING_CARD = 'CodeBlock1',
  PRICE_OFFER_CARD = 'CodeBlock2',
  BUTTON_BLOCK = 'template_button_block',
  APP_DOWNLOAD_CARD = 'template_app_download_card',
  PROMO_CAROUSEL_CARD = 'template_promo_carousel_card',
  QUESTION_ANSWER_BLOCK = 'template_question_answer_block',
  AD_BLOCK = 'template_ad_block',
}

export enum L {
  BASIC = 'basic',
  CONTENT = 'content',
}

export const LandingDialogRP = {  // Dùng ở report (landing page More Info bật dialog)
  row: (label: string, value: string) => `
    <div class="landing-info-row">
      <span class="landing-info-label">${label}</span>
      <span class="landing-info-value">${value}</span>
    </div>`,

  section: (title: string, content: string) => `
    <div class="landing-info-section">
      <div class="landing-info-section-title">${title}</div>
      <div class="landing-info-content-box">${content}</div>
    </div>`,

  container: (gridHtml: string, sectionsHtml: string) => `
    <div class="landing-info-container scroll-thin-custom">
      <div class="landing-info-grid">${gridHtml}</div>
      ${sectionsHtml}
    </div>`,
}