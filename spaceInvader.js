const grid= document.querySelector(".grid");
const resultDisplay= document.querySelector(".result");
const width= 15;
let direction=1;
let invaderId;
let goingRight= true;
let goingLeft= false;
let aliensRemoved =[];
let result=0;
let startButton= document.querySelector('.start')
let gridWidth=grid.style.width;
let gridHeight=grid.style.height;

// let cell= document.querySelectorAll('.grid div')
// for(let i=0; i<cell.length; i++)
// {
//     cell[i].style.width= gridWidth/15 +'vmin';
//     cell[i].style.height= gridHeight/15 +'vmin';
// }

for(let i=0; i<225; i++)
{
    const square= document.createElement("div");
    grid.appendChild(square);
}

let currentShooterIndex= 202;
const squares= Array.from(document.querySelectorAll(".grid div"))

console.log(squares)

const alienInvaders= [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39,
];

function draw()
{

    for( let i=0; i< alienInvaders.length; i++)
    {
        if(!aliensRemoved.includes(i))
        {
            // the includes(value) method checks whether a value exist in a string or array in js.
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}

function remove()
{
    for( let i=0; i< alienInvaders.length; i++)
    {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

draw();

squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e)
{
    squares[currentShooterIndex].classList.remove("shooter");
    switch(e.key)
    {
        case "ArrowLeft":
            if(currentShooterIndex % width !=0) currentShooterIndex-- 
            break;
        case "ArrowRight":
            if(currentShooterIndex %width < width-1) currentShooterIndex++;
            break;
        case "ArrowUp":
            if(currentShooterIndex >14) currentShooterIndex-=width;
            break;
        case "ArrowDown":
            if(currentShooterIndex< width*width-width-1) currentShooterIndex+=width;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);


function moveInvaders()
{
    const leftEdge= alienInvaders[0] % width ===0;
    const rightEdge= alienInvaders[alienInvaders.length-1]% width ===width-1;
    remove()

    if(rightEdge && goingRight)
    {
        for(let i=0; i< alienInvaders.length; i++)
        {
            alienInvaders[i]+= width;
            direction=-1;
            goingRight= false;
        }
    }

    if(leftEdge && !goingRight)
    {
        for(let i=0; i< alienInvaders.length; i++)
        {
            alienInvaders[i]+= width-1;
            direction=1;
            goingRight= true;
        }
    }

    for(let i=0; i<alienInvaders.length; i++)
    {
        alienInvaders[i] += direction;
    }

    draw()

    if(squares[currentShooterIndex].classList.contains("invader","shooter"))
    {
        resultDisplay.innerHTML= "GAME OVER";
        clearInterval(invaderId);
        document.removeEventListener("keydown", shoot)
    }

    for(let i=0; i< alienInvaders.length; i++)
    {
        if(alienInvaders[i]>=squares.length-15)
        {
            resultDisplay.innerHTML= "GAME OVER";
            clearInterval(invaderId);
            document.removeEventListener("keydown", shoot)
        }
    }

    if(aliensRemoved.length==alienInvaders.length)
    {
        resultDisplay.innerHTML= "You Win!";
        clearInterval(invaderId);
        document.removeEventListener("keydown", shoot)
    }
}

function shoot(e)
{
    let laserId;
    let currentLaserIndex= currentShooterIndex;
    function moveLaser()
    {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex-= width;
        squares[currentLaserIndex].classList.add("laser");

        if(squares[currentLaserIndex].classList.contains("invader"))
        {
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(()=> squares[currentLaserIndex].classList.remove("boom"), 200)
            clearInterval(laserId)

            const alienRemoved= alienInvaders.indexOf(currentLaserIndex);
            // the indexOf method also works for arrays in javascript;
            aliensRemoved.push(alienRemoved);
            result++;
            resultDisplay.innerHTML= result;
        }
    }
    if(e.key=="s")
    {
        laserId=setInterval(moveLaser, 100)
    }
}

let num=0;
startButton.addEventListener('click', ()=>{
    invaderId= setInterval(moveInvaders, 300);
    document.addEventListener("keydown", shoot);

    if(num>0)
    {
        location.reload();
    }
    num++;
})