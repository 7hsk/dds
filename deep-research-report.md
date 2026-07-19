# Cahier des charges – DDS (Doctor Digital System) au Maroc

Le **Doctor Digital System (DDS)** est une plateforme numérique destinée à assister à la fois les médecins et leurs patients au Maroc. Elle vise à gérer les rendez-vous (en ligne et via WhatsApp), suivre le dossier patient, proposer un assistant IA pour l’analyse des consultations et suggérer des techniques/traitements actualisés, tout en respectant le rôle central du médecin. Ce projet doit se conformer aux lois marocaines sur la santé et la protection des données, et s’appuyer sur des solutions techniques sécurisées.  

## Contexte réglementaire et normes marocaines

Le secteur de la santé numérique est fortement encadré au Maroc. La **loi n°131-13** (et ses décrets d’application) introduit la télémédecine dans le droit marocain. Elle définit la téléconsultation comme une « pratique médicale à distance utilisant les TIC » et impose le *consentement explicite* du patient (même électronique) ainsi que l’enregistrement de tout acte dans le dossier médical. Le **décret 2-18-378 (2018)** précise les actes de télémédecine (téléconsultation, téléexpertise, télésurveillance, téléassistance, régulation médicale) et rappelle que toutes les informations échangées doivent être consignées dans le dossier patient, en respectant le secret médical et la loi 09-08 sur les données personnelles. Le **décret 2-20-675 (2021)** élargit la définition de la téléconsultation (suppression de l’obligation de présence physique d’un professionnel auprès du patient) et exige désormais une autorisation préalable de la *CNDP* (Commission nationale de contrôle des données à caractère personnel) pour tout traitement de données médicales.  

Par ailleurs, la **loi n°09-08** (protection des données personnelles) impose aux professionnels de santé de sécuriser les données médicales sensibles (identification, antécédents, traitements). Un guide récent rappelle qu’au 15 février 2025 tout médecin marocain est tenu de se conformer à la loi 09-08 (inscription sur la plateforme CNDP, dépôt d’un formulaire de conformité, etc.), sous peine de sanctions. La CNDP veille à ce que les traitements de données de santé soient sécurisés et consentis, et encourage le chiffrement et l’hébergement sécurisé des informations de santé.  

L’**Ordre national des médecins (CNOM)** et la loi 131-13 soulignent aussi l’obligation pour le médecin de suivre des pratiques validées scientifiquement. Le médecin ne peut recourir à des techniques non éprouvées ou obsolètes, et il doit se tenir à jour via la formation continue. Cette exigence justifie qu’un assistant IA intégré suggère uniquement des protocoles ou traitements validés. Enfin, pour l’architecture technique, on privilégiera un hébergement certifié (ISO 27001/HDS) comme celui obtenu récemment par un opérateur marocain. En résumé, DDS devra respecter la législation marocaine : télétravail médical encadré, secret médical, consentement, et conformité CNDP.  

## Besoins fonctionnels (médecins et patients)

 *Médecin en blouse blanche avec stéthoscope, illustrant l’importance du volet médical et humain dans la plateforme.* La plateforme DDS doit répondre aux besoins concrets des praticiens et des patients. Pour les médecins, il s’agit de **simplifier les tâches quotidiennes** (gestion de l’agenda, dossiers patients, communications) afin qu’ils se concentrent sur le diagnostic et le soin. Le système doit permettre de : 

- **Gérer les rendez-vous** : accès en ligne 24/7, planning synchronisé, possibilité de prise de rendez-vous par le patient (site web ou app) ou par WhatsApp Business API. Un agenda dédié doit distinguer les consultations physiques et à distance, avec rappels et confirmations automatiques (par notifications, SMS ou WhatsApp). Les rappels via WhatsApp (par exemple 24 h puis 1 h avant) réduisent les rendez-vous manqués de 30–50 %.  
- **Suivi et dossier patient** : création et modification de fiches patient, consultation de l’historique (notes, examens, prescriptions, comptes-rendus). Le dossier permet de suivre les consultations successives et les traitements. Les données (images, analyses) sont stockées de façon sécurisée, chiffrées et accessibles seulement au médecin concerné (respect du secret médical et de la loi 09-08).  
- **Téléconsultation sécurisée** : option de visioconférence chiffrée depuis la plateforme, conforme CNDP. Toute téléconsultation doit être enregistrée dans le dossier patient comme une consultation classique, avec consentement explicite du patient préalablement recueilli.  
- **Ordonnance électronique et facturation** : génération d’ordonnances numériques signées (transmises au patient par e-mail ou espace dédié). Intégration d’un module de facturation/télétransmission CNSS/CNOPS, pour inclure automatiquement les actes de téléconsultation dans la feuille de soins électronique.  
- **Assistant IA médical** : un module intelligent (basé sur IA/ML) analyse les données des patients (symptômes, antécédents, résultats d’examens) pour suggérer au médecin des options thérapeutiques ou des techniques récentes adaptées. Ce système aide le médecin à rester informé des avancées et à proposer des approches innovantes, tout en validant que ces recommandations respectent la formation académique du médecin (pas de proposition de méthodes non éprouvées).  
- **Outils de communication** : messagerie sécurisée in-app, intégration possible de WhatsApp pour échanges rapides (tout en respectant la loi 09-08 et en limitant les données partagées). Possibilité d’envoyer des formulaires aux patients (questionnaires de pré-consultation) via WhatsApp.  
- **Administration et analyses** : tableau de bord du cabinet (nombre de patients, statistiques, taux d’absentéisme, satisfaction). Paramètres multilingues (français, arabe, éventuellement darija) pour utilisateurs.  

Du côté des **patients**, l’app mobile ou web doit permettre de : prise de rendez-vous facile (sélection médecin/spécialité/localisation), consultation de la planification, réception automatique de rappels (SMS/WhatsApp). Les patients accèdent à leur dossier (résultats, ordonnances) et peuvent communiquer avec leur médecin via la plateforme. L’objectif global est de fluidifier la relation médecin-patient et de rendre le parcours de soins plus transparent, sans pour autant masquer l’expertise médicale.  

## Solutions techniques et intégrations

 *Consultation d’un dossier médical numérique sur tablette. L’intégration technologique (cloud sécurisé, base de données chiffrée, interfaces mobiles) est au cœur du système.* Techniquement, DDS exigera une infrastructure robuste et conforme. On privilégiera un **hébergement certifié** (ISO 27001/HDS) pour les données de santé. Le backend peut reposer sur un cloud sécurisé ou un datacenter marocain, avec chiffrement des données au repos et en transit. Côté application, on prévoit une interface web et mobile (React, Flutter, ou technologies similaires) pour permettre l’accès depuis PC et smartphones.  

**Intégrations clés** : la **WhatsApp Business API** sera utilisée pour automatiser la messagerie : envoi de rappels de RDV, questionnaires, notifications de disponibilité. WhatsApp API offre un chiffrement de bout en bout et assure traçabilité des échanges. Conformément à la loi 09-08, il faudra recueillir le consentement du patient et ne transmettre sur WhatsApp que les données strictement nécessaires (éviter les dossiers complets sur chat). Pour la **téléconsultation vidéo**, on intégrera un outil de visioconférence chiffrée (par ex. WebRTC, Jitsi hébergé en interne ou service agréé). Ce module devra s’imbriquer directement dans le dossier patient (pas de visio séparée), conformément aux bonnes pratiques.  

L’**assistant IA** exploite de l’IA médicale (modèles de langage spécialisés) pour analyser les comptes rendus et données patients. Il devrait justifier ses propositions (sources cliniques) et rester auditable. Par exemple, il peut suggérer des protocoles de traitement basés sur de la littérature récente, ou rappeler au médecin les nouvelles recommandations en vigueur. Toutefois, l’IA ne se substitue jamais au jugement du médecin, conformément aux obligations déontologiques. Les algorithmes doivent aussi respecter la confidentialité (anonymisation, sécurisation) des données traitées.  

Enfin, DDS s’intègre à l’écosystème existant : échange possible avec les logiciels médicaux (via API) pour importer/exporter les dossiers, intégration des télétransmissions CNSS/CNOPS pour la facturation, et compatibilité éventuelle avec des référentiels nationaux (e-santé). La sécurité comprend authentification forte (ex. portail d’identité numérique), journaux d’audit, sauvegardes régulières, et possibilité de suppression/déportation des données sur demande du patient.  

## Contenu détaillé du cahier des charges

Le **cahier des charges** doit formaliser tous ces points en détail, par exemple :  

- **Présentation du projet et contexte** (objectifs, publics cibles, enjeux au Maroc).  
- **Cadre légal** : récapitulatif des lois applicables (télémédecine, CNDP, normes).  
- **Cas d’usage / besoins** : scénarios utilisateurs pour chaque fonctionnalité (prise de RDV, téléconsultation, gestion patient, IA, etc.).  
- **Spécifications fonctionnelles** : description précise des modules (agenda, dossier patient, chat, IA, génération d’ordonnance, rappels) et des interactions (user stories).  
- **Spécifications techniques** : architecture (frontend, backend, base de données), exigences de sécurité (chiffrement, certificats), choix technologiques (langages, frameworks), hébergement (cloud/serveur local).  
- **Maquettes et UX/UI** : esquisses (wireframes) des écrans principaux – ex. écran de planning, fiche patient, interface de consultation vidéo, écran IA, interface mobile. L’ergonomie doit être claire et bilingue (FR/AR).  
- **Sécurité et conformité** : mesures pour respecter la loi 09-08 et les recommandations CNDP (gestion des consentements, droits d’accès, résilience, journalisation, HDS/ISO27001).  
- **Plan de réalisation** : phases du projet (analyse, développement, tests, déploiement), jalons, équipe projet, budget estimé, maintenance.  
- **Tests et validation** : protocoles de recette (tests fonctionnels, de charge, de sécurité) et critères d’acceptation (ex. taux d’erreur, conformité CNDP).  
- **Annexes** : glossaire, références légales, sources médicales utilisées pour l’IA, matrices de permissions, etc.  

Ces sections détaillées guideront les développeurs et parties prenantes. Elles incluront des documents annexes (ex. descriptif des API WhatsApp, schémas de base de données, extraits de textes de loi).  

## Méga-prompt pour l’IA de recherche approfondie

Un **méga-prompt** est une consigne structurée pour orienter un modèle d’IA (chatbot) dans une tâche complexe comme l’élaboration du cahier des charges. Par exemple, on pourrait formuler un prompt long et précis qui intègre :  
1. Le contexte et les objectifs du projet DDS (application médicale hybride médecin-patient au Maroc),  
2. Les parties prenantes (médecins, patients, Ordre des médecins, CNDP),  
3. Les contraintes (lois marocaines, sécurité des données, dialectes langue),  
4. Les fonctionnalités attendues (prise de RDV, téléconsultation, IA, gestion patient),  
5. Le ton et format souhaités (technique, détaillé, en français).  

Ce prompt complet guidera l’IA pour qu’elle génère des contenus pertinents : par exemple, rédiger des chapitres du cahier des charges, proposer des architectures techniques, ou générer des maquettes préliminaires en markdown. En affinant le prompt (en précisant par exemple « citations de sources marocaines », ou « expliquer la loi 09-08 »), on tire parti de l’IA pour enrichir la recherche. L’idée est de « converser » avec l’IA en lui fournissant suffisamment de contexte réglementaire, métier et technique afin qu’elle produise des éléments de réponse adaptés aux spécificités marocaines.  

**Sources :** documentation marocaine sur la télémédecine et la protection des données ; guides pour médecins (WhatsApp Business, téléconsultation) ; textes de loi 131-13, 09-08. Des citations spécifiques du cadre légal ont été utilisées pour garantir la conformité des spécifications.