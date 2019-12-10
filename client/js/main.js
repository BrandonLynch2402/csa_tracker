const axios = require('axios')

const calender = {
  0: 31,
  1: 28,
  2: 31,
  3: 30,
  4: 31,
  5: 30,
  6: 31,
  7: 31,
  8: 30,
  9: 31,
  10: 30,
  11: 31
}

let studentList = document.querySelector('.student-list')
let entryList = document.querySelector('.entry-list')
let entryContainer = document.querySelector('.container--entries')
let studentFormContainer = document.querySelector('.container--student-form')
let editstudentFormContainer = document.querySelector('.container--edit-student-form')
let entryFormContainer = document.querySelector('.container--entry-form')
let editEntryFormContainer = document.querySelector('.container--edit-entry-form')
let manageCategoriesContainer = document.querySelector('.container--manage-categories')
let categoryList = document.querySelector('.category-list')
let printOptionsContainer = document.querySelector('.container--print-options')

let currentStudentNum = 0
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

  newStudentAlert.style.display = 'none'

  nameInp.value = ''
  numberInp.value = ''
  gradeInp.value = ''
})

// Add student page and functionality
document.querySelector('.btn--student').addEventListener('click', () => {
  studentList.style.display = 'none'
  studentFormContainer.style.display = 'block'
})

// Add student information
const nameInp = document.querySelector('#name')
const numberInp = document.querySelector('#number')
const gradeInp = document.querySelector('#grade')
const submitInp = document.querySelector('#studentSubmit')

const newStudentAlert = document.querySelector('#new-student-alert')

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
  const res = await axios.post('http://localhost:5000/get_student', { number })
  
  // VALIDATION
  if (!name || !number || !grade) {
    newStudentAlert.innerHTML = 'Please fill out all fields.'
    return newStudentAlert.style.display = 'block'
  }

  if (res.data.length > 0) {
    newStudentAlert.innerHTML = 'student number already exists'
    return newStudentAlert.style.display = 'block'
  }

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

// Edit entry information
const editCategoryInp = document.querySelector('#editCategory')
const editDateInp = document.querySelector('#editDate')
const editStartTimeInp = document.querySelector('#edit-start-time')
const editEndTimeInp = document.querySelector('#edit-end-time')

let editCategory
let editDate
let editStart_time
let editEnd_time

editCategoryInp.addEventListener('change', e => {
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

// Generate student cards
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
    const res = await axios.post('http://localhost:5000/get_entries',
    { number: parseInt(card.id) }
    )

    studentList.style.display = 'none'
    entryContainer.style.display = 'block'

    currentStudentNum = card.id

    document.querySelector('.entry-header').innerHTML = await getStudentName()

    entryList.id = "E" + card.id

    for (let i = 0; i < res.data.length; i++) {
      const card = document.createElement('div')
      const div = document.createElement('div')

      const arr = ['date', 'start_time', 'end_time', 'hours', 'category']

      card.className += ('card card--info mb-1')
      div.className += ('card-body row')

      
      for (let j = 0; j < arr.length; j++) {
        card.id = (currentStudentNum + res.data[i][arr[1]] + res.data[i][arr[2]] + res.data[i][arr[0]]).replace(/\D/g,'')

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

        const cat = await axios.post('http://localhost:5000/get_categories', {
          number: parseInt(currentStudentNum)
        })

        for (let i = 0; i < cat.data.length; i++) {
          const option = document.createElement('option')
          option.value = cat.data[i]
          const node = document.createTextNode(cat.data[i])
          option.appendChild(node)
          editCategoryInp.appendChild(option)
        }

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
  categoryInp.innerHTML = '<option disabled selected></option>'

  newEntryAlert.style.display = 'none'

  categoryInp.value = ''
  dateInp.value = ''
  startTimeInp.value = ''
  endTimeInp.value = ''
})

// Add entry information
const categoryInp = document.querySelector('#category')
const dateInp = document.querySelector('#date')
const startTimeInp = document.querySelector('#start-time')
const endTimeInp = document.querySelector('#end-time')
const entrySubmit = document.querySelector('#entrySubmit')

const newEntryAlert = document.querySelector('#new-entry-alert')

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
  const entries = await axios.post('http://localhost:5000/get_entries', { number: parseInt(currentStudentNum) })

  const matchedEntry = entries.data.filter(entry => entry.date == date)

  hours = calcHours(start_time, end_time)

  if (!category || !date || !start_time || !end_time) {
    newEntryAlert.innerHTML = 'Please fill out all fields.'
    return newEntryAlert.style.display = 'block'
  }

  if (hours <= 0) {
    newEntryAlert.innerHTML = 'Please enter a valid time frame.'
    return newEntryAlert.style.display = 'block'
  }

  if (matchedEntry.length > 0) {
    if ((end_time + ":00" >= matchedEntry[0].start_time + ":00") && (start_time + ":00" <= matchedEntry[0].end_time + ":00")) {
      newEntryAlert.innerHTML = 'An entry already exists within the same date and time.'
      return newEntryAlert.style.display = 'block'
    }
  }
  
  entryID = (currentStudentNum + start_time + end_time + date).replace(/\D/g,'')
  
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

  card.addEventListener('click', async () => {
    const res = await axios.post('http://localhost:5000/get_entries', { number: parseInt(currentStudentNum) })

    entryContainer.style.display = 'none'
    editEntryFormContainer.style.display = 'block'

    const cat = await axios.post('http://localhost:5000/get_categories', {
      number: parseInt(currentStudentNum)
    })

    for (let i = 0; i < cat.data.length; i++) {
      const option = document.createElement('option')
      option.value = cat.data[i]
      const node = document.createTextNode(cat.data[i])
      option.appendChild(node)
      editCategoryInp.appendChild(option)
    }

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

  newEntryAlert.style.display = 'none'

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
  
  category = undefined
  date = undefined
  start_time = undefined
  end_time = undefined
  hours = undefined
  entryID = undefined

  await setTotalHours()  
})

// Calculate amount of hours from two times
function calcHours(start, end) {
  if (start == undefined || end == undefined) {
    return undefined
  }

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

// Edit entry
const editStudentAlert = document.querySelector('#edit-student-alert')
  
document.querySelector('#editStudentSubmit').addEventListener('click', async () => {
  const res = await axios.post('http://localhost:5000/get_student', { number:  parseInt(editNumberInp.value) })

  if (!editNameInp.value || !editNumberInp.value) {
    editStudentAlert.style.display = 'block'
    return editStudentAlert.innerHTML = 'Please fill out all fields.'
  }

  if ((res.data.length > 0) && (editNumberInp.value != currentStudentNum)) {
    editStudentAlert.style.display = 'block'
    return editStudentAlert.innerHTML = 'Student number already exists.'
  }
  editStudentAlert.style.display = 'none'

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

  await getStudentName()
  document.querySelector('.entry-header').innerHTML = await getStudentName()
})

// Back button from edit student page
document.querySelector('.btn--edit-student-back').addEventListener('click', () => {
  editstudentFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'

  editStudentAlert.style.display = 'none'
})

// Show delete student confirmation warning
document.querySelector('.btn--delete-student').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'block'
})

// Delete student
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

// Cancel deletion of student
document.querySelector('.btn--deny-student-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-student').style.display = 'none'  
})

// Back button from edit entry page
document.querySelector('.btn--edit-entry-back').addEventListener('click', () => {
  editEntryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'
  editCategoryInp.innerHTML = ''

  updateEntryAlert.style.display = 'none'
})

// Edit entries
const updateEntryAlert = document.querySelector('#update-entry-alert')

document.querySelector('#editEntrySubmit').addEventListener('click', async () => {
  const entries = await axios.post('http://localhost:5000/get_entries', { number: parseInt(currentStudentNum) })

  const matchedEntry = entries.data.filter(entry => entry.date == editDate)

  const editHours = calcHours(editStart_time, editEnd_time)

  if (!editCategory || !editDate || !editStart_time || !editEnd_time) {
    updateEntryAlert.innerHTML = 'Please fill out all fields.'
    return updateEntryAlert.style.display = 'block'
  }

  if (editHours <= 0) {
    updateEntryAlert.innerHTML = 'Please enter a valid time frame.'
    return updateEntryAlert.style.display = 'block'
  }

  if (matchedEntry.length > 0) {
    if ((editEnd_time + ":00" >= matchedEntry[0].start_time + ":00") && (editStart_time + ":00" <= matchedEntry[0].end_time + ":00")) {
      updateEntryAlert.innerHTML = 'An entry already exists within the same date and time.'
      return updateEntryAlert.style.display = 'block'
    }
  }
  updateEntryAlert.style.display = 'none'

  editCategoryInp.innerHTML = ''

  const currentEntry = document.getElementById(currentEntryID).childNodes[0].childNodes

  currentEntry[0].innerHTML = editDate
  currentEntry[1].innerHTML = editStart_time
  currentEntry[2].innerHTML = editEnd_time
  currentEntry[3].innerHTML = editHours
  currentEntry[4].innerHTML = editCategory

  newEntryID = (currentStudentNum + editStart_time + editEnd_time + editDate).replace(/\D/g,'')

  document.getElementById(currentEntryID).id = newEntryID

  updatedEntries[entryIndex] = {
    category: editCategory,
    date: editDate,
    start_time: editStart_time,
    end_time: editEnd_time,
    entryID: newEntryID,
    hours: calcHours(editStart_time, editEnd_time)
  }
  
  editEntryFormContainer.style.display = 'none'
  entryContainer.style.display = 'block'

  axios.post('http://localhost:5000/update_entry', {
    number: parseInt(currentStudentNum),
    entries: updatedEntries
  }).then(async () => {
    await setTotalHours()
  })
})

let selected = false
let categoryData = []

// Show manage categories page
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
    card.id = 'C' + currentStudentNum + res.data[i]

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

      editCategorySubmit.addEventListener('click', async () => {
        const manageCategoriesAlert = document.querySelector('#manage-categories-alert')
        
        const cat = await axios.post('http://localhost:5000/get_categories', { number: parseInt(currentStudentNum) })
        
        if (!updatedCategory) {
          manageCategoriesAlert.style.display = 'block'
          return manageCategoriesAlert.innerHTML = 'Please fill out the field.'
        }
        
        if (cat.data.filter(category => category == updatedCategory).length > 0) {
          manageCategoriesAlert.style.display = 'block'
          return manageCategoriesAlert.innerHTML = 'This category already exists.'    
        }
        manageCategoriesAlert.style.display = 'none'
        
        const entries = await axios.post('http://localhost:5000/get_entries', { number: parseInt(currentStudentNum) })
        
        let updatedCategoryEntries = []
        
        entries.data.map(entry => {
          if (entry.category == res.data[i]) {
            entry.category = updatedCategory
            return updatedCategoryEntries.push(entry)
          }
          return updatedCategoryEntries.push(entry)
        })

        for (let j = 0; j < document.getElementById("E" + currentStudentNum).childNodes.length; j++) {
          if (document.getElementById("E" + currentStudentNum).childNodes[j].childNodes[0].childNodes[4].innerHTML == res.data[i]) {
            document.getElementById("E" + currentStudentNum).childNodes[j].childNodes[0].childNodes[4].innerHTML = updatedCategory
          }
        }

        axios.post('http://localhost:5000/update_entry', {
          number: parseInt(currentStudentNum),
          entries: updatedCategoryEntries
        })
        
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

// Back button from manage categories page
document.querySelector('.btn--manage-categories-back').addEventListener('click', () => {
  manageCategoriesContainer.style.display = 'none'
  entryContainer.style.display = 'block'
  categoryList.innerHTML = ''
  selected = false

  manageCategoriesAlert.style.display = 'none'
  document.querySelector('#newCategory').value = ''
})


// Add category
let newCategory = ''

document.querySelector('#newCategory').addEventListener('keyup', (e) => {
  newCategory = e.target.value
})

const manageCategoriesAlert = document.querySelector('#manage-categories-alert')

document.querySelector('#categorySubmit').addEventListener('click', async () => {
  const cat = await axios.post('http://localhost:5000/get_categories', { number: parseInt(currentStudentNum) })

  if (!newCategory) {
    manageCategoriesAlert.style.display = 'block'
    return manageCategoriesAlert.innerHTML = 'Please fill out the field.'
  }

  if (cat.data.filter(category => category == newCategory).length > 0) {
    manageCategoriesAlert.style.display = 'block'
    return manageCategoriesAlert.innerHTML = 'This category already exists.'    
  }
  manageCategoriesAlert.style.display = 'none'

  const card = document.createElement('div')

  card.className += ('list-group card--info mb-1')
  card.id = 'C' + currentStudentNum + newCategory

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
    editCategorySubmit.className += 'btn btn-info mb-3 mr-1'
    editCategorySubmit.id = 'editCategorySubmit'
    editCategorySubmit.innerHTML = 'Update'

    editCategorySubmit.addEventListener('click', async () => {
      const manageCategoriesAlert = document.querySelector('#manage-categories-alert')

      const cat = await axios.post('http://localhost:5000/get_categories', { number: parseInt(currentStudentNum) })
      
      if (!updatedCategory) {
        manageCategoriesAlert.style.display = 'block'
        return manageCategoriesAlert.innerHTML = 'Please fill out the field.'
      }

      if (cat.data.filter(category => category == updatedCategory).length > 0) {
        manageCategoriesAlert.style.display = 'block'
        return manageCategoriesAlert.innerHTML = 'This category already exists.'    
      }
      manageCategoriesAlert.style.display = 'none'

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

  newCategory = ''
})

// Delete entry confirmation
document.querySelector('#deleteEntry').addEventListener('click', () => {
  document.querySelector('.alert--delete-entry').style.display = 'block'
})

// Delete entry
document.querySelector('.btn--confirm-entry-delete').addEventListener('click', async () => {
  editCategoryInp.innerHTML = ''

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

  await setTotalHours()
})

// Cancel deletion of entry
document.querySelector('.btn--deny-entry-delete').addEventListener('click', () => {
  document.querySelector('.alert--delete-entry').style.display = 'none'
})

// Calculate student's total hours
async function calcTotalHours() {
  const res = await axios.post('http://localhost:5000/get_entries', {
    number: parseInt(currentStudentNum)
  })

  if (res.data.length > 0) {
    return res.data
      .map(entry => entry.hours)
      .reduce((accumulator, currentValue) => accumulator + currentValue)
  } else {
    return 0
  }
}

// Set student's total hours
async function setTotalHours() {
  const totalHours = await calcTotalHours();

  const studentInfoList = document.getElementById(currentStudentNum).childNodes[0].childNodes
  studentInfoList[3].innerHTML = totalHours

  return await axios.post('http://localhost:5000/set_total_hours', {
    number: parseInt(currentStudentNum),
    total_hours: parseInt(totalHours)
  })
}

// PRINT OPTIONS
const printPageList = document.querySelector('.print-page-list')
const weekSelect = document.querySelector('#week')
const monthSelect = document.querySelector('#month')
const totalSelect = document.querySelector('#total')
const csaSelect = document.querySelector('#csa')
const dateSelect = document.querySelector('#print-date')

let printDate

// Show print options page
document.querySelector('.btn--print-options').addEventListener('click', async () => {
  entryContainer.style.display = 'none'
  printOptionsContainer.style.display = 'block'
  
  document.querySelector('#print-student-name').innerHTML = await getStudentName()
})

// Back button from print options page
document.querySelector('.btn--print-options-back').addEventListener('click', () => {
  printOptionsContainer.style.display = 'none'
  entryContainer.style.display = 'block'

  printPageAlert.style.display = 'none'

  weekSelect.checked = false
  monthSelect.checked = false
  totalSelect.checked = false
  csaSelect.checked = false
  dateSelect.value = ''
})

dateSelect.addEventListener('change', e => {
  printDate = e.target.value
})

// Generate print page
const printPageAlert = document.querySelector('#print-page-alert')

document.querySelector('.btn--print-submit').addEventListener('click', async () => {  
  const description = document.querySelector('#print-info')

  let entries  
  // VALIDATION
  if (printDate == undefined) {
    printPageAlert.style.display = 'block'
    return printPageAlert.innerHTML = 'Please fill out all fields.'
  }

  if (weekSelect.checked) {
    const weekPeriod = generateWeekPeriod(printDate)
    entries = await getEntriesByDate(weekPeriod)
    description.innerHTML = `From ${weekPeriod[0]} to ${weekPeriod[6]}`
  } else if (monthSelect.checked) {
    const dateObj = new Date(printDate)
    entries = await getEntriesByDate(generateMonthPeriod(printDate))
    description.innerHTML = `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`
  } else if (!weekSelect.checked && !monthSelect.checked) {
    printPageAlert.style.display = 'block'
    return printPageAlert.innerHTML = 'Please fill out all fields.'
  }

  if (!totalSelect.checked && !csaSelect.checked) {
    printPageAlert.style.display = 'block'
    return printPageAlert.innerHTML = 'Please fill out all fields.'
  }

  printPageAlert.style.display = 'none'

  printPageList.innerHTML = ''
  printOptionsContainer.style.display = 'none'
  document.querySelector('.container--print-page').style.display = 'block'

  if (totalSelect.checked) {
    const listGroup = document.createElement('div')
    listGroup.className += 'list-group'
  
    const headerContainer = document.createElement('div')
    headerContainer.className += 'list-group-item bold list-group-item-secondary'
  
    const headerDiv = document.createElement('div')
    headerDiv.className += 'row'
  
    const headerDateElement = document.createElement('div')
    const headerDateNode = document.createTextNode('Date')
    headerDateElement.className = 'col'
    headerDateElement.appendChild(headerDateNode)
  
    const headerHoursElement = document.createElement('div')
    const headerHoursNode = document.createTextNode('Hours')
    headerHoursElement.className = 'col'
    headerHoursElement.appendChild(headerHoursNode)
  
    headerDiv.appendChild(headerDateElement)
    headerDiv.appendChild(headerHoursElement)
  
    headerContainer.appendChild(headerDiv)
  
    listGroup.appendChild(headerContainer)
  
    for (let i = 0; i < entries.length; i++) {
      const listItem = document.createElement('div')
      listItem.className += 'list-group-item'
  
      const div = document.createElement('div')
      div.className += 'row'
  
      const dateElement = document.createElement('div')
      const dateNode = document.createTextNode(entries[i].date)
      dateElement.className += 'col'
  
      const hoursElement = document.createElement('div')
      const hoursNode = document.createTextNode(entries[i].hours)
      hoursElement.className += 'col'
  
      dateElement.appendChild(dateNode)
      hoursElement.appendChild(hoursNode)
  
      div.appendChild(dateElement)
      div.appendChild(hoursElement)
  
      listItem.appendChild(div)
  
      listGroup.appendChild(listItem)
    }
  
    const footerContainer = document.createElement('div')
    footerContainer.className += 'list-group-item bold list-group-item-dark'
  
    const footerDiv = document.createElement('div')
    footerDiv.className += 'row'
  
    const footerLabelElement = document.createElement('div')
    const footerLabelNode = document.createTextNode('Total Hours')
    footerLabelElement.className = 'col'
    footerLabelElement.appendChild(footerLabelNode)
  
    const footerTotalHoursElement = document.createElement('div')
    const footerTotalHoursNode = document.createTextNode(generateTotalPrintHours(entries))
    footerTotalHoursElement.className = 'col'
    footerTotalHoursElement.appendChild(footerTotalHoursNode)
  
    footerDiv.appendChild(footerLabelElement)
    footerDiv.appendChild(footerTotalHoursElement)
  
    footerContainer.appendChild(footerDiv)
  
    listGroup.appendChild(footerContainer)
  
    printPageList.appendChild(listGroup)
  } else if (csaSelect.checked) {
    const res = await axios.post('http://localhost:5000/get_categories', {
      number: parseInt(currentStudentNum)
    })

    const categories = res.data

    let info = {}

    for (let i = 0; i < categories.length; i++) {
      info[categories[i]] = []
    }
    
    for (let i = 0; i < entries.length; i++) {
      info[entries[i].category].push(entries[i])
    }

    const listGroup = document.createElement('div')
    listGroup.className += 'list-group'

    for (let i = 0; i < categories.length; i++) {
      const listItem = document.createElement('div')
      listItem.className += 'list-group-item list-group-item-primary'
  
      const div = document.createElement('div')
      div.className += 'row'

      if (!info[categories[i]].length == 0) {
        const categoryElement = document.createElement('div')
        categoryElement.className += 'col bold'
        const categoryNode = document.createTextNode(categories[i])
        categoryElement.appendChild(categoryNode)
        div.appendChild(categoryElement)
        listItem.appendChild(div)
        listGroup.appendChild(listItem)
      
        const headerContainer = document.createElement('div')
        headerContainer.className += 'list-group-item bold list-group-item-secondary'
      
        const headerDiv = document.createElement('div')
        headerDiv.className += 'row'
      
        const headerDateElement = document.createElement('div')
        const headerDateNode = document.createTextNode('Date')
        headerDateElement.className = 'col'
        headerDateElement.appendChild(headerDateNode)
      
        const headerHoursElement = document.createElement('div')
        const headerHoursNode = document.createTextNode('Hours')
        headerHoursElement.className = 'col'
        headerHoursElement.appendChild(headerHoursNode)
      
        headerDiv.appendChild(headerDateElement)
        headerDiv.appendChild(headerHoursElement)
      
        headerContainer.appendChild(headerDiv)
      
        listGroup.appendChild(headerContainer)
      }

      let categoryHours = []

      for (let j = 0; j < info[categories[i]].length; j++) {
        
        const listItem = document.createElement('div')
        listItem.className += 'list-group-item'
        
        const div = document.createElement('div')
        div.className += 'row'

        const dateElement = document.createElement('div')
        const dateNode = document.createTextNode(info[categories[i]][j].date)
        dateElement.className += 'col'
        dateElement.appendChild(dateNode)

        const hoursElement = document.createElement('div')
        const hoursNode = document.createTextNode(info[categories[i]][j].hours)
        hoursElement.className += 'col'
        hoursElement.appendChild(hoursNode)

        categoryHours.push(info[categories[i]][j].hours)

        div.appendChild(dateElement)
        div.appendChild(hoursElement)
        listItem.appendChild(div)
        listGroup.appendChild(listItem)
      }

      if (!info[categories[i]].length == 0) {
        const footerContainer = document.createElement('div')
        footerContainer.className += 'list-group-item bold list-group-item-dark'
      
        const footerDiv = document.createElement('div')
        footerDiv.className += 'row'
      
        const footerLabelElement = document.createElement('div')
        const footerLabelNode = document.createTextNode('Total Hours')
        footerLabelElement.className = 'col'
        footerLabelElement.appendChild(footerLabelNode)
      
        const footerTotalHoursElement = document.createElement('div')

        const footerTotalHoursNode = document.createTextNode(categoryHours.reduce((acc, current) => acc + current))
        footerTotalHoursElement.className = 'col'
        footerTotalHoursElement.appendChild(footerTotalHoursNode)
      
        footerDiv.appendChild(footerLabelElement)
        footerDiv.appendChild(footerTotalHoursElement)
      
        footerContainer.appendChild(footerDiv)
      
        listGroup.appendChild(footerContainer)
      
        printPageList.appendChild(listGroup)
      }
    }
    printPageList.appendChild(listGroup)
  }
})

// Back button from the generated printed page
document.querySelector('.btn--print-page-back').addEventListener('click', () => {
  document.querySelector('.container--print-page').style.display = 'none'
  printOptionsContainer.style.display = 'block'
})

// Convert dates into a specific format
function convertDateFormat(initialDate) {
  const splitDate = initialDate.split('-')
  return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
}

// Generate the days in the week based on one date
function generateWeekPeriod(initialDate) {
  const dateObj = new Date(convertDateFormat(initialDate))
  let dates = []
  let date = dateObj.getDate()
  let day = dateObj.getDay()
  let month = dateObj.getMonth()
  let year = dateObj.getFullYear()

  if (day != 0) {
    for (let i = 1; i < day; i++) {
      date -= 1
    }
  } else if (day == 0) {
    date -= 6
  }

  if (date < 0 && year % 4 == 0 && month == 2) {
    date += 29
  } else if (date < 0 && month == 0) {
    date += 31
    year -= 1
    month = 11
  } else if (date <= 0) {
    date += calender[month - 1]
    month -= 1
  }

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(`${year}-${month + 1}-${date}`).toISOString().substr(0, 10))
    
    if (year % 4 == 0 && month == 1 && date == calender[month]) {
      dates.push(new Date(`${year}-${month + 1}-29`).toISOString().substr(0, 10))
    }

    if (date == calender[month]) {
      date = 0
      month += 1

      if (month == 12) {
        month = 0
        year += 1
      }
    }

    date += 1
  }

  if (dates.length > 7) {
    dates.pop()
  }

  return dates
}

// Generate oll dates in the month based off of one date
function generateMonthPeriod(initialDate) {
  const dateObj = new Date(convertDateFormat(initialDate))
  const month = dateObj.getMonth()
  const year = dateObj.getFullYear()

  let dates = []

  for (let i = 1; i <= calender[month]; i++) {
    dates.push(new Date(`${year}-${month + 1}-${i}`).toISOString().substr(0, 10))
  }

  if (year % 4 == 0 && month == 1) {
    dates.push(new Date(`${year}-${month + 1}-29`).toISOString().substr(0, 10))
  }

  return dates
}

async function getEntriesByDate(dates) {
  const res = await axios.post('http://localhost:5000/get_entries', { number: parseInt(currentStudentNum) })

  let entries = []

  for (let i = 0; i < dates.length; i++) {
    for (let j = 0; j < res.data.length; j++) {
      if (res.data[j].date == dates[i]) {
        entries.push(res.data[j])
      }      
    }
  }

  return entries
}

// Generates total hours for the printed page
function generateTotalPrintHours(entries) {
  let total = 0
  for (let i = 0; i < entries.length; i++) {
    total += entries[i].hours
  }
  return total
}

// Get student's name from database
async function getStudentName() {
  const res = await axios.post('http://localhost:5000/get_student', { number: parseInt(currentStudentNum) })
  return res.data[0].student_info.name
}