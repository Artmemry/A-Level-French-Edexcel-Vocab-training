// Laboratoire de polysémie — curated sense data.
// kind "poly"    : one French word, several senses  → drill: context → choose English gloss.
// kind "contrast": one English word, several French → drill: gap sentence → choose French word.
// ctx: the target form is wrapped in «guillemets»; the engine gaps or highlights it.
// All sentences are original. Extend freely — the engine reads whatever is here.
window.POLYSEMY = [

// ─── FR polysemy ───
{id:"P01", kind:"poly", head:"le beau-père", theme:"U1", senses:[
 {fr:"le beau-père", en:"stepfather", ctx:"Après le remariage de ma mère, mon «beau-père» a emménagé chez nous.", tag:"famille recomposée"},
 {fr:"le beau-père", en:"father-in-law", ctx:"Mon «beau-père», c'est-à-dire le père de mon mari, nous invite chaque dimanche.", tag:"belle-famille"}],
 note:"Même piège pour la belle-mère : stepmother OU mother-in-law."},

{id:"P02", kind:"poly", head:"le temps", theme:"Y12", senses:[
 {fr:"le temps", en:"time", ctx:"Je n'ai pas le «temps» de réviser ce soir.", tag:"durée"},
 {fr:"le temps", en:"weather", ctx:"Quel «temps» fait-il à Marseille en août ?", tag:"météo"},
 {fr:"le temps", en:"tense (grammar)", ctx:"Conjuguez ce verbe au «temps» qui convient.", tag:"grammaire"}]},

{id:"P03", kind:"poly", head:"voler", theme:"U9", senses:[
 {fr:"voler", en:"to steal", ctx:"On lui a «volé» son portable dans le métro.", tag:"délit"},
 {fr:"voler", en:"to fly", ctx:"L'avion «vole» au-dessus des Alpes.", tag:"mouvement"}]},

{id:"P04", kind:"poly", head:"tourner", theme:"HAI", senses:[
 {fr:"tourner", en:"to shoot, to film", ctx:"Kassovitz a «tourné» La Haine en noir et blanc.", tag:"cinéma"},
 {fr:"tourner", en:"to turn", ctx:"«Tournez» à droite après la mairie.", tag:"mouvement"},
 {fr:"mal tourner", en:"to go wrong", ctx:"Sans dialogue, la situation risque de «mal tourner».", tag:"figuré"}]},

{id:"P05", kind:"poly", head:"tirer", theme:"HAI", senses:[
 {fr:"tirer", en:"to shoot (a weapon)", ctx:"Le policier a «tiré» en l'air pour disperser la foule.", tag:"arme"},
 {fr:"tirer", en:"to pull", ctx:"«Tire» la porte, elle est lourde.", tag:"mouvement"},
 {fr:"tirer profit de", en:"to benefit from", ctx:"Elle «tire profit de» chaque cours de révision.", tag:"figuré"}]},

{id:"P06", kind:"poly", head:"le plan", theme:"HAI", senses:[
 {fr:"le plan", en:"shot (cinema)", ctx:"Le premier «plan» du film montre la Terre vue du ciel.", tag:"cinéma"},
 {fr:"le plan", en:"plan, scheme", ctx:"Le gouvernement a annoncé un «plan» contre le chômage des jeunes.", tag:"politique"}]},

{id:"P07", kind:"poly", head:"la note", theme:"U2", senses:[
 {fr:"la note", en:"mark, grade", ctx:"Elle a obtenu une excellente «note» au bac blanc.", tag:"école"},
 {fr:"la note", en:"note (music)", ctx:"La dernière «note» de la chanson dure dix secondes.", tag:"musique"},
 {fr:"la note", en:"bill (restaurant)", ctx:"Le serveur nous apporte la «note» à la fin du repas.", tag:"restaurant"}]},

{id:"P08", kind:"poly", head:"le cours", theme:"U2", senses:[
 {fr:"le cours", en:"lesson, class", ctx:"Le «cours» de français commence à neuf heures.", tag:"école"},
 {fr:"le cours", en:"rate, price (currency)", ctx:"Le «cours» de l'euro a baissé face au dollar.", tag:"économie"}]},

{id:"P09", kind:"poly", head:"la carrière", theme:"U3", senses:[
 {fr:"la carrière", en:"career", ctx:"Elle a fait «carrière» dans le journalisme.", tag:"travail"},
 {fr:"la carrière", en:"quarry", ctx:"On extrait la pierre de cette «carrière» depuis un siècle.", tag:"industrie"}]},

{id:"P10", kind:"poly", head:"le régime", theme:"U11", senses:[
 {fr:"le régime", en:"regime (political)", ctx:"Le «régime» de Vichy a collaboré avec l'occupant.", tag:"histoire"},
 {fr:"le régime", en:"diet", ctx:"Ce «régime» sans sucre est difficile à suivre.", tag:"santé"}]},

{id:"P11", kind:"poly", head:"la chaîne", theme:"U5", senses:[
 {fr:"la chaîne", en:"channel (TV)", ctx:"Cette «chaîne» diffuse le journal à vingt heures.", tag:"médias"},
 {fr:"la chaîne", en:"chain", ctx:"Il porte une «chaîne» en argent autour du cou.", tag:"objet"},
 {fr:"à la chaîne", en:"on the assembly line", ctx:"Ils travaillent «à la chaîne» dans l'usine automobile.", tag:"travail"}]},

{id:"P12", kind:"poly", head:"l'émission", theme:"U5", senses:[
 {fr:"l'émission", en:"programme, broadcast", ctx:"Mon «émission» préférée passe le samedi soir.", tag:"médias"},
 {fr:"l'émission", en:"emission", ctx:"Les «émissions» de CO2 ont diminué depuis 2020.", tag:"environnement"}]},

{id:"P13", kind:"poly", head:"le cadre", theme:"U3", senses:[
 {fr:"le cadre", en:"executive, manager", ctx:"Elle est «cadre» dans une grande entreprise parisienne.", tag:"travail"},
 {fr:"dans le cadre de", en:"within the framework of", ctx:"«Dans le cadre du» cours, nous étudierons Camus.", tag:"formel"},
 {fr:"le cadre", en:"frame (picture)", ctx:"Le «cadre» de la photo est doré.", tag:"objet"}]},

{id:"P14", kind:"poly", head:"propre", theme:"Y12", senses:[
 {fr:"propre (avant le nom)", en:"own", ctx:"Il a enfin sa «propre» chambre.", tag:"position : avant"},
 {fr:"propre (après le nom)", en:"clean", ctx:"Cette chambre est vraiment «propre».", tag:"position : après"}],
 note:"La position de l'adjectif change le sens."},

{id:"P15", kind:"poly", head:"ancien", theme:"Y12", senses:[
 {fr:"ancien (avant le nom)", en:"former", ctx:"Mon «ancien» professeur est devenu proviseur.", tag:"position : avant"},
 {fr:"ancien (après le nom)", en:"old, ancient", ctx:"Ce quartier «ancien» date du Moyen Âge.", tag:"position : après"}]},

{id:"P16", kind:"poly", head:"toucher", theme:"U3", senses:[
 {fr:"toucher", en:"to receive, to earn (money)", ctx:"Elle «touche» un bon salaire depuis sa promotion.", tag:"argent"},
 {fr:"toucher", en:"to touch", ctx:"Ne «touche» pas au tableau, la peinture est fraîche !", tag:"physique"},
 {fr:"toucher", en:"to affect", ctx:"La crise «touche» surtout les jeunes des quartiers défavorisés.", tag:"figuré"}]},

{id:"P17", kind:"poly", head:"gagner", theme:"U3", senses:[
 {fr:"gagner", en:"to earn", ctx:"Il «gagne» le SMIC dans son premier emploi.", tag:"argent"},
 {fr:"gagner", en:"to win", ctx:"Notre équipe a «gagné» le match trois à zéro.", tag:"compétition"},
 {fr:"gagner", en:"to reach (a place)", ctx:"Les résistants ont «gagné» la zone libre pendant la nuit.", tag:"mouvement"}]},

{id:"P18", kind:"poly", head:"défendre", theme:"U9", senses:[
 {fr:"défendre", en:"to defend", ctx:"L'avocat «défend» l'accusé devant le tribunal.", tag:"justice"},
 {fr:"défendre (il est défendu de)", en:"to forbid", ctx:"Il est «défendu» de fumer dans l'enceinte du lycée.", tag:"interdiction"}]},

{id:"P19", kind:"poly", head:"l'expérience", theme:"U3", senses:[
 {fr:"l'expérience", en:"experience", ctx:"Elle a dix ans d'«expérience» dans la vente.", tag:"travail"},
 {fr:"l'expérience", en:"experiment", ctx:"Nous faisons une «expérience» en cours de chimie.", tag:"sciences"}]},

{id:"P20", kind:"poly", head:"la manifestation", theme:"U3", senses:[
 {fr:"la manifestation", en:"protest, demonstration", ctx:"La «manifestation» contre la réforme a réuni des milliers de personnes.", tag:"politique"},
 {fr:"la manifestation", en:"event", ctx:"Ce festival est une «manifestation» culturelle majeure de l'été.", tag:"culture"}]},

{id:"P21", kind:"poly", head:"le bureau", theme:"U3", senses:[
 {fr:"le bureau", en:"desk", ctx:"Il pose ses dossiers sur son «bureau» avant la réunion.", tag:"meuble"},
 {fr:"le bureau", en:"office", ctx:"Elle arrive au «bureau» à huit heures tous les matins.", tag:"lieu"}]},

{id:"P22", kind:"poly", head:"la pièce", theme:"U6", senses:[
 {fr:"la pièce", en:"play (theatre)", ctx:"Nous avons étudié une «pièce» de Molière en classe.", tag:"théâtre"},
 {fr:"la pièce", en:"room", ctx:"Mon appartement a trois «pièces» et un balcon.", tag:"logement"},
 {fr:"la pièce", en:"coin", ctx:"Il ne me reste qu'une «pièce» de deux euros.", tag:"argent"}]},

{id:"P23", kind:"poly", head:"le poste / la poste", theme:"U3", senses:[
 {fr:"le poste", en:"job, position", ctx:"Il a obtenu un «poste» de professeur dans le nord.", tag:"masculin — travail"},
 {fr:"le poste (de police)", en:"police station", ctx:"Les policiers l'ont emmené au «poste» pour l'interroger.", tag:"masculin — police"},
 {fr:"la poste", en:"post office", ctx:"Je passe à la «poste» pour envoyer un colis.", tag:"féminin — courrier"}],
 note:"Le genre change le sens : LE poste ≠ LA poste."},

{id:"P24", kind:"poly", head:"la direction", theme:"U3", senses:[
 {fr:"la direction", en:"management", ctx:"La «direction» du lycée a pris une décision impopulaire.", tag:"travail"},
 {fr:"la direction", en:"direction (way)", ctx:"Dans quelle «direction» se trouve la gare ?", tag:"orientation"}]},

{id:"P25", kind:"poly", head:"la réalisation", theme:"HAI", senses:[
 {fr:"la réalisation", en:"directing (film)", ctx:"La «réalisation» du film a demandé deux ans de travail.", tag:"cinéma"},
 {fr:"la réalisation", en:"achievement, fulfilment", ctx:"Ce diplôme représente la «réalisation» d'un rêve d'enfance.", tag:"figuré"}]},

{id:"P26", kind:"poly", head:"le genre", theme:"U4", senses:[
 {fr:"le genre", en:"genre (music, film)", ctx:"Le rap est un «genre» musical né aux États-Unis.", tag:"musique"},
 {fr:"le genre", en:"kind, sort", ctx:"Ce «genre» de comportement est inacceptable en classe.", tag:"général"},
 {fr:"le genre", en:"gender", ctx:"L'égalité des «genres» au travail reste un défi.", tag:"société"}]},

{id:"P27", kind:"poly", head:"la scène", theme:"U4", senses:[
 {fr:"la scène", en:"stage", ctx:"La chanteuse monte sur «scène» à vingt et une heures.", tag:"concert"},
 {fr:"la scène", en:"scene (film)", ctx:"La dernière «scène» du film se passe sur un toit.", tag:"cinéma"}]},

{id:"P28", kind:"poly", head:"le succès", theme:"U4", senses:[
 {fr:"le succès", en:"success", ctx:"Le «succès» scolaire dépend de nombreux facteurs.", tag:"abstrait"},
 {fr:"le succès", en:"hit (song)", ctx:"Cette chanson est un «succès» des années quatre-vingt.", tag:"musique"}]},

{id:"P29", kind:"poly", head:"le droit", theme:"U9", senses:[
 {fr:"le droit", en:"right (entitlement)", ctx:"Tout citoyen a le «droit» de vote à dix-huit ans.", tag:"citoyenneté"},
 {fr:"le droit", en:"law (subject)", ctx:"Elle fait des études de «droit» à la Sorbonne.", tag:"études"},
 {fr:"droit (adverbe)", en:"straight", ctx:"Continuez tout «droit» jusqu'au carrefour.", tag:"orientation"}]},

{id:"P30", kind:"poly", head:"la peine", theme:"ETR", senses:[
 {fr:"la peine", en:"sentence (legal)", ctx:"Le tribunal a prononcé une «peine» de dix ans de prison.", tag:"justice"},
 {fr:"la peine", en:"sorrow, grief", ctx:"Sa mort m'a fait beaucoup de «peine».", tag:"émotion"},
 {fr:"à peine", en:"hardly, barely", ctx:"Meursault écoute «à peine» son propre avocat.", tag:"adverbe"}]},

{id:"P31", kind:"poly", head:"l'histoire", theme:"U10", senses:[
 {fr:"l'histoire", en:"history", ctx:"Nous étudions l'«histoire» de l'Occupation en terminale.", tag:"discipline"},
 {fr:"l'histoire", en:"story", ctx:"Grand-mère raconte une «histoire» aux enfants chaque soir.", tag:"récit"}]},

{id:"P32", kind:"poly", head:"la politique", theme:"U9", senses:[
 {fr:"la politique", en:"politics", ctx:"La «politique» l'intéresse depuis le lycée.", tag:"domaine"},
 {fr:"la politique", en:"policy", ctx:"Le gouvernement mène une «politique» d'immigration plus stricte.", tag:"mesures"}]},

{id:"P33", kind:"poly", head:"le pouvoir", theme:"U9", senses:[
 {fr:"le pouvoir", en:"power", ctx:"Le «pouvoir» exécutif appartient au président.", tag:"nom"},
 {fr:"pouvoir", en:"to be able to, can", ctx:"Nous «pouvons» réviser ensemble ce week-end.", tag:"verbe"}]},

{id:"P34", kind:"poly", head:"marcher", theme:"Y12", senses:[
 {fr:"marcher", en:"to walk", ctx:"Nous «marchons» jusqu'au lycée quand il fait beau.", tag:"mouvement"},
 {fr:"marcher", en:"to work, to function", ctx:"Mon ordinateur ne «marche» plus depuis la mise à jour.", tag:"machine"}]},

{id:"P35", kind:"poly", head:"la marche", theme:"U9", senses:[
 {fr:"la marche", en:"march (protest)", ctx:"La «marche» pour le climat a lieu samedi à Lyon.", tag:"politique"},
 {fr:"la marche", en:"step (stairs)", ctx:"Attention à la dernière «marche», elle est cassée.", tag:"escalier"}]},

{id:"P36", kind:"poly", head:"arrêter", theme:"U10", senses:[
 {fr:"arrêter", en:"to arrest", ctx:"La Gestapo a «arrêté» des résistants à l'aube.", tag:"police"},
 {fr:"arrêter", en:"to stop", ctx:"«Arrête» de parler pendant le contrôle !", tag:"cessation"}]},

{id:"P37", kind:"poly", head:"le milieu", theme:"U8", senses:[
 {fr:"le milieu", en:"background, environment (social)", ctx:"Il vient d'un «milieu» modeste et a réussi ses études.", tag:"société"},
 {fr:"le milieu", en:"middle", ctx:"La table est au «milieu» de la salle.", tag:"position"}]},

{id:"P38", kind:"poly", head:"la langue", theme:"U7", senses:[
 {fr:"la langue", en:"language", ctx:"Elle parle trois «langues» couramment.", tag:"linguistique"},
 {fr:"la langue", en:"tongue", ctx:"Je me suis brûlé la «langue» avec le café.", tag:"corps"}]},

{id:"P39", kind:"poly", head:"le monde", theme:"U4", senses:[
 {fr:"le monde", en:"world", ctx:"Ce chanteur est connu dans le «monde» entier.", tag:"planète"},
 {fr:"du monde", en:"people, a crowd", ctx:"Il y a du «monde» au concert ce soir.", tag:"foule"}]},

{id:"P40", kind:"poly", head:"étranger", theme:"ETR", senses:[
 {fr:"à l'étranger", en:"abroad", ctx:"Elle travaille «à l'étranger» depuis deux ans.", tag:"lieu"},
 {fr:"un étranger", en:"foreigner, stranger, outsider", ctx:"Meursault reste un «étranger» à sa propre vie.", tag:"personne"}]},

{id:"P41", kind:"poly", head:"rendre", theme:"U10", senses:[
 {fr:"rendre", en:"to give back", ctx:"«Rends»-moi mon stylo, s'il te plaît.", tag:"objet"},
 {fr:"rendre + adjectif", en:"to make (someone) …", ctx:"Cette chanson me «rend» heureux.", tag:"émotion"},
 {fr:"se rendre", en:"to surrender", ctx:"L'armée française s'est «rendue» en juin 1940.", tag:"guerre"}]},

{id:"P42", kind:"poly", head:"l'occupation", theme:"U10", senses:[
 {fr:"l'Occupation", en:"the Occupation (1940–44)", ctx:"L'«Occupation» a duré quatre longues années.", tag:"histoire"},
 {fr:"l'occupation", en:"occupation, activity", ctx:"Sa principale «occupation» du dimanche est la lecture.", tag:"quotidien"}]},

{id:"P43", kind:"poly", head:"le réseau", theme:"U5", senses:[
 {fr:"les réseaux sociaux", en:"social networks", ctx:"Les «réseaux» sociaux influencent l'opinion des jeunes.", tag:"médias"},
 {fr:"le réseau (de résistance)", en:"network (Resistance)", ctx:"Jean Moulin a unifié les «réseaux» de résistance en 1943.", tag:"histoire"}]},

{id:"P44", kind:"poly", head:"sensible", theme:"HAI", senses:[
 {fr:"un quartier sensible", en:"deprived / troubled (area)", ctx:"Les médias parlent souvent des quartiers «sensibles».", tag:"banlieue"},
 {fr:"une personne sensible", en:"sensitive (person)", ctx:"C'est un garçon «sensible» qui pleure au cinéma.", tag:"caractère"}],
 note:"Faux ami : sensible ≠ sensible (anglais) = raisonnable."},

{id:"P45", kind:"poly", head:"entendre", theme:"U1", senses:[
 {fr:"entendre", en:"to hear", ctx:"J'«entends» de la musique chez les voisins.", tag:"ouïe"},
 {fr:"s'entendre avec", en:"to get on with", ctx:"Je m'«entends» très bien avec mon frère aîné.", tag:"relations"}]},

{id:"P46", kind:"poly", head:"servir", theme:"U3", senses:[
 {fr:"servir", en:"to serve", ctx:"Le serveur «sert» les clients en terrasse.", tag:"restaurant"},
 {fr:"se servir de", en:"to use", ctx:"Elle se «sert» d'un dictionnaire en ligne pour traduire.", tag:"outil"},
 {fr:"servir à", en:"to be used for", ctx:"À quoi «sert» cette application exactement ?", tag:"fonction"}]},

{id:"P47", kind:"poly", head:"la grève", theme:"U3", senses:[
 {fr:"la grève", en:"strike", ctx:"Les cheminots sont en «grève» depuis lundi.", tag:"travail"},
 {fr:"faire la grève de la faim", en:"hunger strike", ctx:"Les détenus ont fait la «grève» de la faim pendant une semaine.", tag:"protestation"}]},

{id:"P48", kind:"poly", head:"la voix / la voie", theme:"U9", senses:[
 {fr:"la voix", en:"voice", ctx:"La chanteuse a une «voix» exceptionnelle.", tag:"voix — chant"},
 {fr:"la voix", en:"vote", ctx:"Le candidat a obtenu la majorité des «voix».", tag:"voix — élection"},
 {fr:"la voie", en:"way, track, path", ctx:"Le train pour Paris part de la «voie» deux.", tag:"voie — chemin"}],
 note:"Homophones : voix / voie."},

{id:"P49", kind:"poly", head:"le parti / la partie", theme:"U9", senses:[
 {fr:"le parti", en:"(political) party", ctx:"Ce «parti» a remporté les élections législatives.", tag:"masculin"},
 {fr:"la partie", en:"part", ctx:"La première «partie» de l'examen dure une heure.", tag:"féminin"},
 {fr:"la partie", en:"game, match", ctx:"On fait une «partie» de cartes après le dîner ?", tag:"féminin — jeu"}],
 note:"Le genre distingue : LE parti ≠ LA partie."},

{id:"P50", kind:"poly", head:"la formation", theme:"U3", senses:[
 {fr:"la formation", en:"training", ctx:"Cette entreprise offre une «formation» de six mois aux apprentis.", tag:"travail"},
 {fr:"la formation", en:"formation, creation", ctx:"La «formation» du gouvernement a pris trois semaines.", tag:"politique"}]},

// ─── EN → FR contrast sets ───
{id:"C01", kind:"contrast", head:"time", theme:"Y12", senses:[
 {fr:"le temps", en:"time (duration)", ctx:"Je n'ai pas le «temps» de sortir ce soir.", tag:"durée"},
 {fr:"la fois", en:"time (occasion)", ctx:"C'est la troisième «fois» que je vois ce film.", tag:"occasion"},
 {fr:"l'heure", en:"time (clock)", ctx:"Tu as vu l'«heure» ? Il est déjà minuit !", tag:"horloge"}]},

{id:"C02", kind:"contrast", head:"to leave", theme:"Y12", senses:[
 {fr:"quitter", en:"to leave (a person/place — needs object)", ctx:"Elle a «quitté» son emploi au mois de mai.", tag:"+ objet"},
 {fr:"partir", en:"to leave, to depart", ctx:"Le train «part» à huit heures précises.", tag:"sans objet"},
 {fr:"laisser", en:"to leave (something) behind", ctx:"J'ai «laissé» mes clés à la maison.", tag:"objet oublié"},
 {fr:"sortir", en:"to go out", ctx:"On «sort» ensemble samedi soir ?", tag:"sortie"}]},

{id:"C03", kind:"contrast", head:"to return", theme:"Y12", senses:[
 {fr:"rentrer", en:"to return home", ctx:"Je «rentre» chez moi juste après les cours.", tag:"chez soi"},
 {fr:"retourner", en:"to go back (somewhere)", ctx:"Nous «retournons» à Paris l'été prochain.", tag:"y aller de nouveau"},
 {fr:"revenir", en:"to come back (here)", ctx:"«Reviens» vite, tu nous manques déjà.", tag:"vers ici"},
 {fr:"rendre", en:"to give back", ctx:"Il faut «rendre» ces livres à la bibliothèque.", tag:"restituer"}]},

{id:"C04", kind:"contrast", head:"to know", theme:"Y12", senses:[
 {fr:"savoir", en:"to know (facts, how to)", ctx:"Je «sais» conduire depuis l'année dernière.", tag:"savoir-faire"},
 {fr:"connaître", en:"to know (people, places)", ctx:"Je «connais» bien ce quartier de Marseille.", tag:"familiarité"}]},

{id:"C05", kind:"contrast", head:"to shoot", theme:"HAI", senses:[
 {fr:"tirer", en:"to shoot (a weapon)", ctx:"Le policier a «tiré» sans sommation.", tag:"arme"},
 {fr:"tourner", en:"to shoot (a film)", ctx:"On a «tourné» cette scène en une seule prise.", tag:"cinéma"},
 {fr:"fusiller", en:"to shoot (execute by firing squad)", ctx:"Les nazis ont «fusillé» des otages en représailles.", tag:"exécution"}]},

{id:"C06", kind:"contrast", head:"to play", theme:"U4", senses:[
 {fr:"jouer à", en:"to play (a sport/game)", ctx:"Il «joue au» tennis tous les samedis.", tag:"sport → à"},
 {fr:"jouer de", en:"to play (an instrument)", ctx:"Elle «joue du» piano depuis dix ans.", tag:"instrument → de"}]},

{id:"C07", kind:"contrast", head:"to miss", theme:"Y12", senses:[
 {fr:"rater", en:"to miss (bus, exam)", ctx:"J'ai «raté» le bus de sept heures et demie.", tag:"échec"},
 {fr:"manquer", en:"to miss (emotionally — inverted!)", ctx:"Tu me «manques» depuis ton départ.", tag:"syntaxe inversée"}]},

{id:"C08", kind:"contrast", head:"to visit", theme:"U6", senses:[
 {fr:"visiter", en:"to visit (a place)", ctx:"Nous avons «visité» le Louvre pendant le voyage scolaire.", tag:"lieu"},
 {fr:"rendre visite à", en:"to visit (a person)", ctx:"Je vais «rendre visite à» ma grand-mère dimanche.", tag:"personne"}]},

{id:"C09", kind:"contrast", head:"to take", theme:"Y12", senses:[
 {fr:"prendre", en:"to take (transport, an object)", ctx:"Je «prends» le métro chaque matin.", tag:"général"},
 {fr:"emmener", en:"to take (a person somewhere)", ctx:"Elle «emmène» son petit frère au cinéma.", tag:"personne"},
 {fr:"emporter", en:"to take (a thing) with you", ctx:"N'oublie pas d'«emporter» ton parapluie.", tag:"objet"}]},

{id:"C10", kind:"contrast", head:"to ask", theme:"U2", senses:[
 {fr:"poser (une question)", en:"to ask (a question)", ctx:"Elle «pose» une question au professeur.", tag:"question"},
 {fr:"demander", en:"to ask (for something)", ctx:"Il «demande» de l'aide à ses camarades.", tag:"requête"}]},

{id:"C11", kind:"contrast", head:"to support", theme:"U4", senses:[
 {fr:"soutenir", en:"to support (back, uphold)", ctx:"Je «soutiens» l'équipe de France depuis toujours.", tag:"appui"},
 {fr:"supporter", en:"to put up with (faux ami !)", ctx:"Je ne peux plus «supporter» ce bruit constant.", tag:"tolérer"}],
 note:"Supporter = tolérer, PAS soutenir."},

{id:"C12", kind:"contrast", head:"people", theme:"U8", senses:[
 {fr:"les gens", en:"people (in general)", ctx:"Les «gens» du quartier se connaissent tous.", tag:"général"},
 {fr:"le peuple", en:"the people (nation)", ctx:"Le «peuple» français a voté dimanche dernier.", tag:"nation"},
 {fr:"du monde", en:"people (a crowd)", ctx:"Il y a du «monde» dans le métro ce matin.", tag:"foule"},
 {fr:"les personnes", en:"people (counted individuals)", ctx:"Trois «personnes» ont été blessées dans l'accident.", tag:"comptable"}]},

{id:"C13", kind:"contrast", head:"year", theme:"Y12", senses:[
 {fr:"un an", en:"year (counting)", ctx:"Elle a dix-sept «ans» depuis mars.", tag:"nombre + an"},
 {fr:"une année", en:"year (duration, quality)", ctx:"Cette «année» scolaire est particulièrement difficile.", tag:"durée vécue"}]},

{id:"C14", kind:"contrast", head:"day", theme:"Y12", senses:[
 {fr:"un jour", en:"day (counting)", ctx:"Il reste dix «jours» avant les examens.", tag:"nombre + jour"},
 {fr:"une journée", en:"day (duration)", ctx:"Quelle «journée» épuisante au travail !", tag:"durée vécue"}]},

{id:"C15", kind:"contrast", head:"to live", theme:"U8", senses:[
 {fr:"habiter", en:"to live (reside)", ctx:"J'«habite» à Birmingham depuis ma naissance.", tag:"résidence"},
 {fr:"vivre", en:"to live (life, experience)", ctx:"Ils «vivent» ensemble depuis vingt ans.", tag:"existence"}]},

{id:"C16", kind:"contrast", head:"new", theme:"Y12", senses:[
 {fr:"neuf / neuve", en:"new (brand-new)", ctx:"Il a acheté une voiture «neuve» chez le concessionnaire.", tag:"jamais utilisé"},
 {fr:"nouveau / nouvelle", en:"new (new to you, different)", ctx:"J'ai un «nouveau» professeur de français cette année.", tag:"différent"}]},

{id:"C17", kind:"contrast", head:"to think", theme:"ESS", senses:[
 {fr:"penser à", en:"to think about/of", ctx:"Je «pense» souvent «à» mes grands-parents restés au pays.", tag:"penser à"},
 {fr:"penser de", en:"to think of (opinion)", ctx:"Que «penses»-tu «de» cette chanson engagée ?", tag:"opinion"},
 {fr:"réfléchir", en:"to think (reflect)", ctx:"«Réfléchis» bien avant de choisir tes options.", tag:"réflexion"}]},

{id:"C18", kind:"contrast", head:"to drive", theme:"Y12", senses:[
 {fr:"conduire", en:"to drive (a vehicle)", ctx:"Elle apprend à «conduire» avec son père.", tag:"conduite"},
 {fr:"rouler", en:"to drive along, to travel", ctx:"Nous «roulons» vers Lyon depuis deux heures.", tag:"trajet"}]},

{id:"C19", kind:"contrast", head:"story / history", theme:"U10", senses:[
 {fr:"l'histoire (discipline)", en:"history", ctx:"L'«histoire» de la Résistance fascine mes élèves.", tag:"passé"},
 {fr:"une histoire", en:"a story", ctx:"Il invente une «histoire» pour justifier son retard.", tag:"récit"}]},

{id:"C20", kind:"contrast", head:"wrong", theme:"ESS", senses:[
 {fr:"avoir tort", en:"to be wrong (person)", ctx:"Tu as «tort» de penser que c'est facile.", tag:"personne"},
 {fr:"faux / fausse", en:"wrong, false (thing)", ctx:"Cette réponse est «fausse», vérifie tes calculs.", tag:"chose"},
 {fr:"se tromper", en:"to make a mistake", ctx:"Je me suis «trompé» de salle ce matin.", tag:"erreur"}]}
];
