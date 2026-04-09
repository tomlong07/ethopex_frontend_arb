const VER = '2.0'
const KEY_STORAGE_REPORT = 'save_rp'

export const ReportV2 = {
  KEY_STORAGE_SHOW_CHART: 'isShowChart',
  KEY_STORAGE_AUTO_SYNC: 'isAutoSync',
  KEY_STORAGE_SAVE_REPORT: KEY_STORAGE_REPORT + '_v' + VER,
}

//Xóa bỏ dữ liệu cũ nếu đổi ver
try {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key) continue
    if (key?.includes(KEY_STORAGE_REPORT) && !key?.includes(VER)) {
      localStorage.removeItem(key)
      // Sau khi xoá một mục, độ dài của localStorage thay đổi,
      // nên cần điều chỉnh chỉ số i để không bỏ qua bất kỳ mục nào
      i--
    }

    if (
      [
        ReportV2.KEY_STORAGE_SHOW_CHART,
        ReportV2.KEY_STORAGE_AUTO_SYNC,
      ].includes(key)
    ) {
      localStorage.removeItem(key)
    }
  }
} catch (error) {
  console.error(error)
}
