import writeXlsxFile from "write-excel-file"

export function exportToExcel(aoa: any[][], fileName = "report.xlsx") {
  const rows = aoa.map(row =>
    row.map(cell => ({ value: cell }))
  )

  return writeXlsxFile(rows, {
    fileName,
    sheet: "Sheet1",
  })
}