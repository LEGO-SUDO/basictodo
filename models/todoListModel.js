var mongoose=require('mongoose');

// Schema
const todoListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  }
});


module.exports = mongoose.model("todos", todoListSchema);