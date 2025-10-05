let chooseFromGallery = document.querySelector(".choose_from_gallery");
let fileInput = document.querySelector("#fileInput");
let imgPreview = document.querySelector(".imagePreview");
let imagePreviewCoverer = document.querySelector(".imagePreviewCoverer");
let crossButtonForImagePreview = document.querySelector(".ri-close-large-line");
let isImage = false;
let actualImage;
chooseFromGallery.addEventListener("click" , function(e){
    fileInput.click();
    cameraDiscontinue();
})

fileInput.addEventListener("change", (e) => {
    const files = e.target.files[0];

    if(files){
        const reader = new FileReader();

        reader.onload = function(e){
            actualImage = e.target.result;
            imagePreviewCoverer.style.display = "flex";
            imgPreview.style.backgroundImage = `url(${actualImage})`;
            isImage = true
        }

        reader.readAsDataURL(files);
    }
})

crossButtonForImagePreview.addEventListener("click" , ()=>{
    imagePreviewCoverer.style.display = "none";
    isImage = false;
})