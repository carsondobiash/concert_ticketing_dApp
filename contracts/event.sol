pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;

import "./ticketresale.sol";

contract Event{

    uint256 public eventId;

    struct eventInfo {
        string event_name;
        uint256 event_date;
        string event_description;
        string event_section;
        uint event_section_amount;
        uint event_section_price;
    }

    mapping(uint => TicketResale) event_id_to_tickets;
    mapping(address => uint) tickets_to_event_id;
    mapping(address => eventInfo[]) events_address;
    mapping(uint256 => eventInfo) events_ids;
    uint256[] public eventIds;
    TicketResale[] event_ticket_contracts;

    function createEvent(string memory event_name, uint256 event_date, string memory event_description, string memory event_section, uint event_section_amount, uint event_section_price) public {
        eventId++;
        eventInfo storage newEvent = events_ids[eventId];
        newEvent.event_name = event_name;
        newEvent.event_date = event_date;
        newEvent.event_description = event_description;
        newEvent.event_section = event_section;
        newEvent.event_section_amount = event_section_amount;
        newEvent.event_section_price = event_section_price;
        eventIds.push(eventId);
        events_address[msg.sender].push(newEvent);
        event_id_to_tickets[eventId] = new TicketResale(event_date,msg.sender,event_section_price,event_section_amount);
        tickets_to_event_id[address(event_id_to_tickets[eventId])] = eventId;
        event_ticket_contracts.push(event_id_to_tickets[eventId]);
    }

    function getEvent(uint256 id) public view returns(string memory, uint256 , string memory, string memory, uint , uint ) {
        eventInfo storage s = events_ids[id];
        return (s.event_name, s.event_date, s.event_description, s.event_section, s.event_section_amount, s.event_section_price);
    }

    function getMyEvents() public view returns(eventInfo[] memory){
        return events_address[msg.sender];
    }

    function getEventTickets(uint256 id) public view returns(TicketResale) {
        return event_id_to_tickets[id];
    }

    function getAllAddresses() public view returns(TicketResale[] memory) {
        return event_ticket_contracts;
    }
    function getEventId(address tr) public view returns(uint){
        return tickets_to_event_id[tr];
    }
}