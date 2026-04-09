import { h } from 'vue'

export const adSizes = [
  {
    title: 'Square and rectangle',
    sizes: [
      { size: '200 × 200', titleSize: 'Small square' },
      { size: '240 × 400', titleSize: 'Vertical rectangle' },
      { size: '250 × 250', titleSize: 'Square' },
      { size: '250 × 360', titleSize: 'Triple widescreen' },
      { size: '300 × 250', titleSize: 'Inline rectangle' },
      { size: '336 × 280', titleSize: 'Large rectangle' },
      { size: '580 × 400', titleSize: 'Netboard' },
    ],
  },
  {
    title: 'Leaderboard',
    sizes: [
      { size: '468 × 60', titleSize: 'Banner' },
      { size: '728 × 90', titleSize: 'Leaderboard' },
      { size: '930 × 180', titleSize: 'Top banner' },
      { size: '970 × 90', titleSize: 'Large leaderboard' },
      { size: '970 × 250', titleSize: 'Billboard' },
      { size: '980 × 120', titleSize: 'Panorama' },
    ],
  },
  {
    title: 'Skyscraper',
    sizes: [
      { size: '120 × 600', titleSize: 'Skyscraper' },
      { size: '160 × 60', titleSize: 'Wide skyscraper' },
      { size: '300 × 600', titleSize: 'Half-page' },
      { size: '300 × 1050', titleSize: 'Portrait' },
    ],
  },
  {
    title: 'Mobile',
    sizes: [
      { size: '300 × 50', titleSize: 'Mobile banner' },
      { size: '320 × 50', titleSize: 'Mobile banner' },
      { size: '320 × 100', titleSize: 'Large mobile banner' },
    ],
  },
]

export const renderAdFormatContent = () =>
  h('div', { class: 'text-sm text-gray-800 space-y-3 max-w-md' }, [
    h('div', [
      h('h3', { class: 'font-semibold mb-1' }, 'Supported sizes and formats'),
    ]),

    h('div', [
      h('h4', { class: 'font-medium mb-2' }, 'File types'),
      h('p', null, 'Image Formats: GIF, JPG, PNG'),
      // h('p', null, 'AMPHTML Formats: ZIP containing 1 HTML document and up to 39 media assets.'),
      h('p', null, 'Max. size: 150KB for image files'),
    ]),

    h('div', [
      h('h4', { class: 'font-medium mb-2' }, 'Ad sizes'),
      h(
        'div',
        { class: 'grid grid-cols-2 gap-x-6 gap-y-3' },
        adSizes.map((group, idx) =>
          h('div', { key: idx }, [
            h(
              'p',
              { class: `mb-1 text-xs font-semibold ${idx > 1 ? 'mt-2' : ''}` },
              group.title
            ),

            ...group.sizes.map((item, i) =>
              h('p', { key: i, class: 'flex' }, [
                h('span', { class: 'w-24' }, item.size),
                h(
                  'span',
                  {
                    class:
                      'flex-1 whitespace-nowrap overflow-hidden text-ellipsis',
                  },
                  item.titleSize
                ),
              ])
            ),
          ])
        )
      ),
    ]),
  ])
