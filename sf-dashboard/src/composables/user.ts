import { LOCAL_STORAGE_TOKEN, PUB_INFO } from '@/constants/storage'
import { ctr_user } from '@/services/ctr_user'
import Logging from '@/utils/Log'

export const quickLogin = async (dataUser: any, dataLogin: any) => {
  if (dataLogin.confirm) {
    if (
      !confirm(
        `Do you want to quick login to id: ${dataUser.id}\nEmail: ${dataUser.email}?`
      )
    ) {
      return
    }
  }

  //login vào subdomain để sử dụng song song
  if (helper.isProduction() && !helper.isDevelopment()) {
    subDomainLogin(dataUser, dataLogin)
    return
  }

  //ở local
  localLogin(dataUser)
}

const subDomainLogin = async (dataUser: any, dataLogin: any) => {
  const popup = window.open('', '_blank')
  if (!popup) {
    alert('Please allow popups for this site.')
    return
  }

  const doc = popup.document
  const body = doc.body || doc.createElement('body')
  body.innerHTML = `
  <h3>Logging in...</h3>
  <p>Please wait a moment</p>
`
  doc.body = body

  const payload = {
    email: dataUser.email,
    token: dataUser.login_token || dataUser.token,
  }

  const result = await ctr_user.QuickLogin(payload)
  if (!result?.status) return

  if (!dataLogin.quickLoginURL || !dataLogin.hostURL) {
    Logging.error('Missing quickLoginURL or hostURL', {
      _app: 'arb',
      quickLoginURL: dataLogin.quickLoginURL,
      hostURL: dataLogin.hostURL,
    })
  }

  let pubInfo = {
    email: payload.email,
    uif: result.data,
    hostURL: dataLogin.hostURL,
    quickLoginURL: dataLogin.quickLoginURL,
  }

  const d = new Date()
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000)
  let expires = 'expires=' + d.toUTCString()

  try {
    document.cookie = `${PUB_INFO}=${JSON.stringify(
      pubInfo
    )}; path=/; domain=.${dataLogin.hostURL}; expires=${expires}`

    window.message.success(
      `Login user: ${dataUser.id + ' - ' + dataUser.email} login success!`
    )
    await helper.sleep(300)

    popup.location.href = `${dataLogin.quickLoginURL}?t=${Date.now()}`
    return
  } catch (error) {
    Logging.error('Quick login error', {
      _app: 'arb',
      error: error,
    })
  }
}

const localLogin = async (dataUser: any) => {
  const payload = {
    email: dataUser.email,
    token: dataUser.login_token || dataUser.token,
  }

  const result = await ctr_user.QuickLogin(payload)
  if (!result?.status) return

  window.message.success(
    `Login user: ${dataUser.id + ' - ' + dataUser.email} login success!`
  )
  if (result.data) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN, JSON.stringify(result.data))
    window.location.href = '/'
  } else {
    console.error('No token')
  }
}
