// --------------------------
// | Create the Game Object |
// --------------------------
const DataRecovery = function() {
    // ---------------------
    // | Private Variables |
    // ---------------------
    //Game Variables
    const numPages      = $(".page").length;
    let   currentPage   = 0;
    
    const numButtons   = 4;
    let   buttonValues = new Array(numButtons);
    //User Variables
    let winCount = 0, lossCount = 0;
    let targetAddr, currentAddr;

    // ------------------
    // | Start New Game |
    // ------------------
    this.startNewGame = function() {
        //Set Num values to Zero
        targetAddr  = 0;
        currentAddr = 0;

        //Assign a Value between 1 and 12 to each button
        for (let i = 0; i < numButtons; i++) {
            buttonValues[i] = randomInteger(1, 12);

            //Make a linear combination of the values and an integer between 1-6
            targetAddr += randomInteger(1, 6) * buttonValues[i];
        }

        //Ensure that the targetNum is between 19 and 120
        while (targetAddr < 19 || targetAddr > 120) {
            targetAddr = 0;

            for (let i = 0; i < numButtons; i++) {
                targetAddr += randomInteger(1, 6) * buttonValues[i];
            }
        }
    
    //Display in the browser
    displayCurrentPage();
    displayWinCount();
    displayLossCount();
    displayTargetAddr();
    displayCurrentAddr();
}

    // ----------------------
    // |  Display functions |
    // ----------------------
    function displayCurrentPage() {
        $(".page").css({"display": "none"});
        $(`.page:nth-of-type(${currentPage + 1})`).css({"display": "block"});
    }

    this.displayLightBox = function(lightBoxOn) {
        $("#lightBox_background, #lightBox").css({"display": (lightBoxOn ? "block" : "none")});
    }

    function displayWinCount() {
        $("#winCounter").text(winCount);
    }

    function displayLossCount() {
        $("#lossCounter").text(lossCount);
    }

    function displayTargetAddr() {
        $("#targetAddr").text(targetAddr);
    }

    function displayCurrentAddr() {
        $("#currentAddr").text(currentAddr);
    }

    // ------------------------
    // | Set Update Functions |
    // ------------------------
    this.updatePage = function(changeBy) {
        currentPage = (currentPage + changeBy + numPages) % numPages;

        displayCurrentPage();
    }

    function updateWinCount(changeBy) {
        winCount += changeBy;
    }

    function updateLossCount(changeBy) {
        lossCount += changeBy;
    }
    
    
    // ------------------
    // | Game Functions |
    // ------------------
    //Generate a random number between A and B
    function randomInteger(a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a;
    }

    this.buttonPress = function(index) {
        //Update the current num
        currentAddr += buttonValues[index];

        displayCurrentAddr();

        if (currentAddr < targetAddr) {
            return;        

        } else if (currentAddr === targetAddr) {
            updateWinCount(1);

            $("#outputMessage").html("Address Target Successful!<br>Data Recovered.<br>Click anywhere to continue.");
            $("#lightBox").css({
                "animation-name"  : "slide_down",
                "background-color": "var(--color-mint-green)"
            });

            this.displayLightBox(true);
            
            this.startNewGame();

        } else {
            updateLossCount(1);

            $("#outputMessage").html("Data Address Overshot! Data lost.<br>Click anywhere to continue.");
            $("#lightBox").css({
                "animation-name"  : "shake",
                "background-color": "var(--color-danger-red)"
            });

            this.displayLightBox(true);
            
            this.startNewGame();

        }
    }
}

// ------------------
// | Start New Game |
// ------------------
let game;

$(document).ready(function() {
    game = new DataRecovery();

    game.startNewGame();

    // ------------------------
    // | User Action Response |
    // ------------------------
    //Page Selection
    $(".page_prev").on("click", function() {
        game.updatePage(-1);
    });

    $(".page_next").on("click", function() {
        game.updatePage(1);
    });
    
    // Game mechanics
    $(".buttons").on("click", function() {
        game.buttonPress($(".buttons").index(this));
    });

    // LightBox
    $("#lightBox_background, #lightBox").on("click", function() {
        game.displayLightBox(false);
    });
});