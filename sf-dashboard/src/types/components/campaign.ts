export interface quizConfig {
  subtitle_quiz?: string
  question?: string
  bgColor?: string
  bgQuizColor?: string
  txtColor?: string
  answerBgColor?: string
  hoverAnswerColor?: string
  question_quiz: quizConfigItem[]
  lineStep1Color?: string
  lineStep2Color?: string
}

export const defaultQuizConfig = () => {
  return {
    bgColor: 'rgb(51, 150, 255)',
    bgQuizColor: '#fff',
    txtColor: '#fff',
    answerBgColor: '#3d49f5',
    hoverAnswerColor: '#0003af',
    lineStep1Color: '#0050b9',
    lineStep2Color: '#97faff',
    question_quiz: [defaultNewQuestion()],
  } as quizConfig
}

export const defaultNewAnswer = () => {
  return {
    title: '',
    result: true,
  } as quizConfigItem
}

export const defaultNewQuestion = () => {
  return {
    title: '',
    answers: [defaultNewAnswer()],
  } as quizConfigItem
}

export interface quizConfigItem {
  title: string
  result?: boolean
  answers?: quizConfigItem[]
}

export interface shortcutWidget {
  listButton?: shortcutWidgetListButton[]
  button?: shortcutWidgetListButton[]
  collapseContent?: shortcutWidgetListButton[]
  slider?: shortcutWidgetListButton[]
  ads?: shortcutWidgetListButton[]
}

export interface baseColor {
  txtColor?: string
  bgColor?: string
  hoverColor?: string
}
export interface shortcutWidgetListButton extends baseColor {
  id: string
  label?: string
  child: shortcutWidgetChild[]
  icon?: shortcutWidgetIcon
  smallDescription?: string
  href?: string
}

export interface shortcutWidgetChild {
  label?: string
  href?: string
  title?: string
  content?: string
  img?: string
}

export interface shortcutWidgetIcon {
  html: string
  position: string
}

export interface landing_on_delete {
  idLanding: string
}

// export interface campaignTypeV2 {
//   id?: number;
// }

export interface campaignType {
  account?: string
  // account_demand_id?: number;
  account_supply_id?: number
  ad_title?: string
  ad_groups?: adGroups[]
  bidding?: string
  bidding_status?: boolean
  budget?: number
  category_id?: number
  category_id_mgid?: number
  channel_brightcast?: string
  cpc?: number
  ads_campaign?: number
  ads_adgroup?: number
  creative?: {
    id: number
    ads?: number
    name?: string
    type?: string
  }
  demand_source?: string
  device?: string[]
  exclude_adblock?: string
  fixed_title?: string
  gd?: string
  id?: number
  impact_placements?: string
  inventories?: inventory[]
  keywords?: any
  keywords_gg_search?: string
  keyword_plan?: string
  landing_pages: {
    id?: number
    cvr?: number
    keywords?: string
    main_keyword?: string
    name?: string
    slug?: string
  }
  keyword_set_id?: number
  language?: any
  location: {
    value?: string[]
    type?: string
  }
  estimated_rpc?: number
  pricingRule?: number
  main_keyword?: string
  msn_exclusively?: string
  name?: string
  origin_name?: string
  placement_type?: string
  placements?: string[]
  placement?: string
  query?: string
  status?: string
  direct_link?: string
  targeting_active_view?: string
  targeting_adformat?: string[]
  traffic_source?: string
  traffic_source_id?: string
  type?: string
  user_flow?: string
  user_id?: number
  vertical?: string
  delivery_type?: string
  creative_type?: string
  create_campaign?: string
  url?: string
  link_ads?: string
  layout?: number
  gender?: string
  age_groups?: string[]
  comment_disabled?: boolean
  video_download_disabled?: boolean
  share_disabled?: boolean
  domain?: string
  schedule?: {
    type: string
    //value for taboola
    value?: scheduleItem[]
    //for tiktok
    dayparting?: string
  }
  optimization_goal?: string
  budget_optimize_on?: string
  pixels?: string[]
  triggers?: string[]
  goals?: string
  keyword_ab_test?: boolean
  limit_page_view?: number
  tiktok_pixel?: number
  optimization_event?: string | null
  clone_by_id?: number
  user?: UserInfo | null
  search_to_search?: string | null
  profit_rt?: number | null
  label?: number | null
  search_network?: boolean
  display_network?: boolean
  ad_formats?: {
    [key: string]: {
      status: 'on' | 'off'
      floor_price: number
      dialog?: { [key: string]: any }
    }
  }
  secondary_keyword?: string
  creative_id?: number
  campaign_type?: string
  audience?: number
}

interface UserInfo {
  id: number
  email: string
}

interface inventory {
  inventory: string
  id: number
  type: string
}

export interface adGroups {
  ad_creative: any[]
  budget: number
  cpc: number
  id: number
  status: string
  tiktok_pixel: number
  optimization_event: string
}

export interface scheduleItem {
  type: string
  day: string
  from_hour: number
  until_hour: number
}

export interface copyCampaign {
  type: string
  time?: number
  traffic_source?: string
  start_date?: string
  end_date: string
}

export interface aiLog {
  id?: number
  campaign_id?: string
  decision_timestamp?: string
  action_type?: string
  old_value?: string | number
  new_value?: string | number
  reasoning?: string
  confidence_score?: number
  context_data?: string
  ai_response?: string
  executed?: string
  execution_timestamp?: string
  execution_error?: string
  performance_tracked?: number
}
