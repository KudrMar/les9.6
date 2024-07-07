"use strict";
import SaveLoadUtils from "./SaveLoadUtils";
import Item from "./Item";

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
        this.containerMouseOut = this.containerMouseOut.bind(this);
        this.containerMouseOut();
        this.containerMouseDown = this.containerMouseDown.bind(this);
        this.containerMouseDown();
        this.containerMouseMove = this.containerMouseMove.bind(this);
        this.containerMouseMove();
        this.containerMouseDownFunction = this.containerMouseDownFunction.bind(this);
        this.containerMouseOutFunction = this.containerMouseOutFunction.bind(this);
        this.containerMouseOverFunction = this.containerMouseOverFunction.bind(this);
        this.containerMouseUpFunction = this.containerMouseUpFunction.bind(this);
        this.containerMouseUp = this.containerMouseUp.bind(this);
        this.containerMouseUp();
        SaveLoadUtils.load(this);
        this.targetElement = null;

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
                Item.addTextElement(itemValue, columnContent);
                event.target.closest('.fill-form').querySelector(".fill-card-textarea").value = '';
                this.showHideAddForm(event.target);
                SaveLoadUtils.save();
            });
        });
    }


    buttonCancelClick() {
        this.buttonCancel.forEach((el) => {
            el.addEventListener('click', (event) => {
                event.preventDefault();
                event.target.closest('.fill-form').querySelector(".fill-card-textarea").value = '';
                this.showHideAddForm(event.target);
            });
        });
    }

    containerMouseOver() {
        this.container.addEventListener('mouseover', this.containerMouseOverFunction.bind(this));
    }

    containerMouseOverFunction(event) {
        const contentItem = event.target.closest('.content-item');
        if (contentItem) {
            const contentItemDel = contentItem.querySelector(".content-item-del");
            if (contentItemDel.classList.contains('content-item-del-hide')) {
                contentItemDel.classList.remove('content-item-del-hide');
            }
            contentItemDel.addEventListener('click', (event) => {
                event.preventDefault();
                contentItem.remove();
                SaveLoadUtils.save();
            });
        }
    }

    containerMouseOut() {
        this.container.addEventListener('mouseout', this.containerMouseOutFunction.bind(this))
    }

    containerMouseOutFunction(event) {
        let contentItem = event.target.closest('.content-item');
        if (contentItem != null) {
            const contentItemDel = contentItem.querySelector(".content-item-del");
            contentItemDel.classList.add('content-item-del-hide');
        }
        ;
        if ((this.actualElement != undefined) && (this.targetElement != null) && (event.relatedTarget)
            && (event.relatedTarget != this.targetElement)) {
            this.targetElement.remove();
            this.targetElement = null;
        }
    }

    containerMouseDown() {
        let containerMouseDownFunction = this.containerMouseDownFunction.bind(this);
        this.container.addEventListener('mousedown', containerMouseDownFunction)
    }

    containerMouseDownFunction(event) {
        if (this.actualElement != undefined) { return };
        if ((event.target.classList.contains('content-item')) || (event.target.classList.contains('content-item-text'))) {
            const contentItem = event.target.closest('.content-item');

            event.preventDefault();
            this.actualElement = contentItem;
            const rectActualElement = contentItem.getBoundingClientRect();

            this.actualElement.style.width = rectActualElement.width - 16 + 'px';
            this.actualElement.style.height = rectActualElement.height + 'px';
            this.difX = event.clientX - rectActualElement.x;
            this.difY = event.clientY - rectActualElement.y;
            this.actualElement.classList.add('dragged');
            document.body.style.cursor = "grabbing";
        }

    }

    containerMouseMove() {
        let containerMouseMoveFunction = this.containerMouseMoveFunction.bind(this);
        this.container.addEventListener('mousemove', containerMouseMoveFunction)
    }

    containerMouseMoveFunction(event) {
        if (this.actualElement != undefined) {
            this.actualElement.style.top = event.clientY - this.difY + 'px';
            this.actualElement.style.left = event.clientX - this.difX + 'px';
        }
        const contentItem = event.target.closest('.content-item');
        if ((this.actualElement != undefined) && (this.targetElement === null) && (event.target != null)) {
            if (contentItem === null) {
                const header = event.target.closest('.column-header');
                let elitem = null;
                if (header) {
                    elitem = header.nextElementSibling.querySelector('.content-item');
                }

                if (elitem) {
                    this.targetElement = Item.addEmptyElement(this.actualElement, elitem);
                } else {
                    const column = event.target.closest('.column');
                    if (column) {
                        this.targetElement = Item.addEmptyElement(this.actualElement, column);
                    }
                }
            } else {
                this.targetElement = Item.addEmptyElement(this.actualElement, contentItem);
            }
        }

    }

    containerMouseUp() {
        let containerMouseUpFunction = this.containerMouseUpFunction.bind(this);
        this.container.addEventListener('mouseup', containerMouseUpFunction);
    }

    containerMouseUpFunction(event) {
        if (this.actualElement === undefined) { return };
        const mouseUpColumn = event.target.closest('.column');
        if (mouseUpColumn != null) {
            const contentParent = mouseUpColumn.querySelector('.column-content');

            const closestItem = event.target.closest('.content-item');
            let mouseUpItem = closestItem;
            if ((event.target.closest('.content-item') === this.targetElement) && ((mouseUpItem != null))) {
                mouseUpItem = closestItem.nextSibling;
            }
            if (mouseUpItem === null) {
                contentParent.appendChild(this.actualElement);
            } else {
                contentParent.insertBefore(this.actualElement, mouseUpItem);
            }
            this.actualElement.classList.remove('dragged');
            this.actualElement.style.width = '';
            this.actualElement.style.height = '';
            this.actualElement = undefined;
            document.body.style.cursor = "auto";
            if ((this.targetElement != null)) {
                this.targetElement.remove();
                this.targetElement = null;
            }
            SaveLoadUtils.save();
        }
    }
}

