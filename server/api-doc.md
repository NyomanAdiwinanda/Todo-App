# Fancy ToDo App API Documentation

## RESTful endpoints

### POST /users/register

> Create a new user

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<email to get insert into>",
  "password": "<password to get insert into>"
}
```

_Response (200 - OK)_

```
{
  "msg": "Register success"
  "id": 1
  "email": admin@email.com
}
```

_Response (400 - Bad Request)_

```
{
  "msg": "Invalid email format"
}
```

```
{
  "msg": "Email already registered"
}
```

```
{
  "msg": "Password must be 6 characters minimum"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### POST /users/login

> Create access token and login for existing user

_Request Header_

```
not needed
```

_Request Body_

```
{
  "email": "<email to get insert into>",
  "password": "<password to get insert into>"
}
```

_Response (200 - OK)_

```
{
    "access_token": "<your access token>"
}
```

_Response (400 - Bad Request)_

```
{
  "msg": "Invalid Email or Password"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### POST /users/googlelogin

> login with google account

_Request Params_

```
not needed
```

_Request Body_

```
{
  "googleToken": "<your id_token>"
}
```

_Response (200 - OK)_

```
{
  "access_token": "<your access token>"
}
```

_Response (201 - Created)_

```
{
  "access_token": "<your access token>"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### POST /todos

> Create list of todos of current logged in profile

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
{
  "title": "<your title>",
  "description": "<your description>",
  "status": "<your status>",
  "due_date": "<your due date>"
}
```

_Response (200 - OK)_

```
[
  {
    "id": 1,
    "title": "sleeping",
    "description": "bed time",
    "status": false,
    "due_date": "2021-05-10T00:00:00.000Z",
    "createdAt": "2021-03-02T18:18:05.545Z",
    "updatedAt": "2021-03-02T18:18:05.545Z",
    "UserId": 1
  }
]
```

_Response (400 - Bad Request)_

```
{
  "msg": "title should not be empty"
}
```

```
{
  "msg": "description should not be empty"
}
```

```
{
  "msg": "invalid due date"
}
```

_Response (401 - Not Authorized)_

```
{
  "msg": "invalid token"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### GET /todos

> Get list of todos of current logged in profile

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
[
  {
    "id": 1,
    "title": "sleeping",
    "description": "bed time",
    "status": false,
    "due_date": "2021-05-10T00:00:00.000Z",
    "createdAt": "2021-03-02T18:18:05.545Z",
    "updatedAt": "2021-03-02T18:18:05.545Z",
    "UserId": 1
  }
]
```

_Response (401 - Not Authorized)_

```
{
  "msg": "invalid token"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### PUT /todos/:id

_Request Header_

> edit list of todos of current logged-in profile

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Params_

```
{
  "id": "<your id>"
}
```

_Request Body_

```
{
  "title": "<your title>",
  "description": "<your description>",
  "status": "<your status>",
  "due_date": "<your due date>"
}
```

_Response (200 - OK)_

```
[
  1,
  [
    {
      "id": 1,
      "title": "sleeping",
      "description": "bed time",
      "status": false,
      "due_date": "2021-05-10T00:00:00.000Z",
      "createdAt": "2021-03-02T18:18:05.545Z",
      "updatedAt": "2021-03-02T18:18:05.545Z",
      "UserId": 1
    }
  ]
]
```

_Response (400 - Bad Request)_

```
{
  "msg": "title should not be empty"
}
```

```
{
  "msg": "status must be in boolean format"
}
```

```
{
  "msg": "invalid due date"
}
```

_Response (401 - Not Authorized)_

```
{
  "msg": "invalid token"
}
```

```
{
  "msg": "not authorized"
}
```

_Response (404 - Not Found)_

```
{
  "msg": "id not found"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### PATCH /todos/:id

_Request Header_

> edit status of todo list current logged-in profile

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Params_

```
{
  "id": "<your id>"
}
```

_Request Body_

```
{
  "status": "<your status>",
}
```

_Response (200 - OK)_

```
[
  1,
  [
    {
      "id": 1,
      "title": "sleeping",
      "description": "bed time",
      "status": false,
      "due_date": "2021-05-10T00:00:00.000Z",
      "createdAt": "2021-03-02T18:18:05.545Z",
      "updatedAt": "2021-03-02T18:18:05.545Z",
      "UserId": 1
    }
  ]
]
```

_Response (400 - Bad Request)_

```
{
  "msg": "status must be in boolean format"
}
```

_Response (401 - Not Authorized)_

```
{
  "msg": "invalid token"
}
```

```
{
  "msg": "not authorized"
}
```

_Response (404 - Not Found)_

```
{
  "msg": "id not found"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### DELETE /todos/:id

_Request Header_

> delete list of todos of current logged-in profile

_Request Header_

```
{
  "access_token": "<your access token>"
}
```

_Request Params_

```
{
  "id": "<your id>"
}
```

_Request Body_

```
not needed
```

_Response (200 - OK)_

```
{
  "msg": "success to delete todo"
}
```

_Response (401 - Not Authorized)_

```
{
  "msg": "invalid token"
}
```

```
{
  "msg": "not authorized"
}
```

_Response (404 - Not Found)_

```
{
  "msg": "id not found"
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```

---

### GET /randomquote

> Get random quotes

_Request Header_

```
not needed
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
  "randomQuote": "If you must tell me your opinions, tell me what you believe in. I have plenty of douts of my own. "
}
```

_Response (500 - Internal Server Error)_

```
{
  "msg": "Internal Server Error"
}
```
