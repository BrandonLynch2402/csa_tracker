const axios = require('axios')

let studentList = document.querySelector('.student-list')
let entryList = document.querySelector('.entry-list')
let entryContainer = document.querySelector('.container--entries')
let studentFormContainer = document.querySelector('.container--student-form')
let editstudentFormContainer = document.querySelector('.container--edit-student-form')
let entryFormContainer = document.querySelector('.container--entry-form')
let editEntryFormContainer = document.querySelector('.container--edit-entry-form')
let manageCategoriesContainer = document.querySelector('.container--manage-categories')
let categoryList = document.querySelector('.category-list')

let currentStudentNum = 0
let entryLength = 0
let entryInfo = {}
let entryIndex = 0
let currentEntryID = ''
let updatedEntries = []

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

const editCategoryInp = document.querySelector('#editCategory')
const editDateInp = document.querySelector('#editDate')
const editStartTimeInp = document.querySelector('#edit-start-time')
const editEndTimeInp = document.querySelector('#edit-end-time')

let editCategory
let editDate
let editStart_time
let editEnd_time

editCategoryInp.addEventListener('keyup', e => {
  editCategory = e.target.value
})

editDateInp.addEventListener('change', e => {
  editDate = e.target.value
})

editStartTimeInp.addEventListener('change', e => {
  editStart_time = e.target.value
})

editEndTimeInp.addEventListener('change', e => {
  editEnd_time = e.target.value
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

    entryLength = res.data.length

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

      card.id = "E" + currentStudentNum + (i + 1);

      for (let j = 0; j < arr.length; j++) {
        const element = document.createElement('p')
        element.className = 'col'
        const node = document.createTextNode(res.data[i][arr[j]])
        element.appendChild(node)
        div.appendChild(element)
        card.appendChild(div)
        entryList.appendChild(card)
      }
      card.addEventListener('click', async () => {
        entryContainer.style.display = 'none'
        editEntryFormContainer.style.display = 'block'

        entryInfo = res.data.filter(item => item.entryID == card.id)
        entryIndex = res.data.indexOf(entryInfo[0])
        currentEntryID = card.id

        editCategoryInp.value = entryInfo[0].category
        editDateInp.value = entryInfo[0].date
        editStartTimeInp.value = entryInfo[0].start_time
        editEndTimeInp.value = entryInfo[0].end_time

        editCategory = editCategoryInp.value
        editDate = editDateInp.value
        editStart_time = editStartTimeInp.value
        editEnd_time = editEndTimeInp.value
        
        updatedEntries = res.data
      })
    }
  })
}

// Show add entry page
document.querySelector('.btn--entry').addEventListener('click', async () => {
  entryContainer.style.display = 'none'
  entryFormContainer.style.display = 'block'

  const res = await axios.post('http://localhost:5000/get_categories', {
    number: parseInt(currentStudentNum)
  })

  for (let i = 0; i < res.data.length; i++) {
    const option = document.createElement('option')
    option.value = res.data[i]
    const node = document.createTextNode(res.data[i])
    option.appendChild(node)
    categoryInp.appendChild(option)
  }
})

// Back to entry page from add entry page
document.querySelector('.btn--entry-back').addEventListener('click', () => {
  entryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
  categoryInp.innerHTML = ''
})

const categoryInp = document.querySelector('#category')
const dateInp = document.querySelector('#date')
const startTimeInp = document.querySelector('#start-time')
const endTimeInp = document.querySelector('#end-time')
const entrySubmit = document.querySelector('#entrySubmit')

let category
let date
let start_time
let end_time
let hours
let entryID

categoryInp.addEventListener('change', e => {
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
  entryID = "E" + currentStudentNum + (entryLength + 1)

  entryLength += 1
  
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

  card.id = entryID

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
      category,
      entryID
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
  editstudentFormContainer.style.display = 'none'
  studentList.style.display = 'block'
})

document.querySelector('.btn--deny-student-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'none'  
})

document.querySelector('.btn--edit-entry-back').addEventListener('click', () => {
  editEntryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
})

document.querySelector('#editEntrySubmit').addEventListener('click', () => {
  updatedEntries[entryIndex] = {
    category: editCategory,
    date: editDate,
    start_time: editStart_time,
    end_time: editEnd_time,
    entryID: currentEntryID,
    hours: calcHours(editStart_time, editEnd_time)
  }

  const currentEntry = document.getElementById(currentEntryID).childNodes[0].childNodes

  currentEntry[0].innerHTML = editDate
  currentEntry[1].innerHTML = editStart_time
  currentEntry[2].innerHTML = editEnd_time
  currentEntry[3].innerHTML = calcHours(editStart_time, editEnd_time)
  currentEntry[4].innerHTML = editCategory

  editEntryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'

  axios.post('http://localhost:5000/update_entry', {
    number: parseInt(currentStudentNum),
    entries: updatedEntries
  })
})

let selected = false
let categoryData = []

document.querySelector('.btn--category').addEventListener('click', async () => {
  entryContainer.style.display = 'none'
  manageCategoriesContainer.style.display = 'block'

  const res = await axios.post('http://localhost:5000/get_categories', {
    number: parseInt(currentStudentNum)
  })
  
  categoryData = res.data

  for (let i = 0; i < res.data.length; i++) {
    const card = document.createElement('div')

    card.className += ('list-group card--info mb-1')
    card.id = 'C' + currentStudentNum + (i + 1)

    const element = document.createElement('li')
    element.className += 'list-group-item'
    element.id = res.data[i]
    const node = document.createTextNode(res.data[i])
    element.appendChild(node)
    card.appendChild(element)
    categoryList.appendChild(card)

    card.addEventListener('click', () => {      
      const currentCard = document.getElementById(card.id)
      const currentCategory = currentCard.childNodes[0].innerHTML

      const div = document.createElement('div')
      div.id = 'tempDiv'

      const textInp = document.createElement('input')
      textInp.className += ('form-control mb-1')
      textInp.placeholder = 'Updated Category'

      let updatedCategory = ''

      textInp.addEventListener('keyup', e => {
        updatedCategory = e.target.value
      })

      const editCategorySubmit = document.createElement('button')
      editCategorySubmit.className += ('btn btn-info mb-3 mr-1')
      editCategorySubmit.id = 'editCategorySubmit'
      editCategorySubmit.innerHTML = 'Update'

      editCategorySubmit.addEventListener('click', () => {
        let categories = res.data
        categories[res.data.indexOf(currentCategory)] = updatedCategory

        element.innerHTML = updatedCategory
        element.id = updatedCategory

        document.querySelector('#tempDiv').remove()
        selected = false

        axios.post('http://localhost:5000/update_category', {
          number: parseInt(currentStudentNum),
          categories
        })
      })

      const deleteCategoroy = document.createElement('button')
      deleteCategoroy.className += ('btn btn-danger mb-3')
      deleteCategoroy.id = 'deleteCategory'
      deleteCategoroy.innerHTML = 'Delete'

      deleteCategoroy.addEventListener('click', async () => {
        card.remove()

        document.querySelector('#tempDiv').remove()
        selected = false

        axios.post('http://localhost:5000/delete_category', {
          number: parseInt(currentStudentNum),
          category: currentCategory
        })
      })

      div.appendChild(textInp)
      div.appendChild(editCategorySubmit)
      div.appendChild(deleteCategoroy)

      if (selected == false) {
        currentCard.parentNode.insertBefore(div, currentCard.nextSibling)
        selected = true
      } else if (selected == true) {
        document.querySelector('#tempDiv').remove()
        selected = false
      }
    })
  }
})

document.querySelector('.btn--manage-categories-back').addEventListener('click', () => {
  manageCategoriesContainer.style.display = 'none'
  entryContainer.style.display = 'block'
  categoryList.innerHTML = ''
  selected = false
})

let newCategory = ''

document.querySelector('#newCategory').addEventListener('keyup', (e) => {
  newCategory = e.target.value
})

document.querySelector('#categorySubmit').addEventListener('click', () => {
  const card = document.createElement('div')

  card.className += ('list-group card--info mb-1')
  card.id = 'C' + currentStudentNum + (categoryData)

  const element = document.createElement('li')
  element.className += 'list-group-item'
  element.id = newCategory
  const node = document.createTextNode(newCategory)
  element.appendChild(node)
  card.appendChild(element)
  categoryList.appendChild(card)

  card.addEventListener('click', () => {      
    const currentCard = document.getElementById(card.id)
    const currentCategory = currentCard.childNodes[0].innerHTML

    const div = document.createElement('div')
    div.id = 'tempDiv'

    const textInp = document.createElement('input')
    textInp.className += ('form-control mb-1')
    textInp.placeholder = 'Updated Category'

    let updatedCategory = ''

    textInp.addEventListener('keyup', e => {
      updatedCategory = e.target.value
    })

    const editCategorySubmit = document.createElement('button')
    editCategorySubmit.className += ('btn btn-info mb-3 mr-1')
    editCategorySubmit.id = 'editCategorySubmit'
    editCategorySubmit.innerHTML = 'Update'

    editCategorySubmit.addEventListener('click', () => {
      let categories = categoryData
      categories.push(updatedCategory)

      element.innerHTML = updatedCategory
      element.id = updatedCategory

      document.querySelector('#tempDiv').remove()
      selected = false

      axios.post('http://localhost:5000/update_category', {
        number: parseInt(currentStudentNum),
        categories
      })
    })

    const deleteCategoroy = document.createElement('button')
    deleteCategoroy.className += ('btn btn-danger mb-3')
    deleteCategoroy.id = 'deleteCategory'
    deleteCategoroy.innerHTML = 'Delete'

    deleteCategoroy.addEventListener('click', async () => {
      card.remove()

      document.querySelector('#tempDiv').remove()
      selected = false

      axios.post('http://localhost:5000/delete_category', {
        number: parseInt(currentStudentNum),
        category: currentCategory
      })
    })

    div.appendChild(textInp)
    div.appendChild(editCategorySubmit)
    div.appendChild(deleteCategoroy)

    if (selected == false) {
      currentCard.parentNode.insertBefore(div, currentCard.nextSibling)
      selected = true
    } else if (selected == true) {
      document.querySelector('#tempDiv').remove()
      selected = false
    }
  })

  document.querySelector('#newCategory').value = ''

  axios.post('http://localhost:5000/add_category', {
    number: parseInt(currentStudentNum),
    category: newCategory
  })
})

// Delete Entry (1)
document.querySelector('#deleteEntry').addEventListener('click', () => {
  document.querySelector('.alert--delete-entry').style.display = 'block'
})

// Delete Entry (2)
document.querySelector('.btn--confirm-entry-delete').addEventListener('click', async (e) => {
  const res = await axios.post('http://localhost:5000/get_entries', {
    number: parseInt(currentStudentNum)
  })

  const removedEntry = res.data.filter(entry => entry.entryID == currentEntryID)[0]

  document.querySelector('.alert--delete-entry').style.display = 'none'

  editEntryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
  document.getElementById(currentEntryID).remove()

  axios.post('http://localhost:5000/delete_entry', {
    number: parseInt(currentStudentNum),
    entry: removedEntry
  })
})

// Delete Entry (3)
document.querySelector('.btn--deny-entry-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-entry').style.display = 'none'
})
