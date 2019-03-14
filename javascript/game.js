$(document).ready(function() {

var heroSelected = false;
var gameStarted = false;
var enemySelected = false;
var userHero = {};
var enemyHero = {};
var heroAP = 0;
var heroHP= 0;
var enemyHP = 0;
var heroes = [];
var gameOver = false;

var obi = {
    name:"Obi Wan Kenobi",
    hp: 120,
    baseAttack: 8,
    counterAttack: 50,
    forceType: "Light",
    lvlUp: function(curAP){
       let newAP= (this.baseAttack  +  curAP);
        return newAP;
    }
}
var luke = {
    name:"Luke Skywalker",
    hp: 100,
    baseAttack: 25,
    counterAttack: 5,
    forceType: "Light",
    lvlUp: function(curAP){
        let newAP= (this.baseAttack  +  curAP);
         return newAP;
     }
}
var insidious = {
    name:"Darth Insidious",
    hp: 90,
    baseAttack: 20,
    counterAttack: 10,
    forceType: "Dark",
    lvlUp: function(curAP){
        let newAP= (this.baseAttack  +  curAP);
         return newAP;
     }
}
var maul = {
    name:"Darth Maul",
    hp: 180,
    baseAttack: 16,
    counterAttack: 26,
    forceType: "Dark",
    lvlUp: function(curAP){
        let newAP= (this.baseAttack  +  curAP);
         return newAP;
     }
}

heroes.push(obi);
heroes.push(luke);
heroes.push(insidious);
heroes.push(maul);

buildHeroes(heroes);

//clicking a hero will either be to set initial hero or to select a defender. 
$(".heroObj").on("click", function(){
    var eleId = $(this).attr("id");
    console.log(eleId);
    if (!heroSelected){
        heroSelected = true;
  userHero = getHeroInfo(eleId);
  heroAP = userHero.baseAttack;
  heroHP = userHero.hp;
  
  $("#playerCharText").text("Your Selected Champion: " + userHero.name);
  $("#enemySelectPrompt").text("Challenge an enemy:");
  console.log("User is: " + userHero.name);
    } else {
        //if hero is selected, check if enemy is selected/inplay. If not, set as enemy, else, ignore as cur enemy not defeated. 
  if (!enemySelected){
    $("#combatEntries").empty();
      enemySelected = true;
       enemyHero = getHeroInfo(eleId);
       enemyHP = enemyHero.hp;
      console.log("Enemy is: " + enemyHero.name);
      $("#enemyCharText").text("Enemy is: " + enemyHero.name);
      $('#attButton').attr("style","visibility:visible");

  } else { 
      alert("Must defeat current selected enemy first!");
  }
    }
});

$("#attButton").on("click", function(){
    $("#combatEntries").empty();
//need to first have user attack defender using attack and subbing enemy hp, then counter and sub user hp, evaluate, lvl up if still alive. 
var res = enemyHP - heroAP;
var userRes = heroHP - enemyHero.counterAttack;

if (res <=0){
//beat enemy, clear cur enemy and remove from defender section, print output.

enemySelected = false;
let str = "You defeated " + enemyHero.name + '! Your strength grows. Select another enemy to continue.';
addCombatText(str);

} else if (userRes <= 0) {
//lost to enemy, print output, game over, make reset button available.
gameOver = true;
$('#resetButton').attr("style","visibility:visible");

} else {
//apply changes to hp, print output, await next attack. 
heroHP = parseInt(userRes);
enemyHP = parseInt(res);

let str = "You attacked " + enemyHero.name + "for " + heroAP +  " damage.";
let str2 = enemyHero.name + " attacked you back for " + enemyHero.counterAttack + " damage!";
addCombatText(str);
addCombatText('');
addCombatText(str2);
heroAP = userHero.lvlUp(heroAP);
}

    
});

$("#resetButton").on("click", function(){
gameOver = false;
userHero = {};
enemyHero = {};
heroHP = 0;
enemyHP = 0;
heroAP = 0;
heroSelected = false;
enemySelected = false;
$(".heroObj").detach();
buildHeroes(heroes);
});



//We need to allow user to click on a name and then have that be their hero, which means we need to remove from hero
//array (as we will be iterating through it in battles)
//Need to set their user object. let's try that and try modifying it below. 
function addCombatText(str){
    let combText = $('<div>');
combText.attr("id", "combatText");
// combText.attr("class", "heroObj");
// heroDiv.attr("value", );
combText.text(str);
combText.appendTo("#combatEntries");
}

function getHeroInfo(heroId){
    for (j=0; j < heroes.length; j++){
        if (heroId === heroes[j].name){
            return heroes[j];
            
        }
    }
}

function buildHeroes(arr){
    for (i=0; i < arr.length; i++){
        var heroDiv = $('<div>');
        heroDiv.attr("id", arr[i].name);
        heroDiv.attr("class", "heroObj");
        // heroDiv.attr("value", );
        heroDiv.text(arr[i].name);
        heroDiv.appendTo("#heroBlocks");
        }
}
});