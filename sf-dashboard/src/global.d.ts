// global.d.ts
declare module NodeJS {
  interface Global {
    fmt: typeof import('@/core/fmt').fmt
    arb: typeof import('@/core/window').globalARB
    helper: typeof import('@/utils/helper').default
  }
}

//Dùng để log in message, ...
declare const fmt: typeof import('@/core/fmt').fmt

//Dùng để lưu trữ debug, dev, ajax, payload, message theo language...
declare const arb: typeof import('@/core/window').globalARB

//Helper
declare const helper: typeof import('@/utils/helper').default
