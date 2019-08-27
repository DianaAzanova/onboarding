/**
 * Локализация лендингов
 *
 * browserLang - локаль браузера
 * fakeLangSwitcher - фэйковый триггер для переключения локали
 * langSwitcher - переключатель локалей
 * selectedLangCookie - сохраненная в куку локаль
 * translations - переводы
 * existLangs - набор локалей для данного лендинга
 * tw - traditional
 * cn - simplified
 */
var browserLang = window.navigator.language;

switch (browserLang) {
    case 'zh-TW':
        browserLang = 'tw';
        break;
    case 'zh-CN':
        browserLang = 'cn';
        break;
    default:
        browserLang = browserLang.substr(0, 2);
        break;
}

var fakeLangSwitcher = $('#selectLanguageDropdown'),
    langSwitcher = $('#txt_head_select_language'),
    selectedLangCookie = $.cookie('selectedLang'),
    langCode = $.cookie('langCode');

var translations = {
    'defaultLanguage': 'en_GB',
    'strings': {
        'id:txt_header_btn_buy': {
            'ru_RU': 'Предзаказ',
            'de_DE': 'VORBESTELLEN',
            'es_ES': 'RESERVAR',
            'fr_FR': "PRÉCOMMANDER",
            'pt_PT': 'PRÉ-COMPRAR',
            'pl_PL': 'ZAMÓW W PRZEDSPRZEDAŻY',
            'zh_CN': '预购',
            'ja_JP': 'PRE-ORDER',
            'it_IT': 'PRE-ACQUISTO'
        },
        'id:txt_header_btn_buy2': {
            'ru_RU': 'Предзаказ',
            'de_DE': 'VORBESTELLEN',
            'es_ES': 'RESERVAR',
            'fr_FR': "PRÉCOMMANDER",
            'pt_PT': 'PRÉ-COMPRAR',
            'pl_PL': 'ZAMÓW W PRZEDSPRZEDAŻY',
            'zh_CN': '预购',
            'ja_JP': 'PRE-ORDER',
            'it_IT': 'PRE-ACQUISTO'
        },
        'id:txt_hero_btn_play': {
            'ru_RU': 'Смотреть трейлер',
            'de_DE': 'Trailer ansehen',
            'es_ES': 'Ver trailer',
            'fr_FR': "Voir bande-annonce",
            'pt_PT': 'Assistir ao trailer',
            'pl_PL': 'Odtwórz zwiastun',
            'zh_CN': '请观看游戏视频',
            'ja_JP': '予告編を見る',
            'it_IT': 'Vedi trailer'
        },
        'id:txt_hero_lead': {
            'ru_RU': 'Твой герой - славный воин, павший в бою. Но вместо заслуженного отдыха в Асгарде его душа оказывается в суровом мире Нифльхейм. Выживи в этом мире, возведи себе крепость, грабь соседей, исследуй опасные подземелья и найди свой путь в Вальхаллу',
            'de_DE': 'Dein Avatar ist ein tapferer Krieger, der im Kampf gefallen ist. Doch statt des Friedens in Asgard ist seine Seele in der rauen Welt von Niffelheim gefangen. Überlebe in dieser feindlichen Welt, durchsuche die Nachbarländer, erkunde gefährliche Dungeons und finde deinen Weg nach Valhalla.',
            'es_ES': 'Tu avater es un valiente guerrero que ha caído en batalla. Pero en lugar de la bien merecida paz en Asgard, su alma está atrapada en el cruel mundo de Niffelheim. Sobrevive en este mundo hostil, saquea las tierras vecinas, explora las peligrosas mazmorras y encuentra tu camino a Valhalla.',
            'fr_FR': "Votre avatar est un guerrier courageux qui est tombé au combat. Mais au lieu d'une paix bien méritée à Asgard, son âme est prise au piège dans le monde rude de Niffelheim. Surviver dans ce monde hostile, saccager les terres voisines, explorer les donjons dangereux et trouver votre chemin vers Valhalla",
            'pt_PT': 'O seu avatar é um guerreiro corajoso que caiu na batalha. Mas em vez de paz bem merecida no Asgard, a alma dele está presa no mundo cruel do Niffelheim. Sobreviva neste mundo hostil, saqueie as terras vizinhas, explore masmorras perigosas e encontre o seu caminho para a Valhalla',
            'pl_PL': 'Twoim awatarem jest odważny wojownik, który poległ w bitwie. Lecz zamiast zasłużonego pokoju w Asgardzie, jego dusza została uwięziona w srogim świecie Niffelheim. Przetrwaj w tym wrogim świecie, ograb sąsiadujące krainy, przemierz niebezpieczne lochy i odnajdź drogę do Walhalli.',
            'zh_CN': '您的主人公是一名战死沙场的光荣烈士。死后本来应该去阿斯加德的他，却来到了尼福尔海姆。努力在这个严酷世界活下来，建筑城堡，抢劫邻居，研究危险重重的地下世界，找到去天堂瓦尔哈拉的路！',
            'ja_JP': 'あなたのアバターは戦闘で倒れた勇敢な戦士です。 しかし、彼の魂は、当然のアスガードで安らかに眠る代わりに、ニッフェルハイムという厳しい世界に閉じ込められています。 この世界で生き残って、隣地を襲撃し、危険なダンジョンを探索し、ヴァルハラへの道を見つけなさい',
            'it_IT': 'Il tuo avatar è un guerriero coraggioso caduto in battaglia. Ma anziché godere della meritata pace ad Asgard, la sua anima è intrappolata nel crudo mondo di Niffelheim. Sopravvivi in questa realtà ostile, saccheggia le terre vicine, esplora pericolose segrete e trova la strada per il Valhalla'
        },
        'id:txt_pack_h3_standart': {
            'ru_RU': 'Стандартное издание',
            'de_DE': 'Standard Edition',
            'es_ES': 'Edición estándar',
            'fr_FR': "Édition standard",
            'pt_PT': 'Edição standard',
            'pl_PL': 'Edycja standardowa',
            'zh_CN': '标准版本',
            'ja_JP': 'スタンダードエディション',
            'it_IT': 'Edizione standard'
        },
        'id:txt_pack_h3_deluxe': {
            'ru_RU': 'Набор из 4',
            'de_DE': '4-Set Edition',
            'es_ES': 'Edición 4-pack',
            'fr_FR': "Édition 4-pack",
            'pt_PT': 'Edição 4-pack',
            'pl_PL': 'Czteropak',
            'zh_CN': '4-pack版本',
            'ja_JP': '4-packエディション',
            'it_IT': 'Edizione 4-pack'
        },
        'id:txt_pack_text_standart': {
            'ru_RU': 'В наборе 1 ключ Steam',
            'de_DE': '1 Steam Key Enthalten',
            'es_ES': 'Incluye 1 clave de Steam',
            'fr_FR': "Comprend 1 mot de passe Steam",
            'pt_PT': 'Inclui 1 chave do Steam',
            'pl_PL': 'Zawiera 1 klucz produktu Steam',
            'zh_CN': '包含1个steam的激活卡',
            'ja_JP': 'Steamキー1つ付き',
            'it_IT': 'Comprende 1 chiave di Steam'
        },
        'id:txt_pack_text_deluxe': {
            'ru_RU': 'В наборе 4 ключа Steam',
            'de_DE': '4 Steam Keys Enthalten',
            'es_ES': 'Incluye 4 claves de Steam',
            'fr_FR': "Comprend 4 mots de passe Steam",
            'pt_PT': 'Inclui 4 chaves do Steam',
            'pl_PL': 'Zawiera 4 klucze produktu Steam',
            'zh_CN': '包含4个steam的激活卡',
            'ja_JP': 'Steamキー4つ付き',
            'it_IT': 'Comprende 4 chiavi di Steam'
        },
        'id:txt_hero_subscribe': {
            'ru_RU': 'Подписаться на новости',
            'de_DE': 'Unsere News abonnieren',
            'es_ES': 'Suscribirse al boletín',
            'fr_FR': "Abonnez-vous pour recevoir des nouvelles",
            'pt_PT': 'Assinar para receber notícias',
            'pl_PL': 'Subskrybuj, aby otrzymywać wiadomości',
            'zh_CN': '订阅新消息',
            'ja_JP': 'ニュースレターに登録',
            'it_IT': 'Iscriviti al bollettino'
        },
        'value::id:btn_subscribe': {
            'ru_RU': 'Подписаться',
            'de_DE': 'Abonnieren',
            'es_ES': 'Suscribirse',
            'fr_FR': "S'abboner",
            'pt_PT': 'Assinar',
            'pl_PL': 'Subskrybuj',
            'zh_CN': '订阅',
            'ja_JP': '登録',
            'it_IT': 'Iscriviti'
        },
        'id:txt_hero_gamepedia': {
            'ru_RU': '<div id="txt_hero_gamepedia" class="lead_hero">Или узнать о Niffelheim на <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a></div>',
            'de_DE': '<div id="txt_hero_gamepedia" class="lead_hero">Oder mehr über Niffelheim auf <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a> erfahren</div>',
            'es_ES': '<div id="txt_hero_gamepedia" class="lead_hero">O leer sobre Niffelheim en <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a></div>',
            'fr_FR': '<div id="txt_hero_gamepedia" class="lead_hero">Ou lire à propos de Niffelheim à <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a></div>',
            'pt_PT': '<div id="txt_hero_gamepedia" class="lead_hero">Ou leia sobre Niffelheim na <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a></div>',
            'pl_PL': '<div id="txt_hero_gamepedia" class="lead_hero">Lub przeczytaj informacje o grze Niffelheim na <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedii</a></div>',
            'zh_CN': '<div id="txt_hero_gamepedia" class="lead_hero">或在游戏百科上面阅读《死人之国》<a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">的信息</a>。</div>',
            'ja_JP': '<div id="txt_hero_gamepedia" class="lead_hero">または、<a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a>でNiffelheimについて読む</div>',
            'it_IT': '<div id="txt_hero_gamepedia" class="lead_hero">O leggi su <a href="https://niffelheim.gamepedia.com/Niffelheim_Wiki" target="_blank" class="t_link">Gamepedia</a> informazioni su Niffelheim</div>'
        },
        'id:txt_hero_platforms': {
            'ru_RU': 'Релиз Niffelheim на платформах Xbox One, Play Station 4, Switch запланирован на первый квартал 2019',
            'de_DE': 'Niffelheim wird für Xbox One, Play Station 4 und Switch im ersten Quartal 2019 veröffentlicht',
            'es_ES': 'Niffelheim estará disponible para Xbox One, Play Station 4 y Switch el primer trimestre del 2019',
            'fr_FR': "La sortie officielle de Niffelheim sur Xbox One, Play Station 4, Switch est prévue pour le premier trimestre de 2019",
            'pt_PT': 'Niffelheim estará disponível para Xbox One, Play Station 4, no primeiro trimestre',
            'pl_PL': 'Premiera Niffelheim na platformy Xbox One, Play Station 4 i Switch planowana jest na pierwszy kwartał 2019 r.',
            'zh_CN': 'Niffelheim将于2019年第一季度的Xbox One，Play Station 4，Switch上市',
            'ja_JP': '2019年第1四半期に、Xbox One、Play Station 4、Switch向けのNiffelheimリリース',
            'it_IT': 'Niffelheim sarà disponibile per Xbox One, Play Station 4 e Switch nel primo quadrimestre del 2019'
        },
        'id:txt_h2_features': {
            'ru_RU': 'Ключевые особенности игры',
            'de_DE': 'Die wichtigsten Spielfunktionen',
            'es_ES': 'Características clave del juego',
            'fr_FR': "Caractéristiques clés du jeu",
            'pt_PT': 'Principais características do jogo',
            'pl_PL': 'Główne cechy gry',
            'zh_CN': '这个游戏的重要特征如下',
            'ja_JP': 'ゲームの主な特徴',
            'it_IT': 'Caratteristiche principali'
        },
        'id:txt_features_1': {
            'ru_RU': 'Огромный открытый мир древних курганов и захоронений, погружающий игроков в глубины тьмы',
            'de_DE': 'Eine riesige offene Welt der alten Gräber und Grabstellen, die die Spieler in die Tiefen der Finsternis eintauchen lassen',
            'es_ES': 'Un amplio mundo de antiguos sepulcros y necrópolis que sumerge a los jugadores en las profundidades de las tinieblas',
            'fr_FR': "Un vaste monde d'anciennes tombes et de nécropoles qui submerge les joueurs dans les profondeurs de l'obscurité",
            'pt_PT': 'Um enorme mundo aberto com túmulos e sepulturas ancestrais que é capaz de levar os jogadores aos lugares mais sombrios',
            'pl_PL': 'Ogromny otwarty świat starożytnych kurhanów, grobowców i mrocznych zakątków świata do przemierzenia',
            'zh_CN': '在古墓葬和墓地的广阔世界里，玩家沉浸在黑暗的深处。',
            'ja_JP': 'プレイヤーを闇の深みに沈める古い墓地と埋葬地の広い世界。',
            'it_IT': "Un enorme mondo aperto di antichi tumuli e tombe che porteranno il giocatore nei più pericolosi angoli dell'oscurità"
        },
        'id:txt_features_2': {
            'ru_RU': 'Прорисованная вручную графика с потрясающей детализацией',
            'de_DE': 'Wunderschöne per Hand gezeichnete Grafik mit erstaunlicher Detaillierung',
            'es_ES': 'Gráficos dibujados a mano, cuidando al máximo cada detalle',
            'fr_FR': "Graphiques dessinés à la main, en soignant au maximum chaque détail",
            'pt_PT': 'Lindos cenários pintados à mão e com níveis de detalhes surpreendentes',
            'pl_PL': 'Piękne, ręcznie malowane tła o oszałamiającej szczegółowości',
            'zh_CN': '手工绘制的图形，考虑到了每一个细节。',
            'ja_JP': 'ディテールにこだわった手描きのグラフィック。',
            'it_IT': 'Stupendi scenari disegnati a mano con un sorprendente livello di dettaglio'
        },
        'id:txt_features_3': {
            'ru_RU': 'Четыре игровых локации с уникальным визуальным дизайном',
            'de_DE': 'Vier spielbare Welten mit einzigartigen individuellen Landschaften',
            'es_ES': 'Cuatro mundos de juego con sus propios efectos visuales',
            'fr_FR': "Quatre mondes de jeu avec leurs propres effets visuels",
            'pt_PT': 'Quatro localizações jogáveis, cada uma com um visual único',
            'pl_PL': 'Cztery grywalne lokacje o unikatowym charakterze',
            'zh_CN': '在四个游戏世界都使用属于自己的视觉效果设计。',
            'ja_JP': 'それぞれ独自のビジュアル効果を備えた４つの世界。',
            'it_IT': 'Quattro ambientazioni giocabili, ognuna con il proprio stile'
        },
        'id:txt_features_4': {
            'ru_RU': 'Огромная свобода действий: исследуй мир, подвластный древним духам, выполняй задания жрецов, сражайся и захватывай земли в борьбе за господство – возможности фактически безграничны',
            'de_DE': 'Reichliche Flexibilität vom Spielprozess: Entdecken Sie die Welt von uralten Geistern, führen Sie die Aufgaben von den Priestern durch, kämpfen Sie, um weitere Länder zu erobern - die Möglichkeiten sind unendlich',
            'es_ES': 'Gran libertad de acción: explora un mundo dominado por espíritus ancestrales, haz misiones encomendadas por los sacerdotes, combate y conquista tierras en la lucha por el poder. ¡Las posibilidades son casi ilimitadas!',
            'fr_FR': "Une grande liberté d'action : explorez un monde dominé par des esprits ancestraux, complétez des missions qui vous confiées par les prêtres, combattez et conquérez des terres dans la lutte pour le pouvoir. Les possibilités sont quasi illimitées !",
            'pt_PT': 'Grande liberdade de ação: explore um mundo governado por espíritos ancestrais, complete as missões encomendadas por sacerdotes, batalhe contra inimigos e conquiste territórios na luta pela supremacia - as possibilidades são praticamente ilimitadas',
            'pl_PL': 'Ogromna swoboda działania: eksploruj świat rządzony przez pradawne duchy, wykonuj zadania zlecane przez kapłanów, walcz z wrogami i podbijaj terytoria w walce o supremację – możliwości są praktycznie nieograniczone',
            'zh_CN': '动作舒展度很高：探讨被祖先神灵所主宰的世界，通过做祭司来完成任务，通过使用权利来征服土地。可能性几乎是无限的！',
            'ja_JP': '非常に自由なアクション：古代からの霊が支配する世界を探検し、神官のクエストを遂行し、戦い、権力闘争の中、土地を征服する。可能性はほぼ無限！',
            'it_IT': 'Grande libertà di azione: esplora un mondo dominato da antichi spiriti, completa le missioni dei Sacerdoti, combatti i nemici in battaglia e conquista il territorio nella lotta per la supremazia – le possibilità sono virtualmente infinite'
        },
        'id:txt_features_5': {
            'ru_RU': 'Уникальная генерация подземного мира с бесконечными подземельями и пещерами, где таятся неописуемые существа и монстры, а также несметные сокровища',
            'de_DE': 'Einzigartig gestaltete Unterwelt mit endlosen Kerkern und Höhlen mit unzähligen Schätzen, wo außergewöhnliche Wesen und Monster schwärmen',
            'es_ES': 'Generación aleatoria del mundo subterráneo con interminables mazmorras y cuevas donde se ocultan horribles criaturas y tesoros de incalculable valor',
            'fr_FR': "Génération aléatoire du monde souterrain avec d'interminables oubliettes et des grottes où se camouflent des créatures horribles et des trésors d'une valeur incalculable",
            'pt_PT': 'Geração aleatória do submundo com infinitas masmorras e cavernas infestadas de monstros e criaturas extraordinárias, bem como de inúmeros tesouros',
            'pl_PL': 'Unikatowa losowa generacja świata podziemi o niekończących się korytarzach i jaskiniach pełnych niezwykłych stworzeń i potworów, a także niezliczonych skarbów',
            'zh_CN': '随机产生无尽的地牢和洞穴，那些可怕的生物和无价的珍宝被隐藏在黑暗的社会里。',
            'ja_JP': '地下の世界をランダムに創造。果てしないダンジョンと洞窟には、恐ろしい怪物と計り知れない価値を持つ宝があふれている。',
            'it_IT': 'Generazione procedurale implementata in maniera unica per la creazione di un sottosuolo con antri e caverne senza fine, brulicanti di creature straordinarie, mostri e innumerevoli tesori'
        },
        'id:txt_features_6': {
            'ru_RU': 'Борьба за выживание в беспощадном мире вероломных духов: добывай ресурсы, выходи на охоту, отстраивай крепость, работай в мастерских, создавая уникальные предметы, оружие и инструменты',
            'de_DE': 'Überlebenskampf in der unbarmherzigen Welt der dunklen Geister: Sie können Ressourcen sammeln, Tiere jagen, Ihre Festung aufbauen, einzigartige Gegenstände, Waffen und Werkzeuge erschaffen und vieles mehr',
            'es_ES': 'Lucha por la supervivencia en el despiadado mundo de espíritus traicioneros: recolecta recursos, caza, construye tu fortaleza, trabaja en los talleres, crea objetos, armas y herramientas únicos',
            'fr_FR': "Luttez par la survie dans l'impitoyable monde d'esprits traîtres : recueillez des ressources, chassez, construisez votre forteresse, travaillez dans les ateliers et créez des objets, des armes et des outils uniques",
            'pt_PT': 'Lute pela sobrevivência em um mundo impiedoso e cheio de espíritos traiçoeiros: colete recursos, cace animais, construa a sua fortaleza, fabrique ferramentas, armas e itens únicos nas oficinas',
            'pl_PL': 'Walcz o przetrwanie w bezwzględnym świecie zdradliwych duchów: gromadź zasoby, poluj na zwierzęta, rozbudowuj twierdzę, twórz unikatowe przedmioty, broń i narzędzia w warsztacie',
            'zh_CN': '争取使用不同的技巧来获得生存的可能，这其中包括：采集资源，狩猎，打造属于你的实力，在车间里工作，创建物品，武器和独特的工具等。',
            'ja_JP': '裏切りの霊の冷酷な世界で、生き残りをかけて戦う。資源を集め、狩り、要塞を建て、作業場で働き、他にはない物・武器・器具を作る。',
            'it_IT': 'Lotta per sopravvivere ad uno spietato mondo di spiriti insidiosi: raccogli risorse, caccia animali, costruisci la tua fortezza, crea oggetti unici, armi e utensili nei tuoi laboratori'
        },
        'id:txt_features_7': {
            'ru_RU': 'Различные режимы игры: одиночное прохождение, PvP, командный и кооперативный режимы',
            'de_DE': 'Verschiedene Spielmodi: Einzelspieler, PvP, Team und Koop-Modus',
            'es_ES': 'Diferentes modos de juego: campañas de un jugador, PvP, juego en grupo y modo cooperativo',
            'fr_FR': "Différents modes de jeu : campagnes pour un joueur, PvP, jeu en groupe et en mode coopération",
            'pt_PT': 'Vários modos de jogo: campanha de um jogador, PvP, jogo em equipe e modo cooperativo',
            'pl_PL': 'Dostępne tryby gry: tryb dla jednego gracza, PvP, tryb drużynowy oraz kooperacyjny',
            'zh_CN': '可供选择的不同游戏模式：单人战役模式，PVP模式，小组合作模式，组合模式。',
            'ja_JP': '様々なゲームモード：シングルプレイヤー、PvP、チームゲーム、協力モード。',
            'it_IT': 'Differenti modalità di gioco: giocatore singolo, a squadre e cooperativo'
        },
        'id:txt_requirements_h2': {
            'ru_RU': 'СИСТЕМНЫЕ ТРЕБОВАНИЯ',
            'de_DE': 'SYSTEMANFORDERUNGEN',
            'es_ES': 'REQUISITOS DEL SISTEMA',
            'fr_FR': "CONFIGURATION REQUISE",
            'pt_PT': 'REQUISITOS DE SISTEMA',
            'pl_PL': 'WYMAGANIA SYSTEMOWE',
            'zh_CN': '系统需求',
            'ja_JP': 'システム要件',
            'it_IT': 'REQUISITI DI SISTEMA'
        },
        'class:minimum': {
            'ru_RU': 'Минимальные',
            'de_DE': 'Minimum',
            'es_ES': 'MÍNIMO',
            'fr_FR': "MINIMALE",
            'pt_PT': 'MÍNIMOS',
            'pl_PL': 'MINIMALNE',
            'zh_CN': '最低配置',
            'ja_JP': '最低',
            'it_IT': 'MINIMI'
        },
        'class:recommended': {
            'ru_RU': 'Рекомендуемые',
            'de_DE': 'Empfohlen',
            'es_ES': 'Recomendado',
            'fr_FR': "RECOMMANDÉE",
            'pt_PT': 'RECOMENDADOS',
            'pl_PL': 'ZALECANE',
            'zh_CN': '推荐配置',
            'ja_JP': '推奨',
            'it_IT': 'CONSIGLIATI'
        },
        'class:os': {
            'ru_RU': 'OC:',
            'de_DE': 'Betriebssystem:',
            'es_ES': 'SO:',
            'fr_FR': "Système d'exploitation:",
            'pt_PT': 'SO:',
            'pl_PL': 'System operacyjny:',
            'zh_CN': '操作系统：',
            'ja_JP': 'OS：',
            'it_IT': 'Sistema operativo:'
        },
        'class:processor': {
            'ru_RU': 'Процессор:',
            'de_DE': 'Prozessor:',
            'es_ES': 'Procesador:',
            'fr_FR': "Processeur:",
            'pt_PT': 'Processador:',
            'pl_PL': 'Procesor:',
            'zh_CN': '处理器：',
            'ja_JP': 'プロセッサー：',
            'it_IT': 'Processore:'
        },
        'class:ram': {
            'ru_RU': 'RAM:',
            'de_DE': 'Arbeitsspeicher:',
            'es_ES': 'Memoria RAM:',
            'fr_FR': "Mémoire vive:",
            'pt_PT': 'Memória:',
            'pl_PL': 'Pamięć:',
            'zh_CN': '内存：',
            'ja_JP': 'メモリー：',
            'it_IT': 'Memoria:'
        },
        'class:graphics': {
            'ru_RU': 'Видеокарта:',
            'de_DE': 'Grafik:',
            'es_ES': 'Gráficos:',
            'fr_FR': "Graphiques:",
            'pt_PT': 'Placa de vídeo:',
            'pl_PL': 'Karta graficzna:',
            'zh_CN': '图形：',
            'ja_JP': 'グラフィック：',
            'it_IT': 'Scheda video:'
        },
        'class:directx': {
            'ru_RU': 'DirectX:',
            'de_DE': 'DirectX:',
            'es_ES': 'DirectX:',
            'fr_FR': "DirectX:",
            'pt_PT': 'DirectX:',
            'pl_PL': 'DirectX:',
            'zh_CN': 'DirectX 版本：',
            'ja_JP': 'DirectX：',
            'it_IT': 'DirectX:'
        },
        'class:storage': {
            'ru_RU': 'Свободное место на диске:',
            'de_DE': 'Speicherplatz:',
            'es_ES': 'Espacio en disco:',
            'fr_FR': "Espace disque:",
            'pt_PT': 'Armazenamento:',
            'pl_PL': 'Miejsce na dysku:',
            'zh_CN': '存储空间：',
            'ja_JP': 'ストレージ：',
            'it_IT': 'Memoria:'
        },
        'class:addnotes': {
            'ru_RU': 'Дополнительно:',
            'de_DE': 'Zusätzliche Anmerkungen:',
            'es_ES': 'Notas adicionales:',
            'fr_FR': "Notes supplémentaires:",
            'pt_PT': 'Outras observações:',
            'pl_PL': 'Dodatkowe uwagi:',
            'zh_CN': '附注事项：',
            'ja_JP': '追記事項：',
            'it_IT': 'Note aggiuntive:'
        }
    }
};

var existLangs = {
    'ru': {
        'ru_RU': 'РУССКИЙ'
    },
    'de': {
        'de_DE': 'DEUTSCH'
    },
    'es': {
        'es_ES': 'ESPAÑOL'
    },
    'fr': {
        'fr_FR': 'FRANÇAIS'
    },
    'pt': {
        'pt_PT': 'PORTUGUÊS (BR)'
    },
    'pl': {
        'pl_PL': 'POLSKI'
    },
    'cn': {
        'zh_CN': '简体中文'
    },
    'ja': {
        'ja_JP': '日本語'
    },
    'it': {
        'it_IT': 'ITALIANO'
    },
    'en': {
        'en_GB': 'English'
    }
};

fakeLangSwitcher.localizationTool(translations);

var utlPath = window.location.pathname.replace(/\//g, '');
var urlLang = existLangs[utlPath] !== undefined ? Object.keys(existLangs[utlPath])[0] : null;
if (urlLang !== null) {
    // определение по url
    var langFullName = existLangs[utlPath][urlLang];
    fakeLangSwitcher.localizationTool('translate', urlLang, langSwitcher, langFullName);
    browserLang = utlPath;
} else {
    // определение по cookie
    var cookieLang = (typeof langCode !== 'undefined') ? langCode : null;
    if (existLangs[cookieLang] !== undefined && existLangs[cookieLang][selectedLangCookie] !== undefined) {
        fakeLangSwitcher.localizationTool('translate', selectedLangCookie, langSwitcher, existLangs[cookieLang][selectedLangCookie]);
        browserLang = cookieLang;
    } else {
        // определение по языку браузера
        var existLang = existLangs[browserLang] ? existLangs[browserLang] : existLangs['en'];
        var translationLangCode = Object.keys(existLang)[0],
            switcherText = existLang[translationLangCode];
        fakeLangSwitcher.localizationTool('translate', translationLangCode, langSwitcher, switcherText);
    }
}

$('.x_head_drop_lang').click(function () {
    var clickedLang = $(this).data('lang');
    $.cookie('selectedLang', clickedLang, { path: '/' });
    fakeLangSwitcher.localizationTool('translate', clickedLang, langSwitcher, $(this).attr('data-lang-str'));

    switch (clickedLang) {
        case 'zh_TW':
            clickedLang = 'tw';
            break;
        case 'zh_CN':
            clickedLang = 'cn';
            break;
        default:
            clickedLang = clickedLang.substr(0, 2);
            break;
    }
    $.cookie('langCode', clickedLang, { path: '/' });

    options1.access_data.settings.language = clickedLang;
    options2.access_data.settings.language = clickedLang;
    XPay2PlayWidget.create(options1);
    XPay2PlayWidget.create(options2);

    if (clickedLang !== 'en') {
        history.pushState(null, '', '/' + clickedLang);
    } else {
        history.pushState(null, '', '/');
    }

    GDPR.State.onChangeIsAllowedDataCollection(function (isAllowedDataCollection) {
        if (isAllowedDataCollection) {
            analytics();
        }
    });

    GDPR.initialize({
        state: {
            productName: 'landing_niffelheim',
            locale: clickedLang
        }
    }, function (err, form) {
        if (err || !form) {
            return;
        }

        form.onAgreeButtonClick(function () {
            analytics();
        });
    });
});

var options1 = {
    access_data: {
        "settings": {
            "language": browserLang,
            "ui": {
                "theme": "dark"
            },
            "project_id": 30135 //PROJECT ID
        },
        "purchase": {
            "pin_codes": {
                "codes": [{
                    "digital_content": "1key" //SKU NAME IN PUBLISHER
                }]
            }
        }
    },
    theme: {
        foreground: "gold",
        background: "dark"
    },
    target_element: "#XS-pay2play-widget-1", //TARGET
    template: "simple",
    lightbox: {
        height: "685px"
    }
};
var options2 = {
    access_data: {
        "settings": {
            "language": browserLang,
            "ui": {
                "theme": "dark"
            },
            "project_id": 30135 //PROJECT ID
        },
        "purchase": {
            "pin_codes": {
                "codes": [{
                    "digital_content": "4keys" //SKU NAME IN PUBLISHER
                }]
            }
        }
    },
    theme: {
        foreground: "gold",
        background: "dark"
    },
    target_element: "#XS-pay2play-widget-2", //TARGET
    template: "simple",
    lightbox: {
        height: "685px"
    }
};

var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = "https://static.xsolla.com/embed/pay2play/2.1.7/widget.min.js";
s.addEventListener("load", function (e) {
    XPay2PlayWidget.create(options1);
    XPay2PlayWidget.create(options2);
}, false);
var head = document.getElementsByTagName("head")[0];
head.appendChild(s);
