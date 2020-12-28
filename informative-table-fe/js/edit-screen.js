let slides = [{
    type: 'Custom Content',
    id: new Date().getTime(),
    content: {
        title: 'New Employee',
        image: 'assets/images/employee.jpeg',
        description: '<h1>Welcome to Emilija Gjorgievska</h1><p><strong>Emilija Gjorgievska</strong> is our latest addition to the Microsoft Practice.</p>'
    }
}];
let carousel;
let quill;

$(document).ready(function(){
    if(slides.length) {
        addCarouselItems();
        initCarousel();
    }
});

function addCarouselItems(){
    let slidesCarouselElement = document.getElementById('slides-carousel');
    slidesCarouselElement.innerHTML = null;
    slides.forEach(e => {
        const slide = document.createElement('div');
        slide.className = 'slide-widget';
        slide.id = e.id;
        slide.innerText = e.content.title;
        slide.onclick = configureSlide
        slidesCarouselElement.appendChild(slide);
    });
}

function initCarousel(){
    carousel = $('.owl-carousel').owlCarousel({
        margin:10,
        dots: false,
        mouseDrag: false,
        responsiveClass:true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            400:{
                items:2,
                nav:true
            },
            768:{
                items:3,
                nav:true
            }
        }
    });
}

function addNewSlide() {
    const slideType = document.getElementById('new-slide-type').value;
    if (slideType === 'Custom Content') {
        const slide = {
            type: 'Custom Content',
            id: new Date().getTime(),
            content: {
                title: 'Custom Content',
                image: null,
                description: ''
            }
        }
        slides.push(slide);
    } else  if (slideType === 'Number of employees') {
        const slide = {
            type: 'Number of employees',
            id: new Date().getTime(),
            content: {
                title: 'Number of employees',
                number: 0,
                image: null
            }
        }
        slides.push(slide);
    } else  {
        const slide = {
            type: 'Projects Info',
            id: new Date().getTime(),
            content: {
                title: 'Projects Info',
                active: null,
                finished: null,
                queue: null,
                image: null
            }
        }
        slides.push(slide);
    }
    
    if(carousel) {
        carousel.trigger("destroy.owl.carousel");
    }

    addCarouselItems();
    initCarousel();
    $('#add-new-slide-modal').modal('hide');
    document.getElementById(slides[slides.length - 1].id).click();
    carousel.trigger("to.owl.carousel", [slides.length - 1, 500]);
}

function configureSlide(e) {
    const elements = [...document.getElementsByClassName('selected-slide')];
    elements.forEach( e => e.classList.remove('selected-slide'));
    e.target.classList.add('selected-slide');
    const slide = slides.find( s => s.id.toString() === e.target.id);
    const configElement = document.getElementById('configure-slide');
    configElement.innerHTML = generateSlideTemplate(slide);
    if (slide.type === 'Custom Content') {
        quill = new Quill('#description-editor', {
            modules: {
                imageResize: {
                    displaySize: true // default false
                },
                toolbar: [
                  [{ header: [1, 2, 3, 4, false] }],
                  ['bold', 'italic', 'underline', { 'align': [] }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['image','code-block']
                ]
            },
            placeholder: 'Enter description...',
            theme: 'snow'
        });
    }
}

function generateSlideTemplate(slide) {
    if (slide.type === 'Custom Content') {
        let image = '';
        if(slide.content.image) {
            image = `<img src="${slide.content.image}" class="employee-image" />
            <span title="Remove background image" onclick="removeBackgroundImage(${slide.id})">&times;</span>`;
        }
        return `<div class="form-group">
        <label for="title">Title:</label>
        <input type="text" class="form-control" value="${slide.content.title}" id="title">
    </div>
    <div class="form-group">
        <label>Content:</label>
        <div id="description-editor">${slide.content.description}</div>
    </div>
    <div class="form-group mb-5">
        <label for="image" class="d-block mb-0">Background Image:</label>
        <div class="bg-image-wrap" id="${slide.id}-bg-img">
        ${image}
        </div>
        <input onchange="imgChange(this, ${slide.id})" class="d-block" type="file" accept="image/x-png,image/jpeg,image/jpg" id="${slide.id}-image" />
    </div>
    <button type="button" class="btn btn-info">Preview</button>
    <button type="button" onclick="saveSlide()" class="btn btn-primary">Save</button>`;
    } else  if (slide.type === 'Number of employees') {
        let image = '';
        if(slide.content.image) {
            image = `<img src="${slide.content.image}" class="employee-image" />
            <span title="Remove background image" onclick="removeBackgroundImage(${slide.id})">&times;</span>`;
        }
        return `<div class="form-group">
        <label for="title">Title:</label>
        <input type="text" class="form-control" value="${slide.content.title}" id="title">
    </div>
    <div class="form-group mb-5">
        <label for="image" class="d-block mb-0">Background Image:</label>
        <div class="bg-image-wrap" id="${slide.id}-bg-img">
        ${image}
        </div>
        <input onchange="imgChange(this, ${slide.id})" class="d-block" type="file" accept="image/x-png,image/jpeg,image/jpg" id="${slide.id}-image" />
    </div>
    <button type="button" class="btn btn-info">Preview</button>
    <button type="button" onclick="saveSlide()" class="btn btn-primary">Save</button>`;
    } else  {
        let image = '';
        if(slide.content.image) {
            image = `<img src="${slide.content.image}" class="employee-image" />
            <span title="Remove background image" onclick="removeBackgroundImage(${slide.id})">&times;</span>`;
        }
        return `<div class="form-group">
        <label for="title">Title:</label>
        <input type="text" class="form-control" value="${slide.content.title}" id="title">
    </div>
    <div class="form-group">
        <label for="active-projects">Number of Active Projects:</label>
        <input type="number" class="form-control" value="${slide.content.active}" id="active-projects">
    </div>
    <div class="form-group">
        <label for="finished-projects">Number of Finished Projects:</label>
        <input type="number" class="form-control" value="${slide.content.finished}" id="finished-projects">
    </div>
    <div class="form-group">
        <label for="queue-projects">Number of Projects in Queue:</label>
        <input type="number" class="form-control" value="${slide.content.queue}" id="queue-projects">
    </div>
    <div class="form-group mb-5">
        <label for="image" class="d-block mb-0">Background Image:</label>
        <div class="bg-image-wrap" id="${slide.id}-bg-img">
        ${image}
        </div>
        <input onchange="imgChange(this, ${slide.id})" class="d-block" type="file" accept="image/x-png,image/jpeg,image/jpg" id="${slide.id}-image" />
    </div>
    <button type="button" onclick="previewSlide(${slide.id})" class="btn btn-info">Preview</button>
    <button type="button" onclick="saveSlide()" class="btn btn-primary">Save</button>`;
    }
}

function imgChange(e, slideId){
    document.getElementById(`${slideId}-bg-img`).innerHTML = `<img src="${window.URL.createObjectURL(e.files[0])}" class="employee-image" />
    <span title="Remove background image" onclick="removeBackgroundImage(${slideId})">&times;</span>`;
}

function removeBackgroundImage(slideId) {
    const slide = slides.find( s => s.id === slideId);
    slide.content.image = null;
    document.getElementById(`${slideId}-bg-img`).innerHTML = null;
    document.getElementById(`${slideId}-image`).value = null;
}

function saveSlide() {
    console.log(quill.root.innerHTML);
}

function previewSlide(slideId){
    const slide = slides.find( s => s.id === slideId);
    
}