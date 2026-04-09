import { menuNew } from '@/types/state/general'

type TreeItem<T> = T & { children: menuNew[] }

export function FlatToTree<T extends menuNew>(items: T[]): TreeItem<T>[] {
  const map = new Map<T['key'], TreeItem<T>>()
  const tree: TreeItem<T>[] = []

  const showItems = items.filter((item) => item.show)

  // init map
  showItems.forEach((item) => {
    map.set(item.key, {
      ...item,
      children: item.children ?? [],
    })
  })

  // build tree
  showItems.forEach((item) => {
    const node = map.get(item.key)!
    const parentId = item.parentId

    if (!parentId) {
      tree.push(node)
    } else {
      map.get(parentId)?.children.push(node)
    }
  })

  return tree
}
