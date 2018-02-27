$(document).ready(function () {
    var characters = {
        "Luffy":{
            name: "Luffy",
            health: 120,
            attack: 8,
            imageUrl: "assets/images/luffy.jpg",
            enemeyAttackBack: 15
        },
        "Shanks":{
            name: "Shanks",
            health: 100,
            attack: 14,
            imageUrl: "assets/images/shanks.png",
            enemeyAttackBack: 5
        },
        "Black Beard":{
            name: "Black Beard",
            health: 150,
            attack: 8,
            imageUrl: "assets/images/blackbeard.png",
            enemeyAttackBack: 5
        },
        "Kaido":{
            name: "Kaido",
            health: 180,
            attack: 7,
            imageUrl: "assets/images/kaido.jpg",
            enemeyAttackBack: 25
        },
        "Big Mom":{
            name: "Big Mom",
            health: 140,
            attack: 8,
            imageUrl: "assets/images/bigmom.png",
            enemeyAttackBack: 10
        }
    };
    var currSelectedCharacter;
    var combatants = [];
    var currDefender;
    var turnCounter = 1;
    var killCount = 0;

    var renderOne = function(character, renderArea, charStatus){
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        charHealth = $("<div class ='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
        if (charStatus === "enemy"){
            $(charDiv).addClass("enemy");
        }
        else if(charStatus === "defender"){
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };

    var renderMessage = function(message) {
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        if (message === "clearMessage"){
            gameMessageSet.text("");
        }
    };

    var renderCharacters = function (charObj, areaRender) {
        if (areaRender === "#characterSection") {
            $(areaRender).empty();
            for (var key in charObj){
                if(charObj.hasOwnProperty(key)){
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }
        if (areaRender === "#selecedCharacter"){
            renderOne(charObj, areaRender, "");
        }
        if (areaRender === "#available-to-attack-section"){
            for(var i = 0; i < charObj.length; i++){
                renderOne(charObj[i], areaRender, "enemy");
            }
            $(document).on("click", ".enemy",function(){
                var name = ($(this).attr("data-name"));
                if($("#defender").children().length === 0){
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }
        if (areaRender === "#defender"){
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++){
                if(combatants[i].name === charObj){
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }
        if (areaRender === "playerDamage"){
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }
        if (areaRender === "enemyDamage"){
            $("#selecedCharacter").empty ();
            renderOne(charObj, "#selecedCharacter", "");
        }
        if (areaRender === "enemyDefeated"){
            $("#defender").empty();
            var gameStateMessage = ("You have defeated " + charObj.name + ", you can choose to fight another pirate.");
            renderMessage(gameStateMessage);
        }
    };

    var restartGame = function(inputEndGame){
        var restart = $("<button> Restart</button>").click(function(){
            location.reload();
        });

        var gameState = $("<div>").text(inputEndGame);
        $("body").append(gameState);
        $("body").append(restart);
    };
    
    renderCharacters(characters, "#characterSection");

    $(document).on("click", ".character", function() {
        var name = $(this).attr("data-name");
        if(!currSelectedCharacter){
            currSelectedCharacter = characters[name];
            for (var key in characters){
                if (key !== name){
                    combatants.push(characters[key]);
                }
            }
        console.log(combatants);
            $("#characterSection").hide();

            renderCharacters(currSelectedCharacter, "#selecedCharacter");
            renderCharacters(combatants,"#available-to-attack-section");
        }
    });
    $("#attack-button").on("click", function(){
        if ($("#defender").children().length !== 0){
            var attackMessage = ("You attacked " + currDefender.name + " for " +(currSelectedCharacter.attack * turnCounter) + " damage.");
            var counterAttackMessage =(currDefender.name + " attacked you back for " + currDefender.enemeyAttackBack + " damage.");
            renderMessage ("clearMessage");
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);
            if (currDefender.health > 0){
                renderCharacters(currDefender, "playerDamage");
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);
                currSelectedCharacter.health -= currDefender.enemeyAttackBack;
                renderCharacters(currSelectedCharacter, "enemyDamage");
                if (currSelectedCharacter.health <= 0){
                    renderMessage("clearMessage");
                    restartGame("You have been defeated... Game Over!");
                    $("#attack-button").unbind("click");
                }
            }
            else {
                renderCharacters(currDefender, "enemyDefeated");
                killCount++;
                if (killCount >= 4){
                    renderMessage("clearMessage");
                    restartGame("You're King of the Pirates!!!");
                }
            }
        }
        turnCounter++;
    });
});