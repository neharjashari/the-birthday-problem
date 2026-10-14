import type { Messages } from './en';

/** Albanian strings (default language). Must define every key in en.ts. */
export const sq: Messages = {
  'app.title': 'Problemi i ditëlindjes',
  'app.subtitle': 'dhe pse ai përcakton sa i gjatë duhet të jetë një hash kriptografik',
  'app.lead':
    'Në një dhomë me vetëm 23 njerëz, probabiliteti që të paktën dy prej tyre ta kenë ditëlindjen në të njëjtën ditë të vitit është mbi 50%. I njëjti parim matematikor shpjegon pse një funksion hash 256-bitësh ofron rreth 128 bits siguri kur synohet gjetja e dy hyrjeve të ndryshme me të njëjtën vlerë hash.',
  'app.start': 'Filloni eksplorimin',

  'nav.s1': 'Paradoksi',
  'nav.s2': 'Për çdo N',
  'nav.s3': 'Laboratori',
  'nav.s4': 'Në praktikë',
  'nav.s5': 'Sulmi i Yuval-it',
  'ui.language': 'Gjuha',
  'ui.theme': 'Ndrysho modalitetin e pamjes',
  'ui.step': 'Hapi {n}',

  /* ---------------------------------- 1 ---------------------------------- */
  's1.title': 'Sa njerëz duhet të jenë në një grup që të paktën dy prej tyre të kenë ditëlindjen në të njëjtën ditë?',
  's1.guess.q':
    'Para se të shikoni: Sa njerëz duhet të jenë në një dhomë që probabiliteti që të paktën dy prej tyre të kenë ditëlindjen në të njëjtën ditë të vitit të jetë mbi 50%?',
  's1.guess.placeholder': 'Supozimi juaj',
  's1.guess.reveal': 'Zbulo',
  's1.guess.answer': 'Përgjigjja është **23**.',
  's1.guess.high':
    'Ju supozuat {guess}. Shumica e njerëzve mendojnë se duhen shumë më tepër njerëz. Arsyeja? Intuita jonë përqendrohet te numri i njerëzve, ndërsa matematika te numri i çifteve që mund të formohen mes tyre.',
  's1.guess.close': 'Bravo, {guess} është afër. Shumica supozojnë 100 ose më shumë.',
  's1.guess.low': 'Ju supozuat {guess}, pak më poshtë, por më afër se shumica.',
  's1.why':
    'Çdo person i ri duhet të ketë ditëlindje të ndryshme nga secili person që është tashmë në dhomë. Me (n) njerëz ka (n(n-1)/2) çifte, dhe secili çift ka 1/365 gjasa të ketë ditëlindjen në të njëjtën ditë. 23 njerëz formojnë tashmë 253 çifte.\n\nMë e lehtë është të llogarisim probabilitetin që asnjë ditëlindje të mos përputhet dhe pastaj ta zbresim nga 1:',
  's1.f.none': 'P(askush nuk përputhet)',
  's1.f.match': 'P(përputhje)',
  's1.slider': 'Njerëz në dhomë',
  's1.tile.any': 'Dy njerëz çfarëdo kanë të njëjtën ditëlindje',
  's1.tile.yours': 'Dikush e ka *ditëlindjen tuaj*',
  's1.tile.pairs': 'Çifte në dhomë',
  's1.chart.title': 'Probabiliteti sipas numrit të njerëzve',
  's1.chart.any': 'Përputhja e ditëlindjeve mes dy personave',
  's1.chart.yours': 'Përputhja e ditëlindjes së dikujt me tuajën',
  's1.chart.x': 'Njerëz në dhomë',
  's1.insight':
    'Vini re hendekun mes dy lakoreve. Është shumë më e lehtë që dy persona çfarëdo të kenë ditëlindjen në të njëjtën ditë sesa që dikush të ketë ditëlindjen në të njëjtën ditë me ju. Ky shembull ilustron dallimin mes një hash collision dhe një preimage attack.',
  's1.room.title': 'Provojeni: mbushni një dhomë',
  's1.room.fill': 'Mbushni dhomën me {n} njerëz',
  's1.room.empty': 'Shtypni butonin për t’i vendosur njerëzit në kalendar.',
  's1.room.found': 'Përputhje! Personi {a} dhe personi {b} kanë lindur të dy më {date}.',
  's1.room.more': '+ {count} ditë të tjera të përbashkëta',
  's1.room.none': 'Asnjë ditëlindje e përbashkët këtë herë. Provoni përsëri.',
  's1.room.one': 'Një person',
  's1.room.many': 'Ditëlindje e përbashkët',
  's1.room.sim': 'Simuloni {rooms} dhoma',
  's1.room.simResult': '{rate} e {rooms} dhomave kishin një ditëlindje të përbashkët. Teoria: {theory}.',

  /* ---------------------------------- 2 ---------------------------------- */
  's2.title': 'Nga 365 ditë në çdo N',
  's2.intro':
    'Asgjë në këtë arsyetim nuk varet nga ditëlindjet. Nëse vlerat zgjidhen në mënyrë uniforme nga N mundësi (ditë, numra identifikues, dalje të një hash-i), probabiliteti i një përsëritjeje pas n tërheqjeve është afërsisht:',
  's2.after':
    'Pra, për 50% gjasa përplasjeje (collision) mjaftojnë vetëm **n ≈ 1,18·√N** tërheqje: **rrënja katrore** e hapësirës. Për t’u përputhur me një vlerë *të caktuar* duhen rreth **0,69·N** prova.',
  's2.slider': 'Madhësia e daljes',
  's2.bitsValue': '{bits} bite',
  's2.tile.N': 'Vlera të mundshme N',
  's2.tile.coll': 'Tërheqje për 50% përplasje (collision)',
  's2.tile.pre': 'Prova për 50% paraimazh (preimage)',
  's2.tile.ratio': 'Përparësia e sulmuesit',
  's2.tile.ratioNote': 'herë më pak punë',
  's2.chart.title': 'Një lakore për çdo N',
  's2.chart.desc':
    'Kur vizatohet kundrejt n/√N, probabiliteti i përplasjes (collision) ndjek të njëjtën lakore, pavarësisht nga madhësia e hapësirës.',
  's2.chart.approx': 'Përafrimi, çdo N',
  's2.chart.exact': 'Saktë, N = 365',
  's2.table.space': 'Hapësira',
  's2.table.coll': '50% përplasje (collision) pas',
  's2.table.pre': '50% paraimazh (preimage) pas',
  's2.row.days': 'Ditëlindjet (365 ditë)',
  's2.row.b32': 'Vlerë 32-bitëshe',
  's2.row.b64': 'Vlerë 64-bitëshe',
  's2.row.md5': 'MD5 (128 bite)',
  's2.row.sha1': 'SHA-1 (160 bite)',
  's2.row.sha256': 'SHA-256 (256 bite)',

  /* ---------------------------------- 3 ---------------------------------- */
  's3.title': 'Laboratori i përputhjeve të vlerave hash',
  's3.intro':
    'Një funksion hash kriptografik e shndërron çdo hyrje në një “gjurmë” me madhësi fikse. SHA-256 i plotë ka 256 bits dalje, shumë më tepër se ç’mund të sulmohet. Prandaj e **shkurtojmë** SHA-256 në k bitet e para. Kështu fitojmë një hash të thjeshtuar në këtë demonstrim me N = 2^{k} dalje, që sillet si funksioni i vërtetë, vetëm më i vogël. Çdo hash më poshtë llogaritet drejtpërdrejt në shfletuesin tuaj.',
  's3.def.collision':
    '**Përplasje (collision):** gjeni *çfarëdo* dy mesazhe të ndryshme me të njëjtin hash. Vetia që e mbron: *rezistenca e fortë ndaj përplasjeve* (strong collision resistance). Puna e pritur ≈ 2^{k/2}.',
  's3.def.preimage':
    '**Paraimazh i dytë (second preimage):** për *një* mesazh të dhënë, gjeni një mesazh tjetër me të njëjtin hash. Vetia që e mbron: *rezistenca e dobët ndaj përplasjeve* (weak collision resistance). Puna e pritur ≈ 2^{k}.',
  's3.bits': 'Madhësia e hash-it k',
  's3.run.collision': 'Nis sulmin e ditëlindjes',
  's3.run.preimage': 'Nis sulmin e paraimazhit (preimage attack)',
  's3.run.race': 'Garë mes të dyjave',
  's3.stop': 'Ndalo',
  's3.panel.collision': 'Sulmi i ditëlindjes (collision attack)',
  's3.panel.preimage': 'Sulmi i paraimazhit (preimage attack)',
  's3.attempts': 'Hash-e të llogaritur',
  's3.expected': 'E pritur (mesatarisht)',
  's3.rate': 'Shpejtësia',
  's3.rateValue': '{rate} hash/s',
  's3.eta': 'Koha e pritur me këtë shpejtësi',
  's3.status.idle': 'Nuk ka filluar',
  's3.status.running': 'Në ekzekutim…',
  's3.status.stopped': 'U ndal',
  's3.status.done': 'U gjet pas {attempts} hash-eve, për {time}',
  's3.msgA': 'Mesazhi A',
  's3.msgB': 'Mesazhi B',
  's3.target': 'Mesazhi i synuar',
  's3.match': 'Mesazhi që përputhet',
  's3.highlight':
    'E theksuar: {k} bitet e para, e vetmja pjesë që shikon hash-i ynë i thjeshtuar. Vlerat e plota SHA-256 mbeten të ndryshme.',
  's3.exp.title': 'Si rritet puna?',
  's3.exp.desc':
    'Ekzekutojmë secilin sulm {trials} herë për shumë vlera të k dhe vizatojmë punën mesatare në shkallë logaritmike. Lakorja e përplasjes (collision curve) ngjitet 1 shkallë për çdo 2 bite; lakorja e paraimazhit (preimage curve) ngjitet 1 shkallë për çdo bit. Faktori 1/2 në eksponent është e gjithë historia.',
  's3.exp.run': 'Nis eksperimentin',
  's3.exp.running': 'Duke matur k = {bits}…',
  's3.exp.collision': 'Collision, e matur',
  's3.exp.preimage': 'Preimage, i matur',
  's3.exp.theoryC': 'Teoria: k/2',
  's3.exp.theoryP': 'Teoria: k',
  's3.exp.x': 'Madhësia e hash-it k (bite)',
  's3.exp.y': 'log₂(hash-e të llogaritur)',
  's3.exp.note':
    'Preimag matet vetëm deri në k = 16. Përtej kësaj zgjat shumë në shfletues, dhe pikërisht kjo është poenta.',

  /* ---------------------------------- 4 ---------------------------------- */
  's4.title': 'Pse ka rëndësi në praktikë',
  's4.rule':
    '**Rregull praktik:** një hash n-bitësh ofron të shumtën n/2 bits rezistencë ndaj përplasjeve. Për 128 bits siguri kundër përplasjeve (collisions) ju duhet një hash me të paktën 256 bits.',
  's4.speed': 'Shpejtësia e sulmuesit',
  's4.speed.cpu': 'Një bërthamë CPU',
  's4.speed.gpu': 'Një GPU',
  's4.speed.cluster': 'Grup GPU-sh',
  's4.speed.state': 'Fuqi hipotetike',
  's4.th.fn': 'Funksioni',
  's4.th.out': 'Dalja',
  's4.th.res': 'Rezistenca ndaj përplasjeve',
  's4.th.time': 'Koha e sulmit gjenerik',
  's4.th.known': 'Sulme të njohura',
  's4.bits': '{bits} bite',
  's4.broken': 'I thyer',
  's4.secure': 'I sigurt',
  's4.known.md5':
    'Përplasja (collision) e parë u publikua më 2004 (Wang et al.); sot gjendet brenda sekondash në një laptop. Një përplasje (collision) me parashtesë të zgjedhur u përdor për të falsifikuar një certifikatë nënshkrimi kodi të Microsoft-it për malware-in Flame (2012).',
  's4.known.sha1':
    'SHAttered (2017): përplasja (collision) e parë publike, rreth 2^{63} llogaritje SHA-1. Përplasje (collision) me parashtesë të zgjedhur “SHA-1 is a Shambles” (2020).',
  's4.known.none': 'Asgjë më e mirë se sulmi gjenerik i ditëlindjes.',
  's4.timeNote':
    'Koha për të arritur 50% gjasa me një sulm gjenerik të ditëlindjes. Për krahasim, universi është rreth 1,4 × 10^{10} vjeç.',
  's4.cards.title': 'Ku tjetër shfaqet kufiri i ditëlindjes',
  's4.card.sig.title': 'Nënshkrimet digjitale',
  's4.card.sig':
    'Nënshkrimi digjital përdor vlerën hash të dokumentit për të krijuar nënshkrimin. Një përplasje (collision) i lejon sulmuesit të zëvendësojë një dokument me një tjetër pa e prishur nënshkrimin. Shihni hapin 6.',
  's4.card.sweet32.title': 'Sweet32 (2016)',
  's4.card.sweet32':
    'Shifrat me blloqe 64-bitëshe si 3DES dhe Blowfish fillojnë të prodhojnë blloqe të përsëritura pas rreth 2^{32} blloqeve (≈ 32 GB) me të njëjtin çelës. Studiuesit e shfrytëzuan këtë për të nxjerrë cookie sekrete nga trafiku HTTPS.',
  's4.card.gcm.title': 'Nonce-t në AES-GCM',
  's4.card.gcm':
    'Duke përdorur vlera të rastësishme 96-bitëshe, të cilat synohen të përdoren vetëm një herë, NIST SP 800-38D e kufizon një çelës në 2^{32} mesazhe, që gjasat për një këtë të përsëritur të mbeten të papërfillshme. Një përsëritje e vetme e thyen autentikimin e GCM-së.',
  's4.card.uuid.title': 'Identifikuesit e rastësishëm',
  's4.card.uuid':
    'Një UUID i rastësishëm (versioni 4) ka 122 bits të rastësishme. Do t’ju duheshin rreth 2,7 × 10^{18} të tillë për 50% gjasa që të ketë një dublikatë.',

  /* ---------------------------------- 5 ---------------------------------- */
  's5.title': 'Sulmi i Yuval-it: falsifikimi i një nënshkrimi',
  's5.intro':
    'Më 1979, Gideon Yuval tregoi se si paradoksi i ditëlindjes i thyen nënshkrimet digjitale. Mallory dëshiron që Alice të nënshkruajë një kontratë të ndershme, e pastaj të paraqesë një kontratë mashtruese me të njëjtin nënshkrim.',
  's5.step1':
    'Mallory shkruan shumë variante të padëmshme të kontratës **së ndershme**: “do të” ose “duhet të”, një hapësirë ose dy. Çdo variant ka të njëjtin kuptim, por secili ka hash tjetër.',
  's5.step2':
    'Bën të njëjtën gjë me kontratën **mashtruese**, derisa një variant të ketë të njëjtin hash me ndonjë variant të ndershëm.',
  's5.step3': 'Alice e lexon kontratën e ndershme dhe nënshkruan hash-in e saj.',
  's5.step4':
    'Mallory ia bashkëngjit nënshkrimin e Alice-s kontratës mashtruese. Hash-i është i njëjtë, prandaj nënshkrimi verifikohet.',
  's5.why':
    'Secila kontratë këtu ka {choices} pika zgjedhjeje, pra 2^{{choices}} variante. Mallory-t i duhen vetëm rreth 2^{k/2} nga secila, jo 2^{k}.',
  's5.run': 'Kërko një çift që përputhet',
  's5.phase.fair': 'Duke llogaritur hash-et e varianteve të ndershme…',
  's5.phase.fraud': 'Duke llogaritur hash-et e varianteve mashtruese…',
  's5.fair': 'Kontrata e ndershme (Alice nënshkruan këtë)',
  's5.fraud': 'Kontrata mashtruese (Mallory paraqet këtë)',
  's5.variant': 'Varianti #{i}',
  's5.showInvisible': 'Shfaq ndryshimet e padukshme (hapësirat e dyfishta)',
  's5.legend': 'Fjalët e theksuara janë pika zgjedhjeje; ␣ shënon një hapësirë shtesë.',
  's5.result':
    'U gjet pas {fair} varianteve të ndershme + {fraud} mashtruese, për {time}. Për t’u përputhur me një kontratë *fikse* me brute force do të duheshin rreth {brute} variante.',
  's5.sigOk': 'Nënshkrimi i Alice-s verifikohet në të dy kontratat',
  's5.defense':
    '**Mbrojtja:** përdorni një hash me të paktën 256 bits dhe mos nënshkruani kurrë saktësisht atë që ka përgatitur dikush tjetër: shtoni diçka të paparashikueshme tuajën (p.sh. një vlerë të rastësishme) para nënshkrimit. Kjo ia prish Mallory-t tabelën e parallogaritur.',
  's5.placeholder': 'Shtypni butonin që Mallory të kërkojë një çift kontratash që përputhen.',

  's1.live': '**Provojeni me një dhomë të vërtetë:** klasa i dërgon ditëlindjet nga telefoni dhe projektori e tregon kalendarin duke u mbushur live.',
  's1.live.open': 'Hap modalitetin live →',

  /* ------------------------------- live mode ------------------------------ */
  'live.title': 'Klasa live',
  'live.back': 'Kthehu te aplikacioni',
  'live.room': 'Dhoma {room}',
  'live.newRoom': 'Dhomë e re',
  'live.status.connecting': 'Duke u lidhur…',
  'live.status.live': 'Live',
  'live.status.error': 'Lidhja u ndërpre, po rilidhet…',
  'live.scan': 'Skanoni dhe dërgoni ditëlindjen tuaj',
  'live.students': 'studentë deri tani',
  'live.theory': 'Teoria, e rillogaritur me çdo ditëlindje të re',
  'live.tile.n': 'Studentë n',
  'live.tile.pairs': 'Çifte për t’u krahasuar',
  'live.tile.p': 'Gjasat për një ditëlindje të përbashkët',
  'live.formulaWait': 'Formula shfaqet sapo dy studentë të dërgojnë ditëlindjen.',
  'live.expected':
    'Çifte që priten të përputhen: {pairs} çifte × 1/365 = **{expected}**. Të vëzhguara në këtë dhomë: **{observed}**.',
  'live.waiting': 'Duke pritur ditëlindjen e parë…',
  'live.noMatch': 'Ende asnjë ditëlindje e përbashkët.',
  'live.match': 'Përputhje! Studentët {people} kanë lindur të gjithë më **{date}**.',
  'live.manual': 'Shto me dorë:',
  'live.add': 'Shto',
  'live.close': 'Mbyll votimin',
  'live.reopen': 'Rihap votimin',
  'live.closed': 'Votimi është mbyllur: rezultati është i ngrirë.',
  'live.late': '{n} përgjigje të mëvonshme nuk numërohen.',
  'live.localNote': 'Ky projektor po punon lokalisht, prandaj kodi QR hap faqen e publikuar. Votat vijnë në këtë ekran gjithsesi.',

  'vote.title': 'Kur e keni ditëlindjen?',
  'vote.privacy': 'Dërgohet vetëm dita dhe muaji, pa emër. Askush nuk e sheh kush çka ka dërguar.',
  'vote.month': 'Muaji',
  'vote.day': 'Dita',
  'vote.feb29': 'Keni lindur më 29 shkurt? Zgjidhni 28 shkurt (modeli përdor një vit me 365 ditë).',
  'vote.send': 'Dërgo',
  'vote.sending': 'Duke dërguar…',
  'vote.retrying': 'Shumë telefona po dërgojnë njëkohësisht. Po provojmë përsëri…',
  'vote.sent': 'U dërgua: **{date}**.',
  'vote.look': 'Tani shikoni projektorin.',
  'vote.change': 'Ndrysho përgjigjen',
  'vote.error': 'Dërgimi dështoi. Kontrolloni internetin dhe provoni përsëri.',

  /* ------------------------------ structure ------------------------------ */
  'nav.why': 'Pse hash',
  'nav.hash': 'Funksioni hash',
  'nav.summary': 'Përmbledhje',
  'nav.live': 'Live',
  'app.live': 'Demonstrim live në klasë',

  /* ---------------------------------- 5.1 --------------------------------- */
  'why.title': 'Pse na duhen funksionet hash?',
  'why.intro':
    'Nënshkrimi digjital është i ngadalshëm dhe punon me një hyrje të shkurtër me gjatësi fikse. Prandaj nuk e nënshkruajmë kurrë vetë dokumentin, por **hash-in** e tij, një gjurmë të shkurtër të dokumentit. Kushdo mund ta rillogarisë hash-in dhe ta verifikojë nënshkrimin.',
  'why.doc': 'Kontratë: Alice i paguan Bob-it 100 € deri më 1 mars.',
  'why.docLabel': 'Dokumenti (me çfarëdo gjatësie)',
  'why.bytes': '{n} byte',
  'why.digest': 'Hash-i i tij (gjithmonë me të njëjtën gjatësi)',
  'why.signVerb': 'nënshkruaj',
  'why.sign': 'Nënshkrimi',
  'why.signNote': 'Alice nënshkruan vetëm këta 32 byte.',
  'why.tryIt': 'Ndryshoni dokumentin: hash-i ndryshon krejtësisht, por mbetet 32 bajt.',
  'why.callout':
    'Kurthi: nënshkrimi i takon **hash-it**, jo tekstit. Nëse dy dokumente të ndryshme do të kishin të njëjtin hash, nënshkrimi i njërit do të vlente edhe për tjetrin. Hapat 3–6 tregojnë sa punë duhet për të gjetur një çift të tillë.',

  /* ---------------------------------- 5.2 --------------------------------- */
  'hash.title': 'Çka është një funksion hash kriptografik?',
  'hash.intro':
    'Funksioni hash h(x) e shndërron një hyrje me çfarëdo gjatësie në një dalje me gjatësi fikse. Një hash **kriptografik** duhet gjithashtu të jetë praktikisht i pamundur për t’u kthyer mbrapsht ose për të gjetur dy hyrje me të njëjtën dalje. Provojeni me SHA-256 të vërtetë:',
  'hash.lab': 'Ndryshoni një shkronjë dhe krahasoni hash-et',
  'hash.a': 'Mesazhi A',
  'hash.b': 'Mesazhi B',
  'hash.defaultA': 'Alice i paguan Bob-it 100 €',
  'hash.defaultB': 'Alice i paguan Bob-it 900 €',
  'hash.changed':
    'bits ndryshojnë ({pct}). Një ndryshim i vogël në hyrje i ndryshon rreth gjysmën e bitave të daljes. Ky është **efekti i ortekut**: hyrje të ngjashme japin hash-e krejt të ndryshme.',
  'hash.props.title': 'Pesë vetitë',
  'hash.p.compress.name': '**Kompresimi**',
  'hash.p.compress.desc': 'Çdo gjatësi e hyrjes jep një dalje me n bits (këtu n = 256).',
  'hash.p.efficient.name': '**Efikasiteti**',
  'hash.p.efficient.desc': 'Llogaritet shpejt: shfletuesi juaj sapo llogariti rreth **{rate}** hash-e SHA-256 në sekondë.',
  'hash.p.oneway.name': '**Njëkahshmëria** (rezistenca ndaj paraimazhit)',
  'hash.p.oneway.desc': 'Për një hash y të dhënë, është e pamundur të gjendet ndonjë x me h(x) = y.',
  'hash.p.weak.name': '**Rezistenca e dobët ndaj përplasjeve**',
  'hash.p.weak.desc': 'Për një x të dhënë, është e pamundur të gjendet një x′ tjetër me h(x′) = h(x).',
  'hash.p.strong.name': '**Rezistenca e fortë ndaj përplasjeve**',
  'hash.p.strong.desc': 'Është e pamundur të gjenden **çfarëdo** dy x ≠ x′ me h(x) = h(x′). Kërkon vetëm gjysmën e biteve të punës, për shkak të problemit të ditëlindjes.',
  'hash.work': 'Sulmi gjenerik:',
  'hash.toParadox': 'Pse rezistenca e fortë ndaj përplasjeve kushton vetëm 2^{n/2} dhe jo 2^{n}? Ky është problemi i ditëlindjes.',
  'hash.toParadox.link': 'Hapi 3 →',

  /* -------------------------------- summary ------------------------------- */
  'sum.title': 'Përmbledhje: përgjigjet në një vend',
  'sum.q.calc': 'Çka llogarit aplikacioni?',
  'sum.a.calc':
    'Probabilitetin e saktë 1 − (365/365)(364/365)…, përafrimin 1 − e^{−n²/2N}, punën për një përplasje (≈ 1,18·√N) dhe për një paraimazh (≈ 0,69·N), dhe ekzekuton sulme reale mbi SHA-256 për t’i matur ato.',
  'sum.q.logic': 'Pse quhet “paradoks”?',
  'sum.a.logic':
    'Ne numërojmë njerëz, por përputhjet ndodhin mes **çifteve**. 23 njerëz formojnë 253 çifte, prandaj një ditëlindje e përbashkët është tashmë më e mundshme se jo. Në përgjithësi një përsëritje shfaqet pas rreth √N tërheqjeve, jo N.',
  'sum.q.hash': 'Pse ka rëndësi për hash-et?',
  'sum.a.hash':
    'Nënshkrimi bëhet mbi hash-in, prandaj një përplasje e lejon një nënshkrim të vlejë për dy dokumente. Një hash me N = 2^{n} dalje është një “vit” me 2^{n} ditë: për një përplasje mjaftojnë rreth 2^{n/2} hash-e.',
  'sum.q.security': 'Si ndikon në siguri?',
  'sum.a.security':
    'Një hash n-bitësh jep të shumtën **n/2 bite** rezistencë ndaj përplasjeve. MD5 (64) dhe SHA-1 (80) janë të thyer; përdorni SHA-256 ose më të madh (128+). Sulmi i ditëlindjes (Yuval) e kthen një përplasje në një nënshkrim të falsifikuar.',
  'quiz.title': 'Kontrolloni veten',
  'quiz.1.q': 'Afërsisht sa hash-e i duhen një sulmi të ditëlindjes ndaj një hash-i 64-bitësh?',
  'quiz.1.a': '2^{64}',
  'quiz.1.b': '2^{32}',
  'quiz.1.c': '64 × 365',
  'quiz.1.why': 'Një përplasje kërkon rreth √N = √(2^{64}) = 2^{32} hash-e.',
  'quiz.2.q': 'Sa bits rezistencë ndaj përplasjeve jep SHA-256?',
  'quiz.2.a': '128',
  'quiz.2.b': '256',
  'quiz.2.c': '64',
  'quiz.2.why': 'n/2 = 256/2 = 128 bits.',
  'quiz.3.q': 'Cila është më e lehtë për sulmuesin?',
  'quiz.3.a': 'Të gjejë një mesazh me një hash të dhënë',
  'quiz.3.b': 'Të dyja kërkojnë të njëjtën punë',
  'quiz.3.c': 'Të gjejë çfarëdo dy mesazhe me të njëjtin hash',
  'quiz.3.why': 'Çdo çift mund të përputhet, dhe numri i çifteve rritet si n²: punë 2^{n/2} në vend të 2^{n}.',
  'quiz.right': 'Saktë!',
  'quiz.wrong': 'Jo tamam.',
  'quiz.retry': 'Provo përsëri',

  /* --------------------------------- website -------------------------------- */
  'hero.eyebrow': 'Siguria e Informacionit',
  'hero.people': 'njerëz në dhomë',
  'hero.caption': 'Ditëlindje të rastit, njëra pas tjetrës…',
  'hero.match': '**Përputhje!** Dy njerëz kanë të njëjtën ditëlindje pas vetëm **{n}** njerëzve.',
  'footer.tagline': 'Një udhëzues interaktiv për paradoksin e ditëlindjes dhe pse ai përcakton gjatësinë e çdo hash-i kriptografik.',
  'footer.steps': 'Hapat',

  /* ------------------------------ attack visuals ----------------------------- */
  'duel.title': 'Shikojeni: një vit me 2^{{k}} ditë',
  'duel.desc':
    'Çdo katror është një vlerë e mundshme e hash-it, si një ditë e vitit: këtu janë **{N}** (k = {k} bite). Çdo hash i vërtetë SHA-256 bie në katrorin e vet. Të njëjtët katrorë, dy pyetje të ndryshme:',
  'duel.start': 'Nis të dy sulmet',
  'duel.again': 'Provo përsëri',
  'duel.collision': 'Sulmi i ditëlindjes',
  'duel.collision.q': 'Ndalet kur ÇFARËDO katrori goditet dy herë.',
  'duel.preimage': 'Sulmi i paraimazhit',
  'duel.preimage.q': 'Ndalet vetëm kur goditet katrori i kuq objektiv {h}.',
  'duel.found': 'U gjet',
  'duel.hashes': 'hash-e',
  'duel.collision.found': '`{a}` dhe `{b}` bien të dy në katrorin **{h}**.',
  'duel.preimage.found': '`{b}` më në fund e godet objektivin **{h}**.',
  'duel.hint': 'Shikoni rrjetën majtas: një përsëritje del shumë më herët se sa rrjeta djathtas ta godasë objektivin e vetëm.',
  'duel.waiting': '**Përplasje pas {c} hash-eve.** Sulmi i paraimazhit ende po gjuan…',
  'duel.verdict':
    'Përplasje pas **{c}** hash-eve, paraimazh pas **{p}**: rreth **{x}×** më shumë punë. Me 256 bits në vend të {k}, ky hendek është 2^{128} kundrejt 2^{256}.',
  'duel.lucky':
    'Përplasje pas **{c}** hash-eve, paraimazh pas vetëm **{p}**: këtë herë paraimazhi pati fat. Mesatarisht i duhen rreth **{ep}** hash-e, përplasjes vetëm rreth **{ec}**. Provojeni përsëri!',
  's3.real.title': 'Tani me shpejtësi të plotë',
  's3.real.desc': 'Të njëjtat dy sulme pa animacion, në një worker në sfond, për k shumë më të mëdha.',
  's5.sameHash': 'hash i njëjtë',
  's5.stamp.valid': 'Nënshkrim i vlefshëm',

  /* -------------------------------- footer -------------------------------- */
  'footer.course': 'Siguria e Informacionit · Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike (FIEK), Universiteti i Prishtinës',
  'footer.authors': 'Autorët',
  'footer.refs': 'Referenca',
  'footer.source': 'Kodi burimor',
  'footer.ai': 'Co-Authored-By: Claude Opus 5.5 (Anthropic)',

  /* --------------------------------- units -------------------------------- */
  'unit.ms': 'ms',
  'unit.s': 's',
  'unit.min': 'min',
  'unit.h': 'orë',
  'unit.d': 'ditë',
  'unit.y': 'vjet',
  'unit.instant': 'menjëherë',
};
