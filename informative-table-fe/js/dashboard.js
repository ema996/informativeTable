var screens = [
    
]

$(document).ready(function(){
    const screensElement = document.getElementById("screens");
    let html = `<div class="col-12">
        <h2 class="title">Created Screens: 
        <button data-toggle="modal" data-target="#add-new-screen-modal" class="btn btn-secondary add-screen-btn">
        <i class="fas fa-plus-circle"></i> Create New Screen</button>
        </h2>
        </div>
        `;
    
    axios({
        method: 'get',
        url: 'http://localhost:3000/api/screens'
    })
    .then( res => {
        screens = res.data;
        if(screens.length) {
            screens.forEach( screen => {

                html+= `
                <div class="col-md-4 mb-4">
                    <div class="card-wrapper">
                        <div class="card-custom">
                            <h4 class="screen-name">${screen.ScreenName}</h4>
                            <div class="overlay fade">
                            <a class="screen-btn" href="edit-screen.html?id=${screen.ScreenId}">
                            <i class="far fa-edit"></i> EDIT</a>
                            <a class="screen-btn" onclick="deleteScreen(${screen.ScreenId})">
                            <i class="far fa-trash-alt"></i> DELETE</a>
                            </div>
                        </div>
                    </div>
                </div>
                `
            });
    
            screensElement.innerHTML = html;
        } else {
            html += `<div class="col-12 text-center mt-5 no-screens-message">
            <h5>You don't have any screens created yet.<br><br>Start creating your screen now by clicking on the "Create New Screen" button.</h5>
            </div>`;
            screensElement.innerHTML = html;
        }
        // window.location.href = './dashboard.html';
    })
    .catch( err => {
        console.log(err);
        toastr.error(err.response.data.message);
    });
});

function createScreen(){
    const screenName = document.getElementById('screen-name').value;
    if (screenName) {
        const body = {
            ScreenName: screenName
        };
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/screens',
            data: body
        })
        .then( res => {
            window.location.href = `./edit-screen.html?id=${res.data.ScreenId}`;
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}

function deleteScreen(screenId) {
    if(confirm('Are you sure you want to delete this screen?')){
        axios({
            method: 'delete',
            url: `http://localhost:3000/api/screens/${screenId}`
        })
        .then( res => {
            location.reload();
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}

function closeModal() {
    document.getElementById('screen-name').value = "";
}