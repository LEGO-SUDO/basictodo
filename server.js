const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose');
const todoListModel = require('./models/todoListModel');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors')

const URL = process.env.URL || 'http://localhost';
const PORT = process.env.PORT || 5001;

const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Express middleware and initialization
const app = express();
app.use(bodyParser.json());
app.use(express.static('src'));
app.use(cors())
app.get('/', (req, res) => {
  res.sendFile('/index.html');
})

app.get('/variables', (req, res) => {
  // console.log(URL , PORT)
  res.status(200).json({URL, PORT})
  
});


app.post('/todos', (req, res) => {
  const newTodo = req.body;
  run();
  async function run() {
    const todo = await todoListModel.create({
      title: newTodo.title,
      description: newTodo.description,
    });
    // console.log(todo);
    res.status(201).send(todo);
  }

})

app.get('/todos', (req, res) => {
  todoListModel.find().then((todos) => {
    // console.log('Todos:', todos);
    res.send(todos);
  }).catch((error) => {
    console.error('Error retrieving todos:', error);
  });
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  todoListModel.find().then((todos) => {
    // console.log('Todos:', todos);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i]._id.equals(new ObjectId(id))) {
        res.send(todos[i]);
      }
    }
  }).catch((error) => {
    console.error('Error retrieving todos:', error);
  });
})


app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  todoListModel.findOneAndDelete({ _id: new ObjectId(id) }) // Use findOneAndDelete to find and delete the matching object
    .then((deletedTodo) => {
      if (deletedTodo) {
        // console.log('Deleted Todo:', deletedTodo);
        res.send('Todo deleted successfully');
      } else {
        res.status(404).send('Todo not found');
      }
    })
    .catch((error) => {
      console.error('Error deleting todo:', error);
      res.status(500).send('Internal Server Error');
    });
});


app.use((req, res, next) => {
  res.status(404).send();
});

app.listen(PORT, () => {
  console.log(`App Listening to ${URL}:${PORT}`);
})
