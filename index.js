const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const tasksFile = path.join(__dirname, 'tasks')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: false }))

function readTasks(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
                return
            }

            resolve(data.split('\n').filter(Boolean))
        })
    })
}

app.get('/', async (req, res) => {
    try {
        const tasks = await readTasks(tasksFile)
        res.render('index', { tasks })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.post('/', async (req, res) => {
    try {
        const tasks = await readTasks(tasksFile)
        tasks.push(req.body.task)
        fs.writeFile(tasksFile, tasks.join('\n'), 'utf-8', (err) => {
            if (err) {
                console.error(err)
                res.sendStatus(500)
                return
            }

            res.redirect('/')
        })
    } catch (err) {
        console.error(err)
        res.sendStatus(500)
    }
})

app.listen(3001, () => {
    console.log('Example app is started at http://localhost:3001')
})
