// constants/codeBlocks.ts
import { CB } from '@/enum/landing'

export const CODE_BLOCK = {
  [CB.JOB_POSTING_CARD]: {
    title: 'Job Posting Card',
    description: 'This is an example of a code block with syntax highlighting.',
    timePosted: '1 day ago',
    jobType: 'Full-time',
    amount: '$3000',
    imageUrl:
      'https://arb-ul.pubpowerplatform.io/data/image/thumb_abb1a5e77acbb504ecf9d3eaddde02ee.png',
    buttonText: 'Apply Now',
    buttonUrl: '#',
  },
  [CB.PRICE_OFFER_CARD]: {
    title: 'Price Offer Card',
    description: 'This is an example of a code block with syntax highlighting.',
    amount: '$3000',
    company: 'Company Name',
    buttonText: 'Book Now',
    buttonUrl: '#',
  },
  [CB.BUTTON_BLOCK]: {
    buttonText: 'Button Block',
    buttonUrl: '#',
    buttonColor: '#0D5C14',
    buttonTextColor: '#FFFFFFFF',
    configReward: 'on',
  },
  [CB.APP_DOWNLOAD_CARD]: {
    heading: 'App Download Card',
    subHeading: 'Example 4',
    textRating: '5,0 (1,9 million reviews)',
    textDownload: 'Over 50 million downloads',
    textUse: '50 million',
    imageUrl:
      'https://arb-ul.pubpowerplatform.io/data/image/thumb_abb1a5e77acbb504ecf9d3eaddde02ee.png',
    buttonUrl: '#',
    buttonText: 'DOWNLOAD ON PLAYSTORE',
    buttonColor: '#10b981',
    configReward: 'on',
  },
  [CB.PROMO_CAROUSEL_CARD]: {
    imageUrl:
      'https://arb-ul.pubpowerplatform.io/data/image/thumb_772c01bb1fb1ae8c7257fee8f059e80e.jpg',
    title: 'Promo Carousel Card',
    description:
      'New cardholders can capitalize on a generous welcome bonus, instantly boosting their cash back earnings.',
  },
  [CB.QUESTION_ANSWER_BLOCK]: {
    question: 'How does this application work?',
    answer:
      'The application analyzes your input data to provide useful insights and recommendations.',
  },
  [CB.AD_BLOCK]: {
    adMode: 'gam',
    adType: 'banner',
  },
}