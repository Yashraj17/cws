
studentModel = require('../models/StudentModels')
AdminModel = require('../models/AdminModel')

function isAuthorized(req,res,next) {
    AdminModel.findById(req.session.user_id).exec(function (error,admin) {
        if(error){
            return(error);
        }
        else{
            if (admin===null) {
                // var err = new Error('not authorized go back')
                // err.status = 401;
                 res.redirect('/admin/login')
            } else {
                return next();
            }
        }
    })
}

function isStudentAuthorized(req,res,next) {
    studentModel.findById(req.session.student_id).exec(function (error,admin) {
        if(error){
            return(error);
        }
        else{
            if (admin===null) {
                // var err = new Error('not authorized go back')
                // err.status = 401;
                 res.redirect('/')
            } else {
                return next();
            }
        }
    })
}
module.exports = {
    isAuthorized,
    isStudentAuthorized,
}