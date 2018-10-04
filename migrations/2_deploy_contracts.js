var RoomThermostat = artifacts.require('RoomThermostat');

module.exports = (deployer) => {
    deployer.deploy(RoomThermostat);
}