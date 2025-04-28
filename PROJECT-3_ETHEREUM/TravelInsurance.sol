// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract TravelInsurance {

    using Strings for string;

    address public insuranceProvider;
    mapping(address => PurchasedPolicy) public purchasedPolicies;
    address[] public purchasers;

    struct PurchasedPolicy {
        string name;
        address userAddress;
        int flightNumber;
        string flightDate;
        string departureCity;
        string destinationCity;
        string policyStatus;
    }

    constructor() {
        insuranceProvider = msg.sender;
    }

    modifier isProvider() {
        require(msg.sender == insuranceProvider, "Unauthorized");
        _;
    }

    modifier isNotProvider() {
        require(msg.sender != insuranceProvider, "Unauthorized");
        _;
    }

    function viewAvaliablePolicy() public view isNotProvider returns (string memory) {
        return "Premium: 0.01 ETH, Indemnity: 0.02 ETH, Coverage: Hail, Flooding.";
    }

    function purchasePolicy(string calldata name, int flightNumber, string calldata flightDate, string calldata departureCity, string calldata destinationCity) external isNotProvider {
        // Only push new purchasers once
        if (purchasedPolicies[msg.sender].userAddress == address(0)) {
            purchasers.push(msg.sender);
        }
        purchasedPolicies[msg.sender] = PurchasedPolicy({ 
            name : name,
            userAddress: msg.sender,
            flightNumber: flightNumber,
            flightDate : flightDate,
            departureCity: departureCity,
            destinationCity: destinationCity,
            policyStatus: "purchased"
        });
    }

    function viewPurchasedPolicy() public view returns (string memory) {
        PurchasedPolicy memory purchasedPolicy = purchasedPolicies[msg.sender];
        return string(
            abi.encodePacked(
                "\n---\nName: ", purchasedPolicy.name,
                "\nFlight Number: ", Strings.toString(uint256(purchasedPolicy.flightNumber)),
                "\nFlight Date: ", purchasedPolicy.flightDate,
                "\nDeparture City: ", purchasedPolicy.departureCity,
                "\nDestination City: ", purchasedPolicy.destinationCity,
                "\nUser Address: ", Strings.toHexString(uint160(msg.sender), 20),
                "\nPolicy Status: ", purchasedPolicy.policyStatus,
                "\n---\n"
            )
        );
    }

    function viewBalance() public view isNotProvider returns (string memory) {
        return Strings.toString(msg.sender.balance);
    }

    // Insurance Provider view all purchased policies
    function viewAllPolicies() public view isProvider returns (string memory) {
        string memory rtnString = "";

        for (uint i = 0; i < purchasers.length; i++) {
            PurchasedPolicy memory p = purchasedPolicies[purchasers[i]];
            if (!p.policyStatus.equal("purchased")) continue;
            rtnString = string(
                abi.encodePacked(
                    rtnString,
                    "\n---\nName: ", p.name,
                    "\nFlight Number: ", Strings.toString(uint256(p.flightNumber)),
                    "\nFlight Date: ", p.flightDate,
                    "\nDeparture City: ", p.departureCity,
                    "\nDestination City: ", p.destinationCity,
                    "\nUser Address: ", Strings.toHexString(uint160(p.userAddress), 20),
                    "\nPolicy Status: ", p.policyStatus,
                    "\n---\n"
                )
            );
        }

        return rtnString;    
    }

    // Verifys flight claim status based on policy. If "flood" or "hail" present, claim is valid.
    // Because TravelInsurance cannot directly read from a file, key values passed in as arguments.
    function verify(string calldata date, string calldata departureCity, string calldata weather) public isProvider returns (bool) {
        if (!weather.equal("Hail") || !weather.equal("Flood")) return false;
        for (uint i = 0; i < purchasers.length; i++) {
            PurchasedPolicy memory p = purchasedPolicies[purchasers[i]];
            if (!p.policyStatus.equal("claimed") && p.flightDate.equal(date) && p.departureCity.equal(departureCity)) payIndemnity(p.userAddress);
        }    
    }

    // Pay Passenger indemnity.
    function payIndemnity(address passengerId) public payable isProvider returns (string memory) {
        PurchasedPolicy storage policy = purchasedPolicies[passengerId];

        // Ensure contract has minimum balance
        require(address(this).balance >= 0.02 ether, "Not enough contract balance.");
        (bool sent, ) = passengerId.call{value: 0.02 ether}("");
        if (sent) {
            policy.policyStatus = "claimed";
            // return abi.encodePacked("\nPayout of 0.02 Ether successful for user ", Strings.toHexString(uint160(policy.userAddress), 20));
            return "\nPayout of 0.02 Ether successful for user.";
        } else {
            return "Payout failed.";
        }

    }

}
