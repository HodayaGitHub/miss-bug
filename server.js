import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'



const app = express()
const MAX_BUGS_ALLOWED = 3

app.use(express.static('public'))
app.use(cookieParser())


app.get('/api/bug/', (req, res) => {
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            res.status(400).send(`${err}, cannot get bugs`)
        })
    })
    
    
    
    app.get('/api/bug/save', (req, res) => {
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



app.get('/api/bug/:bugId/remove', (req, res) => {
    const bugId = req.params.id
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch(err => {
            res.status(400).send(`${err}, cannot remove bug`)
        })
})





app.listen(3030, () => console.log('Server ready at port 3030'))
