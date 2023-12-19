
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
const BASE_URL = '/api/bug/'

export const bugServiceFront = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
}


function getDefaultFilter() {
    return { txt: '', severity: '', }
}


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}


function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}


function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

