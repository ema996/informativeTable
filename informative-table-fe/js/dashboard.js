var screens = [
    
]

$(document).ready(function(){
    const screensElement = document.getElementById("screens");
    let html = `<div class="col-12">
        <h2>Created Screens: 
        <button data-toggle="modal" data-target="#add-new-screen-modal" class="btn btn-success add-screen-btn">Create New Screen</button>
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
                html += `<div class="col-sm-6 col-lg-4">
                    <a href="edit-screen.html?id=${screen.ScreenId}">
                        <div class="screen-wrap">
                            <div class="screen-content">
                                <h2>${screen.ScreenName}</h2>
                            </div>
                        </div>
                    </a>
                </div>` 
            });
    
            screensElement.innerHTML = html;
        } else {
            html += `<div class="col-12 text-center mt-5 no-screens-message">
            <h5>You don't have any screens created yet.<br>Start creating your screen now by clicking on the "Create New Screen" button.</h5>
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
            window.location.href = `./edit-screen.html?screen=${res.data.ScreenId}`;
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}