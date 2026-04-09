import { readdirSync, statSync, readFileSync } from 'fs'
import { join, basename } from 'path'

// Thư mục chứa file .vue
const vueDir = './src/assets/icons'

// File index.ts chứa các export
const indexFilePath = './src/assets/index.ts'

// Hàm lấy tất cả các file từ thư mục đích
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = readdirSync(dirPath)

  files.forEach(function (file) {
    const filePath = join(dirPath, '/', file)
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
    } else {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

// Lấy tất cả file .vue trong thư mục đích
const vueFiles = getAllFiles(vueDir).filter((file) => file.endsWith('.vue'))

// Đọc nội dung của file index.ts
const indexFileContent = readFileSync(indexFilePath, 'utf-8')

// Hàm kiểm tra file Vue có được export hay không
function isFileExported(vueFile) {
  const fileNameWithoutExtension = basename(vueFile, '.vue') // Lấy tên file không có đuôi .vue

  // Sử dụng regex để kiểm tra xem file Vue có được export trong index.ts hay không
  const exportRegex = new RegExp(
    `export\\s+\\{\\s+default\\s+as\\s+.*\\s+\\}\\s+from\\s+['"]\\.\\/icons\\/${fileNameWithoutExtension}\\.vue['"]`
  )
  return exportRegex.test(indexFileContent)
}

let count = 0

// Kiểm tra từng file Vue
vueFiles.forEach((vueFile) => {
  const isExported = isFileExported(vueFile)
  if (!isExported) {
    console.log(`File không được sử dụng: ${vueFile}`)
    count++
  }
})

console.log('Tổng số file không được sử dụng: ', count)
