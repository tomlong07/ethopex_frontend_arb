import report_helpers, {
  buildLinkCampaign,
} from '@/components/report-v3/report_helpers'
import { ReportColumn } from '@/types/state/report'
import icons from '@/utils/icons'
import { ctr_report } from '@/services/ctr_report'
import { ctr_landing_page } from '@/services/ctr_landing_page'
import campaignIs from '@/composables/campaign-action'
import useReportV2ModalFacebook from '@/store/report/report-v2-modal-facebook'
import { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import { NSpin, SelectOption } from 'naive-ui'
import { useReportV2 } from '@/store/report/report-v2'
import useActivityStore from '@/store/useActivityStore'
import duplicateChangeCampaignType from '@/store/campaign/duplicateChangeCampaignType'
import { useGroupFilterStore } from '@/store/activity/groupFilter'
import { CAMP_TYPE, DUPLICATE_TYPE, TS } from '@/enum/campaign'
import Logging from '@/utils/Log'

const previewFacebookInfo = useReportV2ModalFacebook()
const reportStoreV2 = useReportV2(helper.truePath())()
const activityStore = useActivityStore()
const groupFilterStore = useGroupFilterStore()
const duplicateChangeCampaignTypeStore = duplicateChangeCampaignType()

//Truyền dialog từ vue vào vì useDialog chỉ có thể init ở vue
export const clickMenuNow = (
  opts?: ReportColumn,
  dialog?: DialogApiInjection
) => {
  switch (opts?.key) {
    case 'action_camp':
      return (e: any, cell: any, rowIndex: number, rowKey: string) =>
        campaignMenuClick(e, cell, dialog, rowIndex, rowKey, true)
    case 'landing_page_id':
      return (e: any, cell: any) => landingMenuClick(e, cell, dialog)
  }
  return
}

//
export const campaignMenuClick = (
  e: any,
  cell: any,
  dialog?: DialogApiInjection,
  rowIndex?: number,
  rowKey: string = '',
  isLeftClick: boolean = false
) => {
  if (isLeftClick && !e?.target?.closest('.setting-icon-report')) return

  //tắt các sự kiện ở phần tính tổng

  // Get the row data
  const rowData = cell.getRow().getData()

  // Lấy trạng thái selected của hàng
  const isSelected = rowData.selected || false
  // Define menu items based on cell value

  let ts =
    rowData.traffic_source === TS.PINTEREST ? 'general' : rowData.traffic_source
  let url = `/campaign/${ts}/${rowData?.campaign_name?.id}`
  const href = buildLinkCampaign(
    rowData,
    reportStoreV2.timezone,
    reportStoreV2.payload
  )

  let menu = [
    {
      label: report_helpers.buildLabel(
        icons.report(),
        'Open Report of Campaign',
        `${href}`
      ),
    },
    {
      label: report_helpers.buildLabel(icons.setting(), 'Edit Campaign', url),
    },
    {
      label: report_helpers.buildLabel(
        isSelected ? icons.xCircleIcon() : icons.checkCircleIcon(),
        isSelected ? 'Unselect row' : 'Select row'
      ),
      action: (e: any, cell: any) => {
        if (rowIndex !== undefined && rowIndex >= 0) {
          // Kiểm tra rowIndex hợp lệ
          const items = reportStoreV2.reportDataV2.items
          if (items && items[rowIndex]) {
            // Toggle trạng thái selected
            items[rowIndex].selected = !items[rowIndex].selected
            reportStoreV2.reportDataV2.items = [...items] // Gán lại mảng để kích hoạt tính phản ứng
          }

          // Cập nhật giao diện bảng
          const row = cell.getRow()

          try {
            row.update({ selected: items[rowIndex].selected }) // Cập nhật dữ liệu hàng
          } catch (error) {
            Logging.error('[campaignMenuClick] Error updating row data:', error)
          }
          const rowElement = row.getElement()
          if (items[rowIndex].selected) {
            rowElement.classList.add('tabulator-selected')
          } else {
            rowElement.classList.remove('tabulator-selected')
          }

          // THAY ĐỔI: Sử dụng selectedRowsMap từ reportStoreV2
          if (reportStoreV2.selectedRowsMap && rowKey) {
            if (items[rowIndex].selected) {
              reportStoreV2.selectedRowsMap.set(rowKey, true)
            } else {
              reportStoreV2.selectedRowsMap.delete(rowKey)
            }
          }
        }
      },
    },
  ] as any[]

  if (window.arb.isCompany() && rowData?.campaign_name?.id) {
    menu.push({
      label: report_helpers.buildLabel(icons.logging(), 'Log Campaign'),
      action: async function (e: any, cell: any) {
        const rowData: any = cell.getData()

        if (rowData?.campaign_name?.id) {
          // activityStore.payload.filter.campaign =
          //   rowData.campaign_name?.id.toString()
          groupFilterStore.payload.filter.campaign =
            rowData.campaign_name?.id.toString()
          activityStore.isDefaultAllTime = true

          await helper.sleep(100)
          activityStore.showModal = true
        }
      },
    })
  }

  if (rowData?.campaign_name?.landing_page) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.landing(),
        'Open Landing Page',
        rowData?.campaign_name?.landing_page
      ),
    })
  }

  if (rowData?.campaign_name?.link_campaign_traffic_source) {
    const linkTS =
      rowData?.traffic_source === TS.GOOGLE
        ? rowData?.campaign_name?.link_campaign_traffic_source +
          `&ocid=${rowData?.account_supply?.ocid}`
        : rowData?.campaign_name?.link_campaign_traffic_source

    menu.push({
      label: report_helpers.buildLabel(
        icons.landing(),
        'Campaign In Traffic Source',
        linkTS
      ),
    })
  }

  if (rowData?.campaign_name?.creative?.id) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.landing(),
        'Open Creative',
        `/creative/${rowData?.campaign_name?.creative?.id}`
      ),
    })
  }

  if (rowData?.campaign_name?.id) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.Stoplights(),
        'Open Ping Pixel',
        `/ping-pixel?campaigns=${rowData?.campaign_name?.id}&start_date=${reportStoreV2.filter.start_date}&end_date=${reportStoreV2.filter.end_date}`
      ),
    })
  }

  menu.push({
    label: report_helpers.buildLabel(icons.info(), 'More Info'),
    action: function (e: any, cell: any) {
      const rowData: any = cell.getData()

      dialog?.info({
        title: rowData?.campaign_name?.name || 'N/A',
        content: () =>
          h('div', {
            innerHTML: report_helpers.buildTextTooltip(rowData),
          }),

        style: 'width:50vw',
      })
    },
  })

  if (rowData?.traffic_source === TS.FACEBOOK) {
    menu.push({
      label: report_helpers.buildLabel(icons.eye(), 'Ads Info'),
      action: async function (e: any, cell: any) {
        const rowData: any = cell.getData()
        const idCamp = rowData?.campaign_name?.id

        if (idCamp) {
          previewFacebookInfo.id = idCamp
          const listdataPreview = await ctr_report.GetListFaceBookAds({
            id: String(idCamp),
          })
          if (listdataPreview?.status) {
            try {
              previewFacebookInfo.listAds = listdataPreview.data.data.data
              previewFacebookInfo.url = listdataPreview.data.url

              previewFacebookInfo.showModal = true
            } catch {}
          }
        }
      },
    })
  }

  if (
    rowData?.campaign_name?.campaign_type === CAMP_TYPE.PERFORMANCEMAX &&
    rowData?.traffic_source === TS.GOOGLE
  ) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.duplicate_keep_link(),
        'Duplicate Change Campaign Type',
        rowData?.campaign_name?.campaign_type
      ),
      action: (_e: any, _cell: any) => {
        if (!rowData?.campaign_name?.id) return

        duplicateChangeCampaignTypeStore.showModal = true
        duplicateChangeCampaignTypeStore.campaignOriginal =
          rowData?.campaign_name?.id
      },
    })
  }

  const hasClone = reportStoreV2.feSettings.TrafficHasClone(
    rowData?.traffic_source
  )

  const hasCloneV2 = reportStoreV2.feSettings.TrafficHasCloneV2(
    rowData?.traffic_source
  )

  const addUrl = reportStoreV2.feSettings.AddURL(rowData?.traffic_source)

  const duplicateUrl = `${addUrl}?duplicate=${rowData?.campaign_name?.id}`
  try {
    if (addUrl) {
      let url = duplicateUrl

      if (hasCloneV2) {
        url += `&mode=${DUPLICATE_TYPE.DUPLICATE}`
      }
      menu.push({
        label: report_helpers.buildLabel(
          icons.duplicate(),
          'Duplicate Campaign',
          url
        ),
      })
    }
  } catch (error) {
    console.error(error)
  }

  try {
    if (hasCloneV2) {
      menu.push({
        label: report_helpers.buildLabel(
          icons.duplicate_keep_link(),
          'Duplicate keep link Campaign',
          `${duplicateUrl}&mode=${DUPLICATE_TYPE.DUPLICATE_KEEP_LINK}`
        ),
      })
    }

    if (hasClone) {
      menu.push({
        label: report_helpers.buildLabel(icons.clone(), 'Clone by API'),
        action: async function (e: any, cell: any) {
          const rowData: any = cell.getData()
          // const data = cell.getValue()

          campaignIs.cloneAction(
            rowData?.campaign_name?.id as number,
            window.message,
            rowData.traffic_source as string,
            rowData?.campaign_name?.name as string
          )
        },
      })
    }
  } catch {}

  const clickY =
    e?.clientY ?? e?.touches?.[0]?.clientY ?? window.innerHeight / 2

  const ESTIMATED_MENU_HEIGHT = 509

  const shouldFlipUp = window.innerHeight - clickY < ESTIMATED_MENU_HEIGHT

  const obs = new MutationObserver((mutations, observer) => {
    const popup = document.querySelector(
      '.tabulator-popup-container'
    ) as HTMLElement | null
    if (!popup) return

    // Ẩn tạm để không thấy chuyển động rồi đặt hướng
    popup.style.opacity = '0'
    popup.style.willChange = 'transform'

    if (shouldFlipUp) popup.classList.add('force-upward')
    else popup.classList.remove('force-upward')

    // Cho phép repaint xong mới hiện
    requestAnimationFrame(() => {
      popup.style.opacity = '1'
      popup.style.willChange = ''
    })

    observer.disconnect()
  })
  obs.observe(document.body, { childList: true, subtree: true })

  return handleMenu(menu)
}

const landingMenuClick = (e: any, cell: any, dialog?: DialogApiInjection) => {
  // Get the row data
  const rowData = cell.getRow().getData()

  let menu = [] as any[]

  if (rowData?.landing_page?.id) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.report(),
        'Edit Landing Page',
        `/landing_page/${rowData?.landing_page?.id}`
      ),
    })
  }

  if (rowData?.landing_page?.preview) {
    menu.push({
      label: report_helpers.buildLabel(
        icons.eye(),
        'Preview',
        `${rowData?.landing_page?.preview}`
      ),
    })
  }

  if (rowData?.landing_page?.id) {

    menu.push({
      label: report_helpers.buildLabel(icons.info(), 'More Info'),
      action: async function (e: any, cell: any) {
        const rowData: any = cell.getData()
        const landingId = rowData?.landing_page?.id
        const languageOptions = ref<any>(null)

        if (!landingId) return

        const loadingDialog = dialog?.info({
          title: rowData?.landing_page?.name || 'N/A',
          content: () =>
            h(
              'div',
              { style: 'display:flex;justify-content:center;padding:24px' },
              [h(NSpin, { size: 'medium' })]
            ),
          style: 'width:50vw',
        })

        try {
          const result = await ctr_landing_page.GetByID(landingId)
          const languageResult = await ctr_landing_page.GetAllLanguage()

          loadingDialog?.destroy()

          if (result?.status && result?.data) {
            languageOptions.value = languageResult?.data

            const fullData = {
              ...rowData,
              landing_page: {
                ...rowData.landing_page,
                ...result.data,
              },
            }

            dialog?.info({
              title: rowData?.landing_page?.name || 'N/A',
              content: () =>
                h('div', {
                  class: 'landing-tooltip-content',
                  innerHTML: report_helpers.buildTextTooltipLanding(
                    fullData,
                    languageOptions.value
                  ),
                }),
              style: 'width: 65vw; max-width: 1100px;',
            })
          }
        } catch (error) {
          loadingDialog?.destroy()
          console.error('Failed to load landing detail:', error)
        }
      },
    })
  }
  return handleMenu(menu)
}

//Sử dụng cái này để click vào bất cứ đâu ở tabulator-menu-item đều đc
const handleMenu = (menu: any[]) => {
  return menu.map((item) => {
    return {
      ...item,
      action: (e: any, cell: any) => {
        e.stopPropagation() // Prevent the click event from propagating
        e.preventDefault()
        //Tránh mở tab mới 2 lần khi click vào href

        if (item.action) {
          item.action(e, cell)
        }

        if (item.label?.includes('href') && !item.action) {
          const href = helper.extractHref(item.label)
          if (href) {
            window.open(href, '_blank')
          }
        }

        //Xóa bỏ menu sau khi click
        document.querySelector('.tabulator-menu')?.remove()
      },
    }
  })
}
