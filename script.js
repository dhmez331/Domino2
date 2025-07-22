// المتغيرات الأساسية لتخزين أسماء الفرق ونقاطهم
let teamAScore = 0;
let teamBScore = 0;
let teamAName = "الفريق الأول"; // قيمة افتراضية
let teamBName = "الفريق الثاني"; // قيمة افتراضية

// كل الأكواد التالية ستكون داخل هذا الحدث
document.addEventListener('DOMContentLoaded', () => {
    // الحصول على العناصر من HTML
    const teamAScoreElement = document.getElementById('teamA-score');
    const teamBScoreElement = document.getElementById('teamB-score');
    const teamANameElement = document.getElementById('teamA-name');
    const teamBNameElement = document.getElementById('teamB-name');
    const messagesElement = document.getElementById('messages');

    // عناصر شاشات البداية واللعب
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const inputTeamAName = document.getElementById('input-teamA-name');
    const inputTeamBName = document.getElementById('input-teamB-name');

    // **جديد:** عناصر الصوت
    const simaSound = new Audio('sima.mp3'); // تأكد من المسار الصحيح لملف sima.mp3
    const harqaSound = new Audio('harqa.mp3'); // تأكد من المسار الصحيح لملف harqa.mp3
    // يمكنك إضافة المزيد من الأصوات هنا إذا أردت، مثل صوت فوز عام، أو صوت عند إضافة النقاط.
    // مثال: const celebrationSound = new Audio('celebration.mp3');


    // دالة لتحديث عرض النقاط على الشاشة
    function updateScoresDisplay() {
        if (teamAScoreElement) teamAScoreElement.textContent = teamAScore;
        if (teamBScoreElement) teamBScoreElement.textContent = teamBScore;
    }

    // دالة لبدء اللعبة
    window.startGame = function() {
        const enteredTeamAName = inputTeamAName.value.trim();
        const enteredTeamBName = inputTeamBName.value.trim();

        teamAName = enteredTeamAName ? enteredTeamAName : "الفريق الأول";
        teamBName = enteredTeamBName ? enteredTeamBName : "الفريق الثاني";

        if (teamANameElement) teamANameElement.textContent = teamAName;
        if (teamBNameElement) teamBNameElement.textContent = teamBName;

        if (startScreen) startScreen.classList.add('hidden');
        if (gameScreen) gameScreen.classList.remove('hidden');

        // التأكد من تصفير النقاط والرسائل عند بدء لعبة جديدة
        teamAScore = 0;
        teamBScore = 0;
        updateScoresDisplay();
        if (messagesElement) {
            messagesElement.textContent = '';
            messagesElement.className = 'messages';
        }
        // إيقاف أي أصوات سابقة عند بدء لعبة جديدة
        simaSound.pause(); simaSound.currentTime = 0;
        harqaSound.pause(); harqaSound.currentTime = 0;
    };

    // دالة لإضافة النقاط
    window.addPoints = function(team, points) {
        const prevTeamAScore = teamAScore;
        const prevTeamBScore = teamBScore;

        if (team === 'A') {
            teamAScore += points;
        } else if (team === 'B') {
            teamBScore += points;
        }

        updateScoresDisplay();
        checkGameStatus(prevTeamAScore, prevTeamBScore);
    };

    // دالة لتصفير نقاط فريق واحد
    window.resetPoints = function(team) {
        if (team === 'A') {
            teamAScore = 0;
        } else if (team === 'B') {
            teamBScore = 0;
        }
        updateScoresDisplay();
        if (messagesElement) {
            messagesElement.textContent = '';
            messagesElement.className = 'messages';
        }
        // إيقاف أي أصوات عند التصفير
        simaSound.pause(); simaSound.currentTime = 0;
        harqaSound.pause(); harqaSound.currentTime = 0;
    };

    // دالة لإعادة تعيين المباراة بالكامل
    window.resetGame = function() {
        teamAScore = 0;
        teamBScore = 0;
        updateScoresDisplay();
        if (messagesElement) {
            messagesElement.textContent = '';
            messagesElement.className = 'messages';
        }

        if (gameScreen) gameScreen.classList.add('hidden');
        if (startScreen) startScreen.classList.remove('hidden');

        if (inputTeamAName) inputTeamAName.value = "";
        if (inputTeamBName) inputTeamBName.value = "";

        if (teamANameElement) teamANameElement.textContent = "الفريق الأول";
        if (teamBNameElement) teamBNameElement.textContent = "الفريق الثاني";

        // إيقاف أي أصوات عند إعادة اللعبة
        simaSound.pause(); simaSound.currentTime = 0;
        harqaSound.pause(); harqaSound.currentTime = 0;
    };

    // دالة للتحقق من حالة اللعبة (فوز، صيمة، حرقة)
    function checkGameStatus(prevTeamAScore, prevTeamBScore) {
        let winner = null;
        let message = '';
        let messageClass = 'messages';

        // إيقاف أي صوت سابق قبل تشغيل الصوت الجديد
        simaSound.pause(); simaSound.currentTime = 0;
        harqaSound.pause(); harqaSound.currentTime = 0;

        // التحقق من الفوز (أول فريق يوصل 11 أو أكثر ويكون متقدم)
        if (teamAScore >= 11 && teamAScore > teamBScore) {
            winner = teamAName;
        } else if (teamBScore >= 11 && teamBScore > teamAScore) {
            winner = teamBName;
        }

        if (winner) {
            // حالة "صيمة"
            if ((teamAScore >= 11 && teamBScore === 0) || (teamBScore >= 11 && teamAScore === 0)) {
                message = 'صيمة!';
                messageClass += ' sima';
                simaSound.play().catch(e => console.error("Error playing sima sound:", e)); // تشغيل صوت "صيمة"
            } else {
                message = `ألف مبروك ${winner}!`;
                messageClass += ' celebration';
                // يمكنك تشغيل صوت احتفال عام هنا: celebrationSound.play().catch(...)
            }
        } else {
            // حالة "حرقة"
            // إذا كان الفريق A متقدم 10-0 ثم الفريق B سجل أي نقطة (بحيث A لازال 10)
            if ( (prevTeamAScore === 10 && prevTeamBScore === 0 && teamBScore > 0 && teamAScore === 10) ||
                 (prevTeamBScore === 10 && prevTeamAScore === 0 && teamAScore > 0 && teamBScore === 10) )
            {
                message = 'حرقة!';
                messageClass += ' harqa';
                harqaSound.play().catch(e => console.error("Error playing harqa sound:", e)); // تشغيل صوت "حرقة"
            }
            // مسح الرسالة إذا لم يكن هناك فائز ولا حرقة
            else {
                message = '';
                messageClass = 'messages';
            }
        }

        if (messagesElement) {
            messagesElement.textContent = message;
            messagesElement.className = messageClass;
        }
    }

    // عند تحميل الصفحة، نضمن أن شاشة البدء هي اللي ظاهرة
    if (gameScreen) gameScreen.classList.add('hidden');
    if (startScreen) startScreen.classList.remove('hidden');
    updateScoresDisplay(); // تحديث العرض الأولي
}); // نهاية document.addEventListener('DOMContentLoaded')