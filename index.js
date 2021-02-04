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
