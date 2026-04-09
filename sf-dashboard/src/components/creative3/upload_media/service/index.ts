import { creativeTypeClass } from '@/types/components/creative-v2'
import { DefaultHandler } from './default'
import { FacebookHandler } from './facebook'
import { DemandGenHandler } from './google_demand'
import { PMaxHandler } from './google_pmax'
import { NewsbreakHandler } from './news_break'
import { SnapchatHandler } from './snapchat'
import { TikTokHandler } from './tiktok'

export function resolvePlatformHandler(cre: creativeTypeClass) {
  if (cre.IsTikTok()) return TikTokHandler
  if (cre.IsSnapchat()) return SnapchatHandler
  if (cre.IsNewsbreak()) return NewsbreakHandler
  if (cre.IsDemandGen()) return DemandGenHandler
  if (cre.IsPMax()) return PMaxHandler
  if (cre.IsFacebook()) return FacebookHandler

  return DefaultHandler
}
