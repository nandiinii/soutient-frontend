import React,{useState} from "react";
import './CampaignsFeed.css'
import { ethers } from 'ethers';
import { Abi } from "../../utils/Abi"; 
import { contractId as contractAddress } from "../../utils/urls";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contract = new ethers.Contract(contractAddress, Abi, provider);
const CampaignCard = ({campaign}) => {
    // console.log("Campaign individual: ",campaign)
    const handleDonate = async () => {
      try {
          // Request access to user's Metamask account
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
  
          // Prompt user for donation amount
          let donationAmount = prompt("Enter donation amount:");
          if (donationAmount === null || donationAmount.trim() === "") {
              // User cancelled donation or entered empty amount
              return;
          }
  
          // Convert donation amount to ethers format
          const ethersDonationAmount = ethers.utils.parseEther(donationAmount);
  
          // Make the donation transaction
          const tx = await contractWithSigner.donateToCampaign(campaign[0], {
              value: ethersDonationAmount
          });
  
          // Wait for transaction confirmation
          await tx.wait();
  
          // Display success message
          alert("Donation successful!");
      } catch (error) {
          console.error("Error donating to campaign:", error);
          alert("Error donating to campaign. Please try again later.");
      }
  };

  return (
    <div className="campaign__list_card">
      <img src={campaign.image} alt="" />
      <div className="campaign__feed_card_body">
        <div className="feed_card_body_text">
          <p>
            <span className="tag__val">Target:</span>{" "}
            {campaign.target.toString()}
          </p>
          <p>
            <span className="tag__val">Current:</span>{" "}
            {campaign.amountCollected.toString()}
          </p>
        </div>
            <button onClick={handleDonate}>Donate</button>
      </div>
    </div>
  );
};

export default CampaignCard;