var Event = artifacts.require("./event.sol");

module.exports = function(deployer) {
    deployer.deploy(Event);
};