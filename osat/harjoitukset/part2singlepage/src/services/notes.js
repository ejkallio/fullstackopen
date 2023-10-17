import axios from 'axios'
const baseUrl = '/api/notes'

const getAll = () => {
    const req = axios.get(baseUrl)
    return req.then(res => res.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}


export default { getAll, create, update }