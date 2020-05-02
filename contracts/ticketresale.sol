pragma solidity >=0.5.0 <0.6.0;


import "./ticketownership.sol";

contract TicketResale is TicketOwnership{


    constructor (uint _sellingTime, address payable _owner, uint _price, uint _availableTickets) public {
        availableTickets = _availableTickets;
        price = _price *1 wei;
        venue_owner = _owner;
        sale_start=now;
        sale_end = now + _sellingTime*1 seconds;
        STATE=sale_state.STARTED;
    }

   uint resaleTicketCount = 0;

    mapping (uint => uint) public ticketToPrice;
    uint[] secondHandTicketId;

    function buy_from_reseller(uint[] memory number_tickets) public payable returns (bool){
        uint resale_price = 0 * 1 ether;
        for(uint i = 0 ; i < number_tickets.length; i++){
            resale_price += ticketToPrice[number_tickets[i]];
        }
        require(msg.value == resale_price, "You do not have enough ether");
        for(uint i = 0 ; i < number_tickets.length; i++){
            transferFrom(ticketToOwner[number_tickets[i]], msg.sender, number_tickets[i]);
            delete ticketToPrice[number_tickets[i]];
            resaleTicketCount-=1;
        }


        return true;
    }

    function list_prices() public view returns (uint[] memory, uint[] memory){
        uint[] memory availableTicketPrices;
        uint[] memory available_ticketIDs;
        for(uint i = 0; i < resaleTicketCount; i++){

        }
        return (availableTicketPrices, available_ticketIDs);
    }

    function list_my_tickets() public view returns (int[]  memory){
        int[] memory my_tickets = new int[](ownerTicketCount[msg.sender]);
        uint j = 0;
        for(int i = 0; i < int(tickets.length); i++){
            if(ticketToOwner[uint(i)] == msg.sender){
                my_tickets[j] = i;
                j+=1;
            }
        }
        return my_tickets;
    }

    function sell_my_tickets(uint[] memory my_tickets, uint my_price) public returns (bool){
        require(ownerTicketCount[msg.sender] >= my_tickets.length, "You do not have as many tickets to sell");
        for(uint i = 0; i < my_tickets.length; i++){
            require(ticketToOwner[my_tickets[i]] == msg.sender);
            ticketToPrice[my_tickets[i]] = my_price;
            resaleTicketCount+=1;
        }
    }
}