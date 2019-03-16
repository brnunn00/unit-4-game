$(document).ready(function () {

    var heroSelected = false;
    var gameStarted = false;
    var enemySelected = false;
    var userHero = {};
    var enemyHero = {};
    var heroAP = 0;
    var heroHP = 0;
    var enemyHP = 0;
    var heroes = [];
    var heroesRemain = [];
    var heroesLeft = 0;
    var gameOver = false;
    var heroId;
    var curEnemyId;
    var loseAudio = new Audio("audio/no.wav");

    var obi = {
        name: "Obi Wan Kenobi",
        hp: 115,
        baseAttack: 8,
        counterAttack: 30,
        forceType: "Light",
        sourceImg: "images/obi-young.jpg",
        audio: new Audio("audio/obiwan.wav"),
        lvlUp: function (curAP) {
            let newAP = (this.baseAttack + curAP);
            return newAP;
        }
    }
    var luke = {
        name: "Luke Skywalker",
        hp:100,
        baseAttack: 25,
        counterAttack: 5,
        audio: new Audio("audio/luke.wav"),
        forceType: "Light",
        sourceImg: "images/luke.png",
        lvlUp: function (curAP) {
            let newAP = (this.baseAttack + curAP);
            return newAP;
        }
    }
    var insidious = {
        name: "Darth Sidious",
        hp: 80,
        baseAttack: 30,
        counterAttack: 18,
        forceType: "Dark",
        sourceImg: "images/emp.png",
        audio: new Audio("audio/power.wav"),
        lvlUp: function (curAP) {
            let newAP = (this.baseAttack + curAP);
            return newAP;
        }
    }
    var maul = {
        name: "Darth Maul",
        hp: 140,
        baseAttack: 7,
        counterAttack: 10,
        audio: new Audio("audio/maul.wav"),
        sourceImg: "images/maul.png",
        forceType: "Dark",
        lvlUp: function (curAP) {
            let newAP = (this.baseAttack + curAP);
            return newAP;
        }
    }

    heroes.push(obi);
    heroes.push(luke);
    heroes.push(insidious);
    heroes.push(maul);

    buildHeroes(heroes);
    heroesLeft = heroes.length - 1;

    //clicking a hero will either be to set initial hero or to select a defender. 
    $(document.body).on('click', '.heroObj', function () {
        var eleId = $(this).val();


        console.log($(this).val());
        if (!heroSelected) {
           
            heroId = $(this).attr("id");
            heroSelected = true;
            userHero = getHeroInfo(eleId);
            userHero.audio.play();
            setHero($("#" + heroId));
            heroAP = userHero.baseAttack;
            heroHP = userHero.hp;

            $("#playerCharText").text("Your Selected Champion: " + userHero.name);
            $("#enemySelectPrompt").text("Challenge an enemy:");
            setEnemies();
        } else {
            //if hero is selected, check if enemy is selected/inplay. If not, set as enemy, else, ignore as cur enemy not defeated. 

            if (!enemySelected) {
                curEnemyId = $(this).attr("id");
                if (curEnemyId == heroId) {
                    alert("Pick something else! You cannot attack yourself!");

                } else {
                    $("#combatEntries").empty();
                    $("#enemySelectPrompt").text("Attack when ready. May the force be with you.");
                    enemySelected = true;
                    enemyHero = getHeroInfo(eleId);
                    setDefender($("#" + curEnemyId));
                    enemyHP = enemyHero.hp;
                    console.log("Enemy is: " + enemyHero.name);
                    $("#enemyCharText").text("Enemy is: " + enemyHero.name);
                    $('#attButton').attr("style", "visibility:visible");
                }
            } else {

                alert("Must defeat current selected enemy! Use the attack button!");
            }
        }
    });

//Attack button execution
    $("#attButton").on("click", function () {

        //need to first have user attack defender using attack and subbing enemy hp, then counter and sub user hp, evaluate, lvl up if still alive. 
        if (gameOver || !enemySelected) { return; }
        $("#combatEntries").empty();
        var res = enemyHP - heroAP;
        console.log('hero hp' + heroHP + ' enemy CounterATT' + enemyHero.counterAttack);
        var userRes = heroHP - enemyHero.counterAttack;

        //there is probably an easier way to do this. Please let me know.
        $("#" + heroId + "Text").text("HP: " + userRes);
        $("#" + curEnemyId + "Text").text("HP: " + res);
        if (res <= 0 && userRes > 0) {
            //beat enemy, clear cur enemy and remove from defender section, print output.
            heroHP = parseInt(userRes);
            enemySelected = false;
            $('#attButton').attr("style", "visibility:hidden");


            heroesLeft--;
            console.log(heroesLeft);
            if (heroesLeft == 0) {
                $("#enemySelectPrompt").text("You are the ultimate force in the galaxy!");
                
                gameIsOver('win');
            } else {

                $("#enemySelectPrompt").text("Select another enemy to continue.");
                let str = "You defeated " + enemyHero.name + '! Your strength grows. Select another enemy to continue.';
                heroAP = userHero.lvlUp(heroAP);

                addCombatText(str);
                $("#" + curEnemyId).detach();
            }

        } else if (userRes <= 0 && res <=0) {
            //lost to enemy, print output, game over, make reset button available.
            let str = "You attacked " + enemyHero.name + " for " + heroAP + " damage.";

            let str2 = enemyHero.name + " is defeated, but his counterattack lands for " + enemyHero.counterAttack + " damage!";
            let str3 = "You suffered a mortal wound and succumb to your injuries.";
            addCombatText(str);
            addCombatText(str2);
            addCombatText(str3);
            gameIsOver('lose');

        } else if ( userRes <=0){
            let str = "You attacked " + enemyHero.name + " for " + heroAP + " damage.";

            let str2 = enemyHero.name + " laughs at your pitiful attempt as he hits you for " + enemyHero.counterAttack + " damage!";
            let str3 = "You suffered a mortal wound and succumb to your injuries.";
            addCombatText(str);
            addCombatText(str2);
            addCombatText(str3);
            gameIsOver('lose');
        } else {
            //apply changes to hp, print output, await next attack. 
            heroHP = parseInt(userRes);
            enemyHP = parseInt(res);

            let str = "You attacked " + enemyHero.name + " for " + heroAP + " damage.";
            let str2 = enemyHero.name + " attacked you back for " + enemyHero.counterAttack + " damage!";
            addCombatText(str);
            addCombatText('');
            addCombatText(str2);
            heroAP = userHero.lvlUp(heroAP);
        }


    });

    $("#resetButton").on("click", function () {
        $("#combatEntries").empty();
        gameOver = false;
        userHero = {};
        enemyHero = {};
        heroHP = 0;
        enemyHP = 0;
        heroAP = 0;
        heroSelected = false;
        enemySelected = false;
        heroesLeft = heroes.length - 1;
        $("#enemySelectPrompt").text('');
        $("#enemyCharText").text('');
        $("#playerCharText").text('Select a Champion');
        $(".heroObj").detach();
        $('#resetButton').attr("style", "visibility:hidden");
        $('#attButton').attr("style", "visibility:hidden");
       
        buildHeroes(heroes);
    });




    function gameIsOver(outcome) {
        gameOver = true;
        if (outcome == "lose"){
            $('.combatText').each(function(i) {
            $(this).attr("style", "color:red");
            if (userHero.forceType ==="Light"){
         $("#enemySelectPrompt").text("Trust the force, the light side must prevail!");
            }else {
            $("#enemySelectPrompt").text("The power of the dark side has failed you. This cannot be!");
            }
            });
loseAudio.play();
        } else {
            $("#enemySelectPrompt").text("You are the ultimate force in the galaxy!");

        }
        let str = "You " + outcome + "! Reset to play again";
        addCombatText(str);
        $('#resetButton').attr("style", "visibility:visible");
        $('#attButton').attr("style", "visibility:hidden");
       

    }

    //We need to allow user to click on a name and then have that be their hero, which means we need to remove from hero
    //array (as we will be iterating through it in battles)
    //Need to set their user object. let's try that and try modifying it below. 
    function addCombatText(str) {
        let combText = $('<div>');
        combText.attr("class", "combatText");

        // combText.attr("class", "heroObj");
        // heroDiv.attr("value", );
        combText.text(str);
        combText.appendTo("#combatEntries");
    }

    function getHeroInfo(heroId) {
        for (j = 0; j < heroes.length; j++) {
            if (heroId === heroes[j].name) {
                return heroes[j];

            }
        }
    }

    function buildHeroes(arr) {
        for (i = 0; i < arr.length; i++) {
            var heroDiv = $('<div>');
            heroDiv.attr("id", 'hero' + i);
            heroDiv.attr("class", "heroObj");
            heroDiv.val(arr[i].name);
            heroDiv.text(arr[i].name);

            heroDiv.appendTo("#heroList");

            var heroImg = $('<img>');
            heroImg.attr("src", arr[i].sourceImg);
            heroImg.attr("class", "heroImg");
            heroImg.appendTo("#hero" + i);

            var heroText = $('<div>');
            // heroText.attr("src","images/Luke_Skywalker.png")
            heroText.attr("class", "heroText");
            heroText.attr("id", "hero" + i + "Text");
            heroText.text("HP: " + arr[i].hp);
            heroText.appendTo("#hero" + i);

        }
    }

    function setDefender(ele) {
        ele.appendTo("#enemyHolder");
        // $(".heroText").attr('class', 'heroText enemy');
        var id = ele.attr("id");
        $('#' + id + 'Text').attr('class', 'heroText enemy');
        // ele.attr('class', 'heroObj enemy');
    }
    
    function setHero(ele) {
        ele.appendTo("#heroHolder");
    }

function setEnemies(){
    $(".heroObj").each(function(i) {
      if ($( this ).val() != userHero.name){
          $( this ).addClass("enemy");
          $(this).appendTo(".enemyBlocks");
      }
      });

}




});



