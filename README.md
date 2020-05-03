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


Some features like cancel sale and transfer ownership have not been implemented due to lack of time.
TO test these functions you will have to deploy directly in Remix
Follow the instructions below:

## TO TEST THE CONTRACTS IN REMIX:

1.Add all files to the Remix Library.
2.Compile TicketResale.sol with version 0.5.17
3.Deploy the TicketResale contract with parameters that specify:
  -time of sale in seconds
  -contract owner
  -price of each ticket
  -total available tickets


## Functions: 
_buytickets(string, uint):
  Creates a ticket based on a unique hash of your name and number of tickets available.
  Indexes ticket ownership to the address that bought the ticket.

withdraw():
  Used to withdraw contract funds. Can only be used by the contract owner.

availableTickets():
  Returns the total number of available tickets from owner.

list_my_tickets():
  Returns an array of all the ticket IDs owned by the address that called this function.

list_2ndHand_tickets():
  Returns an array of all the ticket IDs that are up for resale.

sell_my_tickets(uint[]):
  Requires an input in array format specifying the IDs that you want to sell.

buy_from_reseller(uint[]):
  Requires an input in array format specifying the IDs that you want to buy.

cancel_my_sale:
  Removes tickets from the list of tickets that are being resold.

cancel_sale:
  Cancels the official sale of the tickets.

ownerOf(uint):
  Returns the address of the owner of the specified ticket ID.

transferFrom(address FROM, address TO, uint):
  Remaps the owner of a token id from the FROM address to the TO address.



