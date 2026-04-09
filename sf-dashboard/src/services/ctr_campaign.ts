import api_v2 from '@/core/api_v2'

export const ctr_campaign = {
  ChangeStatus: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/change-status',
      data: payload,
      timeout: 120000,
    })

    return result || {}
  },

  BulkChangeStatus: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaigns/change-status',
      data: payload,
    })
    return result || {}
  },

  BulkAppendNameCampaigns: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaigns/append-name',
      data: payload,
    })
    return result || {}
  },

  GetByID: async (id: number) => {
    if (!id) return {}

    if (window.arb.debug) {
      return {
        status: true,
        data: {
          id: 237357,
          ad_top: 0,
          ad_bottom: 0,
          position_status: '',
          name: '237357: Facebook -> US - Google - Test Campaign facebook 1770105603 by admin@interdog.com123',
          origin_name:
            'Test Campaign facebook 1770105603 by admin@interdog.com123',
          status: 'on',
          ai_status: 'pending',
          traffic_source: 'facebook',
          traffic_source_id: '',
          demand_source: 'adsense',
          user: {
            email: 'admin@interdog.com',
            id: 571,
          },
          campaign_type: '',
          type: 'OUTCOME_SALES',
          group_id: 0,
          creative: {
            id: 0,
            name: '',
            ads: 0,
          },
          vertical: '',
          landing_pages: {
            id: 7126,
            name: 'Blood glucose monitor',
            cvr: 0,
            keywords: '',
            main_keyword: '',
            slug: 'the-benefits-and-importance-of-blood-glucose-monitoring-devices-for-older-adults-7126',
          },
          main_keyword: '',
          channel_brightcast: '',
          gd: '',
          user_flow: '',
          bidding: '',
          cpc: 0,
          budget: 0,
          keywords: '',
          language: null,
          location: {
            value: null,
          },
          budget_type: {
            value: null,
          },
          device: null,
          keyword_set_id: 5,
          keywords_gg_search: '',
          keyword_plan: '',
          account: 'dfd7fb82-4745-11f0-a4ea-1e8dd630d8f8',
          account_supply_id: 63599,
          account_adsense: '',
          account_demand_id: 0,
          operating_systems: null,
          terms: '',
          fixed_title: '',
          msn_exclusively: 'off',
          impact_placements: 'off',
          exclude_adblock: 'off',
          schedule: {
            type: '',
            value: null,
            google: null,
            dayparting: '',
            time_zone_type: '',
          },
          query: '',
          category_id: 0,
          placement: '',
          targeting_adformat: [],
          targeting_active_view: '',
          inventories: [],
          url: '',
          url_backup: '',
          link_ads: '',
          delivery_type: '',
          delivery_status: '',
          delivery_status_reasons: '',
          ad_groups: [
            {
              id: 383034,
              name: 'Test Ad Group 1770105603 by admin@interdog.com',
              campaign_id: 237357,
              ad_group_id: '',
              status: 'on',
              delivery_status: 'pending',
              delivery_status_reasons: '',
              budget: 2,
              bidding: 'DAILY_BUDGET',
              bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
              cost_per_result: 0,
              url_parameters: 'redirect_id=237357',
              device: ['desktop'],
              language: ['en'],
              location: {
                value: ['US'],
              },
              gender: 'genderAll',
              age_groups: ['min_18', 'max_65'],
              placement_type: 'advantage',
              schedule: {
                type: '',
                value: null,
                google: null,
                dayparting: '',
                time_zone_type: '',
              },
              audience_type: 'manual',
              conversion_location: 'website',
              performance_goal: 'OFFSITE_CONVERSIONS',
              pixel: '521013567605419',
              error: '',
              placement_platform: null,
              facebook_positions: null,
              instagram_positions: null,
              messenger_positions: null,
              threads_positions: null,
              audience_network_positions: null,
              start_date: '',
              end_date: '',
              ad_creative: [
                {
                  id: 1631227,
                  name: 'Roofing - US 123',
                  creative_id: 10434,
                  ad_id: '',
                  landing_page_id: 0,
                  ad_setup: 'create_ad',
                  status: 'on',
                  delivery_status: 'pending',
                  ai_status: 'pending',
                  status_link: 'pending',
                  delivery_status_reasons: '',
                  fanpage: '100219273107059',
                  error: '',
                  call_to_action: '',
                  url: '',
                  creative_features_spec: null,
                  // creative_features_spec: {
                  //   image_touchups: {
                  //     enroll_status: 'OPT_IN',
                  //   },
                  //   image_templates: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   image_animations: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   enhance_cta: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   text_optimizations: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   flex_media: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   image_music: {
                  //     enroll_status: 'OPT_IN',
                  //   },
                  // },
                  recommendations: null,
                },
                {
                  id: 1631228,
                  name: 'Test Exists',
                  ad_id: '',
                  landing_page_id: 0,
                  ad_setup: 'use_existing_post',
                  status: 'on',
                  delivery_status: 'pending',
                  ai_status: 'pending',
                  status_link: 'pending',
                  delivery_status_reasons: '',
                  fanpage: '100219273107059',
                  post_id: '311847955273615',
                  error: '',
                  call_to_action: '',
                  url: '',
                  creative_features_spec: null,
                  recommendations: null,
                },
              ],
              creatives: [],
              interest: null,
              click_through: 7,
              engaged_view: 1,
              view_through: 1,
              conversion_event: 'SEARCH',
              payload: '',
              is_disabled: false,
              attribution: '',
              beneficiary: '',
              frequency_caps: null,
              recommendations: null,
            },
          ],
          ads_campaign: 0,
          ads_adgroup: 0,
          creative_campaign: 0,
          create_campaign: 'api',
          gender: '',
          age_groups: [],
          placements: null,
          placement_type: '',
          comment_disabled: false,
          video_download_disabled: false,
          share_disabled: false,
          estimated_rpc: 0,
          optimization_goal: '',
          domain: '',
          layout: 0,
          budget_optimize_on: '',
          direct_link: 'on',
          goals: 'lead',
          search_to_search: '',
          keyword_ab_test: false,
          keyword_optimize: false,
          limit_page_view: 0,
          triggers: [],
          pixels: [],
          clone_by_id: 0,
          label: 0,
          search_network: false,
          display_network: false,
          ad_formats: {
            display: {
              status: 'on',
              floor_price: 0,
              type: 'banner',
            },
            anchor: {
              status: 'off',
              floor_price: 0,
            },
            rewarded: {
              status: 'off',
              floor_price: 0,
              dialog: {},
            },
            interstitial: {
              status: 'off',
              floor_price: 0,
            },
            unlock_content: {
              status: 'off',
              floor_price: 0,
              type: 'default',
              dialog: {
                time_update: 1770105611,
              },
            },
          },
          pricingRule: 0,
          secondary_keyword: '',
          ai_keyword: '',
          buying_type: 'AUCTION',
          advantage_campaign_budget: 'off',
          conversion_goals: '',
          categories: [],
          audience: 0,
          snapchat_audience: {
            pre_audience: null,
            audience: null,
          },
          broad_match_keyword: '',
          campaign_setup: 'manual',
          bid_strategy: '',
          create_error: '',
          min_epc: 0,
          conversion_logic: '',
          snap_pixel: '',
          conversion_event: '',
          prelanding: 'off',
          prelanding_domain: '',
          prelander_landing: 0,
          category_site_builder: '',
          category_site_builder_id: 0,
          keyword_macro: '',
          landing_page_by_creative: 'off',
          payload: '',
          start_date: '',
          end_date: '',
          optimize_with_AI_max: '',
          amxt: '',
          is_multiple_creative: false,
          tags: [],
          filters: {},
          ab_test_domain: 'off',
          recommendations: null,
          related_search_ad: '',
          keyword_manager: {
            domain: '',
            keywords_campaign: [],
          },
        },
      }
    }

    const result = await api_v2.request({
      url: 'campaign/get-by-id',
      params: { id: id },
    })

    return result || {}
  },

  Duplicate: async (id: number) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: {
          id: 0,
          ad_top: 0,
          ad_bottom: 0,
          position_status: '',
          name: '237357: Facebook -> US - Google - Test Campaign facebook 1770105603 by admin@interdog.com123',
          origin_name:
            'Test Campaign facebook 1770105603 by admin@interdog.com123',
          status: 'on',
          ai_status: 'pending',
          traffic_source: 'facebook',
          traffic_source_id: '',
          demand_source: 'adsense',
          user: {
            email: 'admin@interdog.com',
            id: 571,
          },
          campaign_type: '',
          type: 'OUTCOME_SALES',
          group_id: 0,
          creative: {
            id: 0,
            name: '',
            ads: 0,
          },
          vertical: '',
          landing_pages: {
            id: 7126,
            name: 'Blood glucose monitor',
            cvr: 0,
            keywords: '',
            main_keyword: '',
            slug: 'the-benefits-and-importance-of-blood-glucose-monitoring-devices-for-older-adults-7126',
          },
          main_keyword: '',
          channel_brightcast: '',
          gd: '',
          user_flow: '',
          bidding: '',
          cpc: 0,
          budget: 0,
          keywords: '',
          language: null,
          location: {
            value: null,
          },
          budget_type: {
            value: null,
          },
          device: null,
          keyword_set_id: 5,
          keywords_gg_search: '',
          keyword_plan: '',
          account: '',
          account_supply_id: 63599,
          account_adsense: '',
          account_demand_id: 0,
          operating_systems: null,
          terms: '',
          fixed_title: '',
          msn_exclusively: 'off',
          impact_placements: 'off',
          exclude_adblock: 'off',
          schedule: {
            type: '',
            value: null,
            google: null,
            dayparting: '',
            time_zone_type: '',
          },
          query: '',
          category_id: 0,
          placement: '',
          targeting_adformat: [],
          targeting_active_view: '',
          inventories: [],
          url: '',
          url_backup: '',
          link_ads: '',
          delivery_type: '',
          delivery_status: '',
          delivery_status_reasons: '',
          ad_groups: [
            {
              id: 0,
              name: 'Test Ad Group 1770105603 by admin@interdog.com',
              campaign_id: 0,
              ad_group_id: '',
              status: 'on',
              delivery_status: 'pending',
              delivery_status_reasons: '',
              budget: 2,
              bidding: 'DAILY_BUDGET',
              bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
              cost_per_result: 0,
              url_parameters: '',
              device: ['desktop'],
              language: ['en'],
              location: {
                value: ['US'],
              },
              gender: 'genderAll',
              age_groups: ['min_18', 'max_65'],
              placement_type: 'advantage',
              schedule: {
                type: '',
                value: null,
                google: null,
                dayparting: '',
                time_zone_type: '',
              },
              audience_type: 'manual',
              conversion_location: 'website',
              performance_goal: 'OFFSITE_CONVERSIONS',
              pixel: '521013567605419',
              error: '',
              placement_platform: null,
              facebook_positions: null,
              instagram_positions: null,
              messenger_positions: null,
              threads_positions: null,
              audience_network_positions: null,
              start_date: '',
              end_date: '',
              ad_creative: [
                {
                  id: 0,
                  name: 'Roofing - US',
                  creative_id: 10434,
                  ad_id: '',
                  landing_page_id: 0,
                  ad_setup: 'create_ad',
                  status: 'on',
                  delivery_status: 'pending',
                  ai_status: 'pending',
                  status_link: 'pending',
                  delivery_status_reasons: '',
                  fanpage: '100219273107059',
                  error: '',
                  call_to_action: '',
                  url: '',
                  creative_features_spec: null,
                  // creative_features_spec: {
                  //   image_touchups: {
                  //     enroll_status: 'OPT_IN',
                  //   },
                  //   image_templates: {
                  //     enroll_status: 'OPT_IN',
                  //   },
                  //   image_animations: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   enhance_cta: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   text_optimizations: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   flex_media: {
                  //     enroll_status: 'OPT_OUT',
                  //   },
                  //   image_music: {
                  //     enroll_status: 'OPT_IN',
                  //   },
                  // },
                  recommendations: null,
                },
                {
                  id: 0,
                  name: 'Test Exists',
                  ad_id: '',
                  landing_page_id: 0,
                  ad_setup: 'use_existing_post',
                  status: 'on',
                  delivery_status: 'pending',
                  ai_status: 'pending',
                  status_link: 'pending',
                  delivery_status_reasons: '',
                  fanpage: '100219273107059',
                  post_id: '311847955273615',
                  error: '',
                  call_to_action: '',
                  url: '',
                  creative_features_spec: null,
                  recommendations: null,
                },
              ],
              creatives: [],
              interest: null,
              click_through: 7,
              engaged_view: 1,
              view_through: 1,
              conversion_event: 'SEARCH',
              payload: '',
              is_disabled: false,
              attribution: '',
              beneficiary: '',
              frequency_caps: null,
              recommendations: null,
            },
          ],
          ads_campaign: 0,
          ads_adgroup: 0,
          creative_campaign: 0,
          create_campaign: 'api',
          gender: '',
          age_groups: [],
          placements: null,
          placement_type: '',
          comment_disabled: false,
          video_download_disabled: false,
          share_disabled: false,
          estimated_rpc: 0,
          optimization_goal: '',
          domain: '',
          layout: 0,
          budget_optimize_on: '',
          direct_link: 'on',
          goals: 'lead',
          search_to_search: '',
          keyword_ab_test: false,
          keyword_optimize: false,
          limit_page_view: 0,
          triggers: [],
          pixels: [],
          clone_by_id: 0,
          label: 0,
          search_network: false,
          display_network: false,
          ad_formats: {
            display: {
              status: 'on',
              floor_price: 0,
              type: 'banner',
            },
            anchor: {
              status: 'off',
              floor_price: 0,
            },
            rewarded: {
              status: 'off',
              floor_price: 0,
              dialog: {},
            },
            interstitial: {
              status: 'off',
              floor_price: 0,
            },
            unlock_content: {
              status: 'off',
              floor_price: 0,
              type: 'default',
              dialog: {
                time_update: 1770105611,
              },
            },
          },
          pricingRule: 0,
          secondary_keyword: '',
          ai_keyword: '',
          buying_type: 'AUCTION',
          advantage_campaign_budget: 'off',
          conversion_goals: '',
          categories: [],
          audience: 0,
          snapchat_audience: {
            pre_audience: null,
            audience: null,
          },
          broad_match_keyword: '',
          campaign_setup: 'manual',
          bid_strategy: '',
          create_error: '',
          min_epc: 0,
          conversion_logic: '',
          snap_pixel: '',
          conversion_event: '',
          prelanding: 'off',
          prelanding_domain: '',
          prelander_landing: 0,
          category_site_builder: '',
          category_site_builder_id: 0,
          keyword_macro: '',
          landing_page_by_creative: 'off',
          payload: '',
          start_date: '',
          end_date: '',
          optimize_with_AI_max: '',
          amxt: '',
          is_multiple_creative: false,
          tags: [],
          filters: {},
          ab_test_domain: 'off',
          recommendations: null,
          related_search_ad: '',
          keyword_manager: {
            domain: '',
            keywords_campaign: [],
          },
        },
      }
    }
    const result = await api_v2.request({ url: `campaign/duplicate/${id}` })
    return result || {}
  },

  AddCampaign: async (payload: any) => {
    const result = await api_v2.request({ url: 'campaign/add', data: payload })
    return result || {}
  },

  EditCampaign: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/edit',
      data: payload,
    })
    return result || {}
  },

  GetAdsByID: async (id: number) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: {
          id: 1987270,
          user_id: 0,
          type: 'performance_max',
          ad_type: '',
          name: 'Ghế massage người cao tuổi - Hàn - 17660376220',
          display_path: '["",""]',
          site_name: '',
          site_icon: '/assets/img/thumb_da200eb515c2d232b2b9bc36999b35e0.jpg',
          site_link: '["","","",""]',
          display_link: '',
          headline: '',
          status: 'on',
          site_name_status: '',
          info_image: '',
          size: '',
          create_by: '',
          created_at: '0001-01-01T00:00:00Z',
          deleted_at: null,
          titles: [
            {
              id: 0,
              creative_id: 0,
              title:
                '["노년층을 위한 편안한 의자","발과 허리 피로를 풀어주는","안심하고 쓰는 시니어 마사지"]',
              description:
                '["노년층의 몸 상태에 맞춘 설계로 무리 없이 사용할 수 있어 건강 관리에 도움을 줍니다.","집에서 편안하게 전문 마사지와 같은 효과를 누려보세요.","근육 뭉침과 통증을 부드럽게 케어하여 일상을 더 편안하게 만들어 드립니다."]',
              short_description:
                '안마의자의 기본 구조와 활용 방식에 대한 일반적 설명입니다.',
              long_headline:
                '["나이가 들수록 편안함이 필요한 몸, 집에서 즐기는 부드러운 마사지 의자","허리와 다리 통증 완화를 돕고, 부담 없이 사용할 수 있는 시니어 맞춤 의자","장시간 사용해도 편안한 디자인, 매일 건강을 챙기는 마사지 습관"]',
              primary_text: '',
              angle: '',
              angle_strategy: '',
              status: 'on',
            },
          ],
          images: [
            {
              id: 0,
              creative_id: 0,
              image: '/data/image/thumb_07d531a719af8424975e6ec4d31b6904.jpg',
              thumb: '',
              status: '',
              primary_text: '',
              headline: '',
              description: '',
              website_url: '',
              image_ratio:
                '[{"coordinates":{"x":0,"y":0,"scaleX":0,"scaleY":0,"width":800,"height":800},"image":"/data/image/thumb_b205fa4e883c00398421a453552b66a2.jpg","ratio":"1:1","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":175,"scaleX":0,"scaleY":0,"width":800,"height":450},"image":"/data/image/thumb_8190c540383ffe1fe15ac21903531c91.jpg","ratio":"16:9","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":80,"y":0,"scaleX":0,"scaleY":0,"width":640,"height":800},"image":"/data/image/thumb_cb2a87e093118f534a99e59cf190769e.jpg","ratio":"4:5","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":280,"scaleX":0,"scaleY":0,"width":800,"height":418},"image":"/data/image/thumb_caf25ce139bc0c7da8f51fc34462a533.jpg","ratio":"1.91:1","off":false,"change":false,"by_ai":false,"zoom":0}]',
              text_voice: '',
              content_safety: '',
              rule_violated: '',
              log: '',
            },
            {
              id: 0,
              creative_id: 0,
              image: '/data/image/thumb_38753e2a67621e96c5059cfa4a0f6c2c.jpg',
              thumb: '',
              status: '',
              primary_text: '',
              headline: '',
              description: '',
              website_url: '',
              image_ratio:
                '[{"coordinates":{"x":0,"y":0,"scaleX":0,"scaleY":0,"width":800,"height":800},"image":"/data/image/thumb_0a933e446e963b9fca485ce92032c88a.jpg","ratio":"1:1","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":233,"scaleX":0,"scaleY":0,"width":800,"height":450},"image":"/data/image/thumb_98b67c54980026093ced1d5b3f6ff273.jpg","ratio":"16:9","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":80,"y":0,"scaleX":0,"scaleY":0,"width":640,"height":800},"image":"/data/image/thumb_504bac7809c4991bf663a8ed4f45b02e.jpg","ratio":"4:5","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":232,"scaleX":0,"scaleY":0,"width":800,"height":418},"image":"/data/image/thumb_94f45b54d725a13835f986b7320f9a54.jpg","ratio":"1.91:1","off":false,"change":false,"by_ai":false,"zoom":0}]',
              text_voice: '',
              content_safety: '',
              rule_violated: '',
              log: '',
            },
            {
              id: 0,
              creative_id: 0,
              image: '/data/image/thumb_a6ce4d5333933fd182e0738e294fb181.jpg',
              thumb: '',
              status: '',
              primary_text: '',
              headline: '',
              description: '',
              website_url: '',
              image_ratio:
                '[{"coordinates":{"x":0,"y":0,"scaleX":0,"scaleY":0,"width":800,"height":800},"image":"/data/image/thumb_24fb015b8cdae27726ade01a1a8911b0.jpg","ratio":"1:1","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":175,"scaleX":0,"scaleY":0,"width":800,"height":450},"image":"/data/image/thumb_4ed4ec340eca16108b9d0cb986c88ef9.jpg","ratio":"16:9","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":80,"y":0,"scaleX":0,"scaleY":0,"width":640,"height":800},"image":"/data/image/thumb_44a33e89b2917f15704c35c79d3d5349.jpg","ratio":"4:5","off":false,"change":false,"by_ai":false,"zoom":0},{"coordinates":{"x":0,"y":190,"scaleX":0,"scaleY":0,"width":800,"height":418},"image":"/data/image/thumb_dd672236c01f2f7524121f1d79ebb53e.jpg","ratio":"1.91:1","off":false,"change":false,"by_ai":false,"zoom":0}]',
              text_voice: '',
              content_safety: '',
              rule_violated: '',
              log: '',
            },
          ],
          creative_media: 0,
          call_to_action: '',
          creative_features_spec: '',
          ai_verify: {
            id: '',
            usage: {
              input_tokens: 0,
              input_tokens_details: {
                cached_tokens: 0,
              },
              output_tokens: 0,
              total_tokens: 0,
              cost: 0,
            },
            creative_id: '1987270',
            compliance_status: 'yes',
            content_consistency: 'Passed',
            contents: [],
            landing_page: '',
            total_request: 0,
            request_different_model: 0,
          },
          input_verify: [
            {
              creative_id: '1987270_image_1',
              creative_content:
                'The image shows a black massage chair in a well-lit living room. The chair is the central subject, positioned in the foreground on a rug over a wooden floor. In the background, there is a light-colored sofa, a wooden coffee table with a book on it, a floor lamp, a potted plant, and a framed picture on the wall. No spoken words are present.',
              creative_content_type: 'Image Summary',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_image_2',
              creative_content:
                'The image shows a brown, cushioned massage chair in a sunlit room with a large window. The chair is positioned on a rug on a wooden floor. In the background, there is a potted plant and a sheer curtain. No spoken words are present.',
              creative_content_type: 'Image Summary',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_image_3',
              creative_content:
                'The image shows a dark gray massage chair in the center of the frame. The chair is located in a modern-looking room with dark, reflective floors and blue ambient lighting along counters and architectural features in the background. The chair is made of a padded, leather-like material. Text is visible on the footrest of the chair. No spoken words are present.',
              creative_content_type: 'Image Summary',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_1',
              creative_content: '노년층을 위한 편안한 의자',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_10',
              creative_content:
                '장시간 사용해도 편안한 디자인, 매일 건강을 챙기는 마사지 습관',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_2',
              creative_content: '발과 허리 피로를 풀어주는',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_3',
              creative_content: '안심하고 쓰는 시니어 마사지',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_4',
              creative_content:
                '노년층의 몸 상태에 맞춘 설계로 무리 없이 사용할 수 있어 건강 관리에 도움을 줍니다.',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_5',
              creative_content:
                '집에서 편안하게 전문 마사지와 같은 효과를 누려보세요.',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_6',
              creative_content:
                '근육 뭉침과 통증을 부드럽게 케어하여 일상을 더 편안하게 만들어 드립니다.',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_7',
              creative_content:
                '안마의자의 기본 구조와 활용 방식에 대한 일반적 설명입니다.',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_8',
              creative_content:
                '나이가 들수록 편안함이 필요한 몸, 집에서 즐기는 부드러운 마사지 의자',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
            {
              creative_id: '1987270_text_9',
              creative_content:
                '허리와 다리 통증 완화를 돕고, 부담 없이 사용할 수 있는 시니어 맞춤 의자',
              creative_content_type: 'Text',
              retrieved_examples: null,
            },
          ],
          output_verify:
            '[{"creative_id":"1987270_image_1","decision":"PASS","explanation":"","language":"en"},{"creative_id":"1987270_image_2","decision":"PASS","explanation":"","language":"en"},{"creative_id":"1987270_image_3","decision":"PASS","explanation":"","language":"en"},{"creative_id":"1987270_text_1","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_10","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_2","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_3","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_4","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_5","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_6","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_7","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_8","decision":"PASS","explanation":"","language":"ko"},{"creative_id":"1987270_text_9","decision":"PASS","explanation":"","language":"ko"}]',
          verify_manual: '',
          example_verify:
            '[{"creative_id":"1987270_image_1","example":"[{\\"creative_id\\":\\"1645787_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a beige, upholstered recliner chair in a well-lit room with wooden floors. The chair is the central subject, shown in a reclined position with its footrest extended. A control panel is built into the right armrest. In the background, there are potted plants, light-colored curtains, and a wooden cabinet. A circular inset in the bottom-right corner provides a magnified view of the chair\'s control panel. No spoken words are present.\\",\\"similarity\\":80.65,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1868417_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows an indoor setting with a light-colored floor and wall, illuminated by natural light from a window on the right. The main subject is a brown leather recliner chair with a chrome metal frame and rocking base. The chair\'s footrest is extended. A striped pillow rests on the seat. In the background, there is a small wooden side table with a potted succulent on it. No spoken words are present.\\",\\"similarity\\":79.63,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1645786_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a light-colored, padded recliner chair in a well-lit room. The chair is partially reclined and positioned on a gray rug. To the left is a large potted plant, and in the background, there are curtains and a window. A circular inset in the bottom-right corner shows a close-up of the chair\'s control panel, which is located on the right armrest. No spoken words are present.\\",\\"similarity\\":79.45,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1745096_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a furnished room with wooden floors and a gray rug. In the foreground is a dark gray, leather-like recliner chair with its footrest extended. The chair has two cupholders, a control panel on the side of one armrest, and a side pocket containing a magazine. In the background, there is a desk with a computer and a chair, a bookshelf, and a window with curtains. No spoken words are present.\\",\\"similarity\\":78.76,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1745097_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a gray leather recliner chair in a room with dark walls and tiled floors. The chair is positioned in the foreground. In the background, there is a wooden desk with a computer monitor displaying a landscape, a keyboard, and a lit table lamp. The chair has a control panel on its armrest. No spoken words are present.\\",\\"similarity\\":78.61,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}}]"},{"creative_id":"1987270_image_2","example":"[{\\"creative_id\\":\\"1720828_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a person with long, dark hair standing in a brightly lit room. The person is wearing a matching light brown v-neck top and shorts. They are positioned next to a brown massage table, which has several rolled-up towels on it. In the background, there is a window and a cabinet with candles and flowers. No spoken words are present.\\",\\"similarity\\":77.75,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1326590_image_4\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a room with wood-paneled walls and floors, illuminated by warm spotlights and purple accent lighting. Three massage tables, covered in white sheets and pillows, are arranged in the room. Between two of the tables is a small wooden nightstand with a glowing aroma diffuser on it. No spoken words are present.\\",\\"similarity\\":77.52,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1326546_image_4\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows an indoor room with marble-like tiled walls and floor, illuminated by warm recessed ceiling lights and spotlights. In the center is a wooden massage table with a white sheet and folded white towels. Behind the table, a wooden shelf holds several lit candles and a bottle. To the left, a large vase contains tall, dry reeds. No spoken words are present.\\",\\"similarity\\":77.38,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1772496_image_3\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a room with a massage table covered in a white sheet. The room has a stacked stone wall, wood flooring, and warm, recessed lighting. On a wooden shelf behind the table, there are several lit white candles, two light-colored vases, and a rolled white towel. Steam rises from one of the vases. No spoken words are present.\\",\\"similarity\\":77.18,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1720827_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a woman standing in a brightly lit room. She has long, dark hair and is wearing a light brown, short-sleeved v-neck shirt and matching shorts. She is positioned next to a brown massage table. On the table are several rolled-up brown towels. In the background, there is a window and a wooden cabinet with candles and a vase of flowers on it. No spoken words are present.\\",\\"similarity\\":77.07,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}}]"},{"creative_id":"1987270_image_3","example":"[{\\"creative_id\\":\\"1675550_image_1\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"This is a product image showcasing a modern, automated massage chair against a plain white background. The chair features a sleek, futuristic design with cream and brown upholstery, accented with silver trim. It is shown in a reclined position and includes built-in control panels on the armrests. The overall presentation suggests a luxury product focused on comfort and technology.\\",\\"similarity\\":80.42,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1734252_image_4\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a spa or massage room with modern decor. A person wearing a grey, short-sleeved uniform stands beside a massage table, arranging a brown towel on its white sheets. The room features grey tiled walls, warm recessed lighting, and a small pool with a waterfall feature in the foreground. On the right, a glass door leads to a balcony. No spoken words are present.\\",\\"similarity\\":73.41,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1698580_image_3\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image displays the interior of a tranquil room, likely a spa or massage therapy studio. In the center is a massage table covered with a dark grey, plush blanket. The room is softly lit by natural light coming through large windows covered by blinds and draped with light-colored curtains. To the left is a white, rustic-style cabinet with a lamp and other decorative items on top. To the right, there is a small chair with a blue cushion, a console table with a salt lamp, and other decor. The overall ambiance is calm and relaxing, suggesting a space for wellness and relaxation services.\\",\\"similarity\\":72.04,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1326590_image_4\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image shows a room with wood-paneled walls and floors, illuminated by warm spotlights and purple accent lighting. Three massage tables, covered in white sheets and pillows, are arranged in the room. Between two of the tables is a small wooden nightstand with a glowing aroma diffuser on it. No spoken words are present.\\",\\"similarity\\":71.86,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}},{\\"creative_id\\":\\"1698635_image_3\\",\\"creative_content_type\\":\\"Image Summary\\",\\"language\\":\\"en\\",\\"creative_content\\":\\"The image displays the interior of a tranquil and professionally arranged room, likely for massage or spa services. A massage table covered with a soft grey blanket is the central focus. The room is decorated in neutral tones with soft lighting from lamps and natural light filtered through blinds and draped curtains. Other furniture includes a white cabinet, a chair with a blue cushion, and a console table with various decorative items, creating a relaxing atmosphere.\\",\\"similarity\\":71.83,\\"ai_evaluation\\":{\\"decision\\":\\"PASS\\",\\"explanation\\":\\"\\"},\\"human_evaluation\\":{\\"reviewed\\":false,\\"decision\\":\\"\\",\\"explanation\\":\\"\\"},\\"metadata\\":{\\"agreement\\":null}}]"},{"creative_id":"1987270_text_1","example":""},{"creative_id":"1987270_text_10","example":""},{"creative_id":"1987270_text_2","example":""},{"creative_id":"1987270_text_3","example":""},{"creative_id":"1987270_text_4","example":""},{"creative_id":"1987270_text_5","example":""},{"creative_id":"1987270_text_6","example":""},{"creative_id":"1987270_text_7","example":""},{"creative_id":"1987270_text_8","example":""},{"creative_id":"1987270_text_9","example":""}]',
          histories: null,
          reason: '',
          url: 'https://phormato.com/p/sinieoreul-wihan-pyeonanhamgwa-geongangeul-wihan-masaji-ceeo-300123.webm?ad_group_id={adgroupid}&utm_campaign=arb-430050&section_id={placement}&arb_direct=on&click_id={gclid}&ad_id={creative}&arb_campaign_id=430050&gkw={keyword}&arb_ad_id=1987270&utm_source=gg&campaign_id={campaignid}&network=google',
          summaries: [
            {
              media_id: '1987270_image_1',
              url: '/data/image/thumb_07d531a719af8424975e6ec4d31b6904.jpg',
              media_summary:
                'The image shows a black massage chair in a well-lit living room. The chair is the central subject, positioned in the foreground on a rug over a wooden floor. In the background, there is a light-colored sofa, a wooden coffee table with a book on it, a floor lamp, a potted plant, and a framed picture on the wall. No spoken words are present.',
              content_safety: 'Safe',
              rule_violated: '',
              advertising_text: '',
              visual_text: '',
              audio_transcript: '',
            },
            {
              media_id: '1987270_image_2',
              url: '/data/image/thumb_38753e2a67621e96c5059cfa4a0f6c2c.jpg',
              media_summary:
                'The image shows a brown, cushioned massage chair in a sunlit room with a large window. The chair is positioned on a rug on a wooden floor. In the background, there is a potted plant and a sheer curtain. No spoken words are present.',
              content_safety: 'Safe',
              rule_violated: '',
              advertising_text: '',
              visual_text: '',
              audio_transcript: '',
            },
            {
              media_id: '1987270_image_3',
              url: '/data/image/thumb_a6ce4d5333933fd182e0738e294fb181.jpg',
              media_summary:
                'The image shows a dark gray massage chair in the center of the frame. The chair is located in a modern-looking room with dark, reflective floors and blue ambient lighting along counters and architectural features in the background. The chair is made of a padded, leather-like material. Text is visible on the footrest of the chair. No spoken words are present.',
              content_safety: 'Safe',
              rule_violated: '',
              advertising_text: '',
              visual_text: '',
              audio_transcript: '',
            },
          ],
          verify_id: '1766037955_verify_campaign_430050_1987270',
          verify_type: '',
          disable: false,
        },
      }
    }

    const result = await api_v2.request({
      url: '/campaign/ads/' + id,
    })
    return result || {}
  },

  RemoveCampaignV2: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/remove',
      data: payload,
    })
    return result || {}
  },

  AdsByCampaign: async (payload: any) => {
    const result = await api_v2.request({ url: 'campaign/ads', data: payload })
    return result || {}
  },

  CloneCampaign: async (payload: any) => {
    const result = await api_v2.request({
      url: `campaign/clone`,
      data: payload,
    })
    return result || {}
  },

  CloneCampaignV2: async (url: string, payload: any) => {
    const result = await api_v2.request({
      url: url,
      data: payload,
    })
    return result || {}
  },

  ChangeStatusAdsCreative: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/change-status-ads-creative',
      data: payload,
    })
    return result || {}
  },

  APIGetLandingPage: async (params: any) => {
    const result = await api_v2.request({
      url: `campaign/api_get_landingpage`,
      params: params,
    })
    return result || {}
  },

  GetPreview: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/get-preview',
      data: payload,
    })
    return result || {}
  },

  ChangeStatusAds: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/change-status-ads',
      data: payload,
    })
    return result || {}
  },

  ChangeStatusAdGroup: async (payload: any) => {
    const result = await api_v2.request({
      url: 'adgroup/change-status',
      data: payload,
    })
    return result || {}
  },

  EditAdGroup: async (payload: any) => {
    const result = await api_v2.request({ url: 'adgroup/edit', data: payload })
    return result || {}
  },

  CloneAdGroup: async (payload: any) => {
    const result = await api_v2.request({
      url: 'adgroup/clone',
      data: payload,
    })
    return result || {}
  },

  Domains: async () => {
    const result = await api_v2.request({ url: 'domains', method: 'POST' })
    return result || {}
  },

  ChangeKeywordSet: async (id: number, payload: any) => {
    const pl: { [key: string]: any } = {
      keyword_set_id: id,
      campaign_ids: payload,
    }

    const result = await api_v2.request({
      url: `campaign/change-keyword-set`,
      data: pl,
    })
    return result || {}
  },

  ReviewKeyword: async (data: any) => {
    const result = await api_v2.request({
      url: 'campaign/review-keyword',
      data: data,
    })
    return result || {}
  },

  ReviewKeywordV2: async (url: string, data: any) => {
    const result = await api_v2.request({
      url: url,
      data: data,
    })
    return result || {}
  },

  UpdateField: async (data: any) => {
    const result = await api_v2.request({
      url: 'campaign/update-field',
      data: data,
    })
    return result || {}
  },

  GetCopySource: async (traffic_source: string) => {
    const result = await api_v2.request({
      url: 'campaign/copy-source',
      params: { traffic_source: traffic_source },
    })
    return result || {}
  },
  RemoveCrawlCampaign: async (id: number) => {
    const result = await api_v2.request({
      url: '/crawl-campaign/remove',
      data: { id: id },
      method: 'POST',
    })
    return result || {}
  },
  ReviewChangeLandingPageCampaign: async (data: any) => {
    const result = await api_v2.request({
      url: '/campaign/review-change-landing-page',
      data: data,
      method: 'POST',
    })
    return result || {}
  },
  SubmitChangeLandingPageCampaign: async (data: any) => {
    const result = await api_v2.request({
      url: '/campaign/submit-change-landing-page',
      data: data,
      method: 'POST',
    })
    return result || {}
  },

  DevDemoData: async (data: any) => {
    const result = await api_v2.request({
      url: 'campaign/dev-demo-data',
      data: data,
      method: 'POST',
    })
    return result || {}
  },

  GetInFoCampaign: async (id: any) => {
    const result = await api_v2.request({
      url: 'campaign/get-info-campaign' + `?id=${id}`,
    })
    return result || {}
  },

  ChangeAiStatus: async (payload: any) => {
    const result = await api_v2.request({
      url: 'campaign/change-ai-status',
      data: payload,
    })
    return result || {}
  },

  VerifyAdsCreative: async (payload: any) => {
    const result = await api_v2.request({
      url: 'adgroup/verify-ads-creative',
      data: payload,
    })
    return result || {}
  },

  HistoryByTrafficSource: async (id: any) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: [
          {
            object_type: 'CAMPAIGN_GROUP',
            object_name:
              '375417: Facebook -> All Countries - Google - Gastric Cancer>Frence-26-11',
            extra_data: '{"type":"composite_data"}',
            extra_data_handle: [
              {
                object: '',
                old_value: '$0 ',
                new_value: '$0 ',
                type: 'composite_data',
              },
            ],
            event_type: 'create_campaign_group',
            object_id: '120241505241710399',
            event_time: '2025-11-25T21:55:03+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Campaign created',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'CAMPAIGN',
            object_name: 'Gastric Cancer',
            extra_data:
              '{"old_value":"Pending process","new_value":"Active","run_status":{"old_value":17,"new_value":1},"type":"run_status"}',
            extra_data_handle: [
              {
                object: '',
                old_value: 'Pending process',
                new_value: 'Active',
                type: 'run_status',
              },
            ],
            event_type: 'update_ad_set_run_status',
            object_id: '120241505244260399',
            event_time: '2025-11-25T21:55:24+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad set status updated',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'CAMPAIGN',
            object_name: 'Gastric Cancer',
            extra_data:
              '{"old_value":[],"new_value":[{"content":"Location:","children":["Worldwide"]},{"content":"Minimum age:","children":["18"]},{"content":"Language:","children":["French (France)"]},{"content":"Placements:","children":["on pages: Feed on desktop computers, Video feeds on desktop computers, Instagram feed, Instagram stories, Instagram profile feed, Instagram profile reels, Instagram Explore, Instagram Explore home, Instagram reels, Instagram Reels in-stream, Instagram web feed, Instagram web stories, Instagram site stories, Instagram search, Third-party apps and websites on mobile devices (Audience Network), Feed on mobile devices, Video feeds on mobile devices, Right column on desktop computers, In-stream video on mobile devices, In-stream video on desktop computers, Marketplace on desktop computers, Marketplace on mobile devices, Facebook stories on mobile devices, Messenger Stories, Marketplace search on desktop devices, Marketplace search on mobile devices, Search on mobile devices, Search on desktop devices, Facebook profile feed on mobile devices, Facebook Reels overlay on mobile devices, Facebook Business Explore on mobile devices, Facebook Reels, Video search on mobile devices, Threads feed or Facebook notifications"]},{"content":"Advantage+ audience:","children":["On"]}],"type":"targets_spec"}',
            extra_data_handle: null,
            event_type: 'update_ad_set_target_spec',
            object_id: '120241505244260399',
            event_time: '2025-11-25T21:55:06+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad set targeting updated',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'CAMPAIGN',
            object_name: 'Gastric Cancer',
            extra_data:
              '{"new_value":"Value","old_value":null,"type":"optimization_goal"}',
            extra_data_handle: [
              {
                object: '',
                old_value: '<nil>',
                new_value: 'Value',
                type: 'optimization_goal',
              },
            ],
            event_type: 'update_ad_set_optimization_goal',
            object_id: '120241505244260399',
            event_time: '2025-11-25T21:55:06+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad set optimisation goal updated',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'CAMPAIGN',
            object_name: 'Gastric Cancer',
            extra_data:
              '{"old_value":null,"new_value":"MINIMUM_ROAS","additional_value":{"old_value":null,"new_value":null,"currency":"USD","type":"payment_amount"},"adset_minimum_return_on_ad_spend":{"old_value":null,"new_value":0.8},"type":"bid_type"}',
            extra_data_handle: [
              {
                object: '',
                old_value: '',
                new_value: '',
                type: 'bid_type',
              },
            ],
            event_type: 'update_ad_set_bid_strategy',
            object_id: '120241505244260399',
            event_time: '2025-11-25T21:55:06+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad set bid strategy updated',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'CAMPAIGN',
            object_name: 'Gastric Cancer',
            extra_data:
              '{"new_value":{"type":"payment_amount","currency":"USD","new_value":500,"additional_type":"status_string","additional_value":"Per day"},"type":"composite_data"}',
            extra_data_handle: [
              {
                object: '',
                old_value: '$0 ',
                new_value: '$5 Per day',
                type: 'composite_data',
              },
            ],
            event_type: 'create_ad_set',
            object_id: '120241505244260399',
            event_time: '2025-11-25T21:55:06+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad set created',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'ADGROUP',
            object_name: 'Ad 1',
            extra_data:
              '{"campaign_id":120241505244260399,"old_value":null,"new_value":"Started delivery","type":"delivery_event"}',
            extra_data_handle: null,
            event_type: 'first_delivery_event',
            object_id: '120241505247540399',
            event_time: '2025-11-26T01:38:47+0000',
            date_time_in_timezone: '26/11/2025 at 01:38',
            actor_name: 'Meta',
            actor_id: '0',
            application_id: '0',
            translated_event_type: 'Ad delivered',
          },
          {
            object_type: 'ADGROUP',
            object_name: 'Ad 1',
            extra_data:
              '{"old_value":"Pending Review","new_value":"Active","campaign_id":120241505244260399,"run_status":{"old_value":9,"new_value":1},"type":"run_status"}',
            extra_data_handle: [
              {
                object: '',
                old_value: 'Pending Review',
                new_value: 'Active',
                type: 'run_status',
              },
            ],
            event_type: 'update_ad_run_status',
            object_id: '120241505247540399',
            event_time: '2025-11-25T22:01:32+0000',
            date_time_in_timezone: '25/11/2025 at 22:01',
            actor_name: 'Meta',
            actor_id: '0',
            application_id: '0',
            translated_event_type: 'Ad status updated',
          },
          {
            object_type: 'ADGROUP',
            object_name: 'Ad 1',
            extra_data:
              '{"old_value":"Pending process","new_value":"Pending Review","campaign_id":120241505244260399,"run_status":{"old_value":17,"new_value":9},"type":"run_status"}',
            extra_data_handle: [
              {
                object: '',
                old_value: 'Pending process',
                new_value: 'Pending Review',
                type: 'run_status',
              },
            ],
            event_type: 'update_ad_run_status',
            object_id: '120241505247540399',
            event_time: '2025-11-25T21:55:44+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad status updated',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
          {
            object_type: 'ADGROUP',
            object_name: 'Ad 1',
            extra_data:
              '{"campaign_id":{"mutation_input":120241505244260399,"new":120241505244260399}}',
            extra_data_handle: null,
            event_type: 'create_ad',
            object_id: '120241505247540399',
            event_time: '2025-11-25T21:55:14+0000',
            date_time_in_timezone: '25/11/2025 at 21:55',
            actor_name: 'API_FULL_CONTROLL',
            actor_id: '122123933918576334',
            application_id: '464684863338367',
            translated_event_type: 'Ad created',
            application_name: 'APP_BM_ITD_PTE_LTD',
          },
        ],
      }
    }
    const result = await api_v2.request({
      url: 'campaign/history-by-trafficsource/' + id,
    })
    return result || {}
  },

  DuplicateCampaignCustom: async (data: any) => {
    const result = await api_v2.request({
      url: '/campaign/duplicate-campaign-custom',
      data: data,
    })
    return result || {}
  },

  AddQuickCampaign: async (data: any) => {
    const result = await api_v2.request({
      url: '/campaign/add-quick-campaign',
      data: data,
    })
    return result || {}
  },
  GetAILog: async (data: any) => {
    const result = await api_v2.request({
      url: '/ai-campaign-optimize/ai-decision/list',
      data: data,
    })

    return result || {}
  },
  SearchTag: async (payload: any) => {
    const result = await api_v2.request({
      url: `campaign/search-tag`,
      data: payload,
    })
    return result || {}
  },

  SearchTargetKeyword: async (payload: any) => {
    const result = await api_v2.request({
      url: `campaign/search-target-keyword`,
      data: payload,
    })
    return result || {}
  },

  AddPresetLocations: async (payload: any) => {
    const result = await api_v2.request({
      url: 'location-sets/add',
      data: payload,
    })
    return result || {}
  },
  UpdatePresetLocation: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `location-sets/update/${id}`,
      data: payload,
    })
    return result || {}
  },
  GetPresetLocations: async (traffic_source: string) => {
    const result = await api_v2.request({
      url: `location-sets?traffic_source=${traffic_source}`,
    })
    return result || {}
  },
  VerifyAdGroupAd: async (payload: any) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: 100,
      }
    }

    const result = await api_v2.request({
      url: `adgroup/verify-ad`,
      data: payload,
    })
    return result || {}
  },

  VerifyAdGroupAdWait: async (id: any) => {
    if (window.arb.debug) {
      return {
        status: true,
        data: {
          ai_verify: {
            id: '',
            usage: {
              input_tokens: 0,
              input_tokens_details: {
                cached_tokens: 0,
              },
              output_tokens: 0,
              total_tokens: 0,
              cost: 0.00353625,
            },
            creative_id: '',
            compliance_status: 'YES',
            contents: [
              {
                text_id: 'title_1',
                content: 'All-Inclusive-Flusskreuzfahrtpakete Berlin 2025',
                max_character: 255,
                compliance_status: 'YES',
              },
              {
                text_id: 'primary_text_1',
                content:
                  'Informieren Sie sich über All-inclusive-Flusskreuzfahrten ab Berlin für die Saison 2025. Die Übersicht zeigt beispielhafte Routen auf der Spree und den umliegenden Wasserstraßen, typische Leistungen und Bord-Annehmlichkeiten mit flexiblen Reisedauern von 3, 5 und 7+ Tagen. Sehen Sie sich Termine und Reisebeispiele an, um zu sehen, was zu Ihren Plänen passt.',
                max_character: 1000,
                compliance_status: 'YES',
              },
              {
                text_id: 'title_2',
                content: 'Flusskreuzfahrten ab Berlin: 3, 5, 7+ Tage',
                max_character: 255,
                compliance_status: 'YES',
              },
              {
                text_id: 'description_1',
                content:
                  'Details zu 3-, 5- und 7+-Tagesoptionen mit Inklusivleistungen und Beispielrouten.',
                max_character: 1000,
                compliance_status: 'YES',
              },
              {
                text_id: 'primary_text_2',
                content:
                  'Planen Sie eine mehrtägige Flussreise ab Berlin im Jahr 2025? Dieser Leitfaden präsentiert All-inclusive-Pakete für Kurzurlaube und längere Reisen. Er bietet neutrale Informationen zu den üblicherweise enthaltenen Leistungen, Unterkünften und beispielhaften Tagesplänen für 3-, 5- und 7+-tägige Fahrten zur Unterstützung der Reiseplanung.',
                max_character: 1000,
                compliance_status: 'YES',
              },
            ],
            images: [
              {
                image_id: 'image_1',
                image_summary:
                  'This is a travel advertisement for river cruise packages in Berlin. The background image shows a tour boat named "Carola" on a river flowing through a city. Overlaid text in German promotes the offer. At the top, a banner reads "ALLES INKLUSIVE" (All Inclusive). The main headline in large, white letters is "BERLIN". Below that, it says "FLUSSKREUZFAHRT-PAKETE 2025" (River Cruise Packages 2025). At the bottom, there are three call-to-action buttons for different trip durations: "3 TAGE" (3 Days), "5 TAGE" (5 Days), and "7+ TAGE" (7+ Days). Each of these has a sub-button that says "Mehr erfahren" (Learn more).',
                compliance_status: 'YES',
                url: 'https://arb-ul.pubpowerplatform.io/data/video-mp4/1759980273162864995_24472e182f4f2aeee8ea630c9f046ec8/media.mp4',
                content_safety: 'Safe',
                rule_violated: 'xxxx',
              },
            ],
            landing_page: '',
          },
          input_verify: {
            creative_id: 'creativeSubmit_1621225',
            contents: [
              {
                text_id: 'title_1',
                content: 'All-Inclusive-Flusskreuzfahrtpakete Berlin 2025',
                max_character: 255,
              },
              {
                text_id: 'title_2',
                content: 'Flusskreuzfahrten ab Berlin: 3, 5, 7+ Tage',
                max_character: 255,
              },
              {
                text_id: 'description_1',
                content:
                  'Details zu 3-, 5- und 7+-Tagesoptionen mit Inklusivleistungen und Beispielrouten.',
                max_character: 1000,
              },
              {
                text_id: 'primary_text_1',
                content:
                  'Informieren Sie sich über All-inclusive-Flusskreuzfahrten ab Berlin für die Saison 2025. Die Übersicht zeigt beispielhafte Routen auf der Spree und den umliegenden Wasserstraßen, typische Leistungen und Bord-Annehmlichkeiten mit flexiblen Reisedauern von 3, 5 und 7+ Tagen. Sehen Sie sich Termine und Reisebeispiele an, um zu sehen, was zu Ihren Plänen passt.',
                max_character: 1000,
              },
              {
                text_id: 'primary_text_2',
                content:
                  'Planen Sie eine mehrtägige Flussreise ab Berlin im Jahr 2025? Dieser Leitfaden präsentiert All-inclusive-Pakete für Kurzurlaube und längere Reisen. Er bietet neutrale Informationen zu den üblicherweise enthaltenen Leistungen, Unterkünften und beispielhaften Tagesplänen für 3-, 5- und 7+-tägige Fahrten zur Unterstützung der Reiseplanung.',
                max_character: 1000,
              },
            ],
            images: [
              {
                image_id: 'image_1',
                image_summary:
                  'This is a travel advertisement for river cruise packages in Berlin. The background image shows a tour boat named "Carola" on a river flowing through a city. Overlaid text in German promotes the offer. At the top, a banner reads "ALLES INKLUSIVE" (All Inclusive). The main headline in large, white letters is "BERLIN". Below that, it says "FLUSSKREUZFAHRT-PAKETE 2025" (River Cruise Packages 2025). At the bottom, there are three call-to-action buttons for different trip durations: "3 TAGE" (3 Days), "5 TAGE" (5 Days), and "7+ TAGE" (7+ Days). Each of these has a sub-button that says "Mehr erfahren" (Learn more).',
              },
            ],
          },
          output_verify:
            '{"id":"","usage":{"input_tokens":0,"input_tokens_details":{"cached_tokens":0},"output_tokens":0,"total_tokens":0,"cost":0},"creative_id":"","compliance_status":"","contents":[{"text_id":"title_1","content":"All-Inclusive-Flusskreuzfahrtpakete Berlin 2025","max_character":255,"compliance_status":"YES"},{"text_id":"primary_text_1","content":"Informieren Sie sich über All-inclusive-Flusskreuzfahrten ab Berlin für die Saison 2025. Die Übersicht zeigt beispielhafte Routen auf der Spree und den umliegenden Wasserstraßen, typische Leistungen und Bord-Annehmlichkeiten mit flexiblen Reisedauern von 3, 5 und 7+ Tagen. Sehen Sie sich Termine und Reisebeispiele an, um zu sehen, was zu Ihren Plänen passt.","max_character":1000,"compliance_status":"YES"},{"text_id":"title_2","content":"Flusskreuzfahrten ab Berlin: 3, 5, 7+ Tage","max_character":255,"compliance_status":"YES"},{"text_id":"description_1","content":"Details zu 3-, 5- und 7+-Tagesoptionen mit Inklusivleistungen und Beispielrouten.","max_character":1000,"compliance_status":"YES"},{"text_id":"primary_text_2","content":"Planen Sie eine mehrtägige Flussreise ab Berlin im Jahr 2025? Dieser Leitfaden präsentiert All-inclusive-Pakete für Kurzurlaube und längere Reisen. Er bietet neutrale Informationen zu den üblicherweise enthaltenen Leistungen, Unterkünften und beispielhaften Tagesplänen für 3-, 5- und 7+-tägige Fahrten zur Unterstützung der Reiseplanung.","max_character":1000,"compliance_status":"YES"}],"images":[{"image_id":"image_1","image_summary":"This is a travel advertisement for river cruise packages in Berlin. The background image shows a tour boat named \\"Carola\\" on a river flowing through a city. Overlaid text in German promotes the offer. At the top, a banner reads \\"ALLES INKLUSIVE\\" (All Inclusive). The main headline in large, white letters is \\"BERLIN\\". Below that, it says \\"FLUSSKREUZFAHRT-PAKETE 2025\\" (River Cruise Packages 2025). At the bottom, there are three call-to-action buttons for different trip durations: \\"3 TAGE\\" (3 Days), \\"5 TAGE\\" (5 Days), and \\"7+ TAGE\\" (7+ Days). Each of these has a sub-button that says \\"Mehr erfahren\\" (Learn more).","compliance_status":"YES","url":"https://arb-ul.pubpowerplatform.io/data/image/thumb_1760094463569399943_2ff0f78d95119ace602d527839940bd3.png?format=webp\\u0026quality=75\\u0026width=768","content_safety":"Safe"}],"landing_page":""}',
        },
      }
    }

    const result = await api_v2.request({
      url: `adgroup/verify-ad/${id}`,
      messageDuration: 15000,
      'axios-retry': {
        retries: 10,
        retryDelay: (retryCount: number) => Math.min(1000 * retryCount, 8000), // tăng dần 1s, 2s, 3s... tối đa 8s
      },
    })
    return result || {}
  },

  ChangeStatusABTestDomain: async (link: string, payload: any) => {
    if (!link) return {}

    const result = await api_v2.request({
      url: link,
      data: payload,
    })
    return result || {}
  },

  AddPresetCampaign: async (payload: any) => {
    const result = await api_v2.request({
      url: 'account-sets/add',
      data: payload,
    })
    return result || {}
  },

  UpdatePresetCampaign: async (id: number, payload: any) => {
    const result = await api_v2.request({
      url: `account-sets/update/${id}`,
      data: payload,
    })
    return result || {}
  },

  GetPresetCampaigns: async (traffic_source: string, params: any) => {
    const result = await api_v2.request({
      url: `account-sets?provider=${traffic_source}`,
      params: params,
    })
    return result || {}
  },

  CampaignConfigsCreateCampaign: async (ts: string) => {
    return (
      (await api_v2.request({
        url: '/campaign/configs/create-campaign',
        params: { traffic_source: ts },
      })) || {}
    )
  },

  CampaignConfigs: async (payload: any) => {
    return (
      (await api_v2.request({
        url: '/campaign/configs',
        data: payload,
      })) || {}
    )
  },
}
