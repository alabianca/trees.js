
const $Node = require('./TreemapNode');
const List  = require('./list');

class Treemap {
    /**
     * 
     * @param {Function} comparator
     */
    constructor(comparator) {
        this.comparator = comparator;
        this.root = null;
    }

    /**
     * 
     * @param {*} key 
     * @param {*} value 
     */
    put(key,value) {
        if(!this.root) {
            this.root = new $Node(key,value,null,this,this.comparator);
        } else {
            this.root.insert(key,value,this);
        }
    }

    /**
     * 
     * @param {*} key 
     * @returns {*} value of the node stored at key
     */
    get(key) {
        return this.root.get(key);
    }

    /**
     * 
     * @param {*} key Deletes the node at key
     */
    delete(key) {

    }

    /**
     * 
     * @param {*} key 
     * @returns {boolean} returns true if the key is in the tree. False otherwise
     */
    contains(key) {

    }

    /**
     * 
     * @param {Function} projection 
     */
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

    _updateRoot(node) {
        this.root = node;
    }

     /**
     * @toto improve efficiency on line 81
     */
    *[Symbol.iterator]() {
        if(!this.root) {
            return;
        }

        const nodes = new List();
        nodes.append({node:this.root, processed:false});

        while(nodes.size > 0) {
            const node = nodes.getHead();

            if((node.node.left || node.node.right) && !node.processed) {
                if(node.node.right) {
                    const insertNode = node.node.right;
                    nodes.insertAt({node:insertNode, processed:false},1);
                }
                if(node.node.left) {
                    const insertNode = node.node.left;
                    nodes.unshift({node:insertNode,processed:false});
                }
                node.processed = true;
            } else {
                yield nodes.shift().node.key;
            }
        }
    }
}

module.exports = Treemap;


//Tests
const tm = new Treemap((a,b)=>{
    return a - b;
});