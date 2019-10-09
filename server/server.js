const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const Student = require('./models/Student')

const app = express()

app.use(cors())
app.use(express.json())

mongoose
  .connect(require('./config/keys').mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('database connected'))
  .catch(err => console.log(err))

// STUDENT INFORMATION ENDPOINTS
// get all student information
app.get('/get_students', async (req, res) => {
  res.send(await Student.find())
})

// get a student's information from their student number
app.get('/get_student', async (req, res) => {
  res.send(await Student.find({ "student_info.number": req.body.number }))
})

// add a new student
app.post('/add_student', (req, res) => {
  const newStudent = new Student({
    student_info: {
      name: req.body.name,
      number: req.body.number,
      grade: req.body.grade
    }
  })
  newStudent.save()
  res.send('saved')
})

// update a student's information by their student number
app.put('/update_student', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { student_info: req.body.student_info }
  )
  res.send('student information updated');
})

// ENTRIES ENDPOINTS
// get all entries by a student's number
app.post('/get_entries/', async (req, res) => {
  const student = await Student.find({ "student_info.number": req.body.number })
  res.send(student[0].entries)
})

// add a new entry by a student's number
app.post('/add_entry', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $push: { entries: req.body.entry } }
  )
  res.send('entry added')
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log('server running'))