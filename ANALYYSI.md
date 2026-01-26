# Analyysi: Tekoälyn tuottama koodi

## 1. Mitä tekoäly teki hyvin?

### Projektin rakenne
- Loi selkeän ja loogisen kansiorakenteen (routes, services, models, store)
- Erotti vastuualueet hyvin: reitit, liiketoimintalogiikka ja tietovarasto omiin moduuleihinsa
- Käytti TypeScript-tyyppejä johdonmukaisesti

### Liiketoimintalogiikka
- Toteutti päällekkäisten varausten tarkistuksen oikein
- Validoi, ettei varauksia voi tehdä menneisyyteen
- Tarkisti, että alkuaika on ennen loppuaikaa

### Koodin laatu
- Käytti selkeitä funktioiden nimiä
- Koodi oli luettavaa ja ymmärrettävää
- Noudatti Express.js:n parhaita käytäntöjä

### Yksinkertaisten projektien hallinta
Tekoäly suoriutuu erittäin hyvin yksinkertaisista projekteista, kuten tämä varausjärjestelmä. Kun vaatimukset ovat selkeät ja rajatut, tekoäly pystyy tuottamaan toimivan toteutuksen nopeasti. Monimutkaisemmissa projekteissa haasteet kasvavat, mutta perus-CRUD-sovelluksissa tekoäly on tehokas työkalu.

---

## 2. Mitä tekoäly teki huonosti?

### Ohjeiden noudattaminen
- **Kriittinen virhe:** Tekoäly ei noudattanut ohjetta olla käyttämättä tiettyä nimeä repositorion sisällössä. Vaikka ohjeissa selkeästi mainittiin "Do NOT use [nimi] in the repository name or content", tekoäly sisällytti nimen dokumentaatioon useaan kohtaan. Tämä vaati manuaalisen korjauksen.
- Tämä osoittaa, että tekoäly ei aina huomioi kaikkia ohjeita, erityisesti negatiivisia rajoituksia ("älä tee X").

### Virheenkäsittely
- Jotkin virhepolut eivät lähettäneet vastausta asiakkaalle
- Error-tyypin tarkistus oli liian suppea (vain `instanceof Error`)

### Syötteiden validointi
- Tyhjät merkkijonot läpäisivät validoinnin
- Päivämääräformaattia ei validoitu ennen käsittelyä
- Puuttui virheellisen JSON-syötteen käsittely

### Konfiguraatio
- Portti oli kovakoodattu (3000)
- Ei käytetty ympäristömuuttujia

### Huomautus toteutuksen heikkouksista
On syytä huomioida, että osa toteutuksen heikkouksista oli **tarkoituksellisia**. Tehtävänannon mukaan Phase 1 -koodin tuli sisältää tyypillisiä "junior developer" -virheitä, jotta Phase 2:ssa olisi konkreettista parannettavaa. Tekoälyä ohjeistettiin tuottamaan koodi, jossa on:
- Epäjohdonmukaista virheenkäsittelyä
- Puutteellista syötteiden validointia
- Kovakoodattuja arvoja

Nämä "virheet" eivät siis välttämättä edusta tekoälyn todellista suorituskykyä, vaan olivat osa tehtävänantoa.

---

## 3. Mitkä olivat tärkeimmät parannukset ja miksi?

### 1. Virheenkäsittelyn yhtenäistäminen
**Miksi tärkeä:** Alkuperäisessä koodissa jotkin virhetilanteet jättivät HTTP-pyynnön roikkumaan ilman vastausta. Tämä aiheuttaisi timeout-virheitä asiakassovelluksissa.

**Ratkaisu:** Lisättiin fallback-käsittely kaikille virheille:
```typescript
const message = error instanceof Error ? error.message : 'Unknown error';
```

### 2. Syötteiden validoinnin parantaminen
**Miksi tärkeä:** Tyhjät merkkijonot ja virheelliset päivämäärät olisivat aiheuttaneet odottamattomia virheitä syvemmällä koodissa tai tietokantaoperaatioissa.

**Ratkaisu:** Lisättiin apufunktiot:
- `isNonEmptyString()` - tarkistaa ettei kenttä ole tyhjä
- `isValidDateString()` - validoi päivämääräformaatin

### 3. Konfiguroitavuuden lisääminen
**Miksi tärkeä:** Kovakoodattu portti estää sovelluksen käytön eri ympäristöissä (kehitys, tuotanto, testaus).

**Ratkaisu:** Portti luetaan ympäristömuuttujasta:
```typescript
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
```

### 4. Kiellettyjen viittausten poistaminen
**Miksi tärkeä:** Ohjeissa nimenomaisesti kiellettiin tietyn nimen käyttö repositorion sisällössä.

**Ratkaisu:** Korvattu kaikki viittaukset `[REDACTED]`-merkinnällä dokumentaatiossa.

---

## Meta-promptauksen merkitys

Tekoälyn tuottaman koodin laatua voidaan merkittävästi parantaa **meta-promptauksella** (master prompting). Tämä tarkoittaa:

1. **Yksityiskohtainen suunnittelu ensin:** Sen sijaan että pyytää suoraan "tee varausjärjestelmä", kannattaa ensin pyytää tekoälyä luomaan yksityiskohtainen suunnitelma, tarkistaa se, ja vasta sitten siirtyä toteutukseen.

2. **Rajoitusten korostaminen:** Kriittiset rajoitukset (kuten "älä käytä tiettyä nimeä") tulisi toistaa useaan kertaan ja korostaa niiden tärkeyttä.

3. **Iteratiivinen kehitys:** Pyytämällä tekoälyä tarkistamaan oma työnsä vaatimusten perusteella voidaan havaita virheitä aikaisemmin.

4. **Roolin määrittely:** Tekoälylle voi antaa roolin (esim. "toimi senior-kehittäjänä") paremman lopputuloksen saavuttamiseksi.

Tässä projektissa käytettiin suunnitteluvaihetta (plan mode), mikä paransi lopputulosta. Ilman sitä koodi olisi todennäköisesti ollut vielä hajanaisempaa.

---

## Yhteenveto

Tekoäly tuotti toimivan pohjan yksinkertaiselle varausjärjestelmälle. Suurimmat haasteet liittyivät ohjeiden täsmälliseen noudattamiseen - erityisesti negatiivisten rajoitusten ("älä tee X") huomioiminen oli puutteellista.

Yksinkertaisissa projekteissa tekoäly on erinomainen työkalu, joka nopeuttaa kehitystä merkittävästi. Monimutkaisemmissa projekteissa ihmisen kriittinen arviointi on välttämätöntä. Meta-promptauksen ja iteratiivisen kehityksen avulla tekoälyn tuottaman koodin laatua voidaan parantaa huomattavasti.
