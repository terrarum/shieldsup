game.run = function(options) {

    var now,
        dt       = 0,
        last     = game.fn.timestamp(),
        slow     = options.slow || 1, // slow motion scaling factor
        step     = 1/options.fps,
        slowStep = slow * step,
        update   = options.update,
        render   = options.render,
        fpsmeter = new FPSMeter(options.fpsmeter || { decimals: 0, graph: true, theme: 'dark', right: '5px', left: 'default' });

    function frame() {
        fpsmeter.tickStart();
        now = game.fn.timestamp();
        //dt = dt + Math.min(1, (now - last) / 1000);
        dt = dt + (now - last) / 1000;
        while(dt > slowStep) {
            dt = dt - slowStep;
            update(step);
        }
        render(dt/slow);
        last = now;
        fpsmeter.tick();
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
};

$(function() {
    console.log("DOM ready.");

    game.init();

    var options = {
        fps: 60,
        update: game.update,
        render: game.render
    };

    game.run(options);
});