import datetime
from flask import Flask, render_template,jsonify,request,redirect, session,url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import json
from sqlalchemy import desc,and_
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import joinedload


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///hotel.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'solo'
UPLOAD_FOLDER = 'uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



db=SQLAlchemy(app)

with app.app_context():
    db.Model.metadata.reflect(db.engine)
   
class Hotel(db.Model):
    __table__ = db.metadata.tables['Hotel']
    
class UserFeedback(db.Model):
    __table__=db.metadata.tables['UserFeedback']    

##batoul made
class User(UserMixin,db.Model):
    __table__ = db.metadata.tables['User']
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False
    def get_id(self):
        return str(self.UserID)
    
    @property
    def hasreservation(self):
        usersreservation=HotelReservation.query.filter(HotelReservation.UserId==current_user.UserID).first()
        if usersreservation is not None:
            return True
        else:
            return False


class HotelReservation(db.Model):
    __table__=db.metadata.tables['HotelReservation']
    
   

class NewsletterSubscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'<NewsletterSubscription {self.email}>'

@app.route('/subscribe-newsletter', methods=['POST'])
def subscribe_newsletter():
    email = request.form['email']
    new_subscription = NewsletterSubscription(email=email)
    db.session.add(new_subscription)
    db.session.commit()
    return redirect('/') 



##batoul end
   


#start of api calls    
@app.route("/api/Popularhotels/<CountryName>")
def displaymostpopularhotel(CountryName):
    mostpopularhotels=Hotel.query.filter(Hotel.Location.ilike(f'%{CountryName}%')).order_by(Hotel.Rating.desc()).limit(3).all()    
    mostpopular_data=[]
    for hotel in mostpopularhotels:
        images=json.loads(hotel.Images)
        languages=json.loads(hotel.Languages)
        services=json.loads(hotel.Services)
        location = hotel.Location
        country = location.split(',')[-1].strip()
       
        data={
            'id':hotel.ID,
          'title': hotel.Name,
            'location': hotel.Location,
            'images': images,
            'languages': languages,
            'services': services,
            'rating': hotel.Rating,
            'prices': hotel.Prices,
            'locationprecise':hotel.locationprecise,
            'description':hotel.Description,
            'budgetcategory':hotel.BudgetCategory,
            'surrondingplaces':hotel.SurrondingPlaces,
            'country': country
            
       }
        mostpopular_data.append(data)
    return jsonify(hotels=mostpopular_data)     
       
@app.route("/api/hotels")
def displayhotel():
    hotels = Hotel.query.all()  
    results = []
    
    for hotel in hotels:
      
        images = json.loads(hotel.Images)
        languages = json.loads(hotel.Languages)
        services=json.loads(hotel.Services)
        location = hotel.Location
        country = location.split(',')[-1].strip()
      
        hotel_data = {
            'id':hotel.ID,
            'title': hotel.Name,
            'location': hotel.Location,
            'images': images,
            'languages': languages,
            'services': services,
            'rating': hotel.Rating,
            'prices': hotel.Prices,
            'locationprecise':hotel.locationprecise,
            'description':hotel.Description,
            'budgetcategory':hotel.BudgetCategory,
            'surrondingplaces':hotel.SurrondingPlaces,
            'country': country
        }

      
        results.append(hotel_data)

  
    return jsonify(hotels=results)
@app.route('/api/hotels/<CountryName>')
def get_hotels(CountryName):
    try:
      
        hotels = Hotel.query.filter(Hotel.Location.ilike(f'%{CountryName}%')).all()

      
        results = []

     
        for hotel in hotels:
            try:
                
                images = json.loads(hotel.Images)
                languages = json.loads(hotel.Languages)
                services=json.loads(hotel.Services)
                location = hotel.Location
                country = location.split(',')[-1].strip()
            
               
                hotel_data = {
                    'id':hotel.ID,
                    'title': hotel.Name,
                    'location': hotel.Location,
                    'images': images,
                    'languages': languages,
                    'services': services,
                    'rating': hotel.Rating,
                    'prices': hotel.Prices,
                    'locationprecise':hotel.locationprecise,
                    'description':hotel.Description,
                    'budgetcategory':hotel.BudgetCategory,
                    'surrondingplaces':hotel.SurrondingPlaces,
                    'country': country  
                    
                }

            
                results.append(hotel_data)
            except json.JSONDecodeError as e:
             
                print(f"Error parsing JSON for hotel {hotel.ID}: {e}")
        
      
        return jsonify(hotels=results)
    
    except Exception as e:
       
        print(f"Error processing request: {e}")
        return jsonify(error="An error occurred while processing the request."), 500





@app.route('/api/hotels/specific/<userinput>', methods=['GET'])
def analysis_based_on_user_selection(userinput):
    try:
        user_selection = userinput.split(',')
        if len(user_selection) < 5:
            return jsonify(error="Insufficient input provided."), 400

        budget_category = user_selection[2]
        print("budget:", budget_category)
        services_to_filter = user_selection[3]
        print("services:", services_to_filter)
        surrounding_places = user_selection[4]
        print("surrounding places:", surrounding_places)
        
        # Adjusted query to handle both budget preferences and no preference
        if budget_category.lower() == "no preference":
            hotels = Hotel.query.filter(
                Hotel.Services.ilike(f'%{services_to_filter}%'),
                Hotel.SurrondingPlaces.ilike(f'%{surrounding_places}%')
            ).all()
        else:
            hotels = Hotel.query.filter(
                Hotel.BudgetCategory.ilike(f'%{budget_category}%'),
                Hotel.Services.ilike(f'%{services_to_filter}%'),
                Hotel.SurrondingPlaces.ilike(f'%{surrounding_places}%')
            ).all()

        # Check if any hotels were found
        if not hotels:
            print("No hotels found matching criteria")
            return jsonify(hotels=[])

        results = []
        for hotel in hotels:
            try:
                images = json.loads(hotel.Images)
                languages = json.loads(hotel.Languages)
                services = json.loads(hotel.Services)
                location = hotel.Location
                country = location.split(',')[-1].strip()
                hotel_data = {
                    'id': hotel.ID,
                    'title': hotel.Name,
                    'location': hotel.Location,
                    'images': images,
                    'languages': languages,
                    'services': services,
                    'rating': hotel.Rating,
                    'prices': hotel.Prices,
                    'locationprecise': hotel.locationprecise,
                    'description': hotel.Description,
                    'budgetcategory': hotel.BudgetCategory,
                    'surrondingplaces': hotel.SurrondingPlaces,
                    'country': country
                }
                results.append(hotel_data)
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON for hotel {hotel.ID}: {e}")

        return jsonify(hotels=results)

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify(error="An error occurred while processing the request."), 500

@app.route("/api/hotels/id/<HotelId>")
def getHotelFromId(HotelId):
    try:
    
        hotel = Hotel.query.filter(Hotel.ID==HotelId).first()
        location = hotel.Location
       
        if hotel:
            location = hotel.Location
            country = location.split(',')[-1].strip()
            services=json.loads(hotel.Services)
            
            hotel_data = {
                'id': hotel.ID,
                'title': hotel.Name,
                'location': location,
                'country': country,  
                'images': json.loads(hotel.Images),
                'languages': json.loads(hotel.Languages),
                'services':services,
                'rating': hotel.Rating,
                'prices': hotel.Prices,
                'locationprecise': hotel.locationprecise,
                'description': hotel.Description,
                'budgetcategory': hotel.BudgetCategory,
                'surrondingplaces': hotel.SurrondingPlaces
            }
            
          
            
            return render_template("booking.html",hotel=hotel_data,country=country)
        else:
            return jsonify(error='Hotel not found'), 404
        
    except Exception as e:
        print("ERROR", e)
        return jsonify(error='An error occurred while processing the request'), 500

@app.route("/api/ConfirmBooking", methods=['GET'])
def confirm_booking():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not authenticated"}), 401
    user_name = current_user.FirstName 
    hotel_id = request.args.get("hotelid")
    hotel = Hotel.query.filter(Hotel.ID==hotel_id).first()
    id=hotel.ID
    check_in_date_str = request.args.get("checkindate")
    check_in_date = datetime.datetime.strptime(check_in_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    check_out_date_str = request.args.get("checkoutdate")
    check_out_date = datetime.datetime.strptime(check_out_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    room_type = request.args.get("roomtype").strip()
    number_people = request.args.get("numberpeople")
    number_room = request.args.get("numberroom")
    total_price = request.args.get("totalprice")

   
    checkin_day = check_in_date.day
    checkin_month = datetime.datetime(1900, check_in_date.month, 1).strftime("%B")
    checkin_year = check_in_date.year
    checkin_day_name = check_in_date.strftime("%A")

  
    checkout_day = check_out_date.day
    checkout_month = datetime.datetime(1900, check_out_date.month, 1).strftime("%B")
    checkout_year = check_out_date.year
    checkout_day_name = check_out_date.strftime("%A")

    # Create a dictionary
    data = {
        "hotel_id": hotel_id,
        "hotel_name": hotel.Name,  
        "checkin_day": checkin_day,
        "checkin_month": checkin_month,
        "checkin_year": checkin_year,
        "checkin_day_name": checkin_day_name,
        "checkout_day": checkout_day,
        "checkout_month": checkout_month,
        "checkout_year": checkout_year,
        "checkout_day_name": checkout_day_name,
        "room_type": room_type,
        "number_people": number_people,
        "number_room": number_room,
        "total_price": total_price
    }
    images= json.loads(hotel.Images)
    location = hotel.Location
    country = location.split(',')[-1].strip()
    print(images[0])
    return render_template("ticket.html",
                           hotel_name=hotel.Name,
                           hotel=hotel,
                           hotel_image=images[0],
                           checkin_day_name=checkin_day_name,
                           checkin_month=checkin_month,
                           checkin_day=checkin_day,
                           checkin_year=checkin_year,
                           checkout_day_name=checkout_day_name,
                           checkout_month=checkout_month,
                           checkout_day=checkout_day,
                           checkout_year=checkout_year,
                           room_type=room_type,
                           country=country,
                           number_room=number_room,
                           number_people=number_people,
                           total_price=total_price,
                           id= id ,
                           User=user_name,
                           check_in_date_str=check_in_date_str,
                           check_out_date_str=check_out_date_str
                        )  

@app.route('/api/hotels/toprated')
def TopRated():
    Budget=request.args.get('BudgetCategory')
    
    topRatedInLuxury=Hotel.query.filter(Hotel.BudgetCategory==Budget).order_by(desc(Hotel.Rating)).limit(1)
    mostpopular_data=[]
    for hotel in topRatedInLuxury:
        images=json.loads(hotel.Images)
        languages=json.loads(hotel.Languages)
        services=json.loads(hotel.Services)
        location = hotel.Location
        country = location.split(',')[-1].strip()
       
        data={
            'id':hotel.ID,
          'title': hotel.Name,
            'location': hotel.Location,
            'images': images,
            'languages': languages,
            'services':services,
            'rating': hotel.Rating,
            'prices': hotel.Prices,
            'locationprecise':hotel.locationprecise,
            'description':hotel.Description,
            'budgetcategory':hotel.BudgetCategory,
            'surrondingplaces':hotel.SurrondingPlaces,
            'country': country
            
       }
        mostpopular_data.append(data)
        return jsonify(mostpopular_data)
    
    
    
    
@app.route('/api/Hotels/Card/<CardId>')
def getSpecificHotel(CardId):
    target=Hotel.query.filter(Hotel.ID==CardId).first()
    return jsonify(target.Prices)
        

@app.route('/api/Hotels/ReservationConfirm')
def saving_reservation_to_database():
   
    user_id = None
    user_name = None
    if current_user.is_authenticated:
        user_id = current_user.UserID
        user_name = current_user.FirstName
    
   
    hotel_id = request.args.get("hotelid")
    hotel = Hotel.query.filter(Hotel.ID == hotel_id).first()
    if not hotel:
        return jsonify({"error": "Hotel not found"}), 404  
    
   
    check_in_date_str = request.args.get("checkindate")
    check_in_date = datetime.datetime.strptime(check_in_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
    check_out_date_str = request.args.get("checkoutdate")
    check_out_date = datetime.datetime.strptime(check_out_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
   
    room_type = request.args.get("roomtype").strip()
    number_people = request.args.get("numberpeople")
    number_room = request.args.get("numberroom")
    total_price = request.args.get("totalprice")
    
  
    new_reservation = HotelReservation(
        HotelId=hotel_id,
        UserId=user_id,
        CheckInDate=check_in_date,
        CheckOutDate=check_out_date,
        RoomType=room_type,
        NumberPeople=number_people,
        NumberRoom=number_room
    )
    db.session.add(new_reservation)
    db.session.commit() 
    
    return redirect(url_for('index'))

@app.route('/api/Userfeedback')
def FetchUserFeedback():
    data = UserFeedback.query.all()

    feedbacks_data = []
    for feedback in data:
        
        hotel = Hotel.query.get(feedback.HotelId)
        location = hotel.Location
        country = location.split(',')[-1].strip()
        if hotel:
            feedbacks_data.append({
                'HotelName': hotel.Name,  
                'Suggestions': feedback.Suggestions,
                'Experience': feedback.Experience,
                'Rating': feedback.Rating,
                'UserImage': feedback.UserImage  ,
                'HotelLocation':hotel.Location,
                'HotelId':hotel.ID,
                'Country':country
                
            })

    return jsonify(feedbacks_data)





def get_feedback_data(feedbacks):
    feedbacks_data = []
    for feedback in feedbacks:
        hotel = Hotel.query.get(feedback.HotelId)
        if hotel:
            image_url = url_for('uploaded_file', filename=feedback.UserImage)
            location_parts = hotel.Location.split(',')
            country = location_parts[-1].strip() if len(location_parts) > 1 else ''
            feedbacks_data.append({
                'HotelName': hotel.Name,
                'Suggestions': feedback.Suggestions,
                'Experience': feedback.Experience,
                'Rating': feedback.Rating,
                'UserImage': image_url,
                'HotelLocation': hotel.Location,
                'HotelId': hotel.ID,
                'Country': country
            })
    return feedbacks_data

@app.route("/api/UsersFeedback/<countryname>")
def gettingsUsersFeedback(countryname):
    feedbacks = (UserFeedback.query
                     .join(Hotel, UserFeedback.HotelId == Hotel.ID)
                     .filter(Hotel.Location.ilike(f'%{countryname}%'))
                    .all())
    feedbacks_data = get_feedback_data(feedbacks)
    if feedbacks_data:
        return jsonify(feedbacks_data), 200
    else:
        return jsonify({'message': 'No feedback found for the specified country.'}), 404




@app.route('/api/saveUserInput', methods=['POST'])
@login_required
def save_user_input():
    if not current_user.is_authenticated:
        return jsonify({"error": "User not authenticated"}), 401
    rating = request.form.get('rating')
    experience = request.form.get('experience')
    suggestions = request.form.get('suggestions')
    file = request.files.get('file')

    # Get the hotel reservation for the logged-in user
    user_reservations = HotelReservation.query.filter_by(UserId=current_user.UserID).all()

# Check if there are any reservations
    if user_reservations:
    # Get the last reservation
     hotel_reservation= user_reservations[-1]
    
    if not rating or not experience or not suggestions or not hotel_reservation:
        return jsonify({"error": "Missing required fields or hotel reservation not found"}), 400

    new_feedback = UserFeedback(
        UserId=current_user.UserID,
        HotelId=hotel_reservation.HotelId,
        Rating=rating,
        Suggestions=suggestions,
        Experience=experience
    )

    if file and file.filename != '':
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        new_feedback.UserImage = filename  

    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({"message": "User input saved successfully"}), 201


@app.route('/api/check-authentication')
def check_authentication():
    if not current_user.is_authenticated:
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True}), 200








# Routes Normal
@app.route("/WelcomeSoloTravelers")
def index():
  
    return render_template("index.html")









@app.route("/HotelsPage")
def bookingPage():
    dubai=get_hotels("Lebanon")
   
    country=request.args.get('countryname')
    id=request.args.get('id')
    if country is "" and id is "":
        country="Dubai"
        id="3"
    return render_template("booking.html",country=country,id=id)


    
@app.route("/WhereToGoPage")
def wheretogoPage():
    return render_template("wheretogo.html")

@app.route("/SignInPage")
def signinPage():
    return render_template("signIn.html")

@app.route("/CreateAccountPage")
def createaccountPage():
    return render_template("createAccount.html")

@app.route("/map")
def showingmap():
    return render_template("map.html")
from datetime import datetime as dt
@app.route('/BeSolo')

def showBeSolo():
    
    if current_user.is_authenticated:
     currentdate=dt.now()
     has_reservation=current_user.hasreservation
     recent_reservation = HotelReservation.query \
    .outerjoin(UserFeedback, and_(UserFeedback.HotelId == HotelReservation.HotelId,
                                  UserFeedback.UserId == HotelReservation.UserId)) \
    .filter(HotelReservation.UserId == current_user.UserID) \
    .filter(UserFeedback.UserId == None) \
    .order_by(desc(HotelReservation.CheckOutDate)) \
    .first()

    if recent_reservation:       
     hotelname=Hotel.query.filter(Hotel.ID==recent_reservation.HotelId).first().Name 
     checkout_date_str = recent_reservation.CheckOutDate 
        
        
     checkout_date = dt.strptime(checkout_date_str, '%Y-%m-%d %H:%M:%S')     
     checkout_passed = checkout_date is not None and checkout_date < currentdate
    else:
     has_reservation=False 
     checkout_passed=False
     hotelname=None
   
    return render_template("BeSolo.html",user=current_user,has_reservation=has_reservation,checkout_passed=checkout_passed,hotelname=hotelname)




from flask import url_for

@app.route('/api/showingfeedback')
def showingfeedback():
    feedbacks = UserFeedback.query.all()
    data = []
    for feedback in feedbacks:
        hotel = Hotel.query.get(feedback.HotelId)
        if hotel:
            image_url = url_for('uploaded_file', filename=feedback.UserImage)
            location_parts = hotel.Location.split(',')
            country = location_parts[-1].strip() if len(location_parts) > 1 else ''
            data.append({
                'HotelName': hotel.Name,
                'Suggestions': feedback.Suggestions,
                'Experience': feedback.Experience,
                'Rating': feedback.Rating,
                'UserImage': image_url,
                'HotelLocation': hotel.Location,
                'HotelId': hotel.ID,
                'Country': country
            })
    return jsonify(data)
from flask import send_from_directory
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    







# Login Route
login_manager = LoginManager(app)






# User Loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))



# Login Route
@app.route('/createAccount', methods=['GET', 'POST'])
def createAccount():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        FirstName = request.form['FirstName']
        LastName = request.form['LastName']
        Age = request.form['Age']
        Nationality = request.form['Nationality']
        Password = request.form['Password']
        Email = request.form['Email']
        new_user = User(FirstName = FirstName , Password = generate_password_hash(Password), LastName=LastName,Email=Email,Age=Age,Nationality=Nationality)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('index'))

        


    return render_template('createAccount.html')

@app.route('/signIn', methods=['GET', 'POST'])
def signIn():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        Email = request.form['Email']
        Password = request.form['Password']
        user = User.query.filter_by(Email=Email).first()
        # if user and user.password == password:
        if user and check_password_hash(user.Password, Password):
            login_user(user)
            return redirect(url_for('index'))
        

    return render_template('signIn.html')


@app.route('/logout')
@login_required  
def logginout():
    logout_user()  
    return redirect(url_for('index'))





@app.route('/profile')
@login_required
def profile():
   
    reservations = db.session.query(HotelReservation, Hotel).join(Hotel, HotelReservation.HotelId == Hotel.ID).filter(HotelReservation.UserId == current_user.UserID).all()
    
  
    feedbacks = db.session.query(UserFeedback, Hotel).join(Hotel, UserFeedback.HotelId == Hotel.ID).filter(UserFeedback.UserId == current_user.UserID).all()
    
    return render_template('profile.html', user=current_user, reservations=reservations, feedbacks=feedbacks)


@app.route("/updatethereservation")
def updatingthereservation(reservationId,methods=['GET','POST']):
    
    if(request.method=='POST'):
       check_in_date_str = request.args.get("checkindate")
       check_in_date = datetime.datetime.strptime(check_in_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    
       check_out_date_str = request.args.get("checkoutdate")
       check_out_date = datetime.datetime.strptime(check_out_date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
       room_type = request.args.get("roomtype").strip()
       number_people = request.args.get("numberpeople")
       number_room = request.args.get("numberroom")
       total_price = request.args.get("totalprice")
    
        
    return render_template("/updatingReservation",reservation=reservation)
    







if __name__ == "__main__":
    app.run(debug=True, port=5001)
