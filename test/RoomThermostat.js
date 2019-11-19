const RoomThermostat = artifacts. require('RoomThermostat')
const truffleAssert = require('truffle-assertions');

contract('RoomThermostat', (accounts) => {
    let contract;
    const installer = accounts[1];
    const user = accounts[2];

    describe('Constructor', () => {
        beforeEach('setup', async () => {
            contract = await RoomThermostat.new(installer, user);
        });

        it('should return a new instance of the contract', async () => {
            var state = await contract.State();
            var instanceInstaller = await contract.Installer();
            var instanceUser = await contract.User();

            assert.equal(installer, instanceInstaller);
            assert.equal(user, instanceUser);
            assert.equal(0, state);
        });
    })

    describe('StartThermostat', () => {
        beforeEach('setup', async () => {
            contract = await RoomThermostat.new(installer, user);
        });

        it('only installer can start the thermostat', async () => {
            await truffleAssert.reverts(contract.StartThermostat({ from: user }));
        });

        it('state should only be Created', async () => {
            // state is not Created after the following statement
            contract.StartThermostat({ from: installer });

            await truffleAssert.reverts(contract.StartThermostat({ from: installer }));
        });

        it('should update the contract', async () => {
            var result = await contract.StartThermostat({ from: installer });
            var state = await contract.State();
            var instanceInstaller = await contract.Installer();
            var instanceUser = await contract.User();

            assert.equal(1, state);
            assert.equal(installer, instanceInstaller);
            assert.equal(user, instanceUser);
            truffleAssert.eventEmitted(result, 'ContractUpdated', (ev) => {
                return ev.action == 'StartThermostat';
            }, 'Contract should emit the correct message');
        });
    })

    describe('SetTargetTemperature', () => {
        beforeEach('setup', async () => {
            contract = await RoomThermostat.new(installer, user);
            await contract.StartThermostat({ from: installer });
        });

        it('only user can set target temperature', async () => {
            await truffleAssert.reverts(contract.SetTargetTemperature(71, { from: installer }));
        });

        it('state must be InUse', async () => {
            // state is not InUse after the following statement
            contract = await RoomThermostat.new(installer, user);

            await truffleAssert.reverts(contract.SetTargetTemperature(71, { from: user }));
        });

        it('should update contract', async () => {
            var result = await contract.SetTargetTemperature(71, { from: user });
            var state = await contract.State();
            var temperature = await contract.TargetTemperature();

            assert.equal(1, state);
            assert.equal(71, temperature);
            truffleAssert.eventEmitted(result, 'ContractUpdated', (ev) => {
                return ev.action == 'SetTargetTemperature';
            }, 'Contract should emit the correct message');
        });
    })

    describe('SetMode', () => {
        beforeEach('setup', async () => {
            contract = await RoomThermostat.new(installer, user);
            await contract.StartThermostat({ from: installer });
        });

        it('only user can set mode', async () => {
            await truffleAssert.reverts(contract.SetMode(1, { from: installer }));
        });

        it('state must be InUse', async () => {
            // state is not InUse after the following statement
            contract = await RoomThermostat.new(installer, user);

            await truffleAssert.reverts(contract.SetMode(1, { from: user }));
        });

        it('should update contract', async () => {
            var result = await contract.SetMode(1, { from: user });
            var state = await contract.State();
            var mode = await contract.Mode();

            assert.equal(1, state);
            assert.equal(1, mode);
            truffleAssert.eventEmitted(result, 'ContractUpdated', (ev) => {
                return ev.action == 'SetMode';
            }, 'Contract should emit the correct message');
        });
    })
})