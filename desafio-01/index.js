const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
var requestLog = 0;


//Global Middleware
server.use((req, res, next)=>{
  requestLog = requestLog + 1;
  console.log('Requests on session: ', requestLog);
  return next();
})

//Local Middleware
function projectExists(req, res, next){
  projectId = req.params.id;

  if(!projects[projectId]){
    return res.status(400).json({Error: 'Project does not exist. Change the Project ID ant try again!'});
  }

  return next();
}


//Routes
server.post('/projects', (req, res)=>{
  const project = req.body

  projects.push(project)

  return res.json(projects);
});


server.post('/projects/:id/task', projectExists, (req, res)=>{
  const {id} = req.params;
  const {title} = req.body;
  const {tasks} = projects[id];
  projects[id].tasks = [...tasks, title];

  return res.json(projects[id])
});


server.get('/projects', (req, res)=>{
  return res.json(projects);
});


server.put('/projects/:id', projectExists, (req,res)=>{
  const {id} = req.params;
  const project = req.body;

  projects[id] = project;

  return res.json(project);
});


server.delete('/projects/:id', projectExists, (req,res)=>{
  const {id} = req.params;

  projects.splice(id, 1);

  return res.json({Message: 'Success! Project has deleted'});
});



server.listen(3000);