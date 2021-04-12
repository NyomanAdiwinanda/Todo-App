$(document).ready(() => {
    auth();

    fetchRandomQuote();

    $('#linkregister').on('click', (e) => {
        e.preventDefault();
        showRegister();
    });

    $('#linklogin').on('click', (e) => {
        e.preventDefault();
        auth();
    });

    $('#loginform').on('submit', (e) => {
        e.preventDefault();
        login();
    });

    $('#registerform').on('submit', (e) => {
        e.preventDefault();
        register();
    });

    $('#logout').on('click', (e) => {
        e.preventDefault();
        logout();
    });

    $('#add-todo-form').on('submit', (e) => {
        e.preventDefault();
        addTodo();
    });
});

// base_url for local development
// const base_url = 'http://localhost:4000/';

// base_url on heroku
const base_url = 'https://fancy-todo-nyoman.herokuapp.com/';

function auth() {
    if (!localStorage.access_token) {
        $('#login').show();
        $('#register').hide();
        $('#app').hide();
        $('.card').remove();
    } else {
        $('#login').hide();
        $('#register').hide();
        $('#app').show();
        fetchTodos();
    }
}

function showRegister() {
    $('#login').hide();
    $('#register').show();
    $('#app').hide();
    $('#navbar').hide();
}

function login() {
    const email = $('#loginemail').val();
    const password = $('#loginpassword').val();
    $.ajax({
        url: base_url + 'users/login',
        method: 'POST',
        data: {
            email,
            password,
        },
    })
        .done((res) => {
            localStorage.access_token = res.access_token;
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Login Successful',
                showConfirmButton: false,
                timer: 1500,
            });
            auth();
        })
        .fail((xhr, txt) => {
            Swal.fire({
                icon: 'error',
                title: xhr.responseJSON.msg,
            });
        })
        .always(() => {
            $('#loginform').trigger('reset');
        });
}

function register() {
    const email = $('#registeremail').val();
    const password = $('#registerpassword').val();
    const confirmPassword = $('#confirmregisterpassword').val();
    if (password !== confirmPassword) {
        $('#registerpassword').val('');
        $('#confirmregisterpassword').val('');
        Swal.fire({
            icon: 'error',
            title: 'Password inputs are not same',
            text: 'Please re-check your typing',
        });
    } else {
        $.ajax({
            url: base_url + 'users/register',
            method: 'POST',
            data: {
                email,
                password,
            },
        })
            .done((res) => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Register Successful',
                    showConfirmButton: false,
                    timer: 1500,
                });
                auth();
            })
            .fail((xhr, txt) => {
                Swal.fire({
                    icon: 'error',
                    title: xhr.responseJSON.msg,
                });
            })
            .always(() => {
                console.log('always');
                $('#registerform').trigger('reset');
            });
    }
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        url: base_url + 'users/googleLogin',
        method: 'POST',
        data: {
            googleToken: id_token,
        },
    })
        .done((res) => {
            localStorage.access_token = res.access_token;
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Google Login Successful',
                showConfirmButton: false,
                timer: 1500,
            });
            auth();
        })
        .fail((xhr, txt) => {
            console.log(xhr, txt);
        });
}

function logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log('User signed out');
    });
    localStorage.removeItem('access_token');
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Logout Successful',
        showConfirmButton: false,
        timer: 1500,
    });
    auth();
}

function fetchTodos() {
    $.ajax({
        url: base_url + 'todos',
        method: 'GET',
        headers: {
            access_token: localStorage.access_token,
        },
    }).done((res) => {
        $('.card').remove();

        for (let i = 0; i < res.length; i++) {
            $('.fetchTodo').append(`
            <div class="card">
            <h1>${res[i].title}</h1>
            <p>Description: ${res[i].description}</p>
            <p>Status: ${res[i].status ? 'Finished' : 'Not Finished'}</p>
            <p>Due Date: ${res[i].due_date}</p>
            <p><a href="#" id="edit-todo${
                res[i].id
            }">Edit ToDo</a> | <a href="#" id="change-status${
                res[i].id
            }">Change Status</a> | <a href="#" id="delete-todo${
                res[i].id
            }">Delete</a></p>
            </div>
            `);
            $(`#edit-todo${res[i].id}`).on('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    showCancelButton: true,
                    confirmButtonText: 'Edit',
                    title: 'Edit Todo',
                    html:
                        `Title: <input type="text" id="edit-title" value="${res[i].title}" />` +
                        '<br />' +
                        '<br />' +
                        `Description: <input type="text" id="edit-description" value="${res[i].description}" />` +
                        '<br />' +
                        '<br />' +
                        'Status:' +
                        '<select id="edit-status">' +
                        '<option value="false">Not Finished</option>' +
                        '<option value="true">Finished</option>' +
                        '</select>' +
                        '<br />' +
                        '<br />' +
                        `Due Date: <input type="date" id="edit-due_date" value="${res[i].due_date}"/>` +
                        '<br />',
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            resolve([
                                $('#edit-title').val(),
                                $('#edit-description').val(),
                                $('#edit-status').val(),
                                $('#edit-due_date').val(),
                            ]);
                        });
                    },
                })
                    .then((result) => {
                        $.ajax({
                            url: base_url + `todos/${res[i].id}`,
                            method: 'PUT',
                            headers: {
                                access_token: localStorage.access_token,
                            },
                            data: {
                                title: result.value[0],
                                description: result.value[1],
                                status: result.value[2],
                                due_date: result.value[3],
                            },
                        })
                            .done(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Todo Updated',
                                });
                                fetchTodos();
                                fetchRandomQuote();
                            })
                            .fail((xhr, txt) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: xhr.responseJSON.msg,
                                });
                                fetchRandomQuote();
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
            $(`#change-status${res[i].id}`).on('click', (e) => {
                e.preventDefault();
                Swal.fire({
                    showCancelButton: true,
                    confirmButtonText: 'Edit',
                    title: 'Change Status',
                    html:
                        '<select id="edit-status">' +
                        '<option value="false">Not Finished</option>' +
                        '<option value="true">Finished</option>' +
                        '</select>',
                    preConfirm: () => {
                        return new Promise((resolve) => {
                            resolve([$('#edit-status').val()]);
                        });
                    },
                })
                    .then((result) => {
                        $.ajax({
                            url: base_url + `todos/${res[i].id}`,
                            method: 'PATCH',
                            headers: {
                                access_token: localStorage.access_token,
                            },
                            data: {
                                status: result.value[0],
                            },
                        })
                            .done(() => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Status Updated',
                                });
                                fetchTodos();
                                fetchRandomQuote();
                            })
                            .fail((xhr, txt) => {
                                Swal.fire({
                                    icon: 'error',
                                    title: xhr.responseJSON.msg,
                                });
                                fetchRandomQuote();
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });

            $(`#delete-todo${res[i].id}`).on('click', (e) => {
                e.preventDefault();
                $.ajax({
                    url: base_url + `todos/${res[i].id}`,
                    method: 'DELETE',
                    headers: {
                        access_token: localStorage.access_token,
                    },
                }).done(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Todo deleted',
                    });
                    fetchTodos();
                    fetchRandomQuote();
                });
            });
        }
    });
}

function addTodo() {
    $.ajax({
        url: base_url + 'todos',
        method: 'POST',
        headers: {
            access_token: localStorage.access_token,
        },
        data: {
            title: $('#new-todo-title').val(),
            description: $('#new-todo-description').val(),
            status: $('#new-todo-status').val(),
            due_date: $('#new-todo-due_date').val(),
        },
    })
        .done(() => {
            fetchTodos();
            fetchRandomQuote();
            $('#add-todo-form').trigger('reset');
        })
        .fail((xhr, txt) => {
            Swal.fire({
                icon: 'error',
                title: xhr.responseJSON.msg,
            });
            fetchRandomQuote();
        });
}

function fetchRandomQuote() {
    $.ajax({
        url: base_url + 'randomquote',
        method: 'GET',
    }).done((res) => {
        if (res.randomQuote === undefined) {
            fetchRandomQuote();
        } else {
            $('.randomQuoteCard').remove();

            $('.fetchRandomQuote').append(`
        <div class="randomQuoteCard">
          <h1>Inspirational Quote For You</h1>
          <p>${res.randomQuote}</p>
        </div>
      `);
        }
    });
}
