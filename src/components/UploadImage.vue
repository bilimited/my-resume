<script setup lang="ts">
import { MsgErr, MsgInfo } from '@/utils/message';
import { NButton, NIcon, NInput, NInputNumber, NSelect, NText, type UploadFileInfo } from 'naive-ui';
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import 'cropperjs'
import type { CropperSelection } from 'cropperjs';
import { uploadFormData } from '@/utils/request';
// import Cropper from "cropperjs"
// import "cropperjs/dist/cropper.min.css"

// import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'

const emits = defineEmits(["onfinish","uploaded"])

// 照片已在内存
const photoLoaded = ref(false)
// 照片已上传到服务器
const photoUploaded = ref(false)

const dropZone = useTemplateRef('uploadZone');
const tmpImage = ref<string>("")
const selection = useTemplateRef<CropperSelection>("selection")


const aspectRatio = ref(1 / 1);
watch(aspectRatio, (v) => {
  (selection.value as CropperSelection).aspectRatio = v;
})

const aspectOptions = ref([
  {
    label: '自由比例',
    value: 'free',
  },
  {
    label: '1:1',
    value: 1,
  },
  {
    label: '一寸(25mm x 35mm)',
    value: 25 / 35,
  },
  {
    label: '小一寸(22mm x 32mm)',
    value: 22 / 32,
  },
  {
    label: '身份证(26mm x 32mm)',
    value: 26 / 32,
  },
  {
    label: '考研/教师资格证(41 x 54mm)',
    value: 41 / 54,
  },
  {
    label: '手动设置',
    value: 'unknown',
  }
])
const aspect = reactive({ x: 1, y: 1 });
const isfreeaspect = computed(() => {
  return aspectRatio.value as unknown === 'unknown'
})
watch(aspect, (v) => {
  (selection.value as CropperSelection).aspectRatio = (v.y / v.x);
})

onMounted(() => {
  dropZone.value.addEventListener('dragenter', (ev) => {
    dropZone.value.style.backgroundColor = "#444";
  })
  dropZone.value.addEventListener("dragover", function (event) {
    event.preventDefault();

  });
  dropZone.value.addEventListener('dragend', function () {
    dropZone.value.style.backgroundColor = "#4449";
  })
  dropZone.value.addEventListener("drop", function (event) {
    event.preventDefault();
    dropZone.value.style.backgroundColor = "#4449";
    const file = event.dataTransfer.files[0];
    handleFile(file);
  });
})

function handleFile(file: File) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (event) {
      tmpImage.value = event.target.result as string;
      photoLoaded.value = true;
      //new Cropper(image.value,{})
    };
    reader.readAsDataURL(file);
  } else {
    MsgErr("请上传图片！")

  }
}

function b64toBlob(b64Data, contentType, sliceSize = 512) {
    contentType = contentType || '';

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}


async function uploadFile(){
  const base64Data = await (await (selection.value.$toCanvas())).toDataURL()

  let block,contentType,data;
  try{
    block = base64Data.split(";");
    contentType = block[0].split(":")[1]; // 获取图片类型
    data = block[1].split(",")[1]; // 获取Base64编码的实际数据
  }catch(e:unknown){
    console.log(e);
    MsgErr("请裁剪照片！")
    return;
  }


  const blob = b64toBlob(data,contentType);
  const formData = new FormData();
  // 添加Blob到FormData中
  formData.append("file", blob, "uploadfile.png");
  console.log(data,blob,formData);

  const res = await uploadFormData('upload/photo',formData);
  console.log(res);
  if(res.code == 200){
    MsgInfo("上传成功！")
    emits("uploaded")
  }else{
    MsgErr("上传失败！不知道为啥")
  }
}

</script>

<template>
  <div class="imageloader">
    <h3>上传证件照</h3>

    <div class="upload-zone" ref="uploadZone" v-if="!photoLoaded">

      <div style="margin-bottom: 12px;margin-top: 40px;">
        <NIcon size="48" :depth="3">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="4" rx="2"></rect>
              <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"></path>
              <path d="M10 12h4"></path>
            </g>
          </svg>
        </NIcon>
      </div>
      <NText style="font-size: 16px">
        点击或者拖动文件到该区域来上传
      </NText>
    </div>

    <div class="edit-zone" ref="editZone" v-show="photoLoaded">
      <!-- <img ref="image" class="img"  :src="tmpImage"/> -->
      <div class="cropper-zone">
        <cropper-canvas class="cropper" background>
          <cropper-image :src="tmpImage" alt="Picture" rotatable scalable skewable translatable></cropper-image>
          <cropper-shade hidden></cropper-shade>
          <cropper-handle action="select" plain></cropper-handle>
          <cropper-selection initial-coverage="0.5" movable resizable ref="selection">
            <cropper-grid role="grid" covered></cropper-grid>
            <cropper-crosshair centered></cropper-crosshair>
            <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
            <cropper-handle action="n-resize"></cropper-handle>
            <cropper-handle action="e-resize"></cropper-handle>
            <cropper-handle action="s-resize"></cropper-handle>
            <cropper-handle action="w-resize"></cropper-handle>
            <cropper-handle action="ne-resize"></cropper-handle>
            <cropper-handle action="nw-resize"></cropper-handle>
            <cropper-handle action="se-resize"></cropper-handle>
            <cropper-handle action="sw-resize"></cropper-handle>
          </cropper-selection>
        </cropper-canvas>
      </div>

      <div style="width: 50%;">
        <p style="margin-bottom: 15px;">在图片上拖动以裁剪图片</p>
        <label>尺寸比例</label>
        <NSelect v-model:value="aspectRatio" :options="aspectOptions"></NSelect>
        <div v-if="isfreeaspect">

          <label>长（mm）</label>
          <NInputNumber v-model:value="aspect.x"></NInputNumber>
          <label>宽（mm）</label>
          <NInputNumber v-model:value="aspect.y"></NInputNumber>
        </div>

      </div>

    </div>

    <div v-if="photoLoaded" style="display: flex; margin-top: 30px; justify-content: center;">
      <NButton type="primary" @click="uploadFile">完成</NButton>
      <NButton style="margin-left: 30px;" @click="photoLoaded = false">重新上传</NButton>

    </div>
  </div>
</template>

<style lang="css" scoped>
.imageloader {
  position: relative;
  background-color: rgb(51, 51, 51);
  border-radius: 15px;
  width: 700px;
  height: 400px;
  padding: 20px;

}

.upload-zone {
  width: auto;
  height: 70%;
  padding: 20px;
  background-color: #4449;
  border-radius: 11px;
  border: 2px dashed #666;

  text-align: center;
}

.edit-zone {
  height: 70%;
  display: flex;
}

.cropper-zone {
  height: 100%;
  width: 40%;
  margin-right: 30px;
}

.cropper {
  height: 100%;
  width: 100%;
}



.img {
  object-fit: contain;
  max-width: 100%;
  width: 100%;
  height: 100%;
}

h3 {
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
