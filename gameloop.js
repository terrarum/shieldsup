var last = 0;
var generated = 0;
var generatedCounter = 0;
var generatedPerSecond = 0;

// Update all game values.
window.game.update = function(delta) {

    // Generate power.
    generated = generatePower(delta);
    // Store power.
    storePower(delta, generated);
    // Charge the capacitor.
    _.forEach(game.sim.components.capacitors, function(capacitor, i) {
        if (capacitor.currentCapacity < capacitor.maxCapacity) {
            capacitor.charge(drawPower(delta, capacitor.chargeRate));
        }
    });
    // Charge the shield emitter and emit the shield.
    _.forEach(game.sim.components.shieldEmitters, function(shieldEmitter, i) {
        if (shieldEmitter.currentCapacity < shieldEmitter.maxCapacity) {
            shieldEmitter.charge(drawCap(delta, shieldEmitter.chargeRate));
            shieldEmitter.emit(delta);
        }
    });

    // This block runs every second.
    generatedCounter += generated;
    now = game.fn.timestamp();
    if (now - last >= 1000) {
        last = game.fn.timestamp();

        // Calculate the MW being generated per second.
        generatedPerSecond = generatedCounter;
        generatedCounter = 0;
    }
};

// Render the game.
window.game.render = function(delta) {
    $('.js-generated-count').html(generatedPerSecond.toFixed(2))

    // Draw batteries.
    $('.js-batteries').empty();
    _.forEach(game.sim.components.batteries, function(battery, i) {
        $('.js-batteries').append(progressbar(battery.currentCapacity / battery.maxCapacity * 100, battery.currentCapacity.toFixed(0)))
    });

    // Draw capacitors.
    $('.js-capacitors').empty();
    _.forEach(game.sim.components.capacitors, function(capacitor, i) {
        $('.js-capacitors').append(progressbar(capacitor.currentCapacity / capacitor.maxCapacity * 100, capacitor.currentCapacity.toFixed(2)))
    });

    // Draw emitters.
    $('.js-emitters').empty();
    $('.js-shield').empty();
    _.forEach(game.sim.components.shieldEmitters, function(shieldEmitter, i) {
        $('.js-emitters').append(progressbar(shieldEmitter.currentCapacity / shieldEmitter.maxCapacity * 100, shieldEmitter.currentCapacity.toFixed(0)))
        $('.js-shield').append(progressbar(shieldEmitter.currentStrength / shieldEmitter.maxStrength * 100, shieldEmitter.currentStrength.toFixed(0)))
    });
};

// Draw power from batteries.
var drawCap = function(delta, rate) {
    var chargeRate = rate * delta;
    console.log("Draw Cap",chargeRate);
    var charge = 0;
    _.forEach(game.sim.components.capacitors, function(capacitor, i) {
        charge += capacitor.drainPower(chargeRate / game.sim.components.capacitors.length);
        console.log("Charge", charge);
    });
    return charge;
}

// Draw power from batteries.
var drawPower = function(delta, rate) {
    var chargeRate = rate * delta;
    var charge = 0;
    _.forEach(game.sim.components.batteries, function(battery, i) {
        charge += battery.drainPower(chargeRate / game.sim.components.batteries.length);
    });
    return charge;
}

// Calculate power generated by all active generators.
var generatePower = function(delta) {
    var generated = 0;
    _.forEach(game.sim.components.generators, function(generator, i) {
        generated += generator.generate(delta);
    });
    return generated;
};

// Returns a progressbar.
var progressbar = function(percentage, total) {
    return '<div class="progress">' +
    '<div class="progress-bar" role="progressbar" style="width: '+ percentage + '%;">' +
    '<span class="sr-only">'+ percentage + '%</span>' +
    '</div></div>' +
    '<div style="text-align: center">' + total + ' MWs</div>';
}

// Store power in the batteries.
var storePower = function(delta, generated) {
    _.forEach(game.sim.components.batteries, function(battery, i) {
        battery.storePower(generated / game.sim.components.batteries.length);
    });
};