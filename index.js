const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

//classes

class Inventory{
  //we used the constructor to create an empty array to hold items
  constructor (){
this.itemList = []
  } 
  //the list will display the inventory to the console
list(){
if(this.itemList.length === 0){
console.log("Nothing")
return
}
this.itemList.forEach((item)=>console.log(item))
} 
//the drop function removes an item from the inventory
drop(toDrop){
let dropIndex = this.itemList.indexOf(toDrop)
if(dropIndex === -1){
console.log("There is no "+ toDrop)
} else{
  let dropItem = this.itemList[dropIndex]
  this.itemList.splice(dropIndex,1)
  return dropItem
}


}
}

class Room{
  //constructor takes room name, and a description string, and sets up empty connections and inventory
  constructor(name, description){
      this.name = name;
      this.description = description;
      this.north = false;
      this.east = false;
      this.south = false;
      this.west = false;
      this.other = false;
      this.doors = 0;
      this.lock = [false,false,false,false];
      this.inv = new Inventory();
  }
  //add connection takes a direction and room, and optional locking data
  //lockedArray is optional, but if present should be two strings
  //lockedArray[0] should be the item to unlock with
  //lockedArray[1] should be the text when trying to open without the key item
  addConnection(direction, otherRoom, lockedArray){
      //add connections to appropriate directions
      switch(direction){
          case 'north':
              this.doors++;
              otherRoom.doors++;
              this.north = otherRoom;
              otherRoom.south = this;
              if(lockedArray){
                  this.lock[0] = lockedArray;
              }
              break;
          case 'east':
              this.doors++;
              otherRoom.doors++;
              this.east = otherRoom;
              otherRoom.west = this;
              if(lockedArray){
                  this.lock[1] = lockedArray;
              }
              break;
          case 'south':
              this.doors++;
              otherRoom.doors++;
              this.south = otherRoom;
              otherRoom.north = this;
              if(lockedArray){
                  this.lock[2] = lockedArray;
              }
              break;
          case 'west':
              this.doors++;
              otherRoom.doors++;
              this.west = otherRoom;
              otherRoom.east = this;
              if(lockedArray){
                  this.lock[3] = lockedArray;
              }
              break;
          case 'other':
              this.other = otherRoom;
              otherRoom.other = this;
              if(lockedArray){
                  this.lock[4] = lockedArray;
              }
              break;
          //if invalid direction, throw an error
          default:
              throw 'tried to add room connection with invalid direction';
      }
  }
}

//functions

 //parse input takes a string of player input and turns it into an action
 function parseInput(inputString){
   //trim input and turn it into an array
  inputString = inputString.trim().toLowerCase();
  let inputArr = inputString.split(' ');
  //look at the first word to determine the action type
  switch(inputArr[0]){
    //if second word doesn't exit, ask what to perform action on
      case 'open':
          if(inputArr[1] === undefined){
              console.log(inputArr[0] + ' what?');
              break;
          }
          //handle unique cases
          //open box to find ladder
          if(inputArr[1] === 'box' && player.currentRoom.inv.itemList.includes('box')){
            console.log('You open the box and find a ladder inside.');
            player.currentRoom.inv.drop('box');
            player.currentRoom.inv.itemList.push('ladder');
            break;
          }
          //if player input "direction door" instead of "door direction" swap inputArr[1] and [2]
          if(inputArr[2] === 'door' && (inputArr[1] === 'north' || inputArr[1] === 'east' || inputArr[1] === 'south' || inputArr[1] === 'west')){
            inputArr[2] = inputArr[1];
            inputArr[1] = 'door';
          }
          //open final door to win game
          if(player.currentRoom.name === 'Aboveground Room' && inputArr[1] === 'door'){
            if(player.inv.itemList.includes('key')){
              console.log('You unlock the door and go through. The fresh air of the outdoors is a welcome change after having been trapped underground.')
              console.log('Congratulations! You Win!');
              process.exit();
            }else{
              console.log('The door is locked.');
              break;
            }
          }
          //handle opening doors
          if(inputArr[1] === 'door'){
            if(player.currentRoom.doors === 0){
              console.log('This room has no doors.');
              break;
            }
            //make sure direction given has door
            if(inputArr[2] === 'north' || inputArr[2] === 'east' || inputArr[2] === 'south' || inputArr[2] === 'west'){
              if(!player.currentRoom[inputArr[2]]){
                console.log('There is no door on the ' + inputArr[2] + ' wall.');
                break;
              }
            }
            let doorDirection = undefined;
            let lockNum = -1;
            //handle rooms with multiple doors
            if(player.currentRoom.doors > 1){
              if(inputArr[2] === 'north'){
                doorDirection = inputArr[2];
                lockNum = 0;
              }else if(inputArr[2] === 'east'){
                doorDirection = inputArr[2];
                lockNum = 1;
              }else if(inputArr[2] === 'south'){
                doorDirection = inputArr[2];
                lockNum = 2;
              }else if(inputArr[2] === 'west'){
                doorDirection = inputArr[2];
                lockNum = 3;
              }else{
                console.log('Open which door?');
                break;
              }
            }else{
              //find the direction of the door in a room with one door
              if(player.currentRoom.north){
                doorDirection = 'north';
                lockNum = 0;
              }else if(player.currentRoom.east){
                doorDirection = 'east';
                lockNum = 1;
              }else if(player.currentRoom.south){
                doorDirection = 'south';
                lockNum = 2;
              }else if(player.currentRoom.west){
                doorDirection = 'west';
                lockNum = 3;
              }
            }
            //check if door is locked
            if(player.currentRoom.lock[lockNum]){
              if(player.inv.itemList.includes(player.currentRoom.lock[lockNum][0])){
                player.inv.drop(player.currentRoom.lock[lockNum][0]);
                console.log('You use the ' + player.currentRoom.lock[lockNum][0] + ' and move to the next room');
                player.currentRoom.lock[lockNum] = false;
              }else{
                console.log(player.currentRoom.lock[lockNum][1]);
                break;
              }
            }
            //change rooms
            let doorCloseText = 'You enter the new room closing the ';
            if(doorDirection === 'north'){
              doorCloseText += 'south door behind you.';
            }else if(doorDirection === 'east'){
              doorCloseText += 'west door behind you.';
            }else if(doorDirection === 'south'){
              doorCloseText += 'north door behind you.';
            }else if(doorDirection === 'west'){
              doorCloseText += 'east door behind you.';
            }
            console.log(doorCloseText);
            player.currentRoom = player.currentRoom[doorDirection];
            console.log(player.currentRoom.description);
            break;
          }
          //handle invalid second words
          console.log(inputArr[0] + ' what?');
          break;
      case 'climb':
          //check if there is a connection in the other slot
          if(!player.currentRoom.other){
            console.log('There is nothing to climb here.');
            break;
          }
          //check if the connection is locked
          if(player.currentRoom.lock[4]){
            //if player or room inventories has unlock item, unlock, else print locked text
            if(player.inv.itemList.includes(player.currentRoom.lock[4][0])){
              player.currentRoom.lock[4] = false;
              player.inv.drop('ladder');
              player.currentRoom.description += " A ladder has been placed to allow you to climb despite the broken stairs."
            }else if(player.currentRoom.inv.itemList.includes(player.currentRoom.lock[4][0])){
              player.currentRoom.lock[4] = false;
              player.currentRoom.inv.drop('ladder');
              player.currentRoom.description += " A ladder has been placed to allow you to climb despite the broken stairs."
            }else{
              console.log(player.currentRoom.lock[4][1]);
              break;
            }
          }
          //change rooms
          player.currentRoom = player.currentRoom.other;
          console.log(player.currentRoom.description);
          break;
      case 'examine':
          if(inputArr[1] === undefined){
              console.log(inputArr[0] + ' what?');
              break;
          }
          //examine room, get description again, find doors, and view room inventory
          if(inputArr[1] === 'room' || inputArr[1] === player.currentRoom.name.toLowerCase() || inputArr[1] + ' ' + inputArr[2] === player.currentRoom.name.toLowerCase()){
            console.log(player.currentRoom.description);
            if(player.currentRoom.doors > 0){
              let doorString = "There is a door on the ";
              let directionString = '';
              if(player.currentRoom.north){
                directionString += 'north';
              }
              if(player.currentRoom.east){
                if(directionString === ''){
                  directionString += 'east';
                }else{
                  directionString += ', east';
                }
              }
              if(player.currentRoom.south){
                if(directionString === ''){
                  directionString += 'south';
                }else{
                  directionString += ', south';
                }
              }
              if(player.currentRoom.west){
                if(directionString === ''){
                  directionString += 'west';
                }else{
                  directionString += ', west';
                }
              }
              doorString += directionString + ' wall.';
              if(player.currentRoom.doors > 1){
                doorString = doorString.replace('is a door', 'are doors');
                doorString = doorString.replace('wall','walls');
                doorString = doorString.slice(0, doorString.lastIndexOf(',') + 1) + ' and' + doorString.slice(doorString.lastIndexOf(',') + 1);
              }
              console.log(doorString);
            }
            console.log('You check the ground and find: ');
            player.currentRoom.inv.list();
            break;
          }
          //view player inventory
          if(inputArr[1] === 'inventory'){
            console.log('Your inventory currently contains: ');
            player.inv.list();
            break;
          }
          //room specific examine targets
          //broken staircase in room 3
          if(player.currentRoom.name === 'Stairwell Up' && (inputArr[1] === 'staircase' || inputArr[1] === 'stairs' || inputArr[1] === 'rubble' || inputArr[1] === 'stairwell')){
            if(room2.lock[3] && !player.inv.itemList.includes('key') && !room1.inv.itemList.includes('key') && !room2.inv.itemList.includes('key') && !room3.inv.itemList.includes('key')){
              console.log('You check the rubble left by the broken staircase and discover a key hidden within.');
              room3.inv.itemList.push('key');
              break;
            }else{
              console.log('You check the rubble again, but there is nothing of interest left.');
              break;
            }
          }
          //hole in room 4
          if(player.currentRoom.name === 'Stairwell Down' && inputArr[1] === 'hole'){
            console.log('You check the hole and though it is much too small to enter you think you see small eyes and hear squeaking.');
            break;
          }
          //windows in room 6
          if(player.currentRoom.name === 'Aboveground Room' && (inputArr[1] === 'window' || inputArr[1] === 'windows')){
            console.log('You gaze longingly at the greenery outside.');
            break;
          }
          //doors and stairs
          if(inputArr[1] === 'door'){
            if(player.currentRoom.doors > 0){
              console.log("It's a door made of heavy wood and iron.");
              break;
            }else if(player.currentRoom.name === 'Aboveground Room'){
              console.log("It's the last thing between you and fresh air.");
              break;
            }else{
              console.log('This room has no doors.');
              break;
            }
          }
          if(inputArr[1] === 'staircase' || inputArr[1] === 'stairs' || inputArr[1] === 'stairwell'){
            if(player.currentRoom.name === 'Aboveground Room' || player.currentRoom.name === 'Stairwell Down'){
              console.log("The stairs head downwards.");
              break;
            }else if(player.currentRoom.name === 'Basement'){
              console.log('The stairs head upwards.');
              break;
            }else{
              console.log('There are no stairs in this room.');
              break;
            }
          }
          //items
          if(inputArr[1] === 'key' && (player.inv.itemList.includes(inputArr[1]) || player.currentRoom.inv.itemList.includes(inputArr[1]))){
            console.log("It's shiny despite the small patches of rust. Perhaps it can unlock something?");
            break;
          }
          if(inputArr[1] === 'box' &&  player.currentRoom.inv.itemList.includes(inputArr[1])){
            console.log("A box that's much too large to move. Maybe it contains some sort of treasure!");
            break;
          }
          if(inputArr[1] === 'ladder' && (player.inv.itemList.includes(inputArr[1]) || player.currentRoom.inv.itemList.includes(inputArr[1]))){
            console.log('A ladder you found in a box. Is there somewhere you can reach with it?');
            break;
          }
          if(inputArr[1] === 'cheese' && (player.inv.itemList.includes(inputArr[1]) || player.currentRoom.inv.itemList.includes(inputArr[1]))){
            console.log("A small piece of old cheese. It stinks a little...");
            break;
          }
          //if invalid examine target, find nothing
          console.log('You find nothing of interest.');
          break;
      case 'take':
          if(inputArr[1] === undefined){
              console.log(inputArr[0] + ' what?');
              break;
          }
          //make sure item exists and take it, if it's not a box
          let itemToTake = undefined;
          if(itemToTake = player.currentRoom.inv.drop(inputArr[1])){
              switch(inputArr[1]){
                  case 'box':
                      console.log("You can't carry that!");
                      player.currentRoom.inv.itemList.push(itemToTake);
                      break;
                  default:
                      console.log("You took the " + inputArr[1]);
                      player.inv.itemList.push(itemToTake);
              }
          }
          break;
      case 'drop':
          if(inputArr[1] === undefined){
              console.log(inputArr[0] + ' what?');
              break;
          }
          //make sure item exists, and put it in the room inventory
          let itemToDrop = undefined;
          if(itemToDrop = player.inv.drop(inputArr[1])){
            player.currentRoom.inv.itemList.push(itemToDrop);
            console.log('You dropped the ' + itemToDrop);
          }
          //check if cheese is dropped in room 4
          if(player.currentRoom.name === "Stairwell Down" && itemToDrop === "cheese"){
            console.log('As soon as you drop the cheese, a rat shoots out of the hole dragging something shiny behind it. It grabs the cheese and returns to the hole, but it leaves a key behind.');
            room4.inv.drop('cheese');
            room4.inv.itemList.push('key');
          }
          break;
      case 'help':
          console.log('Valid actions are open, climb, examine, take, and drop');
          console.log('Make sure to say what to take action on.')
          console.log('If you want to open a door in a room with multiple doors, make sure to give a complete compass direction after door.');
          console.log('Room and inventory are valid targets to examine.');
          break;
          //if word is not valid action, say I don't know how to do it
      default:
          console.log("I don't know how to " + inputArr[0]);
          break;
  }
}

async function start() {
  console.log('Type help for a list of commands.')
  console.log(player.currentRoom.description);
  while(true){
    console.log('');
    console.log('Current Room - ' + player.currentRoom.name);
    parseInput(await ask('>_'));
  }
}

//begin code execution

//setup rooms
let room1 = new Room ("Starting Room", "You are in a square room of carved stone with wooden supports. It is dimly lit by candles on the walls and you can see some cobwebs in the corners.") 
let room2 = new Room ("Main Room", "You are in a large room of carved stone with arched ceilings. The walls have large patches that are discolored by mold and water damage, and the air is stagnant.")
let room3 = new Room ("Stairwell Up", "You are in a small room with a broken staircase going up. Too much has collapsed to be able to climb it, but who knows what you might find in the rubble?")
let room4 = new Room ("Stairwell Down", "You are in a room of carved stone with a staircase going down. You can see a hole in the wall in one of the corners.")
let room5 = new Room ("Basement", "You are in a large room that is poorly lit. It looks to have been used as a storeroom in the past. There is a staircase going up.") 
let room6 = new Room ("Aboveground Room", "You are in a wooden room with small windows. You can see the outdoors through them. There is a door with a heavy padlock on it. There is a broken staircase going down, with a ladder placed to allow you to climb it anyway.")
//setting up room inventories
room5.inv.itemList.push("box")
room6.inv.itemList.push("cheese")
//setting up room connections
room1.addConnection("north", room2)
room2.addConnection("north", room3)
room2.addConnection("west", room4, ["key", "The door is locked, you need to find a key."])
room3.addConnection("other", room6, ["ladder", "The stairs are too broken to climb"]) 
room4.addConnection("other", room5)
//setting up player object
let player = {
  currentRoom : room1,
  inv : new Inventory()
 } 

 //start game loop
start();