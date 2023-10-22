(function() {
    "use strict";
    
    //clock

    document.addEventListener("DOMContentLoaded", function () {
      let c = document.getElementById("clock");

      //setTimeout(updateClock, 2000);
      setInterval(updateClock, 1000);

      function updateClock() {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        let period = "EL"; // Vaikimisi perioon on EL

        // Kui tunnid on suuremad kui 12, muudame EL-i PL-ks.
        if (h >= 12) {
          period = "PL";
          if (h > 12) {
            h = h - 12;
          }
        }

        // Kui tunnid on 0 (ehk südaöö), siis seame kella väärtuseks 12
        if (h == 0) {
          h = 12;
        }

        // Tagame ka selle, et numbrid mis on alla 10-ne algavad 0-ga.
        if (m < 10) {
          m = "0" + m;
        }

        if (s < 10) {
          s = "0" + s;
        }

        c.innerHTML = h + ":" + m + ":" + s + " " + period;
      }
    });
    
    // forms
    
    document.getElementById("form").addEventListener("submit", estimateDelivery);
    
    let e = document.getElementById("delivery");
    e.innerHTML = "0,00 &euro;";
    
    function estimateDelivery(event) {
        event.preventDefault();
        
        let kokku = 0;
        let kingituseHind = 5;
        let kontaktivabaTarneHind = 1;
        let linnaHinnad = {
            "tln": 0, 
            "trt": 2.5,
            "nrv": 2.5, 
            "prn": 3
        };
        const fname = document.getElementById("fname");
        const lname = document.getElementById("lname");

        if (fname.value === "" || lname.value === "") {
          alert("Palun sisestage täisnimi");
          return;
        };

        const containsNumber = /\d/;
        if (containsNumber.test(fname.value + lname.value)) {
          alert("Nimed ei tohi numbreid sisaldada");
          return;
        };

        let linn = document.getElementById("linn");

        if (linn.value === "") {
            alert("Palun valige linn nimekirjast");
            linn.focus();
            return;
        } 

        const redBow = document.getElementById("redbow");
        const blueBow = document.getElementById("bluebow");

        if (!redBow.checked && !blueBow.checked) {
          alert("Palun valige lipsu värv");
          return;
        };
        
        // Kontrollime, kas kingitus on valitud
        let onKingitus = document.getElementById("v1").checked;
        if (onKingitus) {
            kokku += kingituseHind;
        }

        // Kontrollime, kas soovitakse kontaktivaba tarnet
        let onKontaktivaba = document.getElementById("v2").checked;
        if (onKontaktivaba) {
            kokku += kontaktivabaTarneHind;
        }

        // Lisame linna hinna, kui see on olemas
        if (linn.value in linnaHinnad) {
            kokku += linnaHinnad[linn.value];
        }
        // Uuendame tarnehinda kasutajaliideses 
        e.innerHTML = kokku.toFixed(2) + " &euro;";       
        
        console.log("Tarne hind on arvutatud");
    }
    let form = document.getElementById("form");
    form.addEventListener("submit", estimateDelivery);
})();

// map

let mapAPIKey = "AqLLRE37SJGqIxXEYxezPUa6fF2oCzl3cvG4n05FtFIVBrotBYxchpMYYpwuxBak";

let map;

function GetMap() {
    
    "use strict";

    let centerPoint = new Microsoft.Maps.Location(58.367092, 26.244091);

    
    const TUposition = new Microsoft.Maps.Location(58.38104, 26.71992);
    const Ugalaposition = new Microsoft.Maps.Location(58.362331, 25.587551);
    map = new Microsoft.Maps.Map("#map", {
        credentials: mapAPIKey,
        center: centerPoint,
        zoom: 10,
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        disablePanning: false
    });
    
    let pushpin = new Microsoft.Maps.Pushpin(TUposition, {
            title: 'Tartu Ülikool',
            //subTitle: 'Hea koht',
            //text: 'UT'
        });

    const pushpin2 = new Microsoft.Maps.Pushpin(Ugalaposition, {
      title: "Ugala",
      //subTitle: "Parem koht",
      //text: "Teater"
    })
    map.entities.push(pushpin);
    map.entities.push(pushpin2);

    const infobox = new Microsoft.Maps.Infobox(centerPoint, {
      visible: false,
    });
    infobox.setMap(map);
    const pin = new Microsoft.Maps.Pushpin(centerPoint);
    pin.metadata = {
      title: "Vajutasid pinile",
      description: "Siin on kaardi keskpunkt",
    };
    Microsoft.Maps.Events.addHandler(pin, "click", pushpinClicked);
    map.entities.push(pin);
    const vortsJarveLoc = new Microsoft.Maps.Location(58.351652, 26.053709);
    const infobox2 = new Microsoft.Maps.Infobox(vortsJarveLoc, {
      visible: false,
    });
    infobox2.setMap(map);
    const pin2 = new Microsoft.Maps.Pushpin(vortsJarveLoc);
    pin2.metadata = {
      title: "Vajutasid pinile nr2",
      description: "Siin on Vortsjarv",
    };
    Microsoft.Maps.Events.addHandler(pin2, "click", pushpinClicked);
    map.entities.push(pin2);

    function pushpinClicked(e) {
      console.log(e.target);
      infobox.setOptions({
        location: e.target.getLocation(),
        title: e.target.metadata.title,
        description: e.target.metadata.description,
        visible: true,
      });
   }
}

// https://dev.virtualearth.net/REST/v1/Locations?q=1000 Vin Scully Ave, Los Angeles,CA&key=YOUR_KEY_HERE

