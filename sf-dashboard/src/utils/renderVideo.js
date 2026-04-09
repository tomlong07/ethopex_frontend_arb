export const importFileandPreview = (file, revoke) => {
  return new Promise((resolve) => {
    window.URL = window.URL || window.webkitURL
    let preview = window.URL.createObjectURL(file)
    // remove reference
    if (revoke) {
      window.URL.revokeObjectURL(preview)
    }
    setTimeout(() => {
      resolve(preview)
    }, 100)
  })
}

// export const generateVideoThumbnails = async (
//   videoFile,
//   numberOfThumbnails,
//   type
// ) => {
//   let thumbnail = []
//   let fractions = []
//   return type !== 'url'
//     ? new Promise(async (resolve, reject) => {
//         if (!videoFile.type?.includes('video')) reject('not a valid video file')
//         await getVideoDuration(videoFile).then(async (duration) => {
//           // divide the video timing into particular timestamps in respective to number of thumbnails
//           // ex if time is 10 and numOfthumbnails is 4 then result will be -> 0, 2.5, 5, 7.5 ,10
//           // we will use this timestamp to take snapshots
//           for (let i = 0; i <= duration; i += duration / numberOfThumbnails) {
//             fractions.push(Math.floor(i))
//           }
//           // the array of promises
//           let promiseArray = fractions.map((time) => {
//             return getVideoThumbnail(videoFile, time)
//           })
//           await Promise.all(promiseArray)
//             .then((res) => {
//               res.forEach((res) => {
//                 thumbnail.push(res)
//               })
//               resolve(thumbnail)
//             })
//             .catch((err) => {
//               console.error(err)
//             })
//             .finally((res) => {
//               resolve(thumbnail)
//             })
//         })
//         reject('something went wrong')
//       })
//     : new Promise(async (resolve, reject) => {
//         await getVideoDuration(videoFile).then(async (duration) => {
//           // divide the video timing into particular timestamps in respective to number of thumbnails
//           // ex if time is 10 and numOfthumbnails is 4 then result will be -> 0, 2.5, 5, 7.5 ,10
//           // we will use this timestamp to take snapshots
//           for (let i = 0; i <= duration; i += duration / numberOfThumbnails) {
//             fractions.push(Math.floor(i))
//           }
//           // the array of promises
//           let promiseArray = fractions.map((time) => {
//             return getVideoThumbnail(videoFile, time)
//           })
//           await Promise.all(promiseArray)
//             .then((res) => {
//               res.forEach((res) => {
//                 thumbnail.push(res)
//               })
//               resolve(thumbnail)
//             })
//             .catch((err) => {
//               reject(err)
//             })
//             .finally((res) => {
//               resolve(thumbnail)
//             })
//         })
//         reject('something went wrong')
//       })
// }

// const getVideoThumbnail = (file, videoTimeInSeconds) => {
//   return new Promise((resolve, reject) => {
//     if (file?.type?.match('video')) {
//       importFileandPreview(file).then((urlOfFIle) => {
//         generateVideoThumbnailViaUrl(urlOfFIle, videoTimeInSeconds).then(
//           (res) => {
//             resolve(res)
//           }
//         )
//       })
//     } else if (file) {
//       generateVideoThumbnailViaUrl(file, videoTimeInSeconds)
//         .then((res) => {
//           resolve(res)
//         })
//         .catch((err) => {
//           reject(err)
//         })
//     } else {
//       reject('file not valid')
//     }
//   })
// }

// const generateVideoThumbnailViaUrl = (urlOfFIle, videoTimeInSeconds) => {
//   return new Promise((resolve, reject) => {
//     try {
//       var video = document.createElement('video')
//       var timeupdate = function () {
//         if (snapImage()) {
//           video.removeEventListener('timeupdate', timeupdate)
//           video.pause()
//         }
//       }
//       video.addEventListener('loadeddata', function () {
//         if (snapImage()) {
//           video.removeEventListener('timeupdate', timeupdate)
//         }
//       })
//       var snapImage = function () {
//         var canvas = document.createElement('canvas')
//         canvas.width = video.videoWidth
//         canvas.height = video.videoHeight
//         canvas
//           .getContext('2d')
//           .drawImage(video, 0, 0, canvas.width, canvas.height)
//         var image = canvas.toBlob(
//           (blob) => {
//             var reader = new FileReader()
//             reader.readAsDataURL(blob)
//             reader.onloadend = function () {
//               var base64data = reader.result
//               resolve(base64data)
//             }
//           },
//           'image/jpeg',
//           0.7 /* quality */
//         )
//         var success = image?.length > 100000
//         if (success) {
//           URL.revokeObjectURL(urlOfFIle)
//           resolve(image)
//         }
//         return success
//       }
//       video.addEventListener('timeupdate', timeupdate)
//       video.preload = 'metadata'
//       video.src = urlOfFIle
//       // Load video in Safari / IE11
//       video.muted = true
//       video.playsInline = true
//       video.setAttribute('crossOrigin', '')
//       video.currentTime = videoTimeInSeconds
//       video
//         .play()
//         .then()
//         .catch((err) => {
//           reject({
//             status: 500,
//             reason: `Access to video at ${urlOfFIle} from origin ${window.location.hostname} has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`,
//             message: err,
//           })
//         })
//     } catch (error) {
//       reject(error)
//     }
//   })
// }

export const getVideoDuration = (videoFile) => {
  return new Promise((resolve, reject) => {
    if (videoFile) {
      if (videoFile?.type?.match('video')) {
        importFileandPreview(videoFile).then((url) => {
          generateVideoDuration(url).then((res) => {
            resolve(res)
          })
        })
      } else {
        generateVideoDuration(videoFile).then((res) => {
          resolve(res)
        })
      }
    } else {
      reject(0)
    }
  })
}

const generateVideoDuration = (url) => {
  return new Promise((resolve) => {
    let video = document.createElement('video')
    video.addEventListener('loadeddata', function () {
      resolve(video.duration)
      window.URL.revokeObjectURL(url)
    })
    video.preload = 'metadata'
    video.src = url
    // Load video in Safari / IE11
    video.muted = true
    video.playsInline = true
    video.play()
  })
}
