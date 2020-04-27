class Lambda {
    constructor(model, node) {
        this.model = model;
        this.node = node;
        this.events = [];
        window.document.querySelectorAll("[data-lambda]").forEach((n) => {
            const expr = n.dataset.lambda;
            let t = eval(`this.${expr}`);
            const f = t(n);
            if (f) {
                this.events.push(f);
                f();
            }
        });
    }

    update() {
        this.events.forEach((e) => e());
    }

    click(func) {
        const self = this;
        return function (el) {
            el.onclick = (e) => {
                func.call(self, self.model, e);
                self.update();
            };
        };
    }

    value(func) {
        const self = this;
        return function (el) {
            el.oninput = (e) => {
                func.call(self, self.model, e.target.value);
                self.update();
            };
        };
    }

    text(func) {
        const self = this;
        return function (el) {
            let textNode = getTextNode(el);
            return function () {
                textNode &&
                    (textNode.textContent = func.call(self, self.model));
            };
        };
    }
}

const getTextNode = (el) => {
    let node = el.firstChild;
    while (node && node.nodeType != 3) {
        node = node.nextSibling;
    }
    if (!node) {
        node = window.document.createTextNode("");
        el.appendChild(node);
    }
    return node;
};
