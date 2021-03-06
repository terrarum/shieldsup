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
            maxStrength: 100,      // 'Strength' of the shield; its HP.
            currentStrength: 0,
            maxCapacity: 100,       // Maximum MW.
            minCapacity: 10,        // Minimum MW required to generate a shield.
            currentCapacity: 0,
            chargeRate: 10,
            conversionRate: 15,      // MW to SHIELD
            charge: function(charge) {
                this.currentCapacity = this.currentCapacity + charge > this.maxCapacity ? this.maxCapacity : this.currentCapacity + charge;
            },
            emit: function(delta) {
                // Do nothing if currentCapacity is below min + conversionrate.
                if (this.currentCapacity < this.minCapacity + this.conversionRate) {
                    return;
                }
                var conversionAmount = this.conversionRate * delta;
                // If currentCapacity - conversion is less than zero, currentCapacity is zero;
                // Update conversionAmount accordingly.
                if (this.currentCapacity - this.conversionRate * delta < 0) {
                    conversionAmount = this.currentCapacity;
                }
                if (this.currentStrength < this.maxStrength) {
                    this.currentCapacity -= conversionAmount;
                    this.currentStrength += conversionAmount;
                    if (this.currentStrength > this.maxStrength) {
                        this.currentStrength = this.maxStrength;
                    }
                }
            }
        }
    },
    generator: function () {
        return {
            maxOutput: 50,      // MW generated.
            maxHealth: 100,
            health: 100,
            generate: function(delta) {
                return this.maxOutput * (this.health / this.maxHealth) * delta;
            }
        }
    },
    capacitor: function() {
        return {
            maxCapacity: 10,
            chargeRate: 10,
            currentCapacity: 0,
            charge: function(charge) {
                this.currentCapacity = this.currentCapacity + charge > this.maxCapacity ? this.maxCapacity : this.currentCapacity + charge;
            },
            drainPower: function(charge) {
                console.log("Current Capacity:", this.currentCapacity)
                // If battery is empty, return 0.
                if (this.currentCapacity <= 0) {
                    return 0;
                }
                // If battery has more charge than is being requested,
                // return requested value.
                else if (this.currentCapacity - charge >= 0) {
                    this.currentCapacity -= charge;
                    return charge;
                }
                // If battery has less charge than is being requested,
                // return everything that's left.
                else if (this.currentCapacity < charge) {
                    charge -= this.currentCapacity;
                    this.currentCapacity = 0;
                    return charge;
                }
            }
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
            },
            drainPower: function(charge) {
                // If battery is empty, return 0.
                if (this.currentCapacity <= 0) {
                    return 0;
                }
                // If battery has more charge than is being requested,
                // return requested value.
                else if (this.currentCapacity - charge > 0) {
                    this.currentCapacity -= charge;
                    return charge;
                }
                // If battery has less charge than is being requested,
                // return everything that's left.
                else if (this.currentCapacity < charge) {
                    charge -= this.currentCapacity
                    this.currentCapacity = 0;
                    return charge;
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