let slides = [];
let counter = 1;
$(document).ready(function(){
    fetchScreenContent();
    setInterval(() => {
        fetchScreenContent()
    }, 30000);
});

function fetchScreenContent(){
    axios({
        method: 'get',
        url: `http://localhost:3000/api/locations/${new URLSearchParams(window.location.search).get('location')}`
    })
    .then( res => {
        axios({
            method: 'get',
            url: `http://localhost:3000/api/screens/${res.data.ScreenId}`
        })
        .then( response => {
            slides = JSON.parse(response.data.Content);
            if(slides.length && counter === 1) {
                counter++;
                let html = ``;
                slides.forEach((slide, index) => {
                    const bgImg = slide.content.image ? `style="background-image: url(${slide.content.image})"` : '';
                    if(index === 0) {
                        html += `<div class="carousel-item active" ${bgImg}>
                            ${generateSlideContent(slide)}
                        </div>`
                    } else {
                        html += `<div class="carousel-item" ${bgImg}>
                        ${generateSlideContent(slide)}
                    </div>`
                    }
                });
                document.getElementById('slides-content').innerHTML = html;
                setTimeout(() => {
                    updateScreenStatus(res.data.ScreenId);
                }, 29000);
            } else if (slides.length && response.data.HasUpdate === 1){
                location.reload();
            } else if((!slides.length && response.data.HasUpdate === 1) || (!slides.length && counter === 1)) {
                counter++;
                document.getElementById('slides-content').innerHTML = '<h1 class="mt-5 text-danger text-center">Nothing to display</h1>';
                setTimeout(() => {
                    updateScreenStatus(res.data.ScreenId);
                }, 29000);
            } else {
                counter++;
            }
        })
        .catch( error => {
            console.log(error);
            document.getElementById('slides-content').innerHTML = '<h1 class="mt-5 text-danger text-center">Some error occurred. Please contact the administrator.</h1>';
        })
    })
    .catch( error => {
        console.log(error);
        document.getElementById('slides-content').innerHTML = '<h1 class="mt-5 text-danger text-center">Some error occurred. Please contact the administrator.</h1>';
    })
}

function updateScreenStatus(screenId) {
    axios({
        method: 'put',
        url: `http://localhost:3000/api/screens/status/${screenId}`,
        data: {ScreenId: screenId}
    })
    .then( response => {})
    .catch( error => {
        console.log(error);
        document.getElementById('slides-content').innerHTML = '<h1 class="mt-5 text-danger text-center">Some error occurred. Please contact the administrator.</h1>';
    })
}

function generateSlideContent(slide) {
    let content = '';
    if (slide.type === 'Custom Content') {
        content = `<div class="ql-editor ql-snow">${slide.content.description}</div>`
    } else if(slide.type === 'Number of employees') {
        content = `<div class="number-of-employees"><h1 class="text-center text-danger mt-5">MORE THAN 7 PEOPLE <br/> <br/> CURRENTLY AT OFFICE<h1></div>`
    } else if(slide.type === 'Projects Info') {
        content = `
        <div class="row projects-info-cards-row w-100 mt-5">
        <div class="col-12 text-center">
            <h1 class="mt-2 mb-5 projects-info-title">Projects Information</h1>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-5 projects-info-card-container">
          <div class="projects-info-card p-3 mr-1">
              <div class="text-center mt-1">
                <img class="projects-info-card-img" src="../../images/active-projects.gif">
                <h2 class="projects-info-card-header mt-5">Active Projects</h2>
              </div>
              <div class="text-center mt-2">
                <h2 class="projects-info-card-text">${slide.content.active}</h2>
              </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-5 projects-info-card-container">
          <div class="projects-info-card p-3 mr-1">
              <div class="text-center mt-1">
                <img class="projects-info-card-img" src="../../images/finished-projects.gif">
                <h2 class="projects-info-card-header mt-5">Finished Projects</h2>
              </div>
              <div class="text-center mt-2">
                <h2 class="projects-info-card-text">${slide.content.finished}</h2>
              </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-5 projects-info-card-container">
          <div class="projects-info-card p-3 mr-1">
              <div class="text-center mt-1">
                <img class="projects-info-card-img pl-3" src="../../images/projects-in-queue.gif">
                <h2 class="projects-info-card-header mt-5">Projects in Queue</h2>
              </div>
              <div class="text-center mt-2">
                <h2 class="projects-info-card-text">${slide.content.queue}</h2>
              </div>
          </div>
        </div>
      </div>
        `
    }
    return content;
}