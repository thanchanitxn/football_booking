let slideIndex = 0;
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slider img");
const totalSlides = slides.length;
let autoSlideInterval;

function moveSlide(direction) {
    slideIndex += direction;

   
    if (slideIndex >= totalSlides) {
        slideIndex = 0;
    }
   
    else if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
    }

    
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;

   
    resetAutoSlide();
}


function startAutoSlide() {
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);
}


function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}


startAutoSlide();
