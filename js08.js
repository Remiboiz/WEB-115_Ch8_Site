"use strict";
"use strict";
/* 
   JavaScript 7th Edition
   Chapter 8
   Chapter case

   Draw Poker Game using Object Oriented Programming

   Author: Iremide Omoniyi
   Date: 4/8/26

   Filename: js08.js
*/

window.addEventListener("load", playDrawPoker);

function playDrawPoker() {

   // Reference buttons and images within the Poker Game page
   let dealButton = document.getElementById("dealB");
   let drawButton = document.getElementById("drawB");
   let standButton = document.getElementById("standB");
   let resetButton = document.getElementById("resetB");
   let statusBox = document.getElementById("status");
   let betSelection = document.getElementById("bet");
   let bankBox = document.getElementById("bank");
   let cardImages = document.querySelectorAll("img.cardImg");

   // Set the initial bank and bet values
   pokerGame.currentBank = 500;
   pokerGame.currentBet = 25;

   // Create a deck of shuffled cards
   let myDeck = new pokerDeck();
   myDeck.shuffle();

   // Create an empty poker hand object
   let myHand = new pokerHand(5);

   // Display the current bank value
   bankBox.value = pokerGame.currentBank;

   // Change the bet when the selection changes
   betSelection.onchange = function () {
      pokerGame.currentBet = parseInt(this.value);
   };

   // DEAL BUTTON
   dealButton.addEventListener("click", function () {
      if (pokerGame.currentBank >= pokerGame.currentBet) {

         dealButton.disabled = true;
         betSelection.disabled = true;
         drawButton.disabled = false;
         standButton.disabled = false;
         statusBox.textContent = "";

         // Reduce bank by bet
         bankBox.value = pokerGame.placeBet();

         // Get new deck if low cards
         if (myDeck.cards.length < 10) {
            myDeck = new pokerDeck();
            myDeck.shuffle();
         }

         // Deal 5 cards
         myDeck.dealTo(myHand);

         // Display cards
         for (let i = 0; i < cardImages.length; i++) {
            cardImages[i].src = myHand.cards[i].cardImage();

            // Flip cards on click
            cardImages[i].onclick = function () {
               if (this.src.includes("cardback.png")) {
                  this.src = myHand.cards[i].cardImage();
               } else {
                  this.src = "cardback.png";
               }
            };
         }

      } else {
         statusBox.textContent = "Insufficient Funds";
      }
   });

   // DRAW BUTTON
   drawButton.addEventListener("click", function () {

      dealButton.disabled = false;
      betSelection.disabled = false;
      drawButton.disabled = true;
      standButton.disabled = true;

      // Replace discarded cards
      for (let i = 0; i < cardImages.length; i++) {
         if (cardImages[i].src.includes("cardback.png")) {
            myHand.replaceCard(i, myDeck);
            cardImages[i].src = myHand.cards[i].cardImage();
         }
      }

      // Evaluate hand
      statusBox.textContent = myHand.getHandValue();

      // Update bank
      bankBox.value = pokerGame.payBet(statusBox.textContent);
   });

   // STAND BUTTON
   standButton.addEventListener("click", function () {

      dealButton.disabled = false;
      betSelection.disabled = false;
      drawButton.disabled = true;
      standButton.disabled = true;

      // Evaluate hand
      statusBox.textContent = myHand.getHandValue();

      // Update bank
      bankBox.value = pokerGame.payBet(statusBox.textContent);
   });

   // RESET BUTTON
   resetButton.addEventListener("click", function () {
      location.reload();
   });
}