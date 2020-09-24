function PieChart(elem, params) {
    this.elem = elem;
    this.params = params || {};
    this.ctx = null;

    this._init();
}


Object.defineProperties(PieChart.prototype, {
    id: {
        value: 'pie-chart',
        enumerable: true
    },

    _init: {
        value: function() {
            this.params.gap = typeof this.params.gap === 'number' ? this.params.gap : 0;
            this.params.lineWidth = typeof this.params.lineWidth === 'number' ? this.params.lineWidth : 1;
            this.params.start = typeof this.params.start === 'number' ? this.params.start : 0;
            this.params.anticlockwise = this.params.anticlockwise === true;

            this.elem.width = this.elem.height = (this.params.radius || 300);
            this.ctx = this.elem.getContext('2d');

            this.draw(this.params.items || []);
        }
    },

    draw: {
        value: function (items) {
            var ctx = this.ctx;

            ctx.lineWidth = this.params.lineWidth;

            var radius = (ctx.canvas.width / 2) - (ctx.lineWidth / 2);
            var centerX = ctx.canvas.width / 2;
            var centerY = ctx.canvas.height / 2;

            var anticlockwise = this.params.anticlockwise;
            // half gap in radians
            var gap = (anticlockwise ? -1: 1) * this.params.gap / radius * 2;
            var startAngle = this.params.start;
            var total = items.reduce(function (memo, item) { return memo + (item.number || 0); }, 0);

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            for (var i = 0; i < items.length; ++i) {
                if (!items[i].number) continue;

                var endAngle = startAngle + (anticlockwise ? -1 : 1) * (2 * Math.PI * items[i].number / total);
                var colors = [].concat(items[i].color).filter(Boolean);

                if (!colors.length) {
                    throw Error('should specify color property');
                }

                if (colors.length === 1) {
                    ctx.strokeStyle = colors[0];
                } else {
                    var gradientDir = items[i].gradient || [];

                    gradientDir[0] = typeof gradientDir[0] === 'number' ? gradientDir[0] : startAngle;
                    gradientDir[1] = typeof gradientDir[1] === 'number' ? gradientDir[1] : endAngle;

                    var gradient = ctx.createLinearGradient(
                        centerX + Math.cos(gradientDir[0]) * radius,
                        centerY + Math.sin(gradientDir[0]) * radius,
                        centerX + Math.cos(gradientDir[1]) * radius,
                        centerY + Math.sin(gradientDir[1]) * radius
                    );

                    for (var j = 0; j < colors.length; ++j) {
                        gradient.addColorStop(j / (colors.length - 1), colors[j]);
                    }

                    ctx.strokeStyle = gradient;
                }

                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle + gap, endAngle - gap, anticlockwise);
                ctx.stroke();

                startAngle = endAngle;
            }
        },
        enumerable: true,
        writable: true,
        configurable: true
    }
});


if (module) {
    module.exports = PieChart;
}