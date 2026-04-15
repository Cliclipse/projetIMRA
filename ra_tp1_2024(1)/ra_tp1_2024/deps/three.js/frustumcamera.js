import * as THREE from './index.js';


class FrustumCamera extends THREE.Camera {

    constructor  (  left, right, bottom, top, near, far ) {
        super();

        this.type = 'FrustumCamera';
        this.left = left !== undefined ? left : -1;
        this.right = right !== undefined ? right : 1;
        this.bottom = bottom !== undefined ? bottom : -1;
        this.top = top !== undefined ? top : 1;
        this.near = near !== undefined ? near : 0.1;
        this.far = far !== undefined ? far : 2000;

        this.updateProjectionMatrix();

    };


    updateProjectionMatrix () {

        this.projectionMatrix.makePerspective(
            this.left, this.right, this.top, this.bottom, this.near, this.far
        );
    };


    copy(source, recursive) {
        super.copy(source, recursive);

        this.left = source.left;
        this.right = source.right;
        this.top = source.top;
        this.bottom = source.bottom;
    
        this.near = source.near;
        this.far = source.far;

        this.projectionMatrix.copy( source.projectionMatrix );

        return this;

    };

}

export default FrustumCamera;
