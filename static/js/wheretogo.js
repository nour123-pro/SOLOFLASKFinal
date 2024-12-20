function QuizFormat(){
    return `
    <div class="quiz-container" id="quiz">
        
            
    
            
       
    <div class="quiz-header">
      <h2 id="question">Question Text</h2>

      <div class="answer-container">
        <div class="answer" id="a">
            <label for="a" id="a_text"></label>
            <img src="" alt="" id="icon1" class="icon">
        </div>
        <div class="answer" id="b">
            <label for="b" id="b_text" ></label>
            <img src="" alt="" id="icon2" class="icon">
        </div>
        <div class="answer" id="c">
            <label for="c" id="c_text"></label>
            <img src="" alt="" id="icon3" class="icon">
        </div>
        <div class="answer" id="d">
            <label for="d" id="d_text"></label>
            <img src="" alt="" id="icon4" class="icon">
        </div>
      </div>
    </div>
    <button id="submit">Submit</button>
</div>
    
    
    `
}


const quizData = [
    {
        question: "What type of vacation are you planning?",
        a: "Adventure and Exploration",
        b: "Relaxation and Wellness",
        c: "Cultural Immersion",
        d: "Culinary Delights",
        icon1:"static/assets/street-market.png",
        icon2:"static/assets/coffee-time.png",
        icon3:"static/assets/treasure-map.png",
        icon4: "static/assets/noodle.png"
       
    },
    {
        question: "How important is outdoor adventure to you?",
        a: "Essential - I love outdoor activities and adventures!",
        b: "Somewhat important - I enjoy outdoor activities occasionally.",
        c: "Not very important - I prefer indoor or low-key activities.",
        d: "Not at all important - I prefer to avoid outdoor activities altogether.",
        icon1:"static/assets/hand-sign.png",
        icon2:"static/assets/hand-sign.png",
        icon3:"static/assets/i-dont-know.png",
        icon4: "static/assets/means.png"
    },
    {
        question: "What is your preferred accommodation budget per night?",
        a: "Budget-friendly",
        b: "Mid-range",
        c: "Luxury",
        d: "No preference",
        icon1:"static/assets/savings.png",
        icon2:"static/assets/cash.png",
        icon3:"static/assets/money.png",
        icon4: "static/assets/wallet.png"
    },
    {
        question: "What amenities are important to you in a hotel?",
        a: "Pool",
        b: "Gym ",
        c: "Spa",
        d: "Free breakfast",
       
        icon1:"static/assets/swimming-pool.png",
        icon2:"static/assets/relax.png",
        icon3:"static/assets/equipment.png",
        icon4: "static/assets/breakfast.png"
       
    },
     {
        question: "What type of surroundings do you prefer your accommodation to be in?",
        a: "City center",
        b: "Near the beach",
        c: "Countryside or rural area",
        d: "Mountains or nature reserve",
        icon1:"static/assets/new-york.png",
        icon2:"static/assets/beach.png",
        icon3:"static/assets/grassland.png",
        icon4: "static/assets/mountain.png"
    },
     {
        question: "What activities or attractions are you interested in exploring during your trip?",
        a: "Historical landmarks and museums",
        b: "Outdoor activities (hiking, biking, etc.)",
        c: "Shopping and entertainment",
        d: "Culinary experiences",
       
        icon1:"static/assets/museum.png",
        icon2:"static/assets/hiking.png",
        icon3:"static/assets/black-friday.png",
        icon4: "static/assets/cooking.png"
       
    },
     {
        question: "How long do you plan to stay at the hotel?",
        a: "Less than a week",
        b: "One week",
        c: "Two weeks or longer",
        d:"I guess well never know",
        icon1:"static/assets/photo.png",
        icon2:"static/assets/photo.png",
        icon3:"static/assets/photo.png",
        icon4: "static/assets/photo.png"
        
    },

];

const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
let currentQuiz = 0;
const userAnswers = [];
loadQuiz();

function loadQuiz() {
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
    icon1.src =currentQuizData.icon1 ; 
    icon2.src =currentQuizData.icon2 ; 
    icon3.src=currentQuizData.icon3;
    icon4.src=currentQuizData.icon4;
}




// Function to get the text of the selected option based on its ID
function getAnswerText(answerID) {
    const labelElement = document.querySelector(`label[for='${answerID}']`);
    
    return labelElement ? labelElement.innerText : null;
}

// Function to deselect all answers and set up event listeners
function deselectAnswers() {
    answerEls.forEach(answerEl => {
        answerEl.classList.remove('selected');
        answerEl.addEventListener('click', () => {
            answerEl.classList.add('selected');
            answerEls.forEach(el => {
                if (el !== answerEl) {
                    el.classList.remove('selected');
                }
            });
        });
    });
}

// Function to get the selected answer and store the text of the answer in userAnswers
function getSelected() {
    let selectedAnswerID;
    answerEls.forEach(answerEl => {
        if (answerEl.classList.contains('selected')) {
            selectedAnswerID = answerEl.id; // Get the selected answer ID
           
            const answerText = getAnswerText(selectedAnswerID);
            userAnswers[currentQuiz] = answerText;
        }
    });
    return selectedAnswerID;
}

submitBtn.addEventListener('click', () => {
    const answerID = getSelected();
    if (answerID) {
        currentQuiz++;
        if (currentQuiz < quizData.length) {
            
            loadQuiz();
        } else {
            
            analysis(userAnswers).then(result => {
                console.log('User answers:', userAnswers);
                console.log("result",result);
              
                quiz.innerHTML = `
                <div class="loading loading05">
    <span>L</span>
    <span>O</span>
    <span>A</span>
    <span>D</span>
    <span>I</span>
    <span>N</span>
    <span>G</span>
  </div>
                `
                setTimeout(()=>{
                  quiz.innerHTML=generatePerfectCard(result)
                 
                },100)
                ;
            }).catch(error => {
                console.log('Error during analysis:', error);
            });
        }
    }
});
async function analysis(userAnswers) {
    // Create a dictionary from user answers
    const dict = {
        BudgetCategory: userAnswers[2],
        SurroundingPlaces: userAnswers[4],
        Amenities: userAnswers[3]
    };
    
    // Serialize the dictionary into a query string
    const userinput = new URLSearchParams(dict).toString();
    console.log(userinput)
    list=[userAnswers[2],userAnswers[4],userAnswers[3]];
    console.log("useranswer:"+userAnswers);
    try {
        // Make the API request with the query string
        const response = await fetch(`/api/hotels/specific/${userAnswers}`);
        
        // Check if the response status is not OK
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
        }
        
        // Parse the JSON response
        const hotelspicked = await response.json();
        
        // Log the results or use the data as needed
        console.log("hotel picked"+hotelspicked)
        return hotelspicked;
        
    } catch (error) {
        // Log the error message and other details
        console.error('Fetch Error:', error);
        
        // Optionally, provide a user-friendly error message
        // E.g., alert('An error occurred while fetching data. Please try again later.');
    }
}
/*function that will generate the hotel card after finishing questions*/
function generatePerfectCard(hotelspicked) {
    if (hotelspicked != null) {
        let data = hotelspicked.hotels;
        if (data && data.length > 0) {
            // Process only the first hotel (index == 0) and return its HTML
            let randomindex = Math.floor(Math.random() * data.length);
            const [latitude, longitude] = data[randomindex].locationprecise.split(',').map(parseFloat);
            updatemap(latitude, longitude)
            console.log(latitude, longitude)
            return generateHotelArticles(data[randomindex]);
        } else if (data.length === 1) {
            // Handle when there's exactly one hotel
            let hotel = data[0];
            const [latitude, longitude] = hotel.locationprecise.split(',').map(parseFloat);
            updatemap(latitude, longitude)
            console.log(latitude, longitude)
            return generateHotelArticles(hotel);
        } else {
            // Handle when there are no hotels
            return ` <div class="BrokeSystem" id='quiz' >
       
            <img src="static/assets/round.png" alt="">
            <p>Your System Broke Our System,Such a Trouble Maker</p>
            <div class="popular-hotels__filter-btn">
               <p id="tryAgainButton" >Try Again</p>
               
            </div>
           
        </div>
    `;
        }
    }
    // Handle if hotelspicked is null
    return `<h1>No hotels found</h1>`;
}

document.getElementById('quiz').addEventListener('click', function(event) {
    if (event.target.id === 'tryAgainButton') {
        location.reload();
    }
});
function loadQuizAgain(){
   container=document.getElementById('quiz')
   container.innerHTML=QuizFormat()
   const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
let currentQuiz = 0;
const userAnswers = [];

}


function generateHotelArticles(hotel) {
    let articlesHTML = `
        <a href="/HotelsPage?countryname=${ hotel.country }&id=${ hotel.id }">
          <article class="popular-hotels__card" >
            <img class="popular-hotels__card-image" src="${hotel.images[0]}" alt="${hotel.title}" />
            <h4 class="popular-hotels__card-title">${hotel.title}</h4>
            
            <div class="layering">
               <div class="popular-hotels__card-details flex-between">
                 <div class="popular-hotels__card-rating">
                  <img src="static/assets/star.svg" alt="star" />
                  <p>${hotel.rating}</p>
                  </div>
                  <p class="popular-hotels__card-price">${hotel.prices}/night</p>
                </div>
            <div class="center">
            <div class="compressed">
              <img src="static/assets/location.png" alt="">
              <p>${hotel.location}</p>
            </div>
            <div class="listing">
                            ${hotel.services.map(service => `<div class="compressed"><img src="static/assets/verify.png"><p>${service}</p></div>`).join('')}
                </div>
            </div>
          </div>
          
          </article>
          
          `;
        


    return articlesHTML;
}






let map;
async function displayhotelsMap() {
    try {
        // Fetch data from the API
        const response = await fetch('/api/hotels');
        if (!response.ok) {
            throw new Error(`HTTP ERROR ${response.status}`);
        }
        const data = await response.json();
        const hotels = data.hotels;
       
        // Initialize the map
         const location={lat:33.8938,long:35.5018}
         map=L.map('map-container').setView([location.lat,location.long],12);
       
            
       
        
        
        // Add a tile layer to the map (e.g., OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Define a custom icon for the markers
        const customIcon = L.icon({
            iconUrl: '/static/assets/location.png', // Replace with your custom icon URL
            iconSize: [50, 50], // Width and height of the icon
            iconAnchor: [12, 41], // Anchor point of the icon
            popupAnchor: [1, -34], // Popup anchor point
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            shadowSize: [41, 41], // Width and height of the shadow
            shadowAnchor: [12, 41] // Anchor point of the shadow
        });

        // Add markers for each hotel in the hotels array
        hotels.forEach(hotel => {
            // Extract latitude and longitude from locationprecise
            const [latitude, longitude] = hotel.locationprecise.split(',').map(parseFloat);

            // Create a marker for the hotel
            const marker = L.marker([latitude, longitude], { icon: customIcon });

            // Add the marker to the map
            setTimeout(() => {
                marker.addTo(map);
            }, 1000); // 

            // Create the popup content (name and pricing)
            const popupContent = `
            <a href="/HotelsPage?countryname=${ hotel.country }&id=${ hotel.id }">
                <div class="popupContainer">
                <label class="hotelName">${hotel.title}</label>
                <img src="${hotel.images[2]}" alt="${hotel.title}" />
               
                
                <div class="compressed inpop">
                    <img src="static/assets/star.svg" alt="star" />
                    <p>${hotel.rating}</p>
                </div>  
                <div class="description">
                 <p>${hotel.description}</p>
                </div>
                </div>
            </a>

            
       
            `;
            
            // Bind the popup to the marker
            marker.bindPopup(popupContent);
        });
    } catch (error) {
        window.prompt(`in map ${error}`);
    }
}








displayhotelsMap();
let selectedMarker;
function updatemap(lat,long){
    if (map) {
        // Set the view of the map to the specified longitude and latitude
        map.setView([lat, long], 12);
        
        
        if (selectedMarker) {
           
            selectedMarker.getElement().classList.remove('pulse-marker');
        }

        // Find the marker corresponding to the selected location
        const markers = document.querySelectorAll('.selected-marker');
        if (markers.length > 0) {
           
            selectedMarker = markers[0];
            selectedMarker.getElement().classList.add('pulse-marker');
        }
    } else {
        console.error("Map is not initialized.");
    }
}
