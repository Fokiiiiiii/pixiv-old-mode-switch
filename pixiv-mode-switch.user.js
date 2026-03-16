// ==UserScript==
// @name         pixivのクソuiを正常の戻す
// @namespace    https://pixiv.net/
// @version      1.3
// @match        https://www.pixiv.net/*
// @grant        none
// ==/UserScript==

(function () {
'use strict';

function createButton(label, mode, currentMode){

    const btn = document.createElement("div");

    btn.textContent = label;

    btn.style.cursor = "pointer";
    btn.style.padding = "10px 22px";
    btn.style.borderRadius = "999px";
    btn.style.fontSize = "15px";
    btn.style.fontWeight = "600";
    btn.style.userSelect = "none";
    btn.style.transition = "all 0.15s ease";

    const active =
        (mode === "all" && !currentMode) ||
        currentMode === mode;

    if(active){
        btn.style.background = "rgba(255,255,255,0.18)";
        btn.style.color = "#fff";
    }else{
        btn.style.background = "transparent";
        btn.style.color = "#bbb";
    }

    btn.addEventListener("mouseenter",()=>{
        btn.style.background = "rgba(255,255,255,0.10)";
        btn.style.color = "#fff";
    });

    btn.addEventListener("mouseleave",()=>{
        if(!active){
            btn.style.background = "transparent";
            btn.style.color = "#bbb";
        }
    });

    btn.onclick = () => {

        const url = new URL(location.href);

        if(mode === "all"){
            url.searchParams.delete("mode");
        }else{
            url.searchParams.set("mode",mode);
        }

        location.href = url.toString();
    };

    return btn;
}

function addFilterBar(){

    if(document.getElementById("pixiv-mode-switch")) return;

    const searchOption = [...document.querySelectorAll("span,a,div")]
        .find(el => el.textContent.trim() === "検索オプション");

    if(!searchOption) return;

    const url = new URL(location.href);
    const currentMode = url.searchParams.get("mode");

    const bar = document.createElement("div");
    bar.id = "pixiv-mode-switch";

    bar.style.display = "flex";
    bar.style.gap = "14px";
    bar.style.marginTop = "12px";

    bar.appendChild(createButton("すべて","all",currentMode));
    bar.appendChild(createButton("全年齢","safe",currentMode));
    bar.appendChild(createButton("R-18","r18",currentMode));

    searchOption.parentNode.insertAdjacentElement("afterend", bar);
}

function init(){
    setTimeout(addFilterBar,800);
}

init();

const observer = new MutationObserver(()=>{
    addFilterBar();
});

observer.observe(document.body,{
    childList:true,
    subtree:true
});

})();
