import JobPostingCard from '@/components/landing_page/template/JobPostingCard.vue'
import PriceOfferCard from '@/components/landing_page/template/PriceOfferCard.vue'
import ButtonBlock from '@/components/landing_page/template/ButtonBlock.vue'
import AppDownloadCard from '@/components/landing_page/template/AppDownloadCard.vue'
import PromoCarouselCard from '@/components/landing_page/template/PromoCarouselCard.vue'
import QuestionAnswerBlock from '@/components/landing_page/template/QuestionAnswerBlock.vue'
import AdBlock from '@/components/landing_page/template/AdBlock.vue'
import { CB } from '@/enum/landing'

export const useBlockRenderer = () => {
  const BlockRenderer = defineComponent({
    props: {
      template: String,
      items: {
        type: Object,
        default: () => ({}),
      },
      blockData: {
        type: Object,
        default: () => ({}),
      },
      blockClass: String,
    },
    setup(props) {
      const components: Record<string, Component> = {
        [CB.JOB_POSTING_CARD]: JobPostingCard,
        [CB.PRICE_OFFER_CARD]: PriceOfferCard,
        [CB.BUTTON_BLOCK]: ButtonBlock,
        [CB.APP_DOWNLOAD_CARD]: AppDownloadCard,
        [CB.PROMO_CAROUSEL_CARD]: PromoCarouselCard,
        [CB.QUESTION_ANSWER_BLOCK]: QuestionAnswerBlock,
        [CB.AD_BLOCK]: AdBlock,
      }

      const getComponentProps = (template: string) => {
        const baseProps = { class: props.blockClass }

        const propMappings: Record<string, any> = {
          // trường hợp là []
          [CB.BUTTON_BLOCK]: { buttonBlocks: props.blockData || [] },
          [CB.APP_DOWNLOAD_CARD]: { appDownloadCard: props.blockData || [] },
          [CB.PROMO_CAROUSEL_CARD]: { carouselBlocks: props.blockData || [] },
          [CB.QUESTION_ANSWER_BLOCK]: { questionBlocks: props.blockData || [] },
          [CB.AD_BLOCK]: { adBlocks: props.blockData || [] },

          // trường hợp là object items
          [CB.JOB_POSTING_CARD]: props.items,
          [CB.PRICE_OFFER_CARD]: props.items,
        }

        return {
          ...baseProps,
          ...(propMappings[template] || props.items),
        }
      }

      return () => {
        if (!props.template || !components[props.template]) {
          return null
        }

        const componentProps = getComponentProps(props.template)

        return h('div', { class: 'block-renderer' }, [
          h(components[props.template], componentProps),
        ])
      }
    },
  })

  return { BlockRenderer }
}
