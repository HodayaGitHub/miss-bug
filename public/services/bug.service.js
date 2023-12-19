export const bugServiceFront = {
    query,
    get,
    save,
    remove,
    getDefaultFilter,
    getEmptyBug,
}

const BASE_URL = '/api/bug'

function getDefaultFilter() {
    return { txt: '', severity: '', }
}

function getEmptyBug(title = '', severity = '') {
    return { title, severity }
}


function query(filterBy) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}

function get(bugId) {
    return axios.get(`${BASE_URL}/${bugId}`).then(res => res.data)
}


function remove(bugId) {
    return axios.delete(`${BASE_URL}/${bugId}`).then(res => res.data) 
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

