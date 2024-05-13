import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = process.env.VITE_DEV_ENV === 'true'
  ? '//localhost:3000/api/user/'
  : '/api/user/';

  
export const userService = {
    query,
    get,
    remove,
    save,
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
