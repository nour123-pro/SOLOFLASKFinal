const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.querySelector(".progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

/* Event Listener for Next Button. */
nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum++;
        updateFormSteps();
        updateProgressbar();
    });
});

/* Event Listener for Back Button. */
prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        formStepsNum--;
        updateFormSteps();
        updateProgressbar();
    });
});

/* Updates Form Items */
function updateFormSteps() {
    formSteps.forEach((formStep) => {
        formStep.classList.contains("form-step-active") &&
        formStep.classList.remove("form-step-active")
    })
    formSteps[formStepsNum].classList.add("form-step-active");
}

/* Updates Progress Bar */
function updateProgressbar() {
    progressSteps.forEach((progressStep, index) => {
        if ( index < formStepsNum + 1 ) {
            progressStep.classList.add('progress-step-active')
            
            
        } else {
            progressStep.classList.remove('progress-step-active')
        }
    })
    progress.style.width = ((formStepsNum) / (progressSteps.length - 1)) * 100 + "%";
    
}



var container = document.querySelector(".container4");
        var inputs = document.querySelectorAll(".creditcardnumber, .creditcardownername, .CVC");

        // Toggle the 'flipped' class when the container is clicked
        container.addEventListener("click", function() {
            container.classList.toggle("flipped");
        });

        // Prevent card flipping when clicking on inputs
        inputs.forEach(function(input) {
            input.addEventListener("click", function(event) {
                event.stopPropagation(); // Stop the click event from propagating
            });
        });
        document.querySelector("#paymentbutton").addEventListener("click",function(){
            var inputs = document.querySelectorAll(".creditcardnumber, .creditcardownername, .CVC");
           inputs.forEach(function(data){
             if(data.value.trim()==''){
                window.prompt("Invalid Input")
             }
           });
           });
     
    

 