pragma solidity ^0.5.0;

contract RoomThermostat
{

    enum StateType {
        Created,
        InUse
    }

    enum ModeEnum {
        Off,
        Cool,
        Heat,
        Auto
    }

    string internal ApplicationName = "RoomThermostat";
    string internal WorkflowName = "RoomThermostat";

    event ContractCreated(string applicationName, string workflowName, address originatingAddress);
    event ContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);

    address public Installer;
    address public User;
    StateType public State;
    int public TargetTemperature;
    ModeEnum public  Mode;

    constructor (address thermostatInstaller, address thermostatUser) public {
        Installer = thermostatInstaller;
        User = thermostatUser;
        TargetTemperature = 70;
        State = StateType.Created;

        emit ContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function StartThermostat() public {
        if (Installer != msg.sender) {
            revert("Only installer can install the thermostat");
        }

        if (State != StateType.Created) {
            revert("StartThermostat function can only be called when at Created state");
        }

        State = StateType.InUse;

        emit ContractUpdated(ApplicationName, WorkflowName, "StartThermostat", msg.sender);
    }

    function SetTargetTemperature(int targetTemperature) public {
        if (User != msg.sender) {
            revert("Only user can set target temperature");
        }

        if (State != StateType.InUse) {
            revert("SetTargetTemperature function can only be called when at InUse state");
        }

        TargetTemperature = targetTemperature;

        emit ContractUpdated(ApplicationName, WorkflowName, "SetTargetTemperature", msg.sender);
    }

    function SetMode(ModeEnum mode) public {
        if (User != msg.sender) {
            revert("Only user can set mode");
        }

        if (State != StateType.InUse) {
            revert("SetMode function can only be called when at InUse state");
        }

        Mode = mode;

        emit ContractUpdated(ApplicationName, WorkflowName, "SetMode", msg.sender);
    }
}