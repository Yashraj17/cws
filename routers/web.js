var express  = require("express");
const { route } = require("express/lib/application");
const { Dashboardview, ManageStudent, DeleteStudent, NewAdmission, ViewStudent, ApproveStudent, DeactiveStudent, InsertAdmin, AdminLogin, AcceptPayment, logout } = require("../controllers/AdminController");
const { InsertCourseForm, InsertCourseCategory, InsertCourse, ManageCourse, DeleteCourse } = require("../controllers/couseController");
const StudentController = require("../controllers/studentController");
var router = express.Router();
var auth = require('../Middleware/auth')


router.get('/',function (req,res) {
    res.render('home')
})
router.get('/apply',function (req,res) {
    res.render('applyStudent')
})

router.post('/apply',StudentController.insert);

//admin routes

router.get("/admin/dashboard",auth.isAuthorized,Dashboardview);
router.get("/admin/manage-students",auth.isAuthorized,ManageStudent);
router.get("/admin/student/:id/view/",auth.isAuthorized,ViewStudent);
router.get("/admin/new-admission",auth.isAuthorized,NewAdmission);
router.get("/admin/student-approve/:id",auth.isAuthorized,ApproveStudent);
router.get("/admin/deactive/:id",auth.isAuthorized,DeactiveStudent);
router.get("/admin/delete/:id",auth.isAuthorized,DeleteStudent);
router.get('/admin/register',InsertAdmin)
        router.get("/admin/login", (req,res) => {
            // if(req.session.user_id){
            //     return res.redirect("/admin/dashboard");
            // }
            res.render("login")
        });
router.post('/admin/login',AdminLogin)
router.get('/admin/logout',logout)
// Courses routes

router.get("/admin/insert-course",auth.isAuthorized,InsertCourseForm)
router.get("/admin/manageCourse",auth.isAuthorized,ManageCourse)
router.post("/admin/insert-course-category",auth.isAuthorized,InsertCourseCategory)
router.post("/admin/insert-course",auth.isAuthorized,InsertCourse)
router.get("/Delete-Courses/:_id",auth.isAuthorized,DeleteCourse)

//student login
router.get("/student/dashboard",auth.isStudentAuthorized,StudentController.dashboard);
router.post("/student/login",StudentController.checkLogin);
router.get('/student/logout',StudentController.studentLogout)
router.get('/student/course/manage',StudentController.manageStudentCourses)

router.get('/student/course/add',StudentController.addStudentCourse)
router.post('/student/course/add',StudentController.addStudentCourseStore)
//edit courses
router.get('/student/course/manage/:c_id',StudentController.edit_student_course)
//payments
router.get('/student/payment/manage',auth.isStudentAuthorized,StudentController.managePayment)
//request payment
router.get('/student/payment/manage/:pay_id/request',auth.isStudentAuthorized,StudentController.requestPayment)
//admin accept payment
router.get('/admin/dashboard/:pay_id/approve',auth.isAuthorized,AcceptPayment)

module.exports = router;