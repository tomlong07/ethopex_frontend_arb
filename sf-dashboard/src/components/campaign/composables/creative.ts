import storage from '@/plugins/storage'

export function useSharedMethodCreative() {
  const beforeMountHandle = (data: Ref, FreezeData: any) => {
    if (FreezeData.isAddPage()) {
      storage.initWatch(data)
    }
  }

  const beforeMountHandle3 = (data: Ref, stateManager: any) => {
    if (stateManager.isAddPage()) {
      storage.initWatch(data)
    }
  }

  return {
    beforeMountHandle,
    beforeMountHandle3,
  }
}
