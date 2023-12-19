
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
    return axios.get(BASE_URL).then(res => res.data)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            return bugs
        })
}


function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}


function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
}

function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&desc=${bug.description}&severity=${bug.severity}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams)
}

