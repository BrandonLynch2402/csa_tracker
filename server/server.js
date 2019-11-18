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

// get student information
app.post('/get_student', async (req, res) => {
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
})

// update student information
app.put('/update_student', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { student_info: req.body.student_info }
  )
  res.send('student information updated')
})

// delete student
app.delete('/delete_student', async (req, res) => {
  await Student.deleteOne({ "student_info.number": req.body.number })
  res.send('student deleted')
})

// ENTRIES ENDPOINTS
// get entries
app.post('/get_entries', async (req, res) => {
  const student = await Student.find({ "student_info.number": req.body.number })
  res.send(student[0].entries)
})

// add new entry
app.post('/add_entry', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $push: { entries: req.body.entry } }
  )
  res.send('entry added')
})

// update entry list
app.post('/update_entry', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $set: { entries: req.body.entries } }
  )
  res.send('entry updated')
})

// delete entry
app.post('/delete_entry', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $pull: { entries: req.body.entry } }
  )
  res.send('entry deleted')
})

// CATEGORIES ENDPOINTS
// get categories
app.post('/get_categories', async (req, res) => {
  const student = await Student.find({ "student_info.number": req.body.number })
  res.send(student[0].categories)
})

// add new category
app.post('/add_category', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $push: { categories: req.body.category } }
  )
  res.send('category added')
})

// update category
app.post('/update_category', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $set: { categories: req.body.categories } }
  )
  res.send('category updated')
})

// delete category
app.post('/delete_category', async (req, res) => {
  await Student.updateOne(
    { "student_info.number": req.body.number },
    { $pull: { categories: req.body.category } }
  )
  res.send('category deleted')
})

const PORT = 5000 || process.env.PORT

app.listen(PORT, () => console.log('server running'))