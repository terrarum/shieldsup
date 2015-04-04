/*
 * Initialises the game environment and variables.
 */

// Create the game object.
game = {};
game.fn = {};
game.sim = {};

game.fn.timestamp = function() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

// Define game structures.
game.structureModels = {
    shieldEmitter: function () {
        return {
            maxStrength: 1000,  // 'Strength' of the shield; its HP. @TODO Current strength calculated from available MW?
            maxPower: 100,      // Maximum MW/s.
            minPower: 10        // Minimum MW/s required to generate a shield.
        }
    },
    generator: function () {
        return {
            maxOutput: 50,      // MW/s generated.
            maxHealth: 100,
            health: 100,
            generate: function(delta) {
                return this.maxOutput * (this.health / this.maxHealth) * delta;
            }
        }
    },
    capacitor: function() {
        return {
            capacity: 100
        }
    },
    battery: function() {
        return {
            maxCapacity: 50000,
            currentCapacity: 0,
            storePower: function(power) {
                // If full, return power.
                if (this.currentCapacity == this.maxCapacity) {
                    return power;
                }
                // If cannot store all given power, return the remainder.
                if (this.currentCapacity + power > this.maxCapacity) {
                    var remainder = power - (this.maxCapacity - this.currentCapacity);
                    this.currentCapacity = this.maxCapacity;
                    return remainder;
                }
                // Otherwise, just add the power and return true.
                else {
                    this.currentCapacity += power;
                    return 0;
                }

            }
        }
    }
};

game.init = function() {

    // Create simulation object.
    game.sim.components = {
        shieldEmitters: [],
        capacitors: [],
        generators: [],
        batteries: []
    };

    // Create starting buildings.
    game.sim.components.shieldEmitters.push(new game.structureModels.shieldEmitter());
    game.sim.components.capacitors.push(new game.structureModels.capacitor());
    game.sim.components.batteries.push(new game.structureModels.battery());
    game.sim.components.batteries.push(new game.structureModels.battery());
    game.sim.components.generators.push(new game.structureModels.generator());
    game.sim.components.generators.push(new game.structureModels.generator());

    updateCounts();

    game.sim.totalGenerated = 0;
};

var updateCounts = function() {
    $('.js-emitter-count').html(game.sim.components.shieldEmitters.length);
    $('.js-capacitor-count').html(game.sim.components.capacitors.length);
    $('.js-battery-count').html(game.sim.components.batteries.length);
    $('.js-generator-count').html(game.sim.components.generators.length);
}