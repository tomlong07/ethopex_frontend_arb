import { ctr_account } from '@/services/ctr_account'
// import { AccountStatus } from '@/components/account'
import Status from '@/components/account/Status.vue'
import CostAllTime from '@/components/account/cell/CostAllTime.vue'
import DomainConfigs from '@/components/account/cell/DomainConfigs.vue'
import AccountStatus from '@/components/account/AccountStatus.vue'
import SpentFromPromotion from '@/components/account/cell/SpentFromPromotion.vue'
import SpendProgress from '@/components/account/cell/SpendProgress.vue'
import LinkBilling from '@/components/account/cell/LinkBilling.vue'
import TotalCost from '@/components/account/TotalCost.vue'
import AccountPresets from '@/components/account/AccountPresets.vue'
import CellNewMccID from '@/components/account/cell/CellNewMccID.vue'
import ListExcludeScan from '@/components/account/cell/ListExcludeScan.vue'
import TemplateV2CellLabelsAccountAd from '@/components/manager_account/cell/TemplateV2CellLabelsAccountAd.vue'

export const ColumnGoogle = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.2,
    minWidth: 80,
  },
  {
    headerName: 'Mcc ID',
    field: 'mcc_id',
    flex: 0.1,
    minWidth: 150,
  },
  {
    headerName: 'New Mcc ID',
    field: 'change_account_mcc',
    flex: 0.1,
    minWidth: 150,
    cellRenderer: CellNewMccID,
  },

  {
    headerName: 'Mcc Name',
    field: 'mcc_name',
    flex: 0.1,
    minWidth: 200,
  },
  {
    headerName: 'Promotion Status',
    field: 'cp_status',
    flex: 0.05,
    minWidth: 150,
  },
  {
    headerName: 'Account ID',
    field: 'account_id',
    flex: 0.1,
    minWidth: 120,
  },

  {
    headerName: 'Cost All Time',
    field: 'cost_all_time',
    flex: 0.1,
    minWidth: 130,
    cellRenderer: CostAllTime,
  },

  {
    headerName: 'Name',
    field: 'show_name',
    editable: true,
    flex: 0.15,
    minWidth: 150,
    cellRenderer: LinkBilling,
    valueSetter: async (params: any) => {
      if (!params?.data?.id) {
        return false
      }

      const loadingNotification = window.message.loading('Updating...')
      const result = await ctr_account.SaveAccountAds(
        params.data.id,
        params.data
      )

      loadingNotification.destroy()

      if (result?.status) {
        window.message.success('Update successfully!')
        const newValue = params.newValue

        // Nếu hợp lệ, update giá trị mới
        params.data[params.colDef.field] = newValue

        return true
      }

      return false
    },
  },

  {
    field: 'redemption',
    headerName: 'Date Redeemed',
  },

  {
    field: 'criteria',
    headerName: 'Qualification (Expiration dates)',
    minWidth: 250,
  },

  {
    field: 'consumption',
    headerName: 'Spend (Expiration dates)',
  },

  {
    field: 'amount_spent_for_promotion',
    headerName: 'Promotional spend progress',
    cellRenderer: SpendProgress,
  },

  {
    field: 'spent',
    headerName: 'Spent From Promotion',
    cellRenderer: SpentFromPromotion,
  },

  {
    headerName: 'Domain Configs',
    field: 'domain_configs',
    cellRenderer: DomainConfigs,
    flex: 0.1,
    minWidth: 250,
    autoHeight: true,
    valueFormatter: (params: any) => {
      return params.value
    },
  },
  {
    headerName: 'Labels',
    field: 'labels',
    cellRenderer: TemplateV2CellLabelsAccountAd,
    flex: 0.1,
    minWidth: 250,
    cellRendererParams: {
      propToGet: 'account_id',
      watchId: true,
    },
    autoHeight: true,
    valueFormatter: (params: any) => {
      return params.value
    },
  },
  {
    headerName: 'List Exclude Scan',
    field: 'list_exclude_scan',
    cellRenderer: ListExcludeScan,
    flex: 0.05,
    minWidth: 250,

    autoHeight: true,
    valueFormatter: (params: any) => {
      return params.value
    },
  },
  {
    headerName: 'Account Status',
    field: 'account_status',
    cellRenderer: AccountStatus,
    flex: 0.1,
    minWidth: 200,
  },

  {
    headerName: 'Status',
    field: 'status',
    cellRenderer: Status,
    flex: 0.05,
    minWidth: 100,
    // filter: true,
  },

  {
    headerName: 'Total Cost',
    field: 'total_cost',
    cellRenderer: TotalCost,
    flex: 0.05,
    minWidth: 100,
    // filter: true,
  },
  {
    headerName: 'Account Presets',
    field: 'account_presets',
    cellRenderer: AccountPresets,
    autoHeight: true,
    flex: 0.2,
    minWidth: 300,
    valueFormatter: (params: any) => {
      return params.value
    },
  },

  // {
  //   headerName: 'Use Root Domain',
  //   field: 'use_root_domain',
  //   cellRenderer: UseRootDomain,
  //   flex: 0.2,
  //   minWidth: 150,
  // },
]

export const ColumnTikTok = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.2,
    minWidth: 80,
  },
  {
    headerName: 'Account ID',
    field: 'account_id',
    flex: 0.2,
  },
  {
    headerName: 'Name',
    field: 'show_name',
    editable: true,
    flex: 0.4,
  },
  {
    headerName: 'Account Status',
    field: 'account_status',
    cellRenderer: AccountStatus,
    flex: 0.2,
    minWidth: 200,
  },
  {
    headerName: 'Status',
    field: 'status',
    cellRenderer: Status,
    flex: 0.2,
    // filter: true,
  },
  {
    headerName: 'Account Presets',
    field: 'account_presets',
    cellRenderer: AccountPresets,
    flex: 0.2,
    minWidth: 300,
    autoHeight: true,
    valueFormatter: (params: any) => {
      return params.value
    },
  },
]

export const ColumnDefault = [
  {
    headerName: 'ID',
    field: 'id',
    minWidth: 100,
    flex: 0.2,
  },
  {
    headerName: 'Account ID',
    field: 'account_id',
    flex: 0.2,
  },
  {
    headerName: 'Name',
    field: 'show_name',
    editable: true,
    flex: 0.4,
  },
  {
    headerName: 'Pixel ID',
    field: 'pixel_id',
    editable: true,
    flex: 0.2,
  },
  {
    headerName: 'Pixel Token',
    field: 'pixel_token',
    editable: true,
    flex: 0.2,
  },
  {
    headerName: 'Status',
    field: 'status',
    cellRenderer: Status,
    flex: 0.2,

    // filter: true,
  },
  {
    headerName: 'Account Presets',
    field: 'account_presets',
    cellRenderer: AccountPresets,
    flex: 0.2,
    minWidth: 300,
    autoHeight: true,
    valueFormatter: (params: any) => {
      return params.value
    },
  },
]
