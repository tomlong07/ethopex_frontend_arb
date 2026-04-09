import { NTag, SelectOption } from 'naive-ui'
import { NEllipsis, NTooltip } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import { FBAdTypeOptions } from '@/options/creative'

const findName = (value: any) => {
  const option = FBAdTypeOptions.find((item) => item.value === value)
  return option ? option.label : value
}

export const RenderLabel = (option: SelectOption, isRenderAdType?: boolean) => {
  return option.name && (option.ads || option.ads === 0)
    ? h('div', { class: 'flex w-full items-center gap-2' }, [
        h(NTooltip, null, {
          trigger: () =>
            h(
              'span',
              { style: `max-width: ${isRenderAdType ? '75' : '90'}%` },
              [
                h(NEllipsis, null, {
                  default: () =>
                    h('div', {
                      innerHTML: `${
                        (option.name as any).match(/^\d/)
                          ? option.name
                          : `${option.id}: ${option.name}`
                      }`,
                    }),
                }),
              ]
            ),
          default: () => option.name,
        }),
        h('div', {
          class: 'italic ml-auto text-xs text-gray-500',
          innerHTML:
            (isRenderAdType
              ? `<span class="mr-2">${findName(option.ad_type)}</span>`
              : '') + `${option.ads} ads`,
        }),
      ])
    : ''
}

export const fetchCreativeNew = async (
  ts: string,
  opts: { q?: string; notfound?: string; id?: string; info?: string } = {
    q: '',
  },
  type?: string
) => {
  if (!ts) return []
  let options: { [key: string]: any } = {
    id: opts.id,
    q: opts.q,
    ts: ts,
    type: type,
    info: opts?.info,
    nf: opts.notfound || '',
  }

  const result = await ctr_creative.GetAllCreative({
    params: options,
  })
  return result?.data?.creatives || []
}

export const renderTag = (
  props: {
    option: SelectOption
    handleClose: () => void
  },
  closable: boolean
) => {
  return h(
    NTag,
    {
      closable: closable,
      onClose: closable ? props.handleClose : undefined,
    },
    {
      default: () => props.option.name,
    }
  )
}
