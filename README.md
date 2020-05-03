# concert_ticketing_dApp
A dApp where venues can list available tickets and customers can view the chain of ticket owners and price variations on the blockchain.

## How to use:
This application requires the event.sol contract to be deployed to a test network and the webpage to be run locally.

1. Copy all files in the contracts folder to remix and deploy the event.sol contract to your preferred Etherium test net.
2. Locally compile the contracts by running truffle compile in the project directory.
3. Edit the EventContractAddress line in Account.js, Buying.js, Host.js and Resale.js to have to contract address of event that you deployed.
4. run npm start in the concert_ticketing_dapp directory inside the project directory.

After doing this you will have the webpage running locally at localhost:3000. Connect this to Metamask to utilize the webpage. 
Refresh the page anytime you change accounts or changes may not propagate fully. 
