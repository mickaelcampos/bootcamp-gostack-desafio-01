const express = require('express')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

const projects = [ { id: '1', title: 'Novo projeto', tasks: [] },
                   { id: '2', title: 'Outro projeto', tasks: [] } ]

//Global Middleware
server.use((req, res, next) => {
  //console.log(++requestCount)
  console.count('Requests')
  return next()
})

//Middleware
function checkProjectExists(req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id)
  
  if (!project) {
    return res.status(400).json({ error : 'Project does not exists'})
  }

  req.project = project

  return next()
}

function checkIdExists(req, res, next) {
  const { id } = req.body
  const project = projects.find(p => p.id == id)

  if (project) {
    return res.status(400).json({error : 'Invalid Id'})
  }

  return next()
}


//Routes

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', checkIdExists, (req, res) => {
  console.log(req.body)
  const { id, title } = req.body
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  return res.json(project)
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body
  const project = req.project
  project.tasks.push(title)

  return res.json(project)
})

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body

  if (!title) {
    return res.status(400).json({ error : 'Title is required'})
  }
  
  const project = req.project
  project.title = title

  return res.json(projects)
})

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params
  const projectIndex = projects.findIndex(p => p.id == id)
  projects.splice(projectIndex, 1)
  return res.send()
})

server.listen(3000)