
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import fs from 'fs'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const bugs = utilService.readJsonFile('data/bug.json')


function query() {
    return Promise.resolve(bugs)
}


function save(bug) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bugs.unshift(bug)
    }
    return _saveBugsToJson().then(() => bug)
}


function _saveBugsToJson() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}


function remove(bugId){
const bugIdx = bugs.findIndex(bug => bug._id === bugId)
bugs.splice(bugIdx, 1)
return _saveBugsToJson()

}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Bug dosent exist!')

    return Promise.resolve(bug)
}

