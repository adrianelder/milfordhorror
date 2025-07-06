const launchButton = document.querySelector('#launch-jumbotron');
const listInput = document.querySelector('#list-input');
const listControls = document.querySelector('#list-controls');
const localPreview = document.querySelector('#local-preview');
const strikes = document.querySelector('#strikes');
function init() {

    for (const round of rounds) {
        round.id = createId();
        for (const answer of round.answers) {
            answer.id = createId();
        }
        roundMap[round.id] = round;

        const roundOption = document.createElement('option');
        roundOption.textContent = round.questionText;
        roundOption.value = round.id;
        listInput.append(roundOption);
    }
    listInput.addEventListener('change', async () => {
        const round = roundMap[listInput.value];
        const items = round.answers;
        const jumbotronContent = await getJumbotronContent();
        updateDisplay(items, jumbotronContent);
        updateDisplay(items, localPreview);
        updateListControls(items);
    });
}

const otherWindowPromise = new Promise((resolve) => {
    launchButton.addEventListener('click', () => {
        const tempWindow = window.open('jumbotron.html', '_blank');
        tempWindow.addEventListener('load', () => {
            resolve(tempWindow);
        });
    });
});

strikes.addEventListener('change', async () => {
     const displayedItems = [
                ...document.querySelectorAll('.strike-counter'),
                ...(await getJumbotronContent()).querySelectorAll('.strike-counter'),
            ];
    for (displayedItem of displayedItems) {
        if (displayedItem.children.length > strikes.value) {
            emptyElement(displayedItem);
        }
        for (let i = displayedItem.children.length; i < strikes.value; i++) {
            const img = document.createElement('img');
            img.src = 'assets/redx.png'
            img.classList.add('red-x');
            setTimeout(() => void img.classList.add('show'), 100);
            displayedItem.append(img);
        }
    }
});

async function getJumbotronContent() {
    const otherWindow = await otherWindowPromise;
    return otherWindow.document.querySelector('.content');
}

async function updateDisplay(items, container) {
    strikes.value = 0;
    emptyElement(container);
    let counter = 1;
    for (const item of items) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.classList.add(item.id);
        const itemNumber = document.createElement('span');
        itemNumber.classList.add('number');
        itemNumber.textContent = `${counter}.`;
        const itemLabel = document.createElement('span');
        itemLabel.classList.add('label');
        itemLabel.textContent = item.label;
        itemElement.append(itemNumber, itemLabel);
        container.append(itemElement);
        counter++;
    }
    const strikeCounter = document.createElement('div')
    strikeCounter.classList.add('strike-counter');
    container.append(strikeCounter);
}

async function updateListControls(items) {
    emptyElement(listControls);
    for (const item of items) {
        const itemElement = document.createElement('label');
        itemElement.classList.add('item');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('click', async () => {
            const displayedItems = [
                ...document.querySelectorAll(`.${item.id}`),
                ...(await getJumbotronContent()).querySelectorAll(`.${item.id}`),
            ];
            for (const displayedItem of displayedItems) {
                displayedItem.classList.toggle('show', checkbox.checked);
            }
        });
        const labelText = document.createElement('span');
        labelText.textContent = item.label;
        itemElement.append(checkbox);
        itemElement.append(labelText);
        listControls.append(itemElement);
    }
}


const rounds = [
    {
        questionText: "It barks",
        answers: [
            {
                label: "dog",
            },
            {
                label: "seal",
            },
            {
                label: "puppy"
            }
        ]
    },
    {
        questionText: "Things you hit with your car",
        answers: [
            {
                label: "curbs",
            },
            {
                label: "cars",
            },
            {
                label: "walls",
            }
        ]
    }
];
const roundMap = {};

function createId() {
    return 'id' + crypto.randomUUID().replaceAll('-', '');
}

function emptyElement(el) {
     while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

init();