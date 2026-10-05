const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");
const pwdDisplay = document.querySelector("[data-PwdDisplay]");
const cpyBtn = document.querySelector("[data-cpyBtn]");
const cpyMsg = document.querySelector("[data-cpyMsg]");
const upCase = document.querySelector("#uppercase");
const lowCase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const strengthIndicator = document.querySelector("[strength-Indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const special_char = '~!@#$%^&*()_+{}":;<>,.?/[]|_-`' 

let pwd ="";
let pwdLen = 10;
let checkCount = 0;
handleSlider();
//strength circle color to grey
 
//set pwd length
function handleSlider(){
    inputSlider.value = pwdLen;
    lengthDisplay.innerText = pwdLen;
}

function setIndicator(color){
    strengthIndicator.style.backgroundColor = color;
}

function getRandInt(min, max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandNum(){
    return getRandInt(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInt(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInt(65,91));
}

function generateSymbol(){
    const randNum = getRandInt(0, special_char.length);
    return special_char.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(upCase.checked) hasUpper = true;
    if(lowCase.checked) hasLower = true;
    if(numbers.checked) hasNum = true;
    if(symbols.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && pwdLen >= 0){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        pwdLen >= 0
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function cpyContent(){

    try{
        await navigator.clipboard.writeText(pwdDisplay.value);
        cpyMsg.innerText = "copied";
    }
    catch(e){
        cpyMsg.innerText = "failed";
    }
    //to make copy wala span visible
    cpyMsg.classList.add("active");

    setTimeout(()=>{
        cpyMsg.classList.remove("active");
    }, 2000);
} 

function shufflePwd(array){
    //Fisher Yates Method
    for(let i = array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

// EventListeners:
//1)Slider
inputSlider.addEventListener('input', (e)=>{
    pwdLen = e.target.value;
    handleSlider();
})
//2)CopyBtn
cpyBtn.addEventListener('click', ()=>{
    if(pwdDisplay.value)//if non empty then call copy content.
        cpyContent();
})
//3)Checkbox listener
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++; 
    });

    //special condition
    if(pwdLen < checkCount){
        pwdLen = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

//4)BheemSen Listener: Generate Pwd
generateBtn.addEventListener('click', ()=>{
     if(checkCount<=0) return;

     if(pwdLen<checkCount){
        pwdLen = checkCount;
        handleSlider();
     }

     //reset pwd
     pwd="";

    //  if(upCase.checked){
    //     pwd += generateUpperCase();
    //  }

    //  if(lowCase.checked){
    //     pwd += generateLowerCase();
    //  }

    //  if(numbers.checked){
    //     pwd += generateUpperCase();
    //  }

    //  if(symbols.checked){
    //     pwd += generateSymbol();
    //  }

    let funcArr = [];

    if(upCase.checked)
        funcArr.push(generateUpperCase);

    if(lowCase.checked)
        funcArr.push(generateLowerCase);

    if(numbers.checked)
        funcArr.push(generateRandNum);

    if(symbols.checked)
        funcArr.push(generateSymbol);

    //Compulsory addition
    for(let i=0; i<funcArr.length;i++){
        pwd += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<pwdLen-funcArr.length; i++){
        let randIndex = getRandInt(0, funcArr.length);
        pwd += funcArr[randIndex]();
    }

    //shuffle pwd
    pwd = shufflePwd(Array.from(pwd));
    console.log("Shuffling done");

    //Show in UI
    pwdDisplay.value = pwd;
    console.log("UI addition done");
    //calculate strength
    calcStrength();

})



