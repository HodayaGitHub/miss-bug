
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import fs from 'fs'

const PAGE_SIZE = 3

export const bugService = {
    query,
    getById,
    save,
    remove,
}

const bugs = utilService.readJsonFile('data/bug.json')


function query(filterBy) {
    let bugsToReturn = bugs
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToReturn = bugsToReturn.filter(bug => regExp.test(bug.title))
    }
    if (filterBy.severity) {
        bugsToReturn = bugsToReturn.filter(bug => bug.severity >= filterBy.severity)
    }

    if (!isNaN(filterBy.pageIdx)) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }

    if (filterBy.sortBy) {
        bugsToReturn.sort((bug1, bug2) => {
            const value1 = bug1[filterBy.sortBy]
            const value2 = bug2[filterBy.sortBy]

            if (value1 < value2) {
                return filterBy.sortDir === 'ascending' ? -1 : 1
            } else if (value1 > value2) {
                return filterBy.sortDir === 'ascending' ? 1 : -1
            } else {
                return 0
            }
        });
    }

    return Promise.resolve(bugsToReturn)
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

