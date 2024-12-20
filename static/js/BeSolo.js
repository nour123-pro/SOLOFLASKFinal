function GenerateUserCards(userimage,hotelname, hotellocation, userexperience, usersuggestions,hotelid,hotelcountry) {
   
    return `
    <div class="card-container">
        <div class="likebutton"></div>
        <div class="card">
            <div class="card-front" style="background-image: url('${userimage}')" ></div>
            <div class="card-back">
            <a href="/HotelsPage?countryname=${ hotelcountry }&id=${ hotelid }">
                <h2>${hotelname}</h2>
                </a>
                <div class="compressed">
                    <img src="static/assets/location.png">
                    <p>${hotellocation}</p>
                </div>
                <div class="Content">
                    <div class="text">
                        <h3>Experience</h3>
                        <p>${userexperience}</p>
                    </div>
                    <div class="text">
                        <h3>Suggestion</h3>
                        <p class="suggestions">${usersuggestions}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function GenerateForm() {
    console.log(user.hasreservation);
    console.log(user.passeddate)
    console.log(user.hotelname);
    const style = !user.hasreservation  ||(user.hasreservation && !user.passeddate) ? 'style="filter: blur(5px);"' : ''
    
    hotel = user.hotelname;

   

    return `
    <div class="PostingForm" ${style}>

    
        <div class="Title">
            <h3>BeSolo</h3>
        </div>
        <div class="FormInput">
            <form id="user-input-form" enctype="multipart/form-data">
                <div class="rating-box">
                    <header>How was your Stay at ${hotel}?</header>
                    <div class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                </div>
                <div class="rating-box">
                    <header>How was your experience?</header>
                    <input type="text" class="gradient-border" name="experience">
                </div>
                <div class="rating-box">
                    <header>Any Suggestions for Solo Travelers?</header>
                    <input type="text" class="gradient-border" name="suggestions">
                </div>
                <div class="rating-box">
                    <header>How about an image for an unerasable memory?</header>
                    <div class="file-upload">
                        <input type="file" id="file-input" class="file-input" name="file" style="display: none;">
                        <label for="file-input" class="custom-file-button">memory?</label>
                        <span class="file-name">No file chosen</span>
                    </div>
                </div>
                <button type="submit" class="popular-hotels__filter-btn Postbutton submit">
                    <img src="./static/assets/paper-plane.png" alt="">
                </button>
            </form>
        </div>
    </div>
    `;
}


async function gettinguserimage() {
    try {
        const response = await fetch('/upload');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data.image;
    } catch (error) {
        console.log(error);
    }
}

function GivingCardMovement(card) {
    card.addEventListener('click', function() {
        console.log('click');
        card.classList.toggle('flipped');
    });
}

function GivingHeartWork(cardcontainer) {
    const heart = cardcontainer.querySelector('.likebutton');
    heart.addEventListener('click', function() {
        const currentBackground = heart.style.backgroundImage;
        if (currentBackground.includes('favorite.png')) {
            heart.style.backgroundImage = 'url("/static/assets/heart.png")';
        } else {
            heart.style.backgroundImage = 'url("/static/assets/favorite.png")';
        }
    });
}

function GivingStarsLight() {
    if (!user.hasreservation  ||(user.hasreservation && !user.passeddate)){
        window.alert("Blocked from submiting")
    }else{    
    const stars = document.querySelectorAll(".stars i");
    stars.forEach((star, index1) => {
        star.addEventListener("click", () => {
            console.log("clicking star");
            stars.forEach((star, index2) => {
                index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
            });
        });
    });
}
}

function GettingUserInput() {
  if (!user.hasreservation  ||(user.hasreservation && !user.passeddate)){
           window.alert("Blocked from submiting")
  }else{
    const stars = document.querySelectorAll('.stars .fa-star.active');
    const rating = stars.length;

    const experience = document.querySelector('input[name="experience"]').value;
    const suggestions = document.querySelector('input[name="suggestions"]').value;

    const fileInput = document.getElementById('file-input');
    const fileChosen = fileInput.files.length > 0;
    let fileData = null;

    if (fileChosen) {
        fileData = fileInput.files[0];
    }

    return { rating, experience, suggestions, fileData };
}
}

async function submitForm(event) {
    event.preventDefault();

    const formData = new FormData();
    const userInput = GettingUserInput();

    formData.append('rating', userInput.rating);
    formData.append('experience', userInput.experience);
    formData.append('suggestions', userInput.suggestions);
    if (userInput.fileData) {
        formData.append('file', userInput.fileData);
    }

    try {
        const response = await fetch('/api/saveUserInput', {
            method: 'POST',
            body: formData
        });
        if (response.status === 401) {
            alert("Login in first,future Solo traveler");
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        window.prompt(`Thank you for your Feedback ${user.firstName}`)
        defaultDisplay()

        const data = await response.json();
        console.log('Server response:', data);
    } catch (error) {
        console.log('Error:', error);
    }
}

function GivingFormWork() {
    const form = document.getElementById('user-input-form');
    form.addEventListener('submit', submitForm);
}
function GivingButtonWork() {
    const post = document.querySelector('.Postbutton');
    const holdercontainer = document.getElementById('BigContainer');

    post.addEventListener('click', async function() {
        console.log('clicking');
        const form = GenerateForm();
        holdercontainer.innerHTML = form;
        GivingStarsLight();
        GivingFormWork();
    });

    const countrybuttons = document.querySelectorAll('.Countrybutton');
    countrybuttons.forEach(async function (countrybutton) {
        countrybutton.addEventListener('click', async function () {
            try {
                const response = await fetch(`/api/UsersFeedback/${countrybutton.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const usersdata = await response.json();
                let generatedCards = '';
                usersdata.forEach(data => {
                    generatedCards += GenerateUserCards(data.UserImage, data.HotelName, data.HotelLocation, data.Experience, data.Suggestions,data.HotelId,data.Country);
                });
                holdercontainer.innerHTML = generatedCards;
                setTimeout(function() {
                    const cards = holdercontainer.querySelectorAll('.card-container');
                    cards.forEach(card => {
                        GivingHeartWork(card);
                        const target = card.querySelector('.card');
                        GivingCardMovement(target);
                    });
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        });
    });
    
}


GivingButtonWork();
function defaultDisplay(){
    const containermain=document.getElementById('BigContainer')
    containermain.innerHTML=GenerateForm()
    GivingStarsLight();
    GivingFormWork();
    
const fileInput = document.getElementById('file-input');


fileInput.addEventListener('change', function() {

    const file = this.files[0];

    const label = document.querySelector('.custom-file-button');
    const fileNameDisplay = document.querySelector('.file-name');

    
    if (file) {
        label.textContent = 'File Selected';
        fileNameDisplay.textContent = file.name;
    } else {
        label.textContent = 'Choose File';
        fileNameDisplay.textContent = 'No file chosen';
    }
});

}
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response=await  fetch("/api/check-authentication")
        if(!response.ok){
        
        if(response.status===401){
         alert("Dear Future Solo Traveler,Login to access this page");
         window.location.href="/signIn"
     
        }else{
            throw new Error(`HTTP error ${response.status}`)
        }
    }else{
    
        defaultDisplay();
    }
    } catch (error) {
        console.log(error)
    }
  
   
});
