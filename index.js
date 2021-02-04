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
