(() => {
  const catalogs = window.RUFUS_I18N_DATA;
  if (!catalogs) throw new Error('The AstroVital translation catalog did not load.');

  const brandingTranslations = {
    es: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Tu salud. Tu misión.',
      'Rufus, your AI health companion.': 'Rufus, tu compañero de salud con IA.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Conoce a Rufus, tu guía personalizada dentro de AstroVital.',
      'Chat with Rufus': 'Chatea con Rufus',
      'Customize Rufus': 'Personaliza a Rufus',
      'Tap Rufus to say hi': 'Toca a Rufus para saludar',
      'Rufus companion': 'Compañero Rufus',
      'Rufus companion bay': 'Bahía de Rufus',
      'Rufus avatar bay': 'Bahía del avatar de Rufus',
      'Install AstroVital': 'Instalar AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital se abre como una aplicación y mantiene tu perfil en este dispositivo.',
      'Rufus is happy you dropped by': 'A Rufus le alegra que hayas venido',
      'Rufus has a message for you': 'Rufus tiene un mensaje para ti',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital ofrece herramientas de bienestar, no diagnósticos médicos. Siga las indicaciones médicas de su misión.',
      'Try AstroVital, the local-first astronaut health app.': 'Prueba AstroVital, la aplicación local de salud para astronautas.'
    },
    fr: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Votre santé. Votre mission.',
      'Rufus, your AI health companion.': 'Rufus, votre compagnon de santé IA.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Découvrez Rufus, votre guide personnalisé au sein d’AstroVital.',
      'Chat with Rufus': 'Discuter avec Rufus',
      'Customize Rufus': 'Personnaliser Rufus',
      'Tap Rufus to say hi': 'Touchez Rufus pour le saluer',
      'Rufus companion': 'Compagnon Rufus',
      'Rufus companion bay': 'Espace compagnon de Rufus',
      'Rufus avatar bay': 'Espace avatar de Rufus',
      'Install AstroVital': 'Installer AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital s’ouvre comme une application et conserve votre profil sur cet appareil.',
      'Rufus is happy you dropped by': 'Rufus est ravi de votre visite',
      'Rufus has a message for you': 'Rufus a un message pour vous',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital propose des outils de bien-être, pas des diagnostics médicaux. Suivez les consignes médicales de votre mission.',
      'Try AstroVital, the local-first astronaut health app.': 'Découvrez AstroVital, l’application locale de santé pour les astronautes.'
    },
    de: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — Ihre Gesundheit. Ihre Mission.',
      'Rufus, your AI health companion.': 'Rufus, dein KI-Gesundheitsbegleiter.',
      'Meet Rufus, your personalized guide within AstroVital.': 'Lerne Rufus kennen, deinen persönlichen Wegbegleiter in AstroVital.',
      'Chat with Rufus': 'Mit Rufus chatten',
      'Customize Rufus': 'Rufus anpassen',
      'Tap Rufus to say hi': 'Tippe auf Rufus, um Hallo zu sagen',
      'Rufus companion': 'Rufus’ Begleiter',
      'Rufus companion bay': 'Rufus’ Begleiterbereich',
      'Rufus avatar bay': 'Rufus’ Avatar-Bereich',
      'Install AstroVital': 'AstroVital installieren',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital öffnet sich wie eine App und speichert dein Profil auf diesem Gerät.',
      'Rufus is happy you dropped by': 'Rufus freut sich über deinen Besuch',
      'Rufus has a message for you': 'Rufus hat eine Nachricht für dich',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital bietet Wellness-Werkzeuge, keine medizinischen Diagnosen. Befolge die medizinischen Vorgaben deiner Mission.',
      'Try AstroVital, the local-first astronaut health app.': 'Entdecke AstroVital, die lokale Gesundheits-App für Astronautinnen und Astronauten.'
    },
    zh: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — 您的健康，您的使命。',
      'Rufus, your AI health companion.': 'Rufus，您的 AI 健康伙伴。',
      'Meet Rufus, your personalized guide within AstroVital.': '认识 Rufus：他是 AstroVital 中为您提供个性化引导的伙伴。',
      'Chat with Rufus': '与 Rufus 聊天',
      'Customize Rufus': '自定义 Rufus',
      'Tap Rufus to say hi': '点击 Rufus 打个招呼',
      'Rufus companion': 'Rufus 伙伴',
      'Rufus companion bay': 'Rufus 伙伴舱',
      'Rufus avatar bay': 'Rufus 头像舱',
      'Install AstroVital': '安装 AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVital 可像应用一样打开，并将您的个人资料保存在此设备上。',
      'Rufus is happy you dropped by': 'Rufus 很高兴你来访',
      'Rufus has a message for you': 'Rufus 有话想对你说',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVital 提供健康支持工具，不提供医疗诊断。请遵循任务医疗指导。',
      'Try AstroVital, the local-first astronaut health app.': '体验 AstroVital：这款本地运行的宇航员健康应用。'
    },
    ja: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — あなたの健康、あなたのミッション。',
      'Rufus, your AI health companion.': 'Rufus、あなたのAIヘルスコンパニオンです。',
      'Meet Rufus, your personalized guide within AstroVital.': 'AstroVitalの中であなたを個別にサポートするガイド、Rufusをご紹介します。',
      'Chat with Rufus': 'Rufusとチャットする',
      'Customize Rufus': 'Rufusをカスタマイズ',
      'Tap Rufus to say hi': 'Rufusをタップして挨拶しましょう',
      'Rufus companion': 'Rufusのコンパニオン',
      'Rufus companion bay': 'Rufusのコンパニオンベイ',
      'Rufus avatar bay': 'Rufusのアバターベイ',
      'Install AstroVital': 'AstroVitalをインストール',
      'AstroVital opens like an app and keeps your profile on this device.': 'AstroVitalはアプリのように起動し、プロフィールをこの端末に保存します。',
      'Rufus is happy you dropped by': 'Rufusは来てくれてうれしいです',
      'Rufus has a message for you': 'Rufusからメッセージがあります',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'AstroVitalは健康を支援するツールであり、医療診断は行いません。ミッションの医療指針に従ってください。',
      'Try AstroVital, the local-first astronaut health app.': 'ローカルで使える宇宙飛行士向け健康アプリ、AstroVitalをお試しください。'
    },
    ar: {
      'AstroVital — Your Health. Your Mission.': 'AstroVital — صحتك، مهمتك.',
      'Rufus, your AI health companion.': 'Rufus، رفيقك الصحي بالذكاء الاصطناعي.',
      'Meet Rufus, your personalized guide within AstroVital.': 'تعرّف على Rufus، دليلك الشخصي داخل AstroVital.',
      'Chat with Rufus': 'تحدث مع Rufus',
      'Customize Rufus': 'خصص Rufus',
      'Tap Rufus to say hi': 'اضغط على Rufus لإلقاء التحية',
      'Rufus companion': 'رفيق Rufus',
      'Rufus companion bay': 'مساحة Rufus المرافقة',
      'Rufus avatar bay': 'مساحة صورة Rufus الرمزية',
      'Install AstroVital': 'تثبيت AstroVital',
      'AstroVital opens like an app and keeps your profile on this device.': 'يفتح AstroVital كتطبيق ويحفظ ملفك الشخصي على هذا الجهاز.',
      'Rufus is happy you dropped by': 'يسعد Rufus بزيارتك',
      'Rufus has a message for you': 'لدى Rufus رسالة لك',
      'AstroVital provides wellness tools, not medical diagnoses. Follow mission medical guidance.': 'يوفر AstroVital أدوات للعافية، وليس تشخيصًا طبيًا. اتبع الإرشادات الطبية للمهمة.',
      'Try AstroVital, the local-first astronaut health app.': 'جرّب AstroVital، تطبيق صحة رواد الفضاء الذي يعمل محليًا.'
    }
  };
  const healthReportTranslations = {
    es: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL · INFORMACIÓN DE SALUD',
      'Health insights': 'Información de salud',
      'Explore your personal baseline and reports built from locally saved data.': 'Consulta tu referencia personal y los informes basados en datos guardados localmente.',
      'PERSONAL RECORDS · LOCAL ONLY': 'REGISTROS PERSONALES · SOLO LOCALES',
      'SYNTHETIC DEMO · ISOLATED': 'DEMOSTRACIÓN SINTÉTICA · AISLADA',
      'View demo data': 'Ver datos de demostración',
      'Return to my data': 'Volver a mis datos',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': 'Datos de demostración sintéticos; no son mediciones personales ni de la NASA. Los registros de demostración se limitan a esta vista; tus datos guardados no cambiarán. Las exportaciones se identificarán como sintéticas.',
      'Health insights views': 'Vistas de información de salud',
      'Personal Baseline': 'Referencia personal',
      'Daily Report': 'Informe diario',
      'Weekly Report': 'Informe semanal',
      'ASTROVITAL HEALTH REPORTS': 'INFORMES DE SALUD DE ASTROVITAL',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · INFORME DE SALUD',
      'Health report': 'Informe de salud',
      'Health reports': 'Informes de salud',
      'Daily and weekly summaries of information saved in your profile.': 'Resúmenes diarios y semanales de la información guardada en tu perfil.',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': 'Los informes solo usan datos registrados en este perfil local. Los archivos CSV y de impresión se crean en este dispositivo; no se suben datos de salud. Las notas privadas y los detalles nutricionales se excluyen del CSV. La información autodeclarada e ilustrativa no constituye un diagnóstico ni consejo médico.',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': 'Los informes de demostración usan datos sintéticos aislados solo con fines ilustrativos. No se guardan en tu perfil ni se mezclan con tus registros personales. Los archivos CSV y de impresión se crean en este dispositivo; no se suben datos de salud. Las notas privadas y los detalles nutricionales se excluyen del CSV. Los datos de demostración no son mediciones personales ni de la NASA, diagnósticos ni consejos médicos.',
      'Report period': 'Periodo del informe',
      'Daily': 'Diario',
      'Weekly': 'Semanal',
      'Weekly · 7 days ending on selected date': 'Semanal · 7 días hasta la fecha seleccionada',
      'Ending date': 'Fecha final',
      'Generate report': 'Generar informe',
      'Daily summary': 'Resumen diario',
      'Weekly summary': 'Resumen semanal',
      'Records in the selected date range.': 'Registros del intervalo seleccionado.',
      'Profile': 'Perfil',
      'Date range': 'Intervalo de fechas',
      'Recorded days': 'Días con registros',
      'No records for this period.': 'No hay registros para este periodo.',
      'No entries recorded in this section.': 'No hay datos registrados en esta sección.',
      'Synthetic demo data': 'Datos de demostración sintéticos',
      'Synthetic demo data; these are not real readings.': 'Datos de demostración sintéticos; no son mediciones reales.',
      'Health indicators': 'Indicadores de salud',
      'Wellbeing': 'Bienestar',
      'Activity': 'Actividad',
      'Sleep': 'Sueño',
      'Hydration': 'Hidratación',
      'Meals': 'Comidas',
      'Medication log': 'Registro de medicación',
      'Personal baseline comparison': 'Comparación con la referencia personal',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': 'Aún no hay una referencia personal. Aparecerá cuando se guarden suficientes registros fechados.',
      'Baseline differences are descriptive only and do not indicate risk.': 'Las diferencias con la referencia son descriptivas y no indican riesgo.',
      'Measure': 'Medición',
      'Average': 'Promedio',
      'Records': 'Registros',
      'Baseline': 'Referencia',
      'Difference': 'Diferencia',
      'Resting heart rate': 'Frecuencia cardiaca en reposo',
      'Sleep duration': 'Duración del sueño',
      'Sleep efficiency': 'Eficiencia del sueño',
      'Heart rate variability': 'Variabilidad de la frecuencia cardiaca',
      'Daily activity score': 'Puntuación diaria de actividad',
      'Reaction time': 'Tiempo de reacción',
      'Mood check-ins': 'Registros del estado de ánimo',
      'Fatigue': 'Fatiga',
      'Stress': 'Estrés',
      'Completed sessions': 'Sesiones completadas',
      'Completed minutes': 'Minutos completados',
      'Scheduled sessions': 'Sesiones programadas',
      'Skipped sessions': 'Sesiones omitidas',
      'Total sleep': 'Sueño total',
      'Average per logged night': 'Promedio por noche registrada',
      'Logged nights': 'Noches registradas',
      'Total intake': 'Ingesta total',
      'Entries': 'Registros',
      'Scheduled meals': 'Comidas programadas',
      'Eaten': 'Consumidas',
      'Partial': 'Parcial',
      'Skipped': 'Omitido',
      'Taken': 'Tomado',
      'scheduled': 'programado',
      'completed': 'completado',
      'skipped': 'omitido',
      'partial': 'parcial',
      'eaten': 'consumido',
      'taken': 'tomado',
      'Category': 'Categoría',
      'Summary': 'Resumen',
      'Metric': 'Indicador',
      'Date': 'Fecha',
      'Value': 'Valor',
      'Unit': 'Unidad',
      'Details': 'Detalles',
      'Yes': 'Sí',
      'No': 'No',
      'Export CSV': 'Exportar CSV',
      'Print / Save PDF': 'Imprimir / Guardar PDF',
      'Generate a report before exporting.': 'Genera un informe antes de exportarlo.',
      'CSV report downloaded.': 'Informe CSV descargado.',
      'The CSV report could not be created.': 'No se pudo crear el informe CSV.',
      'Future report dates are unavailable.': 'No se pueden seleccionar fechas futuras.',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'Rufus, tu compañero de salud con IA. Este resumen solo describe registros guardados; no evalúa riesgos ni reemplaza las indicaciones médicas de la misión.'
    },
    fr: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL · APERÇUS SANTÉ',
      'Health insights': 'Aperçus santé',
      'Explore your personal baseline and reports built from locally saved data.': 'Consultez votre référence personnelle et les rapports établis à partir des données enregistrées localement.',
      'PERSONAL RECORDS · LOCAL ONLY': 'DONNÉES PERSONNELLES · LOCALES UNIQUEMENT',
      'SYNTHETIC DEMO · ISOLATED': 'DÉMO SYNTHÉTIQUE · ISOLÉE',
      'View demo data': 'Voir les données de démo',
      'Return to my data': 'Revenir à mes données',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': 'Données de démonstration synthétiques ; elles ne sont ni personnelles ni issues de la NASA. Elles restent isolées dans cette vue et ne modifient pas votre profil. Les exports de démonstration sont signalés comme synthétiques.',
      'Health insights views': 'Vues des aperçus santé',
      'Personal Baseline': 'Référence personnelle',
      'Daily Report': 'Rapport quotidien',
      'Weekly Report': 'Rapport hebdomadaire',
      'ASTROVITAL HEALTH REPORTS': 'RAPPORTS DE SANTÉ ASTROVITAL',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · RAPPORT DE SANTÉ',
      'Health report': 'Rapport de santé',
      'Health reports': 'Rapports de santé',
      'Daily and weekly summaries of information saved in your profile.': 'Résumés quotidiens et hebdomadaires des informations enregistrées dans votre profil.',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': 'Les rapports utilisent uniquement les données enregistrées dans ce profil local. Les exports CSV et imprimés sont créés sur cet appareil ; aucune donnée de santé n’est téléversée. Les notes privées et détails nutritionnels sont exclus du CSV. Les informations déclarées et illustratives ne constituent ni un diagnostic ni un conseil médical.',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': 'Les rapports de démonstration utilisent des données synthétiques isolées à titre illustratif uniquement. Elles ne sont ni enregistrées dans votre profil ni mélangées à vos données personnelles. Les exports CSV et imprimés sont créés sur cet appareil ; aucune donnée de santé n’est téléversée. Les notes privées et détails nutritionnels sont exclus du CSV. Ces données ne sont ni des mesures personnelles ou de la NASA, ni un diagnostic ou un conseil médical.',
      'Report period': 'Période du rapport',
      'Daily': 'Quotidien',
      'Weekly': 'Hebdomadaire',
      'Weekly · 7 days ending on selected date': 'Hebdomadaire · 7 jours jusqu’à la date choisie',
      'Ending date': 'Date de fin',
      'Generate report': 'Générer le rapport',
      'Daily summary': 'Résumé quotidien',
      'Weekly summary': 'Résumé hebdomadaire',
      'Records in the selected date range.': 'Données enregistrées sur la période choisie.',
      'Profile': 'Profil',
      'Date range': 'Période',
      'Recorded days': 'Jours avec données',
      'No records for this period.': 'Aucune donnée pour cette période.',
      'No entries recorded in this section.': 'Aucune donnée enregistrée dans cette section.',
      'Synthetic demo data': 'Données de démonstration synthétiques',
      'Synthetic demo data; these are not real readings.': 'Données de démonstration synthétiques ; ces mesures ne sont pas réelles.',
      'Health indicators': 'Indicateurs de santé',
      'Wellbeing': 'Bien-être',
      'Activity': 'Activité',
      'Sleep': 'Sommeil',
      'Hydration': 'Hydratation',
      'Meals': 'Repas',
      'Medication log': 'Journal des médicaments',
      'Personal baseline comparison': 'Comparaison à la référence personnelle',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': 'Aucune référence personnelle n’est encore disponible. Elle apparaîtra après l’enregistrement d’un nombre suffisant de données datées.',
      'Baseline differences are descriptive only and do not indicate risk.': 'Les écarts par rapport à la référence sont descriptifs et n’indiquent pas un risque.',
      'Measure': 'Mesure',
      'Average': 'Moyenne',
      'Records': 'Enregistrements',
      'Baseline': 'Référence',
      'Difference': 'Écart',
      'Resting heart rate': 'Fréquence cardiaque au repos',
      'Sleep duration': 'Durée du sommeil',
      'Sleep efficiency': 'Efficacité du sommeil',
      'Heart rate variability': 'Variabilité de la fréquence cardiaque',
      'Daily activity score': 'Score d’activité quotidien',
      'Reaction time': 'Temps de réaction',
      'Mood check-ins': 'Points de suivi de l’humeur',
      'Fatigue': 'Fatigue',
      'Stress': 'Stress',
      'Completed sessions': 'Séances terminées',
      'Completed minutes': 'Minutes effectuées',
      'Scheduled sessions': 'Séances planifiées',
      'Skipped sessions': 'Séances ignorées',
      'Total sleep': 'Sommeil total',
      'Average per logged night': 'Moyenne par nuit enregistrée',
      'Logged nights': 'Nuits enregistrées',
      'Total intake': 'Apport total',
      'Entries': 'Entrées',
      'Scheduled meals': 'Repas planifiés',
      'Eaten': 'Pris',
      'Partial': 'Partiel',
      'Skipped': 'Ignoré',
      'Taken': 'Pris',
      'scheduled': 'planifié',
      'completed': 'terminé',
      'skipped': 'ignoré',
      'partial': 'partiel',
      'eaten': 'pris',
      'taken': 'pris',
      'Category': 'Catégorie',
      'Summary': 'Résumé',
      'Metric': 'Indicateur',
      'Date': 'Date',
      'Value': 'Valeur',
      'Unit': 'Unité',
      'Details': 'Détails',
      'Yes': 'Oui',
      'No': 'Non',
      'Export CSV': 'Exporter en CSV',
      'Print / Save PDF': 'Imprimer / Enregistrer en PDF',
      'Generate a report before exporting.': 'Générez un rapport avant de l’exporter.',
      'CSV report downloaded.': 'Rapport CSV téléchargé.',
      'The CSV report could not be created.': 'Impossible de créer le rapport CSV.',
      'Future report dates are unavailable.': 'Les dates futures ne sont pas disponibles.',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'Rufus, votre compagnon de santé IA. Ce résumé décrit uniquement les données enregistrées ; il n’évalue pas les risques et ne remplace pas les consignes médicales de la mission.'
    },
    de: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL · GESUNDHEITSÜBERSICHT',
      'Health insights': 'Gesundheitsübersicht',
      'Explore your personal baseline and reports built from locally saved data.': 'Sieh dir deinen persönlichen Referenzwert und Berichte auf Basis lokal gespeicherter Daten an.',
      'PERSONAL RECORDS · LOCAL ONLY': 'PERSÖNLICHE DATEN · NUR LOKAL',
      'SYNTHETIC DEMO · ISOLATED': 'SYNTHETISCHE DEMO · ISOLIERT',
      'View demo data': 'Demodaten anzeigen',
      'Return to my data': 'Zu meinen Daten zurückkehren',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': 'Synthetische Demodaten; keine persönlichen oder NASA-Messwerte. Demodaten bleiben auf diese Ansicht beschränkt; deine gespeicherten Profildaten bleiben unverändert. Demo-Exporte sind als synthetisch gekennzeichnet.',
      'Health insights views': 'Ansichten der Gesundheitsübersicht',
      'Personal Baseline': 'Persönlicher Referenzwert',
      'Daily Report': 'Tagesbericht',
      'Weekly Report': 'Wochenbericht',
      'ASTROVITAL HEALTH REPORTS': 'ASTROVITAL GESUNDHEITSBERICHTE',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · GESUNDHEITSBERICHT',
      'Health report': 'Gesundheitsbericht',
      'Health reports': 'Gesundheitsberichte',
      'Daily and weekly summaries of information saved in your profile.': 'Tages- und Wochenübersichten der in deinem Profil gespeicherten Angaben.',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': 'Berichte verwenden nur Daten aus diesem lokalen Profil. CSV- und Druckexporte werden auf diesem Gerät erstellt; es werden keine Gesundheitsdaten hochgeladen. Private Notizen und Nährwertangaben sind vom CSV-Export ausgeschlossen. Selbstangaben und Beispieldaten sind keine Diagnose oder medizinische Beratung.',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': 'Demoberichte verwenden ausschließlich isolierte synthetische Daten zur Veranschaulichung. Sie werden weder im Profil gespeichert noch mit persönlichen Einträgen vermischt. CSV- und Druckexporte werden auf diesem Gerät erstellt; es werden keine Gesundheitsdaten hochgeladen. Private Notizen und Nährwertangaben sind vom CSV-Export ausgeschlossen. Demodaten sind keine persönlichen oder NASA-Messwerte, Diagnosen oder medizinischen Ratschläge.',
      'Report period': 'Berichtszeitraum',
      'Daily': 'Täglich',
      'Weekly': 'Wöchentlich',
      'Weekly · 7 days ending on selected date': 'Wöchentlich · 7 Tage bis zum gewählten Datum',
      'Ending date': 'Enddatum',
      'Generate report': 'Bericht erstellen',
      'Daily summary': 'Tagesübersicht',
      'Weekly summary': 'Wochenübersicht',
      'Records in the selected date range.': 'Gespeicherte Einträge im ausgewählten Zeitraum.',
      'Profile': 'Profil',
      'Date range': 'Datumsbereich',
      'Recorded days': 'Tage mit Einträgen',
      'No records for this period.': 'Für diesen Zeitraum liegen keine Einträge vor.',
      'No entries recorded in this section.': 'In diesem Abschnitt wurden keine Einträge gespeichert.',
      'Synthetic demo data': 'Synthetische Demodaten',
      'Synthetic demo data; these are not real readings.': 'Synthetische Demodaten; dies sind keine echten Messwerte.',
      'Health indicators': 'Gesundheitsindikatoren',
      'Wellbeing': 'Wohlbefinden',
      'Activity': 'Aktivität',
      'Sleep': 'Schlaf',
      'Hydration': 'Flüssigkeitsaufnahme',
      'Meals': 'Mahlzeiten',
      'Medication log': 'Medikamentenprotokoll',
      'Personal baseline comparison': 'Vergleich mit persönlichem Referenzwert',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': 'Noch ist kein persönlicher Referenzwert verfügbar. Er erscheint, sobald genügend datierte Einträge gespeichert sind.',
      'Baseline differences are descriptive only and do not indicate risk.': 'Abweichungen vom Referenzwert dienen nur der Beschreibung und zeigen kein Risiko an.',
      'Measure': 'Messwert',
      'Average': 'Durchschnitt',
      'Records': 'Einträge',
      'Baseline': 'Referenz',
      'Difference': 'Abweichung',
      'Resting heart rate': 'Ruheherzfrequenz',
      'Sleep duration': 'Schlafdauer',
      'Sleep efficiency': 'Schlafeffizienz',
      'Heart rate variability': 'Herzfrequenzvariabilität',
      'Daily activity score': 'Täglicher Aktivitätswert',
      'Reaction time': 'Reaktionszeit',
      'Mood check-ins': 'Stimmungseinträge',
      'Fatigue': 'Erschöpfung',
      'Stress': 'Stress',
      'Completed sessions': 'Abgeschlossene Einheiten',
      'Completed minutes': 'Abgeschlossene Minuten',
      'Scheduled sessions': 'Geplante Einheiten',
      'Skipped sessions': 'Ausgelassene Einheiten',
      'Total sleep': 'Gesamtschlaf',
      'Average per logged night': 'Durchschnitt pro erfasster Nacht',
      'Logged nights': 'Erfasste Nächte',
      'Total intake': 'Gesamtaufnahme',
      'Entries': 'Einträge',
      'Scheduled meals': 'Geplante Mahlzeiten',
      'Eaten': 'Gegessen',
      'Partial': 'Teilweise',
      'Skipped': 'Ausgelassen',
      'Taken': 'Eingenommen',
      'scheduled': 'geplant',
      'completed': 'abgeschlossen',
      'skipped': 'ausgelassen',
      'partial': 'teilweise',
      'eaten': 'gegessen',
      'taken': 'eingenommen',
      'Category': 'Kategorie',
      'Summary': 'Zusammenfassung',
      'Metric': 'Messgröße',
      'Date': 'Datum',
      'Value': 'Wert',
      'Unit': 'Einheit',
      'Details': 'Details',
      'Yes': 'Ja',
      'No': 'Nein',
      'Export CSV': 'CSV exportieren',
      'Print / Save PDF': 'Drucken / als PDF speichern',
      'Generate a report before exporting.': 'Erstelle vor dem Export einen Bericht.',
      'CSV report downloaded.': 'CSV-Bericht heruntergeladen.',
      'The CSV report could not be created.': 'Der CSV-Bericht konnte nicht erstellt werden.',
      'Future report dates are unavailable.': 'Zukünftige Berichtsdaten sind nicht verfügbar.',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'Rufus, dein KI-Gesundheitsbegleiter. Diese Übersicht beschreibt nur gespeicherte Einträge; sie bewertet keine Risiken und ersetzt nicht die medizinischen Vorgaben der Mission.'
    },
    zh: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL 健康概览',
      'Health insights': '健康概览',
      'Explore your personal baseline and reports built from locally saved data.': '查看个人基线以及根据本地保存数据生成的报告。',
      'PERSONAL RECORDS · LOCAL ONLY': '个人记录 · 仅限本地',
      'SYNTHETIC DEMO · ISOLATED': '合成演示 · 独立数据',
      'View demo data': '查看演示数据',
      'Return to my data': '返回我的数据',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': '合成演示数据，并非个人或 NASA 测量值。演示记录仅用于此视图，不会更改已保存的个人资料。演示导出会标记为合成数据。',
      'Health insights views': '健康概览视图',
      'Personal Baseline': '个人基线',
      'Daily Report': '每日报告',
      'Weekly Report': '每周报告',
      'ASTROVITAL HEALTH REPORTS': 'ASTROVITAL 健康报告',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · 健康报告',
      'Health report': '健康报告',
      'Health reports': '健康报告',
      'Daily and weekly summaries of information saved in your profile.': '查看个人资料中已保存信息的每日和每周摘要。',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': '报告仅使用此本地个人资料中记录的数据。CSV 和打印导出文件均在此设备上生成，不会上传健康数据。CSV 不包含私人备注和营养详情。自我报告和示例信息不构成诊断或医疗建议。',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': '演示报告仅使用隔离的合成数据进行说明，不会保存到个人资料或与个人记录混合。CSV 和打印导出文件均在此设备上生成，不会上传健康数据。CSV 不包含私人备注和营养详情。演示数据并非个人或 NASA 测量值，也不构成诊断或医疗建议。',
      'Report period': '报告周期',
      'Daily': '每日',
      'Weekly': '每周',
      'Weekly · 7 days ending on selected date': '每周 · 截至所选日期的 7 天',
      'Ending date': '结束日期',
      'Generate report': '生成报告',
      'Daily summary': '每日摘要',
      'Weekly summary': '每周摘要',
      'Records in the selected date range.': '所选日期范围内的已记录数据。',
      'Profile': '个人资料',
      'Date range': '日期范围',
      'Recorded days': '有记录的天数',
      'No records for this period.': '此期间没有记录。',
      'No entries recorded in this section.': '此部分没有记录。',
      'Synthetic demo data': '合成演示数据',
      'Synthetic demo data; these are not real readings.': '合成演示数据；这些并非真实测量值。',
      'Health indicators': '健康指标',
      'Wellbeing': '身心健康',
      'Activity': '活动',
      'Sleep': '睡眠',
      'Hydration': '饮水',
      'Meals': '餐食',
      'Medication log': '用药记录',
      'Personal baseline comparison': '个人基线比较',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': '目前尚无个人基线。保存足够的带日期记录后，此处将显示基线。',
      'Baseline differences are descriptive only and do not indicate risk.': '基线差异仅用于描述，不代表风险。',
      'Measure': '指标',
      'Average': '平均值',
      'Records': '记录数',
      'Baseline': '基线',
      'Difference': '差值',
      'Resting heart rate': '静息心率',
      'Sleep duration': '睡眠时长',
      'Sleep efficiency': '睡眠效率',
      'Heart rate variability': '心率变异性',
      'Daily activity score': '每日活动评分',
      'Reaction time': '反应时间',
      'Mood check-ins': '情绪记录',
      'Fatigue': '疲劳',
      'Stress': '压力',
      'Completed sessions': '已完成次数',
      'Completed minutes': '已完成分钟数',
      'Scheduled sessions': '计划次数',
      'Skipped sessions': '跳过次数',
      'Total sleep': '睡眠总时长',
      'Average per logged night': '每个记录夜晚的平均值',
      'Logged nights': '已记录夜晚',
      'Total intake': '总摄入量',
      'Entries': '条目数',
      'Scheduled meals': '计划餐食',
      'Eaten': '已进食',
      'Partial': '部分完成',
      'Skipped': '已跳过',
      'Taken': '已服用',
      'scheduled': '已计划',
      'completed': '已完成',
      'skipped': '已跳过',
      'partial': '部分完成',
      'eaten': '已进食',
      'taken': '已服用',
      'Category': '类别',
      'Summary': '摘要',
      'Metric': '指标',
      'Date': '日期',
      'Value': '数值',
      'Unit': '单位',
      'Details': '详情',
      'Yes': '是',
      'No': '否',
      'Export CSV': '导出 CSV',
      'Print / Save PDF': '打印 / 保存为 PDF',
      'Generate a report before exporting.': '请先生成报告再导出。',
      'CSV report downloaded.': 'CSV 报告已下载。',
      'The CSV report could not be created.': '无法创建 CSV 报告。',
      'Future report dates are unavailable.': '无法选择未来日期。',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'Rufus 是您的 AI 健康伙伴。本摘要仅描述已保存记录，不评估风险，也不替代任务医疗指导。'
    },
    ja: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL 健康インサイト',
      'Health insights': '健康インサイト',
      'Explore your personal baseline and reports built from locally saved data.': '個人ベースラインと、端末に保存されたデータに基づくレポートを確認できます。',
      'PERSONAL RECORDS · LOCAL ONLY': '個人記録 · 端末内のみ',
      'SYNTHETIC DEMO · ISOLATED': '合成デモ · 分離済み',
      'View demo data': 'デモデータを表示',
      'Return to my data': '自分のデータに戻る',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': '合成デモデータです。個人またはNASAの測定値ではありません。デモ記録はこのビュー内だけで使用され、保存済みプロフィールは変更されません。デモのエクスポートには合成データと表示されます。',
      'Health insights views': '健康インサイトの表示',
      'Personal Baseline': '個人ベースライン',
      'Daily Report': '日次レポート',
      'Weekly Report': '週次レポート',
      'ASTROVITAL HEALTH REPORTS': 'ASTROVITAL 健康レポート',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · 健康レポート',
      'Health report': '健康レポート',
      'Health reports': '健康レポート',
      'Daily and weekly summaries of information saved in your profile.': 'プロフィールに保存された情報の日次・週次サマリーを確認できます。',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': 'レポートにはこのローカルプロフィールに記録されたデータのみを使用します。CSV と印刷用データはこの端末上で作成され、健康データはアップロードされません。CSV には個人的なメモや栄養の詳細は含まれません。自己申告およびサンプル情報は診断や医療上の助言ではありません。',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': 'デモレポートでは説明用の合成データのみを使用します。プロフィールには保存されず、個人記録とも混在しません。CSV と印刷用データはこの端末上で作成され、健康データはアップロードされません。CSV には個人的なメモや栄養の詳細は含まれません。デモデータは個人やNASAの測定値、診断、医療上の助言ではありません。',
      'Report period': 'レポート期間',
      'Daily': '日次',
      'Weekly': '週次',
      'Weekly · 7 days ending on selected date': '週次 · 選択日までの7日間',
      'Ending date': '終了日',
      'Generate report': 'レポートを作成',
      'Daily summary': '日次サマリー',
      'Weekly summary': '週次サマリー',
      'Records in the selected date range.': '選択した期間に記録されたデータです。',
      'Profile': 'プロフィール',
      'Date range': '期間',
      'Recorded days': '記録がある日数',
      'No records for this period.': 'この期間の記録はありません。',
      'No entries recorded in this section.': 'このセクションに記録はありません。',
      'Synthetic demo data': '合成デモデータ',
      'Synthetic demo data; these are not real readings.': '合成デモデータです。実際の測定値ではありません。',
      'Health indicators': '健康指標',
      'Wellbeing': 'ウェルビーイング',
      'Activity': '活動',
      'Sleep': '睡眠',
      'Hydration': '水分補給',
      'Meals': '食事',
      'Medication log': '服薬記録',
      'Personal baseline comparison': '個人ベースラインとの比較',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': '個人ベースラインはまだありません。日付付きの記録が十分に保存されると表示されます。',
      'Baseline differences are descriptive only and do not indicate risk.': 'ベースラインとの差は説明目的のみで、リスクを示すものではありません。',
      'Measure': '指標',
      'Average': '平均',
      'Records': '記録数',
      'Baseline': 'ベースライン',
      'Difference': '差',
      'Resting heart rate': '安静時心拍数',
      'Sleep duration': '睡眠時間',
      'Sleep efficiency': '睡眠効率',
      'Heart rate variability': '心拍変動',
      'Daily activity score': '1日の活動スコア',
      'Reaction time': '反応時間',
      'Mood check-ins': '気分の記録',
      'Fatigue': '疲労',
      'Stress': 'ストレス',
      'Completed sessions': '完了したセッション',
      'Completed minutes': '実施時間（分）',
      'Scheduled sessions': '予定されたセッション',
      'Skipped sessions': 'スキップしたセッション',
      'Total sleep': '睡眠合計',
      'Average per logged night': '記録された夜ごとの平均',
      'Logged nights': '記録された夜',
      'Total intake': '摂取量の合計',
      'Entries': '記録数',
      'Scheduled meals': '予定された食事',
      'Eaten': '摂取済み',
      'Partial': '一部',
      'Skipped': 'スキップ',
      'Taken': '服用済み',
      'scheduled': '予定',
      'completed': '完了',
      'skipped': 'スキップ',
      'partial': '一部',
      'eaten': '摂取済み',
      'taken': '服用済み',
      'Category': 'カテゴリ',
      'Summary': 'サマリー',
      'Metric': '指標',
      'Date': '日付',
      'Value': '値',
      'Unit': '単位',
      'Details': '詳細',
      'Yes': 'はい',
      'No': 'いいえ',
      'Export CSV': 'CSVをエクスポート',
      'Print / Save PDF': '印刷 / PDFで保存',
      'Generate a report before exporting.': 'エクスポートする前にレポートを作成してください。',
      'CSV report downloaded.': 'CSVレポートをダウンロードしました。',
      'The CSV report could not be created.': 'CSVレポートを作成できませんでした。',
      'Future report dates are unavailable.': '未来の日付は選択できません。',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'RufusはあなたのAI健康コンパニオンです。このサマリーは保存済みの記録のみを示し、リスク評価やミッションの医療指針の代わりにはなりません。'
    },
    ar: {
      'ASTROVITAL HEALTH INSIGHTS': 'ASTROVITAL · رؤى صحية',
      'Health insights': 'رؤى صحية',
      'Explore your personal baseline and reports built from locally saved data.': 'اطّلع على خط الأساس الشخصي والتقارير المستندة إلى البيانات المحفوظة محليًا.',
      'PERSONAL RECORDS · LOCAL ONLY': 'سجلات شخصية · محلية فقط',
      'SYNTHETIC DEMO · ISOLATED': 'عرض تجريبي اصطناعي · معزول',
      'View demo data': 'عرض البيانات التجريبية',
      'Return to my data': 'العودة إلى بياناتي',
      'Synthetic demo data; not personal or NASA readings. Demo records are isolated to this view; your saved profile data will not change. Demo exports are marked synthetic.': 'بيانات تجريبية اصطناعية وليست قياسات شخصية أو من NASA. تظل سجلات العرض التجريبي معزولة في هذا العرض ولا تغيّر ملفك المحفوظ. تُوسم صادرات العرض بأنها اصطناعية.',
      'Health insights views': 'عروض الرؤى الصحية',
      'Personal Baseline': 'خط الأساس الشخصي',
      'Daily Report': 'التقرير اليومي',
      'Weekly Report': 'التقرير الأسبوعي',
      'ASTROVITAL HEALTH REPORTS': 'تقارير ASTROVITAL الصحية',
      'ASTROVITAL · HEALTH REPORT': 'ASTROVITAL · تقرير صحي',
      'Health report': 'تقرير صحي',
      'Health reports': 'التقارير الصحية',
      'Daily and weekly summaries of information saved in your profile.': 'ملخصات يومية وأسبوعية للمعلومات المحفوظة في ملفك الشخصي.',
      'Reports use only data recorded in this local profile. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Self-reported and illustrative information is not a diagnosis or medical advice.': 'تستخدم التقارير البيانات المسجلة في هذا الملف المحلي فقط. تُنشأ ملفات CSV والطباعة على هذا الجهاز، ولا تُرفع أي بيانات صحية. تُستبعد الملاحظات الخاصة وتفاصيل التغذية من CSV. المعلومات المبلغ عنها ذاتيًا والتوضيحية ليست تشخيصًا أو نصيحة طبية.',
      'Demo reports use isolated synthetic data for illustration only. They are not saved to your profile or mixed with personal records. CSV and print exports are created on this device; no health data are uploaded. Private notes and nutrition details are excluded from CSV. Demo data are not personal or NASA readings, diagnoses, or medical advice.': 'تستخدم تقارير العرض بيانات اصطناعية معزولة لأغراض التوضيح فقط. لا تُحفظ في ملفك الشخصي ولا تختلط بسجلاتك الشخصية. تُنشأ ملفات CSV والطباعة على هذا الجهاز، ولا تُرفع أي بيانات صحية. تُستبعد الملاحظات الخاصة وتفاصيل التغذية من CSV. بيانات العرض ليست قياسات شخصية أو من NASA، ولا تشخيصًا أو نصيحة طبية.',
      'Report period': 'فترة التقرير',
      'Daily': 'يومي',
      'Weekly': 'أسبوعي',
      'Weekly · 7 days ending on selected date': 'أسبوعي · 7 أيام تنتهي في التاريخ المحدد',
      'Ending date': 'تاريخ الانتهاء',
      'Generate report': 'إنشاء التقرير',
      'Daily summary': 'ملخص يومي',
      'Weekly summary': 'ملخص أسبوعي',
      'Records in the selected date range.': 'السجلات ضمن النطاق الزمني المحدد.',
      'Profile': 'الملف الشخصي',
      'Date range': 'النطاق الزمني',
      'Recorded days': 'الأيام المسجلة',
      'No records for this period.': 'لا توجد سجلات لهذه الفترة.',
      'No entries recorded in this section.': 'لا توجد مدخلات مسجلة في هذا القسم.',
      'Synthetic demo data': 'بيانات تجريبية اصطناعية',
      'Synthetic demo data; these are not real readings.': 'بيانات تجريبية اصطناعية؛ وليست قياسات حقيقية.',
      'Health indicators': 'المؤشرات الصحية',
      'Wellbeing': 'العافية',
      'Activity': 'النشاط',
      'Sleep': 'النوم',
      'Hydration': 'الترطيب',
      'Meals': 'الوجبات',
      'Medication log': 'سجل الأدوية',
      'Personal baseline comparison': 'المقارنة بخط الأساس الشخصي',
      'A personal baseline is not available yet. It will appear after enough dated records are saved.': 'لا يتوفر خط أساس شخصي بعد. سيظهر بعد حفظ عدد كافٍ من السجلات المؤرخة.',
      'Baseline differences are descriptive only and do not indicate risk.': 'الفروق عن خط الأساس وصفية فقط ولا تشير إلى وجود مخاطر.',
      'Measure': 'المؤشر',
      'Average': 'المتوسط',
      'Records': 'السجلات',
      'Baseline': 'خط الأساس',
      'Difference': 'الفرق',
      'Resting heart rate': 'معدل ضربات القلب أثناء الراحة',
      'Sleep duration': 'مدة النوم',
      'Sleep efficiency': 'كفاءة النوم',
      'Heart rate variability': 'تباين معدل ضربات القلب',
      'Daily activity score': 'نتيجة النشاط اليومي',
      'Reaction time': 'زمن الاستجابة',
      'Mood check-ins': 'تسجيلات الحالة المزاجية',
      'Fatigue': 'الإرهاق',
      'Stress': 'التوتر',
      'Completed sessions': 'الجلسات المكتملة',
      'Completed minutes': 'الدقائق المكتملة',
      'Scheduled sessions': 'الجلسات المجدولة',
      'Skipped sessions': 'الجلسات الفائتة',
      'Total sleep': 'إجمالي النوم',
      'Average per logged night': 'المتوسط لكل ليلة مسجلة',
      'Logged nights': 'الليالي المسجلة',
      'Total intake': 'إجمالي الكمية',
      'Entries': 'المدخلات',
      'Scheduled meals': 'الوجبات المجدولة',
      'Eaten': 'تم تناولها',
      'Partial': 'جزئي',
      'Skipped': 'تم تخطيها',
      'Taken': 'تم تناولها',
      'scheduled': 'مجدول',
      'completed': 'مكتمل',
      'skipped': 'تم تخطيه',
      'partial': 'جزئي',
      'eaten': 'تم تناوله',
      'taken': 'تم تناوله',
      'Category': 'الفئة',
      'Summary': 'الملخص',
      'Metric': 'المقياس',
      'Date': 'التاريخ',
      'Value': 'القيمة',
      'Unit': 'الوحدة',
      'Details': 'التفاصيل',
      'Yes': 'نعم',
      'No': 'لا',
      'Export CSV': 'تصدير CSV',
      'Print / Save PDF': 'طباعة / حفظ PDF',
      'Generate a report before exporting.': 'أنشئ تقريرًا قبل تصديره.',
      'CSV report downloaded.': 'تم تنزيل تقرير CSV.',
      'The CSV report could not be created.': 'تعذر إنشاء تقرير CSV.',
      'Future report dates are unavailable.': 'لا تتوفر تواريخ تقارير مستقبلية.',
      'Rufus, your AI health companion. This summary describes saved records only; it does not assess risk or replace mission medical guidance.': 'Rufus رفيقك الصحي بالذكاء الاصطناعي. يصف هذا الملخص السجلات المحفوظة فقط؛ ولا يقيّم المخاطر أو يحل محل الإرشادات الطبية للمهمة.'
    }
  };
  for (const translationsByLanguage of [brandingTranslations, healthReportTranslations]) {
    for (const [language, translations] of Object.entries(translationsByLanguage)) {
      Object.assign(catalogs[language], translations);
    }
  }

  const supportedLocales = new Set(['en', ...Object.keys(catalogs)]);
  const textSource = new WeakMap();
  const textOutput = new WeakMap();
  const attributeState = new WeakMap();
  const localizedAttributes = ['placeholder', 'title', 'aria-label', 'alt'];
  const exactCatalogs = new Map();
  const patternCatalogs = new Map();
  let locale = 'en';

  function getExactCatalog(language) {
    if (!exactCatalogs.has(language)) {
      exactCatalogs.set(language, new Map(Object.entries(catalogs[language] || {})));
    }
    return exactCatalogs.get(language);
  }

  function getPatternCatalog(language) {
    if (!patternCatalogs.has(language)) {
      const entries = [];
      for (const [source, translated] of Object.entries(catalogs[language] || {})) {
        const variables = [...source.matchAll(/__RUFUS_VAR_(\d+)__/g)].map((match) => match[1]);
        if (!variables.length) continue;
        const specificity = source.replace(/__RUFUS_VAR_\d+__/g, '')
          .replace(/[^A-Za-z\u00c0-\u024f\u4e00-\u9fff\u3040-\u30ff\u0600-\u06ff]/g, '').length;
        if (specificity < 2) continue;
        const parts = source.split(/__RUFUS_VAR_\d+__/g).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const expression = new RegExp(`^${parts.join('([\\s\\S]*?)')}$`);
        entries.push({ source, translated, variables, expression, specificity });
      }
      entries.sort((a, b) => b.specificity - a.specificity || b.source.length - a.source.length);
      patternCatalogs.set(language, entries);
    }
    return patternCatalogs.get(language);
  }

  function translate(source) {
    if (locale === 'en') return source;
    const leading = source.match(/^\s*/)[0];
    const trailing = source.match(/\s*$/)[0];
    const normalized = source.trim().replace(/\s+/g, ' ');
    const exactCatalog = getExactCatalog(locale);
    const brandNames = normalized.match(/\b(?:AstroVital|Rufus)\b/gi) || [];
    const candidates = [normalized];
    if (brandNames.length === 1) {
      candidates.push(normalized.replace(/\b(?:AstroVital|Rufus)\b/gi, 'RUFUS'));
    }
    for (const candidate of candidates) {
      const exact = exactCatalog.get(candidate);
      if (exact !== undefined) return `${leading}${normalizeBrandName(exact, normalized)}${trailing}`;
      for (const entry of getPatternCatalog(locale)) {
        const match = candidate.match(entry.expression);
        if (!match) continue;
        let output = entry.translated;
        entry.variables.forEach((variable, index) => {
          const value = match[index + 1];
          const translatedValue = value === 'start' || value === 'end'
            ? exactCatalog.get(value) || value
            : value;
          output = output.replaceAll(`__RUFUS_VAR_${variable}__`, translatedValue);
        });
        return `${leading}${normalizeBrandName(output, normalized)}${trailing}`;
      }
    }
    return source;
  }

  function normalizeBrandName(value, source) {
    const hasAstroVital = /\bAstroVital\b/i.test(source);
    const hasRufus = /\bRufus\b/i.test(source);
    if (hasAstroVital === hasRufus) return value;
    const name = hasAstroVital ? 'AstroVital' : 'Rufus';
    return value
      .replace(/\b(?:ASTROVITAL|RUFUS|RUFO)\b/gi, name)
      .replace(/鲁弗斯|ルーファス|روفوس/g, name);
  }

  function canTranslateNode(node) {
    const parent = node.parentElement;
    if (!parent || parent.closest('script,style,noscript,textarea,code,pre,[data-user-content]')) return false;
    return true;
  }

  function localizeTextNode(node) {
    if (!canTranslateNode(node)) return;
    const current = node.nodeValue;
    const previousOutput = textOutput.get(node);
    const source = previousOutput === current ? textSource.get(node) : current;
    textSource.set(node, source);
    const output = translate(source);
    if (output !== current) {
      textOutput.set(node, output);
      node.nodeValue = output;
    } else {
      textOutput.set(node, current);
    }
  }

  function localizeAttribute(element, attribute) {
    if (attribute === 'content' && !element.matches('meta[name="description"],meta[property="og:description"]')) return;
    const current = element.getAttribute(attribute);
    if (current === null) return;
    let attributes = attributeState.get(element);
    if (!attributes) {
      attributes = new Map();
      attributeState.set(element, attributes);
    }
    const previous = attributes.get(attribute);
    const source = previous && previous.output === current ? previous.source : current;
    const output = translate(source);
    attributes.set(attribute, { source, output });
    if (output !== current) element.setAttribute(attribute, output);
  }

  function localizeElement(element) {
    const attributes = element.matches('meta[name="description"],meta[property="og:description"]')
      ? [...localizedAttributes, 'content']
      : localizedAttributes;
    for (const attribute of attributes) {
      localizeAttribute(element, attribute);
    }
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) localizeTextNode(node);
    for (const descendant of element.querySelectorAll('*')) {
      const descendantAttributes = descendant.matches('meta[name="description"],meta[property="og:description"]')
        ? [...localizedAttributes, 'content']
        : localizedAttributes;
      for (const attribute of descendantAttributes) {
        localizeAttribute(descendant, attribute);
      }
    }
  }

  function setLocale(nextLocale) {
    if (!supportedLocales.has(nextLocale)) {
      throw new RangeError(`Unsupported AstroVital language: ${nextLocale}`);
    }
    locale = nextLocale;
    document.documentElement.lang = nextLocale === 'zh' ? 'zh-Hans' : nextLocale;
    document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
    localizeElement(document.documentElement);
    document.dispatchEvent(new CustomEvent('rufus:localechange', { detail: { locale } }));
  }

  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      if (change.type === 'characterData') {
        localizeTextNode(change.target);
      } else if (change.type === 'attributes') {
        localizeAttribute(change.target, change.attributeName);
      } else {
        for (const node of change.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) localizeTextNode(node);
          else if (node.nodeType === Node.ELEMENT_NODE) localizeElement(node);
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...localizedAttributes, 'content']
  });

  window.RufusI18n = Object.freeze({
    get locale() { return locale; },
    get localeTag() {
      return ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN', ja: 'ja-JP', ar: 'ar' })[locale];
    },
    setLocale,
    translate
  });
})();
