var mongoose = require('mongoose')

var courseCategoryModel = mongoose.Schema({
    cat_title:{type:String,require:true},
    cat_description: {type:String,require:false}
})
var CourseCategoryModel =  mongoose.model('course-category',courseCategoryModel);
module.exports = CourseCategoryModel;

