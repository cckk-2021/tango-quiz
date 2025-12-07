// ▼ ローカルストレージに単語を保存する
function saveWords() {
    localStorage.setItem("tangoWords", JSON.stringify(words));
}

// ▼ ローカルストレージから単語を読み込む
function loadWords() {
    const data = localStorage.getItem("tangoWords");
    if (data) {
        return JSON.parse(data);
    } else {
        return null;
    }
}

// ローカルストレージに保存されている単語データを読み込み
let storedWords = loadWords();

// データがあればそれを使い、なければ初期データを使う
let words = storedWords || [
    { word: "apple", meaning: "りんご" },
    { word: "book", meaning: "本" },
    { word: "dog", meaning: "犬" }
];

let currentIndex = 0;
let shuffledWords = [];

// ▼ 配列をシャッフルする関数
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// ▼ クイズを開始する
function startQuiz() {
    shuffledWords = shuffleArray([...words]);
    currentIndex = 0;
    showQuestion();
}

// ▼ 問題を表示する
function showQuestion() {
    const questionEl = document.getElementById("question");
    const choicesEl = document.getElementById("choices");
    const nextBtn = document.getElementById("next-btn");

    if (shuffledWords.length === 0) {
        questionEl.textContent = "単語がありません。単語を追加してください。";
        choicesEl.innerHTML = "";
        nextBtn.style.display = "none";
        return;
    }

    const currentWord = shuffledWords[currentIndex];

    questionEl.textContent = `「${currentWord.word}」の意味は？`;

    choicesEl.innerHTML = "";

    let choices = [currentWord.meaning];

    const wrongChoices = words
        .filter(w => w.meaning !== currentWord.meaning)
        .map(w => w.meaning);

    choices.push(...shuffleArray(wrongChoices).slice(0, 2));

    choices = shuffleArray(choices);

    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice;
        btn.className = "choice-btn";

        btn.onclick = () => checkAnswer(choice, currentWord.meaning);

        choicesEl.appendChild(btn);
    });

    nextBtn.style.display = "none";
}

// ▼ 答えをチェック
function checkAnswer(selected, correct) {
    const nextBtn = document.getElementById("next-btn");
    const buttons = document.querySelectorAll(".choice-btn");

    buttons.forEach(btn => {
        btn.disabled = true;

        if (btn.textContent === correct) {
            btn.style.background = "#8fe68f";
        }
        if (btn.textContent === selected && selected !== correct) {
            btn.style.background = "#ff9999";
        }
    });

    nextBtn.style.display = "block";
}

// ▼ 次の問題へ
document.getElementById("next-btn").onclick = () => {
    currentIndex++;

    if (currentIndex < shuffledWords.length) {
        showQuestion();
    } else {
        finishQuiz();
    }
};

// ▼ クイズ終了
function finishQuiz() {
    document.getElementById("question").textContent = "クイズ終了！お疲れさま！";
    document.getElementById("choices").innerHTML = "";
    document.getElementById("next-btn").style.display = "none";
}

// ▼ 単語を追加する
document.getElementById("add-btn").onclick = () => {
    const newWord = document.getElementById("add-word").value.trim();
    const newMeaning = document.getElementById("add-meaning").value.trim();

    if (newWord === "" || newMeaning === "") {
        alert("単語と意味を入力してください");
        return;
    }

    words.push({ word: newWord, meaning: newMeaning });
    saveWords();
    document.getElementById("add-word").value = "";
    document.getElementById("add-meaning").value = "";

    alert("単語を追加しました！");

    startQuiz();
    renderWordList();
};

// ▼ 単語一覧を表示する
function renderWordList() {
    const listEl = document.getElementById("word-list");
    listEl.innerHTML = "";

    words.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "word-item";

        row.innerHTML = `
            <span>${item.word} ： ${item.meaning}</span>
            <div>
               <button class="edit-btn" onclick="editWord(${index})">編集</button>
               <button class="delete-btn" onclick="deleteWord(${index})">削除</button>
            </div>
        `;

        listEl.appendChild(row);
    });
}

// ▼ 単語を削除する
function deleteWord(index) {
    if (!confirm("本当に削除しますか？")) return;

    words.splice(index, 1);
    saveWords();
    renderWordList();
    startQuiz();
}

// ▼ ページ読み込み時にクイズ開始 & 一覧表示
startQuiz();
renderWordList();

function editWord(index) {
    const item = words[index];

    // 新しい単語と意味を入力させる
    const newWord = prompt("単語を修正してください：", item.word);
    if (newWord === null) return;

    const newMeaning = prompt("意味を修正してください：", item.meaning);
    if (newMeaning === null) return;

    // 入力チェック
    if (newWord.trim() === "" || newMeaning.trim() === "") {
        alert("空の値は登録できません");
        return;
    }

    // データ更新
    words[index] = {
        word: newWord.trim(),
        meaning: newMeaning.trim()
    };

    // 保存
    saveWords();

    // 画面更新
    renderWordList();
    startQuiz();

    alert("単語を修正しました！");
}
