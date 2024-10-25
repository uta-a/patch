/* Bypass Policy */
if(!trustedTypes.defaultPolicy) {
    trustedTypes.createPolicy('default', {
        createHTML: string => string,
        createScriptURL: string => string,
        createScript: string => string,
    });
}


/* Framework HTML */
let framework = document.createElement('iframe');
framework.classList.add('closed');
framework.frameborder = 0;
framework.classList.add('framework');
framework.id = 'framework';
document.body.appendChild(framework);
let notifyFrame = document.createElement('iframe');
notifyFrame.frameborder = 0;
notifyFrame.classList.add('notifyFrame');
notifyFrame.id = 'notifyFrame';
document.body.appendChild(notifyFrame);
try {
    /* iframe Bypass Policy */
    framework.contentWindow.trustedTypes.createPolicy('default', {
        createHTML: string => string,
        createScriptURL: string => string,
        createScript: string => string,
    });

    notifyFrame.contentWindow.trustedTypes.createPolicy('default', {
        createHTML: string => string,
        createScriptURL: string => string,
        createScript: string => string,
    });
}
catch {};


/* Framework CSS */
let fwStyle = document.createElement('style');
fwStyle.textContent = `
    #framework {
        display: flex;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
        z-index: 9998;
        transition: opacity 0.1s;
    }

    .notifyFrame {
        display: flex;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
        z-index: 9999;
        pointer-events: none;
    }

    .closed {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.1s;
    }
`;
document.body.appendChild(fwStyle);


/* Framework INNER */
framework.contentWindow.document.open();
framework.contentWindow.document.write(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>レスポンシブグリッド</title>
    <style>
        /* light mode */
        :root {
            /* --container-bg: rgb(0 0 0 / 50%);   dark */
            --container-bg: rgb(255 255 255 / 50%);   /* light */
            --box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 50%); 
            --item-bg: rgb(255 255 255 / 50%);
            --panel: rgb(229 229 229 / 80%);
        }

        .frame {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            transition: opacity 0.2s;
        }

        .container {
            background-color: var(--container-bg);
            width: 90%;
            height: 90%;
            box-shadow: var(--box-shadow);
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            overflow-y: auto;
            backdrop-filter: blur(15px);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            width: 100%;
            padding: 20px;
            margin: 50px;
            overflow-y: auto;
        }

        .item {
            background-color: var(--item-bg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            aspect-ratio: 16 / 9;
            padding: 20px;
            box-sizing: border-box;
            border-radius: 15px;
            box-shadow: var(--box-shadow);
        }

        h1 {
            margin: 0;
            font-weight: bold;
            margin-bottom: 15px;
            font-family: sans-serif;
        }

        .controls {
            display: flex;
            align-items: center;
            gap: 1.2rem;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 50px; /* 元のサイズに戻す */
            height: 28px; /* 元のサイズに戻す */
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgb(204 204 204 / 50%);
            border-radius: 3px;
            transition: 0.4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 20px; /* ボールのサイズを元に戻す */
            width: 20px;
            left: 4px;
            bottom: 4px;
            background-color: rgb(255 255 255 / 80%);
            border-radius: 3px;
            transition: 0.4s;
        }

        input:checked + .slider {
            /* background-color: #4caf50; */
            background-color: rgb(76 175 80 / 80%);
        }

        input:checked + .slider:before {
            transform: translateX(22px); /* 元の移動距離に戻す */
        }

        .setting-btn,
        .custom-setting-btn
        {
            background-color: rgb(76 175 80 / 90%); /* ボタンの背景色 */
            color: white; /* ボタンのテキスト色 */
            padding: 4px 8px; /* ボタンのパディング */
            border: none; /* ボーダーを無効に */
            border-radius: 3px; /* 角を丸くする */
            cursor: pointer; /* カーソルをポインターに */
            transition: background-color 0.3s ease; /* ホバー効果のトランジション */
        }

        .setting-btn:hover {
            background-color: #45a049; /* ホバー時の背景色 */
        }



        /* レスポンシブ調整 */
        @media (max-width: 768px) {
            p {
                font-size: 4vw;
            }

            .switch {
                width: 40px;
                height: 24px;
            }

            .slider:before {
                width: 16px;
                height: 16px;
            }

            .settings-btn img {
                width: 24px;
                height: 24px;
            }

            .settings-btn {
                margin-left: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="frame" onclick="parent.frameCtrl()">
        <div class="container" id="container">
            <div class="grid">

                <div class="item">
                    <h1>Dark Mode</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>YTSkip</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                        <button class="custom-setting-btn" onclick="customSetting1(event)">MODE</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>Loop CTRL</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>ICON</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>Quick Video</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>Shorts CTRL</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <div class="item">
                    <h1>Video CTRL</h1>
                    <div class="controls">
                        <label class="switch">
                            <input type="checkbox" class="check-box">
                            <span class="slider"></span>
                        </label>
                        <button class="setting-btn">詳細</button>
                    </div>
                </div>
                
                <!-- 他のアイテムも同様 -->
            </div>
        </div>
    </div>

    <!-- library -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <script>
        /* StopPropagation */
        document.getElementsByClassName('container')[0].addEventListener('click', e => {
            e.stopPropagation();
        });



        /* Setting */
        let settingBtn = document.getElementsByClassName('setting-btn');
        let checkBox = document.getElementsByClassName('check-box');

        for(i = 0; i < checkBox.length; i++) {
            checkBox[i].id = 'toggle' + i;
            checkBox[i].addEventListener('click', ()=> {
                save();
                console.log('saved');                
            });
            checkBox[i].setAttribute('onclick','func' + i + '(event)');
        
            settingBtn[i].id = 'setting' + i;
            settingBtn[i].setAttribute('onclick','setting' + i + '(event)');
        }



        /* load */
        if(localStorage.getItem('save')) {
            let save = JSON.parse(localStorage.getItem('save'));
            for(let key in save) {
                if(save[key]) {
                    document.getElementById(key).click();
                }
            }
        }



        /* save */
        function save() {
            let save = {};
            Array.from(checkBox).forEach(elm => {
                let id = elm.id;
                let isChecked = elm.checked;
                save[id] = isChecked;
            });
            localStorage.setItem('save',JSON.stringify(save));
        }



        /* notifycation */
        function notify(icon, title, text, time) {
            parent.notify(icon, title, text, time);
        }



        /* prevent keys */
        let preventKeys = false;
        Array.from(parent.document.getElementsByTagName('input')).forEach(e => {
            preventKeysFunc(e);
        });
        Array.from(parent.document.getElementsByTagName('textarea')).forEach(e => {
            preventKeysFunc(e);
        });
        parent.document.querySelectorAll('div[role="textbox"]').forEach(e => {
            preventKeysFunc(e);
        });
        function preventKeysFunc(e) {
            e.onfocus = function() {
                preventKeys = true;
            };
            e.onblur = function() {
                preventKeys = false;
            };
        }



        /* Main.js */
        setTimeout(() => {
            notify("success", "Patchが適応されました", "", 2000);
        }, 2000);

        /* Theme */
        function setting0() {
            Swal.fire({
                title: "テーマの切り替え",
                text: "Light Mode / Dark Mode",
                icon: "question"
            });
        }
        function func0(e) {
            let isChecked = e.target.checked;
            if(isChecked) {
                document.documentElement.style.setProperty('--container-bg', 'rgb(0 0 0 / 50%)'); /* dark */
            }
            else {
                document.documentElement.style.setProperty('--container-bg', 'rgb(255 255 255 / 50%)');   /* light */
            }
        }



        /* YTskip */
        async function setting1() {
            let pbRate = localStorage.getItem('pbRate') ? localStorage.getItem('pbRate') : 8;
            let res = await Swal.fire({
                title: "YTskip",
                icon: "question",
                input: "range",
                inputLabel: "広告再生速度 (n倍速モードのみ)",
                inputAttributes: {
                    min: "2",
                    max: "16",
                    step: "0.5"
                },
                showCancelButton: true,
                inputValue: pbRate
            });

            if(res.value) {
                localStorage.setItem('pbRate',res.value);
                console.log('saved');
            }
        }
        async function customSetting1() {
            let currentMode = localStorage.getItem("mode") ? localStorage.getItem("mode") : "pbRate";
            const { value: mode } = await Swal.fire({
            title: "Select Mode",
            input: "radio",
            inputValue: currentMode,
            inputOptions: {
                "pbRate": "n倍速再生 ",
                "skip": "即スキップ (不安定)"
            },
            inputValidator: (value) => {
                if (!value) {
                    return "You need to choose something!";
                }
            }
            });
            if(mode == "pbRate") localStorage.setItem("mode","pbRate");
            if(mode == "skip") localStorage.setItem("mode","skip");
        }
        let fn;
        let ad = true;
        let skipFlag = false;
        function func1(e) {
            let isChecked = e.target.checked;
            if(isChecked) {
                fn = setInterval(YTskip, 10);
            }else {
                clearInterval(fn);
            }

            function YTskip() {
                try {
                    let mode = localStorage.getItem("mode");
                    if(!mode || mode == "pbRate") skip_v2();
                    else skip_v1();
                }
                catch {}

                /* 時間を飛ばすver */
                function skip_v1() {
                    let video = parent.document.getElementsByClassName('html5-main-video')[0];
                    let ad_module = parent.document.getElementsByClassName('video-ads ytp-ad-module')[0];
                    if(ad_module.hasChildNodes() && !skipFlag) {
                        let duration = parent.document.getElementsByClassName('ytp-time-duration')[0].textContent.split(':');
                        let ad_time = Number(duration[0] *60) + Number(duration[1]);
                        video.currentTime = ad_time;
                        video.play();
                        skipFlag = true;

                        setTimeout(() => {
                            skipFlag = false;
                        }, 1000);
                    }
                }

                /* 強制倍速再生 */
                function skip_v2() {
                    let video = parent.document.getElementsByClassName('html5-main-video')[0];
                    let ad_module = parent.document.getElementsByClassName('video-ads ytp-ad-module')[0];
                    let pbRate = localStorage.getItem('pbRate') ? localStorage.getItem('pbRate') : 8;
                    if(ad_module.hasChildNodes()) {
                        video.playbackRate = pbRate;
                    }
                    else if(ad) {
                        video.playbackRate = 1;
                    }
                }
            }
        }
        


        /* Loop CTRL */
        function setting2() {
            Swal.fire({
                title: "Loop CTRL",
                text: "動画のLoopを右シフトキーで切り替える事ができます。",
                icon: "question"
            });
        }
        function func2(e) {
            let isChecked = e.target.checked;
            if(isChecked) parent.document.addEventListener('keydown', loopCTRL);
            else parent.document.removeEventListener('keydown', loopCTRL);
        }
        function loopCTRL(e) {
            if(e.key == 'Shift' && e.location == 2) {
                const video = parent.document.getElementsByClassName('html5-main-video')[0];
                if(video.getAttribute('loop') == '') {
                    video.removeAttribute('loop');
                    notify("error", "Loop Disabled", "", 1000);
                }else {
                    video.setAttribute('loop','');
                    notify("success", "Loop Enaabled", "", 1000);
                }
            }
        }



        /* icon change */
        function setting3() {
            Swal.fire({
                title: "Icon Change",
                text: "Patchを適応しているタブのアイコンを変更します。",
                icon: "question"
            });
        }
        function func3(e) {
            let isChecked = e.target.checked;
            if(isChecked) icon('https://revancedextended.com/wp-content/uploads/2023/08/revanced-extended-youtube-icon-150x150.webp');
            else icon('https://www.youtube.com/s/desktop/1d05d8a6/img/favicon_144x144.png');
            
            function icon(url) {
                const iconUrl = url;
                const icon1 = parent.document.querySelector('link[rel="shortcut icon"]');
                const icon2 = parent.document.querySelectorAll('link[rel="icon"]');
                if(icon1){ 
                    icon1.setAttribute('href',iconUrl);
                }
                for (i = 0; i < icon2.length; i++) {
                    icon2[i].setAttribute('href',iconUrl);
                }
            }
        }

        /* Quick Video */
        function setting4() {
            Swal.fire({
                title: "Quick Video",
                text: "[D]キーを押している間だけ再生速度を2倍速で視聴できます",
                icon: "question"
            });
        }
        function func4(e) {
            let isChecked = e.target.checked;
            if(isChecked) {
                parent.document.addEventListener('keydown', qvDown);
                parent.document.addEventListener('keyup', qvUp);
            }
            else {
                parent.document.removeEventListener('keydown', qvDown);
                parent.document.removeEventListener('keyup', qvUp);
            }
        }
        function qvDown(e) {
            if(e.key == 'd') {
                const video = parent.document.getElementsByClassName('html5-main-video')[0];
                const popup = parent.document.getElementsByClassName('ytp-overlay ytp-speedmaster-overlay')[0];
                video.playbackRate = 2;
                popup.style.display = 'unset';
                ad = false;
            }
        }
        function qvUp(e) {
            if(e.key == 'd') {
                const video = parent.document.getElementsByClassName('html5-main-video')[0];
                const popup = parent.document.getElementsByClassName('ytp-overlay ytp-speedmaster-overlay')[0];
                video.playbackRate = 1;
                popup.style.display = 'none';
                ad = true;
            }
        }



        /* Shorts CTRL */
        function setting5() {
            Swal.fire({
                title: "Shorts CTRL",
                text: "左右矢印キーで通常の動画のようにshortsを操作できます",
                icon: "question"
            });
        }
        function func5(e) {
            let isChecked = e.target.checked;
            if(isChecked) parent.addEventListener('keydown', shortsCTRL);
            else parent.removeEventListener('keydown', shortsCTRL);
        }
        function shortsCTRL() {
            let offset = 3;
            if(location.href.split('/')[3] == 'shorts') {
                const shortsVideo = parent.document.getElementsByClassName('html5-main-video')[0];
                if(e.key == 'ArrowLeft') {
                    shortsVideo.currentTime -= offset;
                }
                if(e.key == 'ArrowRight') {
                    shortsVideo.currentTime += offset;
                }
            }
        }



        /* Video CTRL */
        function setting6() {
            Swal.fire({
                title: "Video CTRL",
                text: "[H], [;]キーで次の動画、前の動画に移動することができます",
                icon: "question"
            });
        }
        function func6(e) {
            let isChecked = e.target.checked;
            if(isChecked) parent.document.addEventListener('keydown', videoCTRL);
            else parent.document.removeEventListener('keydown', videoCTRL);
        }
        function videoCTRL(e) {
            const video = parent.document.getElementsByClassName('html5-main-video')[0];
            let videoScN = ';';
            let videoScB = 'h';
            if(e.key == videoScN && !preventKeys) {
                video.dispatchEvent(new KeyboardEvent('keydown', {
                    keyCode: 78,
                    shiftKey: true,
                    bubbles: true
                }));
            }
            if(e.key == videoScB && !preventKeys) {
                video.dispatchEvent(new KeyboardEvent('keydown', {
                    keyCode: 80,
                    shiftKey: true,
                    bubbles: true
                }));
            }
        }

    </script>
</body>
</html>
`);
framework.contentWindow.document.close();

let library = document.createElement('script');
library.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
notifyFrame.contentWindow.document.body.appendChild(library);


/* Framework CTRL */
function frameCtrl() {
    try {
        framework.classList.toggle('closed');
        window.focus();
    }
    catch {
        parent.framework.classList.toggle('closed');
        parent.window.focus();
    }
}


/* HotKey */
window.addEventListener('keydown', setupHotkeys);
framework.contentWindow.addEventListener('keydown', setupHotkeys);
function setupHotkeys(e) {
    if(e.key == 'Alt' && e.location == 1 && !preventKeys) {
        e.preventDefault();
        frameCtrl();
    }
}

/*inputやtextareaなどで誤爆を防ぐ*/
let preventKeys = false;
Array.from(document.getElementsByTagName('input')).forEach(e => {
    preventKeysFunc(e);
});
Array.from(document.getElementsByTagName('textarea')).forEach(e => {
    preventKeysFunc(e);
});
document.querySelectorAll('div[role="textbox"]').forEach(e => {
    preventKeysFunc(e);
});
function preventKeysFunc(e) {
    e.onfocus = function() {
        preventKeys = true;
    };
    e.onblur = function() {
        preventKeys = false;
    };
}

/* notifycation */
function notify(icon, title, text, time) {
    notifyFrame.contentWindow.Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
    }).fire({
        icon: icon,
        title: title,
        text: text,
    });
}