//jshint esversion:6
"use script";
const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/",function(req,res){
res.sendFile(__dirname+"/index.html");   
})

app.post("/",function(req ,res){
    const query=req.body.cityName;
    if (!query) { // Check if query is empty or null
        const errorMessage =
            `<script>
                alert("Please enter any city name.");
                window.location.href = '/';
            </script>`;
        res.send(errorMessage);
    }
    else{
    const apiKey=process.env.WEATHER_API_KEY;
    const unit="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+apiKey;
    https.get(url,function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData=JSON.parse(data);

            const temp=weatherData.main.temp;
            const weather=weatherData.weather[0].main;
            const desp=weatherData.weather[0].description;
            const wind=weatherData.wind.speed;
            const city=weatherData.name;
            const feelLike=weatherData.main.feels_like;
            const humidity=weatherData.main.humidity;
            const icon=weatherData.weather[0].icon;
            const imgURL="https://openweathermap.org/img/wn/"+icon+"@2x.png";
            
            const weatherInfoHTML = 
            `<head>
            <link rel="stylesheet" href="/css/styles.css">
            </head>
        <body class="result">
            <div class="container">
            <h1>Weather of ${city}</h1>
                <img src="${imgURL}">
                <p>Temperature: ${temp} C</p>
                <p>Feel Like: ${feelLike} C</p>
                <p>Weather: ${weather}</p>
                <p>Description: ${desp}</p>
                <p>Wind Speed: ${wind}m/s</p>
                <p>Humidity: ${humidity}%</p>
                <p class="copyright">&copy copyright Shashi Pratap ⛅</p>
            </div>
        </body>`;
              res.send(weatherInfoHTML);
        })
    })
    }
})
 // res.send("Server is running...");
app.listen(3000,function(){
    console.log("Server start at port 3000");
});