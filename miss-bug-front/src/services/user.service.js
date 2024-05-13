import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = process.env.VITE_DEV_ENV === 'true'
  ? '//localhost:3000/api/user/'
  : '/api/user/';

// const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'

export const userService = {
    query,
    get,
    remove,
    save,

    // signup,
    // login,
    // logout,
    // getLoggedInUser,
    // getEmptyCredentials
}

async function query(filterBy = {}) {
    // console.log(`filterBy: index=${filterBy.pageIndex} title=${filterBy.fullname} severity=${filterBy.score}`)
    let { data: users } = await axios.get(BASE_URL, { params: filterBy })
    return users
}

async function get(userId) {
    const { data: user } = await axios.get(BASE_URL + userId)
    return user
}

async function remove(userId) {
    return axios.delete(BASE_URL + userId)
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_URL + (user._id || ''), user)
    return savedUser
}


// async function signup({ username, password, fullname }) {
//     const res = await axios.post('/api/auth/signup', { username, password, fullname });
//     const user = res.data;
//     sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user));
//     return user;
// }

// async function login({ username, password }) {
//     const res = await axios.post('/api/auth/login', { username, password });
//     const user = res.data;
//     sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user));
//     return user;
// }

// async function logout() {
//     await axios.post('/api/auth/logout');
//     sessionStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER);
// }

// function getLoggedInUser() {
//     return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER))
// }

// function getEmptyCredentials() {
//     return {
//         username: '',
//         password: '',
//         fullname: ''
//     }
// }
