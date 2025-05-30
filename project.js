// First done npm init on the terminal
// next ran npm i prompt-sync

// Lets understand the steps that we would be working on:

// 1. Deposit some money
// 2. Determine the number of lines to bet on. 
// 3. Collect a bet amount.
// 4. Spin the slot machine
// 5. Check if the user has Won. 
// 6. Give user their winnings.
// 7. Play again. 

// lets start with step1 in which we have to collect a deposit from the user

const prompt = require("prompt-sync")();

// Global Variables
const ROWS = 3;
const COLS = 3;

// Now we will create an object to represent the slot machine.
// objects are fundamental data structures used to store collections of key-value 
// pairs. They are similar to dictionaries in Python

const SYMBOL_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}

const deposit = () => {
    while(true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid Deposit Number, Try Again.")
        }else {
            return numberDepositAmount;
        }
    }
};

// Now we will write a function to get number of lines they bet on and collect the bet.

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines that you would like to bet on(1-3): ")
        const numberOfLines = parseInt(lines);

        if(isNaN(numberOfLines) || numberOfLines <=0 || numberOfLines >3){
            console.log("Invalid number of lines, try again.")
        }else{
            return numberOfLines;
        }
    } 
}

// Now lets write a function which will give us total bet amount

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter your bet amount per line: ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <=0 || numberBet > balance / lines){
            console.log("Invalid bet amount, try again.")
        }else{
            return numberBet;
        }
    }
}

// Now let's simulate slot machine spin

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
          symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i = 0; i<COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Math.random selects a random number between 0 and 1 and we multiply that with the length and round it of to least close number by using math.floor
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

// Now lets check wether the user has won some money
// To check wether the user has won we will check if all the symbols in a row are same.
// Currently when the spin function is run it gives us all the symbols which is basically the columns.
// So to check if have won we need to transpose the columns to rows
// And then check if all the symbols in a row are same

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

// Now let's print the rows
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;
            if(i != row.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Now let's check if user has won

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++){
        const symbols = rows[row]
        let allSame = true;
        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }
        if(allSame){
            winnings +=  bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
}

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance)
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("Your winnings are: $" + winnings.toString());
        if(balance <= 0){
            console.log("You ran out of money.")
            break
        }

        const playAgain = prompt("Do you want to play again? (y/n): ")
        if(playAgain.toLowerCase()!== "y"){
            break
        }
    }
}

game();