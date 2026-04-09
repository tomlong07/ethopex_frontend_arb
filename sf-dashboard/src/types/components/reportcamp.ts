export interface reportData {
  items: reportItem[]
  total: reportTotal
}

interface reportTotal {
  [key: string]: any
}
interface reportItem {
  [key: string]: any
}
