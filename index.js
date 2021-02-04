const readline = require('readline');
const readlineInterface = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

class Inventory{
  //we used the constructor to create an empty array to hold items
  constructor (){
this.itemList = []
  } 
  //the list will display the inventory to the console
list(){
if(this.itemList.length === 0){
console.log("nothing")
return
}
this.itemList.forEach((item)=>console.log(item))
} 
//the drop function removes an item from the inventory
drop(toDrop){
let dropIndex = this.itemList.indexOf(toDrop)
if(dropIndex === -1){
console.log("there is no "+ toDrop)
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
    //increment door counter
      this.doors++;
      otherRoom.doors++;
      //add connections to appropriate directions
      switch(direction){
          case 'north':
              this.north = otherRoom;
              otherRoom.south = this;
              if(locked){
                  this.lock[0] = lockedArray;
              }
              break;
          case 'east':
              this.east = otherRoom;
              otherRoom.west = this;
              if(locked){
                  this.lock[1] = lockedArray;
              }
              break;
          case 'south':
              this.south = otherRoom;
              otherRoom.north = this;
              if(locked){
                  this.lock[2] = lockedArray;
              }
              break;
          case 'west':
              this.west = otherRoom;
              otherRoom.east = this;
              if(locked){
                  this.lock[3] = lockedArray;
              }
              break;
          case 'other':
              this.other = otherRoom;
              otherRoom.other = this;
              if(locked){
                  this.lock[4] = lockedArray;
              }
              break;
          //if invalid direction, throw an error
          default:
              throw 'tried to add room connection with invalid direction';
      }
  }
}

//setup rooms
let room1 = new Room ("Starting Room", "You are in a square room of carved stone with wooden supports. It is dimly lit by candles on the walls and you can see some cobwebs in the corners.") 
let room2 = new Room ("Main Room", "You are in a large room of carved stone with arched ceilings. The walls have large patches that are discolored by mold and water damage, and the air is stagnant.")
let room3 = new Room ("Stairwell Up", "You are in a small room with a broken staircase going up. Too much has collapsed to be able to climb it, but who knows what you might find in the rubble?")
let room4 = new Room ("Stairwell Down", "You are in a room of carved stone with a staircase going down. You can see a hole in the wall in one of the corners.")
let room5 = new Room ("Basement", "You are in a large room that is poorly lit. It looks to have been used as a storeroom in the past.") 
let room6 = new Room ("Aboveground Room", "You are in a wooden room with small windows. You can see the outdoors through them. There is a door with a heavy padlock on it.")
//setting up room inventories
room5.inv.itemList.push("box")
room6.inv.itemList.push("cheese")
//setting up room connections
room1.addConnection("north", room2)
room2.addConnection("north", room3)
room2.addConnection("west", room4, ["key", "The door is locked, you need to find a key."])
room3.addConnection("other", room6, ["ladder", "The stairs are to broken to climb"]) 
room4.addConnection("other", room5)
//setting up player object
let player = {
  currentRoom : room1,
  inv : new Inventory()
 } 


start();

async function start() {
  const welcomeMessage = `182 Main St.
You are standing on Main Street between Church and South Winooski.
There is a door here. A keypad sits on the handle.
On the door is a handwritten sign.`;
  let answer = await ask(welcomeMessage);
  console.log('Now write your code to make this work!');
  process.exit();
}
