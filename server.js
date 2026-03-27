// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from "express";

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import {Liquid} from "liquidjs";

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express();

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({extended: true}));

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static("public"));

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine("liquid", engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set("views", "./views");

app.get("/", async function (request, response) {
  // Render index.liquid uit de Views map

  response.render("index.liquid", {path: request.path});
});

app.get("/nieuws", async function (request, response) {
  const params = {
    "groupBy[]": "title,description,date",
  };
  const newsResponse = await fetch(
    "https://fdnd-agency.directus.app/items/adconnect_news/?" +
      new URLSearchParams(params),
  );

  response.render("news.liquid", {path: request.path});
});

app.get("/nieuws-toevoegen", async function (request, response) {
  response.render("add-news.liquid", {path: request.path});
});

app.post("/nieuws-toevoegen", async function (request, response) {
  let result = await fetch(
    "https://fdnd-agency.directus.app/items/adconnect_news",
    {
      method: "POST",
      body: JSON.stringify({
        description: request.body.description,
        body: request.body.body,
        status: request.body.status,
        titel: request.body.title,
        author: request.body.author,
        date: request.body.date,
      }),

      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
  );
  console.log(result);
  let resultJSON = await result.json();
  console.log(resultJSON);
  response.redirect(303, "/nieuws-toevoegen");
});

app.get("/lado", async function (request, response) {
  // Render index.liquid uit de Views map

  response.render("lado.liquid", {path: request.path});
});

/*
// Zie https://expressjs.com/en/5x/api.html#app.post.method over app.post()
app.post(…, async function (request, response) {

  // In request.body zitten alle formuliervelden die een `name` attribuut hebben in je HTML
  console.log(request.body)

  // Via een fetch() naar Directus vullen we nieuwe gegevens in

  // Zie https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch over fetch()
  // Zie https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify over JSON.stringify()
  // Zie https://docs.directus.io/reference/items.html#create-an-item over het toevoegen van gegevens in Directus
  // Zie https://docs.directus.io/reference/items.html#update-an-item over het veranderen van gegevens in Directus
  const fetchResponse = await fetch(…, {
    method: …,
    body: JSON.stringify(…),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })

  // Als de POST niet gelukt is, kun je de response loggen. Sowieso een goede debugging strategie.
  // console.log(fetchResponse)

  // Eventueel kun je de JSON van die response nog debuggen
  // const fetchResponseJSON = await fetchResponse.json()
  // console.log(fetchResponseJSON)

  // Redirect de gebruiker daarna naar een logische volgende stap
  // Zie https://expressjs.com/en/5x/api.html#res.redirect over response.redirect()
  response.redirect(303, …)
})
*/

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set("port", process.env.PORT || 8000);

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console
  console.log(
    `Daarna kun je via http://localhost:${app.get("port")}/ jouw interactieve website bekijken.\n\nThe Web is for Everyone. Maak mooie dingen 🙂`,
  );
});
