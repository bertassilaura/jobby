function configurate_custom_sliders(){
    let custom_sliders = document.querySelectorAll(".custom-slider")
    custom_sliders.forEach( (custom_slider) => {
        let content = document.createElement("div")
        content.classList.add("custom-slider__view")
        let controls = document.createElement("div")
        controls.classList.add("custom-slider__controls")

        let back_button = document.createElement("span")
        back_button.classList.add("custom-slider__arrow", "fas", "fa-chevron-left")
        back_button.addEventListener("click", voltar)
        controls.appendChild(back_button)
        
        let dots = document.createElement("div")
        dots.classList.add("custom-slider__dots")

        let i = 0
        let children = custom_slider.children
        while(children.length > 0)
        {
            let slide = document.createElement("div")
            slide.classList.add("custom-slider__slide")
            slide.appendChild(children[0])
            content.appendChild(slide)

            let dot = document.createElement("div")
            dot.classList.add("custom-slider__dot")
            dot.setAttribute("index", i)
            dot.addEventListener("click", goToSlide)
            dots.appendChild(dot)
            i++;
        }

        dots.firstChild.classList.add("active")
        controls.append(dots)
        let next_button = document.createElement("span")
        next_button.classList.add("custom-slider__arrow", "fas", "fa-chevron-right")
        next_button.addEventListener("click", avancar)
        controls.appendChild(next_button)


        custom_slider.append(content)
        custom_slider.append(controls)
        custom_slider.setAttribute("current-slide", 0)
        console.log(controls)

    });


}

function avancar(){
    let slide_container = this.parentElement.parentElement
    let current_slide = parseInt(slide_container.getAttribute("current-slide"))
    current_slide += 1
    let slides = slide_container.querySelectorAll(".custom-slider__slide")
    if (current_slide >= slides.length){
        current_slide = 0;
    }

    slide_container.setAttribute("current-slide", current_slide)
    let dots = slide_container.querySelectorAll(".custom-slider__dot")

    for (let i = 0; i < slides.length; i++){
        slides[i].style.left = (current_slide * -100) + "%";
        dots[i].classList.remove("active")
    }
    dots[current_slide].classList.add("active")
}

function voltar(){
    let slide_container = this.parentElement.parentElement
    let current_slide = slide_container.getAttribute("current-slide")
    current_slide -= 1
    let slides = slide_container.querySelectorAll(".custom-slider__slide")
    if (current_slide < 0){
        current_slide = slides.length - 1;
    }

    slide_container.setAttribute("current-slide", current_slide)
    let dots = slide_container.querySelectorAll(".custom-slider__dot")

    for (let i = 0; i < slides.length; i++){
        slides[i].style.left = (current_slide * -100) + "%";
        dots[i].classList.remove("active")
    }
    dots[current_slide].classList.add("active")
}

function goToSlide(){
    let index = this.getAttribute("index")
    let slide_container = this.parentElement.parentElement.parentElement
    slide_container.setAttribute("current-slide", index)
    let dots = this.parentElement.querySelectorAll(".custom-slider__dot")
    let slides = slide_container.querySelectorAll(".custom-slider__slide")
    for (let i = 0; i < slides.length; i++){
        slides[i].style.left = (index * -100) + "%";
        dots[i].classList.remove("active")
    }
    dots[index].classList.add("active")
}

function goToSliderPosition(slide_container, index){
    slide_container.setAttribute("current-slide", index)
    let dots = slide_container.querySelectorAll(".custom-slider__dot")
    let slides = slide_container.querySelectorAll(".custom-slider__slide")
    for (let i = 0; i < slides.length; i++){
        slides[i].style.left = (index * -100) + "%";
        dots[i].classList.remove("active")
    }
    dots[index].classList.add("active")
}

configurate_custom_sliders()
