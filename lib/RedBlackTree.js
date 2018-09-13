

class RedBlackTree {
    constructor() {
        this.root = null;
    }

    /**
     * 
     * @param {RBNode} node 
     */
    _updateRoot(node) {
        this.root = node;
    }

    insert(key,value) {
        if(!this.root) {
            this.root = new RBNode(key,value,null,this);
        } else {
            this.root.insert(key,value,this);
        }
    }
    
    traverseBF(projection) {
        if(!this.root) {
            return;
        }
        const nodes = [];
        nodes.push(this.root);

        while(nodes.length > 0) {
            const node = nodes.shift();

            projection(node);

            if(node.left) {
                nodes.push(node.left)
            }

            if(node.right) {
                nodes.push(node.right);
            }
        }
    }

    toString() {
        let tree = "";
        if(!this.root) {
            return tree;
        }

        this.traverseBF((node)=>{
            const parentKey = node._parent ? node._parent.key : "ROOT";
            const color = node._isBlack ? "Black" : "Red";
            tree +=  `[${parentKey}]:` + node.key  + `:${color} `;
        })

        return tree;
        
    }

    *[Symbol.iterator]() {
        if(!this.root) {
            return;
        }
        let nodes = [];
        nodes.push({node:this.root, processed:false});

        while(nodes.length > 0) {
            const node = nodes[0];

            if((node.node.left || node.node.right) && !node.processed) {
                if(node.node.right) {
                    nodes = [node,{node:node.node.right,processed:false}, ...nodes.slice(1)];
                }
                if(node.node.left) {
                    nodes.unshift({node:node.node.left, processed:false});
                }
                node.processed = true;
            } else {
                yield nodes.shift().node.key;
            }
        }
    }


}









class RBNode {
    constructor(key,value, parent, tree) {
        this._tree = tree;
        this._isBlack = parent ? false : true; //only color it black if it is the true root node
        this.key = key;
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
        if(this.key > rightNode.key) {
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
        if(this.key > leftNode.key) {
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


    _insert(key,value,tree) {
        if(key === this.key) {
            this.value = value;

        } else if(key < this.key && !this.left) {
            const node = new RBNode(key,value,this, tree);
            this.left = node;
            return node;

        } else if(key > this.key && !this.right) {
            const node = new RBNode(key,value,this,tree);
            this.right = node;
            return node;

        } else if(key <= this.key) {
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

                const direction = node._isLeftChild() ? "right" : "left";
                node._parent._rotate(direction);

                return this._insertFixup(node);
            }
            //3. (must be line arrangement)
            else {

                const direction = node._isLeftChild() ? "right" : "left";
                const originalGParent = node._grandParent();
                const originalParent  = node._parent;
                node._grandParent()._rotate(direction);
                
                //recolor original grandParent and parent
                originalGParent._toggle();
                originalParent._toggle();

                return this._insertFixup(node);
            }
        }
    }

    //public
    // Insert Strategy: 
    //      1. Insert node and color it red (done via RBNode constructor)
    //      2. Recolor and rotate nodes to fix violations (_insertFixup)
    //
    insert(key,value,tree) {
        const node = this._insert(key,value,tree);
        this._insertFixup(node);
        return node;
    }
}


//const redBlackTree = new RBNode(15);
//redBlackTree.insert(5);
//redBlackTree.insert(1);
//redBlackTree.insert(12);
//redBlackTree.insert(7);
//redBlackTree.insert(6);

const rbTree = new RedBlackTree();
rbTree.insert(10, 'hi');
rbTree.insert(5, 'hello');
rbTree.insert(12, 'bonjour');
rbTree.insert(7, 'bonjour');
rbTree.insert(6, 'bonjour');
rbTree.insert(13, 'gotcha');
rbTree.insert(8, 'cheers');
rbTree.insert(1, "wowza");
rbTree.insert(9, "zing");
rbTree.insert(11, "boom");
rbTree.insert(25, "ksa")
console.log(rbTree.toString());

for(let key of rbTree) {
    console.log(key);
}