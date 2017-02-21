function solve() {
    'use strict';

    const ERROR_MESSAGES = {
        INVALID_NAME_TYPE: 'Name must be string!',
        INVALID_NAME_LENGTH: 'Name must be between between 2 and 20 symbols long!',
        INVALID_NAME_SYMBOLS: 'Name can contain only latin symbols and whitespaces!',
        INVALID_MANA: 'Mana must be a positive integer number!',
        INVALID_EFFECT: 'Effect must be a function with 1 parameter!',
        INVALID_DAMAGE: 'Damage must be a positive number that is at most 100!',
        INVALID_HEALTH: 'Health must be a positive number that is at most 200!',
        INVALID_SPEED: 'Speed must be a positive number that is at most 100!',
        INVALID_COUNT: 'Count must be a positive integer number!',
        INVALID_SPELL_OBJECT: 'Passed objects must be Spell-like objects!',
        INVALID_ALIGNMENT: 'Alignment must be good, neutral or evil!',
        INVALID_COMMANDER: 'There is no commander with this name!',
        NOT_ENOUGH_MANA: 'Not enough mana!',
        TARGET_NOT_FOUND: 'Target not found!',
        INVALID_BATTLE_PARTICIPANT: 'Battle participants must be ArmyUnit-like!'
    };

    // your implementation goes here

    const getId = (function* getId() {
        let id = 1;
        while (true) {
            yield id++;
        }
    }());

    const Validator = {
        validateIsString(str) {
            if (typeof str !== 'string') {
                throw Error(ERROR_MESSAGES.INVALID_NAME_TYPE);
            }
        },

        validateStringLengthBetween2and20(str) {
            if (str.length < 2 || str.length > 20) {
                throw Error(ERROR_MESSAGES.INVALID_NAME_LENGTH);
            }
        },

        validateStringSymbols(str) {
            if (/[^A-Za-z ]/g.test(str)) {
                throw Error(ERROR_MESSAGES.INVALID_NAME_SYMBOLS);
            }
        },

        validatePositiveInteger(num, propName) {
            if (typeof num !== 'number' || Number.isNaN(num) || num < 0 || (num !== (num | 0))) {
                switch (propName) {
                    case 'mana':
                        throw Error(ERROR_MESSAGES.INVALID_MANA);
                        break;
                    case 'count':
                        throw Error(ERROR_MESSAGES.INVALID_COUNT);
                        break;
                    default:
                        break;
                }
            }
        },

        validatePositiveIntegerBelow(num, below, propName) {
            if (typeof num !== 'number' || Number.isNaN(num) || num < 1 || num > below) {
                switch (propName) {
                    case 'damage':
                        throw Error(ERROR_MESSAGES.INVALID_DAMAGE);
                        break;
                    case 'health':
                        throw Error(ERROR_MESSAGES.INVALID_HEALTH);
                        break;
                    case 'speed':
                        throw Error(ERROR_MESSAGES.INVALID_SPEED);
                        break;
                    default:
                        break;
                }
            }
        },

        validateIsFunction(funcName, argsCount) {
            if (typeof funcName !== 'function' || funcName.length !== argsCount) {
                throw Error(ERROR_MESSAGES.INVALID_EFFECT);
            }
        }
    };

    class Spell {
        constructor(name, manaCost, effect) {
            Validator.validateIsFunction(effect, 1);
            this.name = name;
            this.manaCost = manaCost;
            this.effect = effect;
        }

        get name() {
            return this._name;
        }
        set name(value) {
            Validator.validateIsString(value);
            Validator.validateStringLengthBetween2and20(value);
            Validator.validateStringSymbols(value);
            this._name = value;
        }

        get manaCost() {
            return this._manaCost;
        }
        set manaCost(value) {
            Validator.validatePositiveInteger(value, 'mana');
            this._manaCost = value;
        }
    }

    class Unit {
        constructor(name, alignment) {
            this.name = name;
            this.alignment = alignment;
        }

        get name() {
            return this._name;
        }
        set name(value) {
            Validator.validateIsString(value);
            Validator.validateStringLengthBetween2and20(value);
            Validator.validateStringSymbols(value);
            this._name = value;
        }

        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            const aligns = ["evil", "good", "neutral"];
            if (aligns.indexOf(value) < 0) {
                throw Error(ERROR_MESSAGES.INVALID_ALIGNMENT);
            }
            this._alignment = value;
        }
    }

    class ArmyUnit extends Unit {
        constructor(options) {
            super(options.name, options.alignment);
            this._id = getId.next().value;
            this.damage = options.damage;
            this.health = options.health;
            this.count = options.count;
            this.speed = options.speed;
        }

        get id() {
            return this._id;
        }

        get damage() {
            return this._damage;
        }
        set damage(value) {
            Validator.validatePositiveIntegerBelow(value, 100, 'damage');
            this._damage = value;
        }

        get health() {
            return this._health;
        }
        set health(value) {
            Validator.validatePositiveIntegerBelow(value, 200, 'health');
            this._health = value;
        }

        get count() {
            return this._count;
        }
        set count(value) {
            Validator.validatePositiveInteger(value, 'count');
            this._count = value;
        }

        get speed() {
            return this._speed;
        }
        set speed(value) {
            Validator.validatePositiveIntegerBelow(value, 100, 'speed');
            this._speed = value;
        }
    }

    class Commander extends Unit {
        constructor(name, alignment, mana) {
            super(name, alignment);
            this.mana = mana;
            this.spellbook = [];
            this.army = [];
        }

        get mana() {
            return this._mana;
        }
        set mana(value) {
            Validator.validatePositiveInteger(value, 'mana');
            this._mana = value;
        }
    }

    class BattleManager {
        constructor() {
            this._commanders = [];
            this._armyUnits = [];
        }

        getCommander(name, alignment, mana) {
            return new Commander(name, alignment, mana);
        }
        getArmyUnit(options) {
            return new ArmyUnit(options);
        }
        getSpell(name, manaCost, effect) {
            return new Spell(name, manaCost, effect);
        }
        addCommanders(...commanders) {
            this._commanders.push(...commanders);
            return this;
        }
        addArmyUnitTo(commanderName, armyUnit) {
            const commander = this._commanders.find(c => c.name === commanderName);
            commander.army.push(armyUnit);
            this._armyUnits.push(armyUnit);
            return this;
        }
        addSpellsTo(commanderName, ...spells) {
            const commander = this._commanders.find(c => c.name === commanderName);

            if (commander === undefined) {
                throw Error(ERROR_MESSAGES.INVALID_COMMANDER);
            }

            let validSpells = [];

            try {
                validSpells = spells.map(s => this.getSpell(s.name, s.manaCost, s.effect));
            } catch (err) {
                throw Error(ERROR_MESSAGES.INVALID_SPELL_OBJECT);
            }

            commander.spellbook.push(...validSpells);
            return this;
        }
        findCommanders(query) {
            return this._commanders
                .filter(c => Object.keys(query).every(prop => query[prop] === c[prop]));
        }
        findArmyUnitById(id) {
            return this._armyUnits.find(unit => unit.id === id);
        }
        findArmyUnits(query) {
            let units = this._armyUnits
                .slice()
                .filter(unit => Object.keys(query).every(prop => query[prop] === unit[prop]));

            return units.sort((a, b) => {
                if (a.speed !== b.speed) {
                    return b.speed - a.speed
                } else {
                    return (a.name).localeCompare(b.name)
                }
            });
        }
        spellcast(casterName, spellName, targetUnitId) {
            const commander = this._commanders.find(c => c.name === casterName);

            if (commander === undefined) {
                throw Error('Can\'t cast with non-existant commander ' + casterName + '!');
            }

            const spell = commander.spellbook.find(spell => spell.name === spellName);

            if (spell === undefined) {
                throw Error(casterName + ' doesn\'t know ' + spellName + '!');
            }

            if (commander.mana < spell.manaCost) {
                throw Error(ERROR_MESSAGES.NOT_ENOUGH_MANA);
            }

            const army = this.findArmyUnitById(targetUnitId);

            spell.effect(army);

            commander.mana -= spell.manaCost;

            return this;
        }

        battle(attacker, defender) {
            let attackerUnit, defenderUnit;
            try {
                attackerUnit = this.getArmyUnit(attacker);
                defenderUnit = this.getArmyUnit(defender);
            } catch (err) {
                throw Error(ERROR_MESSAGES.INVALID_BATTLE_PARTICIPANT);
            }

            const defenderCountAfterAttack = Math.ceil((defender.health * defender.count - attacker.damage * attacker.count) / defender.health);

            defender.count = defenderCountAfterAttack < 0 ? 0 : defenderCountAfterAttack;

            return this;
        }
    }

    return new BattleManager;
}

module.exports = solve;