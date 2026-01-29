# Kokoushuoneiden varausrajapinta

REST API kokoushuonevarausten hallintaan.

## Asennus ja käyttöönotto

1. Asenna riippuvuudet:
```bash
npm install
```

2. Käynnistä kehitystilassa:
```bash
npm run dev
```

3. Tai rakenna ja käynnistä:
```bash
npm run build
npm start
```

Palvelin käynnistyy oletusportissa 3000.

## API-rajapinnat

### Varauksen luonti
```
POST /api/bookings
```

Pyyntörunko:
```json
{
  "roomId": "room-1",
  "startTime": "2026-01-27T10:00:00Z",
  "endTime": "2026-01-27T11:00:00Z",
  "bookedBy": "user1"
}
```

### Varauksen peruutus
```
DELETE /api/bookings/:id
```

### Huoneen varausten listaus
```
GET /api/rooms/:roomId/bookings
```

## Toimintalogiikka

- Varaukset eivät saa mennä päällekkäin samalle huoneelle
- Varauksia ei voi tehdä menneisyyteen
- Aloitusajan täytyy olla ennen lopetusaikaa

## Oletukset

- Huoneet tunnistetaan merkkijonoilla (esim. "room-1", "conference-a")
- Käyttäjätunnistus on yksinkertainen merkkijono (ei autentikointia)
- Aikaformaatti: ISO 8601 -merkkijonot
- Ei minimikestoa tai maksimikestoa varauksille
- Tiedot tallennetaan muistiin (nollautuu palvelimen uudelleenkäynnistyksessä)

## Testaus

Katso yksityiskohtaiset testausohjeet tiedostosta [TESTING.md](TESTING.md).

### Pikatesti

```bash
# Luo varaus
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"roomId": "room-1", "startTime": "2026-01-30T10:00:00Z", "endTime": "2026-01-30T11:00:00Z", "bookedBy": "user1"}'

# Listaa huoneen varaukset
curl http://localhost:3000/api/rooms/room-1/bookings

# Peruuta varaus (korvaa {id} varauksen tunnuksella)
curl -X DELETE http://localhost:3000/api/bookings/{id}
```

## Ympäristömuuttujat

- `PORT` - Palvelimen portti (oletus: 3000)

Esimerkki:
```bash
PORT=8080 npm run dev
```

## Projektirakenne

```
booking/
├── src/
│   ├── index.ts              # Palvelimen käynnistys
│   ├── models/
│   │   └── booking.ts        # Tyyppimäärittelyt
│   ├── routes/
│   │   └── bookings.ts       # Reittikäsittelijät
│   ├── services/
│   │   └── bookingService.ts # Liiketoimintalogiikka
│   └── store/
│       └── inMemoryStore.ts  # Muistivarasto
├── ANALYYSI.md               # Tekoälyanalyysi
├── PROMPTIT.md               # AI-keskusteluhistoria
├── TESTING.md                # Testausohjeet
└── README.md                 # Tämä tiedosto
```

## Teknologiat

- **Runtime:** Node.js
- **Kieli:** TypeScript
- **Framework:** Express.js
- **Tietokanta:** Muistivarasto (Map)
