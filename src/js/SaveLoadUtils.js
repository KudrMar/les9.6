import Item from "./Item";


export default class SaveLoadUtils {
  
  static save() {
    const column = document.querySelectorAll('.column');
    column.forEach((element) => {
      const content = element.querySelectorAll('.content-item-text');
      const arrayOfValues = [];
      for (const valueText of content) {
        arrayOfValues.push(valueText.textContent);
      }
      if (element.id === 'todo') {
        localStorage.setItem("todo", JSON.stringify(arrayOfValues));
      } else if (element.id === 'inProgress') {
        localStorage.setItem("inProgress", JSON.stringify(arrayOfValues));
      } else if (element.id === 'done') {
        localStorage.setItem("done", JSON.stringify(arrayOfValues));
      }
    })
  };

  static load(trello) {
    const columns = ['todo', 'inProgress', 'done'];

    columns.forEach(columnID => {
      if (localStorage.getItem(columnID) !== null) {
        const items = JSON.parse(localStorage.getItem(columnID));
        items.forEach(item => {
          columnID = columnID;
          const columnContent = document.getElementById(columnID).querySelector('.column-content');
          Item.addTextElement(item, columnContent);
        });
      }
    });
  }
}


