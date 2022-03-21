const res = require('express/lib/response');
var CourseCollection = require('../models/courseModel')
var CourseCategoryModel = require('../models/courseCategoryModel')

function InsertCourseCategory(req,res) {
    console.log('this is cat_title',req.body.cat_title);
    var Course_Cat = new CourseCategoryModel({
        cat_title:req.body.cat_title,
        cat_description:req.body.cat_description
    });
    Course_Cat.save();
    res.redirect("/admin/insert-course");
}

function InsertCourseForm(req,res) {
    var data = CourseCategoryModel.find({},(error,response)=>{
        res.render("admin/insertCourse",{"category":response})
    })
}
// post method insert function 
function InsertCourse(req,res){
    var course = new CourseCollection ({
        title: req.body.name,
        instructor : req.body.instructor,
        duration: req.body.duration,
        price: req.body.price,
        discount_price: req.body.discount_price,
        status:req.body.status,
        category_id : req.body.category_id,
        description : req.body.description,
    });

    course.save();
    res.redirect("/admin/manageCourse");
}

async function ManageCourse(req,res) {
    var data = await CourseCollection.find({}).populate('category_id');
    console.log(data);
    res.render('admin/manageCourse',{"courses":data});
}

function DeleteCourse(req,res) {
    const id = req.params._id
    CourseCollection.remove({"_id":id},function (error) {
        if (error) {
            throw error
        } else {
            res.redirect('/admin/manageCourse')
        }
    })
}

module.exports ={
    InsertCourseForm,
    InsertCourseCategory,
    InsertCourse,
    ManageCourse,
    DeleteCourse,
}