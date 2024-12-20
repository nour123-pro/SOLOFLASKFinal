import * as bookingLogic from './booking.js';

function generateHotelArticles(hotels,country) {
    let articlesHTML = '';
    
    hotels.forEach(hotel => {
        const hotelClass = hotel.title.toLowerCase().replace(/\s/g, '-');
        articlesHTML += `
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
        
            <div class="compressed">
              <img src="/static/assets/location.png" alt="">
              <p>${hotel.location}</p>
            </div>
          </div>
          </article>
          
          `;
        
    });

    return articlesHTML;
}
function generateBookingCards(hotels){
    let articlesHTML="";
   
}

async function fetchHotelData(country) {
    try {
       
        const response = await fetch(`/api/Popularhotels/${country}`);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        // Parse the JSON data
        const data = await response.json();
        
        
        // Return the hotel data
        return data.hotels;
    } catch (error) {
        console.error(`Error fetching hotel data for ${country}:`, error);
    }
}
async function fetchalldata(){
   try{
     const response=await fetch(`api/hotels`);
     if(!response.ok){
        throw new Error(`HTTP error ${response.status}`);
     }
     const data=await response.json();
     return data.hotels;
   }catch(error){
        console.error(`Error fetching hotels `,error);
   }
}
function ButtonsSelection(){
    const buttons=document.querySelectorAll(".popular-hotels__filter-btn")
    buttons.forEach(button=>{
         button.addEventListener('click',async()=>{
            const country = button.id;
           
            try {
                // Fetch the related hotels for the selected country
                let  relatedHotels;
                if(country=='all'){
                    relatedHotels=await fetchalldata();
                }else{
                    relatedHotels = await fetchHotelData(country);
                }
                  
                
              
                
                // Generate hotel articles for the fetched data
                const createdHotelsCards = generateHotelArticles(relatedHotels,country);
               
                // Update the container with the generated hotel articles
                const container = document.getElementById('popularcontainer');
                container.innerHTML = createdHotelsCards;
            } catch (error) {
                window.prompt(`Error while processing selection for ${country}:`, error);
            }
         })
    });

}

async function displaybydefault(){
    try {
      
       
        const lebanonHotels= await fetchHotelData("Lebanon");
        const turkeyHotels= await fetchHotelData("Turkey");
        const newyorkhotels= await fetchHotelData("New York");
        const romahotels= await fetchHotelData("Roma");
        const dubiahotels= await fetchHotelData("Dubai");
        const parishotels=await fetchHotelData("Paris");
        const relatedHotels=[...lebanonHotels,...turkeyHotels,...newyorkhotels,...romahotels,...dubiahotels,...parishotels]
        
     
        const createdHotelsCards = generateHotelArticles(relatedHotels,[]);
       
        // Update the container with the generated hotel articles
        const container = document.getElementById('popularcontainer');
        container.innerHTML = createdHotelsCards;
    } catch (error) {
        window.prompt(`Error while processing `, error);
    }
}

ButtonsSelection();


window.addEventListener('DOMContentLoaded', () => {
    displaybydefault();
});
document.addEventListener("DOMContentLoaded", function () {
    const element = document.querySelector(".about-us__image-hotel3");
  
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  
    function checkVisibility() {
      if (isInViewport(element)) {
        element.classList.add("slideIn");
        window.removeEventListener("scroll", checkVisibility);
      }
    }
  
    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
  
    
    checkVisibility();
  });
  








