import ARCS from '../build/arcs.js';
import * as THREE from '../deps/three.js/index.js';

var ObjectTransform ;

/** 
    * @class ObjectTransform
    * @classdesc Apply transformations to objects
    */
ObjectTransform = ARCS.Component.create(
    function() {
        var objRoot;
        var refMat;
        var id = -1;

        /**
            * Sets the object of interest on which we would like to apply transforms.
            * @param obj {object} a Three.js Object3D
            * @function ObjectTransform#setObject
            */
        this.setObject = function (obj) {
            objRoot = new THREE.Object3D();
            obj.parent.add(objRoot);
            obj.parent.remove(obj);
            objRoot.add(obj);
            
            var box = new THREE.Box3;
            box.setFromObject(obj);
            let s = new THREE.Vector3();
            box.getSize(s);
            var scale = MAX3(s.x, s.y, s.z);
            //console.log(scale);
            obj.add(new THREE.AxesHelper(scale / 2));
        };
        
        var MAX3 = function (a,b,c) {
            if ( a >= b ) {
                    if ( a >= c) {
                        return a;
                    } else {
                        return c;
                    }
            } else {
                    if (b >= c) {
                        return b;
                    } else {
                        return c;
                    }
            }
        };

        
        
        // right now, we make something compatible with aruco markers
        // it may evolve in the future
        
        /**
            * Takes an array of markers and then applies transformations 
            * to the referenced object.
            * @function ObjectTransform#setTransform
            * @param arr {Marker[]} an array of detected markers.
            */                
        this.setTransform = function ( arr ) {
            if (objRoot === undefined) { return ; }
            var i ;
            for ( i = 0; i < arr.length; i++) {
                if ( arr[i].id === id ) {
                    let R = arr[i].pose.rotation;
                    let t = arr[i].pose.position;
                    let mat = new THREE.Matrix4();
                    mat.set( 
                        R[0][0], R[0][1], R[0][2], t[0],
                        R[1][0], R[1][1], R[1][2], t[1],
                        R[2][0], R[2][1], R[2][2], t[2],
                        0, 0, 0, 1
                    );
                    
                    //console.log("R", R);
                    objRoot.position.x = t[0];
                    objRoot.position.y = t[1];
                    objRoot.position.z = t[2];
                    //console.log( objRoot);
                    
                    objRoot.setRotationFromMatrix(mat);                

                    
                    /*    let R = arr[i].pose.rotation;
                        let t = arr[i].pose.position;
                        let mat = new THREE.Matrix4();
                        mat.set( 
                            R[0][0], R[0][1], R[0][2], t[0],
                            R[1][0], R[1][1], R[1][2], t[1],
                            R[2][0], R[2][1], R[2][2], t[2],
                            0, 0, 0, 1
                        );
                        let inverse = new THREE.Matrix4();
                        inverse.getInverse(mat);
                        
                        objRoot.position.x = inverse.elements[12];
                        objRoot.position.y = inverse.elements[13];
                        objRoot.position.z = inverse.elements[14];
                        objRoot.setRotationFromMatrix(inverse);
                        console.log(objRoot.position);*/
                    
                }
            }
        };
        
        this.setId = function (i) {
            id = i;
        };
    },
    ['setObject', 'setTransform', 'setId'],
    []
);

export default { ObjectTransform : ObjectTransform };
