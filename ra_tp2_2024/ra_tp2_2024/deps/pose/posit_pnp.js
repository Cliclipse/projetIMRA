
import cv from '../opencv/opencv_js.js';


var POS = POS || {};



POS.PnPSolver = function(){
    this.cameraMatrix = {};
    
    
};

POS.PnPSolver.prototype.setIntrinsics = function( params ) {
    this.cameraMatrix = cv.matFromArray(3,3,cv.CV_64FC1, params);
};


POS.PnPSolver.prototype.pose = function(imagePoints, modelPoints) {
    let distCoeffs = cv.Mat.zeros(4,1,cv.CV_64FC1);
    let rVec = cv.Mat.zeros(3,1,cv.CV_64FC1);
    let tVec = cv.Mat.zeros(3,1,cv.CV_64FC1);
    
    let rMat = cv.Mat.eye(3,3,cv.CV_64FC1);

    let objectPts = cv.matFromArray(modelPoints.length, 3, cv.CV_64FC1, modelPoints.flat());
    let imagePts = cv.matFromArray(imagePoints.length, 2, cv.CV_64FC1, imagePoints.flatMap(
        function(item) { return [item.x, item.y]; }
    ));
    
    cv.solvePnP(objectPts, imagePts, this.cameraMatrix, distCoeffs, rVec, tVec);
    cv.Rodrigues(rVec,rMat);
    
    let pose =  { 
            rotation: [
                [ rMat.data64F[0], -rMat.data64F[1], -rMat.data64F[2] ],
                [ -rMat.data64F[3], rMat.data64F[4], rMat.data64F[5] ],
                [ -rMat.data64F[6], rMat.data64F[7], rMat.data64F[8] ]
            ], 
            translation: [ tVec.data64F[0], -tVec.data64F[1], -tVec.data64F[2]]            
        };
        
     return pose;
};



export default POS;