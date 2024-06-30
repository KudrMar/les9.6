export default class Item {

    static addTextElement(itemValue, columnContent) {
        const newItem = document.createElement("div");
        newItem.classList.add("content-item");
        columnContent.appendChild(newItem);

        const newItemText = document.createElement("div");
        newItemText.textContent = itemValue;
        newItemText.classList.add("content-item-text");
        newItem.appendChild(newItemText);

        const newItemDel = document.createElement("div");
        newItemDel.innerHTML = '&#x2718';
        newItemDel.classList.add("content-item-del");
        newItemDel.classList.add("content-item-del-hide");
        newItem.appendChild(newItemDel);
    }
    static addEmptyElement(itemValue, columnContent) {
        const newItem = document.createElement("div");
        newItem.classList.add("empty-item");
        const rectActualElement = itemValue.getBoundingClientRect();
        newItem.style.height = rectActualElement.height + 'px';
        if (columnContent.classList.contains('content-item')) {
            columnContent.parentElement.insertBefore(newItem, columnContent);
        } else {
            const column = columnContent.querySelector('.column-content');
            if (column) {
            column.appendChild(newItem);
            }
        }
       
        return newItem;
    }
}