import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'



const app = express()
const MAX_BUGS_ALLOWED = 3

app.use(express.static('public'))
app.use(express.json())

app.use(cookieParser())


app.get('/api/bug/', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: req.query.severity || 0,
        pageIdx: req.query.pageIdx,
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir || 'ascending',
    }

    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            console.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})


app.post('/api/bug/', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        description: req.query.desc,
        _id: req.query._id,
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).send(`${err}, cannot save bug`)
        })
})


// Edit bug (UPDATE)
app.put('/api/car', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.desc,
        _id: req.body._id,
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})




app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    let visitedBugs = req.cookies.visitedBugs || []

    console.log(visitedBugs)

    if (visitedBugs.length >= MAX_BUGS_ALLOWED) {
        return res.status(401).send('Wait for a bit')
    }

    if (visitedBugs && !visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })


    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).send(`${err}, cannot get bugs`)
        })

})



app.delete('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch(err => {
            res.status(400).send(`${err}, cannot remove bug`)
        })
})





app.listen(3030, () => console.log('Server ready at port 3030'))