'use strict';

class listNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.previous = null;
    }
}

class LinkedList {
    constructor() {
        this._length = 0;
        this._head = null;
        this._tail = this._head;
    }

    get length() {
        return this._length;
    }
    get first() {
        return this._head.value;
    }
    get last() {
        return this._tail.value;
    }

    at(index, newValue) {
        const node = this.findNodeAt(index);

        if (newValue !== undefined) {
            node.value = newValue;
        }

        return node.value;
    }

    removeAt(index) {
        const removedNode = this.findNodeAt(index);

        if (removedNode.previous !== null) {
            removedNode.previous.next = removedNode.next;
        } else {
            removedNode.next.previous = null;
            this._head = removedNode.next;
        }
        if (removedNode.next !== null) {
            removedNode.next.previous = removedNode.previous;
        } else {
            removedNode.previous.next = null;
            this._tail = removedNode.previous;
        }
        this._length -= 1;

        return removedNode.value;
    }

    findNodeAt(index) {
        let elemCount = 0,
            node = this._head;

        while (elemCount !== index) {
            elemCount += 1;
            node = node.next;
        }
        return node;
    }

    insert(index, ...values) {
        if (index === 0) {
            let list = this.prepend(...values);
            return list;
        }
        if (index === this._length) {
            let list = this.append(...values);
            return list;
        }

        const node = this.findNodeAt(index);
        let nodeToAddTo = node.previous;
        let newNode;

        for (let value of values) {
            newNode = new listNode(value);
            newNode.previous = nodeToAddTo;
            nodeToAddTo.next = newNode;
            newNode.next = node;
            node.previous = newNode;
            nodeToAddTo = newNode;
            this._length += 1;
        }

        return this;
    }

    prepend(value) {
        function prependValue(value) {
            const node = new listNode(value);
            this._head.previous = node;
            node.next = this._head;
            this._head = node;
            this._length += 1;
        }

        const len = arguments.length;

        if (len === 1 && this._head !== null) {
            prependValue.call(this, value);
        } else {
            for (let i = len - 1; i >= 0; i -= 1) {
                if (this._head === null) {
                    const node = new listNode(arguments[i]);

                    this._head = node;
                    this._tail = node;
                    this._length += 1;

                    continue;
                }
                prependValue.call(this, arguments[i]);
            }
        }

        return this;
    }

    append(value) {
        function appendValue(value) {
            const node = new listNode(value);
            node.previous = this._tail;
            this._tail.next = node;
            this._tail = this._tail.next;
            this._length += 1;
        }
        const len = arguments.length;

        if (len === 1 && this._head !== null) {
            appendValue.call(this, value);
        } else {
            for (let i = 0; i < len; i += 1) {
                if (this._head === null) {
                    const node = new listNode(arguments[i]);

                    this._head = node;
                    this._tail = node;
                    this._length += 1;

                    continue;
                }
                appendValue.call(this, arguments[i]);
            }
        }

        return this;
    }

    toArray() {
        let values = [];

        for (let value of this) {
            values.push(value);
        }

        return values;
    }

    toString() {
        return this.toArray().join(' -> ');
    }

    *[Symbol.iterator]() {
        let node = this._head;

        yield node.value;

        while (!!node.next) {
            node = node.next;
            yield node.value;
        }
    }
}

module.exports = LinkedList;