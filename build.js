/* King Events — static site builder.  Run: node build.js  → output in ./dist */
const fs = require('fs');
const path = require('path');

/* =====================================================================
   1. BUSINESS DETAILS — edit these, then run `node build.js` again.
   Items marked (PLACEHOLDER) must be replaced with real info.
   ===================================================================== */
const CFG = {
  name: 'KING EVENTS',
  phone: '9363638730',
  phoneIntl: '+919363638730',
  whatsapp: '919363638730',
  email: 'jjbr0407@gmail.com',
  mapQuery: 'Kalanthapanai, Tirunelveli, Tamil Nadu',
  instagram: 'https://www.instagram.com/_king_events_nellai/',
  facebook: '',    // (PLACEHOLDER)
  youtube: '',     // (PLACEHOLDER)
  siteUrl: '',     // (PLACEHOLDER) e.g. https://www.kingevents.in  -> enables sitemap + canonical
  prices: { classic: '₹49,999', royal: '₹99,999', grand: '₹1,99,999' }, // (PLACEHOLDER)
  stats: { years: 10, events: 500, services: 7, districts: 5 },          // events & districts = (PLACEHOLDER)
  showTestimonials: false // turn on only when you have REAL customer reviews
};

/* =====================================================================
   2. TEXT in three languages:  key: [English, தமிழ், हिन्दी]
   ===================================================================== */
const L = {
  // navigation & chrome
  'nav.home': ['Home', 'முகப்பு', 'होम'],
  'nav.services': ['Services', 'சேவைகள்', 'सेवाएं'],
  'nav.packages': ['Packages', 'பேக்கேஜ்கள்', 'पैकेज'],
  'nav.gallery': ['Gallery', 'கேலரி', 'गैलरी'],
  'nav.about': ['About', 'எங்களை பற்றி', 'हमारे बारे में'],
  'nav.faq': ['FAQ', 'கேள்விகள்', 'सवाल'],
  'nav.contact': ['Contact', 'தொடர்பு', 'संपर्क'],
  'nav.book': ['Book Now', 'புக் செய்ய', 'अभी बुक करें'],
  'loc.short': ['Kalanthapanai, Tirunelveli', 'களந்தபனை, திருநெல்வேலி', 'कलंथपनई, तिरुनेलवेली'],
  'loc.full': ['Kalanthapanai, Tirunelveli, Tamil Nadu', 'களந்தபனை, திருநெல்வேலி, தமிழ்நாடு', 'कलंथपनई, तिरुनेलवेली, तमिलनाडु'],
  'hours.short': ['Open daily, 9 AM – 8 PM', 'தினமும் காலை 9 – இரவு 8', 'प्रतिदिन सुबह 9 – रात 8'],
  'brand': ['KING EVENTS', 'கிங் ஈவென்ட்ஸ்', 'किंग इवेंट्स'],

  // home hero
  'hero.h1': ['Your Celebration.<br><em>Our Royal Creation.</em>', 'உங்கள் கொண்டாட்டம்.<br><em>எங்கள் ராஜ படைப்பு.</em>', 'आपका उत्सव।<br><em>हमारी शाही रचना।</em>'],
  'hero.lead': [
    'Wedding decoration, mandapams, royal catering and fun stalls — everything for your special day from Tirunelveli’s event team.',
    'திருமண அலங்காரம், மண்டபம், ராஜ விருந்து மற்றும் கேளிக்கை ஸ்டால்கள் — உங்கள் சிறப்பு நாளுக்கு தேவையான அனைத்தும், திருநெல்வேலி நிகழ்ச்சி குழுவிடமிருந்து.',
    'शादी की सजावट, मंडप, शाही कैटरिंग और फन स्टॉल — आपके खास दिन के लिए सब कुछ, तिरुनेलवेली की इवेंट टीम से।'],
  'btn.explore': ['Explore Services', 'சேவைகளை பார்க்க', 'सेवाएं देखें'],
  'btn.quote': ['Get Free Quote', 'இலவச விலை விவரம்', 'मुफ्त कोटेशन पाएं'],
  'btn.call': ['Call Now', 'இப்போது அழைக்க', 'अभी कॉल करें'],
  'btn.wa': ['WhatsApp Us', 'வாட்ஸ்அப் செய்ய', 'व्हाट्सऐप करें'],
  'btn.book': ['Book This Package', 'இந்த பேக்கேஜை புக் செய்ய', 'यह पैकेज बुक करें'],
  'btn.gallery': ['View Full Gallery', 'முழு கேலரி பார்க்க', 'पूरी गैलरी देखें'],
  'btn.more': ['Learn more →', 'மேலும் அறிய →', 'और जानें →'],
  'btn.enquire': ['Enquire Now', 'விசாரிக்க', 'पूछताछ करें'],

  // stats
  'stat.years': ['Years of Royal Tradition', 'ஆண்டுகள் ராஜ பாரம்பரியம்', 'वर्षों की शाही परंपरा'],
  'stat.events': ['Events Celebrated', 'கொண்டாடிய நிகழ்ச்சிகள்', 'सम्पन्न आयोजन'],
  'stat.services': ['Complete Services', 'முழுமையான சேவைகள்', 'संपूर्ण सेवाएं'],
  'stat.districts': ['Districts Served', 'சேவை மாவட்டங்கள்', 'सेवा वाले जिले'],

  // services
  'sec.services.eyebrow': ['What We Do', 'நாங்கள் செய்வது', 'हम क्या करते हैं'],
  'sec.services.h2': ['Our Services', 'எங்கள் சேவைகள்', 'हमारी सेवाएं'],
  'sec.services.p': ['Everything your celebration needs, under one roof.', 'உங்கள் கொண்டாட்டத்திற்கு தேவையான அனைத்தும், ஒரே இடத்தில்.', 'आपके उत्सव की हर ज़रूरत, एक ही छत के नीचे।'],
  's1.t': ['Marriage Decoration', 'திருமண அலங்காரம்', 'विवाह सजावट'],
  's1.d': ['Traditional and modern wedding stage decoration with fresh marigolds, jasmine, brass lamps and majestic backdrops.', 'புதிய சாமந்தி, மல்லிகை, பித்தளை விளக்குகள் மற்றும் பிரம்மாண்ட பின்னணியுடன் பாரம்பரிய மற்றும் நவீன திருமண மேடை அலங்காரம்.', 'ताज़ा गेंदे, चमेली, पीतल के दीपक और भव्य बैकड्रॉप के साथ पारंपरिक व आधुनिक विवाह मंच सजावट।'],
  's1.i': ['Includes: stage & backdrop, entrance thoranam, floral work, brass lamps, lighting.', 'உள்ளடக்கம்: மேடை & பின்னணி, நுழைவு தோரணம், மலர் அலங்காரம், பித்தளை விளக்குகள், விளக்கொளி.', 'शामिल: मंच व बैकड्रॉप, प्रवेश तोरण, फूलों की सजावट, पीतल के दीपक, लाइटिंग।'],
  's2.t': ['Reception Decoration', 'வரவேற்பு அலங்காரம்', 'रिसेप्शन सजावट'],
  's2.d': ['Elegant reception stage and venue decoration with floral arches, warm chandeliers and regal seating.', 'மலர் வளைவுகள், சூடான சரவிளக்குகள் மற்றும் ராஜ இருக்கைகளுடன் நேர்த்தியான வரவேற்பு மேடை மற்றும் அரங்க அலங்காரம்.', 'फूलों के आर्च, गर्म रोशनी वाले झूमर और शाही बैठक के साथ सुरुचिपूर्ण रिसेप्शन स्टेज व वेन्यू सजावट।'],
  's2.i': ['Includes: reception stage, floral arch, sofa seating, photo backdrop, chandelier lighting.', 'உள்ளடக்கம்: வரவேற்பு மேடை, மலர் வளைவு, சோபா இருக்கை, புகைப்பட பின்னணி, சரவிளக்கு ஒளி.', 'शामिल: रिसेप्शन स्टेज, फूलों का आर्च, सोफ़ा, फ़ोटो बैकड्रॉप, झूमर लाइटिंग।'],
  's3.t': ['Engagement Decoration', 'நிச்சயதார்த்த அலங்காரம்', 'सगाई सजावट'],
  's3.d': ['Beautiful floral and traditional setups with decorated swing, pastel blooms and warm fairy lights.', 'அலங்கரிக்கப்பட்ட ஊஞ்சல், மென்மையான மலர்கள் மற்றும் மின்னும் விளக்குகளுடன் அழகான மலர் மற்றும் பாரம்பரிய அமைப்புகள்.', 'सजे हुए झूले, पेस्टल फूलों और जगमगाती परी रोशनी के साथ सुंदर फूलों व पारंपरिक सेटअप।'],
  's3.i': ['Includes: swing or ring-arch setup, flower stands, fairy lights, name board, candles.', 'உள்ளடக்கம்: ஊஞ்சல் அல்லது வளைய அமைப்பு, மலர் ஸ்டாண்டுகள், மின்விளக்குகள், பெயர்ப் பலகை, மெழுகுவர்த்திகள்.', 'शामिल: झूला या रिंग-आर्च सेटअप, फ्लॉवर स्टैंड, फेयरी लाइट, नेम बोर्ड, मोमबत्तियां।'],
  's4.t': ['Catering', 'கேட்டரிங்', 'कैटरिंग'],
  's4.d': ['Delicious authentic food and professional service — traditional banana leaf feasts and grand buffets.', 'சுவையான பாரம்பரிய உணவு மற்றும் தொழில்முறை சேவை — வாழை இலை விருந்து மற்றும் பிரம்மாண்ட பஃபே.', 'स्वादिष्ट पारंपरिक भोजन और पेशेवर सेवा — केले के पत्ते की दावत और भव्य बुफे।'],
  's4.i': ['Includes: traditional menus, banana-leaf serving, trained service staff, buffet counters.', 'உள்ளடக்கம்: பாரம்பரிய மெனு, வாழை இலை பரிமாறல், பயிற்சி பெற்ற பணியாளர்கள், பஃபே கவுண்டர்கள்.', 'शामिल: पारंपरिक मेन्यू, केले के पत्ते में परोसना, प्रशिक्षित स्टाफ, बुफे काउंटर।'],
  's5.t': ['Popcorn Stall', 'பாப்கார்ன் ஸ்டால்', 'पॉपकॉर्न स्टॉल'],
  's5.d': ['Fresh popcorn counters that bring fun and aroma to weddings, birthdays and sangeet nights.', 'திருமணம், பிறந்தநாள், சங்கீத் இரவுகளில் மகிழ்ச்சியும் மணமும் தரும் புதிய பாப்கார்ன் கவுண்டர்கள்.', 'शादी, जन्मदिन और संगीत की रातों में मज़ा और खुशबू लाने वाले ताज़ा पॉपकॉर्न काउंटर।'],
  's5.i': ['Includes: live popcorn machine, flavour options, operator, decorated counter.', 'உள்ளடக்கம்: நேரடி பாப்கார்ன் இயந்திரம், சுவை தேர்வுகள், இயக்குநர், அலங்கரிக்கப்பட்ட கவுண்டர்.', 'शामिल: लाइव पॉपकॉर्न मशीन, फ्लेवर विकल्प, ऑपरेटर, सजा हुआ काउंटर।'],
  's6.t': ['Cotton Candy', 'பஞ்சு மிட்டாய்', 'कॉटन कैंडी'],
  's6.d': ['Colourful spun-sugar clouds — magical fun for children and guests.', 'வண்ணமயமான பஞ்சு மிட்டாய் — குழந்தைகளுக்கும் விருந்தினர்களுக்கும் மகிழ்ச்சி.', 'रंग-बिरंगी कॉटन कैंडी — बच्चों और मेहमानों के लिए जादुई मज़ा।'],
  's6.i': ['Includes: live spinning machine, colour options, operator, decorated counter.', 'உள்ளடக்கம்: நேரடி பஞ்சு மிட்டாய் இயந்திரம், வண்ண தேர்வுகள், இயக்குநர், அலங்கரிக்கப்பட்ட கவுண்டர்.', 'शामिल: लाइव कॉटन कैंडी मशीन, रंग विकल्प, ऑपरेटर, सजा हुआ काउंटर।'],
  's7.t': ['Complete Event Decoration', 'முழு நிகழ்ச்சி அலங்காரம்', 'संपूर्ण इवेंट सजावट'],
  's7.d': ['A-to-Z venue transformation: entrance thoranams, pathway lighting, dining decor and theme coordination.', 'நுழைவு தோரணங்கள், பாதை விளக்குகள், உணவு அரங்க அலங்காரம் மற்றும் தீம் ஒருங்கிணைப்பு — முழுமையான அரங்க மாற்றம்.', 'प्रवेश तोरण, पथ रोशनी, डाइनिंग सजावट और थीम समन्वय — पूरे वेन्यू का संपूर्ण रूपांतरण।'],
  's7.i': ['Includes: entrance, pathway, dining area, stage and lighting — all under one team.', 'உள்ளடக்கம்: நுழைவு, பாதை, உணவு அரங்கம், மேடை மற்றும் விளக்கொளி — அனைத்தும் ஒரே குழுவிடம்.', 'शामिल: प्रवेश, पथ, डाइनिंग एरिया, मंच और लाइटिंग — सब कुछ एक ही टीम से।'],

  // why us
  'why.eyebrow': ['Why King Events', 'ஏன் கிங் ஈவென்ட்ஸ்', 'किंग इवेंट्स क्यों'],
  'why.h2': ['Royal Service, Family Warmth', 'ராஜ சேவை, குடும்ப அன்பு', 'शाही सेवा, पारिवारिक अपनापन'],
  'w1.t': ['Authentic Traditions', 'உண்மையான பாரம்பரியம்', 'प्रामाणिक परंपरा'],
  'w1.d': ['Mandapams and rituals set up the way your family expects.', 'உங்கள் குடும்பம் எதிர்பார்க்கும் முறையில் மண்டபமும் சடங்கு அமைப்பும்.', 'मंडप और रीति-रिवाज वैसे ही सजाए जाते हैं जैसा आपका परिवार चाहता है।'],
  'w2.t': ['One Team, Everything', 'ஒரே குழு, எல்லாமும்', 'एक टीम, सब कुछ'],
  'w2.d': ['Decoration, catering and fun stalls — one booking, one point of contact.', 'அலங்காரம், கேட்டரிங், கேளிக்கை ஸ்டால்கள் — ஒரே புக்கிங், ஒரே தொடர்பு.', 'सजावट, कैटरिंग और फन स्टॉल — एक बुकिंग, एक संपर्क।'],
  'w3.t': ['Fresh Flowers', 'புதிய மலர்கள்', 'ताज़े फूल'],
  'w3.d': ['Marigold, jasmine and roses sourced fresh for your event day.', 'உங்கள் நிகழ்ச்சி நாளுக்கு புதிதாக வாங்கிய சாமந்தி, மல்லிகை, ரோஜா.', 'आपके इवेंट के दिन के लिए ताज़ा गेंदा, चमेली और गुलाब।'],
  'w4.t': ['Budget Friendly', 'பட்ஜெட்டுக்கு ஏற்றது', 'बजट के अनुकूल'],
  'w4.d': ['Clear quotes with no hidden charges — packages for every budget.', 'மறைமுக கட்டணம் இல்லாத தெளிவான விலை — ஒவ்வொரு பட்ஜெட்டுக்கும் பேக்கேஜ்.', 'बिना छिपे शुल्क के साफ कोटेशन — हर बजट के लिए पैकेज।'],

  // process
  'proc.eyebrow': ['How It Works', 'எப்படி செயல்படுகிறது', 'यह कैसे काम करता है'],
  'proc.h2': ['From Enquiry to Celebration', 'விசாரணையிலிருந்து கொண்டாட்டம் வரை', 'पूछताछ से उत्सव तक'],
  'p1.t': ['Enquire', 'விசாரிக்கவும்', 'पूछताछ'],
  'p1.d': ['Call, WhatsApp or fill the form with your date and needs.', 'அழைக்கவும், வாட்ஸ்அப் செய்யவும் அல்லது தேதி மற்றும் தேவைகளுடன் படிவம் நிரப்பவும்.', 'कॉल करें, व्हाट्सऐप करें या तारीख और ज़रूरतों के साथ फॉर्म भरें।'],
  'p2.t': ['Plan', 'திட்டமிடுங்கள்', 'योजना'],
  'p2.d': ['We discuss the venue, share design ideas and give you a quote.', 'அரங்கத்தைப் பற்றி பேசி, வடிவமைப்பு யோசனைகள் மற்றும் விலை பகிர்வோம்.', 'हम वेन्यू पर चर्चा कर डिज़ाइन आइडिया और कोटेशन साझा करते हैं।'],
  'p3.t': ['Confirm', 'உறுதி செய்யுங்கள்', 'पुष्टि'],
  'p3.d': ['Pick your package, pay the advance and your date is locked.', 'பேக்கேஜை தேர்வு செய்து முன்பணம் செலுத்தினால் உங்கள் தேதி உறுதி.', 'पैकेज चुनें, अग्रिम दें और आपकी तारीख पक्की।'],
  'p4.t': ['Celebrate', 'கொண்டாடுங்கள்', 'उत्सव मनाएं'],
  'p4.d': ['Our team sets up everything — you simply enjoy the celebration.', 'எங்கள் குழு அனைத்தையும் அமைக்கும் — நீங்கள் கொண்டாட்டத்தை அனுபவியுங்கள்.', 'हमारी टीम सब कुछ सजाती है — आप बस उत्सव का आनंद लें।'],

  // packages
  'pk.eyebrow': ['Packages', 'பேக்கேஜ்கள்', 'पैकेज'],
  'pk.h2': ['Choose Your Package', 'உங்கள் பேக்கேஜை தேர்வு செய்யுங்கள்', 'अपना पैकेज चुनें'],
  'pk.p': ['Clear starting prices for every budget.', 'ஒவ்வொரு பட்ஜெட்டுக்கும் தெளிவான ஆரம்ப விலை.', 'हर बजट के लिए साफ शुरुआती कीमतें।'],
  'pk.from': ['Starting from', 'ஆரம்ப விலை', 'शुरुआती कीमत'],
  'pk.popular': ['Most Popular', 'மிகவும் பிரபலம்', 'सबसे लोकप्रिय'],
  'pk.note': ['* Starting prices. Final quote depends on venue, date and design — contact us for an exact estimate.', '* ஆரம்ப விலைகள். இறுதி விலை அரங்கம், தேதி, வடிவமைப்பைப் பொறுத்தது — துல்லியமான மதிப்பீட்டிற்கு தொடர்பு கொள்ளவும்.', '* शुरुआती कीमतें। अंतिम कोटेशन वेन्यू, तारीख और डिज़ाइन पर निर्भर है — सटीक अनुमान के लिए संपर्क करें।'],
  'pk.addons': ['Optional add-ons', 'கூடுதல் விருப்பங்கள்', 'वैकल्पिक ऐड-ऑन'],
  'pk.a4': ['Extra Floral Work', 'கூடுதல் மலர் அலங்காரம்', 'अतिरिक्त फूलों की सजावट'],
  'pk.a5': ['Custom Theme', 'தனிப்பயன் தீம்', 'कस्टम थीम'],
  'pk1.n': ['Classic', 'கிளாசிக்', 'क्लासिक'],
  'pk1.f1': ['Stage decoration with fresh flowers', 'புதிய மலர்களுடன் மேடை அலங்காரம்', 'ताज़े फूलों के साथ मंच सजावट'],
  'pk1.f2': ['Entrance thoranam', 'நுழைவு தோரணம்', 'प्रवेश तोरण'],
  'pk1.f3': ['Basic lighting', 'அடிப்படை விளக்கொளி', 'बेसिक लाइटिंग'],
  'pk1.f4': ['Up to 200 guests', '200 விருந்தினர்கள் வரை', '200 मेहमानों तक'],
  'pk2.n': ['Royal', 'ராயல்', 'रॉयल'],
  'pk2.f1': ['Grand stage with floral arch', 'மலர் வளைவுடன் பிரம்மாண்ட மேடை', 'फूलों के आर्च के साथ भव्य मंच'],
  'pk2.f2': ['Entrance & pathway decoration', 'நுழைவு & பாதை அலங்காரம்', 'प्रवेश व पथ सजावट'],
  'pk2.f3': ['Designer lighting & photo backdrop', 'டிசைனர் விளக்கொளி & புகைப்பட பின்னணி', 'डिज़ाइनर लाइटिंग व फ़ोटो बैकड्रॉप'],
  'pk2.f4': ['Popcorn or cotton candy stall', 'பாப்கார்ன் அல்லது பஞ்சு மிட்டாய் ஸ்டால்', 'पॉपकॉर्न या कॉटन कैंडी स्टॉल'],
  'pk2.f5': ['Up to 500 guests', '500 விருந்தினர்கள் வரை', '500 मेहमानों तक'],
  'pk3.n': ['Grand', 'கிராண்ட்', 'ग्रैंड'],
  'pk3.f1': ['Complete venue transformation', 'முழுமையான அரங்க மாற்றம்', 'संपूर्ण वेन्यू रूपांतरण'],
  'pk3.f2': ['Mandapam, stage & dining decor', 'மண்டபம், மேடை & உணவு அரங்க அலங்காரம்', 'मंडप, मंच व डाइनिंग सजावट'],
  'pk3.f3': ['Catering coordination', 'கேட்டரிங் ஒருங்கிணைப்பு', 'कैटरिंग समन्वय'],
  'pk3.f4': ['Popcorn + cotton candy stalls', 'பாப்கார்ன் + பஞ்சு மிட்டாய் ஸ்டால்கள்', 'पॉपकॉर्न + कॉटन कैंडी स्टॉल'],
  'pk3.f5': ['Dedicated event manager', 'பிரத்யேக நிகழ்ச்சி மேலாளர்', 'समर्पित इवेंट मैनेजर'],
  'pk3.f6': ['1000+ guests', '1000+ விருந்தினர்கள்', '1000+ मेहमान'],

  // gallery
  'gal.eyebrow': ['Our Work', 'எங்கள் பணி', 'हमारा काम'],
  'gal.h2': ['Celebrations We’ve Crafted', 'நாங்கள் உருவாக்கிய கொண்டாட்டங்கள்', 'हमारे सजाए उत्सव'],
  'cat.all': ['All', 'அனைத்தும்', 'सभी'],
  'cat.wedding': ['Wedding', 'திருமணம்', 'विवाह'],
  'cat.reception': ['Reception', 'வரவேற்பு', 'रिसेप्शन'],
  'cat.engagement': ['Engagement', 'நிச்சயதார்த்தம்', 'सगाई'],
  'cat.catering': ['Catering', 'கேட்டரிங்', 'कैटरिंग'],
  'cat.entrance': ['Entrance & Lighting', 'நுழைவு & விளக்கு', 'प्रवेश व लाइटिंग'],
  'cat.stalls': ['Fun Stalls', 'கேளிக்கை ஸ்டால்கள்', 'फन स्टॉल'],

  // page heroes
  'h.services': ['Our Services', 'எங்கள் சேவைகள்', 'हमारी सेवाएं'],
  'h.services.p': ['From mandapam decoration to royal catering and fun stalls.', 'மண்டப அலங்காரம் முதல் ராஜ விருந்து மற்றும் கேளிக்கை ஸ்டால்கள் வரை.', 'मंडप सजावट से लेकर शाही कैटरिंग और फन स्टॉल तक।'],
  'h.packages': ['Packages', 'பேக்கேஜ்கள்', 'पैकेज'],
  'h.packages.p': ['Clear starting prices for every budget.', 'ஒவ்வொரு பட்ஜெட்டுக்கும் தெளிவான ஆரம்ப விலை.', 'हर बजट के लिए साफ शुरुआती कीमतें।'],
  'h.gallery': ['Our Gallery', 'எங்கள் கேலரி', 'हमारी गैलरी'],
  'h.gallery.p': ['A glimpse of the celebrations we’ve decorated.', 'நாங்கள் அலங்கரித்த கொண்டாட்டங்களின் ஒரு பார்வை.', 'हमारी सजाई हुई खुशियों की एक झलक।'],
  'h.about': ['About Us', 'எங்களை பற்றி', 'हमारे बारे में'],
  'h.about.p': ['Tirunelveli’s celebration team.', 'திருநெல்வேலியின் கொண்டாட்ட குழு.', 'तिरुनेलवेली की उत्सव टीम।'],
  'h.faq': ['Questions & Answers', 'கேள்வி பதில்கள்', 'सवाल और जवाब'],
  'h.faq.p': ['Everything you may want to know before booking.', 'புக் செய்வதற்கு முன் தெரிந்து கொள்ள வேண்டியவை.', 'बुकिंग से पहले जो भी जानना चाहें।'],
  'h.contact': ['Contact Us', 'தொடர்பு கொள்ள', 'संपर्क करें'],
  'h.contact.p': ['Call, WhatsApp or send an enquiry — we’d love to hear about your celebration.', 'அழைக்கவும், வாட்ஸ்அப் செய்யவும் அல்லது விசாரணை அனுப்பவும் — உங்கள் கொண்டாட்டத்தைப் பற்றி கேட்க ஆவலாக உள்ளோம்.', 'कॉल करें, व्हाट्सऐप करें या पूछताछ भेजें — हम आपके उत्सव के बारे में सुनना चाहेंगे।'],
  'h.404': ['Page not found', 'பக்கம் கிடைக்கவில்லை', 'पेज नहीं मिला'],
  'h.404.p': ['The page you are looking for does not exist.', 'நீங்கள் தேடும் பக்கம் இல்லை.', 'आप जो पेज ढूंढ रहे हैं वह मौजूद नहीं है।'],

  // about
  'ab.story': ['Our Story', 'எங்கள் கதை', 'हमारी कहानी'],
  'ab.p1': ['King Events began with a simple idea: every family in Tirunelveli deserves a celebration that looks royal without the stress. From our base in Kalanthapanai, we bring decoration, catering and entertainment together under one team.', 'ஒவ்வொரு திருநெல்வேலி குடும்பமும் மன அழுத்தமின்றி ராஜ கொண்டாட்டத்தை பெற வேண்டும் என்ற எளிய எண்ணத்தில் கிங் ஈவென்ட்ஸ் தொடங்கியது. களந்தபனையை மையமாகக் கொண்டு, அலங்காரம், கேட்டரிங் மற்றும் கேளிக்கையை ஒரே குழுவாக வழங்குகிறோம்.', 'किंग इवेंट्स एक सरल सोच से शुरू हुआ: तिरुनेलवेली के हर परिवार को बिना तनाव के शाही उत्सव मिलना चाहिए। कलंथपनई से हम सजावट, कैटरिंग और मनोरंजन को एक ही टीम के तहत लाते हैं।'],
  'ab.p2': ['We treat every wedding as our own family function — fresh marigolds, jasmine thoranams, brass lamps and a team that arrives early and stays until the last guest leaves.', 'ஒவ்வொரு திருமணத்தையும் எங்கள் சொந்த குடும்ப விழாவாகவே கருதுகிறோம் — புதிய சாமந்தி, மல்லிகை தோரணங்கள், பித்தளை விளக்குகள், முன்கூட்டியே வந்து கடைசி விருந்தினர் செல்லும் வரை இருக்கும் குழு.', 'हम हर शादी को अपने परिवार का समारोह मानते हैं — ताज़ा गेंदे, चमेली के तोरण, पीतल के दीपक और ऐसी टीम जो जल्दी पहुंचती है और आखिरी मेहमान के जाने तक रहती है।'],
  'ab.areas': ['Areas We Serve', 'நாங்கள் சேவை செய்யும் பகுதிகள்', 'हम कहाँ सेवा देते हैं'],
  'ar.1': ['Kalanthapanai', 'களந்தபனை', 'कलंथपनई'],
  'ar.2': ['Tirunelveli', 'திருநெல்வேலி', 'तिरुनेलवेली'],
  'ar.3': ['Tenkasi', 'தென்காசி', 'तेनकासी'],
  'ar.4': ['Thoothukudi', 'தூத்துக்குடி', 'थूथुकुडी'],
  'ar.5': ['Nagercoil', 'நாகர்கோவில்', 'नागरकोइल'],
  'ar.6': ['Kanyakumari', 'கன்னியாகுமரி', 'कन्याकुमारी'],

  // faq
  'q1': ['How early should I book?', 'எவ்வளவு முன்பே புக் செய்ய வேண்டும்?', 'कितनी जल्दी बुक करना चाहिए?'],
  'a1': ['We recommend booking 2–3 months before the muhurtham, especially in peak wedding season. Short-notice dates are possible — just call us.', 'முகூர்த்தத்திற்கு 2–3 மாதங்களுக்கு முன் புக் செய்ய பரிந்துரைக்கிறோம், குறிப்பாக திருமண சீசனில். குறுகிய கால தேதிகளும் சாத்தியம் — எங்களை அழைக்கவும்.', 'मुहूर्त से 2–3 महीने पहले बुक करने की सलाह है, खासकर शादी के सीज़न में। कम समय में भी संभव है — बस हमें कॉल करें।'],
  'q2': ['How much advance do I need to pay?', 'முன்பணம் எவ்வளவு செலுத்த வேண்டும்?', 'अग्रिम कितना देना होगा?'],
  'a2': ['A booking advance confirms your date. The amount and balance schedule are shared in your quote.', 'முன்பணம் செலுத்தினால் உங்கள் தேதி உறுதியாகும். தொகை மற்றும் மீதித் தொகை அட்டவணை விலைப்பட்டியலில் தெரிவிக்கப்படும்.', 'अग्रिम राशि से आपकी तारीख पक्की होती है। राशि और शेष भुगतान का विवरण कोटेशन में बताया जाता है।'],
  'q3': ['Do you work outside Tirunelveli?', 'திருநெல்வேலிக்கு வெளியே சேவை உண்டா?', 'क्या आप तिरुनेलवेली के बाहर भी काम करते हैं?'],
  'a3': ['Yes — we serve nearby districts too. Travel charges may apply for distant venues.', 'ஆம் — அருகிலுள்ள மாவட்டங்களிலும் சேவை செய்கிறோம். தொலைதூர அரங்கங்களுக்கு பயணக் கட்டணம் இருக்கலாம்.', 'हां — हम आसपास के जिलों में भी सेवा देते हैं। दूर के वेन्यू के लिए यात्रा शुल्क लग सकता है।'],
  'q4': ['Can I choose only decoration without catering?', 'கேட்டரிங் இல்லாமல் அலங்காரம் மட்டும் தேர்வு செய்யலாமா?', 'क्या मैं कैटरिंग के बिना सिर्फ सजावट ले सकता हूँ?'],
  'a4': ['Of course. Every service can be booked on its own or combined in a package.', 'நிச்சயமாக. ஒவ்வொரு சேவையையும் தனியாகவோ பேக்கேஜுடன் சேர்த்தோ புக் செய்யலாம்.', 'बिल्कुल। हर सेवा अलग से या पैकेज में बुक की जा सकती है।'],
  'q5': ['Can the decoration match our theme or colours?', 'எங்கள் தீம் அல்லது நிறங்களுக்கு ஏற்ப அலங்காரம் செய்ய முடியுமா?', 'क्या सजावट हमारी थीम या रंगों के अनुसार हो सकती है?'],
  'a5': ['Yes. Share your colours, reference photos or traditions and we’ll design around them.', 'முடியும். உங்கள் நிறங்கள், மாதிரி புகைப்படங்கள் அல்லது சம்பிரதாயங்களை பகிருங்கள், அதற்கேற்ப வடிவமைப்போம்.', 'हां। अपने रंग, रेफ़रेंस फ़ोटो या परंपराएं साझा करें, हम उसी के अनुसार डिज़ाइन करेंगे।'],
  'q6': ['Do you set up popcorn and cotton candy stalls for small functions?', 'சிறிய விழாக்களுக்கும் பாப்கார்ன், பஞ்சு மிட்டாய் ஸ்டால் அமைப்பீர்களா?', 'क्या आप छोटे समारोहों के लिए भी पॉपकॉर्न व कॉटन कैंडी स्टॉल लगाते हैं?'],
  'a6': ['Yes — birthdays, housewarmings and school events too, not just weddings.', 'ஆம் — திருமணம் மட்டுமல்ல, பிறந்தநாள், புதுமனை புகுவிழா, பள்ளி நிகழ்ச்சிகளுக்கும்.', 'हां — जन्मदिन, गृहप्रवेश और स्कूल कार्यक्रमों के लिए भी, सिर्फ शादियों के लिए नहीं।'],
  'q7': ['How can I get a quote?', 'விலை விவரம் எப்படி பெறுவது?', 'कोटेशन कैसे मिलेगा?'],
  'a7': ['Call or WhatsApp us, or use the form on the Contact page. We’ll get back to you quickly.', 'எங்களை அழைக்கவும் அல்லது வாட்ஸ்அப் செய்யவும், அல்லது தொடர்பு பக்கத்தில் உள்ள படிவத்தை பயன்படுத்தவும். விரைவில் பதிலளிப்போம்.', 'हमें कॉल या व्हाट्सऐप करें, या संपर्क पेज का फॉर्म भरें। हम जल्दी जवाब देंगे।'],

  // CTA
  'cta.h2': ['Ready to plan your big day?', 'உங்கள் சிறப்பு நாளை திட்டமிட தயாரா?', 'अपने खास दिन की योजना बनाने को तैयार?'],
  'cta.p': ['Tell us your date and we’ll take care of the rest.', 'உங்கள் தேதியை சொல்லுங்கள், மீதியை நாங்கள் பார்த்துக்கொள்கிறோம்.', 'अपनी तारीख बताइए, बाकी हम संभाल लेंगे।'],

  // contact
  'ct.form': ['Plan Your Celebration', 'உங்கள் கொண்டாட்டத்தை திட்டமிடுங்கள்', 'अपने उत्सव की योजना बनाएं'],
  'ct.name': ['Your Name', 'உங்கள் பெயர்', 'आपका नाम'],
  'ct.phone': ['Phone Number', 'தொலைபேசி எண்', 'फ़ोन नंबर'],
  'ct.type': ['Event Type', 'நிகழ்ச்சி வகை', 'इवेंट का प्रकार'],
  'ct.date': ['Event Date', 'நிகழ்ச்சி தேதி', 'इवेंट की तारीख'],
  'ct.guests': ['Guests (approx.)', 'விருந்தினர்கள் (தோராயமாக)', 'मेहमान (लगभग)'],
  'ct.venue': ['Venue / Area', 'அரங்கம் / பகுதி', 'वेन्यू / क्षेत्र'],
  'ct.msg': ['Your Requirements', 'உங்கள் தேவைகள்', 'आपकी ज़रूरतें'],
  'ct.msg.ph': ['Theme, colours, menu ideas, anything else…', 'தீம், நிறங்கள், உணவு யோசனைகள், மற்றவை…', 'थीम, रंग, मेन्यू के विचार, कुछ और…'],
  'ct.name.ph': ['e.g. Murugan', 'எ.கா. முருகன்', 'जैसे: मुरुगन'],
  'ct.venue.ph': ['Hall name or town', 'மண்டபம் பெயர் அல்லது ஊர்', 'हॉल का नाम या शहर'],
  'ct.select': ['Select event…', 'நிகழ்ச்சியை தேர்வு செய்க…', 'इवेंट चुनें…'],
  'ct.other': ['Other', 'மற்றவை', 'अन्य'],
  'ct.send': ['Send on WhatsApp', 'வாட்ஸ்அப்பில் அனுப்பு', 'व्हाट्सऐप पर भेजें'],
  'ct.err': ['Please fill this in correctly', 'இதை சரியாக நிரப்பவும்', 'कृपया इसे सही भरें'],
  'ct.call': ['Call Us', 'எங்களை அழைக்க', 'कॉल करें'],
  'ct.email': ['Email', 'மின்னஞ்சல்', 'ईमेल'],
  'ct.visit': ['Visit Us', 'முகவரி', 'पता'],
  'ct.hours': ['Working Hours', 'வேலை நேரம்', 'कार्य समय'],
  'form.toast': ['Opening WhatsApp — just press Send!', 'வாட்ஸ்அப் திறக்கிறது — Send அழுத்துங்கள்!', 'व्हाट्सऐप खुल रहा है — बस Send दबाएं!'],

  // footer
  'ft.about': ['Wedding decoration, royal catering and celebration stalls — crafted with Indian tradition in Tirunelveli.', 'திருமண அலங்காரம், ராஜ விருந்து மற்றும் கொண்டாட்ட ஸ்டால்கள் — திருநெல்வேலியில் இந்திய பாரம்பரியத்துடன் உருவாக்கப்படுகிறது.', 'शादी की सजावट, शाही कैटरिंग और उत्सव स्टॉल — तिरुनेलवेली में भारतीय परंपरा के साथ।'],
  'ft.links': ['Quick Links', 'விரைவு இணைப்புகள்', 'त्वरित लिंक'],
  'ft.copy': ['© 2026 King Events, Kalanthapanai, Tirunelveli. All rights reserved.', '© 2026 கிங் ஈவென்ட்ஸ், களந்தபனை, திருநெல்வேலி. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', '© 2026 किंग इवेंट्स, कलंथपनई, तिरुनेलवेली। सर्वाधिकार सुरक्षित।'],
  'btn.home': ['Back to Home', 'முகப்புக்கு திரும்ப', 'होम पर वापस जाएं']
};

// <title> per page
const TITLES = {
  home: ['King Events | Wedding Decoration & Catering in Tirunelveli', 'கிங் ஈவென்ட்ஸ் | திருநெல்வேலி திருமண அலங்காரம் & கேட்டரிங்', 'किंग इवेंट्स | तिरुनेलवेली में शादी सजावट व कैटरिंग'],
  services: ['Services', 'சேவைகள்', 'सेवाएं'], packages: ['Packages', 'பேக்கேஜ்கள்', 'पैकेज'],
  gallery: ['Gallery', 'கேலரி', 'गैलरी'], about: ['About Us', 'எங்களை பற்றி', 'हमारे बारे में'],
  faq: ['FAQ', 'கேள்விகள்', 'सवाल'], contact: ['Contact', 'தொடர்பு', 'संपर्क'], '404': ['Page not found', 'பக்கம் கிடைக்கவில்லை', 'पेज नहीं मिला']
};
const DESCS = {
  home: 'King Events in Kalanthapanai, Tirunelveli — wedding & reception decoration, mandapams, catering, popcorn and cotton candy stalls. Call 9363638730.',
  services: 'Marriage, reception and engagement decoration, catering, popcorn and cotton candy stalls and complete event decoration in Tirunelveli.',
  packages: 'Wedding and event decoration packages in Tirunelveli — Classic, Royal and Grand. Clear starting prices.',
  gallery: 'Photos of wedding mandapams, reception stages, engagement decor, catering and fun stalls by King Events, Tirunelveli.',
  about: 'About King Events — Tirunelveli’s team for wedding decoration, catering and celebration stalls.',
  faq: 'Answers to common questions about booking wedding decoration and catering with King Events, Tirunelveli.',
  contact: 'Contact King Events, Kalanthapanai, Tirunelveli. Call or WhatsApp 9363638730 to book wedding decoration and catering.',
  '404': 'Page not found'
};
Object.keys(TITLES).forEach(k => {
  const [en, ta, hi] = TITLES[k];
  if (k === 'home') { L['title.home'] = [en, ta, hi]; return; }
  L['title.' + k] = [en + ' | King Events, Tirunelveli', ta + ' | கிங் ஈவென்ட்ஸ், திருநெல்வேலி', hi + ' | किंग इवेंट्स, तिरुनेलवेली'];
});

/* =====================================================================
   3. HELPERS
   ===================================================================== */
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = k => { if (!L[k]) throw new Error('Missing text key: ' + k); return L[k][0]; };
const t = (k, tag = 'span', attrs = '') => `<${tag} data-i18n="${k}"${attrs ? ' ' + attrs : ''}>${txt(k)}</${tag}>`;
const ph = k => `placeholder="${esc(txt(k))}" data-i18n-ph="${k}"`;

const ICON = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8V6.5c0-.7.2-1 1.1-1H17V2h-2.6C11.6 2 10 3.7 10 6.2V8H8v3.5h2V22h4v-10.5h2.7L17 8z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/></svg>'
};

const NAV = [['index.html', 'nav.home', 'home'], ['services.html', 'nav.services', 'services'], ['packages.html', 'nav.packages', 'packages'],
  ['gallery.html', 'nav.gallery', 'gallery'], ['about.html', 'nav.about', 'about'], ['faq.html', 'nav.faq', 'faq'], ['contact.html', 'nav.contact', 'contact']];

const SERVICES = [
  { n: 1, img: 'stage-ramji.jpg', cat: 'wedding' }, { n: 2, img: 'stage-arch.jpg', cat: 'reception' },
  { n: 3, img: 'engagement-anu.jpg', cat: 'engagement' }, { n: 4, img: 'catering.jpg', cat: 'catering' },
  { n: 5, img: 'popcorn.jpg', cat: 'stalls' }, { n: 6, img: 'cotton-candy.jpg', cat: 'stalls' },
  { n: 7, img: 'stage-fan.jpg', cat: 'engagement' }
];

const waLink = msg => `https://wa.me/${CFG.whatsapp}` + (msg ? `?text=${encodeURIComponent(msg)}` : '');
const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(CFG.mapQuery)}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.mapQuery)}`;
const socialLinks = () => [['instagram', 'ig', 'Instagram'], ['facebook', 'fb', 'Facebook'], ['youtube', 'yt', 'YouTube']]
  .filter(([k]) => CFG[k]).map(([k, i, n]) => `<a href="${CFG[k]}" target="_blank" rel="noopener" aria-label="${n}">${ICON[i]}</a>`).join('');

/* =====================================================================
   4. SHARED LAYOUT
   ===================================================================== */
function layout({ page, file, body, hero }) {
  const title = txt('title.' + page);
  const canon = CFG.siteUrl ? `<link rel="canonical" href="${CFG.siteUrl.replace(/\/$/, '')}/${file === 'index.html' ? '' : file}">` : '';
  const ld = {
    '@context': 'https://schema.org', '@type': 'EventPlanner', name: 'King Events', telephone: CFG.phoneIntl, email: CFG.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Kalanthapanai, Tirunelveli', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
    areaServed: ['Tirunelveli', 'Tenkasi', 'Thoothukudi', 'Nagercoil', 'Kanyakumari'],
    description: DESCS.home
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(DESCS[page])}">
<meta name="theme-color" content="#1d0409">
${page === '404' ? '<meta name="robots" content="noindex">' : ''}${canon}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(DESCS[page])}">
<meta property="og:type" content="website">
<meta property="og:image" content="${CFG.siteUrl ? CFG.siteUrl.replace(/\/$/, '') + '/' : ''}assets/images/stage-gold.jpg">
<link rel="icon" type="image/svg+xml" href="assets/icons/kalash.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body data-page="${page}">
<div class="topbar"><div class="container">
  <div class="tb-left"><span>📍 ${t('loc.short')}</span><span>🕘 ${t('hours.short')}</span></div>
  <div class="tb-right"><a href="tel:${CFG.phoneIntl}">📞 ${CFG.phone}</a> &nbsp;·&nbsp; <a href="mailto:${CFG.email}">✉ ${CFG.email}</a></div>
</div></div>
<header class="site"><div class="container">
  <a href="index.html" class="logo" aria-label="King Events home"><img src="assets/icons/kalash.svg" alt="" width="34" height="34"><span>${CFG.name}</span></a>
  <nav class="nav" id="nav" aria-label="Main">
    ${NAV.map(([f, k, p]) => `<a href="${f}"${p === page ? ' class="active" aria-current="page"' : ''}>${t(k)}</a>`).join('\n    ')}
  </nav>
  <div class="head-actions">
    <div class="lang" role="group" aria-label="Language"><button data-lang="en">EN</button><button data-lang="ta">தமிழ்</button><button data-lang="hi">हिन्दी</button></div>
    <a href="contact.html" class="btn btn-gold">${t('nav.book')}</a>
    <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  </div>
</div></header>
${hero || ''}
<main>
${body}
</main>
<footer class="site"><div class="container">
  <div class="f-grid">
    <div>
      <a href="index.html" class="logo" style="margin-bottom:1rem"><img src="assets/icons/kalash.svg" alt="" width="34" height="34"><span>${CFG.name}</span></a>
      <p>${t('ft.about')}</p>
      <div class="socials">${socialLinks()}</div>
    </div>
    <div><h4>${t('ft.links')}</h4><ul>${NAV.map(([f, k]) => `<li><a href="${f}">${t(k)}</a></li>`).join('')}</ul></div>
    <div><h4>${t('nav.services')}</h4><ul>${SERVICES.map(s => `<li><a href="services.html#s${s.n}">${t('s' + s.n + '.t')}</a></li>`).join('')}</ul></div>
    <div><h4>${t('nav.contact')}</h4><ul>
      <li>📍 ${t('loc.full')}</li>
      <li>📞 <a href="tel:${CFG.phoneIntl}">${CFG.phone}</a></li>
      <li>💬 <a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a></li>
      <li>✉ <a href="mailto:${CFG.email}">${CFG.email}</a></li>
    </ul></div>
  </div>
  <div class="f-bottom">${t('ft.copy')}</div>
</div></footer>
<div class="float">
  <a class="wa" href="${waLink('Hi King Events, I would like to enquire about an event.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
  <a class="call" href="tel:${CFG.phoneIntl}" aria-label="Call">${ICON.phone}</a>
</div>
<div class="toast" role="status"></div>
<script src="js/config.js"></script>
<script src="js/site.js"></script>
</body>
</html>`;
}

const pageHero = (hk, img) => `<section class="page-hero" style="background-image:url('assets/images/${img}')"><div class="container">${t(hk, 'h1')}${t(hk + '.p', 'p')}</div></section>`;
const head = (eyebrow, h2, p) => `<div class="section-head reveal">${eyebrow ? t(eyebrow, 'span', 'class="eyebrow"') : ''}${t(h2, 'h2')}<div class="divider"></div>${p ? t(p, 'p') : ''}</div>`;
const cta = () => `<section class="cta"><div class="container reveal">${t('cta.h2', 'h2')}${t('cta.p', 'p')}
  <div class="hero-actions"><a class="btn btn-gold" href="tel:${CFG.phoneIntl}">${ICON.phone}${t('btn.call')}</a><a class="btn btn-wa" href="${waLink('Hi King Events, I would like to enquire about an event.')}" target="_blank" rel="noopener">${ICON.wa}${t('btn.wa')}</a></div></div></section>`;

const serviceCards = () => `<div class="grid grid-3">${SERVICES.map(s => `
  <article class="card reveal"><div class="thumb"><img src="assets/images/${s.img}" alt="${esc(txt('s' + s.n + '.t'))}" loading="lazy" width="1376" height="768"></div>
  <div class="body">${t('s' + s.n + '.t', 'h3')}${t('s' + s.n + '.d', 'p')}<a class="more" href="services.html#s${s.n}" data-i18n="btn.more">${txt('btn.more')}</a></div></article>`).join('')}</div>`;

const packageCards = () => {
  const mk = (n, key, price, count, featured) => `
  <div class="pkg reveal${featured ? ' featured' : ''}">${featured ? t('pk.popular', 'span', 'class="tag"') : ''}
    ${t(`pk${n}.n`, 'h3')}<div class="from">${t('pk.from')}</div><div class="price">${price}*</div>
    <ul>${Array.from({ length: count }, (_, i) => `<li>${t(`pk${n}.f${i + 1}`)}</li>`).join('')}</ul>
    <a class="btn ${featured ? 'btn-gold' : 'btn-dark'}" href="${waLink(`Hi King Events, I'm interested in the ${key} package.`)}" target="_blank" rel="noopener">${t('btn.book')}</a>
  </div>`;
  return `<div class="grid grid-3">${mk(1, 'Classic', CFG.prices.classic, 4)}${mk(2, 'Royal', CFG.prices.royal, 5, true)}${mk(3, 'Grand', CFG.prices.grand, 6)}</div>
  ${t('pk.note', 'p', 'class="note"')}`;
};

const whyCards = (light) => `<div class="grid grid-4">${[['🪔', 1], ['🤝', 2], ['🌼', 3], ['💰', 4]].map(([i, n]) => `
  <div class="feature reveal${light ? ' light-feature' : ''}"><div class="ico">${i}</div>${t(`w${n}.t`, 'h3')}${t(`w${n}.d`, 'p')}</div>`).join('')}</div>`;

const steps = () => `<div class="steps">${[1, 2, 3, 4].map(n => `<div class="step reveal">${t(`p${n}.t`, 'h3')}${t(`p${n}.d`, 'p')}</div>`).join('')}</div>`;

/* =====================================================================
   5. PAGES
   ===================================================================== */
const pages = {};

pages['index.html'] = layout({
  page: 'home', file: 'index.html',
  hero: `<section class="hero" style="background-image:url('assets/images/stage-gold.jpg')"><div class="container">
    <span class="badge">📍 ${t('loc.short')}</span>
    ${t('hero.h1', 'h1')}${t('hero.lead', 'p', 'class="lead"')}
    <div class="hero-actions"><a class="btn btn-gold" href="contact.html">${t('btn.quote')}</a><a class="btn btn-outline" href="services.html">${t('btn.explore')}</a></div>
  </div></section>
  <section class="stats"><div class="container">
    <div class="stat"><b data-count="${CFG.stats.years}" data-suffix="+">0</b>${t('stat.years')}</div>
    <div class="stat"><b data-count="${CFG.stats.events}" data-suffix="+">0</b>${t('stat.events')}</div>
    <div class="stat"><b data-count="${CFG.stats.services}">0</b>${t('stat.services')}</div>
    <div class="stat"><b data-count="${CFG.stats.districts}">0</b>${t('stat.districts')}</div>
  </div></section>`,
  body: `
<section class="section"><div class="container">${head('sec.services.eyebrow', 'sec.services.h2', 'sec.services.p')}${serviceCards()}</div></section>
<section class="section dark"><div class="container">${head('why.eyebrow', 'why.h2')}${whyCards()}</div></section>
<section class="section alt"><div class="container">${head('pk.eyebrow', 'pk.h2', 'pk.p')}${packageCards()}</div></section>
<section class="section"><div class="container">${head('gal.eyebrow', 'gal.h2')}
  <div class="grid grid-3">${['stage-fan.jpg', 'stage-ramji.jpg', 'stage-arch.jpg'].map(i => `<a href="gallery.html" class="card reveal"><div class="thumb" style="aspect-ratio:4/3"><img src="assets/images/${i}" alt="" loading="lazy"></div></a>`).join('')}</div>
  <div style="text-align:center;margin-top:2.2rem"><a class="btn btn-dark" href="gallery.html">${t('btn.gallery')}</a></div></div></section>
<section class="section alt"><div class="container">${head('proc.eyebrow', 'proc.h2')}${steps()}</div></section>
${cta()}`
});

pages['services.html'] = layout({
  page: 'services', file: 'services.html', hero: pageHero('h.services', 'stage-arch.jpg'),
  body: `<section class="section"><div class="container">${SERVICES.map((s, i) => `
  <div class="split${i % 2 ? ' rev' : ''}" id="s${s.n}">
    <div class="split-img reveal"><img src="assets/images/${s.img}" alt="${esc(txt('s' + s.n + '.t'))}" loading="lazy"></div>
    <div class="split-text reveal"><span class="num">0${s.n}</span>${t('s' + s.n + '.t', 'h2')}${t('s' + s.n + '.d', 'p')}
      <p style="margin-top:.8rem;font-weight:600;color:var(--maroon-600)">${t('s' + s.n + '.i')}</p>
      <div style="margin-top:1.4rem"><a class="btn btn-dark" href="${waLink(`Hi King Events, I'd like to enquire about ${txt('s' + s.n + '.t')}.`)}" target="_blank" rel="noopener">${ICON.wa}${t('btn.enquire')}</a></div></div>
  </div>`).join('')}</div></section>${cta()}`
});

pages['packages.html'] = layout({
  page: 'packages', file: 'packages.html', hero: pageHero('h.packages', 'stage-fan.jpg'),
  body: `<section class="section alt"><div class="container">${packageCards()}
  <div class="section-head" style="margin:3.5rem auto 0">${t('pk.addons', 'h3')}</div>
  <div class="addons"><span>${t('s4.t')}</span><span>${t('s5.t')}</span><span>${t('s6.t')}</span><span>${t('pk.a4')}</span><span>${t('pk.a5')}</span></div></div></section>
<section class="section"><div class="container">${head('proc.eyebrow', 'proc.h2')}${steps()}</div></section>${cta()}`
});

const GALLERY = [
  ['stage-gold.jpg', 'reception'], ['stage-ramji.jpg', 'wedding'], ['stage-fan.jpg', 'wedding'], ['stage-arch.jpg', 'reception'],
  ['ring-yellow-sofa.jpg', 'wedding'], ['purple-lotus.jpg', 'reception'], ['floral-cubes.jpg', 'reception'], ['pink-ring-arch.jpg', 'wedding'],
  ['engagement-anu.jpg', 'engagement'], ['carved-panel.jpg', 'wedding'], ['bicycle-stage.jpg', 'wedding'], ['light-tunnel.jpg', 'entrance'],
  ['banana-entrance.jpg', 'entrance'], ['pink-butterfly.jpg', 'reception'], ['hexagon-arch.jpg', 'reception'], ['purple-drape.jpg', 'wedding'],
  ['yellow-floral-wall.jpg', 'wedding'], ['green-wall-stage.jpg', 'wedding'], ['bamboo-stage.jpg', 'reception'], ['peach-drapes.jpg', 'reception'],
  ['catering.jpg', 'catering'], ['popcorn.jpg', 'stalls'], ['cotton-candy.jpg', 'stalls']  // last 3 are AI placeholders - replace with real photos
].map(([img, cat]) => [img, cat, { wedding: 's1.t', reception: 's2.t', engagement: 's3.t', catering: 's4.t', stalls: 's5.t', entrance: 'cat.entrance' }[cat]]);
pages['gallery.html'] = layout({
  page: 'gallery', file: 'gallery.html', hero: pageHero('h.gallery', 'stage-gold.jpg'),
  body: `<section class="section"><div class="container">
  <div class="chips">${['all', 'wedding', 'reception', 'engagement', 'entrance', 'catering', 'stalls'].map((c, i) => `<button class="chip${i ? '' : ' on'}" data-f="${c}">${t('cat.' + c)}</button>`).join('')}</div>
  <div class="gallery">${GALLERY.map(([img, cat, cap]) => `<figure class="g-item" data-cat="${cat}"><img src="assets/images/${img}" alt="${esc(txt(cap))}" loading="lazy"><figcaption>${t(cap)}</figcaption></figure>`).join('')}</div>
  </div></section>
<div class="lightbox" role="dialog" aria-modal="true"><button class="x" aria-label="Close">×</button><button class="p" aria-label="Previous">‹</button><img alt=""><button class="n" aria-label="Next">›</button></div>
${cta()}`
});

pages['about.html'] = layout({
  page: 'about', file: 'about.html', hero: pageHero('h.about', 'floral-cubes.jpg'),
  body: `<section class="section"><div class="container"><div class="split">
    <div class="split-img reveal"><img src="assets/images/ring-yellow-sofa.jpg" alt="" loading="lazy"></div>
    <div class="split-text reveal">${t('ab.story', 'h2')}${t('ab.p1', 'p')}<p style="margin-top:1rem">${t('ab.p2')}</p>
    <div style="margin-top:1.6rem"><a class="btn btn-dark" href="contact.html">${t('btn.quote')}</a></div></div></div></div></section>
<section class="section dark"><div class="container">${head('why.eyebrow', 'why.h2')}${whyCards()}</div></section>
<section class="section"><div class="container"><div class="section-head reveal">${t('ab.areas', 'h2')}<div class="divider"></div></div>
  <div class="areas">${[1, 2, 3, 4, 5, 6].map(n => `<span>${t('ar.' + n)}</span>`).join('')}</div></div></section>${cta()}`
});

pages['faq.html'] = layout({
  page: 'faq', file: 'faq.html', hero: pageHero('h.faq', 'stage-ramji.jpg'),
  body: `<section class="section"><div class="container"><div class="faq">${[1, 2, 3, 4, 5, 6, 7].map(n => `<details class="reveal"><summary>${t('q' + n)}</summary>${t('a' + n, 'p')}</details>`).join('')}</div></div></section>${cta()}`
});

pages['contact.html'] = layout({
  page: 'contact', file: 'contact.html', hero: pageHero('h.contact', 'stage-gold.jpg'),
  body: `<section class="section alt"><div class="container"><div class="contact-grid">
  <div class="form-card reveal">${t('ct.form', 'h2')}
    <form id="booking-form" novalidate>
      <div class="row">
        <div class="field"><label for="f-name">${t('ct.name')} *</label><input id="f-name" type="text" autocomplete="name" ${ph('ct.name.ph')} required>${t('ct.err', 'span', 'class="err"')}</div>
        <div class="field"><label for="f-phone">${t('ct.phone')} *</label><input id="f-phone" type="tel" autocomplete="tel" placeholder="98765 43210" required>${t('ct.err', 'span', 'class="err"')}</div>
      </div>
      <div class="row">
        <div class="field"><label for="f-type">${t('ct.type')} *</label><select id="f-type" required><option value="" data-i18n="ct.select">${txt('ct.select')}</option>
          ${[1, 2, 3, 4, 5, 6, 7].map(n => `<option value="s${n}" data-i18n="s${n}.t">${txt('s' + n + '.t')}</option>`).join('')}<option value="other" data-i18n="ct.other">${txt('ct.other')}</option></select>${t('ct.err', 'span', 'class="err"')}</div>
        <div class="field"><label for="f-date">${t('ct.date')} *</label><input id="f-date" type="date" required>${t('ct.err', 'span', 'class="err"')}</div>
      </div>
      <div class="row">
        <div class="field"><label for="f-guests">${t('ct.guests')}</label><input id="f-guests" type="number" min="1" inputmode="numeric" placeholder="300"></div>
        <div class="field"><label for="f-venue">${t('ct.venue')}</label><input id="f-venue" type="text" ${ph('ct.venue.ph')}></div>
      </div>
      <div class="field"><label for="f-msg">${t('ct.msg')}</label><textarea id="f-msg" ${ph('ct.msg.ph')}></textarea></div>
      <button class="btn btn-wa" type="submit" style="width:100%;justify-content:center">${ICON.wa}${t('ct.send')}</button>
    </form>
  </div>
  <div class="reveal">
    <div class="info-list">
      <div class="info"><span class="ico">📞</span><div>${t('ct.call', 'b')}<a href="tel:${CFG.phoneIntl}">${CFG.phone}</a></div></div>
      <div class="info"><span class="ico">💬</span><div><b>WhatsApp</b><a href="${waLink()}" target="_blank" rel="noopener">${CFG.phone}</a></div></div>
      <div class="info"><span class="ico">✉</span><div>${t('ct.email', 'b')}<a href="mailto:${CFG.email}">${CFG.email}</a></div></div>
      <div class="info"><span class="ico">📍</span><div>${t('ct.visit', 'b')}<a href="${mapLink}" target="_blank" rel="noopener">${t('loc.full')}</a></div></div>
      <div class="info"><span class="ico">🕘</span><div>${t('ct.hours', 'b')}${t('hours.short')}</div></div>
    </div>
    <div class="map"><iframe src="${mapEmbed}" title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
  </div></div></div></section>`
});

pages['404.html'] = layout({
  page: '404', file: '404.html', hero: pageHero('h.404', 'stage-gold.jpg'),
  body: `<section class="section"><div class="container" style="text-align:center"><a class="btn btn-dark" href="index.html">${t('btn.home')}</a></div></section>`
});

/* =====================================================================
   6. WRITE OUTPUT
   ===================================================================== */
const OUT = path.join(__dirname, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'css'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'js'), { recursive: true });
fs.cpSync(path.join(__dirname, 'assets'), path.join(OUT, 'assets'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'src/site.css'), path.join(OUT, 'css/site.css'));
fs.copyFileSync(path.join(__dirname, 'src/site.js'), path.join(OUT, 'js/site.js'));

const i18n = {};
Object.keys(L).forEach(k => { i18n[k] = { ta: L[k][1], hi: L[k][2] }; });
fs.writeFileSync(path.join(OUT, 'js/config.js'),
  `window.SITE_CONFIG=${JSON.stringify({ whatsapp: CFG.whatsapp })};\nwindow.I18N=${JSON.stringify(i18n)};\n`);
Object.entries(pages).forEach(([f, html]) => fs.writeFileSync(path.join(OUT, f), html));

if (CFG.siteUrl) {
  const base = CFG.siteUrl.replace(/\/$/, '');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(pages).filter(f => f !== '404.html').map(f => `<url><loc>${base}/${f === 'index.html' ? '' : f}</loc></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
}
console.log('Built', Object.keys(pages).length, 'pages →', OUT);
