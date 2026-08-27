/* Le Lexique — couche de genre (gender layer)
   ─────────────────────────────────────────────────────────────────────
   Le corpus ne garde qu'une forme : « un employé ». Sans cette couche,
   l'élève qui écrit « une employée » est compté faux alors que sa
   réponse est juste.

   Cette couche ne modifie PAS les listes. app.js fabrique l'autre forme
   au moment de la correction, à partir des règles ci-dessous, et
   l'accepte. Ajouter un couple irrégulier ici l'active d'un coup dans
   tout le corpus.
   ───────────────────────────────────────────────────────────────────── */
window.GENERO = {
  arts: [["le","la"],["un","une"],["les","les"],["des","des"]],

  suffixes: [
    ["eur","euse"],   // un chanteur    → une chanteuse
    ["teur","trice"], // un acteur      → une actrice
    ["ier","ière"],   // un ouvrier     → une ouvrière
    ["er","ère"],     // un boulanger   → une boulangère
    ["ien","ienne"],  // un pharmacien  → une pharmacienne
    ["on","onne"],    // un patron      → une patronne
    ["at","atte"],
    ["el","elle"],    // professionnel  → professionnelle
    ["f","ve"],       // sportif        → sportive
    ["x","se"],       // heureux        → heureuse
    ["", "e"]         // un employé     → une employée
  ],

  invariable: ["iste","aire","able","ible","e","que","ste"],

  pairs: [
    ["homme","femme"],      ["mari","femme"],       ["père","mère"],
    ["parrain","marraine"], ["roi","reine"],        ["prince","princesse"],
    ["duc","duchesse"],     ["comte","comtesse"],   ["héros","héroïne"],
    ["neveu","nièce"],      ["gendre","belle-fille"],["copain","copine"],
    ["vieux","vieille"],    ["beau","belle"],       ["nouveau","nouvelle"],
    ["fou","folle"],        ["frais","fraîche"],    ["favori","favorite"],
    ["serviteur","servante"],["dieu","déesse"],     ["taureau","vache"]
  ],

  /* Mots que la règle transformerait à tort — « le livre » / « la livre »,
     « le tour » / « la tour ». Les deux membres sont bloqués. */
  excepciones: [
    ["livre","livre"],["tour","tour"],["poste","poste"],["mode","mode"],
    ["manche","manche"],["voile","voile"],["somme","somme"],["page","page"],
    ["vase","vase"],["moule","moule"],["critique","critique"],
    ["physique","physique"],["mémoire","mémoire"],["aide","aide"],
    ["garde","garde"],["solde","solde"],["œuvre","œuvre"],
    ["espace","espace"],["greffe","greffe"],["pendule","pendule"],
    ["poêle","poêle"],["mousse","mousse"],["crêpe","crêpe"],
    ["finale","finale"],["cours","course"],["part","part"],["pot","pote"],
    ["chat","chatte"],["son","sonne"],["don","donne"],["ton","tonne"],
    ["bon","bonne"],["salon","salonne"],["camion","camionne"],
    ["avion","avionne"],["ballon","ballonne"],["béton","bétonne"],
    ["coton","cotonne"],["citron","citronne"],["wagon","wagonne"],
    ["talon","talonne"],["préjugé","préjugée"],["projecteur","projecteuse"],
    ["moteur","moteuse"],["secteur","secteuse"],["facteur","facteuse"],
    ["ordinateur","ordinateuse"],["bonheur","bonheuse"],
    ["malheur","malheuse"],["honneur","honneuse"]
  ],

  stops: ["de","du","des","à","au","aux","en","avec","sans","par","pour","que","qui","et","ou","comme"]
};
