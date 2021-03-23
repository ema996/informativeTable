let screen = {};
let slides = [];
let carousel;
let quill;

$(document).ready(function(){
    const queryParams = window.location.search;
    const screenId = new URLSearchParams(queryParams).get('id');

    axios({
        method: 'get',
        url: `http://localhost:3000/api/screens/${screenId}`
    })
    .then( res => {
        screen = res.data;
        screen.ContentImages = [];
        slides = JSON.parse(res.data.Content);
        if(slides.length) {
            addCarouselItems();
            initCarousel();
            document.getElementById("no-slides").innerHTML = "";
            document.getElementById("slide-explanation").innerHTML = "* You can edit or delete each slide by clicking on it."
        } else {
            document.getElementById("no-slides").innerHTML = "You don't have any slides created yet.<br><br>Start adding slide now by clicking on the 'Add Slide' button.";
            document.getElementById("slide-explanation").innerHTML = "";
        }
    })
    .catch( err => {
        console.log(err);
        toastr.error(err.response.data.message);
    });
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
        navText : ["<i class='fas fa-long-arrow-alt-left'></i> Previous","Next <i class='fas fa-long-arrow-alt-right'></i>"],
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

    if(slides.length) {
        document.getElementById("no-slides").innerHTML = "";
        document.getElementById("slide-explanation").innerHTML = "* You can edit or delete each slide by clicking on it."
    } else {
        document.getElementById("no-slides").innerHTML = "You don't have any slides created yet.<br><br>Start adding slide now by clicking on the 'Add Slide' button.";
        document.getElementById("slide-explanation").innerHTML = "";
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
                  [{ header: [1, 2, 3, 4, 5, false] }],
                  ['bold', 'italic', 'underline', { 'align': [] }],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['image']
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
    <button type="button" onclick="saveSlide(${slide.id})" class="btn btn-secondary">Save</button>
    <button type="button" onclick="deleteSlide(${slide.id})" class="btn btn-danger">Delete</button>`;
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
    <button type="button" onclick="saveSlide(${slide.id})" class="btn btn-secondary">Save</button>
    <button type="button" onclick="deleteSlide(${slide.id})" class="btn btn-danger">Delete</button>`;
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
    <button type="button" onclick="saveSlide(${slide.id})" class="btn btn-secondary">Save</button>
    <button type="button" onclick="deleteSlide(${slide.id})" class="btn btn-danger">Delete</button>`;
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

function saveSlide(slideId) {
    const slide = slides.find( s => s.id === slideId);
    if(slide.type === 'Custom Content') {
        slide.content.title = document.getElementById('title').value;
        slide.content.description = quill.root.innerHTML;
        if(document.getElementById(`${slideId}-image`).files.length){
            screen.BackgroundImage = document.getElementById(`${slideId}-image`).files[0];
        }
        screen.Content = JSON.stringify(slides);
        let body = {
            Content: screen.Content,
            ScreenId: screen.ScreenId
        }
        axios({
            method: 'put',
            url: `http://localhost:3000/api/screens`,
            data: body,
        })
        .then( res => {
            let fd = new FormData();
            fd.append('BackgroundImage', screen.BackgroundImage);
            fd.append('SlideId', slideId);
            fd.append('ScreenId', screen.ScreenId);
            axios({
                method: 'post',
                url: `http://localhost:3000/api/screens/background-image`,
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( res => {
                toastr.success('Slide has been successfully updated.');
                // setTimeout(() => window.location.reload(), 1000);
            })
            .catch( err => {
                console.log(err);
                toastr.error(err.response.data.message);
            });
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    } else if(slide.type === 'Number of employees') {
        slide.content.title = document.getElementById('title').value;
        if(document.getElementById(`${slideId}-image`).files.length){
            screen.BackgroundImage = document.getElementById(`${slideId}-image`).files[0];
        }
        screen.Content = JSON.stringify(slides);
        console.log(screen);
        let body = {
            Content: screen.Content,
            ScreenId: screen.ScreenId
        }
        axios({
            method: 'put',
            url: `http://localhost:3000/api/screens`,
            data: body
        })
        .then( res => {
            let fd = new FormData();
            fd.append('BackgroundImage', screen.BackgroundImage);
            fd.append('SlideId', slideId);
            fd.append('ScreenId', screen.ScreenId);
            axios({
                method: 'post',
                url: `http://localhost:3000/api/screens/background-image`,
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( res => {
                toastr.success('Slide has been successfully updated.');
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch( err => {
                console.log(err);
                toastr.error(err.response.data.message);
            });
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    } else if(slide.type === 'Projects Info') {
        slide.content.title = document.getElementById('title').value;
        slide.content.active = document.getElementById('active-projects').value;
        slide.content.finished = document.getElementById('finished-projects').value;
        slide.content.queue = document.getElementById('queue-projects').value;
        if(document.getElementById(`${slideId}-image`).files.length){
            screen.BackgroundImage = document.getElementById(`${slideId}-image`).files[0];
        }
        screen.Content = JSON.stringify(slides);
        console.log(screen);
        let body = {
            Content: screen.Content,
            ScreenId: screen.ScreenId
        }
        axios({
            method: 'put',
            url: `http://localhost:3000/api/screens`,
            data: body
        })
        .then( res => {
            let fd = new FormData();
            fd.append('BackgroundImage', screen.BackgroundImage);
            fd.append('SlideId', slideId);
            fd.append('ScreenId', screen.ScreenId);
            axios({
                method: 'post',
                url: `http://localhost:3000/api/screens/background-image`,
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( res => {
                toastr.success('Slide has been successfully updated.');
                setTimeout(() => window.location.reload(), 1000);
            })
            .catch( err => {
                console.log(err);
                toastr.error(err.response.data.message);
            });
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
    
}

function deleteSlide(slideId) {
    if(confirm('Are you sure you want to remove the slide?')) {
        const index = slides.findIndex(e => e.id === slideId);
        if(index > -1) {
            slides.splice(index, 1);
        }
        screen.Content = JSON.stringify(slides);
        let body = {
            Content: screen.Content,
            ScreenId: screen.ScreenId
        }
        axios({
            method: 'put',
            url: `http://localhost:3000/api/screens`,
            data: body
        })
        .then( res => {
            toastr.success('Slide has been successfully updated.');
            setTimeout(() => window.location.reload(), 1000);
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}