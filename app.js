const express = require("express");
var ThingSpeakClient = require("thingspeakclient");
var client = new ThingSpeakClient();
var https = require("https");
var lightStatus;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000);
client.attachChannel(1328778, {
    writeKey: "NPPJYBD8QI9737QE",
    readKey: "UHZLQJ38DK4TE89R",
});
app.get("/", function(req, res) {

    const url = "https://api.thingspeak.com/channels/1328778/feeds.json?results=1";
    https.get(url, function(response) {
        response.on("data", function(data) {
            var TotalData = JSON.parse(data);
            lightStatus = TotalData.feeds[0].field5;
            console.log("in");
            console.log(lightStatus);
            if (lightStatus === '1') {
                res.render("\TurnOn", {
                    Statusvar: 'Off'
                });
            } else {
                res.render("\TurnOn", {
                    Statusvar: 'On'
                });
            }
            console.log("get : ");
            console.log(lightStatus);
        });
    });
});

app.post("/", function(req, res) {

    const url = "https://api.thingspeak.com/channels/1328778/feeds.json?results=1";
    https.get(url, function(response) {
        response.on("data", function(data) {
            var TotalData = JSON.parse(data);
            var lightStatus = TotalData.feeds[0].field5;
            if (lightStatus === '1') {
                client.updateChannel(1328778, { field5: 0, field6: 0, field7: 0 });
                console.log("p1");
                res.render("\TurnOn", {
                    Statusvar: 'On'
                });
            } else {
                client.updateChannel(1328778, { field5: 1, field6: 1, field7: 1 });
                console.log("p12");
                res.render("\TurnOn", {
                    Statusvar: 'Off'
                });
            }

        });
    })
})
app.get("/About", function(req, res) {
    res.sendFile(__dirname + "/about.html")
})
app.post("/About", function(req, res) {
    res.redirect("/");
})