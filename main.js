import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Firebase Initialization ---
// Note: Replace with actual config in a real environment
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "mmoorraacc1.firebaseapp.com",
    projectId: "mmoorraacc1",
    storageBucket: "mmoorraacc1.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- User Identity ---
let userId = localStorage.getItem('morrac_user_id') || 'visitor_' + Math.random().toString(36).substring(2, 9);
localStorage.setItem('morrac_user_id', userId);

// --- State Management ---
let currentTeaType = 'fresh'; 
let timerInterval = null;
let timeLeft = 120;
let isTimerRunning = false;

const teaData = {
    fresh: { title: '햇 녹차 우려내기', time: 120, badge: 'Present', color: '#3A483A', guide: '한 김 식힌 물을 붓고 가만히 기다려봅니다.' },
    matcha: { title: '햇 말차 격불하기', time: 60, badge: 'Vibrant', color: '#284228', guide: '차선(차솔)을 이용해 거품이 뽀얗게 올라올 때까지 저어줍니다.' },
    aged: { title: '묵은 보이차 깨우기', time: 180, badge: 'Past', color: '#524336', guide: '100도씨 뜨거운 물로 첫 탕을 가볍게 씻어낸(세차) 뒤 깊게 우립니다.' }
};

// --- Core Functions ---

export function switchTea(type) {
    currentTeaType = type;
    const data = teaData[type];
    
    // Reset Timer State
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = data.time;
    updateTimerDisplay();
    
    // Update UI
    const btnControl = document.getElementById('btn-timer-control');
    if (btnControl) btnControl.innerText = "우려내기 시작";
    
    const timerCard = document.getElementById('timer-card');
    if (timerCard) timerCard.style.backgroundColor = data.color;
    
    const titleEl = document.getElementById('timer-tea-title');
    if (titleEl) titleEl.innerText = data.title;
    
    const guideEl = document.getElementById('timer-guide');
    if (guideEl) guideEl.innerText = data.guide;
    
    const badgeEl = document.getElementById('tea-badge');
    if (badgeEl) badgeEl.innerText = data.badge;
    
    // Update Active Button Style
    ['fresh', 'matcha', 'aged'].forEach(t => {
        const btn = document.getElementById(`btn-${t}`);
        if(btn) {
            if(t === type) {
                btn.className = "tea-transition py-4 px-2 rounded-xl border-2 border-[#2C3E2B] bg-[#F4F7F4] text-[#2C3E2B] font-bold text-center flex flex-col items-center gap-1.5";
            } else {
                btn.className = "tea-transition py-4 px-2 rounded-xl border border-[#EFECE6] bg-white text-[#8A8073] font-medium text-center flex flex-col items-center gap-1.5";
            }
        }
    });
}

export function toggleTimer() {
    const btn = document.getElementById('btn-timer-control');
    if (isTimerRunning) {
        clearInterval(timerInterval);
        if (btn) btn.innerText = "다시 시작";
    } else {
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert(`⏰ ${teaData[currentTeaType].title} 과정이 끝났습니다. 차 향을 맡으며 잔에 나누어 보세요.`);
                if (btn) btn.innerText = "우려내기 완료";
                isTimerRunning = false;
            }
        }, 1000);
        if (btn) btn.innerText = "잠시 멈춤";
    }
    isTimerRunning = !isTimerRunning;
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const displayEl = document.getElementById('timer-display');
    if (displayEl) displayEl.innerText = `${minutes}:${seconds}`;
}

export async function saveTastingNote() {
    const weight = document.getElementById('flavor-weight').value;
    const preference = document.getElementById('flavor-preference').value;
    const memo = document.getElementById('flavor-memo').value;

    try {
        await setDoc(doc(db, "morrac_tasting_notes", `${userId}_${currentTeaType}`), {
            userId: userId,
            teaType: currentTeaType,
            weight: Number(weight),
            preference: Number(preference),
            memo: memo,
            timestamp: new Date()
        });
        alert('✨ 오늘의 감각이 모락 기록 보관함에 안전하게 담겼습니다.');
        const memoEl = document.getElementById('flavor-memo');
        if (memoEl) memoEl.value = '';
    } catch (e) {
        console.error("저장 실패: ", e);
        alert('기록 실패ㅠ Firebase 설정을 확인해주세요.');
    }
}

// Attach to window for HTML onclick handlers
window.switchTea = switchTea;
window.toggleTimer = toggleTimer;
window.saveTastingNote = saveTastingNote;

// Initialize first tea
document.addEventListener('DOMContentLoaded', () => {
    switchTea('fresh');
});
