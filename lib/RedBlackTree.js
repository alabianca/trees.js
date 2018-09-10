class RBNode {
    constructor(value, parent) {
        this._isBlack = parent ? false : true; //only color it black if it is the true root node
        this.value = value;
        this.left = null;
        this.right = null;
        this._parent = parent ? parent : null;
    }

    _isRoot() {
        const res = this._parent ? false : true;
        return res;
    }

    _isLeftChild() {
        if(this._isRoot()) {
            return false;
        }

        if(this === this._parent.left) {
            return true;
        }
        console.log('bottom return of left')
        return false;
    }

    _isRightChild() {
        if(this._isRoot()) {
            return false;
        }

        if(this === this._parent.right) {
            return true;
        }
        console.log('Bottom return of right')
        return false;
    }

    /**
     * @returns {RBNode}
     */
    _grandParent() {
        if(this._isRoot() || this._parent._isRoot()) {
            return null;
        }

        return this._parent._parent;
    }

    /**
     * @returns {RBNode}
     */
    _uncle() {
        if(this._isRoot() || this._parent._isRoot()) {
            return null;
        }

        if(this._parent._isRightChild()) {
            return this._grandParent().left;
        }
        
        return this._grandParent().right;

    }

    _rotate(dir) {
        switch(dir) {
            case "left": this._rotateLeft();
                break;
            case "right": this._rotateRight();
        }
    }

    _rotateLeft() {

    }

    _toggle() {
        this._isBlack = this._isBlack ? false : true;
        //ensure that the root node is always black;
        if(this._isRoot() && !this._isBlack) {
            this._toggle();
        }
    }


    _insert(value) {
        if(value <= this.value && !this.left) {
            const node = new RBNode(value, this);
            this.left = node;
            return node;
        } else if(value >= this.value && !this.right) {
            const node = new RBNode(value,this);
            this.right = node;
            return node;
        } else if(value <= this.value) {
            return this.left._insert(value);
        } else {
            return this.right._insert(value);
        }
    }

    //public
    // Insert Strategy: 
    //      1. Insert node and color it red (done via RBNode constructor)
    //      2. Recolor and rotate nodes to fix violations
    //
    // 4 cases:
    //      0. node = root                       --> solution: color node black (is taken care of in constructor)
    //      1. node._uncle() === red             --> solution: recolor node.parent, node.grandParent, node.uncle
    //      2. node._uncle() === black (triangle)--> solution: rotate z.parent opposite of node
    //      3. node._uncle() === black (line)    --> solution: rotate z.grandParent opposite of node. recolor original parent and grandParent
    insert(value) {
        const node = this._insert(value);
        console.log('Added Node: ' + value + ' color: ' + node._isBlack);
        
        //node's parent is black. Best case scenario. just return
        if(node._parent && node._parent._isBlack) {
            return;
        }
        //1.
        if(node._uncle() && !node._uncle()._isBlack) {
            console.log('Red Uncle: ', value)
            node._parent._toggle();
            node._grandParent()._toggle();
            node._uncle()._toggle();
            return;
        }

        //2. & 3.
        if(node._uncle() && node._uncle()._isBlack) {
            //2. (Triangle arrangement)
            if((node._isLeftChild() && node._parent._isRightChild()) || (node._isRightChild() && node._isLeftChild())) {
                console.log('Triangle: ', value)
            }
            //3. (must be line arrangement)
            else {
                console.log("line: ", value);
            }
        } else {
            console.log('Normal Insert: ', value);
        }
    }
}


const redBlackTree = new RBNode(10);
redBlackTree.insert(5);
redBlackTree.insert(12);
redBlackTree.insert(7);