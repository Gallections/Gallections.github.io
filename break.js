const grid= document.querySelector(".grid");
const blockWidth= 10;
const blockHeight= 2
const boardWidth=56;
const boardHeight=30
const ballDiameter= 1.5
const scoreDisplay= document.querySelector("#score");
let xDirection= 0.35;
let yDirection= 0.35;
// was originally 2

let score=0;
let timerId;
const userStart= [23,1];
let currentPosition= userStart;

const ballStart=[27.25,4];
let currentBallPosition= ballStart;

class Block
{
    constructor(xAxis, yAxis)
    {
        this.bottomLeft= [xAxis, yAxis];
        this.bottomRight=[xAxis+ blockWidth, yAxis];
        this.topLeft= [xAxis, yAxis+ blockHeight];
        this.topRight= [xAxis+blockWidth, yAxis+ blockHeight];
    }
}


// all of our blocks are stored in an array;
const blocks= [
    new Block(1,27),
    new Block(12,27),
    new Block(23,27),
    new Block(34,27),
    new Block(45,27),
    new Block(1,24),
    new Block(12,24),
    new Block(23,24),
    new Block(34,24),
    new Block(45,24),
    new Block(1,21),
    new Block(12,21),
    new Block(23,21),
    new Block(34,21),
    new Block(45,21),
    new Block(1,18),
    new Block(12,18),
    new Block(23,18),
    new Block(34,18),
    new Block(45,18),
    new Block(1,15),
    new Block(12,15),
    new Block(23,15),
    new Block(34,15),
    new Block(45,15),
]

function randomXgenerator()
{
    let randomX= (Math.random()*9+1-5)/10;
    xDirection= randomX;
    console.log(randomX)
}

randomXgenerator()
function randomYgenerator()
{
    let randomY= (Math.random()*5+1)/10;
    yDirection= randomY;
}

function addBlock()
{
    for(let i=0; i<blocks.length; i++){
        const block= document.createElement("div");
        block.classList.add("block")
        block.style.left= blocks[i].bottomLeft[0]+ "vw";
        block.style.bottom= blocks[i].bottomLeft[1]+ "vw";
        if(i%2==0)
        {
            block.style.backgroundColor="rgb(78, 202, 192)";
        }
        else{
            block.style.backgroundColor="orange";
        }
        grid.appendChild(block);
    }
}

addBlock();

const user= document.createElement("div");
user.classList.add("user");
drawUser()

function drawUser()
{
    user.style.left= currentPosition[0]+ "vw";
    user.style.bottom= currentPosition[1]+ "vw";
}

function drawBall()
{
    ball.style.left= currentBallPosition[0]+ "vw";
    ball.style.bottom= currentBallPosition[1]+ "vw";
}


grid.appendChild(user);

function moveUser(e)
{
    switch(e.key)
    // this means it's an event under the key subtype;
    {
        case "ArrowLeft":
            if(currentPosition[0]>0)
            {
                currentPosition[0]-=1.5;
                drawUser();
            }
            break;
        case "ArrowRight":
            if(currentPosition[0]<46)
            {
                currentPosition[0]+=1.5;
                drawUser();
            }
            break;
        case "a":
            if(currentPosition[0]>0)
            {
                currentPosition[0]-=1.5;
                drawUser();
            }
            break;
        case "d":
            if(currentPosition[0]<46)
            {
                currentPosition[0]+=1.5;
                drawUser();
            }
            break;
    }
}


//createBall
const ball= document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// move ball
function moveBall()
{
    currentBallPosition[0]+=xDirection;
    currentBallPosition[1]+=yDirection;
    drawBall();
    checkForCollisions();
}

function checkForCollisions()
{
    // check for block collisions:
    for(let i=0; i<blocks.length; i++)
    {
        if(
            (currentBallPosition[0]> blocks[i].bottomLeft[0] && currentBallPosition[0]< blocks[i].bottomRight[0]) &&
            ((currentBallPosition[1]+ ballDiameter)> blocks[i].bottomLeft[1] && currentBallPosition[1]<blocks[i].topLeft[1])
        )
        {
            const allBlocks= Array.from(document.querySelectorAll(".block"));
            // the Array.from method converts iterable objects into an array;
            //console.log(allBlocks);
            allBlocks[i].classList.remove("block");
            blocks.splice(i,1);
            // the list.splice(index removed, # of removing values, what to insert)
            changeDirection();
            score++;
            scoreDisplay.innerHTML= score;

            // check for win
            if(blocks.length==0)
            {
                scoreDisplay.innerHTML= "You win!";
                clearInterval(timerId);
                document.removeEventListener('keydown',moveUser);
            }

        }
    }

    // check for user collision:
    if(
        (currentBallPosition[0]> currentPosition[0] && currentBallPosition[0] < currentPosition[0]+ blockWidth) &&
        (currentBallPosition[1]> currentPosition[1] && currentBallPosition[1]< currentPosition[1]+ blockHeight)
    )
    {
        changeDirection();
    }

    if(
        (currentBallPosition[0]> boardWidth- ballDiameter)||
        (currentBallPosition[1]> boardHeight- ballDiameter)||
        (currentBallPosition[0]<0)
    ) 
    {
        changeDirection()
    }

    if(currentBallPosition[1]<=0)
    {
        clearInterval(timerId)
        scoreDisplay.innerHTML= "You lose! The final score is "+ score
        document.removeEventListener("keydown",moveUser)
        // user.classList.remove("user");
        // ball.classList.remove("ball")
        return true;
    }
    return false;
}
// control+ d makes sure you select and change the element with same vlaue at the same time.

function changeDirection()
{
    if(xDirection>=0 && yDirection>=0.1)
    {
        yDirection= -yDirection;
        return 
    }
    else if(xDirection<0 && yDirection>=0.1)
    {
        xDirection= -xDirection;
        return 
    }
    else if(xDirection>= 0 && yDirection<= -0.1)
    {
        xDirection= -xDirection;
        return 
    }
    else if(xDirection< 0 && yDirection<=-0.1)
    {
        yDirection= -yDirection;
        return
    }
}

let num=0;
document.querySelector('#start').onclick= ()=>
{
    document.addEventListener("keydown", moveUser)
// the event keydown refers to the action that a user press anykey on the keyBoard.
// as you can notice, the addEventListener function is added to the document instead of 
// any specific element, this is because the keydown is a more general event that applyies to the entire 
// screen.
    randomXgenerator();
    randomYgenerator();
    timerId= setInterval(moveBall,30);
    if(num>0)
    {
        location.reload();
    }
    num++;
}