import { ethers } from "./ethers.js"
import { contractAddress, abi } from "./constants.js";
console.log("scripts working");
//metamask
const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected"
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log("connected")
    } else {
        // connectButton.innerHTML = "Please install MetaMask"
        alert("Install Metamask")
    }
}

//candidate 1

const name1input = document.getElementById("can1input");
const name1output = document.getElementById("can1output");
const b1 = document.getElementById("register-for-candidate1");

// Retrieve the candidate's name from localStorage
const storedCandidateName1 = localStorage.getItem('candidateName1');
if (storedCandidateName1) {
    name1output.innerHTML = storedCandidateName1;
}

let nameSet = !!storedCandidateName1; // Check if the name has been set previously

function addname1() {
    if (!nameSet) {
        const candidateName1 = name1input.value;
        name1output.innerHTML = candidateName1;

        // Store the candidate's name in localStorage
        localStorage.setItem('candidateName1', candidateName1);

        nameSet = true;
    }
}
//#01 to reset after vote
// function vote1() {
//     // Your vote function logic goes here
//     nameSet = false
// }

b1.addEventListener('click', function (event) {
    event.preventDefault();
    addname1();
    b1.innerHTML = "Registered"
});



//candidate 2
console.log("scripts working");


const name2input = document.getElementById("can2input");
const name2output = document.getElementById("can2output");
const b2 = document.getElementById("register-for-candidate2");

// Retrieve the candidate's name from localStorage
const storedCandidateName2 = localStorage.getItem('candidateName2');
if (storedCandidateName2) {
    name2output.innerHTML = storedCandidateName2;
}

let nameSet2 = !!storedCandidateName2; // Check if the name has been set previously

function addname2() {
    if (!nameSet2) {
        const candidateName2 = name2input.value;
        name2output.innerHTML = candidateName2;

        // Store the candidate's name in localStorage
        localStorage.setItem('candidateName2', candidateName2);

        nameSet2 = true;
    }
}
// #02
// function vote2() {
//     // Your vote function logic goes here
//     nameSet2 = false
// }

b2.addEventListener('click', function (event) {
    event.preventDefault();
    addname2();
    b2.innerHTML = "Registered"

});

//Reset after results
// Function to remove the candidate's name from localStorage
function removeCandidateName1() {
    localStorage.removeItem('candidateName1');
    name1output.innerHTML = ""; // Clear the displayed name
    nameSet = false; // Reset the flag
}

// Function to remove the candidate's name from localStorage
function removeCandidateName2() {
    localStorage.removeItem('candidateName2');
    name2output.innerHTML = ""; // Clear the displayed name
    nameSet2 = false; // Reset the flag
}

//timestamp problem
const btime = document.getElementById("timebutton");


let timestamp

// document.getElementById("timeout").textContent = "Timestamp is " + timestamp;
btime.addEventListener('click', function (event) {
    event.preventDefault();
    // Get date and time values from the form
    const dateValue = document.getElementById("date").value;
    const timeValue = document.getElementById("time").value;

    // Concatenate date and time strings into a single string in ISO 8601 format
    const datetimeString = dateValue + "T" + timeValue;

    // Convert the concatenated string to a Date object
    const datetime = new Date(datetimeString);

    // Get the Unix timestamp (in milliseconds) from the Date object and convert it to seconds
    timestamp = Math.floor(datetime.getTime() / 1000);
    btime.innerHTML = "Done"


});
const currentUnixTimestamp = Math.floor(Date.now() / 1000);
if (currentUnixTimestamp > timestamp) {
    timestamp = 0;
    alert("Enter time exceeding current Value")
}

const reset = document.getElementById("reset")
reset.onclick = localStorage.clear();



//--------------------------------------------------------------------------------------------
//solidity contract functions connect (integration of contract and website)

//broo functions call bhi to krne h !!
function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}

//setter ec
const ec = document.getElementById("ec")
ec.onclick = setElectionOfficer
async function setElectionOfficer() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const address = await signer.getAddress();

        try {
            const transactionResponse = await contract.setElectionOfficer()
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("ec set")
            ec.innerHTML = `Registered as EC : ${address}`
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("install metamask // error setEc")
    }
}

//setter can1
const registerforcandidate1 = document.getElementById("register-for-candidate1")
registerforcandidate1.onclick = setCan1
async function setCan1() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const address = await signer.getAddress();

        try {
            const transactionResponse = await contract.setCan1()
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("can 1 set")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("install metamask // can 1 error")
    }
}

//setter can2
const registerforcandidate2 = document.getElementById("register-for-candidate2")
registerforcandidate2.onclick = setCan2

async function setCan2() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const address = await signer.getAddress();

        try {
            const transactionResponse = await contract.setCan2()
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("can 2 set")
        } catch (error) {
            console.log(error)
        }
    } else {
        console.log("install metamask // can 2 error")
    }
}


//set maxtime
const timestampbutton = document.getElementById("timebutton")
timestampbutton.onclick = setMaxTime
async function setMaxTime() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.setMaxTime(timestamp)
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("timestamp done")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask // setMaxTime"
    }
}




//results have to be called and can be seen by anyone 
const resultButton = document.getElementById("resultButton")
resultButton.onclick = results

async function results() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.results()
            console.log(transactionResponse)
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask // results"
    }
}

//voting
let voteValue
document.getElementById("voteButton").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    voteValue = document.getElementById("vote").value.trim();

    if (voteValue === "1" || voteValue === "2") {
        console.log("Vote submitted:", voteValue);
    } else {
        alert("Please enter either '1' or '2' for your vote.");
    }
});

const voteButton = document.getElementById("voteButton")
voteButton.onclick = vote

async function vote() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.vote(voteValue)
            await listenForTransactionMine(transactionResponse, provider)
            await console.log("u voted")
        } catch (error) {
            console.log(error)
        }
    } else {
        fundButton.innerHTML = "Please install MetaMask // vote"
    }
}


//Reset Function
//pehla smart contract mein values reset krni h -> needed??
//reset function apne aap call hojayega when results will  be published

//yeh registered candidates k naam n all from index.html
const resetButton = document.getElementById("reset")
resetButton.onclick = resetStorage
function resetStorage() {
    localStorage.clear();
}