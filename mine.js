let board=[]
const body= document.querySelector('body')
const submitBtn= document.querySelector('#formBtn');
const selectDiff= document.querySelector('#framework')
let win= document.querySelector("#state")
let timer= document.querySelector('#timer')
let timerCounter=0
// const boardWidth= container.style.maxWidth
let selectIndex=0
let arrayZeros=[]

// Cell structure
class Cell{
    constructor(x, y)
    {
        this.x= x
        this.y=y
    }
}

//deleteBoard
function deleteBoard()
{
    let container= document.querySelector('.container')
    const numDivs= document.querySelectorAll('.cell');
        for(let i=0; i<numDivs.length; i++)
        {
            container.removeChild(numDivs[i])
        }
}

// create Board function
function createBoard(rows, columns)
{
    board=[]
    for(let i=0; i< rows; i++)
    {
        board.push([])
        for(let j=0; j<columns; j++)
        {
            let div= document.createElement('div')
            div.classList.add('cell')
            let cell= new Cell(i, j)
            // div.append(cell)
            board[i][j]= div
        }
    }
    return board;
}

//deleteBoard()


// draw Board
function drawBoard(board,width)
{
    deleteBoard()
    const borderWidth= document.querySelector('.container').style.borderWidth
    let container= document.querySelector('.container')
    for(let i=0; i< board.length; i++)
    {
        let counter=i
        for(let j=0; j<board[i].length; j++)
        {
            board[i][j].style.width= (width-2)/board[i].length +'vw';
            board[i][j].style.height= board[i][j].style.width;
            
            if(counter%2==0)
            {
                board[i][j].style.backgroundColor='white'
            }
            container.appendChild(board[i][j])
            counter++
        }
    }
}

//function select diffciculties
function selectDifficulties(submitBtn, selectDiff){
    submitBtn.onclick=(e)=>{
        timerCounter=0
        clearInterval(myInterval2)
        myInterval=setInterval(checkWins, 100)
        myInterval2= setInterval(timerFunc, 1000)
        win.innerHTML=""
        e.preventDefault()
        selectIndex= selectDiff.selectedIndex
        // return selectDiff[selectIndex].value
        let value= selectDiff[selectIndex].value
        let initialVal= parseInt(value.substring(0,2))
        let backVal= parseInt(value.substring(value.length-2,))

        let container= document.querySelector('.container')
        if(window.innerWidth>800)
        {
            if(initialVal>=24)
            {
                container.style.width= 52+'vw'
                drawBoard(createBoard(backVal, initialVal),52)
            }
            else if(initialVal>=22)
            {
                container.style.width= 47+ 'vw'
                drawBoard(createBoard(backVal, initialVal),47)
            }
            else if(initialVal>=18)
            {
                container.style.width= 42+'vw'
                drawBoard(createBoard(backVal, initialVal),42)
            }
            else if(initialVal>=16)
            {
                container.style.width= 37+'vw'
                drawBoard(createBoard(backVal, initialVal),37)
            }
            else{
                container.style.width= 33+'vw'
                drawBoard(createBoard(backVal, initialVal),33)   
            }
        }
        else{
            container.style.width= 90+'vw'
            drawBoard(createBoard(backVal, initialVal),90)
        }
        console.log(assignBomb(initialVal, backVal))
    }
}

// randomly assign a cell of having a bomb or not;
function assignBomb(v1, v2)
{
    let counter=0;
    let index= selectDiff.selectedIndex;
    let value= selectDiff[index].value
    let initialVal= parseInt(value.substring(0,2))
    let backVal= parseInt(value.substring(value.length-2,))
    let total= initialVal* backVal
    let array=[]
    let arrayMines=[]

    if(initialVal==backVal && backVal<=10)
    {
        counter=10
    }
    else if(initialVal==16 && backVal==30)
    {
        counter=99
    }
    else if(initialVal==18 && backVal==30){
        counter=112
    }
    else if(initialVal==22)
    {
        counter=139
    }
    else if(initialVal==24)
    {
        counter= 170
    }
    else{
        counter=40
    }

    let randomIndex= Math.floor(Math.random()*(total-counter))+1
    for (var i = 1; i <= total; i++) {
        array.push(i);
    }
    let shuffledArray= shuffleArray(array)
    let cells= document.querySelector('.cell')
    for(let i=randomIndex; i<randomIndex+counter; i++)
    {
        arrayMines.push(shuffledArray[i])
    }
    assignCells(arrayMines, initialVal)
    clickBomb(arrayMines)
    return arrayMines
}


//shuffleArray
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }


function assignCells(arrayOfBombs, v1)
{
    let cells= document.querySelectorAll('.cell')

    for(let i=1; i<cells.length+1; i++)
    {
        if(comparingValues(arrayOfBombs, i))
        {
            let div= document.createElement('div')
            div.classList.add('bomb')
            cells[i-1].appendChild(div)

            let bomb= div
            let cell= cells[i-1]
            bomb.style.width= cell.style.width
            bomb.style.height= cell.style.height
        }
        else{
            let div= document.createElement('div')
            let num=assignNumbers(arrayOfBombs, i, v1)
            div.classList.add(`number${num}`)
            cells[i-1].appendChild(div)

            let number= div
            let cell= cells[i-1]
            number.style.width= cell.style.width
            number.style.height= cell.style.height
            cells[i-1].dataset.num=0
        }
    }
    for(let i=1; i<cells.length+1; i++)
    {
        let counter=0

        cells[i-1].addEventListener('contextmenu', (event)=>{
            if(cells[i-1].dataset.num==0 ||cells[i-1].querySelector('div').classList.contains('bomb'))
            {
                event.preventDefault()
                console.log('right clicked', i-1)
                if(counter%2==0)
                {
                    cells[i-1].classList.add('flag')
                }
                else{
                    cells[i-1].classList.remove('flag')
                }
                counter++
            }
        })
        if(!cells[i-1].querySelector('div').classList.contains('number0'))
        {
            cells[i-1].onclick=()=>{
                if(cells[i-1].classList.contains('flag'))
                {
                    cells[i-1].classList.remove('flag')
                }
                cells[i-1].dataset.num++
                checkForRevealed(cells, i-1)
            }
        }

        else if(cells[i-1].querySelector('div').classList.contains('number0'))
        {
            cells[i-1].onclick=()=>{
                if(cells[i-1].classList.contains('flag'))
                {
                    cells[i-1].classList.remove('flag')
                }
                cells[i-1].dataset.num++
                clickZero(cells, i-1, v1)
                for(let i=0; i<cells.length; i++)
                {
                    checkForRevealed(cells, i)
                }
            }
        }
    }
}

// whenClickedZero
function clickZero(cells, number, v1)
// the number in this case is the actual index, not number
{
    arrayZeros.shift()
    let arrayReveals=[]
    if((number+1)%v1==0)
    {
        cells[number-1].dataset.num++
        if(number+v1-1<cells.length) cells[number+v1-1].dataset.num++
        if(number-v1-1>=0) cells[number-v1-1].dataset.num++
        arrayReveals.push(number-1)
        arrayReveals.push(number+v1-1)
        arrayReveals.push(number-v1-1)
    }
    else if((number+1)%v1==1)
    {
        cells[number+1].dataset.num++
        if(number+v1+1<cells.length) cells[number+v1+1].dataset.num++
        if(number-v1+1>=0) cells[number-v1+1].dataset.num++
        arrayReveals.push(number+1)
        arrayReveals.push(number+v1+1)
        arrayReveals.push(number-v1+1)
    }
    else{
        cells[number-1].dataset.num++
        if (number+v1-1<cells.length) {cells[number+v1-1].dataset.num++} 
        if(number-v1-1>=0) cells[number-v1-1].dataset.num++
        cells[number+1].dataset.num++
        if(number+v1+1<cells.length) cells[number+v1+1].dataset.num++
        if(number-v1+1>=0) cells[number-v1+1].dataset.num++
        arrayReveals.push(number-1)
        arrayReveals.push(number+v1-1)
        arrayReveals.push(number-v1-1)
        arrayReveals.push(number+1)
        arrayReveals.push(number+v1+1)
        arrayReveals.push(number-v1+1)

    }
    if(number+v1<cells.length) cells[number+v1].dataset.num++
    if(number-v1>=0) cells[number-v1].dataset.num++
    arrayReveals.push(number+v1)
    arrayReveals.push(number-v1)

    arrayReveals= inRange(arrayReveals, cells.length)

    for(let i=0; i<arrayReveals.length; i++)
    {
        if(cells[arrayReveals[i]].querySelector('div').classList.contains('number0') && 
        cells[arrayReveals[i]].dataset.num==1)
        {
            arrayZeros.push(arrayReveals[i])
        }
    }

    while(arrayZeros.length!=0)
    {
        clickZero(cells,arrayZeros[0], v1)
    }

}

//checkfroRevealed and flipit
function checkForRevealed(cells, number)
{
    if(cells[number].dataset.num>0)
    {
        cells[number].style.backgroundColor="rgb(252, 244, 187)"
        if(cells[number].classList.contains('flag'))
        {
            cells[number].classList.remove('flag')
        }
        cells[number].querySelector('div').style.display='block'
    }
}

//valueExistsinArrayOrNot
function comparingValues(array, value)
{
    for(let i=0; i<array.length; i++)
    {
        if(array[i]==value){
            return true
        }
    }
    return false
}

// numberLocationCalculation

function assignNumbers(arrayOfBombs, number, initialVal)
{
    let counter=0;
    if(number%initialVal==0)
    {
        if(arrayOfBombs.includes(number-1)){
            counter++
        }
        if(arrayOfBombs.includes(number+initialVal-1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number-initialVal-1))
        {
            counter++
        }
    }
    else if(number%initialVal==1)
    {
        if(arrayOfBombs.includes(number+1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number+initialVal+1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number-initialVal+1))
        {
            counter++
        }
    }
    else{
        if(arrayOfBombs.includes(number-1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number+1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number+initialVal+1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number-initialVal+1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number+initialVal-1))
        {
            counter++
        }
        if(arrayOfBombs.includes(number-initialVal-1))
        {
            counter++
        }
    }
    if(arrayOfBombs.includes(number+ initialVal))
    {
        counter++
    }
    if(arrayOfBombs.includes(number-initialVal))
    {
        counter++
    }
    return counter
}


//check whetherfall in limit
function inRange(array,upper)
{
    for(let i=0; i<array.length; i++)
    {
        if(array[i]<0 || array[i]>=upper)
        {
            array.splice(i, 1)
            i--
        }
    }
    return array
}


//ending the game
function clickBomb(arrayBombs)
{
    let cells= document.querySelectorAll('.cell')
    for(let i=0; i<arrayBombs.length; i++)
    {
        cells[arrayBombs[i]-1].onclick=()=>{
            clearInterval(myInterval)
            clearInterval(myInterval2)
            for(let i=0; i<arrayBombs.length; i++)
            {
                let bomb=cells[arrayBombs[i]-1].querySelector('div')
                bomb.style.display='block'
            }
            console.log('game ended!')
            for(let i=0; i<cells.length; i++)
            {
                if(cells[i].classList.contains('flag'))
                {
                    cells[i].classList.remove('flag')
                }
                cells[i].dataset.num++
                checkForRevealed(cells,i)
            }
            win.innerText="You Lose"
        }
    }
}

function checkWins()
{
    let state=true;
    let cells= document.querySelectorAll('.cell')
    for(let i=0; i<cells.length; i++)
    {
        if((cells[i].querySelector('div').classList.contains('bomb'))
            ||(!cells[i].querySelector('div').classList.contains('bomb') && cells[i].dataset.num>0))
        {
            state= state&&true
        }
        else
        {
            state= state&& false
        }
    }
    if(state)
    {
        win.innerHTML="You win!"
        clearInterval(myInterval)
        clearInterval(myInterval2)

    }

}

function timerFunc()
{
    timer.innerText=timerCounter +'.00'
    timerCounter++;
}

let myInterval
let myInterval2
selectDifficulties(submitBtn, selectDiff)



