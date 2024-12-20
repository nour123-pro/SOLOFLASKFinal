



// Function to generate HTML for hotel information
function generateHotelHTML(hotel) {
   
    console.log("hotel id: " + hotel.id);

        return `
        <div class="container"  id="${hotel.id}">
            <div class="form-container sign-up">
            <form>
            <div class="dates">
               <label for="checkindate">Check In DAte</label>
               <input type="Date" id="checkindate">

               <label for="checkoutdate">Check Out Date</label>
               <input type="Date" id="checkoutdate">
            </div>   
           

            <div class="roomtype">
               <h4>Room Type</h4>
               <div class="RoomsType">
                   <div class="compressed2">
                       <h4>Deluxe Room</h4>
                       <img src="static/assets/crown.png" alt="">
                   </div>
                   <div class="compressed2">
                       <h4>Suite Room</h4>
                       <img src="static/assets/credit-card.png" alt="">
                   </div>
                   <div class="compressed2">
                       <h4>Normal Room</h4>
                       <img src="static/assets/card-key.png" alt="">
                   </div>
                 
               </div>
               
            </div>
            <div class="numberpeopleandrooms">
               <label for="">People Number:</label>
               <input type="Number" min="1" class="PeopleNumber" placeholder="Number People">
               <label for="">Room Number:</label>
               <input type="Number" min="0" class="RoomNumber" placeholder="Number Rooms"> 
           </div>
           <div class="buttons">
              <div class="CheckPrice">
               <p>Check Price</p>
              </div>
              <div class="BookRoom" >
               <p>Confirm</p>

         </div>
           </div>
           </form>
            </div>
            <div class="form-container sign-in">
                <form>
                    <h1>${hotel.title}</h1>
                    <div class="wrapper1">
        <div class="container1">
            
            <div  class="card default pic1"  style="background-image: url('${hotel.images[0]}')"
            >
                <div class="row">
                    <div class="icon">1</div>
                </div>
            </div>
            
            <div  class="card" style="background-image: url('${hotel.images[1]}')"
            >
                <div class="row">
                    <div class="icon">2</div>
                </div>
            </div>
            
            <div  class="card" style="background-image: url('${hotel.images[2]}')"
            >
                <div class="row">
                    <div class="icon">3</div>
                </div>
            </div>
            <div  class="card" style="background-image: url('${hotel.images[3]}')"
            >
                <div class="row">
                    <div class="icon">4</div>
                </div>
            </div>
            <div  class="card" style="background-image: url('${hotel.images[4]}')"
            >
                <div class="row">
                    <div class="icon">4</div>
                </div>
            </div>

        </div>
    </div>
                </form>
            </div>
            <div class="toggle-container">
                <div class="toggle">
                    <div class="toggle-panel toggle-left">
                        <h1>${hotel.title} Services</h1>
                        <div class="listing">
                            ${hotel.services.map(service => `<div class="compressed"><img src="static/assets/verify.png"><p>${service}</p></div>`).join('')}
                        </div>
                        <div class="compressed">
                            <h3>Pricing:</h3>
                            <img src="static/assets/banknote.png" alt="">
                            <p class=price>${hotel.prices}</p>
                        </div>
                        <button  id="login">Return</button>
                    </div>
                    <div class="toggle-panel toggle-right">
                        <h1>${hotel.title}</h1>
                        <h3>Discover ${hotel.title} Services and Orders</h3>
                        <div class="le">
                            <div class="compressed Hotellocation">
                                <img src="static/assets/location.png" alt="">
                                <p class="Hotellocation">${hotel.location}</p>
                            </div> 
                            <div class="compressed">
                                <img src="static/assets/star.svg" alt="star" />
                                <p>${hotel.rating}</p>
                            </div>  
                        </div>
                       
                        <button  id="register" >Book Your Room<img src="static/assets/travel.png" alt=""></button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    






// Function to fetch hotel data for a specified country
async function fetchHotelData(country) {
    try {
       
        const response = await fetch(`/api/hotels/${country}`);
        
       
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
       
        const data = await response.json();
        
        
       
        return data.hotels;
    } catch (error) {
        console.error(`Error fetching hotel data for ${country}:`, error);
    }
}



// Function to append hotel HTML to the container
function appendHotelsToContainer(hotels, container) {
    let html = '';
    
    
    hotels.forEach(hotel => {
        html += generateHotelHTML(hotel);
    });
    
    
    container.innerHTML = html;
    calling(container);
    setTimeout(() => {
       
        const cards = container.querySelectorAll('.container');

      
        cards.forEach(card => {
            setUpRegisterAndLoginListeners(card);
        });
    }, 0);

}

//function to add event listeners to the buttons, 
function setUpButtonEventListeners() {
    const buttons = document.querySelectorAll('.bookingbutton');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const country = button.id; 
              
            
            const hotels = await fetchHotelData(country);
           
          
          const dataFilter = button.getAttribute('data-filter');
         

const containerId = dataFilter + 'Hotels';

// Find the container element using the generated ID
const container = document.getElementById("HotelContainer");

            appendHotelsToContainer(hotels,container);
            
        });
    });
}

// Call the function to set up event listeners on buttons
setUpButtonEventListeners();


// Call the function to append hotels to the container

function setUpRegisterAndLoginListeners(card) {
    // Get the register and login buttons within the current card
    const registerBtn = card.querySelector('#register');
    const loginBtn = card.querySelector('#login');
    const image=card.querySelector('.pic1')
    // Add event listener to register button
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            card.classList.add("active");
            image.classList.remove("default");

        });
    }

    // Add event listener to login button
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            card.classList.remove("active");
            image.classList.add("default");
        });
    }
}

function displayHotels(city='dubai') {
   
    
    const container = document.getElementById('HotelContainer');
    
    // Fetch hotels for Rome and append them to the container
    fetchHotelData(city)
        .then(romahotels => {
            appendHotelsToContainer(romahotels, container);
        })
        .catch(error => {
            console.error('Error fetching hotel data:', error);
        });
}


function RoomTypesSelection(card) {
    // Select all room options within the card
    const roomOptions = card.querySelectorAll('.compressed2');
   
    // Add event listeners to each room option
    roomOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove 'selected' class from all options
            roomOptions.forEach(roomOption => roomOption.classList.remove('selected'));

            // Add 'selected' class to the clicked option
            option.classList.add('selected');

            
            console.log(`Selected option: ${option.textContent}`);
            UpdatePriceBasedonRoomType(card);
        });
    });
}


function calling(container) {
    // Select all containers
   
    
    const hotelscardsincontainer=container.querySelectorAll('.container');
    // Loop through each container and apply room type selection
    hotelscardsincontainer.forEach(card => {
        RoomTypesSelection(card);
        const pricebutton=card.querySelector('.CheckPrice')
        pricebutton.addEventListener('click',() =>{
            calculatePrice(card);
        });
        const confirmbutton=card.querySelector('.BookRoom')
       confirmbutton.addEventListener('click',()=>{
           console.log("clicked on button")
          if(checkerinput(card)==true){
            ConfirmBookingButtonClicked(card)
          }else{
            console.log("error ")
          }
       });

       
    });
}
function checkerinput(card){
    var $card = $(card);
    
    // Extract number of people and rooms
    var numberPeople = parseInt($card.find(".PeopleNumber").val());
    var roomNumber = parseInt($card.find(".RoomNumber").val());
    var roomtype=$card.find(".selected").text();
    // Extract price per night and parse as float
    var priceText = $card.find(".price").text();
    var pricePerNight = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Extract and parse check-in and check-out dates
    var checkInDate = new Date($card.find("#checkindate").val());
    var checkOutDate = new Date($card.find("#checkoutdate").val());
    
    // Calculate the number of nights
    var numberNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Check input validity
    if (isNaN(numberPeople) || isNaN(roomNumber) || isNaN(pricePerNight) || isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        console.error("Invalid input values.");
        window.prompt("Invalid input values. Please check your inputs.");
        return false;
    }
    if (numberNights <0) {
        window.prompt("Invalid date range. Please check your dates.");
        return false;
    }else{
        return true;
    }
    
}
function calculatePrice(card) {
   
    var $card = $(card);
    
    // Extract number of people and rooms
    var numberPeople = parseInt($card.find(".PeopleNumber").val());
    var roomNumber = parseInt($card.find(".RoomNumber").val());
    var roomtype=$card.find(".selected").text();
    // Extract price per night and parse as float
    var priceText = $card.find(".price").text();
    var pricePerNight = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Extract and parse check-in and check-out dates
    var checkInDate = new Date($card.find("#checkindate").val());
    var checkOutDate = new Date($card.find("#checkoutdate").val());
    
    // Calculate the number of nights
    var numberNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Check input validity
    if (isNaN(numberPeople) || isNaN(roomNumber) || isNaN(pricePerNight) || isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        console.error("Invalid input values.");
        window.prompt("Invalid input values. Please check your inputs.");
        return;
    }
    
    // Calculate the total cost
    if (numberNights > 0) {
        var total = roomNumber * pricePerNight * numberNights * numberPeople;
        $card.find(".price").html( total.toFixed(2) );
        
        // Reset the price after 10 seconds
        setTimeout(() => {
            $card.find(".price").html( pricePerNight.toFixed(2) );
        }, 10000);
    } else {
        console.error("Invalid date range.");
        window.prompt("Invalid date range. Please check your dates.");
    }
}



const images=document.querySelectorAll('.card')
function settingactiveImage(event){
    images.forEach(image=>{
        image.classList.remove('active')
    })
}

async function ConfirmBookingButtonClicked(card) {
    var $card = $(card);
    var hotelid = $(card).attr("id");
    var numberPeople = parseInt($card.find(".PeopleNumber").val());
    var roomNumber = parseInt($card.find(".RoomNumber").val());
    var roomtype = $card.find(".selected").text();

    // Extract price per night and parse as float
    var priceText = $card.find(".price").text();
    var pricePerNight = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Extract and parse check-in and check-out dates
    var checkInDate = new Date($card.find("#checkindate").val());
    var checkOutDate = new Date($card.find("#checkoutdate").val());
    console.log(hotelid + "," + numberPeople + "," + roomNumber + "," + roomtype + "," + priceText + "," + pricePerNight + "," + checkInDate + "," + checkOutDate);

    // Check if the user is authenticated
    try {
        const authResponse = await fetch('/api/check-authentication');
        if (authResponse.status === 401) {
            alert("Login in first, future Solo traveler");
            window.location.href="/signIn"
            return;
        }

        const confirmationUrl = `/api/ConfirmBooking?hotelid=${hotelid}&checkindate=${checkInDate.toISOString()}&checkoutdate=${checkOutDate.toISOString()}&roomtype=${roomtype}&numberpeople=${numberPeople}&numberroom=${roomNumber}&totalprice=${pricePerNight}`;
        // Redirect to the confirmation page
        window.location.href = confirmationUrl;
    } catch (error) {
        console.error("Error checking authentication:", error);
    }
}


async function UpdatePriceBasedonRoomType(card){
    try {
        const response=await fetch(`/api/Hotels/Card/${card.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        let price= await response.json();
        let selectedcard=$(card);
        let roomtype=selectedcard.find(".selected").text().trim();
        console.log("in updates:"+roomtype)
    
        
        let updatedprice=price;
        console.log("in updates:"+updatedprice)
        if(roomtype=='Deluxe Room'){
            updatedprice+=150
           
        }else if (roomtype=='Suite Room'){
             updatedprice+=100
        }
        selectedcard.find(".price").html( updatedprice.toFixed(2));
    } catch (error) {
        console.error(`Error fetching hotel data for ${card.id}:`, error);
    }
   
    
}





