
customElements.define('float-div',
    class extends HTMLElement {
        constructor() {
            super();
            this._isTransitionActive = false;
        }

        connectedCallback() {
            this.exec();
            setInterval(() => { this.exec(); }, 100);
            //window.addEventListener('resize', () => { this.exec.call(this) });
        }

        get isTransitionActive() {
            return this._isTransitionActive;
        }

        set isTransitionActive(val) {
            this._isTransitionActive = val;
        }

        exec() {
            var ele = document.getElementById(this._targetEleId);
            if (ele) {
                var compStyles = window.getComputedStyle(ele);
                var rect = ele.getBoundingClientRect();
                this.style.position = "absolute";
                this.style.left = rect.left + 'px';
                this.style.top = ele.offsetTop + 'px';
                this.style.width = rect.width + 'px';
                this.style.height = rect.height + 'px';
                this.style.fontSize = compStyles.getPropertyValue("font-size");
                this.style.borderRadius = compStyles.getPropertyValue("border-radius");
                if (this._isTransitionActive) {
                    this.style.transition = "left 300ms ease 0s, top 300ms ease 0s, width 300ms ease 0s, height 300ms ease 0s, border-radius 300ms ease 0s, font-size 300ms ease 0s, background-color 300ms ease 0s, opacity 300ms ease 0s";
                } else {
                    this.style.transition = "";
                }
            }
        }


        get targetEleId() {
            return this._targetEleId;
        }

        set targetEleId(val) {
            this._targetEleId = val;

            if (this.isConnected) {
                this.style.transition = "";
                this.exec();

                this.style.zIndex = 101;
                if (this.zIndexIntervalId) {
                    clearInterval(this.zIndexIntervalId);
                }
                this.zIndexIntervalId = setInterval(() => { this.style.zIndex = 100; }, 500);
            }
        }

    }
);


customElements.define('drag-div',
    class extends HTMLElement {
        constructor() {
            super();
        }

        get isRenderReady() {
            return this._isRenderReady;
        }

        set isRenderReady(val) {
            this._isRenderReady = val;
            if (this._isRenderReady) {
                this.renderReady();
            }
        }

        get initTargetId() {
            return this._initTargetId;
        }

        set initTargetId(val) {
            this._initTargetId = val;
        }

        get boxId() {
            return this._boxId;
        }

        set boxId(val) {
            this._boxId = val;
        }

        connectedCallback() {
            this.style.transition = "transform 300ms";
            this.style.visibility = "hidden";
        }

        renderReady() {
            var ele = document.getElementById(this._initTargetId);
            this.style.visibility = "visible";
            this.style.top = ele.offsetTop + 'px';
            this.style.left = ele.offsetLeft + 'px';

            this.addEventListener('pointerdown', (event) => {
                this.isStarted = true;
                this.startX = event.offsetX;
                this.startY = event.offsetY;
                this.style.transform = "scale(1.2)";
            });

            window.addEventListener('pointerup', (event) => {
                if (this.isStarted) {
                    this.isStarted = false;
                    this.style.transform = "scale(1)";

                    var rect = this.getBoundingClientRect();

                    var top = rect.top + scrollY;
                    var bottom = rect.bottom + scrollY;
                    var left = rect.left + scrollX;
                    var right = rect.right + scrollX;

                    var box = document.getElementById(this._boxId);
                    var boxRect = box.getBoundingClientRect();

                    var boxTop = boxRect.top + scrollY;
                    var boxBottom = boxRect.bottom + scrollY;
                    var boxLeft = boxRect.left + scrollX;
                    var boxRight = boxRect.right + scrollX;

                    var isXIn = boxLeft < left && right < boxRight;
                    var isYIn = boxTop < top && bottom < boxBottom;
                    this.isBoxIn = isXIn && isYIn;

                    if (this.isBoxIn) {
                        this.boxOffsetX = left - boxLeft;
                        this.boxOffsetY = top - boxTop;
                    } else {
                        var ele = document.getElementById(this._initTargetId);
                        this.style.top = ele.offsetTop + 'px';
                        this.style.left = ele.offsetLeft + 'px';
                    }
                }
            });

            window.addEventListener('pointermove', (event) => {
                this.pointerX = event.x + scrollX;
                this.pointerY = event.y + scrollY;

                if (this.isStarted && event.pressure > 0) {
                    this.style.left = this.pointerX - this.startX + 'px';
                    this.style.top = this.pointerY - this.startY + 'px';
                }
            });

            window.addEventListener('resize', (event) => {
                if (this.isBoxIn) {
                    console.log(this.isBoxIn);
                    var box = document.getElementById(this._boxId);
                    var boxRect = box.getBoundingClientRect();

                    var boxTop = boxRect.top + scrollY;
                    var boxLeft = boxRect.left + scrollX;
                    this.style.top = boxTop + this.boxOffsetY + 'px';
                    this.style.left = boxLeft + this.boxOffsetX + 'px';
                } else {
                    this.style.top = ele.offsetTop + 'px';
                    this.style.left = ele.offsetLeft + 'px';
                }
            });
        }
    }
);
