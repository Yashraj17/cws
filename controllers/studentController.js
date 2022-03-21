const CourseCollection = require('../models/courseModel');
const payment = require('../models/PaymentModels');
const moment = require("moment");
const studentCourse = require('../models/StudentCourseModel');
const StudentCollection = require('../models/StudentModels');
 
class StudentController{
    static insert=(req,res)=>{
        const data = new StudentCollection({
            name:req.body.name,
            father_name:req.body.father_name,
            contact:req.body.contact,
            email:req.body.email,
            gender:req.body.gender,
            address:req.body.address,
            education:req.body.education,
            password:req.body.password,
        })
        data.save().then(()=>{
            console.log('data inserted successfully');
            res.redirect('/')
        }).catch(()=>{
            console.log('not inserted data');
        })
    }

static dashboard=async (req,res)=>{
    const data = await  StudentCollection.findOne({"_id":req.session.student_id})
    res.render('student/dashboard',{user:data})
}
static manageStudentCourses= async(req,res)=>{
    var log = req.session.student_id
    var std = await StudentCollection.findById(log)
   var stdCourse = await studentCourse.find({studentId:log}).populate('CourseId')
    res.render('student/mangeCourse',{
        'student':std,
        'studentCourse':stdCourse
    })
}
static addStudentCourseStore = async (req,res) =>{
    var log = req.session.student_id
    var std = await StudentCollection.findById(log)
    var currentDate = new Date();
    // var dataNow = datetime.toISOString().slice(0,10)
    const stdCourse = await studentCourse.exists({studentId:std._id,CourseId:req.body.courseId}).then((exits)=>{
        if (exits) {
            res.redirect("/student/course/manage")
        } else {
            var stdCourse = studentCourse({
                studentId: std._id,
                CourseId:req.body.courseId,
                status:1,
                doj:currentDate,
            })
            stdCourse.save()
            res.redirect("/student/course/manage")
        }
    })
}

static addStudentCourse= async (req,res)=>{
    var log = req.session.student_id
    var data = await StudentCollection.findById(log)
    const std = await CourseCollection.find({})
    console.log(data);
    res.render('student/addCourse',{'user':data,
    'course':std})
}

static edit_student_course = async (req,res)=>{
    var id = req.params.c_id
    console.log(id);
    var data = await studentCourse.findById(id)
    if (data.status == 1) {
        await studentCourse.findByIdAndUpdate({"_id":id},{status:2},{new: true})
        res.redirect('/student/course/manage')
    } else {
        await studentCourse.findByIdAndUpdate({"_id":id},{status:1},{new: true})
        res.redirect('/student/course/manage')
    }
 
}

static checkLogin = async (req,res) => {
    
    try{
        const {email, password} = req.body;
        const checkData = await StudentCollection.findOne({email:email});
        if(checkData != null){
            if(checkData.email == email && checkData.password == password){
               req.session.student_id = checkData._id;
               console.log("this is testing for student: " + req.session.student_id)
               res.redirect("/student/dashboard");     
            }
        }
       else{
           var err = new Error("Username or password in incorrect try again")
           err.status = 401;
           console.log(err);
           res.redirect("/");
       }
   }
   catch(error){
       console.log(error);
   }
};



static studentLogout=(req,res)=>{
    const sess = req.session.student_id
    req.sessionStore.destroy(sess,(error)=>{
        if (error) {
            console.log('session not deleted');
        }
        else{
            console.log('session deleted successfully');
            res.redirect('/')
        }
    })
}
static generatePayment= async (req,res)=>{
    var log = req.session.student_id;
    var stdCourse = await studentCourse.find({studentId:log}).populate('CourseId')
    for (let c = 0; c < stdCourse.length; c++) {
    var doj = stdCourse[c].doj;
    var Cor_id = stdCourse[c].CourseId._id 
    // console.log('this is courese',Cor_id);
    var dateOfJoin = new Date(doj)
    var dojYear = dateOfJoin.getFullYear();
    var dojMonth = dateOfJoin.getMonth() + 1;
    var dojDate = dateOfJoin.getDate();

    var currentDate = new Date();
    var currYear = currentDate.getFullYear();
    var currMonth = currentDate.getMonth() + 1;
    var currDate = currentDate.getDate();

    
   var diffMonth = moment([currYear,currMonth,currDate]).diff(moment([dojYear,dojMonth,dojDate]),"months")
   var counterMonth = dojMonth;
   var counterYear = dojYear;
       
   for (var i=0;i<diffMonth;i++) {
    // console.log('this is the course',stdCourse[c].CourseId );
        var checkPayment = await payment.exists({courseId:Cor_id ,month:counterMonth,stdId:log,year:counterYear}).then((exist)=>{
            if (exist) {
                // res.redirect('/student/payment/manage')
                console.log('already exits == ',counterMonth);
            } else {
                console.log('not exists==',counterMonth);
                try {
                  payment.create({
                        stdId:log,
                        c_Id:Cor_id,
                        month:counterMonth,
                        year:counterYear,
                        dop: currentDate,
                        amount : 700,
                    })
                    console.log('Payment updated successfully');
                } catch (error) {
                    console.log(error);
                }
            }
        })
        if(counterMonth > 11){
            counterMonth/= 12;
            counterYear++;
            
        }
        else{
            counterMonth++;
        }
    }
}
}
static managePayment = async (req,res)=>{
        this.generatePayment(req,res);
    var log = req.session.student_id;
    var stdDetail = await StudentCollection.findById(req.session.student_id)
    var studenPayment = await payment.find({stdId:log}).populate('c_Id')
    res.render('student/managePayment',{studentPayment:studenPayment,student:stdDetail})
}

static requestPayment = async (req,res)=>{
    var std_id = req.params.pay_id;
    payment.updateOne({_id:std_id},{status:-1},function (error) {
        if (error) {
            console.log(error);
        } else {
            return res.redirect("/student/payment/manage");
        }
    })
}
    
}
module.exports = StudentController;