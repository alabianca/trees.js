
class BNode {
    constructor(value, parent) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.parent = parent ? parent : null;
    }

    //insert(value) {
        // if(value <= this.value && !this.left) {
        //     this.left = new BNode(value);
        // } else if(value >= this.value && !this.right) {
        //     this.right = new BNode(value);
        // } else if(value <= this.value) {
        //     this.left.insert(value);
        // } else {
        //     this.right.insert(value);
        // }
    //}

    // remove(value) {
        
    // }
}






const tree = new BNode(10);
tree.insert(11);
tree.insert(8);
tree.insert(4);
tree.insert(7);
tree.insert(20);
tree.insert(18);

console.log(tree);