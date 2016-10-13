'use strict';

module.exports = {
    setStatus: function(code, res){
        switch(code){
            case "NOT_FOUND":
                res.status(404);
                break;
            case "ER_DUP_ENTRY":
                res.status(409);
                break;
            default:
                res.status(400);
        }
        return;
    }
};