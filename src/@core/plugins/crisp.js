export default () => {
  window.$crisp = []
  window.CRISP_WEBSITE_ID = '91f9372c-da18-40da-89bf-1a114a832ac0';

  (function () {
    const d = document
    const s = d.createElement('script')

    s.src = 'https://client.crisp.chat/l.js'
    s.async = 1
    d.getElementsByTagName('head')[0].appendChild(s)
  }())
}
