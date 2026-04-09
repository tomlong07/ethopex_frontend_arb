<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'

import LinkTooltip from '@/components/template-v2/cell/LinkTooltip.vue'
import Tooltip from '@/components/template-v2/cell/Tooltip.vue'
import ActionDomainManager from '@/components/domain_manager/cell/ActionDomainManager.vue'
import DomainManagerLabels from '@/components/domain_manager/cell/DomainManagerLabels.vue'
import StatusDomainManager from '@/components/domain_manager/cell/StatusDomainManager.vue'
import DomainManagerSetUp from '@/components/domain_manager/cell/DomainManagerSetUp.vue'
import AdAccountsTotal from '@/components/domain_manager/cell/AdAccountsTotal.vue'
import AdsenseAccounts from '@/components/domain_manager/cell/AdsenseAccounts.vue'
import TemplateV2CellDomainConfigs from '@/components/domain_manager/cell/TemplateV2CellDomainConfigs.vue'
import TemplateV2CellDomainManagerLogo from '@/components/domain_manager/cell/TemplateV2CellDomainManagerLogo.vue'
const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'logo':
      return TemplateV2CellDomainManagerLogo
    case 'domain':
      return LinkTooltip
    case 'domain_config':
      return TemplateV2CellDomainConfigs
    case 'ad_account_total':
      return AdAccountsTotal
    case 'adsense_accounts':
      return AdsenseAccounts
    case 'adsense_for_content':
    case 'gam_id':
      return Tooltip
    case 'label':
      return DomainManagerLabels
    case 'status':
      return StatusDomainManager
    case 'action':
      return ActionDomainManager
    case 'set_up':
      return DomainManagerSetUp
  }
  return
}
</script>

<template></template>
