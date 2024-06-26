const express = require('express');
const app = express();
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

let persons =
  [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people <br/> ${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(per => per.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
  } else {
    response.status(404).send({ error: 'person not found' });
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxId + 1;
}

app.post('/api/persons', (request, response) => {
  const body = request.body;
  console.log(persons.some(p=> p.name === body.name))

  if (!body.name || !body.number) {
    return response.status(400).send({ error: 'name or number not found' })
  }else if(persons.some(p=> p.name === body.name) ){
    return response.send({ error: 'name must be unique' })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(persons)

})

morgan('tiny')
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001
app.listen(PORT)