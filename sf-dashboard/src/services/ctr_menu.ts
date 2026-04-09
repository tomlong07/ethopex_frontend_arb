import api_v2 from '@/core/api_v2'

export const ctr_menu = {
  fetchMenuNew: async () => {
    try {
      const result = await api_v2.client.get('menu-new')
      return result.data
    } catch (ex: any) {
      if (
        ex &&
        ((ex.response && ex.response.data === 'Tokens are useless') ||
          (ex.message && ex.message === 'Request canceled, token expired'))
      ) {
        helper.UserLogOut()
      }

      const sc = document.createElement('link')
      sc.setAttribute(
        'href',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
      )
      sc.setAttribute('rel', 'stylesheet')
      document.head.appendChild(sc)

      const script = document.createElement('script')
      script.innerHTML = `function reload() {window.location.reload();}`
      document.head.appendChild(script)

      document.body.innerHTML = `
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
            <h1 class="display-1 fw-bold">${ex.message}</h1>
            <div href="/" class="btn btn-primary" onclick="reload()">Reload</div>
        </div>
      </div>`
    }
  },

  fetchModeSettings: async () => {
    return (
      (await api_v2.request({
        url: `/menu-mode-settings`,
      })) || {}
    )
  },
}
