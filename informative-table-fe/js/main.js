$(document).ready(function(){
    checkIfLoggedIn();
});

function checkIfLoggedIn(){
    if(localStorage.getItem('it_token')){
        return true;
    }

    window.location.href = './index.html';
}

function logOut(){
    localStorage.removeItem('it_token');
    localStorage.removeItem('it_refresh');
    window.location.href = './index.html';
}