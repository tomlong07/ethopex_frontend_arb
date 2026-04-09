import Logging from '@/utils/Log'

export function setupAGGridLogger() {
  const originalWarn = console.warn
  const originalError = console.error
  console.warn = function (...args) {
    const message = args.join(' ')

    if (message.includes('Vue warn')) {
      Logging.warning('AG Grid Warning', {
        _app: 'arb',
        message: message,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      })
    }

    originalWarn.apply(console, args)
  }

  console.error = function (...args) {
    const message = args.join(' ')
    if (message.includes('AG Grid') || message.includes('error #')) {
      const errorMatch = message.match(/error #(\d+)/)
      const errorCode = errorMatch ? errorMatch[1] : 'unknown'

      // Extract error URL
      const urlMatch = message.match(/(https:\/\/[^\s]+)/)
      const errorUrl = urlMatch ? urlMatch[1] : null

      Logging.error('AG Grid Error', {
        _app: 'arb',
        message: message,
        errorCode: errorCode,
        errorUrl: errorUrl,
        url: window.location.href,
        stack: new Error().stack,
        timestamp: new Date().toISOString(),
      })
    }
    originalError.apply(console, args)
  }
}
