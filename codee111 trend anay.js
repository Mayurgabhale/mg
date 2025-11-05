i want all with different name like see
some region has two name ok 
this is got in googl
The list of Asia-Pacific (APAC) countries varies depending on the organization, but a core group consistently included is Australia, Bangladesh, China, India, Indonesia, Japan, Malaysia, New Zealand, Pakistan, the Philippines, Singapore, South Korea, and Thailand. 

but in our othe dasbhoard like 
Pune Quezon City Hyderabad Taguig City Tokyo Kuala Lumpur..
 ---
 for emea --
Vilnius Vienna London Madrid Casablanca Abu Dhabi DublinMoscow Rome 

like all so in futeu we got thsi problm
so i want all wiht any name ok 
so this COUNTRY_TO_REGION desing like that 
# (Insert into your FastAPI app file)
COUNTRY_TO_REGION = {
    # APAC (not exhaustive)
    'india': 'APAC', 'philippines': 'APAC', 'china': 'APAC', 'japan': 'APAC', 'australia': 'APAC',
    'singapore': 'APAC', 'malaysia': 'APAC', 'indonesia': 'APAC', 'thailand': 'APAC', 'vietnam': 'APAC',
    'south korea': 'APAC', 'hong kong': 'APAC', 'taiwan': 'APAC', 'pakistan': 'APAC', 'bangladesh': 'APAC',

    # NAMER (North America)
    'united states': 'NAMER', 'usa': 'NAMER', 'canada': 'NAMER', 'mexico': 'NAMER',

    # LACA (Latin America & Caribbean)
    'brazil': 'LACA', 'argentina': 'LACA', 'chile': 'LACA', 'colombia': 'LACA', 'peru': 'LACA',
    'venezuela': 'LACA', 'panama': 'LACA', 'costa rica': 'LACA',

    # EMEA
    'united kingdom': 'EMEA', 'uk': 'EMEA', 'germany': 'EMEA', 'france': 'EMEA', 'spain': 'EMEA',
    'italy': 'EMEA', 'netherlands': 'EMEA', 'sweden': 'EMEA', 'norway': 'EMEA', 'denmark': 'EMEA',
    'switzerland': 'EMEA', 'belgium': 'EMEA', 'austria': 'EMEA', 'poland': 'EMEA', 'greece': 'EMEA',
    'turkey': 'EMEA', 'uae': 'EMEA', 'saudi arabia': 'EMEA', 'south africa': 'EMEA', 'egypt': 'EMEA'
}

DEFAULT_REGION = 'UNKNOWN'


FROM LOCATION	FROM COUNTRY	TO LOCATION	TO COUNTRY
Bahia Blanca, Buenos Aires	Argentina	Bahia Blanca, Buenos Aires	Argentina
Buenos Aires, Ciudad de Buenos Aires	Argentina	Buenos Aires, Ciudad de Buenos Aires	Argentina
Buenos Aires, Ciudad de Buenos Aires	Argentina	Buenos Aires, Ciudad de Buenos Aires	Argentina
Buenos Aires, Ciudad de Buenos Aires	Argentina	Buenos Aires, Ciudad de Buenos Aires	Argentina
Buenos Aires, Ciudad de Buenos Aires	Argentina	Buenos Aires, Ciudad de Buenos Aires	Argentina
Buenos Aires, Ciudad de Buenos Aires	Argentina	Buenos Aires, Ciudad de Buenos Aires	Argentina
Hobart, Tasmania	Australia	Hobart, Tasmania	Australia
Melbourne, Victoria	Australia	Hobart, Tasmania	Australia
Hobart, Tasmania	Australia	Hobart, Tasmania	Australia
Hobart, Tasmania	Australia	Hobart, Tasmania	Australia
New York City, New York	United States	New York City, New York	United States
Palma de Mallorca, Balearic Islands	Spain	Palma de Mallorca, Balearic Islands	Spain
Ibiza, Balearic Islands	Spain	Ibiza, Balearic Islands	Spain
Los Angeles, California	United States	Los Angeles, California	United States
Denver, Colorado	United States	Denver, Colorado	United States
Regina, Saskatchewan	Canada	Regina, Saskatchewan	Canada
Denver, Colorado	United States	Denver, Colorado	United States
Newark, New Jersey	United States	Newark, New Jersey	United States
Mumbai, Maharashtra	India	Mumbai, Maharashtra	India
Pune, Maharashtra	India	Pune, Maharashtra	India
New York City, New York	United States	Los Angeles, California	United States
Cork	Ireland	Cork	Ireland
Trieste	Italy	Trieste	Italy
Athens	Greece	Athens	Greece
San JosÃ©, San JosÃ©	Costa Rica	San JosÃ©, San JosÃ©	Costa Rica
Indore, Madhya Pradesh	India	Indore, Madhya Pradesh	India
Chennai, Tamil Nadu	India	Chennai, Tamil Nadu	India
SÃ£o Paulo	Brazil	SÃ£o Paulo	Brazil
Mexico City, Mexico	Mexico	SÃ£o Paulo	Brazil
SÃ£o Paulo	Brazil	SÃ£o Paulo	Brazil
Sydney, New South Wales	Australia	Sydney, New South Wales	Australia
Singapore City	Singapore	Singapore City	Singapore
Singapore City	Singapore	Manila	Philippines
Singapore City	Singapore	Singapore City	Singapore
Singapore City	Singapore	Manila	Philippines
Shanghai, Shanghai	China	Shanghai, Shanghai	China
Manila	Philippines	Manila	Philippines
Singapore City	Singapore	Manila	Philippines
Manila	Philippines	Manila	Philippines
Valencia, Valencia	Spain	Valencia, Valencia	Spain
Bilbao, Basque Country	Spain	Bilbao, Basque Country	Spain
Newark, New Jersey	United States	Newark, New Jersey	United States
Pune, Maharashtra	India	Pune, Maharashtra	India
Hyderabad, Telangana	India	Hyderabad, Telangana	India
Denver, Colorado	United States	New York City, New York	United States
New York City, New York	United States	New York City, New York	United States
New York City, New York	United States	New York City, New York	United States
Houston, Texas	United States	Houston, Texas	United States
