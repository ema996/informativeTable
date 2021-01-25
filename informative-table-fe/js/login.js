function login() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("pwd").value;
    if (email && password) {
        const body = {
            Password: password,
            Email: email
        };
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/auth/login',
            data: body
        })
        .then( res => {
            console.log(res);
            localStorage.setItem('it_token', res.data.token);
            localStorage.setItem('it_refresh', res.data.refreshToken);
            window.location.href = './dashboard.html';
        })
        .catch( err => {
            console.log(err);
            toastr.error(err.response.data.message);
        });
    }
}