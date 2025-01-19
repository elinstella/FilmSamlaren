# FilmSamlaren

Kortfattad beskrivning om FilmSamlaren:
FilmSamlaren är en användarvänlig applikation, perfekt för Hemmakvällen.

Applikationen består av två huvudsidor: en framsida/söksida och en favoritsida. Navigeringen är enkel och intuitiv, med tydlig text i headern som snabbt förklarar appens funktionalitet. Längre ner på sidorna finns stora, lättåtkomliga knappar som leder användaren till respektive sida. Sökfunktionen är designad för att vara både tydlig och responsiv, vilket ger användaren en smidig upplevelse.


Design för hemsidan, Figma-skiss: 
https://www.figma.com/design/f3pBJgPBfe40EYqExLwguP/FilmSamlaren?m=auto&t=BWiNmtW04wa1d2AO-1


Steg för att kolla på projektet:
Klona repositoryt:
Öppna terminalen och kör: bash
Kopiera kod:  git clone https://github.com/elinstella/FilmSamlaren.git
Navigera sedan till mappen: bash
Kopiera kod:  cd FilmSamlaren

Öppna i webbläsaren
Gå in på mappen html och vänsterklicka på filmsalmaren.html, och öppna i live server.


Information: 
JSON: API-svaren hanteras som JSON och konverteras med response.json() för att manipulera data effektivt.

HTTP/HTTPS: API-anrop görs via HTTPS för säker dataöverföring (t.ex. https://api.themoviedb.org/3).
Asynkronitet: async/await används i funktioner som fetchGenres och searchMovies för att göra asynkrona API-anrop utan att låsa gränssnittet.

UX/UI:
Genrefilter, sökfält och paginering förbättrar användarupplevelsen.
Popup-fönster visar filmdetaljer, och användare kan spara favoriter lokalt.

API-hämtning:
API: TMDB API (The Movie Database)

Endpoints:
Genrer: /genre/movie/list
Sökning: /search/movie
Upptäck: /discover/movie
Filmdetaljer: /movie/{movie_id}
Parametrar: api_key, language, query, page.
API-nyckel: a5386f918776f921b00e4d085cadf0a1.

Navigering:
Sök och filtrera: Ange söktext och/eller välj genre för att filtrera filmer.
Paginering: Använd "Nästa" och "Föregående" för att navigera mellan sidor.
Filminteraktion: Klicka på filmer för popup-detaljer eller lägg till favoriter med en knapp. Favoriter sparas lokalt.
Felhantering: Felmeddelanden visas om API-anrop misslyckas.
