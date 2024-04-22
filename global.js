
function cleanBackground() {
    if (document.getElementById("backgroundVideo") !== null) {
        document.getElementById("backgroundVideo").remove();
    }
    document.getElementById("contentWindow").style.backgroundImage = "";
}

function changeBack(url) {
    var focusDiv = document.getElementById("contentWindow");
    curImg = focusDiv.style.backgroundImage;
    if (curImg !== ('url("' + url + '")')) {
        cleanBackground();
        focusDiv.style.backgroundImage = "url(" + url + ")";
    }
}

function changeBackVideo(url, loopBool, arrayID) {
    if (document.getElementById("backgroundVideoSrc") == null || document.getElementById("backgroundVideoSrc").getAttribute("src") !== url) {
        cleanBackground();
        var objVid = document.createElement("video");
        var objSrc = document.createElement("source");
        objVid.setAttribute("autoplay", true);
        objVid.setAttribute("muted", true);
        if (loopBool) {
            objVid.setAttribute("loop", true);
        }
        objSrc.src = url;
        objVid.style.zIndex = 0;
        objVid.style.position = "absolute";
        objVid.style.width = "inherit";
        objVid.style.height = "inherit";
        objVid.id = "backgroundVideo";
        objSrc.id = "backgroundVideoSrc";
        objVid.append(objSrc);
        document.getElementById("contentWindow").appendChild(objVid);
        if (!loopBool) {
            videoEndedListener(objVid, arrayID)
        }
    }
}

function videoEndedListener(objVid, arrayID) {
    objVid.onended = function() {
        arrPoint = arrayID;
        runThrough(globalArr);
    };
}

function timeoutHandler(timeoutArr, seconds) {
    setTimeout(
        function() {
            arrPoint = timeoutArr;
            runThrough(globalArr);
        },
        (seconds * 1000)
    );
}

function backgroundCalculate(mediaType, mediaPath, vidLoopBool, vidTimeoutArrID) {
    if (mediaType == "IMG") {
        changeBack(mediaPath);
    } else if (mediaType == "VID") {
        changeBackVideo(mediaPath, vidLoopBool, vidTimeoutArrID);
    }
}

function genShape(wid, hei, col) {
    var obj = document.createElement("div");
    obj.style.width = wid+"px";
    obj.style.height = hei+"px";
    obj.style.background = col;
    obj.style.zIndex = 1;
    obj.id = "onscreenCursor"
    document.getElementById("contentWindow").appendChild(obj);
    return obj;
}

function transCords(xpos, ypos, obj){
    var viewOffset = document.getElementById("contentWindow").getBoundingClientRect();
    obj.style.position = "absolute";
    obj.style.left = (viewOffset.left + xpos) + "px";
    obj.style.top = ypos + "px";
}

function setObjectInvisible(obj) {
    obj.style.visibility = "hidden";
}

function genImgSel(imgPath, wid, hei, top, left) {
    var obj = document.createElement("img");
    obj.src = imgPath;
    obj.style.position = "sticky";
    obj.style.width = wid+"px";
    obj.style.height = hei+"px";
    obj.style.top = top+"px";
    obj.style.left = left+"px";
    obj.style.zIndex = 1;
    obj.id = "onscreenImgCur";
    document.getElementById("contentWindow").append(obj);
    return obj
}

function genText(text, fFam, fSize, fColor, wid, len) {
    var objP = document.createElement("p");
    var objD = document.createElement("div");
    var content = document.createTextNode(text);
    objP.appendChild(content);
    objP.style.fontFamily = fFam;
    objP.style.fontSize = fSize+"px";
    objP.style.color = fColor;
    objP.style.textAlign = "center";
    objP.style.width = wid+"px";
    objP.style.height = len+"px";
    objD.style.zIndex = 1;
    objP.id = "onscreenTextP";
    objD.id = "onscreenTextD";
    objD.appendChild(objP);
    document.getElementById("contentWindow").appendChild(objD);
    return [objP, objD];
}

function setTxtBackgroundCol(color, obj) {
    obj.style.backgroundColor = color;
}

function addResizeListner(arrayID1, arrayID2, obj) {
    window.onresize = function() {
        transCords(curArr[arrayID1], curArr[arrayID2], obj);
    };
}

function assetClear() {
    if (document.getElementById("onscreenCursor")){
        document.getElementById("onscreenCursor").remove();
    }
    if (document.getElementById("onscreenTextD")){
        document.getElementById("onscreenTextD").remove();
    }
    if (document.getElementById("onscreenImgCur")) {
        document.getElementById("onscreenImgCur").remove();
    }
}

arrPoint = 1;
globalArr = "";
function runThrough(inContent, pointOverride) {
    globalArr = inContent;
    if (pointOverride) {
        curArr = inContent[pointOverride]
    } else {
        curArr = inContent[arrPoint]
    }
    console.log(curArr);
    console.log(curArr[0] + " mode selected.");
    switch(curArr[0]) {
        case "SEL":
            backgroundCalculate(curArr[1], "./" + globalArr[0][0] + "/" + curArr[2], curArr[3], curArr[15]);
            assetClear();
            var obj = genShape(curArr[4], curArr[5], curArr[8]);
            transCords(curArr[6], curArr[7], obj);
            if (curArr[9]) {
                setObjectInvisible(obj)
            }
            addResizeListner(6, 7, obj);
            break;
        case "TXT":
            backgroundCalculate(curArr[1], "./" + globalArr[0][0] + "/" + curArr[2], curArr[3], curArr[15]);
            assetClear();
            var obj = genText(curArr[4], curArr[5], curArr[6], curArr[7], curArr[10], curArr[11], curArr[10], curArr[11]);
            transCords(curArr[12], curArr[13], obj[1]);
            if (curArr[9]) {
                setTxtBackgroundCol(curArr[8], obj[1]);
            }
            addResizeListner(12, 13, obj[1]);
            break;
        case "IMG":
            backgroundCalculate(curArr[1], "./" + globalArr[0][0] + "/" + curArr[2], curArr[3], curArr[16]);
            assetClear();
            var obj = genImgSel("./" + globalArr[0][0] + "/" + curArr[4], curArr[5], curArr[6], curArr[7], curArr[8]);
            break;
        default:
            console.log("Case type not found.");
            break;
    }
    if (curArr[15] && curArr[1] != "VID") {
        timeoutHandler(curArr[15], curArr[16]);
    }
}

function arrPointerCheckAndSave(newPoint) {
    if (globalArr[arrPoint][newPoint] !== 9999) {
        arrPoint = globalArr[arrPoint][newPoint];
        runThrough(globalArr);
    }
}

function remoteClick(key) {
    switch(key) {
        case "UP":
            if (curArr[0] == "SEL") {
                arrPointerCheckAndSave(10);
            } else if (curArr[0] == "TXT") {
                arrPointerCheckAndSave(14);
            } else if (curArr[0] == "IMG") {
                arrPointerCheckAndSave(9);
            }
            break;
        case "DOWN":
            if (curArr[0] == "SEL") {
                arrPointerCheckAndSave(11);
            } else if (curArr[0] == "TXT") {
                arrPointerCheckAndSave(15);
            } else if (curArr[0] == "IMG") {
                arrPointerCheckAndSave(10);
            }
            break;
        case "LEFT":
            if (curArr[0] == "SEL") {
                arrPointerCheckAndSave(12);
            } else if (curArr[0] == "TXT") {
                arrPointerCheckAndSave(16);
            } else if (curArr[0] == "IMG") {
                arrPointerCheckAndSave(11);
            }
            break;
        case "RIGHT":
            if (curArr[0] == "SEL") {
                arrPointerCheckAndSave(13);
            } else if (curArr[0] == "TXT") {
                arrPointerCheckAndSave(17);
            } else if (curArr[0] == "IMG") {
                arrPointerCheckAndSave(12);
            }
            break;
        case "OK":
            if (curArr[0] == "SEL") {
                arrPointerCheckAndSave(14);
            } else if (curArr[0] == "TXT") {
                arrPointerCheckAndSave(18);
            } else if (curArr[0] == "IMG") {
                arrPointerCheckAndSave(13);
            }
            break;
        case "HOME":
            arrPoint = 1;
            runThrough(globalArr);
            break;
        case "DISC":
            window.location.href = "index.html";
            break;
        default:
      }
}

const params = new URLSearchParams(window.location.search);
const movieSource = params.get("name");
runThrough(getFilm(movieSource));