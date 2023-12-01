let selectedItem = null;

let isPopupOpen = false;

// 치트
document.addEventListener('keydown', function (evt) {
    if (evt.code === 'KeyR' && !isPopupOpen) {
        const userInput = prompt('Write "Main" to change the page:');
        if (userInput && userInput.toLowerCase() === 'main') {
            window.location.href = 'index.html';
        }
        isPopupOpen = true;
    }
});

window.addEventListener('beforeunload', function () {
    isPopupOpen = false;
});


// 아이템 목록과 등급에 따른 확률
const items = [
    { name: "타오르는 탄생의 불꽃 - 염룡", rarity: "PRESTIGE", chance: 3 },
    { name: "작은 별빛 - 별룡", rarity: "Legendary", chance: 15 },
    { name: "ERROR - NaN", rarity: "Epic", chance: 30 },
    { name: "강철처럼 단단한 - 기계룡", rarity: "Rare", chance: 60 },
    { name: "초록초록! - 그냥 공룡", rarity: "Common", chance: 100 }
];

// 가챠 버튼 엘리먼트 가져오기
const gachaButton = document.getElementById("gacha-button");
const saveButton = document.getElementById("save-button");

// 결과 표시 엘리먼트 가져오기
const resultElement = document.getElementById("result");

// 로딩 엘리먼트 가져오기
const loadingElement = document.getElementById("loading");


// 가챠 버튼 클릭 이벤트 핸들러
gachaButton.addEventListener("click", () => {
    // 가챠 버튼 비활성화 및 로딩 표시
    gachaButton.disabled = true;
    loadingElement.style.display = "block";

    // 1.5초 후에 아이템 획득 및 로딩 숨기기
    setTimeout(() => {
        // 랜덤으로 아이템 선택
        const randomChance = Math.random() * 100;

        for (const item of items) {
            if (randomChance <= item.chance) {
                selectedItem = item;
                break;
            }
        }

        // 결과를 화면에 표시
        if (selectedItem) {
            let itemText = selectedItem.name;
            if (selectedItem.rarity === "PRESTIGE") {
                itemText = `<span class="fire">${itemText}</span>`;
            }
            else if(selectedItem.rarity === "Legendary"){
                itemText = `<span class="stars">${itemText}</span>`;
            }
            else if(selectedItem.rarity === "Epic"){
                itemText = `<span class="error">${itemText}</span>`;
            }
            else if(selectedItem.rarity === "Rare"){
                itemText = `<span class="machine">${itemText}</span>`;
            }

            let itemImage = ''; // 이미지 태그를 저장할 변수
            
            let rarityText = selectedItem.rarity;
            if (selectedItem.rarity === "PRESTIGE") {
                document.getElementById("prestigeImage").style.display = "block";
                rarityText = '<span class="prestige">' + rarityText + '</span>';
            } else {
                document.getElementById("prestigeImage").style.display = "none";
            }
            if (selectedItem.rarity === "Legendary") {
                document.getElementById("LegendaryImage").style.display = "block";
                rarityText = '<span class="Legend">' + rarityText + '</span>';
            } else {
                document.getElementById("LegendaryImage").style.display = "none";
            }
            if (selectedItem.rarity === "Epic") {
                document.getElementById("EpicImage").style.display = "block";
                rarityText = '<span class="Epic">' + rarityText + '</span>';
            } else {
                document.getElementById("EpicImage").style.display = "none";
            }
            if (selectedItem.rarity === "Rare") {
                document.getElementById("RareImage").style.display = "block";
                rarityText = '<span class="Rare">' + rarityText + '</span>';
            } else {
                document.getElementById("RareImage").style.display = "none";
            }
            if (selectedItem.rarity === "Common") {
                document.getElementById("CommonImage").style.display = "block";
                rarityText = '<span class="Common">' + rarityText + '</span>';
            } else {
                document.getElementById("CommonImage").style.display = "none";
            }
            
            resultElement.innerHTML = "공룡이 나타났다! : " + itemText + " (" + rarityText + ")";
        }

        // 로딩 숨기고 가챠 버튼 활성화
        loadingElement.style.display = "none";
        gachaButton.disabled = false;
    }, 1500);
});

// 저장 버튼 클릭 이벤트 핸들러
saveButton.addEventListener("click", () => {
    if (selectedItem) {
        // 아이템 정보를 로컬 스토리지에 저장
        localStorage.setItem("obtainedItem", JSON.stringify(selectedItem));
        alert("나타난 공룡을 데려간다!!");
    } else {
        alert("저런, 데려갈 공룡이 없네요..");
    }
});
