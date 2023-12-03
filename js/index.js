var audio1 = new Audio('Sounds/move.mp3'); // 화면 전환 효과음
var audio2 = new Audio('Sounds/ost.mp3'); // 배경음악
var isMuted = false; // 음소거 상태 변수

document.addEventListener('DOMContentLoaded', function() {
    var anime = document.getElementById('content-bottom');

document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    audio1.volume = 0.8;
    audio1.play();
    anime.classList.add('fade-out');
    setTimeout(function(){
      window.location.href = 'main.html'; 
    }, 1000);
  }

  if (event.key === 'm') {
    if (!isMuted) {
      audio2.pause();
      isMuted = true;
    } else {
      audio2.loop = true;      
      audio2.volume = 0.8;
      audio2.play()
      isMuted = false;
    }
    }
    });
});
