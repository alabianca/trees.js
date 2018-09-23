

class $Node {
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * @param {*} parent 
     * @param {*} tree 
     * @param {Function} comparator 
     */
    constructor(key,value, parent, tree, comparator) {
        this._tree = tree;
        this._isBlack = parent ? false : true; //only color it black if it is the true root node
        this._parent = parent ? parent : null;
        this._comparator = comparator;
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }

    /**
     * @returns {boolean}
     */
    _isRoot() {
        const res = this._parent ? false : true;
        return res;
    }

    /**
     * @returns {boolean}
     */
    _isLeftChild() {
        if(this._isRoot()) {
            return false;
        }

        if(this === this._parent.left) {
            return true;
        }
        return false;
    }

    /**
     * @returns {boolean}
     */
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
     * @returns {$Node}
     */
    _grandParent() {
        if(this._isRoot() || this._parent._isRoot()) {
            return null;
        }

        return this._parent._parent;
    }

    /**
     * @returns {$Node}
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
        const rightNode = this.right; //node.right
        const rightLeftNode = this.right.left; //node.right.left
        const parent = this._parent;
        //reassign rightNode parent if node is root
        if(this._isRoot()) {
            rightNode._parent = null; //careful
            this._tree._updateRoot(rightNode);
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
        if(this._comparator(this.key,rightNode.key) > 0) {
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
        const leftNode = this.left; //node.left
        const leftRightNode = this.left.right //node.left.right
        const parent = this._parent;
         //reassign leftNode parent if node is root
         if(this._isRoot()) { 
            leftNode._parent = null; //careful
            this._tree._updateRoot(leftNode);
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
        if(this._comparator(this.key, leftNode.key) > 0) {
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


    //todo: use comparator function here for comparisons
    _insert(key,value,tree) {
        const compRes = this._comparator(this.key,key);
        if(compRes === 0) {
            return this;

        } else if(!this.left && compRes > 0) {
            const node = new $Node(key,value,this, tree, this._comparator);
            this.left = node;
            return node;

        } else if(!this.right && compRes < 0) {
            const node = new $Node(key,value,this,tree, this._comparator);
            this.right = node;
            return node;

        } else if(compRes > 0) {
            return this.left._insert(key,value,tree);

        } else {
            return this.right._insert(key,value,tree);
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
     * @param {$Node} node 
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

                const direction = node._isLeftChild() ? "right" : "left";
                node._parent._rotate(direction);

                return this._insertFixup(node);
            }
            //3. (must be line arrangement)
            else {

                const direction = node._isLeftChild() ? "right" : "left";
                const originalGParent = node._grandParent();
                const originalParent  = node._parent;

                if(originalGParent) {
                    node._grandParent()._rotate(direction);
                
                    //recolor original grandParent and parent
                    originalGParent._toggle();
                    originalParent._toggle();
                }

                

                return this._insertFixup(node);
            }
        }
    }

    //public
    // Insert Strategy: 
    //      1. Insert node and color it red (done via $Node constructor)
    //      2. Recolor and rotate nodes to fix violations (_insertFixup)
    //
    insert(key,value,tree) {
        const node = this._insert(key,value,tree);
        this._insertFixup(node);
        return node;
    }

    /**
     * 
     * @param {*} key
     * @returns {any} value stored at key
     */
    get(key) {
        const compRes = this._comparator(this.key,key);
        if(compRes === 0) {
            return this.value;
        }
        if(this.left && compRes > 0) {
            return this.left.get(key);

        } else if(this.right && compRes < 0) {
            return this.right.get(key);

        } else {
            return null;
            
        }
    }
}



module.exports = $Node;