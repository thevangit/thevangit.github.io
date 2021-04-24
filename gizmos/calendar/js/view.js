function Rim(canvas, items, outerRadius, innerRadius) {
    this.rimItemsList = [];
    this.loacteHelperArr = [];  // 定位辅助数组
    this.canvas = canvas;
    this.canvasContext = canvas.getContext('2d');
    this.items = items;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.initCenterRadian = Math.PI * 3 / 2;
    this.itemRadian = Math.PI * 2 / items;
    this.value = 12;
    this.selectedValue = 12;

    this.init = () => {
        this.createLocateHelper(this.initCenterRadian);
        this.initCanvas();
        // this.test();
        this.createFrame(this.value);
        this.initRimItems();
        this.registerEvent();
        return this;
    };

    // view module

    this.initCanvas = () => {
        this.canvasContext.translate(this.outerRadius, this.outerRadius);
        this.canvasContext.strokeStyle = '#ccc';
        this.canvasContext.fillStyle = 'rgba(0,0,0,.2)';
        this.canvasContext.font = '100px 蔚然雅黑';
        this.canvasContext.textAlign = 'center';
        this.canvasContext.textBaseline = 'top';
        this.canvasContext.save();
    }

    this.test = () => {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(-this.outerRadius, 0);
        this.canvasContext.lineTo(this.outerRadius, 0);
        this.canvasContext.moveTo(0, -this.outerRadius);
        this.canvasContext.lineTo(0, this.outerRadius);
        this.canvasContext.stroke();
    }

    this.createFrame = (slectedValue = 0) => {
        for (let i = 0, step = this.itemRadian; i < this.items; i++, step += this.itemRadian) {
            this.canvasContext.rotate(step);
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(this.loacteHelperArr[0], this.loacteHelperArr[1]);
            this.canvasContext.arc(0, 0, this.innerRadius, this.loacteHelperArr[2], this.loacteHelperArr[3]);
            this.canvasContext.lineTo(this.loacteHelperArr[4], this.loacteHelperArr[5]);
            this.canvasContext.arc(0, 0, this.outerRadius, this.loacteHelperArr[3], this.loacteHelperArr[2], true);
            this.canvasContext.closePath();
            this.canvasContext.stroke();
            if (i == slectedValue) {
                this.canvasContext.fillText(i + 1, 0, -this.outerRadius + 32);
                this.canvasContext.fill();
            }
            this.canvasContext.restore();
            this.canvasContext.save();
        }
    };

    this.clearFrame = () => {
        this.canvasContext.clearRect(-this.outerRadius, -this.outerRadius, 2 * this.outerRadius, 2 * this.outerRadius);
    };

    this.createLocateHelper = (centerRadian) => {
        // 起始点 x0 y0 坐标
        this.loacteHelperArr.push(Math.cos(centerRadian - this.itemRadian / 2) * this.innerRadius);
        this.loacteHelperArr.push(Math.sin(centerRadian - this.itemRadian / 2) * this.innerRadius);

        // 圆弧起始和结束弧度
        this.loacteHelperArr.push(centerRadian - this.itemRadian / 2);
        this.loacteHelperArr.push(centerRadian + this.itemRadian / 2);

        // 过度点 x1 y1 坐标
        this.loacteHelperArr.push(Math.cos(centerRadian + this.itemRadian / 2) * this.outerRadius);
        this.loacteHelperArr.push(Math.sin(centerRadian + this.itemRadian / 2) * this.outerRadius);
    };

    // event module

    this.initRimItems = () => {
        for (let i = 0; i < this.items; i++) {
            this.rimItemsList.push(new RimItem(i, this.items, this.outerRadius, this.innerRadius));
        }
    };

    this.registerEvent = (callback) => {
        this.canvas.onmousemove = (e) => {
            this.rimItemsList.forEach(item => {
                if (item.isOn(e.offsetX, e.offsetY)) {
                    item.update((value) => {
                        if (item.isChange) {
                            this.clearFrame();
                            this.createFrame(value);
                            this.selectedValue = value;
                            item.isChange = false;
                            callback(value);
                        };
                    });
                }
            });
        };
    }
}

function RimItem(number, items, outerRadius, innerRadius) {
    this.number = number;
    this.items = items;
    this.outterRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.radian = Math.PI * 2 / items;
    this.centerRadian = number * (Math.PI * 2 / items);
    this.ischange = true;     // 记录事件触发前 rimItem 的触发状态
    this.isSelect = false;
    this.center = outerRadius;
    this.value = (number + (this.items / 4 - 1)) % this.items;

    this.isOn = (offsetX, offsetY) => {
        if (Math.abs(this.centerRadian - this.getRadian(offsetX, offsetY)) < this.radian / 2) {
            this.isSelect = true;
            return true;
        }
        this.isSelect = false;
        this.isChange = true;
        return false;
    };

    // 计算触发事件坐标的角弧度
    this.getRadian = function (offsetX, offsetY) {
        let tranX = offsetX - this.center;
        let tranY = offsetY - this.center;
        let radian = Math.atan(tranY / tranX);
        // 按照象限进行坐标弧度转换
        if (tranX <= 0 && tranY >= 0) {
            radian = Math.PI + radian;
        } else if (tranX <= 0 && tranY <= 0) {
            radian = Math.PI + radian;
        } else if (tranX > 0 && tranY <= 0) {
            radian = Math.PI * 2 + radian;
        }
        if (radian > Math.PI * 2 - (Math.PI / this.items)) {
            radian = Math.atan(tranY / tranX);
        }
        return radian;
    };

    this.update = function (callback) {
        callback(this.value);
    };

}
