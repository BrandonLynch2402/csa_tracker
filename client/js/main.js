const axios = require('axios')

let studentList = document.querySelector('.student-list')
let entryList = document.querySelector('.entry-list')
let entryContainer = document.querySelector('.container--entries')

let studentData;
let entryData;

async function getStudents() {
  const res = await axios.get('http://localhost:5000/get_students')
  studentData = res.data

  console.log(studentData)

  for(let i = 0; i < studentData.length; i++) {
    console.log(studentData[i].student_info)

    const card = document.createElement('div')
    const div = document.createElement('div')

    card.className += ('card card--info mb-1')
    div.className += ('card-body row')

    card.id = studentData[i].student_info.number
    
    const name = document.createElement('a')
    const number = document.createElement('a')
    const grade = document.createElement('a')
    const hours = document.createElement('a')

    name.className = 'col'
    number.className = 'col'
    grade.className = 'col'
    hours.className = 'col'

    const nameNode = document.createTextNode(studentData[i].student_info.name)
    const numberNode = document.createTextNode(studentData[i].student_info.number)
    const gradeNode = document.createTextNode(studentData[i].student_info.grade)
    const hoursNode = document.createTextNode(studentData[i].total_hours)

    name.appendChild(nameNode)
    number.appendChild(numberNode)
    grade.appendChild(gradeNode)
    hours.appendChild(hoursNode)

    div.appendChild(name)
    div.appendChild(number)
    div.appendChild(grade)
    div.appendChild(hours)

    card.appendChild(div)

    studentList.appendChild(card)

    card.addEventListener('click', async () => {
      console.log(card.id)
      const res = await axios.post('http://localhost:5000/get_entries', { number: parseInt(card.id) })
      entryData = res.data

      console.log(entryData)

      studentList.style.display = 'none'
      entryContainer.style.display = 'block'

      for (let i = 0; i < entryData.length; i++) {
        const card = document.createElement('div')
        const div = document.createElement('div')

        card.className += ('card card--info mb-1')
        div.className += ('card-body row')

        card.id = studentData[i].student_info.number

        const date = document.createElement('p')
        const startTime = document.createElement('p')
        const endTime = document.createElement('p')
        const hours = document.createElement('p')
        const activity = document.createElement('p')

        date.className = 'col'
        startTime.className = 'col'
        endTime.className = 'col'
        hours.className = 'col'
        activity.className = 'col'

        const dateNode = document.createTextNode(entryData[i].date)
        const startTimeNode = document.createTextNode(entryData[i].start_time)
        const endTimeNode = document.createTextNode(entryData[i].end_time)
        const hoursNode = document.createTextNode(entryData[i].hours)
        const activityNode = document.createTextNode(entryData[i].activity)

        date.appendChild(dateNode)
        startTime.appendChild(startTimeNode)
        endTime.appendChild(endTimeNode)
        hours.appendChild(hoursNode)
        activity.appendChild(activityNode)

        div.appendChild(date)
        div.appendChild(startTime)
        div.appendChild(endTime)
        div.appendChild(hours)
        div.appendChild(activity)

        card.appendChild(div)

        entryList.appendChild(card)
      }
    })
  }
}

document.querySelector('.btn--back').addEventListener('click', () => {
  entryContainer.style.display = 'none'
  studentList.style.display = 'block'
  entryList.innerHTML = ''
})

// document.querySelector('#btn').addEventListener('click', async () => {})

getStudents()