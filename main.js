var Game = {

    run: function(options) {

        function timestamp() {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }

        var now,
            dt       = 0,
            last     = timestamp(),
            slow     = options.slow || 1, // slow motion scaling factor
            step     = 1/options.fps,
            slowStep = slow * step,
            update   = options.update,
            render   = options.render;
            fpsmeter = new FPSMeter(options.fpsmeter || { decimals: 0, graph: true, theme: 'dark', right: '5px', left: 'default' });

        function frame() {
            fpsmeter.tickStart();
            now = timestamp();
            dt = dt + Math.min(1, (now - last) / 1000);
            while(dt > slowStep) {
                dt = dt - slowStep;
                update(step);
            }
            render(dt/slow);
            last = now;
            fpsmeter.tick();
            requestAnimationFrame(frame, options.canvas);
        }

        requestAnimationFrame(frame);
    }
};

var update = function() {

};

var render = function() {

};

$(function() {
    console.log("DOM ready.");

    var options = {
        fps: 60,
        update: update,
        render: render
    };

    Game.run(options);
});