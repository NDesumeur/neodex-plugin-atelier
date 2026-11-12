# Atelier

L'environnement de développement intégré à NeoDex : écris des pages web, des scripts JavaScript ou Python et des plugins NeoDex, teste-les tout de suite, et prépare l'archive d'un plugin à publier, sans quitter l'appli.

*English version: [README.en.md](README.en.md)*

## Les projets

- La colonne de gauche liste tes **projets** et leurs fichiers, avec des dossiers. Crée, renomme ou supprime un fichier ; ouvre-en plusieurs dans des onglets.
- **Nouveau projet depuis un modèle** propose : Page web, Script JavaScript, Script Python, Projet vide, et cinq modèles de plugin : bonjour (le plus petit plugin possible), compteur (qui sauvegarde ses données), jeu canvas (une boucle de jeu 2D qui s'arrête quand on ferme l'onglet), widget d'accueil et notifications avec image.
- **Importer** ajoute des fichiers de ton PC au projet ; tu peux aussi les glisser sur la liste des fichiers.

## L'éditeur

- Coloration du HTML, du CSS, du JavaScript, du Python, du JSON et du Markdown, numéros de ligne, indentation automatique, parenthèses et guillemets fermés tout seuls.
- **Ctrl+F** cherche et remplace dans le fichier, **Ctrl+Maj+F** cherche dans tout le projet.
- **Ctrl+/** commente, **Ctrl+D** duplique la ligne, **Alt+↑/↓** la déplace, **Tab** indente.
- **Maj+Alt+F** formate le fichier (remet un JSON en forme, retire les espaces en trop).
- **Ctrl+P** ouvre un fichier ou lance une commande par son nom ; **Ctrl+=** et **Ctrl+-** changent la taille du texte.
- **Ctrl+S** enregistre.
- **Autocomplétion** pendant que tu tapes (ou **Ctrl+Espace**) : mots-clés, extraits (`for`, `def`, `html5`…), l'API de NeoDex (`ctx.folder.read`…) et les noms déjà écrits dans le projet.
- **Problèmes** signalés en tapant : parenthèses ou balises jamais fermées, JSON invalide, deux-points oubliés en Python… La ligne s'allume en rouge dans la marge, et la barre du bas les compte et les liste.
- **Ctrl+Maj+O** affiche le plan du fichier (fonctions, classes, règles CSS, titres), **Ctrl+G** va à une ligne, **F2** renomme un nom partout dans le fichier. La parenthèse qui correspond s'allume.
- **Ctrl+H** ouvre l'historique du fichier : une version est gardée à chaque Ctrl+S (15 au plus), à comparer au texte actuel et à restaurer.
- Les fichiers Markdown ont leur aperçu en direct.

## Ouvrir un dossier de ton PC

- **Ouvrir un dossier** : choisis un dossier dans la fenêtre de Windows. Ses fichiers s'affichent à gauche et s'enregistrent directement dessus (les dossiers `.git`, `node_modules`… sont ignorés).
- Supprimer un fichier le met à la **corbeille** de Windows. **Fermer le dossier** le retire de l'Atelier sans toucher à ses fichiers, et **↻** le relit.
- **Git** : la branche, les fichiers modifiés, la comparaison de chacun avec le dernier commit, et le commit avec ton message. Pour pousser ou tirer, tape `git push` ou `git pull` dans le terminal.
- **Terminal** : le bouton **JavaScript / Terminal** de la console exécute une commande PowerShell dans le dossier, 60 secondes au plus. **↑** et **↓** reprennent les commandes précédentes.
- Python s'exécute directement dans le dossier.

L'Atelier n'a accès qu'aux dossiers que tu as choisis toi-même.

## Exécuter (▶ ou Ctrl+Entrée)

- **Pages web** : l'aperçu se met à jour pendant que tu tapes ; le CSS et le JavaScript liés sont lus dans le projet.
- **Console** : elle affiche les `console.log`, les erreurs et les promesses rejetées de l'aperçu, et une ligne permet d'évaluer du JavaScript.
- **Scripts JavaScript** : ils tournent dans un bac à sable isolé, 8 secondes au plus, avec `await` permis.
- **Scripts Python** : ils sont exécutés par le Python 3 installé sur ton PC, dans un dossier temporaire où tout le projet est copié, 10 secondes au plus. Sans Python, l'Atelier explique comment l'installer (python.org, case « Add to PATH »).

## Faire un plugin

1. Pars d'un modèle « Plugin : … ».
2. **▶** teste le plugin dans un cadre isolé, avec un dossier de données temporaire en mémoire ; la console montre son chargement et ses erreurs.
3. **Valider le plugin** vérifie `plugin.json` et le code, et liste ce qu'il faut corriger.
4. **Exporter .zip** fabrique l'archive à joindre à une Release GitHub (topic `neodex-plugin`), avec une icône générée si tu n'en as pas.

La publication elle-même (Release GitHub, signature et approbation) se fait en dehors de l'Atelier. Le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk) décrit tout ce qu'un plugin peut faire.

## Sécurité

Ton code ne tourne jamais dans NeoDex lui-même : il est toujours isolé, et ne voit ni tes données ni tes onglets. Le volet système de l'Atelier, qui demande l'accès complet, sert seulement à Python et aux dossiers que tu ouvres toi-même (fichiers, Git, terminal) : il refuse tout chemin qui sort de ces dossiers.

## Données et synchronisation

Tes projets sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Atelier → Installer**.
