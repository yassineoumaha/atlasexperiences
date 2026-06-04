/**
 * Translated (AR/FR) renderings of the Terms and Privacy Policy.
 *
 * ⚠️ These are DRAFT machine/AI translations provided for accessibility. The
 * English versions on /terms and /privacy remain the authoritative text until a
 * qualified Moroccan legal professional reviews and approves these. The pages
 * render a prominent "draft — not yet legally reviewed" banner in AR/FR.
 *
 * Kept as plain heading + paragraph/list arrays (not JSX) so the legal text is
 * easy to hand to a translator/lawyer and update without touching layout code.
 */

export type LegalSection = {
  heading: string;
  /** Paragraphs and/or bullet lists, rendered in order. */
  body: Array<{ type: "p"; text: string } | { type: "ul"; items: string[] }>;
};

export interface LegalDoc {
  draftNotice: string;
  authoritativeNote: string;
  sections: LegalSection[];
}

type Locale = "fr" | "ar";

// ── TERMS ────────────────────────────────────────────────────────────────────

export const TERMS_CONTENT: Record<Locale, LegalDoc> = {
  fr: {
    draftNotice:
      "Traduction provisoire (non encore validée juridiquement). En cas de divergence, la version anglaise fait foi. Consultez un juriste avant toute utilisation contraignante.",
    authoritativeNote: "Version anglaise faisant foi disponible sur cette page en anglais.",
    sections: [
      { heading: "1. Ce qu'est Imourig", body: [
        { type: "p", text: "Imourig (« la Plateforme », « nous ») est une place de marché en ligne qui met en relation des voyageurs avec des opérateurs d'expériences locales au Maroc. Nous fournissons la technologie permettant de découvrir, demander et réserver des activités (cours de surf, excursions dans le désert, cours de cuisine et autres expériences locales)." },
        { type: "p", text: "Nous ne sommes PAS un voyagiste, une agence de voyage ou un transporteur. Nous ne fournissons aucune expérience listée. Chaque opérateur est un tiers indépendant." },
        { type: "p", text: "Certaines fonctionnalités de découverte sont optionnelles. Par exemple, « Expériences près de moi » utilise la localisation de votre appareil uniquement si vous l'activez, pour suggérer la ville marocaine la plus proche ; elle n'est jamais requise." },
      ]},
      { heading: "2. Acceptation des conditions", body: [
        { type: "p", text: "En accédant à Imourig ou en l'utilisant — en tant que voyageur ou opérateur — vous acceptez les présentes conditions. Si vous n'êtes pas d'accord, cessez immédiatement d'utiliser la plateforme." },
      ]},
      { heading: "3. Demandes de réservation", body: [
        { type: "p", text: "Lorsque vous soumettez une demande de réservation via Imourig :" },
        { type: "ul", items: [
          "Votre demande est envoyée directement à l'opérateur. Ce n'est PAS une réservation confirmée tant que l'opérateur ne l'a pas explicitement confirmée.",
          "Aucun paiement n'est collecté par Imourig au moment de la demande. Le paiement est organisé directement entre vous et l'opérateur, sauf indication contraire.",
          "Vous devez fournir des informations exactes (nom, e-mail, taille du groupe, date). Des informations inexactes peuvent entraîner un refus.",
          "Une réservation n'est confirmée que lorsque l'opérateur vous envoie une confirmation écrite.",
        ]},
      ]},
      { heading: "4. Annulations et remboursements", body: [
        { type: "p", text: "Les politiques d'annulation sont fixées par chaque opérateur et affichées sur la page de l'expérience. Imourig n'est pas responsable de l'application des remboursements entre voyageurs et opérateurs. En cas de litige, contactez d'abord l'opérateur, puis support@imourig.com." },
        { type: "p", text: "Conformément à la loi marocaine 31-08 sur la protection du consommateur, si vous avez acheté un service numérique directement via Imourig, vous disposez d'un droit de rétractation de 14 jours tant que le service n'a pas été exécuté." },
      ]},
      { heading: "5. Indépendance des opérateurs", body: [
        { type: "p", text: "Tous les opérateurs sont des tiers indépendants, et non des employés ou agents d'Imourig. Imourig :" },
        { type: "ul", items: [
          "ne garantit pas la qualité, la sécurité, l'exactitude ou la disponibilité d'une expérience ;",
          "n'est pas responsable des blessures, pertes, dommages ou litiges découlant de votre interaction avec un opérateur ;",
          "ne détient aucune assurance pour le compte des opérateurs ou des voyageurs ;",
          "vérifie les opérateurs de bonne foi mais ne peut garantir l'exactitude de toutes les informations.",
        ]},
        { type: "p", text: "Vous réservez et participez à toute expérience à vos propres risques. Nous recommandons de vérifier que les opérateurs détiennent des licences marocaines valides et de souscrire une assurance voyage." },
      ]},
      { heading: "6. Conduite de l'utilisateur", body: [
        { type: "p", text: "Vous vous engagez à ne pas :" },
        { type: "ul", items: [
          "soumettre des demandes fausses, trompeuses ou frauduleuses ;",
          "contacter les opérateurs hors plateforme pour éviter les frais (contournement) ;",
          "publier de faux avis ou manipuler les notes ;",
          "harceler, menacer ou diffamer des opérateurs ou d'autres utilisateurs ;",
          "extraire ou reproduire le contenu de la plateforme sans autorisation.",
        ]},
        { type: "p", text: "Toute violation peut entraîner la suspension immédiate du compte et, le cas échéant, des poursuites." },
      ]},
      { heading: "7. Avis", body: [
        { type: "p", text: "Les avis des voyageurs sont modérés par Imourig avant publication. En soumettant un avis, vous confirmez qu'il reflète votre expérience réelle. Nous pouvons rejeter ou supprimer les avis diffamatoires ou frauduleux, sans en modifier le fond." },
      ]},
      { heading: "8. Limitation de responsabilité", body: [
        { type: "p", text: "Dans toute la mesure permise par la loi marocaine, Imourig n'est pas responsable des blessures, décès, maladies ou dommages matériels durant une expérience, des pertes financières liées à une réservation, des dommages indirects, ni du contenu publié par les opérateurs." },
        { type: "p", text: "Notre responsabilité globale maximale est limitée à 500 MAD (environ 50 USD) ou au montant que vous avez payé directement à Imourig, le plus élevé étant retenu." },
      ]},
      { heading: "9. Éligibilité des opérateurs", body: [
        { type: "p", text: "Pour lister sur Imourig en tant qu'opérateur, vous devez : résider légalement au Maroc ou détenir une immatriculation commerciale marocaine valide ; détenir toutes les licences requises ; avoir au moins 18 ans ; fournir des informations exactes." },
      ]},
      { heading: "10. Commission de la plateforme — 10 %", body: [
        { type: "p", text: "Imourig prélève une commission de 10 % de la valeur de chaque réservation confirmée. L'inscription est gratuite ; les factures sont émises mensuellement et payables sous 14 jours. Le taux peut être modifié avec un préavis écrit de 30 jours." },
      ]},
      { heading: "11. Responsabilités des opérateurs", body: [
        { type: "p", text: "L'opérateur est seul responsable de la prestation des expériences décrites, de la réponse aux demandes sous 24 h, du maintien d'une assurance appropriée, du respect des lois marocaines (sécurité, licences, fiscalité), et de la déclaration de toutes les réservations confirmées." },
      ]},
      { heading: "12. Conduites interdites (opérateurs)", body: [
        { type: "p", text: "Les opérateurs ne doivent pas contourner les commissions, publier de fausses disponibilités/prix/qualifications, solliciter de faux avis, ni proposer des activités sans la licence requise." },
      ]},
      { heading: "13. Approbation et retrait des annonces", body: [
        { type: "p", text: "Toutes les annonces sont soumises à l'approbation d'Imourig avant publication. Nous pouvons rejeter ou retirer une annonce qui enfreint ces conditions." },
      ]},
      { heading: "14. Indemnisation par l'opérateur", body: [
        { type: "p", text: "Vous acceptez d'indemniser et de dégager Imourig de toute réclamation découlant de vos annonces, de vos prestations ou de votre manquement aux présentes conditions." },
      ]},
      { heading: "15. Propriété intellectuelle", body: [
        { type: "p", text: "Tout le contenu original d'Imourig nous appartient ou nous est concédé sous licence. Les opérateurs conservent la propriété de leur contenu mais accordent à Imourig une licence non exclusive et gratuite pour l'afficher." },
      ]},
      { heading: "16. Droit applicable et litiges", body: [
        { type: "p", text: "Les présentes conditions sont régies par le droit du Royaume du Maroc. Tout litige sera d'abord soumis à une médiation de bonne foi ; à défaut de résolution sous 30 jours, aux tribunaux compétents de Casablanca. Pour les résidents de l'UE, rien n'écarte vos droits impératifs de consommateur." },
      ]},
      { heading: "17. Modifications des conditions", body: [
        { type: "p", text: "Nous pouvons modifier ces conditions à tout moment. Les changements importants seront notifiés par e-mail ou par avis visible, avec un préavis d'au moins 14 jours." },
      ]},
      { heading: "18. Contact", body: [
        { type: "p", text: "Questions juridiques : legal@imourig.com · Support opérateurs : operators@imourig.com · Support voyageurs : support@imourig.com" },
      ]},
    ],
  },
  ar: {
    draftNotice:
      "ترجمة مبدئية (لم تُراجَع قانونياً بعد). عند وجود اختلاف، تكون النسخة الإنجليزية هي المرجع. استشر محامياً قبل أي استخدام مُلزِم.",
    authoritativeNote: "النسخة الإنجليزية المعتمدة متاحة على هذه الصفحة باللغة الإنجليزية.",
    sections: [
      { heading: "1. ما هي Imourig", body: [
        { type: "p", text: "Imourig (« المنصة »، « نحن ») هي سوق إلكتروني يربط المسافرين بمشغّلي التجارب المحلية في المغرب. نوفّر التقنية التي تتيح اكتشاف الأنشطة وطلبها وحجزها (دروس ركوب الأمواج، رحلات الصحراء، دروس الطبخ وغيرها)." },
        { type: "p", text: "نحن لسنا منظّم رحلات أو وكالة أسفار أو شركة نقل. لا نقدّم أي تجربة مدرجة بأنفسنا. كل مشغّل هو طرف ثالث مستقل." },
        { type: "p", text: "بعض ميزات الاكتشاف اختيارية. مثلاً « تجارب قريبة مني » تستخدم موقع جهازك فقط عند تفعيلك لها، لاقتراح أقرب مدينة مغربية، وهي ليست مطلوبة أبداً لاستخدام المنصة." },
      ]},
      { heading: "2. قبول الشروط", body: [
        { type: "p", text: "بدخولك إلى Imourig أو استخدامها — كمسافر أو كمشغّل — فإنك توافق على هذه الشروط. إن لم توافق، توقّف فوراً عن استخدام المنصة." },
      ]},
      { heading: "3. طلبات الحجز", body: [
        { type: "p", text: "عند تقديم طلب حجز عبر Imourig:" },
        { type: "ul", items: [
          "يُرسَل طلبك مباشرة إلى المشغّل. لا يُعدّ حجزاً مؤكَّداً حتى يؤكّده المشغّل صراحةً.",
          "لا تُحصِّل Imourig أي دفعة عند الطلب. يُرتَّب الدفع مباشرة بينك وبين المشغّل ما لم يُذكر خلاف ذلك.",
          "يجب تقديم معلومات دقيقة (الاسم، البريد، حجم المجموعة، التاريخ). المعلومات غير الدقيقة قد تؤدي إلى الرفض.",
          "لا يتأكّد الحجز إلا عندما يرسل لك المشغّل تأكيداً كتابياً.",
        ]},
      ]},
      { heading: "4. الإلغاء واسترداد المبالغ", body: [
        { type: "p", text: "يحدّد كل مشغّل سياسة الإلغاء الخاصة به، وتُعرَض على صفحة التجربة. Imourig ليست مسؤولة عن تنفيذ المبالغ المستردة بين المسافرين والمشغّلين. عند النزاع، تواصل أولاً مع المشغّل ثم مع support@imourig.com." },
        { type: "p", text: "بموجب القانون المغربي 31-08 لحماية المستهلك، إذا اشتريت خدمة رقمية مباشرة عبر Imourig، يحقّ لك التراجع خلال 14 يوماً ما دامت الخدمة لم تُنفَّذ بعد." },
      ]},
      { heading: "5. استقلالية المشغّلين", body: [
        { type: "p", text: "جميع المشغّلين أطراف ثالثة مستقلة، وليسوا موظفين أو وكلاء لدى Imourig. إن Imourig:" },
        { type: "ul", items: [
          "لا تضمن جودة أو سلامة أو دقة أو توفّر أي تجربة؛",
          "غير مسؤولة عن أي إصابة أو خسارة أو ضرر أو نزاع ينشأ عن تعاملك مع مشغّل؛",
          "لا تحمل أي تأمين نيابة عن المشغّلين أو المسافرين؛",
          "تتحقّق من المشغّلين بحسن نية لكنها لا تضمن أن كل المعلومات حديثة.",
        ]},
        { type: "p", text: "أنت تحجز وتشارك في أي تجربة على مسؤوليتك الخاصة. ننصح بالتأكّد من امتلاك المشغّلين رخصاً مغربية سارية وبشراء تأمين سفر مناسب." },
      ]},
      { heading: "6. سلوك المستخدم", body: [
        { type: "p", text: "توافق على ألّا:" },
        { type: "ul", items: [
          "تقدّم طلبات حجز كاذبة أو مضلّلة أو احتيالية؛",
          "تتواصل مع المشغّلين خارج المنصة لتفادي رسومها؛",
          "تنشر مراجعات مزيّفة أو تتلاعب بالتقييمات؛",
          "تضايق أو تهدّد أو تشهّر بالمشغّلين أو المستخدمين؛",
          "تنسخ أو تستخرج محتوى المنصة دون إذن.",
        ]},
        { type: "p", text: "قد تؤدي المخالفات إلى تعليق الحساب فوراً واتخاذ إجراءات قانونية عند الاقتضاء." },
      ]},
      { heading: "7. المراجعات", body: [
        { type: "p", text: "تخضع مراجعات المسافرين لإشراف Imourig قبل النشر. بتقديمك مراجعة تؤكّد أنها تعكس تجربتك الحقيقية. يحقّ لنا رفض أو إزالة المراجعات التشهيرية أو الاحتيالية دون تعديل مضمونها." },
      ]},
      { heading: "8. تحديد المسؤولية", body: [
        { type: "p", text: "إلى أقصى حدّ يسمح به القانون المغربي، Imourig غير مسؤولة عن أي إصابة أو وفاة أو مرض أو ضرر بالممتلكات أثناء التجربة، ولا عن الخسائر المالية الناتجة عن حجز، ولا عن الأضرار غير المباشرة، ولا عن محتوى المشغّلين." },
        { type: "p", text: "الحدّ الأقصى لمسؤوليتنا الإجمالية هو 500 درهم (نحو 50 دولاراً) أو المبلغ الذي دفعته مباشرة إلى Imourig، أيّهما أكبر." },
      ]},
      { heading: "9. أهلية المشغّل", body: [
        { type: "p", text: "للإدراج كمشغّل على Imourig يجب أن تكون مقيماً قانونياً بالمغرب أو تحمل سجلاً تجارياً مغربياً ساري المفعول، وأن تمتلك جميع الرخص المطلوبة، وأن يكون عمرك 18 عاماً على الأقل، وأن تقدّم معلومات صحيحة." },
      ]},
      { heading: "10. عمولة المنصة — 10٪", body: [
        { type: "p", text: "تتقاضى Imourig عمولة قدرها 10٪ من قيمة كل حجز مؤكَّد. الإدراج مجاني؛ تُصدَر الفواتير شهرياً وتُستحَق خلال 14 يوماً. يمكن تغيير النسبة بإشعار كتابي مدّته 30 يوماً." },
      ]},
      { heading: "11. مسؤوليات المشغّل", body: [
        { type: "p", text: "المشغّل وحده مسؤول عن تقديم التجارب كما وُصِفت، والردّ على الطلبات خلال 24 ساعة، والاحتفاظ بتأمين مناسب، والامتثال للقوانين المغربية (السلامة، الرخص، الضرائب)، والإبلاغ عن جميع الحجوزات المؤكَّدة." },
      ]},
      { heading: "12. السلوكيات المحظورة (المشغّلون)", body: [
        { type: "p", text: "يُمنع على المشغّلين تجاوز العمولات، أو نشر توافر/أسعار/مؤهّلات كاذبة، أو طلب مراجعات مزيّفة، أو تقديم أنشطة دون امتلاك الرخصة المطلوبة." },
      ]},
      { heading: "13. الموافقة على الإعلانات وإزالتها", body: [
        { type: "p", text: "تخضع جميع الإعلانات لموافقة Imourig قبل النشر. يحقّ لنا رفض أو إزالة أي إعلان يخالف هذه الشروط." },
      ]},
      { heading: "14. تعويض المشغّل", body: [
        { type: "p", text: "توافق على تعويض Imourig وإبراء ذمّتها من أي مطالبة تنشأ عن إعلاناتك أو خدماتك أو إخلالك بهذه الشروط." },
      ]},
      { heading: "15. الملكية الفكرية", body: [
        { type: "p", text: "كل المحتوى الأصلي على Imourig ملك لنا أو مرخَّص لنا. يحتفظ المشغّلون بملكية محتواهم لكنهم يمنحون Imourig ترخيصاً غير حصري ومجاني لعرضه." },
      ]},
      { heading: "16. القانون المطبَّق والنزاعات", body: [
        { type: "p", text: "تخضع هذه الشروط لقوانين المملكة المغربية. يُحال أي نزاع أولاً إلى وساطة بحسن نية، وعند عدم الحلّ خلال 30 يوماً، إلى المحاكم المختصة بالدار البيضاء. بالنسبة لمقيمي الاتحاد الأوروبي، لا يلغي ذلك حقوقك الإلزامية كمستهلك." },
      ]},
      { heading: "17. تعديلات الشروط", body: [
        { type: "p", text: "يمكننا تعديل هذه الشروط في أي وقت. تُبلَّغ التغييرات الجوهرية عبر البريد الإلكتروني أو بإشعار بارز، مع مهلة لا تقلّ عن 14 يوماً." },
      ]},
      { heading: "18. التواصل", body: [
        { type: "p", text: "أسئلة قانونية: legal@imourig.com · دعم المشغّلين: operators@imourig.com · دعم المسافرين: support@imourig.com" },
      ]},
    ],
  },
};

// ── PRIVACY ──────────────────────────────────────────────────────────────────

export const PRIVACY_CONTENT: Record<Locale, LegalDoc> = {
  fr: {
    draftNotice:
      "Traduction provisoire (non encore validée juridiquement). En cas de divergence, la version anglaise fait foi. Consultez un juriste avant toute utilisation contraignante.",
    authoritativeNote: "Version anglaise faisant foi disponible sur cette page en anglais.",
    sections: [
      { heading: "1. Responsable du traitement", body: [
        { type: "p", text: "Imourig (« nous ») est le responsable du traitement des données personnelles collectées via ce site (imourig.com). Nous exploitons une place de marché reliant voyageurs et opérateurs d'expériences locales au Maroc. Contact : privacy@imourig.com" },
      ]},
      { heading: "2. Données collectées et finalités", body: [
        { type: "p", text: "Nous collectons : nom et e-mail (compte, réservations, newsletter) ; téléphone (réservations, annonces) ; pays de résidence ; taille du groupe et date ; demandes spéciales ; détails professionnels des opérateurs ; contenu des annonces ; historique de réservation ; messages de discussion ; adresse IP et type d'appareil (sécurité, analytique) ; localisation approximative (uniquement si vous activez « Expériences près de moi ») ; contenu des avis." },
        { type: "p", text: "Bases légales : exécution du contrat, consentement, ou intérêt légitime selon le cas." },
      ]},
      { heading: "3. Partage de vos données", body: [
        { type: "p", text: "Nous ne vendons PAS vos données. Nous les partageons uniquement : avec l'opérateur concerné lors d'une demande de réservation ; avec Supabase (hébergeur de base de données, régions UE d'AWS) ; avec les autorités légales si la loi l'exige ; et entre voyageur et opérateur via la messagerie de la plateforme." },
      ]},
      { heading: "4. Cookies (loi 09-08 + RGPD)", body: [
        { type: "p", text: "Nous utilisons des cookies minimaux nécessaires au fonctionnement (session d'authentification). Les cookies analytiques requièrent votre consentement, révocable via notre bandeau cookies. Nous n'utilisons pas de cookies publicitaires ni de suivi inter-sites." },
      ]},
      { heading: "5. Données de localisation (GPS)", body: [
        { type: "p", text: "La fonction « Expériences près de moi » est désactivée par défaut et ne s'exécute que si vous l'activez et accordez l'autorisation de votre navigateur. Vos coordonnées sont lues une seule fois et traitées dans votre navigateur pour trouver la ville marocaine la plus proche. Nous ne stockons PAS vos coordonnées GPS brutes et ne suivons pas votre position en continu. Base légale : votre consentement explicite." },
      ]},
      { heading: "6. Conservation des données", body: [
        { type: "p", text: "Newsletter : jusqu'au désabonnement puis suppression sous 30 jours. Compte : durée du compte + 2 ans. Réservations : 5 ans. Messages : 2 ans. Annonces et avis : jusqu'au retrait + 1 an. Journaux analytiques (IP) : 12 mois sous forme agrégée." },
      ]},
      { heading: "7. Vos droits", body: [
        { type: "p", text: "Selon la loi 09-08 et le RGPD : accès, rectification, effacement, opposition, limitation, portabilité (UE), retrait du consentement. Pour exercer un droit : privacy@imourig.com. Nous répondons sous 30 jours (loi 09-08) / 1 mois (RGPD)." },
      ]},
      { heading: "8. Transferts transfrontaliers", body: [
        { type: "p", text: "Vos données sont hébergées par Supabase (régions UE d'AWS, principalement Francfort), conforme au RGPD via des clauses contractuelles types. Pour la loi 09-08, les transferts hors Maroc sont effectués avec des garanties notifiées à la CNDP." },
      ]},
      { heading: "9. Notification de violation (loi 07-26)", body: [
        { type: "p", text: "En cas de violation affectant vos droits, nous notifierons la CNDP dans les 72 heures, informerons les utilisateurs concernés sans délai en cas de risque élevé, et prendrons des mesures immédiates de confinement et de remédiation." },
      ]},
      { heading: "10. Vie privée des enfants", body: [
        { type: "p", text: "Cette plateforme ne s'adresse pas aux enfants de moins de 16 ans. Nous ne collectons pas sciemment leurs données. Contactez-nous si vous pensez qu'un enfant nous a fourni des données." },
      ]},
      { heading: "11. Sécurité", body: [
        { type: "p", text: "Nous appliquons des mesures standard : transmission chiffrée (HTTPS/TLS), sécurité au niveau des lignes de la base (Supabase RLS), mots de passe hachés via Supabase Auth, et revues de sécurité régulières." },
      ]},
      { heading: "12. Réclamations", body: [
        { type: "p", text: "Maroc : déposez une réclamation auprès de la CNDP (cndp.ma). Résidents de l'UE : contactez votre autorité nationale de protection des données." },
      ]},
      { heading: "13. Modifications de la politique", body: [
        { type: "p", text: "Nous pouvons mettre à jour cette politique. Les changements importants seront notifiés par e-mail (utilisateurs inscrits) ou par avis visible. La date « Dernière mise à jour » reflète toujours la version en vigueur." },
      ]},
    ],
  },
  ar: {
    draftNotice:
      "ترجمة مبدئية (لم تُراجَع قانونياً بعد). عند وجود اختلاف، تكون النسخة الإنجليزية هي المرجع. استشر محامياً قبل أي استخدام مُلزِم.",
    authoritativeNote: "النسخة الإنجليزية المعتمدة متاحة على هذه الصفحة باللغة الإنجليزية.",
    sections: [
      { heading: "1. المسؤول عن المعالجة", body: [
        { type: "p", text: "Imourig (« نحن ») هي المسؤولة عن معالجة البيانات الشخصية المُجمَّعة عبر هذا الموقع (imourig.com). نُشغّل سوقاً يربط المسافرين بمشغّلي التجارب المحلية بالمغرب. للتواصل: privacy@imourig.com" },
      ]},
      { heading: "2. البيانات التي نجمعها وأغراضها", body: [
        { type: "p", text: "نجمع: الاسم والبريد (الحساب، الحجوزات، النشرة)؛ الهاتف؛ بلد الإقامة؛ حجم المجموعة والتاريخ؛ الطلبات الخاصة؛ بيانات المشغّلين المهنية؛ محتوى الإعلانات؛ سجلّ الحجوزات؛ رسائل المحادثة؛ عنوان IP ونوع الجهاز (الأمان والتحليلات)؛ الموقع التقريبي (فقط عند تفعيل « تجارب قريبة مني »)؛ محتوى المراجعات." },
        { type: "p", text: "الأسس القانونية: تنفيذ العقد، أو الموافقة، أو المصلحة المشروعة بحسب الحالة." },
      ]},
      { heading: "3. مشاركة بياناتك", body: [
        { type: "p", text: "نحن لا نبيع بياناتك. نشاركها فقط: مع المشغّل المعني عند تقديم طلب حجز؛ مع Supabase (مزوّد قاعدة البيانات، مناطق AWS بالاتحاد الأوروبي)؛ مع السلطات القانونية عند الاقتضاء؛ وبين المسافر والمشغّل عبر المحادثة داخل المنصة." },
      ]},
      { heading: "4. ملفات تعريف الارتباط (القانون 09-08 + GDPR)", body: [
        { type: "p", text: "نستخدم ملفات ضرورية للتشغيل (جلسة المصادقة). ملفات التحليلات تتطلّب موافقتك، ويمكن سحبها عبر شريط الكوكيز. لا نستخدم ملفات إعلانية أو تتبّعاً عبر المواقع." },
      ]},
      { heading: "5. بيانات الموقع (GPS)", body: [
        { type: "p", text: "ميزة « تجارب قريبة مني » معطّلة افتراضياً ولا تعمل إلا إذا فعّلتها ومنحت إذن المتصفّح. تُقرأ إحداثياتك مرة واحدة وتُعالَج داخل متصفّحك لإيجاد أقرب مدينة مغربية. لا نخزّن إحداثيات GPS الخام ولا نتتبّع موقعك باستمرار. الأساس القانوني: موافقتك الصريحة." },
      ]},
      { heading: "6. الاحتفاظ بالبيانات", body: [
        { type: "p", text: "النشرة: حتى إلغاء الاشتراك ثم الحذف خلال 30 يوماً. الحساب: مدّة الحساب + سنتان. الحجوزات: 5 سنوات. الرسائل: سنتان. الإعلانات والمراجعات: حتى الإزالة + سنة. سجلّات التحليلات (IP): 12 شهراً بشكل مُجمَّع." },
      ]},
      { heading: "7. حقوقك", body: [
        { type: "p", text: "بموجب القانون 09-08 وGDPR: الوصول، التصحيح، المحو، الاعتراض، تقييد المعالجة، قابلية النقل (الاتحاد الأوروبي)، سحب الموافقة. لممارسة أي حق: privacy@imourig.com. نردّ خلال 30 يوماً (09-08) / شهر (GDPR)." },
      ]},
      { heading: "8. عمليات النقل عبر الحدود", body: [
        { type: "p", text: "تُستضاف بياناتك لدى Supabase (مناطق AWS بالاتحاد الأوروبي، فرانكفورت أساساً)، المتوافقة مع GDPR عبر الشروط التعاقدية النموذجية. بالنسبة للقانون 09-08، تُجرى عمليات النقل خارج المغرب بضمانات مُبلَّغة إلى CNDP." },
      ]},
      { heading: "9. الإبلاغ عن خرق البيانات (القانون 07-26)", body: [
        { type: "p", text: "في حال خرق يؤثّر على حقوقك، سنُبلِغ CNDP خلال 72 ساعة، ونُعلِم المستخدمين المتضرّرين دون تأخير عند وجود خطر مرتفع، ونتّخذ خطوات فورية للاحتواء والمعالجة." },
      ]},
      { heading: "10. خصوصية الأطفال", body: [
        { type: "p", text: "هذه المنصة ليست موجَّهة للأطفال دون 16 عاماً. لا نجمع بياناتهم عن قصد. تواصل معنا إذا اعتقدت أن طفلاً زوّدنا ببياناته." },
      ]},
      { heading: "11. الأمان", body: [
        { type: "p", text: "نطبّق تدابير قياسية: نقل مشفَّر (HTTPS/TLS)، أمان على مستوى الصفوف في قاعدة البيانات (Supabase RLS)، كلمات مرور مُجزَّأة عبر Supabase Auth، ومراجعات أمنية منتظمة." },
      ]},
      { heading: "12. الشكاوى", body: [
        { type: "p", text: "المغرب: قدّم شكوى لدى CNDP (cndp.ma). مقيمو الاتحاد الأوروبي: تواصلوا مع هيئة حماية البيانات الوطنية لديكم." },
      ]},
      { heading: "13. تغييرات هذه السياسة", body: [
        { type: "p", text: "قد نُحدِّث هذه السياسة. تُبلَّغ التغييرات الجوهرية عبر البريد الإلكتروني (المستخدمون المسجَّلون) أو بإشعار بارز. يعكس تاريخ « آخر تحديث » النسخة السارية دائماً." },
      ]},
    ],
  },
};

