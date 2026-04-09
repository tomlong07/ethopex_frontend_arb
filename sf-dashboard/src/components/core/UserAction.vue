<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import {
  MenuOption,
  NAvatar,
  NIcon,
  NText,
  NDropdown,
  NButton,
  SelectOption,
  NSpin,
} from 'naive-ui'
import { genRouter } from '@/components/core/helper'
import { ctr_user } from '@/services/ctr_user'
import PersonCircle from '@/assets/icons/PersonCircle.vue'
import { quickLogin } from '@/composables/user'
import { LANGUAGE, Locale } from '@/enum/language'
import { CDN_IMAGE_MINIO_S3_IMAGE } from '@/constants/urls'

const generalStore = useGeneralStore()
const userOptions = computed<MenuOption[]>(() => {
  const menuUsers: MenuOption[] = [
    {
      key: 'header',
      type: 'render',
      render: renderCustomHeader,
    },
    {
      key: 'lang',
      type: 'render',
      render: renderLang,
    },
    ...generalStore.menuRouter.filter((item) => item.profile).map(genRouter),
    {
      key: 'system_settings',
      label: 'System Settings',
    },
    {
      key: 'logout',
      label: 'Log out',
    },
  ]

  return menuUsers
})

const childUsers = ref<SelectOption[]>([])
const isLoadingChildUsers = ref<boolean>(false)

const handleShow = (visible: boolean) => {
  if (visible && window.arb.isAdmin()) {
    getChildUsers()
  }
}

const getChildUsers = async () => {
  isLoadingChildUsers.value = true
  const result = await ctr_user.GetListPublisherByAccManager()

  childUsers.value = result?.data || []
  isLoadingChildUsers.value = false
}
const renderCustomHeader = () => {
  let divs = [
    // avatar + info
    h('div', { style: 'display: flex; align-items: center;' }, [
      h(NAvatar, {
        round: true,
        style: `margin-right: 12px;background-image: url(${CDN_IMAGE_MINIO_S3_IMAGE}/Favicon-7.png)`,
        class: 'Favicon-7',
      }),
      h('div', { class: 'w-32' }, [
        h(
          'div',
          { class: 'truncate' }, // text dài auto truncate
          [
            h(
              NText,
              { depth: 2, title: generalStore.userEmailShow },
              { default: () => generalStore.userEmailShow }
            ),
          ]
        ),
        h('div', { class: 'truncate text-xs' }, [
          h(
            NText,
            { depth: 3, title: generalStore.userNameShow },
            { default: () => generalStore.userNameShow }
          ),
        ]),
      ]),
    ]),
  ]

  if (window.arb.isAdmin() && childUsers.value.length > 0) {
    divs.push(
      h(
        'div',
        {
          class: 'scroll-thin-custom',
          style:
            'max-height: 150px; overflow-y: auto; margin-top: 8px; border-top: 1px solid #eee; padding-top: 8px;',
        },
        isLoadingChildUsers.value
          ? h(
              'div',
              {
                style:
                  'display: flex; justify-content: center; align-items: center; height: 50px;',
              },
              [h(NSpin)]
            )
          : childUsers.value?.map((u) =>
              h(
                'div',
                {
                  class:
                    'flex flex-col px-2 py-1 cursor-pointer rounded-md transition-colors hover:bg-gray-100',
                  title: `${u.name} (${u.email})`,
                  onClick: () => {
                    quickLogin(u, {
                      quickLoginURL: generalStore.quickLoginURL,
                      hostURL: generalStore.hostURL,
                    })
                  },
                },
                [
                  h(
                    NText,
                    { depth: 2, class: 'truncate' },
                    { default: () => u.name }
                  ),
                  h(
                    NText,
                    { depth: 3, class: 'truncate text-xs text-gray-500' },
                    { default: () => u.email }
                  ),
                ]
              )
            )
      )
    )
  }

  return h(
    'div',
    {
      style:
        'display: flex; flex-direction: column; gap: 8px; padding: 8px 12px; width: 220px;',
    },
    divs
  )
}

const langOptions = [
  {
    label: 'English',
    key: Locale.EN,
  },
  {
    label: 'Vietnamese',
    key: Locale.VI,
  },
]

const renderLang = () => {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 12px;',
    },
    [
      h(
        NDropdown,
        {
          options: langOptions,
          onSelect: changeLanguage,
          class: 'custom-dropdown-adg-creative',
        },
        {
          default: () =>
            h(NButton, { type: 'info', size: 'small' }, () =>
              arb.lang?.toUpperCase()
            ),
        }
      ),
    ]
  )
}

const changeLanguage = async (key: string) => {
  const result = await ctr_user.MessageLangChange(key)
  if (result?.status) {
    const normalized = key.toLowerCase().startsWith(Locale.VI)
      ? Locale.VI
      : Locale.EN
    localStorage.setItem(LANGUAGE.K, normalized)
    if (window.arb) {
      window.arb.lang = normalized
    }
    window.location.reload()
  }
}

const isSystemSettings = ref<boolean>(false)
const SettingDrawer = defineAsyncComponent(
  () => import('@/views/SettingDrawer.vue')
)

const clickUserFunc = async (key: string) => {
  if (key === 'logout') {
    helper.UserLogOut()
    return
  }

  if (key === 'system_settings') {
    isSystemSettings.value = true
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <n-dropdown
      trigger="click"
      :options="userOptions"
      class="mt-16 custom-user-action-dropdown custom-dropdown-adg-creative"
      @select="clickUserFunc"
      @update:show="handleShow"
    >
      <n-icon
        :component="PersonCircle"
        color="#6195c5"
        size="30"
        class="cursor-pointer"
        :title="generalStore.userFullInfoShow"
      />
    </n-dropdown>

    <SettingDrawer v-if="isSystemSettings" v-model:visible="isSystemSettings" />
  </div>
</template>
