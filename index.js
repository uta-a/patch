const sidepanelHtml = `
    <framework id="framework" class="closed" onclick="(function() {
            const framework = document.getElementById('framework');
            const sidepanel = document.getElementById('sidepanel');
            if(framework.className == 'closed') {
                framework.className = '';
                sidepanel.className = '';
            } else {
                framework.className = 'closed';
                sidepanel.className = 'closed';
            }
            })()">
        <iframe id="sidepanel" class="closed" frameborder="0"></iframe>
    </framework>
    <style>
        #framework.closed {
            pointer-events: none;
            backdrop-filter: none;
            transition: 200ms;
        }
        #framework {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: fixed;
            display: flex;
            justify-content: flex-end;
            pointer-events: auto;
            z-index: 9999;
            backdrop-filter: blur(10px);
            transition: 200ms;
            align-items: center;
        }

        #sidepanel.closed {
            pointer-events: none;
            transition: 200ms;
            transform: translateX(100%);
        }
        #sidepanel {
            width: 25%;
            height: 100%;
            pointer-events: auto;
            background: rgb(22 32 43 / 85%);
            transition: 200ms;
            transform: translateX(0%);
        }
    </style>
`;
document.body.insertAdjacentHTML("beforeend",sidepanelHtml);


const sidepanel = document.getElementById('sidepanel');
sidepanel.contentWindow.trustedTypes.createPolicy('default', {
    createHTML: string => string,
    createScriptURL: string => string,
    createScript: string => string,
});
sidepanel.contentDocument.open();
sidepanel.contentDocument.write(`
<html>
    <head>
        <style>
            container {
                overflow-y: auto;
            }

            .setting-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px 5px 20px;
                border-bottom: 1px solid #595959;
            }

            .setting-info {
                max-width: 85%;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            h2#m2title {
                margin: 0;
                padding: 0;
                color: #ecf0f1;
                font-weight: bold;
            }

            p#discription {
                margin: 0;
                padding: 0;
                color: #a3a3a3;
            }

            .switch {
                position: relative;
                display: inline-block;
                width: 40px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            input:checked+.slider {
                background-color: #2196F3;
            }

            input:checked+.slider:before {
                transform: translateX(16px);
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: #fff;
                transition: 0.4s;
                border-radius: 50%;
            }
        </style>
    </head>
    <body>
        <container>
        </container>
    </body>
<html>
`);
sidepanel.contentDocument.close();

/*サイドパネル操作*/
function sidepanelCtrl() {
    const framework = document.getElementById('framework');
    const sidepanel = document.getElementById('sidepanel');
    if(framework.className == 'closed') {
        framework.className = '';
        sidepanel.className = '';
    } else {
        framework.className = 'closed';
        sidepanel.className = 'closed';
    }
}

/*トグルボタン追加*/
function addToggleButton(title, discription, id) {
    const html = `
    <div class="setting-item">
        <div class="setting-info">
          <h2 id="m2title">${title}</h2>
          <p id="discription">${discription}</discription>
        </div>
        <label class="switch">
          <input type="checkbox" id="${id}">
          <span class="slider"></span>
        </label>
    </div>`;
    const content = document.createRange().createContextualFragment(html);

    /*設定がすでにあるか？*/
    let setting;
    try {
        setting = JSON.parse(localStorage.getItem('setting'))[id];
    } catch {
        setting = false;
    }
    if(setting) {
        content.getElementById(id).setAttribute('checked','');
    }

    /*クリックするたびに設定が保存される*/
    content.getElementById(id).addEventListener('change', () => {
        /*保存処理*/
        let setting = {};
        Array.from(sidepanel.contentDocument.getElementsByClassName('setting-item')).forEach(e => {
            let isCheck = e.getElementsByTagName('input')[0].checked;
            let inputid = e.getElementsByTagName('input')[0].id;
            setting[inputid] = isCheck;
        });
        localStorage.setItem('setting',JSON.stringify(setting));
    });

    /*modmenuに追加*/
    sidepanel.contentDocument.getElementsByTagName('container')[0].appendChild(content);
}

/*Hotkey*/
let flag = false;
let itv;
document.addEventListener('keydown',hotkey);
sidepanel.contentDocument.addEventListener('keydown',hotkey);
function hotkey(e) {
    if(!preventKeys) {
        let hotkey = localStorage.getItem('hotkey') || 'Alt';
        let hkLocation = localStorage.getItem('hkLocation') || '1';
        if(e.key == 'Backspace' && !flag) {
            let ques = confirm('ショートカットキーを変更しますか？');
            if(ques) {
                setTimeout(() => {
                    flag = true;
                    itv = setTimeout(() => {
                        alert('５秒間操作がなかったため、初めからやり直してください');
                        flag = false;
                    }, 5000);
                }, 1);
            }
        }
        if(e.key != 'Backspace' && flag) {
            e.preventDefault();
            localStorage.setItem('hotkey',e.key);
            localStorage.setItem('hkLocation',e.location);
            alert(`ショートカットキーを${e.key}(${e.location})に設定しました`);
            flag = false;
            clearTimeout(itv);
        }
        /*gui*/
        if(e.key == hotkey && e.location == hkLocation && !flag) {
            e.preventDefault();
            sidepanelCtrl();
        }
    }
}

/*inputやtextareaなどで誤爆を防ぐ*/
let preventKeys = false;
Array.from(document.getElementsByTagName('input')).forEach(e => {
    e.onfocus = function() {
        preventKeys = true;
    };
    e.onblur = function() {
        preventKeys = false;
    };
});
Array.from(document.getElementsByTagName('textarea')).forEach(e => {
    e.onfocus = function() {
        preventKeys = true;
    };
    e.onblur = function() {
        preventKeys = false;
    };
});
document.querySelectorAll('div[role="textbox"]').forEach(e => {
    e.onfocus = function() {
        preventKeys = true;
    };
    e.onblur = function() {
        preventKeys = false;
    };
});

/*/////////////////////////////*/

/*first time*/
if(!localStorage.getItem('setting')) {  sidepanelCtrl();  };
notify('Loaded SidePanel');

/*Notification*/
async function notify(text) {
    if(document.getElementsByClassName('ov').length) {
        document.getElementsByClassName('ov')[0].remove();
    }
    const ovray = document.createElement('div');
    ovray.className = 'ov';
    ovray.textContent = text;
    ovray.setAttribute('style', `
        
        box-shadow: 0 4px 15px rgb(0 148 162);
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgb(22 32 43);
        padding: 16px;
        border: 1px solid rgb(174 32 255 / 0%);
        color: #ecf0f1;
        font-size: 200%;
        transition: 0.5s;
        opacity: 0;
        border-radius: 5px;
        z-Index: 9999;

    `);
    document.body.appendChild(ovray);
    ovray.style.opacity = 1;
    await sleep(1000);
    ovray.style.opacity = 0;
    await sleep(500);
    ovray.remove();
}

/*sleep関数*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

addToggleButton('広告スキップ','自動で広告をスキップしてくれます','ad');
addToggleButton('LOOP','右シフトキーを押すと自動で動画がループされます','loop');
addToggleButton('ICON','Patchが適応されているページのアイコンが変更されます','icon');
addToggleButton('Quick Vide','「D」キーを押している間ビデオを２倍速で再生することができます','quickVideo');
addToggleButton('静止画','動画を流さずサムネイルのみ映します','simage');
addToggleButton('PlaybackRate','「 @ 」キーを押すと動画の再生速度を変更できます','pbr');
addToggleButton('SHORTS','shortsで矢印キーが使えるようになります','shorts');
addToggleButton('AutoShorts','ショートが自動で次の動画に進むようになります','autoshorts');
addToggleButton('VideoCTRL','「 H 」,「 ; 」キーで動画を戻る進むができます','videoctrl');


/*updata*/
checkUpdata('beta v3.4','正式リリース v3.4\nバグなどがあったら報告よろ\nAltキーで開ける\nバックスペースでショートカットキー変更');
function checkUpdata(ver, notify) {
    const localVersion = localStorage.getItem('version');
    if(localVersion == null || localVersion != ver) {
        localStorage.setItem('version',ver);
        if(notify) {
            alert(notify);
        }
    }
}

/*skip*/
main();
function main() {
    const ad = sidepanel.contentDocument.getElementById('ad');
    let ad_skip = true;
    setInterval(() => {
        if(ad.checked && ad_skip) {
            const video = document.getElementsByClassName('html5-main-video')[0];
            const ad_module = document.getElementsByClassName('video-ads ytp-ad-module');
            const ad_button = document.getElementsByClassName('ytp-skip-ad-button');

            if(ad_module.length && ad_module[0].childElementCount) {
                video.currentTime = video.duration;
                if(ad_button.length) {
                    ad_button[0].click();
                }
                video.play();
                ad_skip = false;
            }

            setTimeout(() => {
                ad_skip = true;
            }, 1000);
        }
    }, 100);
}

/*loopコントロール*/
loopCtrl();
function loopCtrl() {
    const loop = sidepanel.contentDocument.getElementById('loop');
    document.addEventListener('keydown',e => {
        if(e.key == 'Shift' && e.location == 2 && !preventKeys && loop.checked) {
            const video = document.getElementsByClassName('html5-main-video')[0];
            if(video.getAttribute('loop') == '') {
                video.removeAttribute('loop');
                notify('Loop Disabled');
            }else {
                video.setAttribute('loop','');
                notify('Loop Enabled');
            }
        }
    })
}

/*icon変更*/
changeIcon();
function changeIcon() {
    const icon = sidepanel.contentDocument.getElementById('icon');
    icon.addEventListener('change',ic);
    ic();
    
    function ic() {
        if(icon.checked) {
            iconSrc('https://revancedextended.com/wp-content/uploads/2023/08/revanced-extended-youtube-icon-150x150.webp');
        } else {
            iconSrc('https://www.youtube.com/s/desktop/1d05d8a6/img/favicon_144x144.png');
        }
        function iconSrc(url) {
            const iconUrl = url;
            const icon1 = document.querySelector(`link[rel="shortcut icon"]`);
            const icon2 = document.querySelectorAll(`link[rel="icon"]`);
            if(icon1){ 
                icon1.setAttribute(`href`,iconUrl);
            }
            for (i = 0; i < icon2.length; i++) {
                icon2[i].setAttribute(`href`,iconUrl);
            }
        }
    }
}

/*shortコントロール*/
shortCtrl(3);
function shortCtrl(offset) {
    const shorts = sidepanel.contentDocument.getElementById('shorts');
    document.addEventListener('keydown',e => {
        if(!preventKeys && location.href.split(`/`)[3] == 'shorts' && shorts.checked) {
            const shortsVideo = document.getElementsByClassName('html5-main-video')[0];
            if(e.key == `ArrowLeft`) {
                shortsVideo.currentTime -= offset;
            }
            if(e.key == `ArrowRight`) {
                shortsVideo.currentTime += offset;
            }
        }
    })
}

/*videoコントロール*/
videoCtrl();
function videoCtrl() {
    const videoctrl = sidepanel.contentDocument.getElementById('videoctrl');
    const pbr = sidepanel.contentDocument.getElementById('pbr');
    let videoScN = ';';
    let videoScB = 'h';
    document.addEventListener('keydown',e => {
        if(!preventKeys) {
            const video = document.getElementsByClassName('html5-main-video')[0];
            if(e.key == videoScN && videoctrl.checked) {
                video.dispatchEvent(new KeyboardEvent('keydown', {
                    keyCode: 78, // 'N'
                    shiftKey: true,
                    bubbles: true
                }));
            }
            if(e.key == videoScB && videoctrl.checked) {
                video.dispatchEvent(new KeyboardEvent('keydown', {
                    keyCode: 80, // 'P'
                    shiftKey: true,
                    bubbles: true
                }));
            }
            if(e.key == `@` && pbr.checked) {
                const rate = Number(prompt(`再生速度 [入力した数字の倍速になります]`,`1`));
                video.playbackRate = rate;
            }
        }
    });
}

/*quick video*/
quickVideo();
function quickVideo() {
    const qv = sidepanel.contentDocument.getElementById('quickVideo');
    document.addEventListener('keydown',e => {
        if(e.key == 'd' && qv.checked) {
            const video = document.getElementsByClassName('html5-main-video')[0];
            video.playbackRate = 2;
        }
    });
    document.addEventListener('keyup',e => {
        if(e.key == 'd' && qv.checked) {
            const video = document.getElementsByClassName('html5-main-video')[0];
            video.playbackRate = 1;
        }
    });
}

/*still image*/
stillImage();
function stillImage() {
    const simage = sidepanel.contentDocument.getElementById('simage');
    let img;
    let itv;
    createThumbnail();
    simage.addEventListener('change',() => {
        if(simage.checked) {
            itv = setInterval(() => {
                document.getElementsByClassName('video-stream html5-main-video')[0].style.display = 'none';
                img.style.display = '';
            }, 100);
        } else {
            clearInterval(itv);
            document.getElementsByClassName('video-stream html5-main-video')[0].style.display = '';
            img.style.display = 'none';

        }
    });
    document.getElementsByClassName('video-stream html5-main-video')[0].addEventListener('play',() => {
        if(img) {
            img.remove();
        }
        createThumbnail();
    });

    function createThumbnail() {
        const vparent = document.getElementsByClassName('html5-video-container')[0];
        const video = document.getElementsByClassName('video-stream html5-main-video')[0];
        try {
            const videoId = location.href.split('v=')[1].split('&list')[0];
            img = document.createElement('img');
            img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            img.style = video.getAttribute('style');
            img.style.display = '';
            if(simage.checked) {
                video.style.display = 'none';
            } else {
                img.style.display = 'none';
            }
            vparent.appendChild(img);
        }
        catch { return }
    }
}

/*自動shorts*/
autoShorts();
function autoShorts() {
    const autoshorts = sidepanel.contentDocument.getElementById('autoshorts');
    if(location.href.split('/')[3] == 'shorts') {
        const video = document.getElementsByClassName('video-stream html5-main-video')[0];
        if(autoshorts.checked) {
            video.removeAttribute('loop');
        }

        autoshorts.addEventListener('change',() => {
            if(autoshorts.checked) {
                video.removeAttribute('loop');
                video.addEventListener('ended',next);
            } else {
                video.setAttribute('loop','');
                video.removeEventListener('ended',next);
            }
        });
        function next() {
            video.dispatchEvent(new KeyboardEvent('keydown', {
                code: 'ArrowDown', // 'down'
                bubbles: true
            }));
        }

        // 属性が変更されたときに実行する処理
        function onAttributeChanged(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && autoshorts.checked) {
                    video.removeAttribute('loop');
                }
            }
        }
        const observer = new MutationObserver(onAttributeChanged);
        observer.observe(video, { attributes: true });
    }
}