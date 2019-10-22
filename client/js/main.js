const axios = require('axios')

let studentList = document.querySelector('.student-list')
let entryList = document.querySelector('.entry-list')
let entryContainer = document.querySelector('.container--entries')
let studentFormContainer = document.querySelector('.container--student-form')
let editstudentFormContainer = document.querySelector('.container--edit-student-form')
let entryFormContainer = document.querySelector('.container--entry-form')

let currentStudentNum = 0;

// Load and generate inital student cards
axios
  .get('http://localhost:5000/get_students')
  .then(res => {
    for(let i = 0; i < res.data.length; i++) {
      createCard(res.data[i])
    }
  })

// Back button from 'entries' page
document.querySelector('.btn--back').addEventListener('click', () => {
  entryContainer.style.display = 'none'
  studentList.style.display = 'block'
  entryList.innerHTML = ''
})

// Back button from 'add student' page
document.querySelector('.btn--student-back').addEventListener('click', () => {
  studentList.style.display = 'block'
  studentFormContainer.style.display = 'none'
})

// Add student page and functionality
document.querySelector('.btn--student').addEventListener('click', () => {
  studentList.style.display = 'none'
  studentFormContainer.style.display = 'block'
})

const nameInp = document.querySelector('#name')
const numberInp = document.querySelector('#number')
const gradeInp = document.querySelector('#grade')
const submitInp = document.querySelector('#studentSubmit')

let name = ""
let number = 0
let grade = 0
let total_hours = 0

nameInp.addEventListener('keyup', (e) => {
  name = e.target.value
})

numberInp.addEventListener('keyup', (e) => {
  number = parseInt(e.target.value)
})

gradeInp.addEventListener('change', () => {
  grade = parseInt(gradeInp.options[gradeInp.selectedIndex].value)
})

submitInp.addEventListener('click', async () => {
  createCard({
    total_hours,
    student_info: {
      name,
      number,
      grade
      }
    })
  nameInp.value = ''
  numberInp.value = ''
  gradeInp.value = ''

  studentFormContainer.style.display = 'none'
  studentList.style.display = 'block'

  await axios.post('http://localhost:5000/add_student', { name, number, grade })
})

function createCard(data) {
  const card = document.createElement('div')
  const div = document.createElement('div')

  const arr = ['name', 'number', 'grade', 'total_hours']

  card.className += ('card card--info mb-1')
  div.className += ('card-body row')

  card.id = data.student_info.number

  for (let i = 0; i < arr.length; i++) {
    const element = document.createElement('p')
    element.className = 'col'
    const node = document.createTextNode(data.student_info[arr[i]] || data[arr[i]])
    element.appendChild(node)
    div.appendChild(element)
    card.appendChild(div)
    studentList.appendChild(card)
  }

  card.addEventListener('click', async () => {
    const res = await axios.post('http://localhost:5000/get_entries', { number: parseInt(card.id) })

    studentList.style.display = 'none'
    entryContainer.style.display = 'block'

    document.querySelector('.entry-header').innerHTML = data.student_info.name

    currentStudentNum = card.id
    entryList.id = "E" + card.id

    for (let i = 0; i < res.data.length; i++) {
      const card = document.createElement('div')
      const div = document.createElement('div')

      const arr = ['date', 'start_time', 'end_time', 'hours', 'category']

      card.className += ('card card--info mb-1')
      div.className += ('card-body row')

      for (let j = 0; j < arr.length; j++) {
        const element = document.createElement('p')
        element.className = 'col'
        const node = document.createTextNode(res.data[i][arr[j]])
        element.appendChild(node)
        div.appendChild(element)
        card.appendChild(div)
        entryList.appendChild(card)
      }
    }
  })
}

// Show add entry page
document.querySelector('.btn--entry').addEventListener('click', () => {
  entryContainer.style.display = 'none'
  entryFormContainer.style.display = 'block'
})

// Back to entry page from add entry page
document.querySelector('.btn--entry-back').addEventListener('click', () => {
  entryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
})

const categoryInp = document.querySelector('#category')
const dateInp = document.querySelector('#date')
const startTimeInp = document.querySelector('#start-time')
const endTimeInp = document.querySelector('#end-time')
const entrySubmit = document.querySelector('#entrySubmit')

let category;
let date;
let start_time;
let end_time;
let hours;

categoryInp.addEventListener('keyup', e => {
  category = e.target.value
})

dateInp.addEventListener('change', e => {
  date = e.target.value
})

startTimeInp.addEventListener('change', e => {
  start_time = e.target.value
})

endTimeInp.addEventListener('change', e => {
  end_time = e.target.value
})

entrySubmit.addEventListener('click', async () => {
  hours = calcHours(start_time, end_time);
  
  const currentEntryList = document.getElementById(entryList.id)

  const card = document.createElement('div')
  const div = document.createElement('div')

  const arr = [date, start_time, end_time, hours, category]

  card.className += ('card card--info mb-1')
  div.className += ('card-body row')

  for (let i = 0; i < arr.length; i++) {
    const element = document.createElement('p')
    element.className = 'col'
    const node = document.createTextNode([arr[i]])
    element.appendChild(node)
    div.appendChild(element)
    card.appendChild(div)
    currentEntryList.appendChild(card)
  }

  categoryInp.value = ''
  dateInp.value = ''
  startTimeInp.value = ''
  endTimeInp.value = ''

  await axios.post('http://localhost:5000/add_entry',
  {
    number: parseInt(currentStudentNum),
    entry: {
      date,
      start_time,
      end_time,
      hours,
      category
    }
  })
})

function calcHours(start, end) {
  const startHours = parseInt(start.split(':')[0])
  const startMins = parseInt(start.split(':')[1])
  const endHours = parseInt(end.split(':')[0])
  const endMins = parseInt(end.split(':')[1])

  const minDiff = (60 - startMins + endMins) % 60
  const hourDiff = startMins <= endMins ? endHours - startHours : endHours - startHours - 1

  return Math.round((hourDiff + (minDiff / 60)) * 100) / 100
}

let editNameInp = document.querySelector('#editName')
let editNumberInp = document.querySelector('#editNumber')
let editGradeInp = document.querySelector('#editGrade')

// Show edit student page
document.querySelector('.btn--edit-student').addEventListener('click', () => {
  entryContainer.style.display = 'none'
  editstudentFormContainer.style.display = 'block'

  const studentInfoList = document.getElementById(currentStudentNum).childNodes[0].childNodes

  editNameInp.value = studentInfoList[0].innerHTML
  editNumberInp.value = studentInfoList[1].innerHTML
  switch (studentInfoList[2].innerHTML) {
    case '9':
      editGradeInp.selectedIndex = '0'
      break
    case '10':
      editGradeInp.selectedIndex = '1'
      break
    case '11':
      editGradeInp.selectedIndex = '2'
      break
    case '12':
      editGradeInp.selectedIndex = '3'
      break
    }
  })
  
document.querySelector('#editStudentSubmit').addEventListener('click', () => {
  axios.put('http://localhost:5000/update_student', {
    number: parseInt(currentStudentNum),
    student_info: {
      name: editNameInp.value,
      number: parseInt(editNumberInp.value),
      grade: parseInt(editGradeInp.value)
    }
  })
  
  const studentInfoList = document.getElementById(currentStudentNum).childNodes[0].childNodes
  
  studentInfoList[0].innerHTML = editNameInp.value
  studentInfoList[1].innerHTML = editNumberInp.value
  studentInfoList[2].innerHTML = editGradeInp.value
  
  document.getElementById(currentStudentNum).id = editNumberInp.value
  currentStudentNum = editNumberInp.value

  editstudentFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
})

document.querySelector('.btn--edit-student-back').addEventListener('click', () => {
  editstudentFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
})

document.querySelector('.btn--delete-student').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'block'
})

document.querySelector('.btn--confirm-student-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'none'
  document.getElementById(currentStudentNum).remove()
  axios.delete('http://localhost:5000/delete_student', {
    data: {
      number: parseInt(currentStudentNum)
    }
  })
  entryContainer.style.display = 'none'
  studentList.style.display = 'block'
})

document.querySelector('.btn--deny-student-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'none'  
})
