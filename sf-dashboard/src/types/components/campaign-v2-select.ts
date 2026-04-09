import { DUPLICATE_TYPE } from '@/enum/campaign'
import { SelectOption } from 'naive-ui'

export const cloneModeOptions: SelectOption[] = [
  {
    label: 'Duplicate',
    value: DUPLICATE_TYPE.DUPLICATE,
    note: 'Create a new campaign with all the settings and creatives of the original campaign (create new ads).',
    //duplicate thường, tạo ad mới,...
  },
  {
    label: 'Duplicate keep link',
    value: DUPLICATE_TYPE.DUPLICATE_KEEP_LINK,
    note: 'Create a new campaign with all the settings of the original campaign and reuse the original campaign’s post for the ads (do not create new ads).',
    // dup keep link, giữ nguyên link, giữ kwset, landing page,...
  },
  {
    label: 'Duplicate by bot',
    value: DUPLICATE_TYPE.BOT,
    note: 'Automatically duplicates an existing campaign with all original settings and creates new ads in another Google Ads account, keeping the same structure and strategy.',
    //giống hệt keep link khác mỗi đổi đc account supply, camp sẽ tự tạo bằng bot
  },
]
