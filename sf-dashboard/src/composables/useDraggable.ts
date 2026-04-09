export function useDraggable(
  elRef: Ref<HTMLElement | null>,
  options?: {
    center?: boolean
    offset?: { top?: number; left?: number; bottom?: number; right?: number }
  }
) {
  const position = ref({ x: 0, y: 0 })
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })

  const applyOffset = async () => {
    await nextTick()
    const el = elRef.value
    if (!el) return

    const { offset } = options || {}

    if (offset?.left !== undefined) position.value.x = offset.left
    if (offset?.top !== undefined) position.value.y = offset.top

    if (offset?.bottom !== undefined) {
      position.value.y = window.innerHeight - el.offsetHeight - offset.bottom
    }

    if (offset?.right !== undefined) {
      position.value.x = window.innerWidth - el.offsetWidth - offset.right
    }
  }

  const applyCenter = async () => {
    await nextTick()
    const el = elRef.value
    if (!el) return
    position.value = {
      x: (window.innerWidth - el.offsetWidth) / 2,
      y: (window.innerHeight - el.offsetHeight) / 2,
    }
  }

  onMounted(() => {
    if (options?.center) {
      applyCenter()
      window.addEventListener('resize', applyCenter)
    } else if (options?.offset) {
      applyOffset()
      window.addEventListener('resize', applyOffset)
    }
  })

  const startDrag = (e: MouseEvent) => {
    if (!elRef.value) return
    isDragging.value = true

    const rect = elRef.value.getBoundingClientRect()
    dragOffset.value = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  const onDrag = (e: MouseEvent) => {
    if (!isDragging.value) return
    e.preventDefault()
    position.value = {
      x: e.clientX - dragOffset.value.x,
      y: e.clientY - dragOffset.value.y,
    }
  }

  const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  const startTouchDrag = (e: TouchEvent) => {
    if (!elRef.value) return
    isDragging.value = true

    const touch = e.touches[0]
    const rect = elRef.value.getBoundingClientRect()

    dragOffset.value = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    }

    document.addEventListener('touchmove', onTouchDrag)
    document.addEventListener('touchend', stopTouchDrag)
  }

  const onTouchDrag = (e: TouchEvent) => {
    if (!isDragging.value) return
    const touch = e.touches[0]
    position.value = {
      x: touch.clientX - dragOffset.value.x,
      y: touch.clientY - dragOffset.value.y,
    }
  }

  const stopTouchDrag = () => {
    isDragging.value = false
    document.removeEventListener('touchmove', onTouchDrag)
    document.removeEventListener('touchend', stopTouchDrag)
  }

  return { position, startDrag, startTouchDrag }
}
