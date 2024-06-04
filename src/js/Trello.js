"use strict";

export default class Trello {
    constructor() {
        this.addCard = document.querySelectorAll('.add-card');
        this.addCardClick = this.addCardClick.bind(this);
        this.addCardClick();
        this.buttonAdd = document.querySelectorAll('.button-add-card');
        this.buttonAddClick = this.buttonAddClick.bind(this);
        this.buttonAddClick();
        this.buttonCancel = document.querySelectorAll('.button-cancel');
        this.buttonCancelClick = this.buttonCancelClick.bind(this);
        this.buttonCancelClick();
        this.container = document.querySelector('.container');
        this.containerMouseOver = this.containerMouseOver.bind(this);
        this.containerMouseOver();
        this.containermouseout = this.containermouseout.bind(this);
        this.containermouseout();
        this.containermousemousedown = this.containermousemousedown.bind(this);
        this.containermousemousedown();

        const columns = ['todo', 'inProgress', 'done'];

        columns.forEach(columnID => {
            if (localStorage.getItem(columnID) !== null) {
                const items = JSON.parse(localStorage.getItem(columnID));
                items.forEach(item => {
                    columnID = columnID;
                    const columnContent = document.getElementById(columnID).querySelector('.column-content');
                    this.addTextElement(item, columnContent);
                });
            }
        });
    }

    addCardClick() {
        this.addCard.forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                this.showHideAddForm(event.target);
            });
        });
    }

    showHideAddForm(event) {
        console.log("Смена видимости");
        const parentEl = event.closest(".column");
        parentEl.querySelector(".add-card").classList.toggle("add-card-hidden");
        parentEl.querySelector(".fill-form").classList.toggle("fill-form-hidden");
    }

    buttonAddClick() {
        this.buttonAdd.forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                console.log("Добавление элемента");
                const columnContent = event.target.closest(".column").querySelector('.column-content');
                const itemValue = event.target.closest('.fill-form').querySelector(".fill-card-textarea").value;
                this.addTextElement(itemValue, columnContent);
                event.target.closest('.fill-form').querySelector(".fill-card-textarea").value = '';
                this.showHideAddForm(event.target);
                this.save();
            });
        });
    }

    addTextElement(itemValue, columnContent) {
        const newItem = document.createElement("div");
        newItem.classList.add("content-item");
        columnContent.appendChild(newItem);

        const newItemText = document.createElement("div");
        newItemText.textContent = itemValue;
        newItemText.classList.add("content-item-text");
        newItem.appendChild(newItemText);

        const newItemDel = document.createElement("div");
        newItemDel.innerHTML = '&#951';
        newItemDel.classList.add("content-item-del");
        newItemDel.classList.add("content-item-del-hide");
        newItem.appendChild(newItemDel);
    }

    buttonCancelClick() {
        this.buttonCancel.forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                console.log("Очищение формы элемента");

                event.target.closest('.fill-form').querySelector(".fill-card-textarea").value = '';
                this.showHideAddForm(event.target);
            });
        });
    }

    containerMouseOver() {
        this.container.addEventListener('mouseover', (event) => {
            const contentItem = event.target.closest('.content-item');
            if (contentItem) {
                const contentItemDel = contentItem.querySelector(".content-item-del");
                if (contentItemDel.classList.contains('content-item-del-hide')) {
                    contentItemDel.classList.remove('content-item-del-hide');
                }
                contentItemDel.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log("Удаляем элемент");
                    event.target.removeEventListener('click', this.logRemoveEventListener);
                    contentItem.remove();
                    this.save();
                });
            }
            if (this.actualElement != undefined) {
                this.actualElement.style.top = event.clientY + 'px';
                this.actualElement.style.left = event.clientX + 'px';
            }

        });
    }

    containermouseout() {
        this.container.addEventListener('mouseout', (event) => {
            if (event.target.classList.contains('content-item')) {
                const contentItemDel = event.target.querySelector(".content-item-del");
                contentItemDel.classList.add('content-item-del-hide');
            }
        })
    }

    logRemoveEventListener() {
        console.log("Удалена подписка на событие");
    }


    containermousemousedown() {
        this.container.addEventListener('mousedown', (event) => {

            if (this.actualElement != undefined) { return };
            if ((event.target.classList.contains('content-item')) || (event.target.classList.contains('content-item-text'))) {
                const contentItem = event.target.closest('.content-item');

                event.preventDefault();
                this.actualElement = contentItem;
                const rectActualElement = contentItem.getBoundingClientRect();
                this.actualElement.classList.add('dragged');
                this.actualElement.style["min-width"] = rectActualElement.width;
                this.actualElement.style["min-height"] = rectActualElement.height;
                document.body.style.cursor = "grabbing";

                this.containerMouseUp();
                this.containerMouseOver();

            }
        })
    }

    onMouseOver = (e) => {
        console.log(e);
    };

    containerMouseUp() {

        this.container.addEventListener('mouseup', (event) => {
            if (this.actualElement === undefined) { return };
            const mouseUpItem = event.target.closest('.content-item');
            const contentParent = event.target.closest('.column').querySelector('.column-content');
            if (contentParent != null) {
                if (mouseUpItem === null) {
                    contentParent.appendChild(this.actualElement);
                } else {
                    contentParent.insertBefore(this.actualElement, mouseUpItem);
                }
                this.actualElement.classList.remove('dragged');
                this.actualElement = undefined;
                document.body.style.cursor = "auto";
                this.container.removeEventListener('mouseup', this.onMouseOver);
                this.container.removeEventListener('mouseover', this.onMouseOver);
                this.save();
            }
        });
    }

    static load() {
        return localStorage.getItem("cards");
    }

    save() {
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
    }
}

