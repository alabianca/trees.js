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
        return false;
    }

    _isRightChild() {
        if(this._isRoot()) {
            return false;
        }

        if(this === this._parent.right) {
            return true;
        }
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

    // this.right becomes this._parent
    // this.right.left becomes this.right
    _rotateLeft() {
        console.log("Rotating Left ...");
        const rightNode = this.right; //node.right
        const rightLeftNode = this.right.left; //node.right.left
        const parent = this._parent;
        //reassign rightNode parent if node is root
        if(this._isRoot()) {
            rightNode._parent = null; //careful
        } else {
            rightNode._parent = parent;

            if(this._isRightChild()) {
                parent.right = rightNode;
            } else {
                parent.left = rightNode;
            }
        }

        this._parent = rightNode;

        //attach node on correct side of rightNode
        if(this.value > rightNode.value) {
            rightNode.right = this;
        } else {
            rightNode.left = this;
        }

        this.right = rightLeftNode; //node.right.left -> node.right

        if(rightLeftNode) {
            rightLeftNode._parent = this;
        }
    }

    // this.left becomes this._parent
    // this.left.right becomes this.left
    _rotateRight() {
        console.log("Rotating Right ...");
        const leftNode = this.left; //node.left
        const leftRightNode = this.left.right //node.left.right
        const parent = this._parent;
         //reassign leftNode parent if node is root
         if(this._isRoot()) { 
            leftNode._parent = null; //careful
        } else {
            leftNode._parent = parent;

            if(this._isRightChild()) {
                parent.right = leftNode;
            } else {
                parent.left = leftNode;
            }
        }

        this._parent = leftNode // node.left -> node.parent

        //attach node on correct side of leftNode
        if(this.value > leftNode.value) {
            leftNode.right = this;
        } else {
            leftNode.left = this;
        }

        this.left = leftRightNode; // node.left.right -> node.left
        
        if(leftRightNode) {
            leftRightNode._parent = this;
        }

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
            console.log('Inserting Left at: ', this.value);
            const node = new RBNode(value, this);
            this.left = node;
            return node;
        } else if(value >= this.value && !this.right) {
            console.log('Inserting Right at: ', this.value)
            const node = new RBNode(value,this);
            this.right = node;
            return node;
        } else if(value <= this.value) {
            return this.left._insert(value);
        } else {
            return this.right._insert(value);
        }
    }

    // Fix any violations
    // 4 cases:
    //      0. node = root                       --> solution: color node black (is taken care of in constructor)
    //      1. node._uncle() === red             --> solution: recolor node.parent, node.grandParent, node.uncle
    //      2. node._uncle() === black (triangle)--> solution: rotate z.parent opposite of node
    //      3. node._uncle() === black (line)    --> solution: rotate z.grandParent opposite of node. recolor original parent and grandParent
    /**
     * 
     * @param {RBNode} node 
     */
    _insertFixup(node) {
        //recursion check. node's parent,left child and right child are black. no violation
        if((!node._parent || node._parent._isBlack) && (!node.left || node.left._isBlack) && (!node.right || node.right._isBlack)) {
            return;
        }

        //find the violating node
        if(node.left && !node.left._isBlack) {
            node = node.left;
        }

        if(node.right && !node.right._isBlack) {
            node = node.right;
        }

        //1.
        if(node._uncle() && !node._uncle()._isBlack) {
            node._parent._toggle();
            node._grandParent()._toggle();
            node._uncle()._toggle();
            return this._insertFixup(node);
        }

        //2. & 3. (uncle must be black. null is also considered black therefore !node._uncle())
        if((node._uncle() && node._uncle()._isBlack) || !node._uncle()) {
            //2. (Triangle arrangement)
            if((node._isLeftChild() && node._parent._isRightChild()) || (node._isRightChild() && node._parent._isLeftChild())) {
                console.log('Triangle: ', node.value);
                const direction = node._isLeftChild() ? "right" : "left";
                node._parent._rotate(direction);
            }
            //3. (must be line arrangement)
            else {
                console.log("line: ", node.value);
                const direction = node._isLeftChild() ? "right" : "left";
                node._grandParent()._rotate(direction);
            }
        }
    }

    //public
    // Insert Strategy: 
    //      1. Insert node and color it red (done via RBNode constructor)
    //      2. Recolor and rotate nodes to fix violations
    //
    insert(value) {
        const node = this._insert(value);
        this._insertFixup(node);
    }
}


const redBlackTree = new RBNode(15);
redBlackTree.insert(5);
//redBlackTree.insert(1);
redBlackTree.insert(12);
//redBlackTree.insert(7);
//redBlackTree.insert(6);
console.log(redBlackTree)