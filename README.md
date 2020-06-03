# roulette-api

Install Dependencies:
  
    $ npm install
    
Local run app (require local redis server):

    $ npm start
    
Run docker app:

    docker-compose up --build

API:

- POST /roulette:

  Create new roulette
  
  CURL:
  
      curl --location --request POST 'http://localhost:8110/roulette'
      
  
- POST /open-roulette
  
  Open roulette with specific id
  
  CURL:
  
      curl --location --request POST 'http://localhost:8110/open-roulette' --header 'Content-Type: application/json' --header 'Content-Type: application/json' --data-raw '{ "rouletteId": "030172f2-6156-459c-af95-bb7f454f099d" }'
      
- POST /bet

  Set bet to specific roulette
  
  CURL:
  
      curl --location --request POST 'http://localhost:8110/bet' --header 'Content-Type: application/json' --header 'X-UserId: 1234567890' --header 'Content-Type: application/json' --data-raw '{
      	"rouletteId": "030172f2-6156-459c-af95-bb7f454f099d",
      	"number": 0,
      	"amount": 9999,
      	"color": "black"
      }'
      
      La peticion exitosa requiere exclusivamnete number (0-36) o color (red o black)
      
- POST /close-roulette

  Close roulette with specific id
  
  CURL:
  
      curl --location --request POST 'http://localhost:8110/close-roulette' --header 'Content-Type: application/json' --header 'Content-Type: application/json' --data-raw '{ "rouletteId": "030172f2-6156-459c-af95-bb7f454f099d" }'
      
- GET /roulettes

  Get all roulettes and their status
  
  CURL:
  
      curl --location --request GET 'http://localhost:8110/roulettes'
      
