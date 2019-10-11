const axios = require('axios')

let studentList = document.querySelector('.student-list')
let entryList = document.querySelector('.entry-list')
let entryContainer = document.querySelector('.container--entries')
let studentFormContainer = document.querySelector('.container--student-form')

let entryHeader = document.querySelector('.entry-header')

async function getStudents() {
  const res = await axios.get('http://localhost:5000/get_students')

  for(let i = 0; i < res.data.length; i++) {
    createCard(res.data[i])
  }
}

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

  const nameInp = document.querySelector('#name')
  const numberInp = document.querySelector('#number')
  const gradeInp = document.querySelector('#grade')
  const submitInp = document.querySelector('#studentSubmit')

  let name = ""
  let number = 0
  let grade = 0
  let hours = 0

  nameInp.addEventListener('keyup', (e) => {
    name = e.target.value
  })

  numberInp.addEventListener('keyup', (e) => {
    number = parseInt(e.target.value)
  })

  gradeInp.addEventListener('keyup', (e) => {
    grade = parseInt(e.target.value)
  })

  submitInp.addEventListener('click', async () => {
    createCard({
      total_hours: hours,
      student_info: {
        name,
        number,
        grade
        }
      })

    nameInp.value = ""
    numberInp.value = ""
    gradeInp.value = ""

    await axios.post('http://localhost:5000/add_student', { name, number, grade })
  })
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

    entryHeader.innerHTML = data.student_info.name

    for (let i = 0; i < res.data.length; i++) {
      const card = document.createElement('div')
      const div = document.createElement('div')

      const arr = ['date', 'start_time', 'end_time', 'hours', 'activity']

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

getStudents()