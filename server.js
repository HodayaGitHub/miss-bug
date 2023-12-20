import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'



const app = express()
const MAX_BUGS_ALLOWED = 3

app.use(express.static('public'))
app.use(express.json())

app.use(cookieParser())


app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        pageIdx: +req.query.pageIdx,
        sortBy: req.query.sortBy,
        sortDir: req.query.sortDir || 'ascending',
    }

    const filterByUser = req.query.filterByUser


    const loginToken = req.cookies.loginToken
    if (!loginToken) {
        res.status(403).send('Unauthorized')
        return
    }
    const user = userService.validateToken(loginToken)
    // console.log(user)
    bugService.query(filterBy)
        .then(bugs => {
            if (filterByUser) {
                bugs = bugs.filter(bug => user._id === bug.creator._id)
            }
            res.send(bugs)
        })
        .catch(err => {
            console.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})


app.post('/api/bug', (req, res) => {
    const loginToken = req.cookies.loginToken
    if (!loginToken) {
        res.status(403).send('Unauthorized')
        return
    }

    const user = userService.validateToken(loginToken)

    const bugToSave = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.desc,
        _id: req.body._id,
        createdAt: Date.now(),
        lables: [],
        creator: {
            _id: user._id,
            fullname: user.fullname
        }

    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).send(`${err}, cannot save bug`)
        })
})


// Edit bug (UPDATE)
app.put('/api/bug', (req, res) => {
    const loginToken = req.cookies.loginToken
    if (!loginToken) {
        res.status(403).send('Unauthorized')
        return
    }
    const user = userService.validateToken(loginToken)
    const bugId = req.body._id

    const updatedFields = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
    }

    console.log('user', user._id)
    console.log('usertosave', req.body.creator._id)

    bugService.getById(bugId)
        .then(existingBug => {
            if (!existingBug) {
                res.status(404).send('Bug not found')
            }

            if (user._id === req.body.creator._id) {
                const updatedBug = { ...existingBug, ...updatedFields }
                return bugService.save(updatedBug)
            } else {
                res.status(403).send('Unauthorized')

            }
        })
        .then(updatedBug => res.send(updatedBug))
        .catch((err) => {
            res.status(400).send('Cannot save bug')
        })
})



app.get('/api/bug/:id', (req, res) => {
    const bugId = req.params.id
    let visitedBugs = req.cookies.visitedBugs || []

    // console.log(visitedBugs)

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


// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(error => {
            console.error('Login failed:', error)
            res.status(401).send('Invalid Credentials')
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/api/get-user', (req, res) => {
    const loginToken = req.cookies.loginToken

    if (!loginToken) {
        res.status(403).send('Unauthorized')
        return
    }

    const user = userService.validateToken(loginToken)
    res.send(user)
})






// app.get('/**', (req, res) => {
//     res.sendFile(path.resolve('public/index.html'))
// })





app.listen(3030, () => console.log('Server ready at port 3030'))
