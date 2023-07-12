// SPDX-License-Identifier : MIT

pragma solidity ^0.8.0;

contract voting{
    struct Candidates{
        string name;
         uint256 voteCount;
    }
    Candidates [] public candidates;
    address owner;
    mapping(address=>bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;


    constructor(string[] memory _candidateNames,uint256 _durationInMinutes){
        for(uint256 i =0 ;i<_candidateNames.length;i++) {
            candidates.push(Candidates({
                name: _candidateNames[i],
                voteCount :0
            }));
            
        }
        owner =msg.sender;
            votingStart = block.timestamp;
            votingEnd = block.timestamp+(_durationInMinutes * 1 minutes);

    }

    modifier onlyOwner{
        require(msg.sender == owner);
        _;
    }
    function addCandidate(string memory _name) public onlyOwner{
        candidates.push(Candidates({
            name:_name,
            voteCount:0
        }));
    }

    function vote(uint256 _candidateIndex)  public{
        require(!voters[msg.sender],"You have already voted");
        require(_candidateIndex < candidates.length,"Invalid Candidates");

        candidates [_candidateIndex].voteCount++;
        voters[msg.sender] =true;
        
    }

    function getAllVotedCandidates() public view returns(Candidates[] memory){
        return candidates;
    }

    function getVotingStatus() public view returns(bool) {
        return (block.timestamp >= votingStart && block.timestamp< votingEnd);

        
    }

    function getRemainingTime() public view returns(uint256){
        require(block.timestamp >= votingStart,"Voting has been started yet");
        if(block.timestamp>= votingEnd){
            return 0;
        }
        return votingEnd-block.timestamp;
    }
}