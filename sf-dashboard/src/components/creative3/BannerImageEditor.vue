<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="(data, index) in matchedAdSizes" :key="index">
      <div 
        v-if="!isProcessedAndReady[index]"
        class="w-full h-64 border bg-gray-100 flex items-center justify-center text-gray-500 rounded-md"
      >
        <span>Loading...</span>
      </div>

      <VueCropper
        v-show="isProcessedAndReady[index]"
        :ref="(el:any) => crops[index] = el"
        class="w-full h-64 border"
        :view-mode="1"
        :background="false"
        :responsive="true"
        :autoCrop="false"
        :drag-mode="'none'"
        :zoomable="false"
        :scalable="false"
        :cropBoxMovable="false"
        :cropBoxResizable="false"
        :src="src(props.dataImage?.image)"
        @ready="onReady(index)"
      />

      <div class="flex mt-2">
        <div class="ratio-value flex flex-row gap-4 items-center">
          <n-tag size="large"> {{ data.name }} - {{ data.ratio }}</n-tag>

          <n-switch
            v-model:value="data.off"
            :checked-value="false"
            :unchecked-value="true"
          >
            <template #checked-icon>
              <n-icon :component="Checkmark" color="#121212" />
            </template>
            <template #unchecked-icon>
              <n-icon :component="Close" />
            </template>
          </n-switch>
        </div>
      </div>
      <div class="flex items-center mt-1">
        <n-icon :component="Checkmark" size="18" color="#18a058" />
        <span> Width: {{ data?.width }}px, Height: {{ data?.height }}px </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//@ts-ignores
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import type Cropper from "cropperjs";
import { ref, computed } from "vue";
import Close from "@/assets/icons/Close.vue";
import Checkmark from "@/assets/icons/Checkmark.vue";
import { URL_UPLOAD } from "@/constants/urls";

interface VueCropperInstance {
  cropper: Cropper;
}

interface AdSize {
  width: number;
  height: number;
  name: string;
  category: string;
}

interface ImageRatioData {
  ratio: string;
  off: boolean;
  by_ai: boolean;
  change: boolean;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotate: number;
    scaleX: number;
    scaleY: number;
  };
}

interface MatchedAdSize extends ImageRatioData {
  width: number;
  height: number;
  name: string;
}

const props = defineProps<{
  dataImage?: {
    image?: string;
    image_ratio?: ImageRatioData[];
    [key: string]: any;
  };
}>();

const adSizes: AdSize[] = [
  { width: 200, height: 200, name: "Small square", category: "Square and rectangle" },
  {
    width: 240,
    height: 400,
    name: "Vertical rectangle",
    category: "Square and rectangle",
  },
  {
    width: 250,
    height: 360,
    name: "Triple widescreen",
    category: "Square and rectangle",
  },
  { width: 300, height: 250, name: "Inline rectangle", category: "Square and rectangle" },
  { width: 336, height: 280, name: "Large rectangle", category: "Square and rectangle" },
  { width: 580, height: 400, name: "Netboard", category: "Square and rectangle" },
  { width: 120, height: 600, name: "Skyscraper", category: "Skyscraper" },
  { width: 160, height: 600, name: "Wide skyscraper", category: "Skyscraper" },
  { width: 300, height: 600, name: "Half-page", category: "Skyscraper" },
  { width: 300, height: 1050, name: "Portrait", category: "Skyscraper" },
  { width: 468, height: 60, name: "Banner", category: "Leaderboard" },
  { width: 728, height: 90, name: "Leaderboard", category: "Leaderboard" },
  { width: 930, height: 180, name: "Top banner", category: "Leaderboard" },
  { width: 970, height: 90, name: "Large leaderboard", category: "Leaderboard" },
  { width: 970, height: 250, name: "Billboard", category: "Leaderboard" },
  { width: 980, height: 120, name: "Panorama", category: "Leaderboard" },
  { width: 300, height: 50, name: "Mobile banner", category: "Mobile" },
  { width: 320, height: 50, name: "Mobile banner", category: "Mobile" },
  { width: 250, height: 250, name: "Square", category: "Square and rectangle" },
  { width: 320, height: 100, name: "Large mobile banner", category: "Mobile" },
];

const parseRatio = (ratioStr: string) => {
  const [w, h] = ratioStr.split(":").map((s) => parseInt(s.replace("px", ""), 10));
  return { width: w, height: h };
};

const matchedAdSizes = computed<MatchedAdSize[]>(() => {
  const imageRatios: ImageRatioData[] = props.dataImage?.image_ratio ?? [];

  return imageRatios
    .map((ratioData: ImageRatioData) => {
      const { width: ratioW, height: ratioH } = parseRatio(ratioData.ratio);

      const adMatch = adSizes.find((ad) => {
        return ad.width === ratioW && ad.height === ratioH;
      });

      return {
        ...ratioData,
        width: ratioW,
        height: ratioH,
        name: adMatch ? adMatch.name : "Custom Size",
      };
    })
    .filter(Boolean);
});

const src = (url: string | undefined) => {
  if (!url) return "";
  if (url.includes("http")) return url;

  if (!url.includes(URL_UPLOAD)) url = URL_UPLOAD + url;
  return url;
};

const crops = ref<(VueCropperInstance | null)[]>([]);
const isProcessedAndReady = ref<boolean[]>([]);

const onReady = (index: number) => {
  
  if (isProcessedAndReady.value[index] === undefined) {
      isProcessedAndReady.value[index] = false;
  }
  
  if (isProcessedAndReady.value[index]) return; 

  exportResized(index);
  isProcessedAndReady.value[index] = true;
};

const exportResized = (index: number) => {
  const cropper = crops.value[index]?.cropper;
  if (!cropper) return;

  const ad = matchedAdSizes.value[index];
  if (!ad) return;

  const { width: targetW, height: targetH } = ad;
  const imgData = cropper.getImageData();
  const naturalW = imgData.naturalWidth;
  const naturalH = imgData.naturalHeight;

  const targetRatio = targetW / targetH;
  let cropW = naturalW;
  let cropH = naturalH;

  if (naturalW / naturalH > targetRatio) cropW = naturalH * targetRatio;
  else if (naturalW / naturalH < targetRatio) cropH = naturalW / targetRatio;

  const imgCanvas = cropper.getCroppedCanvas({ width: cropW, height: cropH });

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d")!;
  
  ctx.drawImage(imgCanvas, 0, 0, targetW, targetH);

  
  const resizedUrl = canvas.toDataURL("image/png");
  cropper.replace(resizedUrl);

  const newCoordinates = {
    x: 0,
    y: 0,
    width: targetW,
    height: targetH,
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
  };
  if (props.dataImage?.image_ratio?.[index]) {
    props.dataImage.image_ratio[index].coordinates = newCoordinates;
  }
};
</script>