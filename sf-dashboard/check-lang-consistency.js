import fs from 'fs'
import path from 'path'

const langDir = 'src/lang'
const enDir = path.join(langDir, 'en')
const viDir = path.join(langDir, 'vi')

// Function to extract keys from a TS file (simple regex for object literals)
function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const match = content.match(/const \w+ = \{([\s\S]*?)\}/)
  if (!match) return new Set()
  const objStr = match[1]
  const keys = []
  const keyRegex = /(\w+):\s*['"]/g
  let keyMatch
  while ((keyMatch = keyRegex.exec(objStr)) !== null) {
    keys.push(keyMatch[1])
  }
  return new Set(keys)
}

function checkConsistency() {
  const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.ts'))
  // const viFiles = fs.readdirSync(viDir).filter((f) => f.endsWith('.ts'))

  const missingInVi = []
  const missingInEn = []

  for (const file of enFiles) {
    const enPath = path.join(enDir, file)
    const viPath = path.join(viDir, file)

    if (!fs.existsSync(viPath)) {
      console.warn(`File ${file} missing in vi/`)
      continue
    }

    const enKeys = extractKeys(enPath)
    const viKeys = extractKeys(viPath)

    for (const key of enKeys) {
      if (!viKeys.has(key)) {
        missingInVi.push(`${file}: ${key}`)
      }
    }

    for (const key of viKeys) {
      if (!enKeys.has(key)) {
        missingInEn.push(`${file}: ${key}`)
      }
    }
  }

  if (missingInVi.length > 0) {
    console.error('Missing keys in VI:', missingInVi)
  }
  if (missingInEn.length > 0) {
    console.error('Missing keys in EN:', missingInEn)
  }

  if (missingInVi.length === 0 && missingInEn.length === 0) {
    console.log('✅ Language files are consistent.')
  } else {
    console.error(
      '❌ Language files are inconsistent. Please check and add missing keys to ensure translations are complete.'
    )
    process.exit(1) // Exit with error to fail build
  }
}

checkConsistency()
