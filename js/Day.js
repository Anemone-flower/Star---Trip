const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let score; //현재 점수
let scoreText; //현재 점수 텍스트
let highscore; //최고 점수
let highscoreText; //최고 점수 텍스트
let dino; //공룡
let gravity; // 중력값
let obstacles = []; //장애물
let meteors = []; // 유성
let gameSpeed; // 게임 속도
let keys = {}; // 키 값
let hp = 10;
let Glich = 0;
let LastBreath = 0;
const storedItem = JSON.parse(localStorage.getItem("obtainedItem"));
const spanElements = document.querySelectorAll('.star');

let isPopupOpen = false; 

// 치트
document.addEventListener('keydown', function (evt) {
    if (evt.code === 'KeyR' && !isPopupOpen) {
        const userInput = prompt('Write "Night" or "Main" to change the page:');
        if (userInput && userInput.toLowerCase() === 'night') {
            window.location.href = 'Night-Dino.html';
        }
        else if(userInput && userInput.toLowerCase() ==='main'){
            window.location.href = "index.html";
        }
        isPopupOpen = true;
    }
});

window.addEventListener('beforeunload', function () {
    isPopupOpen = false;
});


if (storedItem) {
  const itemRarity = storedItem.rarity;
  switch (itemRarity) {
    case "PRESTIGE":
        LastBreath = 1;
        break;   
    case "Legend":
      hp = 20;
      gameSpeed = 2;
      LastBreath = -1;   
      break; 
    case "Epic":
      LastBreath = -1;   
      break;
    case "Rare":
      hp = 12;
      LastBreath = -1;   
      break;
    case "Common":
      hp = 11;
      LastBreath = -1;   
      break;
    default: 
      LastBreath = -1;    
  }
}

document.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});
document.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

class Text{
  constructor(t, x, y, a, c, s){
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw(){
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px sans-serif";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }

}

class Obstacle{
  constructor(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
    this.isBird = false;
    this.isFallingStar = false; // 유성 여부를 나타내는 속성
  }

  Update(){
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw(){
    var img = new Image()
    if(this.isBird == true){
      img.src = 'dinos/bird.png'
      ctx.drawImage(img,this.x, this.y, this.w, this.h);
    }
    else if (this.isFallingStar == true) {
      img.src = 'dinos/Stars.png'; 
      ctx.drawImage(img,this.x, this.y, this.w, this.h)
    }
    else{
      img.src = 'dinos/catus.png'
      ctx.drawImage(img,this.x, this.y, this.w, this.h)
    }
  }
}

class Dino {
    constructor (x, y, w, h, c) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.c = c;
  
      this.dy = 0; //점프를 위한 
      this.jumpForce = 15; //
      this.originalHeight = h; //숙이기 전 높이
      this.grounded = false; //땅에 있는지 판단
      this.jumpTimer =0 ; // 점프 시간 체크를 위한 타이머 추가
    }


    Draw(){
        var img = new Image()
        if((keys['ShiftLeft'] || keys['KeyS']) && this.grounded){
          if (storedItem) {
            const itemRarity = storedItem.rarity;
            switch (itemRarity) {
                case "PRESTIGE":
                    img.src = "dinos/fire-down.png";
                    break;
                case "Legendary":
                    img.src = "dinos/stars-down.png";
                    break;
                case "Epic":
                    img.src = "dinos/error-down.png";
                    break;
                case "Rare":
                    img.src = "dinos/machin-down.png";
                    break;
                case "Common":
                    img.src = "dinos/greendino-down.png";
                    break;
                default:
                    img.src = 'dinos/dino_down.png'
                    break;
            }
        } else {
             img.src = 'dinos/dino_down.png'
        }
          ctx.drawImage(img,this.x, this.y, this.w, this.h)
        }
      else{
        if (storedItem) {
          const itemRarity = storedItem.rarity;
          switch (itemRarity) {
              case "PRESTIGE":
                  img.src = "dinos/fire-up.png";
                  break;
              case "Legendary":
                  img.src = "dinos/stars-up.png";
                  break;
              case "Epic":
                  img.src = "dinos/error-up.png";
                  break;
              case "Rare":
                  img.src = "dinos/machin-up.png";
                  break;
              case "Common":
                  img.src = "dinos/greendino.png";
                  break;
              default:
                  img.src = 'dinos/dino_up.png'
                  break;
          }
      } else {
           img.src = 'dinos/dino_up.png'
      }
    
        ctx.drawImage(img,this.x, this.y, this.w, this.h);
      }
  }

    Jump () { //점프함수 추가
        if (this.grounded && this.jumpTimer == 0) {  //땅에 있는지 && 타이머 =0 
          this.jumpTimer = 1;
          this.dy = -this.jumpForce; 
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) {
          this.jumpTimer++;
          this.dy = -this.jumpForce - (this.jumpTimer / 50); //갈수록 빠르게 떨어지는 것 구현
        }
    }

    Animate () {
        // 키 입력 
        if (keys['Space'] || keys['KeyW']) { // 스페이스바 or 키보드 W 입력시
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }
    
        if ((keys['ShiftLeft'] || keys['KeyS']) && this.grounded) {  // 왼쉬프트 or 키보드 S 입력시
            this.y += this.h/2 
            this.h = this.originalHeight / 2; //h를 절반으로 줄여서 숙인 것과 같은 효과
        } else {
            this.h = this.originalHeight;
        }
    
        this.y += this.dy; //위치 변경

        //중력적용
        if (this.y + this.h < canvas.height) { //공중에 떠 있을 때
          this.dy += gravity; // 중력만큼 dy++
          this.grounded = false; 
        } else {
          this.dy = 0; 
          this.grounded = true;
          this.y = canvas.height - this.h; //바닥에 딱 붙어 있게 해줌
        }

        this.Draw();
      }
  } 

  function init() {
    obstacles = [];
    score = 0;
    spawnTimer = initialSpawnTimer;
    gameSpeed = 3;
    hp = 10;
    LastBreath = 0;
    Glich = 0;

    if (storedItem) {
      const itemRarity = storedItem.rarity;
      switch (itemRarity) {
        case "PRESTIGE":
            LastBreath = 1;
            break;   
        case "Legend":
          hp = 20;
          gameSpeed = 2;
          LastBreath = -1;   
          break; 
        case "Epic":
          LastBreath = -1;   
          break;
        case "Rare":
          hp = 12;
          LastBreath = -1;   
          break;
        case "Common":
          hp = 11;
          LastBreath = -1;   
          break;
        default: 
          LastBreath = -1;    
      }
    }

    window.localStorage.setItem('highscore', highscore);
    alert("저런! 게임오버!" + "당신의 점수 : " + score + "점");
    window.location.href = "index.html";
  }

  function Final() {
        const healAmount = 20;
        alert("염룡이 화염속에서 다시 태어납니다! : " + healAmount + "HP 회복!");
        hp += healAmount;
        LastBreath = 0;
        gameSpeed -= 2;
    }

  function Glitch_error(){
    const errorheal = 1;
    alert("Error Occur!");
    hp += errorheal;
    Glich = 0;
    gameSpeed += 3;
  } 

  function SpawnObstacle(){
    let size = RandomIntRange(20, 70);
    let type = RandomIntRange(0, 1);
    let obstacle = new Obstacle(canvas.width + size, canvas.height - size, size, size, '#2484E4')
  
    if(type == 1){
      obstacle.y -= dino.originalHeight - 10;
      obstacle.isBird = true;
    }
    obstacles.push(obstacle);
  }


function SpawnFallingStar() {
    const size = 180;
    const x = RandomIntRange(canvas.width + size, canvas.width - 1200); // 우측에서 시작
    const y = 0; // 랜덤한 세로 위치

    const meteor = new Obstacle(x, y, size, size, 'red');
    meteor.isFallingStar = true;
    
    // 대각선으로 이동하도록 dx와 dy 설정
    meteor.dx = -gameSpeed * 2.05; // x 방향으로 왼쪽으로 떨어지도록
    meteor.dy = gameSpeed * 1.5; // 대각선으로 아래로 이동하도록

    meteor.hit = false;

    // 별도의 배열에 유성 추가
    meteors.push(meteor);
}

function RandomIntRange (min, max){
  return Math.round(Math.random() * (max - min) + min);
}

function Start () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    ctx.font = "20px sans-serif";
  
    gameSpeed = 3;
    gravity = 1;
  
    score = 0;
    highscore = 0;

    if (storedItem) {
      const itemRarity = storedItem.rarity;
      switch (itemRarity) {
        case "Epic": 
        alert("Un Error Occur! Please, Restart Game!");
        break;
      }
    }       
    
  if(localStorage.getItem('highscore')){
    highscore = localStorage.getItem('highscore');
  }

    dino = new Dino(25,canvas.height-150,50,50,"pink");
    scoreText = new Text("Score: " + score, 25, 25, "left", "#ffffff", "20")
    hpText = new Text("HP : " + hp, 25,50, "left","red","20")
    highscoreText = new Text("Highscore: " + highscore, canvas.width - 25, 25, "right", "#ffffff", "20");
    gameSpeedText = new Text("Game Speed: " + gameSpeed.toFixed(2), canvas.width - 25, 75, "right", "#ffffff", "20");
    skillText = new Text("Skill Cooldown: 0s", 25, 75, "left", "#ffffff", "20");

    requestAnimationFrame(Update); 
}

let initialSpawnTimer = 100;
let spawnTimer = initialSpawnTimer;

function Update () {

    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dino.Animate(); 

    spawnTimer--;
    if(spawnTimer <= 0){
      SpawnObstacle();
      console.log(obstacles);
      spawnTimer = initialSpawnTimer - gameSpeed * 8;
      if(spawnTimer < 60){
        spawnTimer = 60;
      }
    } 
    // 유성 업데이트
    for (let i = 0; i < meteors.length; i++) {
      let meteor = meteors[i];

      if (meteor.x + meteor.w < 0 || meteor.y > canvas.height) {
          meteors.splice(i, 1);
      } else {
          meteor.x += meteor.dx;
          meteor.y += meteor.dy;
          meteor.Update();
      }
      if (
        !meteor.hit &&
        dino.x < meteor.x + meteor.w &&
        dino.x + dino.w > meteor.x &&
        dino.y < meteor.y + meteor.h &&
        dino.y + dino.h > meteor.y
    ) {
        meteor.hit = true; // 충돌 플래그 설정
        meteors.splice(i, 1); // 유성 삭제
        hp--

        if (hp <= 0 && LastBreath == 1) {
            Final(); // 최후의 숨결이 남아있다면 재시작
        }
        else if(LastBreath == 0 && hp <= 0){
          init(); // 체력이 0 이하면 게임 초기화
        }
        if (storedItem) {
          const itemRarity = storedItem.rarity;
          switch (itemRarity) {
            case "Epic": if(hp < -5){
              init(); break;
            }
          }
        }       
    }
  }
    for(let i = 0; i<obstacles.length; i++){
      let o = obstacles[i];
     
      if (o.x + o.w < 0 || o.y > canvas.height) { // 화면 왼쪽을 벗어나거나 화면 아래로 벗어나면 제거
        obstacles.splice(i, 1);
      } 
      if(
        dino.x < o.x + o.w &&
        dino.x + dino.w > o.x &&
        dino.y < o.y + o.h &&
        dino.y + dino.h > o.y
      ){
        obstacles.splice(i, 1); // 충돌한 장애물 삭제
        hp--; // 체력 감소
        if (hp <= 0 && LastBreath == 1) {
          Final(); // 최후의 숨결이 남아있다면 재시작
      }
      else if(LastBreath == 0 && hp <= 0){
        init(); // 체력이 0 이하면 게임 초기화
      }
      }
      o.Update();
    }
    score++;
    scoreText.t = "Score: " + score;
    scoreText.Draw();
    hpText.t = "HP : " + hp;
    hpText.Draw();
    gameSpeedText.t = "Game Speed : " + parseInt(gameSpeed) +"km/h";
    gameSpeedText.Draw();

    if(score > highscore){
      highscore = score;
      highscoreText.t = "Highscore: " + highscore;
    }

    highscoreText.Draw();
    if(LastBreath == 1){
    skillText.t = "Re-Burning : " + "Ready!";
    skillText.Draw();
    }
    else if(LastBreath == 0){
    skillText.t = "Re-Burning  : " + "None";
    skillText.Draw();
    }
    else if(LastBreath == -1){
      skillText.t = "";
      skillText.Draw();
    }  
    gameSpeed += 0.005;
}  
Start();