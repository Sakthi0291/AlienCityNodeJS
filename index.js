var express = require('express');
var app = express();
var catalyst = require('zcatalyst-sdk-node');
app.use(express.json());
app.use(express.static('public'));
const tableName = 'AlienCity'; // The table created in the Data Store
const columnName = 'CityName'; // The column created in the table
 
app.post('/alien', (req, res) => {
    var cityJson = req.body;
    console.log("12334");
    console.log("090 ");
    console.log(req.body)
    console.log("start");
    console.log("080");
    ////Hello
    var catalystApp = catalyst.initialize(req);
    console.log("end");
    getDataFromCatalystDataStore(catalystApp, cityJson.city_name).then(cityDetails => {
        if (cityDetails.length == 0) {
            console.log("Alien alert!");
            var rowData = {}
            rowData[columnName] = cityJson.city_name;
 
            var rowArr = [];
            rowArr.push(rowData);
            // Inserts the city name as a row in the Catalyst Data Store table
            catalystApp.datastore().table(tableName).insertRows(rowArr).then(cityInsertResp => {
                res.send({
                    "message": "Thanks for reporting!"
                });
            }).catch(err => {
                console.log(err);
                sendErrorResponse(res);
            })
        } else {
            res.send({
                "message": "Looks like you are not the first person to encounter aliens in this city! Someone has already reported an alien encounter here!"
            });
        }
    }).catch(err => {
        console.log(err);
        sendErrorResponse(res);
    })
});
 
app.get('/alien', (req, res) => {
    var city = req.query.city_name;
 
    // Initializing Catalyst SDK
    var catalystApp = catalyst.initialize(req);
    getDataFromCatalystDataStore(catalystApp, city).then(cityDetails => {
        if (cityDetails.length == 0) {
            res.send({
                "message": "Hurray! No alien encounters in this city yet!",
                "signal": "negative"
            });
        } else {
            res.send({
                "message": "Uh oh! Looks like there are aliens in this city!",
                "signal": "positive"
            });
        }
    }).catch(err => {
        console.log(err);
        sendErrorResponse(res);
    })
});
 
 
function getDataFromCatalystDataStore(catalystApp, cityName) {
    return new Promise((resolve, reject) => {
        // Queries the Catalyst Data Store table
        catalystApp.zcql().executeZCQLQuery("select * from " + tableName + " where " + columnName + "  = " + "'" +  cityName +"'").then(queryResponse => {
            resolve(queryResponse);
        }).catch(err => {
            reject(err);
        })
    });
 
}
 
function sendErrorResponse(res) {
    res.status(500);
    res.send({
        "error": "Internal server error occurred. Please try again in some time."
    });
}
 

//--------//-----------------Appsail---SMTP-------//------------//


app.get('/Testing', async (req, res) => {
  
	// var catalystApp = catalyst.initialize(req);
    console.log("Inside server!");
    
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  
        port: 587,                 
        secure: false,            
        auth: {
          user: 'santhosh301999@gmail.com',  
          pass: 'xjeg qsqp ssxe scpa'       
        }

      });

      const mailOptions = {
        from: 'santhosh301999@gmail.com',     
        to: 'sakthi40750291@gmail.com',        
        subject: 'Welcome!!!',     
        text: 'Helloo!!!!!',           
      };

      console.log("Mail Details  ",mailOptions);


      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log('Error occurred:', error);
        }
        console.log('Email sent successfully:', info.response);
      });

      res.send("Success");

    });





app.get('/enrich', async (req, res) => {

    const catalyst = require("zcatalyst-sdk-node");
    // const app = catalyst.initialize(req);

  // console.log(req);
  // const providedAuthCode = req.headers.authorization.split(" ")[1];
  // console.log("Req headers", req.headers.authorization);
  // console.log("ProvidedAuth code",providedAuthCode);
//   console.log(req);
  const authHeader = req.headers.authorization.split(" ")[1];
  console.log("AuthHeader", authHeader);

    if (!authHeader) {
        return res.status(401).send({ error: "Authorization header is missing" });
    }

    const providedAuthCode = authHeader.split(" ")[1];
    console.log("ProvidedCode", providedAuthCode);
    if (providedAuthCode === "test_api_key_12345") {
     
      res.status(200).send({ message: "Authorization header received correctly", token: providedAuthCode });
  } else {
      // Respond with an error if the token is invalid
      res.status(401).send({ error: "Unauthorized: Invalid API key" });
  }

       
    
});




// 	let email = catalystApp.email(); 
//     let config = {
//     from_email: 'santhosh301999@gmail.com', 
//     to_email: 'sakthi40750291@gmail.com',
//     subject: 'We welcome you on board',
//     content: 'Hello!!!',   
//     html_mode: true
//    };
  
  

//    let mailPromise = email.sendMail(config);

//    await mailPromise.then( (mailObject) => {      
//    console.log(mailObject);
   

//    }).catch ((err) => {
//         console.error(err);
//    });

    








 
app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT || 9000, () => {
})
 
module.exports = app;





