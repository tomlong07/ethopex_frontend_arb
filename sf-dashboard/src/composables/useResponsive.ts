import { ref, onMounted, onBeforeUnmount } from 'vue';

export default function useResponsive(breakpoint = 1024) {
  const isResponsive = ref(false);

  const checkResponsive = () => {
    isResponsive.value = window.innerWidth <= breakpoint;
  };

  onMounted(() => {
    checkResponsive();
    window.addEventListener('resize', checkResponsive);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkResponsive);
  });

  return { isResponsive };
}
