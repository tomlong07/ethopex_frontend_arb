import { IconTSInfo } from '@/class/campaign'
import { TS } from '@/enum/campaign'

export const IconTrafficSourcesCDN: Record<string, IconTSInfo> = {
  [TS.FACEBOOK]: new IconTSInfo({ url: 'LogoFacebook2', size: '30' }),
  general: new IconTSInfo({ url: 'LogoGeneral' }),
  [TS.GOOGLE]: new IconTSInfo({ url: 'LogoGoogle' }),
  [TS.MEDIAGO]: new IconTSInfo({ url: 'LogoMediago', size: '30' }),
  [TS.MGID]: new IconTSInfo({ url: 'LogoMgId' }),
  [TS.NEWSBREAK]: new IconTSInfo({ url: 'LogoNewsbreak', size: '32' }),
  [TS.OUTBRAIN]: new IconTSInfo({ url: 'LogoOutbrain', size: '30' }),
  [TS.POCPOC]: new IconTSInfo({ url: 'LogoPocpoc' }),
  [TS.QUANTUMDEX]: new IconTSInfo({ url: 'LogoQuantumdex' }),
  [TS.REVCONTENT]: new IconTSInfo({ url: 'LogoRevContent' }),
  [TS.SMART_NEW]: new IconTSInfo({ url: 'LogoSmartNews', tail: 'png' }),
  [TS.SNAPCHAT]: new IconTSInfo({ url: 'LogoSnapchat', size: '30' }),
  [TS.TABOOLA]: new IconTSInfo({ url: 'LogoTaboola' }),
  [TS.TIKTOK]: new IconTSInfo({ url: 'LogoTiktok', size: '30' }),
  [TS.ZEMANTA]: new IconTSInfo({ url: 'LogoZemanta' }),
  [TS.PINTEREST]: new IconTSInfo({ url: 'LogoPinterest', tail: 'png' }),
}
