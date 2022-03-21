var mongoose = require('mongoose')

var PaymentModel = mongoose.Schema({
    stdId : {type: mongoose.Schema.Types.ObjectId,ref:"students"},
    c_Id : {type: mongoose.Schema.Types.ObjectId,ref:"course"},
    month:{type:String,require:true},
    year:{type:String,require:true},
    status: {type:Number,require:true,default:0},
    dop: {type:String,require:true},
    amount: {type:Number,require:true},
});


var payment = mongoose.model("payment",PaymentModel)


module.exports  = payment;