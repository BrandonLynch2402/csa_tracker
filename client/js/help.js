const helpContainer = document.querySelector('.container--help')
const helpBtn = document.querySelector('.btn--help')
const helpBtnBack = document.querySelector('.btn--help-back')

// Show help page
helpBtn.addEventListener('click', () => {
  studentList.style.display = 'none'
  helpContainer.style.display = 'block'
})

// Back from help page
helpBtnBack.addEventListener('click', () => {
  helpContainer.style.display = 'none'
  studentList.style.display = 'block'
})