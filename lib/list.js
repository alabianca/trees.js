class List {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    append(value) {
        let node = this.head;

        if(!node) {
            this.head = new ListNode(value);
            this.size++;
            return this.head;
        }

        while(node.next) {
            node = node.next;
        }

        const newNode = new ListNode(value);
        node.next = newNode;
        
        this.size++;
        return newNode.value;
    }

    insertAt(value, index) {
        let i = 0;
        let node = this.head;

        if(!node) {
            return this.apppend(value);
        }

        if(index == 0) {
            return this.unshift(value);
        }

        while(node.next && i < index-1) {
            node = node.next;
            i++;
        }

        if(!node.next) { //we reached the end of the list (index was larger than list)
            return this.append(value);
        }

        const newNode = new ListNode(value);
        const nextNode = node.next;
        node.next = newNode;
        newNode.next = nextNode;
        this.size++;
        return newNode.value;

    }

    getHead() {
        return this.head.value;
    }

    shift() {
        const node = this.head;
        this.head = node.next;
        this.size--;
        return node.value;
    }

    unshift(value) {
        const newNode = new ListNode(value);
        const nextNode = this.head;
        this.head = newNode;
        this.head.next = nextNode;
        this.size++;
        return this.head.value;
    }

    forEach(fn) {
        let node = this.head;
        fn(node);
        while(node.next) {
            fn(node.next);
            node = node.next;
        }
    }
}




class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }

    

    
}




module.exports = List;