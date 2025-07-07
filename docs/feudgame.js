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
        const jumbotronContent = await getJumbotronContent();
        updateListControls(round.answers);
        updateDisplay(round, localPreview);
        updateDisplay(round, jumbotronContent);

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

async function updateDisplay(round, container) {
    strikes.value = 0;
    emptyElement(container);
    const strikeCounter = document.createElement('div')
    strikeCounter.classList.add('strike-counter');
    container.append(strikeCounter);
    const question = document.createElement('div');
    question.classList.add('question');
    question.textContent = round.questionText;
    container.append(question);
    const answers = document.createElement('div');
    answers.classList.add('answers');
    container.append(answers);
    let counter = 1;
    for (const item of round.answers) {
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
        answers.append(itemElement);
        counter++;
    }
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

const roundsTxt = `
Something you accidentally hit with your car
Animal
Curb
Another vehicle
Pole
The Fisherman

Something you throw in the ocean that you shouldn't
Trash
Food
Plastic water bottle
Dead body

Places you might drive late at night
Fast food
Cemetery
Woods
Pharmacy
Beach

Things that might hook you
A story/movie/show
Drugs
A song
Food

Things you might hook
People
Body parts
Fish
Clothes
Crochet

Something you once ate that you wish you didn't
Uncommon meats
Fish
Rotten food
Pet food
Dirt
Poop

A hairdo you regret sporting
Mullet
Mohawk
Bumpit
Rat tail
Beehive

Something you keep secret
Murder
Money
Age
Weight
Password
It's a secret


Something you regret doing late at night
Eating
Doomscrolling
Staying up
Drinking
Sex
Drugs

Something you did at the beach last summer
Swim
Sunburn
Read
Sex
Played catch

Something you wouldn't want someone to mention when you visit home
Embarassing Childhood
Exes
Politics
Sex
Money
`;


function parseRounds(txt) {
    const output = [];
    let nextRound = null;
    const lines = txt.trim().split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.length === 0) {
            if (nextRound != null) {
                nextRound = null;
            }
        } else {
            if (nextRound != null) {
                nextRound.answers.push({label: line});
            } else {
                nextRound = {
                    questionText: line,
                    answers: [],
                }
                output.push(nextRound);
            }
        }
    }
    return output;
}
const rounds = parseRounds(roundsTxt);
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