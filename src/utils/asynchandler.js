
const asynchandler=(requesthandler)=>(req,res,next)=>{
     Promise.resolve(requesthandler(req,res,next))
     .catch((err)=>next(err));
}
export {asynchandler}




// const asynchandler=(requesthandler)=>async (req,res,next)=>{
//     try {
//         await requesthandler(req,res,next);
//     } catch (error) {
//        res.status(err.code || 500).json({
//          success: false,
//          message:err.message
//        })
//     }
//  }