    //here is where we will store the height of 1cm
    var viewingWindow = [
        // display name , number of pixels in 1cm
        ["28' screen", 1297 / 30.5], //height is 146.7mm which is also 844px
        ["iPhone 14", 844 / 14.67], //height is 146.7mm which is also 844px
    ];


    var SnellenSizes = [
        ["6/60", 60],
        ["6/36", 36],
        ["6/24", 24],
        ["6/18", 18],
        ["6/12", 12],
        ["6/9", 9],
        ["6/6", 6],
        ["6/5", 5],
        ["6/4", 4]
    ]

    const letterOptions = ["D","E","F","H","N","P","R","U","V","Z","O"];
    var fontScale = 1.25 / 7 * 10 ;

    var sizeSelect = document.getElementById('size');
    var distanceInput = document.getElementById('distance');
    var letterE = document.getElementById("Letter");
    var sizingWritingE = document.getElementById("sizingWriting");
    var baselineHeight = 100;
    var currentLetter = 1;
    var lenSnellen = SnellenSizes.length;
    
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
        height1cm = viewingWindow[parseInt(screenSize)][1] * fontScale;
        heightShouldBeAt6m = tan5min * SnellenSizes[SnellenSize][1] * 100; //in centimeters
        letterE.style.fontSize = height1cm * heightShouldBeAt6m * distance / 600 + 'px';
        sizingWritingE.innerHTML = "Size = " + SnellenSizes[SnellenSize][0];
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
    }

    sizeSelect.addEventListener("change", (event) => {
        changeCSS(sizeSelect.value, distanceInput.value, SnellenSizeDesired);
    });
    distanceInput.addEventListener("change", (event) => {
        changeCSS(sizeSelect.value, distanceInput.value, SnellenSizeDesired);
    });

    document.addEventListener("keydown", (event) => {
        changeWithKey(event);
    });


    let touchstartX = 0
    let touchendX = 0
    
    function checkDirection() {
        const balancer = 5;
        if (touchstartX - touchendX > balancer ) changeLetter();
        if (touchstartX - touchendX < - balancer ) changeLetter();
        if (touchstartY - touchendY > balancer ) decreaseSize();
        if (touchstartY - touchendY < -1 * balancer ) increaseSize();
        if (touchstartY - touchendY > balancer ) alert("down " + touchstartY + " : " + touchendY);
        if (touchstartY - touchendY < -1 * balancer ) alert("up "+ touchstartY + " : " + touchendY);
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
        console.log(decodeURIComponent(document.cookie));
        sizeSelectDef = getCookie("sizeSelectDef",0);
        distanceInputDef = getCookie("distanceInputDef",600);
        document.getElementById('size').value=sizeSelectDef;
        document.getElementById('distance').value=distanceInputDef;
        changeCSS(sizeSelect.value, distanceInput.value, SnellenSizeDesired);
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
            changeCSS(sizeSelect.value, distanceInput.value, SnellenSizeDesired);
        }
    }

    function increaseSize(){
        if (SnellenSizeDesired > 0){
            SnellenSizeDesired -= 1;
            changeCSS(sizeSelect.value, distanceInput.value, SnellenSizeDesired);
        }
    }

    createSelection();
    initialize();
