var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    


    // removing dead creeps
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader" );
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == "builder" );
    // console.log('Harvesters: ' + harvesters.length);

    // Spawning Harvesters
    if(harvesters.length < 50) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    // Spawning Upgraders
    if(upgrader.length < 10) {
        var newName = 'upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    //Spawn Builders
    if(builder.length < 30) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new Builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    }


    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}