const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  student_info: Object,
  entries: Array,
  total_hours: {
    type: Number,
    default: 0
  }
})

module.exports = Student = mongoose.model('Student', StudentSchema)