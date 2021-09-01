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
