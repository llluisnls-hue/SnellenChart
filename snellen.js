    //here is where we will store the height of 1cm
    var viewingWindow = [
        // display name , number of pixels in 1cm
        ["Chrome-Win", 79.9],
        ["Edge-Win",69.7],
        ["iPhone 14", 119.7 ],
        ["iPad pro 12.9",104.1],
    ];


    var SnellenSizes = [
        ["6/120", 120],
        ["6/95", 95],
        ["6/60", 60],
        ["6/36", 36],
        ["6/24", 24],
        ["6/18", 18],
        ["6/12", 12],
        ["6/9", 9],
	["6/7.5", 7.5],
        ["6/6", 6],
        ["6/5", 5],
        ["6/4", 4]
    ]

    const letterOptions = ["D","E","F","H","N","P","R","U","V","Z","O"];

    var sizeSelect = document.getElementById('size');
    var scaleInput = document.getElementById('scale');
    var distanceInput = document.getElementById('distance');
    var fixButton = document.getElementById('fixMyHeight');
    var saveVATarget = document.getElementById('saveVATarget');
    var currentHeightInput = document.getElementById("currentHeight");
    var currentHeightInputDiv = document.getElementById("fixHeight");
    var letterE = document.getElementById("Letter");
    var listOfVAsText = document.getElementById("listOfVAs");
    var sizingWritingE = document.getElementById("sizingWriting");
    var baselineHeight = 100;
    var currentLetter = 1;
    var lenSnellen = SnellenSizes.length;
    var heightShouldBeAt = 0;
    const balancer = 17.5;
    let lastClick = 0;
    
    //calculate Snellen's
    // Standard vision able to recognise 1 optotype when subtends angle of 5 minutes of arc
    // Fraction = distance/disatnce at which smallest optotypes subtends angle of 5' arc
    // 1 minute is 1 60th of a degree
    // tan 5 minutes = height / distance
    // 6/60 = > tan(5/60) = height / 60
    const tan5min = 0.00145444206;
    var SnellenSizeDesired = 0;

    function changeCSS(screenSize, distance, SnellenSize){
        console.log(screenSize, distance, SnellenSize);
        height1cm = screenSize;
        heightShouldBeAt = tan5min * SnellenSizes[SnellenSize][1] * 100.0 * distance / 600; //in centimeters
        letterE.style.fontSize = height1cm * heightShouldBeAt + 'px';
        sizingWritingE.innerHTML = "Size = " + SnellenSizes[SnellenSize][0] + "  (" + Math.round(heightShouldBeAt *10)/10 +"cm)";
        saveDefaults();
    }

    // basic cookie saving functions from: https://www.w3schools.com/js/js_cookies.asp
    function setCookie(cname, cvalue, exdays) {
      const d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      let expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname, defaultV) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return defaultV;
    }

    function saveDefaults(){
        setCookie("sizeSelectDef", sizeSelect.value, 365);
        setCookie("distanceInputDef", distanceInput.value, 365);
        setCookie("scaleInputDef", scaleInput.value, 365);
    }

    sizeSelect.addEventListener("change", (event) => {
        scaleInput.value = viewingWindow[sizeSelect.value][1];
        changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
    });
    scaleInput.addEventListener("change", (event) => {
        changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
    });
    currentHeightInput.addEventListener("change", (event) => { 
        fixHeight();
    });
    distanceInput.addEventListener("change", (event) => {
        changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
    });

    document.addEventListener("keydown", (event) => {
        changeWithKey(event);
    });
    fixButton.addEventListener("click", (event) => {
        showHideFixHeight();
    });

    function showHideFixHeight(){
        if(currentHeightInputDiv.style.display == "none"){
            currentHeightInputDiv.style.display="block"
        }
            
        else{currentHeightInputDiv.style.display="none"}
    }    
    let touchstartX = 0
    let touchendX = 0
    
    function checkDirection() {
        
        if (touchstartX - touchendX > balancer ) changeLetter();
        if (touchstartX - touchendX < - balancer ) changeLetter();
        if (touchstartY - touchendY > balancer ) decreaseSize();
        if (touchstartY - touchendY < -1 * balancer ) increaseSize();
    }

    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    })

    document.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      touchendY = e.changedTouches[0].screenY;
      checkDirection()
    })

    function changeWithKey(e){
        console.log(e.code);
        if(e.code == "ArrowLeft" || e.code == "ArrowRight"){
            changeLetter();
        }
        
        if(e.code == "ArrowDown"){
            decreaseSize();
        }
        if(e.code == "ArrowUp"){
            increaseSize();
        }
    }

    function createSelection(){
        selectionOptions = document.getElementById("size");
        for(var i=0; i < viewingWindow.length;i++){
            const newOption = document.createElement('option');
            const optionText = document.createTextNode(viewingWindow[i][0]);
            newOption.appendChild(optionText);
            newOption.setAttribute('value',i);
            selectionOptions.appendChild(newOption);
        }
    }
    function initialize(){
        sizeSelectDef = getCookie("sizeSelectDef",0);
        distanceInputDef = getCookie("distanceInputDef",150);
        scaleInputDef = getCookie("scaleInputDef",viewingWindow[0][1]);
        document.getElementById('size').value=sizeSelectDef;
        document.getElementById('distance').value=distanceInputDef;
        document.getElementById('scale').value=scaleInputDef;
        changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
    }
    function changeLetter(){
        tempLetter = currentLetter;
        while(currentLetter == tempLetter){
            currentLetter = Math.floor((Math.random() * letterOptions.length));
        }
        letterE.innerHTML = letterOptions[currentLetter];
    }
    function decreaseSize(){
        if (SnellenSizeDesired < lenSnellen - 1){
            SnellenSizeDesired += 1;
            changeLetter();
            changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
        }
    }

    function increaseSize(){
        if (SnellenSizeDesired > 0){
            SnellenSizeDesired -= 1;
            changeLetter();
            changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
        }
    }
    function fixHeight(){
        currentHeight = currentHeightInput.value;
        currentHeightInput.value = "";
        currentScale = scaleInput.value;
        scaleInput.value = Math.round( currentScale * heightShouldBeAt / currentHeight *10)/10; //to one decimal place
        changeCSS(scaleInput.value, distanceInput.value, SnellenSizeDesired);
    }


    // Save VA Values as follows:
    // yyyy-mm-dd hh:mm  -  VA |
    function saveVAHistory(){
        var currrentDateTime = new Date();
        var date = currrentDateTime.getFullYear()+'-'+(currrentDateTime.getMonth()+1)+'-'+currrentDateTime.getDate();
        var time = currrentDateTime.getHours() + ":" + currrentDateTime.getMinutes();
        var currentSaveValue = date + " " + time + "  -  " + SnellenSizes[SnellenSizeDesired][0] + "|";
        var currentVAList = getCookie("VAHistory", "");
        setCookie("VAHistory",currentVAList + currentSaveValue, 365);
    }

    function updateVAHistory(){
        var VAText = getCookie("VAHistory", "");
        if (VAText.length == 0){
            listOfVAsText.innerHTML = "";
        } else {
            listOfVAsText.innerHTML = "";
            var VAList = VAText.split("|");
            for (item in VAList){
                	let p = document.createElement('h5');
	                p.textContent = VAList[item];
                    listOfVAsText.appendChild(p);
            }
        }
        
    }
    function viewVAHistory(){
	updateVAHistory();
	openModal("SaveList");
    }
    function clearVAHistory(){
        listOfVAsText.innerHTML = "";
        setCookie("VAHistory","", 365);
    }

    createSelection();
    initialize();

// open modal by id
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

// close currently open modal
function closeModal() {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
}

window.addEventListener('load', function() {
    // close modals on background click
    document.addEventListener('click', event => {
        if (event.target.classList.contains('jw-modal')) {
            closeModal();
        }
    });
});
