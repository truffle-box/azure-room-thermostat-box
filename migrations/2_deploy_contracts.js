var RoomThermostat = artifacts.require('RoomThermostat');

module.exports = (deployer, network, accounts) => {
    deployer.deploy(RoomThermostat, accounts[0], accounts[1]);
}