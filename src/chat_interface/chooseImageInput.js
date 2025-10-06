let chooseFromGallery = document.querySelector(".choose_from_gallery");
let fileInput = document.querySelector("#fileInput");
let imgPreview = document.querySelector(".imagePreview");
let imagePreviewCoverer = document.querySelector(".imagePreviewCoverer");
let crossButtonForImagePreview = document.querySelector(".ri-close-large-line");
let exit_photo_btn = document.querySelector(".exit_photo_btn");
let isImage = false;
let actualImage;


let openCamera = document.querySelector(".open_camera");
let cameraView = document.querySelector(".camera_view");
let video = document.getElementById("camera_stream");
let takePhotoButton = document.querySelector(".take_photo_btn");
let canvas = document.getElementById("canvas");

chooseFromGallery.addEventListener("click", function (e) {
    fileInput.click();
    cameraDiscontinue();
})


openCamera.addEventListener("click", async function () {
    cameraView.style.display = "block";
    cameraDiscontinue();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera: ", err);
    }
});

exit_photo_btn.addEventListener("click" , function(){
    cameraView.style.display = "none";
})

// Event listener to take the photo
takePhotoButton.addEventListener("click", function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    actualImage = canvas.toDataURL('image/png');
    imagePreviewCoverer.style.display = "flex";
    imgPreview.style.backgroundImage = `url(${actualImage})`;
    isImage = true;

    // Stop the camera stream and hide the camera view
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.srcObject = null;
    cameraView.style.display = "none";
});


fileInput.addEventListener("change", (e) => {
    const files = e.target.files[0];

    if (files) {
        const reader = new FileReader();

        reader.onload = function (e) {
            actualImage = e.target.result;
            imagePreviewCoverer.style.display = "flex";
            imgPreview.style.backgroundImage = `url(${actualImage})`;
            isImage = true
        }

        reader.readAsDataURL(files);
    }
})

crossButtonForImagePreview.addEventListener("click", () => {
    imagePreviewCoverer.style.display = "none";
    isImage = false;
})