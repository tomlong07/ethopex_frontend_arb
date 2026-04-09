import { ctr_campaign } from '@/services/ctr_campaign'
import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'

export default {
  async cloneAction(
    id: number,
    message: MessageApiInjection,
    traffic_source: string = '',
    name: string = 'this'
  ) {
    const confirm = window.confirm(
      `Are you sure you want to clone ${name} campaign?`
    )
    if (confirm) {
      const result = await ctr_campaign.CloneCampaign({ id: id })
      if (result?.status) {
        message.success('Clone campaign successfully')

        //truyền traffic_source vào để mở tab mới khi clone campaign thành công
        if (traffic_source) {
          if (result?.data) {
            window.open(`/campaign/${traffic_source}/${result.data}`, '_blank')
          }
        }
      }
      return
    }
    message.info('Action clone campaign is canceled')
  },

  async cloneActionV2(
    id: number,
    message: MessageApiInjection,
    traffic_source: string = '',
    name: string = 'this',
    url: string = ''
  ) {
    const confirm = window.confirm(
      `Are you sure you want to clone ${name} campaign?`
    )
    if (confirm) {
      const result = await ctr_campaign.CloneCampaignV2(url, { id: id })
      if (result?.status) {
        message.success('Clone campaign successfully')

        //truyền traffic_source vào để mở tab mới khi clone campaign thành công
        if (traffic_source) {
          if (result?.data) {
            window.open(`/campaign/${traffic_source}/${result.data}`, '_blank')
          }
        }
      }
      return
    }
    message.info('Action clone campaign is canceled')
  },
}
