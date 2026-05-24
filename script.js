const form = document.getElementById("astroForm");
const resultDiv = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const hourSelect = document.getElementById("birthHour");
const minuteSelect = document.getElementById("birthMinute");
let astronomyEngine = null;

const RASHI = [
    { name: "Mesha", english: "Aries", lord: "Mars", element: "Fire" },
    { name: "Vrishabha", english: "Taurus", lord: "Venus", element: "Earth" },
    { name: "Mithuna", english: "Gemini", lord: "Mercury", element: "Air" },
    { name: "Karka", english: "Cancer", lord: "Moon", element: "Water" },
    { name: "Simha", english: "Leo", lord: "Sun", element: "Fire" },
    { name: "Kanya", english: "Virgo", lord: "Mercury", element: "Earth" },
    { name: "Tula", english: "Libra", lord: "Venus", element: "Air" },
    { name: "Vrischika", english: "Scorpio", lord: "Mars", element: "Water" },
    { name: "Dhanu", english: "Sagittarius", lord: "Jupiter", element: "Fire" },
    { name: "Makara", english: "Capricorn", lord: "Saturn", element: "Earth" },
    { name: "Kumbha", english: "Aquarius", lord: "Saturn", element: "Air" },
    { name: "Meena", english: "Pisces", lord: "Jupiter", element: "Water" }
];

const NAKSHATRAS = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
    "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const NAK_LORDS = [
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
    "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
];

const VIM_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const VIM_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };

const BODY_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"];

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function normalizeDegree(value) {
    return ((value % 360) + 360) % 360;
}

function pad2(n) {
    return String(n).padStart(2, "0");
}

function populateTimeSelectors() {
    for (let h = 1; h <= 12; h += 1) {
        const option = document.createElement("option");
        option.value = String(h);
        option.textContent = pad2(h);
        hourSelect.appendChild(option);
    }

    for (let m = 0; m <= 59; m += 1) {
        const option = document.createElement("option");
        option.value = String(m);
        option.textContent = pad2(m);
        minuteSelect.appendChild(option);
    }
}

function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Calculating accurate kundli..." : "Generate Detailed Kundli";
}

function showStatus(message) {
    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `<p class="status-msg">${escapeHTML(message)}</p>`;
}

async function getAstronomyEngine() {
    if (astronomyEngine) return astronomyEngine;

    const mod = await import("https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/esm/astronomy.min.js");
    astronomyEngine = mod.default || mod;
    return astronomyEngine;
}

function to24Hour(hour12, minute, meridiem) {
    let hour = Number(hour12) % 12;
    if (meridiem === "PM") hour += 12;
    return { hour24: hour, minute: Number(minute) };
}

function formatDob(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function julianDay(dateUtc) {
    return dateUtc.getTime() / 86400000 + 2440587.5;
}

function lahiriAyanamsa(dateUtc) {
    const jd = julianDay(dateUtc);
    const t = (jd - 2451545.0) / 36525;
    return normalizeDegree(22.460148 + 1.396042 * t + 0.000087 * t * t);
}

function getRashiInfo(siderealLongitude) {
    if (!Number.isFinite(siderealLongitude)) {
        throw new Error("Could not derive Rashi from invalid longitude.");
    }
    const signIndex = Math.floor(normalizeDegree(siderealLongitude) / 30);
    const signDegree = normalizeDegree(siderealLongitude) % 30;
    return { signIndex, signDegree, ...RASHI[signIndex] };
}

function getNakshatraInfo(siderealMoonLon) {
    if (!Number.isFinite(siderealMoonLon)) {
        throw new Error("Could not derive Nakshatra from invalid Moon longitude.");
    }
    const segment = normalizeDegree(siderealMoonLon) / (13 + 1 / 3);
    const index = Math.floor(segment);
    const fraction = segment - index;
    const pada = Math.floor(fraction * 4) + 1;
    return {
        name: NAKSHATRAS[index],
        lord: NAK_LORDS[index],
        pada
    };
}

async function geocodePlace(place) {
    const endpoint = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Failed to geocode place");

    const data = await response.json();
    if (!data.results || !data.results.length) throw new Error("Place not found. Please enter a clearer city/state/country.");

    const best = data.results[0];
    return {
        latitude: best.latitude,
        longitude: best.longitude,
        timezone: best.timezone || "UTC",
        placeLabel: [best.name, best.admin1, best.country].filter(Boolean).join(", ")
    };
}

function getTimeZoneOffsetMinutes(date, timeZone) {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });

    const parts = Object.fromEntries(
        dtf
            .formatToParts(date)
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    );

    const asUTC = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second)
    );

    return (asUTC - date.getTime()) / 60000;
}

function zonedBirthToUtc(dob, hour24, minute, timeZone) {
    const [y, m, d] = dob.split("-").map(Number);
    let utcGuess = Date.UTC(y, m - 1, d, hour24, minute, 0);

    for (let i = 0; i < 3; i += 1) {
        const offset = getTimeZoneOffsetMinutes(new Date(utcGuess), timeZone);
        utcGuess = Date.UTC(y, m - 1, d, hour24, minute, 0) - offset * 60000;
    }

    return new Date(utcGuess);
}

function calcAscendingNodeLon(dateUtc) {
    const jd = julianDay(dateUtc);
    const t = (jd - 2451545.0) / 36525;
    return normalizeDegree(125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000);
}

function eclipticLongitudeFromGeoVector(vector, Astronomy) {
    const ecl = Astronomy.Ecliptic(vector);
    if (!Number.isFinite(ecl?.elon)) {
        throw new Error("Failed to compute ecliptic longitude for one or more planets.");
    }
    return normalizeDegree(ecl.elon);
}

function calcAscendantSidereal(dateUtc, latitude, longitude, ayanamsa, Astronomy) {
    const gstHours = Astronomy.SiderealTime(dateUtc);
    const theta = normalizeDegree(gstHours * 15 + longitude) * Math.PI / 180;
    const phi = latitude * Math.PI / 180;
    const epsilon = 23.4392911 * Math.PI / 180;

    const y = -Math.cos(theta);
    const x = Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);
    const ascTropical = normalizeDegree(Math.atan2(y, x) * 180 / Math.PI);

    return normalizeDegree(ascTropical - ayanamsa);
}

function planetarySiderealLongitudes(dateUtc, ayanamsa, Astronomy) {
    const geoEclipticLon = (body) => {
        const vec = Astronomy.GeoVector(body, dateUtc, true);
        return eclipticLongitudeFromGeoVector(vec, Astronomy);
    };

    const sunLon = geoEclipticLon("Sun");
    const moonLon = geoEclipticLon("Moon");
    const mercuryLon = geoEclipticLon("Mercury");
    const venusLon = geoEclipticLon("Venus");
    const marsLon = geoEclipticLon("Mars");
    const jupiterLon = geoEclipticLon("Jupiter");
    const saturnLon = geoEclipticLon("Saturn");

    const rahuTropical = calcAscendingNodeLon(dateUtc);
    const ketuTropical = normalizeDegree(rahuTropical + 180);

    const tropicalMap = {
        Sun: sunLon,
        Moon: moonLon,
        Mercury: mercuryLon,
        Venus: venusLon,
        Mars: marsLon,
        Jupiter: jupiterLon,
        Saturn: saturnLon,
        Rahu: rahuTropical,
        Ketu: ketuTropical
    };

    const siderealMap = {};
    for (const body of BODY_ORDER) {
        const tropicalLon = tropicalMap[body];
        if (!Number.isFinite(tropicalLon)) {
            throw new Error(`Invalid longitude computed for ${body}.`);
        }
        siderealMap[body] = normalizeDegree(tropicalLon - ayanamsa);
    }

    return siderealMap;
}

function houseFromPlanet(planetSignIndex, lagnaSignIndex) {
    return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}

function getAgeYears(dob) {
    const birthDate = new Date(`${dob}T00:00:00`);
    const now = new Date();
    return Math.max(0, (now.getTime() - birthDate.getTime()) / (365.2425 * 86400000));
}

function getVimshottariSummary(nakLord, ageYears) {
    const startIndex = VIM_ORDER.indexOf(nakLord);
    const birthStartIndex = startIndex === -1 ? 0 : startIndex;

    let cumulative = 0;
    for (let i = 0; i < 18; i += 1) {
        const lord = VIM_ORDER[(birthStartIndex + i) % VIM_ORDER.length];
        const years = VIM_YEARS[lord];

        if (ageYears <= cumulative + years) {
            const startAge = cumulative;
            const endAge = cumulative + years;
            return {
                current: lord,
                currentRange: `${startAge.toFixed(1)} - ${endAge.toFixed(1)} years`,
                next: VIM_ORDER[(birthStartIndex + i + 1) % VIM_ORDER.length],
                nextStartsAt: endAge.toFixed(1)
            };
        }

        cumulative += years;
    }

    return { current: "Mercury", currentRange: "N/A", next: "Ketu", nextStartsAt: "N/A" };
}

function findPlanetHouse(rows, planet) {
    return rows.find((row) => row.body === planet)?.house;
}

function describeTemperament(lagna, moonRashi, nakshatraInfo, rows) {
    const mercuryHouse = findPlanetHouse(rows, "Mercury");
    const marsHouse = findPlanetHouse(rows, "Mars");
    const tone = {
        Fire: "action-driven and direct",
        Earth: "grounded, practical, and stable",
        Air: "intellectual, fast-thinking, and social",
        Water: "intuitive, sensitive, and emotionally deep"
    };
    const behavior = mercuryHouse && [3, 5, 10, 11].includes(mercuryHouse)
        ? "communicates smartly and learns quickly"
        : "thinks deeply before sharing opinions";
    const angerStyle = marsHouse && [1, 6, 10].includes(marsHouse)
        ? "responds fast under pressure and should avoid impulsive reactions"
        : "usually contains anger but may overthink conflict";

    return `${lagna.name} Lagna with ${moonRashi.name} Moon and ${nakshatraInfo.name} Nakshatra indicates a ${tone[lagna.element]} personality. This native ${behavior}, values dignity in relationships, and ${angerStyle}.`;
}

function getPositivesAndChallenges(lagna, moonRashi, rows) {
    const jupiterHouse = findPlanetHouse(rows, "Jupiter");
    const venusHouse = findPlanetHouse(rows, "Venus");
    const saturnHouse = findPlanetHouse(rows, "Saturn");
    const rahuHouse = findPlanetHouse(rows, "Rahu");
    const moonHouse = findPlanetHouse(rows, "Moon");
    const sunHouse = findPlanetHouse(rows, "Sun");

    const positives = [
        `Natural strength in ${lagna.element.toLowerCase()}-element qualities: disciplined self-growth and resilience.`,
        jupiterHouse && [1, 5, 9, 10, 11].includes(jupiterHouse)
            ? "Strong guidance for education, wisdom, and long-term luck due to Jupiter placement."
            : "Spiritual and philosophical growth improves consistently with mentorship and study.",
        venusHouse && [1, 4, 5, 7, 10, 11].includes(venusHouse)
            ? "Good support for relationships, creativity, and comforts from Venus."
            : "Artistic and relationship potential rises through emotional maturity and routine.",
        sunHouse && [1, 10, 11].includes(sunHouse)
            ? "Leadership visibility and authority opportunities are strongly supported."
            : "Steady leadership develops over time through responsibility and consistency.",
        moonHouse && [1, 4, 5, 9].includes(moonHouse)
            ? "Strong emotional intelligence and family connection from Moon influence."
            : "Balanced emotional nature emerges with disciplined sleep and mindful communication."
    ];

    const challenges = [
        {
            issue: saturnHouse && [1, 7, 10].includes(saturnHouse)
                ? "Saturn influence can delay key milestones or create pressure in commitments."
                : "Periods of self-doubt or slow progress can appear despite strong effort.",
            solution: "Follow strict weekly planning, maintain patience cycles, and avoid comparing timelines."
        },
        {
            issue: rahuHouse && [1, 7, 10].includes(rahuHouse)
                ? "Rahu may create confusion in identity, partnerships, or career direction."
                : "Distraction risk through over-ambition or scattered priorities.",
            solution: "Use one-core-goal execution, keep ethical boundaries, and review decisions with seniors."
        },
        {
            issue: "Emotional reactivity can affect relationship harmony during stress phases.",
            solution: "Practice pause-response communication, avoid late-night conflict discussions, and keep weekly reflection."
        },
        {
            issue: "Financial leakage may happen through unplanned spending or inconsistent saving.",
            solution: "Adopt auto-saving, budget tracking, and fixed investment discipline every month."
        }
    ];

    if (moonRashi.element === "Water") {
        challenges.push({
            issue: "Sensitivity to criticism may reduce confidence temporarily.",
            solution: "Build emotional boundaries and maintain a stable spiritual routine."
        });
    }

    return { positives, challenges };
}

function estimateMarriageWindow(ageYears, dasha, rows) {
    const venusHouse = findPlanetHouse(rows, "Venus");
    const jupiterHouse = findPlanetHouse(rows, "Jupiter");
    const saturnHouse = findPlanetHouse(rows, "Saturn");
    const rahuHouse = findPlanetHouse(rows, "Rahu");
    const moonHouse = findPlanetHouse(rows, "Moon");

    let start = 24;
    let end = 29;
    const signals = [];

    if (venusHouse && [1, 5, 7, 11].includes(venusHouse)) {
        start -= 1;
        signals.push("Venus supports relationship formation.");
    }
    if (jupiterHouse && [2, 5, 7, 9, 11].includes(jupiterHouse)) {
        start -= 1;
        signals.push("Jupiter gives stability for commitment.");
    }
    if (saturnHouse && [7, 8, 10].includes(saturnHouse)) {
        start += 1;
        end += 2;
        signals.push("Saturn indicates delay but long-term seriousness.");
    }
    if (rahuHouse && [7, 8].includes(rahuHouse)) {
        end += 1;
        signals.push("Rahu brings non-traditional or sudden relationship patterns.");
    }
    if (moonHouse && [4, 7].includes(moonHouse)) {
        signals.push("Moon favors emotionally aligned partnership.");
    }

    if (["Venus", "Jupiter", "Moon"].includes(dasha.current) && ageYears >= 20 && ageYears <= 35) {
        start = Math.min(start, Math.floor(ageYears) + 1);
        end = Math.max(end, Math.floor(ageYears) + 3);
        signals.push(`Current ${dasha.current} Mahadasha improves marriage probability in near years.`);
    }
    if (!signals.length) {
        signals.push("Marriage timing depends on relationship maturity, family alignment, and stable career phase.");
    }

    const secondaryStart = end + 1;
    const secondaryEnd = secondaryStart + 4;

    return {
        primary: `${start} - ${end} years`,
        secondary: `${secondaryStart} - ${secondaryEnd} years`,
        signals
    };
}

function buildLifeTimeline(dasha, lagna, rows) {
    const careerHousePlanet = rows.find((row) => row.house === 10)?.body || "Saturn";
    const wealthHousePlanet = rows.find((row) => row.house === 11)?.body || "Jupiter";
    const relationshipHousePlanet = rows.find((row) => row.house === 7)?.body || "Venus";

    return [
        {
            phase: "Age 0 - 12",
            positive: "Foundation years build core sanskar, learning style, and family karma support.",
            caution: "Emotional conditioning strongly impacts confidence in teenage years.",
            solution: "Consistent discipline, values education, and positive elder guidance."
        },
        {
            phase: "Age 13 - 20",
            positive: "Identity formation and talent discovery phase with fast mental growth.",
            caution: "Distraction and peer pressure can affect direction clarity.",
            solution: "Choose one skill track and avoid frequent switching."
        },
        {
            phase: "Age 21 - 28",
            positive: `Career foundation rises through ${careerHousePlanet} influence; strong learning-to-earning window.`,
            caution: "Pressure around relationships and financial independence can be high.",
            solution: "Keep savings discipline, career mentorship, and stable relationship boundaries."
        },
        {
            phase: "Age 29 - 36",
            positive: `Major growth in income/network through ${wealthHousePlanet} patterns and position upgrades.`,
            caution: "Overwork or ego clashes can affect personal peace.",
            solution: "Balance ambition with health routine and communication discipline."
        },
        {
            phase: "Age 37 - 48",
            positive: `Responsibility peak period. ${relationshipHousePlanet} themes highlight family and legacy building.`,
            caution: "Decision fatigue and stress spillover into home life.",
            solution: "Delegate work, protect health metrics, and preserve weekly family time."
        },
        {
            phase: "Age 49+",
            positive: `Strong spiritual maturity, guidance role, and karmic consolidation in ${dasha.next} cycles.`,
            caution: "Rigidity in routine or resistance to lifestyle change.",
            solution: "Daily prayer, moderate fitness, and structured charitable service."
        }
    ];
}

function buildRemedies(lagna, nakshatra, dasha, challenges) {
    const challengeSolutions = challenges.map((item) => item.solution);
    return [
        `Daily mantra: Om ${lagna.lord}aya Namah (108 repetitions).`,
        `Nakshatra remedy: Observe simple prayer discipline on ${nakshatra} days monthly.`,
        `Current dasha support: Strengthen ${dasha.current} through seva, satvik routine, and consistent sadhana.`,
        "Offer water to Surya after sunrise and maintain one fixed weekly temple visit.",
        "Donate food or essentials on Saturdays/Thursdays based on family tradition.",
        ...challengeSolutions.slice(0, 3)
    ];
}

function formatDegree(deg) {
    return `${deg.toFixed(2)}°`;
}

populateTimeSelectors();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const fullname = document.getElementById("fullname").value.trim();
    const birthname = document.getElementById("birthname").value.trim();
    const dob = document.getElementById("dob").value;
    const birthHour = document.getElementById("birthHour").value;
    const birthMinute = document.getElementById("birthMinute").value;
    const meridiem = document.getElementById("meridiem").value;
    const pob = document.getElementById("pob").value.trim();

    if (!username || !fullname || !birthname || !dob || !birthHour || !birthMinute || !meridiem || !pob) {
        showStatus("All fields are compulsory. Please fill every detail.");
        return;
    }

    try {
        setLoadingState(true);
        showStatus("Resolving place, timezone, and planetary positions...");

        const Astronomy = await getAstronomyEngine();
        const place = await geocodePlace(pob);
        const { hour24, minute } = to24Hour(birthHour, birthMinute, meridiem);
        const birthUtc = zonedBirthToUtc(dob, hour24, minute, place.timezone);
        const ayanamsa = lahiriAyanamsa(birthUtc);

        const siderealLongitudes = planetarySiderealLongitudes(birthUtc, ayanamsa, Astronomy);
        const moonInfo = getRashiInfo(siderealLongitudes.Moon);
        const nakshatraInfo = getNakshatraInfo(siderealLongitudes.Moon);

        const lagnaSidereal = calcAscendantSidereal(birthUtc, place.latitude, place.longitude, ayanamsa, Astronomy);
        const lagnaInfo = getRashiInfo(lagnaSidereal);

        const ageYears = getAgeYears(dob);
        const dasha = getVimshottariSummary(nakshatraInfo.lord, ageYears);

        const rows = BODY_ORDER.map((body) => {
            const lon = siderealLongitudes[body];
            const rashi = getRashiInfo(lon);
            const house = houseFromPlanet(rashi.signIndex, lagnaInfo.signIndex);

            return {
                body,
                lon,
                rashi: `${rashi.name} (${rashi.english})`,
                house
            };
        });

        const sunInfo = getRashiInfo(siderealLongitudes.Sun);
        const temperament = describeTemperament(lagnaInfo, moonInfo, nakshatraInfo, rows);
        const deepAnalysis = getPositivesAndChallenges(lagnaInfo, moonInfo, rows);
        const marriage = estimateMarriageWindow(ageYears, dasha, rows);
        const timeline = buildLifeTimeline(dasha, lagnaInfo, rows);
        const remedies = buildRemedies(lagnaInfo, nakshatraInfo.name, dasha, deepAnalysis.challenges);

        resultDiv.innerHTML = `
            <div class="profile-header">
                <h2>${escapeHTML(birthname)} | Detailed Vedic Janma Patrika</h2>
                <span class="sign-badge">Astronomy + Sidereal Engine</span>
            </div>

            <p class="meta">
                Native: ${escapeHTML(fullname)} (@${escapeHTML(username)}) | Birth: ${escapeHTML(formatDob(dob))}, ${escapeHTML(pad2(Number(birthHour)))}:${escapeHTML(pad2(Number(birthMinute)))} ${escapeHTML(meridiem)} | ${escapeHTML(place.placeLabel)} | Timezone: ${escapeHTML(place.timezone)}
            </p>

            <h3 class="section-title">Core Kundli Factors</h3>
            <div class="details-grid">
                <div class="detail-card"><div class="label">Janma Rashi (Moon)</div><div class="value">${escapeHTML(moonInfo.name)} (${escapeHTML(moonInfo.english)})</div></div>
                <div class="detail-card"><div class="label">Surya Rashi (Sun)</div><div class="value">${escapeHTML(sunInfo.name)} (${escapeHTML(sunInfo.english)})</div></div>
                <div class="detail-card"><div class="label">Lagna</div><div class="value">${escapeHTML(lagnaInfo.name)} (${escapeHTML(lagnaInfo.english)})</div></div>
                <div class="detail-card"><div class="label">Nakshatra</div><div class="value">${escapeHTML(nakshatraInfo.name)}</div></div>
                <div class="detail-card"><div class="label">Pada</div><div class="value">${escapeHTML(String(nakshatraInfo.pada))}</div></div>
                <div class="detail-card"><div class="label">Nakshatra Lord</div><div class="value">${escapeHTML(nakshatraInfo.lord)}</div></div>
                <div class="detail-card"><div class="label">Ayanamsa</div><div class="value">${escapeHTML(formatDegree(ayanamsa))}</div></div>
                <div class="detail-card"><div class="label">Current Mahadasha</div><div class="value">${escapeHTML(dasha.current)}</div></div>
                <div class="detail-card"><div class="label">Current Dasha Window</div><div class="value">${escapeHTML(dasha.currentRange)}</div></div>
                <div class="detail-card"><div class="label">Next Mahadasha</div><div class="value">${escapeHTML(dasha.next)}</div></div>
            </div>

            <h3 class="section-title">Graha Positions (Sidereal)</h3>
            <table class="planet-table">
                <thead>
                    <tr>
                        <th>Planet</th>
                        <th>Longitude</th>
                        <th>Rashi</th>
                        <th>House</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row) => `
                        <tr>
                            <td>${escapeHTML(row.body)}</td>
                            <td>${escapeHTML(formatDegree(row.lon))}</td>
                            <td>${escapeHTML(row.rashi)}</td>
                            <td>${escapeHTML(String(row.house))}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            <h3 class="section-title">Personality And Behavior</h3>
            <div class="kundli-text">${escapeHTML(temperament)}</div>

            <h3 class="section-title">Positive Potentials</h3>
            <ul class="remedy-list">
                ${deepAnalysis.positives.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>

            <h3 class="section-title">Challenges And Solutions</h3>
            ${deepAnalysis.challenges.map((item) => `
                <div class="kundli-text">
                    <strong>Challenge:</strong> ${escapeHTML(item.issue)}<br>
                    <strong>Solution:</strong> ${escapeHTML(item.solution)}
                </div>
            `).join("")}

            <h3 class="section-title">Marriage Prediction</h3>
            <div class="kundli-text"><strong>Primary Marriage Window:</strong> ${escapeHTML(marriage.primary)}</div>
            <div class="kundli-text"><strong>Secondary Marriage Window:</strong> ${escapeHTML(marriage.secondary)}</div>
            <ul class="remedy-list">
                ${marriage.signals.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>

            <h3 class="section-title">Major Life Events Timeline</h3>
            ${timeline.map((item) => `
                <div class="kundli-text">
                    <strong>${escapeHTML(item.phase)}</strong><br>
                    <strong>Positive:</strong> ${escapeHTML(item.positive)}<br>
                    <strong>Risk:</strong> ${escapeHTML(item.caution)}<br>
                    <strong>Recommended Action:</strong> ${escapeHTML(item.solution)}
                </div>
            `).join("")}

            <h3 class="section-title">Traditional Remedies</h3>
            <ul class="remedy-list">
                ${remedies.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>

            <p class="note">Computation method: place geocoding + timezone conversion + astronomy ephemeris + sidereal ayanamsa transform. For legal/medical/financial decisions, consult qualified professionals.</p>
        `;

        resultDiv.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        showStatus(error.message || "Could not generate kundli. Please verify inputs and try again.");
    } finally {
        setLoadingState(false);
    }
});


