import { initStage } from './hero3d.js';
import { createAudio } from './audio.js';

{
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
document.documentElement.classList.add('js');

let lang = store.get('nf-lang') || 'en';
const T = o => (typeof o === 'string' ? o : (o[lang] || o.en));
const t2 = (o, tag = 'span', cls = '') => typeof o === 'string'
  ? `<${tag}${cls ? ` class="${cls}"` : ''}>${esc(o)}</${tag}>`
  : `<${tag}${cls ? ` class="${cls}"` : ''} data-en="${esc(o.en)}" data-es="${esc(o.es)}">${esc(T(o))}</${tag}>`;

/* ---------------- data ---------------- */
const ADS = [
  { id: 'titanium', title: 'MRB Titanium Series', type: { en: 'Tech commercial', es: 'Anuncio de tecnología' }, dur: '33 s', model: 'Omni 1.2 & Veo 3',
    desc: { en: 'Launch film for noise-cancelling headphones: from a world of noise to engineered silence, with the same product and glowing monogram in every shot.', es: 'Película de lanzamiento para unos auriculares con cancelación de ruido: de un mundo de ruido al silencio, con el mismo producto y el monograma iluminado en cada plano.' },
    hd: 'https://drive.google.com/file/d/1siJqH4Vx4trtaU1z6ruCJgzvh52Z0ZMF/view?usp=share_link' },
  { id: 'obsidian', title: 'MRB The Obsidian', type: { en: 'Fragrance commercial', es: 'Anuncio de perfume' }, dur: '30 s', model: 'Seedance 2.5',
    desc: { en: 'An eau de parfum told through a black panther, an obsidian throne and chains, with the same face and the same bottle in every shot.', es: 'Un eau de parfum contado con una pantera negra, un trono de obsidiana y cadenas, con la misma cara y el mismo frasco en cada plano.' },
    hd: 'https://drive.google.com/file/d/1-F1Pfa46smKg39VrTjJls8hssGzjSxOM/view?usp=share_link' },
  { id: 'petal', title: 'MRB Petal Glow Serum', type: { en: 'Beauty commercial', es: 'Anuncio de belleza' }, dur: '31 s', model: 'Seedance 2.5',
    desc: { en: 'A macro drop, a rose petal on still water, the serum on skin and a sunset hero shot. Stills built in Canva AI, animated shot by shot.', es: 'Una gota en macro, un pétalo sobre agua en calma, el sérum sobre la piel y un plano final al atardecer. Imágenes creadas con Canva AI y animadas plano a plano.' },
    hd: 'https://drive.google.com/file/d/1D6LSBHER1MU1yX43KoI1YfW5eh6UhP0P/view?usp=sharing' },
  { id: 'handbag', title: 'MRB Handbag', type: { en: 'Fashion commercial', es: 'Anuncio de moda' }, dur: '33 s', model: 'Veo 3 Flash & Omni 1.2',
    desc: { en: 'A blush leather handbag followed through a Madrid morning, from a sunlit street to a café table, closing on “The luxury of a pause.”', es: 'Un bolso de piel rosa empolvado que recorre una mañana en Madrid, de una calle soleada a la mesa de un café, y cierra con “The luxury of a pause”.' },
    hd: 'https://drive.google.com/file/d/1LIPjkTZ8MXUa9gNG_Z8rjNjU2M5ViySS/view?usp=share_link' },
  { id: 'sneakers', title: 'MRB Sneakers', type: { en: 'Product commercial', es: 'Anuncio de producto' }, dur: '43 s', model: 'Omni 1.2',
    desc: { en: 'A futuristic sneaker launch with neon light trails, a lightning-charged reveal and a night run.', es: 'Lanzamiento de unas zapatillas futuristas con estelas de neón, una revelación cargada de rayos y una carrera nocturna.' },
    hd: 'https://drive.google.com/file/d/1ReJaw5YAkoviyfQuueQcRTjI7zQrIDvr/view?usp=sharing' },
  { id: 'morning', title: 'Pink Morning', type: { en: 'Lifestyle commercial', es: 'Anuncio lifestyle' }, dur: '27 s', model: 'Seedance 2.5',
    desc: { en: 'Waking up, pouring coffee and scrolling, with the same face, outfit and room held across every shot.', es: 'Despertarse, servir el café y mirar el móvil, con la misma cara, el mismo look y la misma habitación en todos los planos.' },
    hd: 'https://drive.google.com/file/d/1bctGOAN5aL1zTLjksnovdUmnmM8RNReP/view?usp=share_link' },
  { id: 'clairdelune', title: 'MRB Clair de Lune', type: { en: 'Jewellery commercial', es: 'Anuncio de joyería' }, dur: '49 s', model: 'Omni 1.2 & Veo 3', vertical: true,
    desc: { en: 'A moonstone heart necklace followed through sand, water, satin and crystal, the same piece in every shot, closing on “Wear the moon.”', es: 'Un collar de corazón con piedra luna que pasa por arena, agua, satén y cristal, la misma pieza en cada plano, y cierra con “Wear the moon”.' },
    hd: 'https://drive.google.com/file/d/1-NyaOnDrL4Fzvfl4Xv6C7oyOgXBi2cFZ/view?usp=share_link' }
];
const HELIX_AD = ['titanium', 'obsidian', 'petal', 'handbag', 'sneakers', 'morning', 'clairdelune', 'petal', 'obsidian', 'titanium', 'sneakers', 'clairdelune', 'morning', 'handbag'];

const TOOLS = [
  ['Higgsfield', { en: 'video & image platform', es: 'plataforma de vídeo e imagen' }],
  ['Seedance 2.5', { en: 'video', es: 'vídeo' }],
  ['Kling 3.0', { en: 'video', es: 'vídeo' }],
  ['Veo 3', { en: 'video', es: 'vídeo' }],
  ['Nano Banana Pro', { en: 'image', es: 'imagen' }],
  ['Magnific', { en: 'image & upscaling', es: 'imagen y escalado' }],
  ['Omni 1.2', { en: 'video', es: 'vídeo' }],
  ['Google Flow', { en: 'AI filmmaking', es: 'cine con IA' }],
  ['Canva AI', { en: 'design', es: 'diseño' }],
  ['Three.js', { en: '3D web', es: 'web 3D' }],
  ['GSAP', { en: 'motion', es: 'animación' }],
  ['Meta Ads', { en: 'paid social', es: 'publicidad en redes' }],
  ['Google Ads', { en: 'search & display', es: 'búsqueda y display' }]
];
const TOOL_BG = ['#D9CCFF', '#CFE0FF', '#E7DCFF', '#C9D8FF', '#E0D4FF', '#D6E9FF'];

const IC = {
  film: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10 9.5v5l4-2.5z" fill="#1A1540"/></svg>',
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
  app: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><rect x="7" y="2.5" width="10" height="19" rx="3"/><path d="M11 18.5h2"/></svg>',
  social: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
  reel: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 10v4l3-2z" fill="#1A1540"/></svg>',
  banner: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 14l3-3 3 3 2-2 2 2"/></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  growth: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><path d="M4 19h16M6 15l4-4 3 3 5-6"/><path d="M15 8h3v3"/></svg>',
  brief: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h5"/></svg>',
  world: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="#1A1540"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="#1A1540" stroke-width="1.8" stroke-linecap="round"><path d="M12 3c4 2 6 6 5 11l-3 3h-4l-3-3c-1-5 1-9 5-11z"/><circle cx="12" cy="10" r="1.8"/><path d="M8 17l-2 4M16 17l2 4"/></svg>'
};

const SERVICES = [
  { ic: 'film', go: 'commercials', go_l: { en: 'See the commercials', es: 'Ver los anuncios' }, media: { v: 'media/ads/petal.mp4', p: 'media/posters/petal.webp' }, chip: { en: 'AI commercial', es: 'Anuncio con IA' },
    t: { en: 'AI commercials & brand films', es: 'Anuncios con IA y películas de marca' },
    d: { en: 'TV and online spots with consistent characters, exact products and cinematic light. No shoot, no crew.', es: 'Spots para televisión y online con personajes coherentes, el producto exacto y luz de cine. Sin rodaje ni equipo.' },
    tags: [{ en: 'Product launches', es: 'Lanzamientos' }, { en: 'Brand films', es: 'Películas de marca' }, '16:9 · 9:16 · 1:1', { en: 'Music & voice-over', es: 'Música y locución' }] },
  { ic: 'web', go: 'websites', go_l: { en: 'See the websites', es: 'Ver las webs' }, media: { i: 'media/shots/tech-d-3.webp' }, chip: { en: 'Website', es: 'Web' },
    t: { en: 'Websites', es: 'Páginas web' },
    d: { en: 'Landing pages, e-commerce and brand sites with 3D, scroll storytelling and bilingual copy, coded from scratch.', es: 'Landings, e-commerce y webs de marca con 3D, storytelling con scroll y textos bilingües, programadas desde cero.' },
    tags: [{ en: 'E-commerce', es: 'E-commerce' }, { en: '3D & motion', es: '3D y animación' }, { en: 'SEO-ready', es: 'Preparadas para SEO' }, 'EN / ES'] },
  { ic: 'app', go: 'apps', go_l: { en: 'See the apps', es: 'Ver las apps' }, media: { i: 'media/shots/matcha-m-1.webp', pos: '50% 30%' }, chip: { en: 'App', es: 'App' },
    t: { en: 'Apps', es: 'Apps' },
    d: { en: 'Your website turned into an iPhone and Android app, with native navigation, ordering, bookings and push.', es: 'Tu web convertida en app para iPhone y Android, con navegación nativa, pedidos, reservas y notificaciones.' },
    tags: ['iOS & Android', { en: 'Ordering & bookings', es: 'Pedidos y reservas' }, { en: 'From your website', es: 'Desde tu web' }] },
  { ic: 'social', go: 'social', go_l: { en: 'See our social media work', es: 'Ver nuestras redes' }, media: { i: 'media/stills/girl.webp', pos: '50% 35%' }, chip: { en: 'Social media', es: 'Redes sociales' },
    t: { en: 'Social media management', es: 'Gestión de redes sociales' },
    d: { en: 'We run your accounts: strategy, content calendar, posting, community management and monthly reports. We have grown accounts of up to 20K followers.', es: 'Llevamos tus redes: estrategia, calendario, publicación, community management e informes mensuales. Hemos llevado cuentas de hasta 20K seguidores.' },
    tags: ['Instagram', 'TikTok', 'LinkedIn', { en: 'Community management', es: 'Community management' }, { en: 'Monthly reports', es: 'Informes mensuales' }] },
  { ic: 'reel', go: 'social', go_l: { en: 'See the reels', es: 'Ver los reels' }, media: { v: 'media/ads/morning.mp4', p: 'media/posters/morning.webp' }, chip: { en: 'Reels & content', es: 'Reels y contenido' },
    t: { en: 'Reels & social content', es: 'Reels y contenido para redes' },
    d: { en: 'Reels, TikToks, carousels and UGC-style ads designed to stop the scroll and get saved.', es: 'Reels, TikToks, carruseles y anuncios estilo UGC pensados para frenar el scroll y que los guarden.' },
    tags: ['Reels', 'TikTok', { en: 'Carousels', es: 'Carruseles' }, { en: 'UGC-style ads', es: 'Anuncios estilo UGC' }] },
  { ic: 'banner', go: 'gallery', go_l: { en: 'See the banners', es: 'Ver los banners' }, media: { i: 'media/stills/banner-burger.webp' }, chip: { en: 'Banners', es: 'Banners' },
    t: { en: 'Banners & display ads', es: 'Banners y anuncios display' },
    d: { en: 'Campaign sets for Meta, Google and out-of-home, with variants ready for A/B testing.', es: 'Packs de campaña para Meta, Google y exterior, con variantes listas para test A/B.' },
    tags: ['Meta Ads', 'Google Display', { en: 'Out-of-home', es: 'Exterior' }, { en: 'A/B variants', es: 'Variantes A/B' }] },
  { ic: 'photo', go: 'gallery', go_l: { en: 'See the photography', es: 'Ver la fotografía' }, media: { i: 'media/stills/model-jewellery.webp', pos: '50% 30%' }, chip: { en: 'Product photos', es: 'Fotos de producto' },
    t: { en: 'Product photography & brand worlds', es: 'Foto de producto y mundos de marca' },
    d: { en: 'Packshots, lifestyle, packaging and characters that stay the same across a whole campaign.', es: 'Packshots, lifestyle, packaging y personajes que se mantienen iguales durante toda la campaña.' },
    tags: ['Packshots', 'Lifestyle', 'Packaging', { en: 'Moodboards', es: 'Moodboards' }] },
  { ic: 'growth', go: 'contact', go_l: { en: 'Ask for an audit', es: 'Pedir una auditoría' }, media: { i: 'media/shots/tech-d-5.webp' }, chip: { en: 'Ads & SEO', es: 'Campañas y SEO' },
    t: { en: 'Campaigns & growth', es: 'Campañas y crecimiento' },
    d: { en: 'SEO and SEM audits, Meta and Google Ads, analytics and dashboards so the beautiful stuff also sells.', es: 'Auditorías SEO y SEM, Meta y Google Ads, analítica y dashboards para que lo bonito también venda.' },
    tags: [{ en: 'SEO & SEM audits', es: 'Auditorías SEO y SEM' }, 'Meta & Google Ads', { en: 'Dashboards', es: 'Dashboards' }] }
];

const SITES = [
  { id: 'tech', name: 'MRB Tech Store', url: 'https://malurosbolea-ux.github.io/mrb-tech-store/', shots: ['tech-d-3', 'tech-d-2', 'tech-d-5'],
    kind: { en: 'E-commerce · 3D · bilingual', es: 'E-commerce · 3D · bilingüe' },
    d: { en: 'A store for next-gen tech: WebGL hero, product drops, a VR demo booking flow and a lab page, in English and Spanish.', es: 'Una tienda de tecnología de última generación: portada en WebGL, lanzamientos, reserva de demos de realidad virtual y laboratorio, en inglés y español.' },
    tags: ['Three.js', 'GSAP', 'Lenis', { en: 'Bookings', es: 'Reservas' }] },
  { id: 'matcha', name: 'MRB Matcha Bar', url: 'https://malurosbolea-ux.github.io/Mrb-Matcha-bar-/', shots: ['matcha-d-top', 'matcha-d-3', 'matcha-d-5'],
    kind: { en: 'Hospitality · scroll storytelling', es: 'Hostelería · storytelling con scroll' },
    d: { en: 'Drinks that build themselves as you scroll, sound design, a full menu, home delivery and table bookings.', es: 'Bebidas que se montan mientras haces scroll, diseño de sonido, carta completa, pedidos a domicilio y reservas.' },
    tags: [{ en: 'Ordering', es: 'Pedidos' }, { en: 'Sound', es: 'Sonido' }, { en: 'Menu', es: 'Carta' }, 'GSAP'] },
  { id: 'cocktail', name: 'MRB Chinese Cocktail House', url: 'https://malurosbolea-ux.github.io/MRB-Chinese-cocktail-bar-/', shots: ['cocktail-d-top', 'cocktail-d-1', 'cocktail-d-4'],
    kind: { en: 'Luxury hospitality · editorial', es: 'Hostelería de lujo · editorial' },
    d: { en: 'A luxury cocktail house in Madrid with an ink-scroll gallery, its own brand identity, menu and reservations.', es: 'Una coctelería de lujo en Madrid con galería de pergaminos, identidad de marca propia, carta y reservas.' },
    tags: [{ en: 'Brand identity', es: 'Identidad de marca' }, { en: 'Video', es: 'Vídeo' }, 'EN / ES'] },
  { id: 'portfolio', name: 'Malu · Creative universe', url: 'https://malurosbolea-ux.github.io/digital-strategy-portfolio/', shots: ['portfolio-d-top', 'portfolio-d-2'],
    kind: { en: 'Portfolio · 3D game UI', es: 'Portfolio · interfaz 3D de videojuego' },
    d: { en: 'A playable 3D portfolio: roll the die, pick a level and explore live websites, AI work and data projects.', es: 'Un portfolio 3D jugable: tiras el dado, eliges nivel y exploras webs en directo, trabajos con IA y proyectos de datos.' },
    tags: ['3D', { en: 'Game UI', es: 'Interfaz de juego' }, { en: 'Day / night', es: 'Día / noche' }] }
];
const APPS = [
  { id: 'matcha', name: 'MRB Matcha', sub: { en: 'Order & rewards', es: 'Pedidos y puntos' }, icon: 'MRB', bg: 'linear-gradient(135deg,#9BD18B,#F2A7C3)', tint: '#F2A7C3', screens: ['matcha-m-top', 'matcha-m-1', 'matcha-m-4', 'matcha-m-5'],
    tabs: [{ en: 'Home', es: 'Inicio' }, { en: 'Menu', es: 'Carta' }, { en: 'Order', es: 'Pedir' }, { en: 'Book', es: 'Reservar' }] },
  { id: 'tech', name: 'MRB Tech', sub: { en: 'Shop & VR demos', es: 'Tienda y demos VR' }, icon: 'MRB', bg: 'linear-gradient(135deg,#2D4BFF,#0A0C2A)', tint: '#7FA2FF', screens: ['tech-m-top', 'tech-m-2', 'tech-m-3', 'tech-m-5'],
    tabs: [{ en: 'Home', es: 'Inicio' }, { en: 'Shop', es: 'Tienda' }, 'VR Lab', { en: 'Cart', es: 'Cesta' }] },
  { id: 'cocktail', name: 'MRB Cocktail', sub: { en: 'Menu & bookings', es: 'Carta y reservas' }, icon: '玉龙', bg: 'linear-gradient(135deg,#C2182B,#4A0710)', tint: '#FF8C8C', screens: ['cocktail-m-top', 'cocktail-m-3', 'cocktail-m-4', 'cocktail-m-5'],
    tabs: [{ en: 'Home', es: 'Inicio' }, { en: 'Menu', es: 'Carta' }, { en: 'Gallery', es: 'Galería' }, { en: 'Book', es: 'Reservar' }] },
  { id: 'portfolio', name: 'Malu', sub: { en: 'Creative universe', es: 'Universo creativo' }, icon: 'M', bg: 'linear-gradient(135deg,#F4B6D8,#C6B5FF)', tint: '#C6B5FF', screens: ['portfolio-m-top'],
    tabs: [{ en: 'Home', es: 'Inicio' }, { en: 'Work', es: 'Trabajos' }, 'AI', { en: 'Contact', es: 'Contacto' }] }
];

const GALLERY = [
  ['model-jewellery', 614, 1100, { en: 'Jewellery · on model', es: 'Joyería · con modelo' }],
  ['packaging', 614, 1100, { en: 'Packaging', es: 'Packaging' }],
  ['cocktail', 614, 1100, { en: 'Food & drink', es: 'Comida y bebida' }],
  ['bracelet', 1100, 614, { en: 'Product sheet', es: 'Ficha de producto' }],
  ['dress', 614, 1100, { en: 'Fashion', es: 'Moda' }],
  ['banner-beer', 778, 1100, { en: 'Banner', es: 'Banner' }],
  ['character', 614, 1100, { en: 'Consistent character', es: 'Personaje coherente' }],
  ['peach', 614, 1100, { en: 'Moodboard', es: 'Moodboard' }],
  ['earrings', 1100, 614, { en: 'Product sheet', es: 'Ficha de producto' }],
  ['outfit', 614, 1100, { en: 'Loungewear', es: 'Ropa de casa' }],
  ['architecture', 1100, 619, { en: 'Spaces', es: 'Espacios' }],
  ['banner-sushi', 880, 1100, { en: 'Banner', es: 'Banner' }],
  ['dessert', 614, 1100, { en: 'Food styling', es: 'Food styling' }],
  ['charsheet', 1100, 619, { en: 'Character sheet', es: 'Ficha de personaje' }],
  ['packaging-box', 614, 1100, { en: 'Packaging', es: 'Packaging' }],
  ['girl', 614, 1100, { en: 'Lifestyle', es: 'Lifestyle' }],
  ['banner-burger', 1100, 550, { en: 'Banner', es: 'Banner' }]
];

const STEPS = [
  { ic: 'brief', t: { en: 'Brief & strategy', es: 'Brief y estrategia' },
    d: { en: 'We study your brand, audience and data, and turn it all into a creative brief with one clear goal.', es: 'Estudiamos tu marca, tu público y tus datos, y lo convertimos en un brief creativo con un objetivo claro.' },
    s: { en: 'You get: brief + moodboard', es: 'Recibes: brief + moodboard' } },
  { ic: 'world', t: { en: 'Worldbuilding', es: 'Construcción del mundo' },
    d: { en: 'Characters, product, light and locations designed as reference sheets, so everything stays consistent.', es: 'Personajes, producto, luz y localizaciones diseñados como fichas de referencia para que todo sea coherente.' },
    s: { en: 'You get: style frames', es: 'Recibes: fotogramas de estilo' } },
  { ic: 'spark', t: { en: 'Generation & direction', es: 'Generación y dirección' },
    d: { en: 'We generate, select and direct shot by shot across the best models, then edit, grade and add sound and type.', es: 'Generamos, seleccionamos y dirigimos plano a plano con los mejores modelos, y después montamos, etalonamos y añadimos sonido y textos.' },
    s: { en: 'You get: first cut', es: 'Recibes: primer montaje' } },
  { ic: 'rocket', t: { en: 'Launch & optimise', es: 'Lanzamiento y optimización' },
    d: { en: 'Final files for every format, your website, app or social accounts live, and campaigns measured so the next piece performs better.', es: 'Archivos finales para cada formato, tu web, app o redes en marcha y campañas medidas para que la siguiente pieza funcione aún mejor.' },
    s: { en: 'You get: final files + report', es: 'Recibes: archivos finales + informe' } }
];

const PLANS = [
  { id: 'Spark', d: { en: 'A single piece to test the waters.', es: 'Una sola pieza para probar.' },
    items: [{ en: 'One AI commercial, or a photo or banner set', es: 'Un anuncio con IA, o un pack de fotos o banners' }, { en: 'Two rounds of changes', es: 'Dos rondas de cambios' }, { en: 'Every format you need', es: 'Todos los formatos que necesites' }, { en: 'Delivery-ready files', es: 'Archivos listos para publicar' }] },
  { id: 'Launch', hot: true, badge: { en: 'Most requested', es: 'El más pedido' }, d: { en: 'Everything to launch a product or a brand.', es: 'Todo para lanzar un producto o una marca.' },
    items: [{ en: 'AI commercial + reel cut-downs', es: 'Anuncio con IA + versiones para reels' }, { en: 'Website or landing page', es: 'Web o landing page' }, { en: 'Product photography set', es: 'Pack de foto de producto' }, { en: 'Bilingual copy, English and Spanish', es: 'Textos bilingües, inglés y español' }] },
  { id: 'Always-on', d: { en: 'Monthly social media and growth.', es: 'Redes sociales y crecimiento cada mes.' },
    items: [{ en: 'Social media management', es: 'Gestión de redes sociales' }, { en: 'Monthly reels, banners and photos', es: 'Reels, banners y fotos cada mes' }, { en: 'Meta & Google Ads management', es: 'Gestión de Meta y Google Ads' }, { en: 'Monthly performance report', es: 'Informe mensual de resultados' }] }
];

const FAQ = [
  [{ en: 'Do you film anything at all?', es: '¿Grabáis algo?' }, { en: 'No. People, products, places and light are generated and directed with AI. If you send us product photos, we use them as reference so your product stays exact.', es: 'No. Personas, productos, lugares y luz se generan y se dirigen con IA. Si nos mandas fotos de tu producto, las usamos como referencia para que salga exacto.' }],
  [{ en: 'Do you manage social media accounts?', es: '¿Lleváis redes sociales?' }, { en: 'Yes. We run Instagram, TikTok and LinkedIn: strategy, content calendar, posting, community management and a monthly report. We create the content too, so everything looks like one brand.', es: 'Sí. Llevamos Instagram, TikTok y LinkedIn: estrategia, calendario, publicación, community management e informe mensual. También creamos el contenido, así que todo parece de la misma marca.' }],
  [{ en: 'How much does it cost?', es: '¿Cuánto cuesta?' }, { en: 'Our prices are negotiable. Tell us your budget and we show you what we can make with it, with a fixed quote before we start.', es: 'Nuestros precios son negociables. Dinos tu presupuesto y te enseñamos lo que podemos hacer con él, con un presupuesto cerrado antes de empezar.' }],
  [{ en: 'How long does it take?', es: '¿Cuánto tardáis?' }, { en: 'It depends on the scope. We confirm a calendar in every proposal and can handle urgent launches.', es: 'Depende del alcance. Confirmamos un calendario en cada propuesta y podemos asumir lanzamientos urgentes.' }],
  [{ en: 'Who owns the final work?', es: '¿De quién es el trabajo final?' }, { en: 'Final files are delivered for your commercial use, and the usage terms are written into each proposal. We work with tools whose plans allow commercial use.', es: 'Los archivos finales se entregan para tu uso comercial y las condiciones de uso van por escrito en cada propuesta. Trabajamos con herramientas cuyos planes permiten el uso comercial.' }],
  [{ en: 'Do you work in English and Spanish?', es: '¿Trabajáis en inglés y en español?' }, { en: 'Yes, both: websites, copy, social media and campaigns.', es: 'Sí, en los dos: webs, textos, redes y campañas.' }],
  [{ en: 'Which AI tools do you use?', es: '¿Qué herramientas de IA usáis?' }, { en: 'Higgsfield, Seedance 2.5, Kling 3.0, Veo 3, Nano Banana Pro, Magnific, Omni 1.2, Google Flow and Canva AI for images and video, plus Three.js and GSAP for the web. We pick the best model for each shot.', es: 'Higgsfield, Seedance 2.5, Kling 3.0, Veo 3, Nano Banana Pro, Magnific, Omni 1.2, Google Flow y Canva AI para imagen y vídeo, y Three.js y GSAP para la web. Elegimos el mejor modelo para cada plano.' }]
];

/* ---------------- render ---------------- */
function renderTools() {
  const row = TOOLS.map(([n, s], i) => `<span class="tool"><i style="background:${TOOL_BG[i % TOOL_BG.length]}">${esc(n.split(/[\s.]/)[0].slice(0, 2))}</i>${esc(n)} ${t2(s, 'small')}</span>`).join('');
  const half = Math.ceil(TOOLS.length / 2);
  $('#marqueeA .marquee-track').innerHTML = row + row;
  const row2 = TOOLS.slice(half).concat(TOOLS.slice(0, half)).map(([n, s], i) => `<span class="tool"><i style="background:${TOOL_BG[(i + 3) % TOOL_BG.length]}">${esc(n.split(/[\s.]/)[0].slice(0, 2))}</i>${esc(n)} ${t2(s, 'small')}</span>`).join('');
  $('#marqueeB .marquee-track').innerHTML = row2 + row2;
}

function renderServices() {
  $('#servicesTrack').innerHTML = SERVICES.map(s => {
    const m = s.media.v
      ? `<video muted loop playsinline preload="none" poster="${s.media.p}" data-src="${s.media.v}"></video>`
      : `<img src="${s.media.i}" alt="" loading="lazy" style="object-position:${s.media.pos || '50% 0'}">`;
    return `<article class="svc" data-go="${s.go}"><span class="svc-ic">${IC[s.ic]}</span><div class="svc-media">${m}</div>
      ${t2(s.t, 'h3')}${t2(s.d, 'p')}<div class="tags">${s.tags.map(x => t2(x)).join('')}</div>
      <a class="svc-link" href="#${s.go}">${t2(s.go_l)} →</a></article>`;
  }).join('');
}

function renderCine() {
  $('#cineList').innerHTML = ADS.map((a, i) => `<li><button type="button" data-i="${i}" data-cursor="Play">
    <img src="media/posters/${a.id}.webp" alt="" loading="lazy"><span><b>${esc(a.title)}</b>${t2(a.type, 'small')}</span><span class="dur">${esc(a.dur)}</span><span class="bar"><i></i></span></button></li>`).join('');
}

function renderSites() {
  $('#siteStack').innerHTML = SITES.map(s => `<article class="site" data-site="${s.id}">
    <a class="browser" href="${s.url}" target="_blank" rel="noopener" data-cursor="Visit" aria-label="${esc(s.name)}">
      <div class="browser-bar"><i></i><i></i><i></i><span>${esc(s.url.replace('https://', ''))}</span></div>
      <div class="browser-view">${s.shots.map((sh, i) => `<img src="media/shots/${sh}.webp" alt="" loading="lazy" class="${i ? '' : 'on'}">`).join('')}</div>
    </a>
    <div class="site-info">${t2(s.kind, 'span', 'kind')}<h4>${esc(s.name)}</h4>${t2(s.d, 'p')}
      <div class="tags">${s.tags.map(x => t2(x)).join('')}</div>
      <div class="dots">${s.shots.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
      <a class="btn btn-iri" href="${s.url}" target="_blank" rel="noopener">${t2({ en: 'Visit the live site ↗', es: 'Ver la web en directo ↗' })}</a>
    </div></article>`).join('');
}

function renderPhones() {
  $('#phones').innerHTML = APPS.map(a => `<div class="phone-wrap" data-app="${a.id}">
    <div class="phone" style="--tint:${a.tint}"><div class="phone-screen">
      <span class="island"></span>
      <div class="status"><span>9:41</span><span class="sig"><i style="height:5px"></i><i style="height:7px"></i><i style="height:9px"></i><i style="height:11px"></i></span></div>
      <div class="app-screens">${a.screens.map(s => `<img src="media/shots/${s}.webp" alt="" loading="lazy">`).join('')}</div>
      <div class="tabbar">${a.tabs.map((t, i) => `<span class="${i ? '' : 'on'}"><i></i>${t2(t)}</span>`).join('')}</div>
    </div></div>
    <div class="app-label"><span class="app-icon" style="background:${a.bg}">${esc(a.icon)}</span><span><b>${esc(a.name)}</b>${t2(a.sub, 'small')}</span></div>
  </div>`).join('');
}

function renderGallery() {
  const cols = [[], [], []];
  const hgt = [0, 0, 0];
  GALLERY.forEach(g => { const k = hgt.indexOf(Math.min(...hgt)); cols[k].push(g); hgt[k] += g[2] / g[1]; });
  const fig = g => `<figure class="shot"><img src="media/stills/${g[0]}.webp" alt="" width="${g[1]}" height="${g[2]}" loading="lazy">${t2(g[3], 'figcaption')}</figure>`;
  $('#galleryCols').innerHTML = cols.map(c => `<div class="col">${c.map(fig).join('')}</div>`).join('');
}

function renderSteps() {
  $('#steps').innerHTML = STEPS.map(s => `<li class="step"><span class="step-ic">${IC[s.ic]}</span><div>${t2(s.t, 'h3')}${t2(s.d, 'p')}${t2(s.s, 'small')}</div></li>`).join('');
}

function renderPlans() {
  $('#plans').innerHTML = PLANS.map(p => `<article class="plan${p.hot ? ' hot' : ''}">
    ${p.badge ? t2(p.badge, 'span', 'badge') : ''}<h3>${esc(p.id)}</h3>
    <div class="price">${t2({ en: 'Negotiable', es: 'Negociable' })}${t2({ en: 'Built around your budget', es: 'A medida de tu presupuesto' }, 'small')}</div>
    ${t2(p.d, 'p')}<ul>${p.items.map(i => t2(i, 'li')).join('')}</ul>
    <a class="btn ${p.hot ? 'btn-ink' : 'btn-ink'}" href="#contact" data-plan="${esc(p.id)}">${t2({ en: 'Ask for a quote', es: 'Pedir presupuesto' })}</a></article>`).join('');
}

function renderFaq() {
  $('#faqList').innerHTML = FAQ.map(([q, a], i) => `<div class="qa${i ? '' : ' open'}"><button type="button" aria-expanded="${i ? 'false' : 'true'}">${t2(q)}<i aria-hidden="true"></i></button>
    <div class="qa-a"><div>${t2(a, 'p')}</div></div></div>`).join('');
  $$('.qa button').forEach(b => b.addEventListener('click', () => {
    const q = b.parentElement; const open = !q.classList.contains('open');
    q.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
    setTimeout(() => window.ScrollTrigger && ScrollTrigger.refresh(), 520);
  }));
}

function renderChips() {
  $('#fServices').innerHTML = SERVICES.map(s => `<button type="button" class="chip" aria-pressed="false" data-v="${esc(s.chip.en)}">${t2(s.chip)}</button>`).join('');
  $$('#fServices .chip').forEach(c => c.addEventListener('click', () => c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true')));
}


const CASES = [
  { id: 'elan', wide: true, name: 'Instituto Élan de Sexología', handle: '@elansexologia', av: 'É', url: 'https://www.instagram.com/elansexologia/',
    badge: { en: 'Current client · live', es: 'Cliente actual · en directo' }, live: true,
    sector: { en: 'Health · sexology & couples therapy · 10K+ followers', es: 'Salud · sexología y terapia de pareja · +10K seguidores' },
    craft: { en: '100% graphic design, no AI', es: '100 % diseño gráfico, sin IA' },
    d: { en: 'We run the whole account: strategy, educational carousels and short videos on intimacy and relationships, with sensitive, science-based messaging.', es: 'Llevamos la cuenta entera: estrategia, carruseles divulgativos y vídeos cortos sobre intimidad y pareja, con un mensaje delicado y basado en la ciencia.' },
    did: [{ en: 'Strategy', es: 'Estrategia' }, { en: 'Carousels', es: 'Carruseles' }, 'Reels', { en: 'Community management', es: 'Community management' }],
    ar: '4/5', n: 6, tiles: [{ v: 'elan-r1' }, { i: 'elan-1' }, { i: 'elan-2' }, { v: 'elan-r2' }, { i: 'elan-3' }, { i: 'elan-4' }],
    link: { en: 'Open the profile ↗', es: 'Abrir el perfil ↗' } },
  { id: 'conf', name: { en: 'Confidential project', es: 'Proyecto confidencial' }, handle: 'NDA', av: '✦',
    badge: { en: 'Under NDA', es: 'Bajo NDA' }, sector: { en: 'AI reels for a client', es: 'Reels con IA para un cliente' },
    craft: { en: 'Generative AI', es: 'IA generativa' },
    d: { en: 'Vertical AI reels from concept stills to finished video, with one consistent art direction. Made together with marketer Irene Puche.', es: 'Reels verticales con IA, de las imágenes de concepto al vídeo final, con una dirección de arte coherente. Hechos junto a la especialista en marketing Irene Puche.' },
    did: [{ en: 'AI video', es: 'Vídeo con IA' }, { en: 'Art direction', es: 'Dirección de arte' }, 'Reels'],
    ar: '9/16', n: 4, tiles: [{ v: 'conf-1' }, { v: 'conf-2' }, { v: 'conf-3' }, { v: 'conf-4' }],
    credit: { url: 'https://irenepuche.com', t: 'irenepuche.com ↗' } },
  { id: 'yuuju', name: 'Yuuju', handle: { en: 'Home fibre', es: 'Fibra para el hogar' }, av: 'Y',
    badge: { en: 'Campaign', es: 'Campaña' }, sector: { en: 'Telecoms · home fibre installation', es: 'Telecomunicaciones · instalación de fibra' },
    craft: { en: 'Graphic design & motion', es: 'Diseño gráfico y motion' },
    d: { en: 'A social campaign told through animated storytelling: data, reasons to choose them and a looping motion piece.', es: 'Una campaña en redes contada con storytelling animado: datos, motivos para elegirles y una pieza en movimiento en bucle.' },
    did: [{ en: 'Campaign', es: 'Campaña' }, 'Motion', { en: 'Carousels', es: 'Carruseles' }],
    ar: '1/1', n: 2, tiles: [{ v: 'yuuju-v', loop: true }, { i: 'yuuju-1' }, { i: 'yuuju-2' }, { i: 'yuuju-3' }] },
  { id: 'zerain', name: 'Zerain Restaurant', handle: { en: 'Basque cuisine · Madrid', es: 'Cocina vasca · Madrid' }, av: 'Z',
    badge: { en: 'Full campaign', es: 'Campaña completa' }, sector: { en: 'Food & beverage', es: 'Restauración' },
    craft: { en: '100% graphic design, no AI', es: '100 % diseño gráfico, sin IA' },
    d: { en: 'A full social campaign for a Basque restaurant: strategy, visual line and posts built around the flavours of the north.', es: 'Una campaña completa en redes para un restaurante vasco: estrategia, línea visual y publicaciones en torno al sabor del norte.' },
    did: [{ en: 'Strategy', es: 'Estrategia' }, { en: 'Visual identity', es: 'Línea visual' }, 'Posts'],
    ar: '1/1', n: 2, tiles: [{ i: 'zerain-1' }, { i: 'zerain-2' }, { i: 'zerain-3' }, { i: 'zerain-4' }] },
  { id: 'jaro', name: 'Clínica Jaro', handle: { en: 'Wellness & acupuncture', es: 'Bienestar y acupuntura' }, av: 'J',
    badge: { en: 'Promotion', es: 'Promoción' }, sector: { en: 'Health & wellness', es: 'Salud y bienestar' },
    craft: { en: '100% graphic design, no AI', es: '100 % diseño gráfico, sin IA' },
    d: { en: 'Educational posts and promotion for a wellness clinic: women’s health, fertility and nutrition, in a soft, trustworthy style.', es: 'Publicaciones divulgativas y promoción para una clínica de bienestar: salud femenina, fertilidad y nutrición, con un estilo suave y de confianza.' },
    did: [{ en: 'Educational posts', es: 'Posts divulgativos' }, { en: 'Promotion', es: 'Promoción' }],
    ar: '1/1', n: 2, tiles: [{ i: 'jaro-1' }, { i: 'jaro-2' }, { i: 'jaro-3' }, { i: 'jaro-4' }] },
  { id: 'sample', name: 'MRB Sample', handle: { en: 'International architecture group', es: 'Grupo internacional de arquitectura' }, av: 'M',
    badge: { en: 'Under NDA', es: 'Bajo NDA' }, sector: { en: 'Architecture · branding & editorial', es: 'Arquitectura · branding y editorial' },
    craft: { en: '100% graphic design, no AI', es: '100 % diseño gráfico, sin IA' },
    d: { en: 'Branding and editorial content for an architecture group. The client’s name stays private, so the work is signed under our placeholder brand.', es: 'Branding y contenido editorial para un grupo de arquitectura. El nombre del cliente es privado, así que el trabajo va firmado con nuestra marca de ejemplo.' },
    did: ['Branding', { en: 'Editorial design', es: 'Diseño editorial' }, 'LinkedIn'],
    ar: '4/5', n: 2, tiles: [{ i: 'sample-1' }, { i: 'sample-2' }, { i: 'sample-3' }, { i: 'sample-4' }] },
  { id: 'creator', wide: true, name: 'Malu', handle: '@malu_menolu', avImg: 'media/founder.webp', url: 'https://www.instagram.com/malu_menolu/',
    badge: { en: 'Founder · creator', es: 'Fundadora · creadora' }, live: true,
    sector: { en: 'Content creator & model · 20K+ followers', es: 'Creadora de contenido y modelo · +20K seguidores' },
    craft: { en: 'Influencer marketing', es: 'Marketing de influencers' },
    d: { en: 'Our founder collaborates with brands from her own profile and has worked as a commercial, advertising and editorial model, so we know influencer marketing from both sides of the camera.', es: 'Nuestra fundadora colabora con marcas desde su propio perfil y ha trabajado como modelo comercial, publicitaria y editorial, así que conocemos el marketing de influencers desde los dos lados de la cámara.' },
    did: [{ en: 'Brand collaborations', es: 'Colaboraciones con marcas' }, 'UGC', { en: 'On-camera talent', es: 'Delante de la cámara' }],
    link: { en: 'Open the profile ↗', es: 'Abrir el perfil ↗' } }
];
function renderCases() {
  $('#cases').innerHTML = CASES.map(c => {
    const nm = typeof c.name === 'string' ? `<b>${esc(c.name)}</b>` : t2(c.name, 'b');
    const hd = typeof c.handle === 'string' ? `<small>${esc(c.handle)}</small>` : t2(c.handle, 'small');
    const av = c.avImg ? `<img src="${c.avImg}" alt="">` : esc(c.av);
    const tiles = c.tiles ? `<div class="tiles" style="--n:${c.n};--ar:${c.ar}">${c.tiles.map(t => {
      const src = t.v ? `media/social/${t.v}.webp` : `media/social/${t.i}.webp`;
      return `<button type="button" class="tile" data-cursor="${t.v ? 'Play' : 'Open'}" data-media="${t.v ? 'v' : 'i'}" data-src="media/social/${t.v || t.i}.${t.v ? 'mp4' : 'webp'}" data-title="${esc(typeof c.name === 'string' ? c.name : c.name.en)}">
        <img src="${src}" alt="" loading="lazy">${t.v ? '<span class="pl" aria-hidden="true"></span>' : ''}</button>`;
    }).join('')}</div>` : '';
    const foot = c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${t2(c.link)}</a>` : c.credit ? `<small>${t2({ en: 'Created with Irene Puche', es: 'Hecho con Irene Puche' })} · <a href="${c.credit.url}" target="_blank" rel="noopener">${esc(c.credit.t)}</a></small>` : '';
    return `<article class="case${c.wide ? ' wide' : ''}" data-case="${c.id}">
      <div class="case-head"><span class="case-av"><span>${av}</span></span><span class="case-id">${nm}${hd}</span>${t2(c.badge, 'span', 'case-badge' + (c.live ? ' live' : ''))}</div>
      ${tiles}
      <div class="case-body">${t2(c.sector, 'span', 'case-sector')}${t2(c.craft, 'span', 'case-craft')}${t2(c.d, 'p')}</div>
      <div class="case-foot"><div class="tags">${c.did.map(x => t2(x)).join('')}</div>${foot}</div>
    </article>`;
  }).join('');
}

const PAGES = {
  home: { n: 0, en: 'Home', es: 'Inicio' }, work: { n: 1, en: 'Work', es: 'Trabajos' }, services: { n: 2, en: 'Services', es: 'Servicios' },
  studio: { n: 3, en: 'Studio', es: 'Estudio' }, pricing: { n: 4, en: 'Pricing', es: 'Precios' }, contact: { n: 5, en: 'Contact', es: 'Contacto' }
};
const SUB = { social: 'work', commercials: 'work', websites: 'work', apps: 'work', gallery: 'work', process: 'services', faq: 'studio' };
const LEVELS = [
  { p: 'work', media: { v: 'media/ads/titanium.mp4', p: 'media/posters/titanium.webp' }, d: { en: '7 AI commercials, social media for 7 accounts, 4 live websites, apps, photography and banners.', es: '7 anuncios con IA, redes de 7 cuentas, 4 webs en directo, apps, foto y banners.' } },
  { p: 'services', media: { v: 'media/ads/morning.mp4', p: 'media/posters/morning.webp' }, d: { en: 'Commercials, web, apps, social media, reels, banners, photography and ads.', es: 'Anuncios, webs, apps, redes sociales, reels, banners, foto y campañas.' } },
  { p: 'studio', media: { i: 'media/founder.webp', pos: '50% 22%' }, d: { en: 'Who we are, how we think and the FAQ.', es: 'Quiénes somos, cómo pensamos y las preguntas frecuentes.' } },
  { p: 'pricing', pastel: true, d: { en: 'Negotiable plans built around your budget.', es: 'Planes negociables a medida de tu presupuesto.' } },
  { p: 'contact', pastel: true, d: { en: 'Send us your brief. The final boss.', es: 'Mándanos tu brief. El jefe final.' } }
];
const LVL = n => ({ en: `Level ${n}`, es: `Nivel ${n}` });

function renderLevels() {
  $('#levelGrid').innerHTML = LEVELS.map(l => {
    const pg = PAGES[l.p];
    const bg = l.pastel ? '<span class="bgm"><span class="orb-art"><i></i><i></i><i></i></span></span>'
      : l.media.v ? `<span class="bgm"><video muted loop playsinline preload="none" poster="${l.media.p}" data-src="${l.media.v}"></video></span>`
      : `<span class="bgm"><img src="${l.media.i}" alt="" loading="lazy" style="object-position:${l.media.pos}"></span>`;
    return `<a class="lvl-card${l.pastel ? ' pastel' : ''}" href="#${l.p}" data-page="${l.p}" data-cursor="Enter">${bg}
      <span class="lvl-lock" data-lvl-state="${l.p}">${esc(lang === 'es' ? 'Nuevo' : 'New')}</span>
      <span class="lvl-meta"><span>${t2(LVL(pg.n), 'span', 'lvl-n')}${t2(pg, 'span', 'lvl-t')}${t2(l.d, 'span', 'lvl-d')}</span><span class="lvl-go" aria-hidden="true">→</span></span></a>`;
  }).join('');
}

renderTools(); renderServices(); renderCine(); renderSites(); renderPhones(); renderGallery(); renderSteps(); renderPlans(); renderFaq(); renderChips(); renderLevels(); renderCases();

const audio = createAudio();
const G = window.gsap, ST = window.ScrollTrigger;
if (G && ST) G.registerPlugin(ST);

/* ---------------- language ---------------- */
let manifestoWords = [], lastManifesto = reduce ? 1 : 0;
function splitManifesto() {
  const el = $('#manifesto');
  el.innerHTML = el.textContent.split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(' ');
  manifestoWords = $$('.w', el);
  paintManifesto(lastManifesto);
}
function paintManifesto(p) {
  lastManifesto = p;
  const n = Math.round(p * manifestoWords.length);
  manifestoWords.forEach((w, i) => w.classList.toggle('on', i < n));
}
function splitTitles() {
  $$('.phead-title').forEach(h => { h.innerHTML = h.textContent.split('').map(c => `<span class="ch">${esc(c)}</span>`).join(''); });
}
function fitBig() {
  $$('.phead-title,.footer-word').forEach(el => {
    if (!el.offsetWidth) return;
    el.style.fontSize = '';
    const avail = el.clientWidth - (el.classList.contains('footer-word') ? 24 : 4);
    const w = el.scrollWidth;
    if (w > avail) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * avail / w * 0.985) + 'px';
  });
}
function fitWarp() {
  const el = $('#warpName'); el.style.fontSize = '';
  const avail = innerWidth * 0.9, w = el.scrollWidth;
  if (w > avail) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * avail / w) + 'px';
}
addEventListener('resize', () => { fitBig(); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fitBig(); ST && ST.refresh(); });
function applyLang(l) {
  lang = l;
  document.documentElement.lang = l;
  store.set('nf-lang', l);
  $$('[data-es]').forEach(el => {
    if (el.dataset.en === undefined) el.dataset.en = el.textContent;
    el.textContent = l === 'es' ? el.dataset.es : el.dataset.en;
  });
  $$('[data-esh]').forEach(el => { if (el.dataset.enh === undefined) el.dataset.enh = el.innerHTML; el.innerHTML = l === 'es' ? el.dataset.esh : el.dataset.enh; });
  $$('[data-esp]').forEach(el => { if (el.dataset.enp === undefined) el.dataset.enp = el.placeholder; el.placeholder = l === 'es' ? el.dataset.esp : el.dataset.enp; });
  $$('[data-esa]').forEach(el => { if (el.dataset.ena === undefined) el.dataset.ena = el.alt; el.alt = l === 'es' ? el.dataset.esa : el.dataset.ena; });
  $$('.lang-btn').forEach(b => { const on = b.dataset.lang === l; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
  splitManifesto(); splitTitles(); paintLevelStates(); fitBig();
  if (cur >= 0) showInfo(cur);
  renderQuick(); updateHud();
  if (page && G && ST) { if (pageCtx) pageCtx.revert(); pageCtx = G.context(() => initPage(page, true), $('#page-' + page)); }
  if (ST) ST.refresh();
}
$$('.lang-btn').forEach(b => b.addEventListener('click', () => { audio.click(); applyLang(b.dataset.lang); }));

/* ---------------- commercials ---------------- */
const vid = $('#cineVideo'), screen = $('#cineScreen');
let cur = -1, cineVisible = false;
function showInfo(i) {
  const a = ADS[i];
  $('#cineInfo').innerHTML = `${t2(a.type, 'span', 'type')}<h4>${esc(a.title)}</h4>${t2(a.desc, 'p')}
    <div class="meta"><span>${t2({ en: 'Model', es: 'Modelo' })}: ${esc(a.model)}</span><span>${esc(a.dur)}</span>
    <a href="${a.hd}" target="_blank" rel="noopener">${t2({ en: 'Watch in HD ↗', es: 'Ver en HD ↗' })}</a></div>`;
}
function showAd(i, play = true) {
  if (i === cur) return;
  cur = i;
  const a = ADS[i];
  vid.poster = `media/posters/${a.id}.webp`;
  vid.src = `media/ads/${a.id}.mp4`;
  $('#cineBlur').style.backgroundImage = `url(media/posters/${a.id}.webp)`;
  screen.classList.toggle('vertical', !!a.vertical);
  $$('#cineList button').forEach((b, k) => b.classList.toggle('on', k === i));
  showInfo(i);
  if (play && cineVisible) vid.play().catch(() => {});
}
vid.addEventListener('ended', () => showAd((cur + 1) % ADS.length));
vid.addEventListener('timeupdate', () => {
  const p = vid.duration ? vid.currentTime / vid.duration : 0;
  const bar = $('#cineList button.on .bar i'); if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
  $('#cineTime').textContent = `00:${String(Math.floor(vid.currentTime)).padStart(2, '0')}`;
});
$$('#cineList button').forEach(b => b.addEventListener('click', () => { audio.click(); showAd(+b.dataset.i); }));
new IntersectionObserver(es => {
  cineVisible = es[0].isIntersecting;
  if (cineVisible) { if (cur < 0) showAd(0); vid.play().catch(() => {}); } else vid.pause();
}, { threshold: 0.25 }).observe(screen);
showAd(0, false);

const lb = $('#lightbox'), lbv = $('#lbVideo'), lbi = $('#lbImg');
let musicWasOn = false;
function openLB(i) {
  const a = ADS[i];
  vid.pause();
  musicWasOn = audio.on; if (musicWasOn) audio.stop();
  lbi.hidden = true; lbv.hidden = false; $('#lbHD').hidden = false;
  lbv.src = `media/ads/${a.id}.mp4`; lbv.poster = `media/posters/${a.id}.webp`;
  $('#lbTitle').textContent = a.title; $('#lbHD').href = a.hd;
  lb.hidden = false; lenis && lenis.stop();
  lbv.play().catch(() => {});
  $('#lbClose').focus();
}
function openMedia(kind, src, title) {
  vid.pause();
  musicWasOn = audio.on; if (musicWasOn && kind === 'v') audio.stop(); else musicWasOn = false;
  $('#lbHD').hidden = true; $('#lbTitle').textContent = title;
  if (kind === 'v') { lbi.hidden = true; lbv.hidden = false; lbv.poster = src.replace('.mp4', '.webp'); lbv.src = src; lbv.play().catch(() => {}); }
  else { lbv.pause(); lbv.hidden = true; lbi.hidden = false; lbi.src = src; }
  lb.hidden = false; lenis && lenis.stop(); $('#lbClose').focus();
}
$('#cases').addEventListener('click', e => { const t = e.target.closest('.tile'); if (!t) return; audio.click(); openMedia(t.dataset.media, t.dataset.src, t.dataset.title); });
function closeLB() {
  lbi.hidden = true; lbi.removeAttribute('src');
  lbv.pause(); lbv.removeAttribute('src'); lbv.load(); lb.hidden = true; lenis && lenis.start();
  if (musicWasOn) { audio.start(); syncSound(); }
  if (cineVisible) vid.play().catch(() => {});
}
$('#cinePlay').addEventListener('click', () => openLB(cur));
screen.dataset.cursor = 'Play';
screen.addEventListener('click', e => { if (!e.target.closest('.cine-play')) openLB(cur); });
$('#lbClose').addEventListener('click', closeLB);
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

/* ---------------- loops (sites, phones, videos) ---------------- */
function cycler(root, sel, onStep, ms) {
  let i = 0, timer = null;
  const imgs = $$(sel, root);
  if (imgs.length < 2) return;
  const start = () => { if (!timer) timer = setInterval(() => { i = (i + 1) % imgs.length; onStep(i, imgs); }, ms); };
  const stop = () => { clearInterval(timer); timer = null; };
  new IntersectionObserver(es => (es[0].isIntersecting ? start() : stop()), { threshold: 0.2 }).observe(root);
}
$$('.site').forEach(s => cycler(s, '.browser-view img', (i, imgs) => {
  imgs.forEach((im, k) => im.classList.toggle('on', k === i));
  $$('.dots i', s).forEach((d, k) => d.classList.toggle('on', k === i));
}, 3200));
$$('.phone-wrap').forEach((p, n) => setTimeout(() => cycler(p, '.app-screens img', i => {
  $('.app-screens', p).style.transform = `translateX(${-100 * i}%)`;
  $$('.tabbar span', p).forEach((t, k) => t.classList.toggle('on', k === i % 4));
}, 2800), n * 600));
const autoVideos = $$('.svc video, .phead-media video, .lvl-card video');
autoVideos.forEach(v => new IntersectionObserver(es => {
  if (es[0].isIntersecting) { if (!v.getAttribute('src')) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
}, { threshold: 0.15 }).observe(v));

/* ---------------- stage (3D) ---------------- */
const HELIX = HELIX_AD.map((_, i) => `media/helix/h${i}.jpg`);
let stage = null;
try {
  stage = initStage($('#stage'), {
    images: HELIX, reduce,
    onHover: i => { setCursor(i >= 0 ? (lang === 'es' ? 'Ver' : 'Play') : '', i >= 0 ? 'big' : ''); if (i >= 0) audio.tick(); }
  });
} catch (e) { stage = null; }
$('#hero').addEventListener('click', e => {
  if (e.target.closest('a,button') || !stage) return;
  const i = stage.getHovered(); if (i < 0) return;
  const k = ADS.findIndex(a => a.id === HELIX_AD[i]);
  go('work', { sub: 'commercials' }).then(() => showAd(k));
});

/* ---------------- cursor + trail ---------------- */
const cursorEl = $('#cursor'), cDot = $('.cursor-dot'), cRing = $('.cursor-ring'), cLabel = $('#cursorLabel');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, ang = 0, hoverLabel = '';
function setCursor(label, mode) {
  cursorEl.classList.toggle('big', mode === 'big');
  cursorEl.classList.toggle('link', mode === 'link');
  cLabel.textContent = label || '';
}
const trail = $('#trail'), tctx = trail.getContext('2d');
const pts = [], sparks = [];
function sizeTrail() { const d = Math.min(devicePixelRatio || 1, 2); trail.width = innerWidth * d; trail.height = innerHeight * d; tctx.setTransform(d, 0, 0, d, 0, 0); }
if (fine && !reduce) {
  document.body.classList.add('has-cursor');
  sizeTrail(); addEventListener('resize', sizeTrail);
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
  addEventListener('pointerdown', e => {
    cursorEl.classList.add('down');
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + Math.random() * 0.4, sp = 2 + Math.random() * 4; sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 4 + Math.random() * 6, life: 1, rot: Math.random() * 6, hue: Math.random() }); }
  });
  addEventListener('pointerup', () => cursorEl.classList.remove('down'));
  const star = (x, y, r, rot) => {
    tctx.save(); tctx.translate(x, y); tctx.rotate(rot); tctx.beginPath();
    for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.32 : r, a = (i / 8) * Math.PI * 2; tctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    tctx.closePath(); tctx.fill(); tctx.restore();
  };
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ang = (ang + 2) % 360;
    cDot.style.transform = `translate(${mx}px,${my}px)`;
    cRing.style.transform = `translate(${rx}px,${ry}px)`;
    cLabel.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    cRing.style.setProperty('--a', ang + 'deg');
    pts.unshift({ x: mx, y: my }); if (pts.length > 26) pts.pop();
    tctx.clearRect(0, 0, innerWidth, innerHeight);
    tctx.lineCap = 'round'; tctx.lineJoin = 'round';
    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1], k = 1 - i / pts.length;
      const c = i / pts.length;
      tctx.strokeStyle = `rgba(${Math.round(180 - c * 40)},${Math.round(156 + c * 30)},255,${(k * 0.55).toFixed(3)})`;
      tctx.lineWidth = 1 + k * 9;
      tctx.beginPath(); tctx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2); tctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2); tctx.stroke();
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.x += s.vx; s.y += s.vy; s.vx *= 0.93; s.vy *= 0.93; s.vy += 0.05; s.life -= 0.022; s.rot += 0.08;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      tctx.fillStyle = s.hue > 0.5 ? `rgba(150,128,255,${s.life})` : `rgba(127,166,255,${s.life})`;
      star(s.x, s.y, s.r * s.life, s.rot);
    }
    requestAnimationFrame(loop);
  })();
  document.addEventListener('pointerover', e => {
    const c = e.target.closest('[data-cursor]');
    if (c) { const l = c.dataset.cursor; setCursor(lang === 'es' ? ({ Play: 'Ver', Visit: 'Entrar', Enter: 'Entrar', Open: 'Abrir' }[l] || l) : l, 'big'); audio.tick(); return; }
    const a = e.target.closest('a,button,select,input,textarea,label');
    if (a) { setCursor('', 'link'); if (a.matches('a,button')) audio.tick(); }
  });
  document.addEventListener('pointerout', e => {
    const from = e.target.closest('[data-cursor],a,button,select,input,textarea,label');
    const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('[data-cursor],a,button,select,input,textarea,label') : null;
    if (from && from !== to) setCursor('', '');
  });
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
  $$('.plan,.lvl-card').forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
} else { cursorEl.style.display = 'none'; trail.style.display = 'none'; }

/* ---------------- sound button ---------------- */
const soundBtn = $('#soundBtn');
function syncSound() { soundBtn.setAttribute('aria-pressed', audio.on); }
soundBtn.addEventListener('click', () => { audio.toggle(); syncSound(); store.set('nf-sound', audio.on ? '1' : '0'); });

/* ---------------- smooth scroll ---------------- */
let lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
  if (G && ST) { lenis.on('scroll', ST.update); G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0); }
  else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); }
}
function scrollToEl(el, offset = -150) {
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}
const nav = $('#nav'); let lastY = 0;
addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > lastY && y > 600 && $('#mobileMenu').hidden); lastY = y; }, { passive: true });
const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
function closeMenu() { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); }
menuBtn.addEventListener('click', () => { const open = menu.hidden; menu.hidden = !open; menuBtn.setAttribute('aria-expanded', open); open ? lenis && lenis.stop() : lenis && lenis.start(); });

/* ---------------- HUD & unlocks ---------------- */
const unlocked = new Set((store.get('nf-found') || '').split(',').filter(Boolean));
const visited = new Set((store.get('nf-visited') || '').split(',').filter(Boolean));
const TOTAL = $$('[data-unlock]').length;
$('#hudTotal').textContent = TOTAL;
let toastTimer = null; const toastQ = [];
function toast(title, sub) {
  toastQ.push([title, sub]);
  if (toastTimer) return;
  (function next() {
    const it = toastQ.shift(); if (!it) { toastTimer = null; return; }
    const el = $('#toast');
    el.innerHTML = `<span class="star"><svg viewBox="0 0 24 24"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z"/></svg></span><span><b>${esc(it[0])}</b><small>${esc(it[1])}</small></span>`;
    el.classList.add('show'); audio.chime();
    toastTimer = setTimeout(() => { el.classList.remove('show'); toastTimer = setTimeout(next, 450); }, 2400);
  })();
}
function unlock(el) {
  const k = el.dataset.unlock; if (unlocked.has(k)) return;
  unlocked.add(k); store.set('nf-found', [...unlocked].join(','));
  const label = lang === 'es' ? el.dataset.esLabel : el.dataset.enLabel;
  updateHud();
  toast((lang === 'es' ? 'Desbloqueado: ' : 'Unlocked: ') + label, unlocked.size === TOTAL ? (lang === 'es' ? '¡Lo has descubierto todo!' : 'You found everything!') : `${unlocked.size}/${TOTAL} ${lang === 'es' ? 'descubiertos' : 'discovered'}`);
}
function updateHud() {
  if (!page) return;
  const pg = PAGES[page];
  $('#hudLvl').textContent = T(LVL(pg.n));
  $('#hudName').textContent = T(pg);
  $('#hudFound').textContent = unlocked.size;
}
function paintLevelStates() {
  $$('[data-lvl-state]').forEach(el => {
    const v = visited.has(el.dataset.lvlState);
    el.textContent = v ? (lang === 'es' ? 'Explorado ✓' : 'Explored ✓') : (lang === 'es' ? 'Nuevo' : 'New');
  });
}

/* ---------------- router ---------------- */
let page = null, pageCtx = null, busy = false;
function parseHash(h) { h = (h || '').replace('#', ''); if (PAGES[h]) return [h, null]; if (SUB[h]) return [SUB[h], h]; return ['home', null]; }
function showPage(name) {
  $$('.page').forEach(p => { p.hidden = p.dataset.page !== name; });
  document.body.classList.toggle('on-home', name === 'home');
  document.body.classList.toggle('night', name === 'work');
  nav.classList.toggle('dark', name === 'work');
  $$('[data-page]').forEach(a => { if (a.closest('.nav-links,.mobile-menu')) a.classList.toggle('on', a.dataset.page === name); });
  if (stage) stage.setActive(name === 'home');
  $$('.page[hidden] video').forEach(v => v.pause());
  page = name; visited.add(name); store.set('nf-visited', [...visited].join(','));
  paintLevelStates(); updateHud();
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0);
  window.scrollTo(0, 0);
  if (location.hash.replace('#', '') !== name) { ignoreHash = true; location.hash = name; }
  fitBig();
  if (pageCtx) pageCtx.revert();
  if (G && ST) { pageCtx = G.context(() => initPage(name), $('#page-' + name)); ST.refresh(); }
  else initPage(name);
}
let ignoreHash = false;
addEventListener('hashchange', () => { if (ignoreHash) { ignoreHash = false; return; } const [p, s] = parseHash(location.hash); go(p, { sub: s }); });

function go(name, { sub = null, instant = false } = {}) {
  closeMenu();
  if (name === page) { if (sub) scrollToEl(document.getElementById(sub)); return Promise.resolve(); }
  if (busy) return Promise.resolve();
  audio.whoosh(0.9, 220, 5200, 0.2);
  if (instant || reduce || !G) { showPage(name); if (sub) setTimeout(() => scrollToEl(document.getElementById(sub)), 300); return Promise.resolve(); }
  busy = true;
  const pg = PAGES[name];
  $('#warpLvl').textContent = T(LVL(pg.n)); $('#warpName').textContent = T(pg); fitWarp();
  return new Promise(res => {
    const tl = G.timeline({ onComplete: () => { busy = false; G.set('.warp', { visibility: 'hidden' }); res(); } });
    tl.set('.warp', { visibility: 'visible' })
      .fromTo('.warp-frame', { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: 0.65, ease: 'expo.in' })
      .fromTo('.warp-lvl,.warp-name', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power3.out' }, '-=0.12')
      .add(() => { showPage(name); })
      .to({}, { duration: 0.25 })
      .to('.warp-lvl,.warp-name', { scale: 3, opacity: 0, duration: 0.5, ease: 'expo.in' })
      .to('.warp-frame', { scale: 2.6, opacity: 0, duration: 0.7, ease: 'expo.inOut' }, '-=0.35')
      .set('.warp-frame', { opacity: 1, scale: 0 })
      .add(() => { if (sub) scrollToEl(document.getElementById(sub)); });
  });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const h = a.getAttribute('href'); if (h.length < 2) return;
  e.preventDefault(); audio.click();
  if (a.dataset.plan) pickPlan(a.dataset.plan);
  const [p, s] = a.dataset.page ? [a.dataset.page, null] : parseHash(h);
  go(p, { sub: s });
});
$('#servicesTrack').addEventListener('click', e => {
  if (e.target.closest('a')) return;
  const c = e.target.closest('.svc'); if (!c) return;
  audio.click(); const [p, s2] = parseHash('#' + c.dataset.go); go(p, { sub: s2 });
});
$$('.subnav button').forEach(b => b.addEventListener('click', () => { audio.click(); scrollToEl(document.getElementById(b.dataset.go)); }));

/* ---------------- per-page scenes ---------------- */
function initPage(name, again = false) {
  const root = $('#page-' + name);
  if (!G || !ST || reduce) { $$('.step', root).forEach(s => s.classList.add('on')); paintManifesto(1); $$('[data-unlock]', root).forEach(unlock); return; }

  // page header zoom
  const ph = $('.phead', root);
  if (ph && !again) {
    G.fromTo($$('.phead-title .ch', ph), { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out', delay: 0.35 });
    G.from([$('.phead-lvl', ph), $('.phead-sub', ph)], { y: 30, opacity: 0, duration: 1, stagger: 0.1, delay: 0.6, ease: 'power3.out' });
    G.fromTo($$('.phead-media > *', ph), { scale: 1.3 }, { scale: 1, duration: 1.9, ease: 'expo.out' });
  }
  if (ph) {
    const tl = G.timeline({ scrollTrigger: { trigger: ph, start: 'top top', end: 'bottom top', scrub: true } });
    tl.to($('.phead-media', ph), { scale: 0.7, borderRadius: 48, yPercent: 8, ease: 'none' }, 0)
      .to($$('.phead-title .ch', ph), { yPercent: -60, opacity: 0, stagger: 0.02, ease: 'none' }, 0)
      .to([$('.phead-sub', ph), $('.phead-lvl', ph)], { opacity: 0, y: -40, ease: 'none' }, 0);
  }
  // unlocks + hud
  $$('[data-unlock]', root).forEach(el => ST.create({ trigger: el, start: 'top 65%', once: true, onEnter: () => unlock(el) }));
  ST.create({ trigger: root, start: 'top top', end: 'bottom bottom', onUpdate: s => { $('#hudFill').style.width = (s.progress * 100).toFixed(1) + '%'; } });
  // reveals
  const rv = $$('.h2,.sub-head,.lead,.plan,.qa,.form,.studio-photo,.pillars li,.direct,.next-btn,.fact', root);
  rv.forEach(el => G.set(el, { opacity: 0, y: 50 }));
  ST.batch(rv, { start: 'top 92%', once: true, onEnter: b => G.to(b, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08, overwrite: true }) });

  if (name === 'home') {
    if (!again) G.fromTo('.hero-title', { yPercent: 18, opacity: 0, scale: 0.94 }, { yPercent: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', delay: 0.2 });
    if (!again) G.from('.hero-kicker,.hero-sub,.hero-ctas,.hero-meta', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.45 });
    ST.create({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => stage && stage.setScroll(s.progress) });
    G.fromTo('.hero-inner', { yPercent: 0, opacity: 1 }, { yPercent: -30, opacity: 0, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    ST.create({ trigger: '#manifesto', start: 'top 82%', end: 'bottom 45%', scrub: true, onUpdate: s => paintManifesto(s.progress) });
    $$('.fact b', root).forEach(b => { const n = +b.dataset.count, o = { v: 0 }; G.to(o, { v: n, duration: 1.6, ease: 'power2.out', onUpdate: () => { b.textContent = Math.round(o.v); }, scrollTrigger: { trigger: b, start: 'top 90%', once: true } }); });
    G.fromTo('.lvl-card', { y: 120, rotateX: 18, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: '#levelGrid', start: 'top 85%', once: true } });
    const sk = G.quickTo('.marquee-track', 'skewX', { duration: 0.4, ease: 'power3' });
    ST.create({ trigger: '.tools', start: 'top bottom', end: 'bottom top', onUpdate: s => sk(G.utils.clamp(-8, 8, s.getVelocity() / -180)) });
  }
  if (name === 'work') {
    G.fromTo('#cineScreen', { scale: 0.82, borderRadius: 70 }, { scale: 1, borderRadius: 26, ease: 'none', scrollTrigger: { trigger: '#commercials', start: 'top 95%', end: 'top 25%', scrub: true } });
    G.from('#cineList li', { x: 60, opacity: 0, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '#cineList', start: 'top 85%', once: true } });
    ['commercials', 'social', 'websites', 'apps', 'gallery'].forEach(id => ST.create({ trigger: '#' + id, start: 'top 50%', end: 'bottom 50%', onToggle: s => { if (s.isActive) $$('.subnav button').forEach(b => b.classList.toggle('on', b.dataset.go === id)); } }));
    const tilt = [-26, -10, 10, 26];
    $$('.phone-wrap').forEach((p, i) => G.fromTo(p, { rotateY: tilt[i % 4], rotateX: 22, y: [140, 50, 90, 180][i % 4], opacity: 0.3 }, { rotateY: 0, rotateX: 0, y: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '#phones', start: 'top 95%', end: 'center 55%', scrub: true } }));
    const mm = G.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const sites = $$('.site');
      sites.forEach((s, i) => { if (i < sites.length - 1) G.to(s, { scale: 0.9, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: sites[i + 1], start: 'top bottom', end: 'top 120px', scrub: true } }); });
      const box = $('#galleryCols');
      $$('.col').forEach((c, i) => {
        const travel = () => Math.max(0, c.scrollHeight - box.clientHeight);
        const down = i === 1;
        G.fromTo(c, { y: () => (down ? -travel() : 0) }, { y: () => (down ? 0 : -travel()), ease: 'none', scrollTrigger: { trigger: '#gallery', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
      });
    });
  }
  if (name === 'services') {
    const mm = G.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const track = $('#servicesTrack');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tw = G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '#servicesPin', start: 'top 14%', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
      $$('.svc', track).forEach(c => G.fromTo(c, { rotateY: -16, z: -80 }, { rotateY: 10, z: 0, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } }));
    });
    $$('.step', root).forEach(s => ST.create({ trigger: s, start: 'top 68%', end: 'bottom 32%', toggleClass: 'on' }));
    G.fromTo('#processFill', { width: '0%' }, { width: '100%', ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 70%', end: 'bottom 50%', scrub: true } });
  }
  if (name === 'studio') {
    G.fromTo('.studio-photo img', { yPercent: -8, scale: 1.1 }, { yPercent: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  if (name === 'pricing') {
    G.fromTo('.plan', { rotateY: (i) => [-25, 0, 25][i], y: 80 }, { rotateY: 0, y: 0, ease: 'none', scrollTrigger: { trigger: '#plans', start: 'top 95%', end: 'top 45%', scrub: true } });
  }
}

/* footer wordmark */
(function () {
  const fw = $('#footerWord');
  fw.innerHTML = fw.textContent.split('').map(c => `<span>${esc(c)}</span>`).join('');
  if (G && ST && !reduce) G.from('#footerWord span', { yPercent: 110, rotate: 8, opacity: 0, stagger: 0.04, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.footer', start: 'top 90%', toggleActions: 'play none none reset' } });
})();

/* ---------------- contact form ---------------- */
function pickPlan(id) {
  const m = $('#fMsg');
  const line = lang === 'es' ? `Me interesa el plan ${id}.` : `I'm interested in the ${id} plan.`;
  if (!m.value.includes(id)) m.value = (line + '\n' + m.value).trim();
}
let briefText = '';
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#fName').value.trim(), email = $('#fEmail').value.trim(), err = $('#formError');
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.hidden = false;
    err.textContent = lang === 'es' ? 'Escribe tu nombre y un email válido para que podamos responderte.' : 'Add your name and a valid email so we can reply.';
    (!name ? $('#fName') : $('#fEmail')).focus(); return;
  }
  err.hidden = true;
  const svcs = $$('#fServices .chip[aria-pressed=true]').map(c => c.dataset.v).join(', ') || '—';
  briefText = `New brief for Neverfilmed\n\nName: ${name}\nEmail: ${email}\nCompany: ${$('#fCompany').value.trim() || '—'}\nServices: ${svcs}\nBudget: ${$('#fBudget').value}\nTiming: ${$('#fWhen').value}\n\n${$('#fMsg').value.trim()}`;
  $('#formDone').hidden = false; audio.chime();
  try { location.href = `mailto:malurosbolea@gmail.com?subject=${encodeURIComponent('Brief — ' + name)}&body=${encodeURIComponent(briefText)}`; } catch (x) {}
  if (ST) ST.refresh();
});
$('#copyBrief').addEventListener('click', async () => {
  const b = $('#copyBrief');
  try { await navigator.clipboard.writeText(briefText); b.textContent = lang === 'es' ? '¡Copiado!' : 'Copied!'; }
  catch (x) { b.textContent = lang === 'es' ? 'No se pudo copiar' : "Couldn't copy"; }
});

/* ---------------- chatbot ---------------- */
const A = {
  hi: { en: "Hi! I'm Frame, Neverfilmed's assistant. Ask me about services, social media, prices, timing, tools or our work.", es: '¡Hola! Soy Frame, el asistente de Neverfilmed. Pregúntame por servicios, redes sociales, precios, plazos, herramientas o nuestros trabajos.' },
  price: { en: 'Our prices are negotiable: every project is quoted around your budget. Brands usually start with one piece (Spark), launch with a full pack (Launch) or keep us monthly for social media and ads (Always-on). Tell me roughly what you want to invest. <a href="#pricing">See the plans</a>', es: 'Nuestros precios son negociables: cada proyecto se presupuesta a partir de lo que quieras invertir. Normalmente las marcas empiezan con una pieza (Spark), lanzan con un pack completo (Launch) o nos tienen cada mes para redes y anuncios (Always-on). Dime más o menos cuánto quieres invertir. <a href="#pricing">Ver los planes</a>' },
  time: { en: 'It depends on the scope, and we confirm a calendar in every proposal. You get a first visual concept quickly, and urgent launches are possible.', es: 'Depende del alcance, y confirmamos un calendario en cada propuesta. Recibes un primer concepto visual enseguida y podemos asumir lanzamientos urgentes.' },
  tools: { en: 'We direct Higgsfield, Seedance 2.5, Kling 3.0, Veo 3, Nano Banana Pro, Magnific, Omni 1.2, Google Flow and Canva AI for images and video, and build websites with Three.js and GSAP.', es: 'Dirigimos Higgsfield, Seedance 2.5, Kling 3.0, Veo 3, Nano Banana Pro, Magnific, Omni 1.2, Google Flow y Canva AI para imagen y vídeo, y programamos las webs con Three.js y GSAP.' },
  social: { en: 'Yes, we manage social media: strategy, content calendar, posting, community management and a monthly report on Instagram, TikTok and LinkedIn. We create all the content too, from reels to carousels. <a href="#social">See our social media work</a>', es: 'Sí, llevamos redes sociales: estrategia, calendario, publicación, community management e informe mensual en Instagram, TikTok y LinkedIn. Además creamos todo el contenido, de reels a carruseles. <a href="#social">Ver nuestras redes</a>' },
  ads: { en: 'We make AI commercials for TV, web and social: launches, beauty, fashion, tech and jewellery. Seven of them are here: <a href="#commercials">watch the commercials</a>', es: 'Hacemos anuncios con IA para televisión, web y redes: lanzamientos, belleza, moda, tecnología y joyería. Aquí tienes siete: <a href="#commercials">ver los anuncios</a>' },
  web: { en: 'We design and code websites from scratch: e-commerce, hospitality and portfolios, bilingual, with 3D and scroll storytelling. <a href="#websites">See them live</a>', es: 'Diseñamos y programamos webs desde cero: e-commerce, hostelería y portfolios, bilingües, con 3D y storytelling con scroll. <a href="#websites">Verlas en directo</a>' },
  app: { en: 'We turn your website into an iPhone and Android app with the same brand, native navigation, ordering and bookings. <a href="#apps">See the apps</a>', es: 'Convertimos tu web en app para iPhone y Android con la misma marca, navegación nativa, pedidos y reservas. <a href="#apps">Ver las apps</a>' },
  photo: { en: 'Product photography, packaging, fashion, food, consistent characters and banner sets for Meta and Google. <a href="#gallery">See the gallery</a>', es: 'Foto de producto, packaging, moda, comida, personajes coherentes y packs de banners para Meta y Google. <a href="#gallery">Ver la galería</a>' },
  rights: { en: 'Final files are delivered for your commercial use, and the usage terms are written into each proposal. We work with tools whose plans allow commercial use.', es: 'Los archivos finales se entregan para tu uso comercial y las condiciones de uso van por escrito en cada propuesta. Trabajamos con herramientas cuyos planes permiten el uso comercial.' },
  contact: { en: 'Write to malurosbolea@gmail.com or call +34 692 892 183. You can also type your email here and I’ll add it to the form. <a href="#contact">Open the form</a>', es: 'Escribe a malurosbolea@gmail.com o llama al +34 692 892 183. También puedes escribir aquí tu email y lo añado al formulario. <a href="#contact">Abrir el formulario</a>' },
  services: { en: 'AI commercials, websites, apps, social media management, reels, banners, product photography and ad campaigns (SEO, SEM, Meta and Google Ads). <a href="#services">See everything</a>', es: 'Anuncios con IA, webs, apps, gestión de redes sociales, reels, banners, foto de producto y campañas (SEO, SEM, Meta y Google Ads). <a href="#services">Ver todo</a>' },
  about: { en: 'Neverfilmed was founded by María Luisa Ros Bolea: digital communication, a Master’s in Big Data & AI, and years of brand and social media work. <a href="#studio">About us</a>', es: 'Neverfilmed la fundó María Luisa Ros Bolea: comunicación digital, un Máster en Big Data e IA y años de trabajo en marcas y redes sociales. <a href="#studio">Sobre nosotros</a>' },
  thanks: { en: 'A pleasure! Anything else?', es: '¡Un placer! ¿Algo más?' },
  email: { en: 'Got it, I’ve added your email to the contact form. Tell me a bit about the project, or jump to the form to send it. <a href="#contact">Go to the form</a>', es: 'Hecho, he añadido tu email al formulario de contacto. Cuéntame un poco el proyecto o ve al formulario para enviarlo. <a href="#contact">Ir al formulario</a>' },
  fallback: { en: "I'm not sure I got that. I can help with prices, timing, social media, tools, our work or getting in touch.", es: 'No estoy segura de haberlo entendido. Te ayudo con precios, plazos, redes sociales, herramientas, nuestros trabajos o con el contacto.' }
};
const INTENTS = [
  [/price|cost|budget|how much|rate|quote|precio|cuesta|cu[aá]nto|presupuesto|tarifa|negoci/i, 'price'],
  [/social|instagram|tiktok|linkedin|community|redes|seguidores|followers|feed/i, 'social'],
  [/time|long|deadline|when|fast|urgent|plazo|tiempo|cu[aá]ndo|r[aá]pido|urgente|tarda/i, 'time'],
  [/tool|model|higgsfield|seedance|kling|veo|magnific|nano banana|herramienta|modelo|\bai\b|\bia\b/i, 'tools'],
  [/commercial|\bads?\b|video|spot|anuncio|comercial|v[ií]deo/i, 'ads'],
  [/\bapps?\b|mobile|m[oó]vil|ios|android/i, 'app'],
  [/web|site|landing|p[aá]gina/i, 'web'],
  [/photo|banner|image|picture|foto|imagen/i, 'photo'],
  [/right|own|copyright|licen|derecho|propiedad/i, 'rights'],
  [/contact|email|mail|phone|call|talk|human|person|contacto|correo|tel[eé]fono|llamar|hablar|persona/i, 'contact'],
  [/service|what do you|offer|servicio|qu[eé] hac[eé]is|ofrec/i, 'services'],
  [/who|founder|about|team|qui[eé]n|fundador|equipo|sobre vosotros/i, 'about'],
  [/thank|gracias/i, 'thanks'],
  [/hello|^hi\b|hey|hola|buenas/i, 'hi']
];
const QUICK = [
  [{ en: 'Prices', es: 'Precios' }, 'How much does it cost?', '¿Cuánto cuesta?'],
  [{ en: 'Social media', es: 'Redes sociales' }, 'Do you manage social media?', '¿Lleváis redes sociales?'],
  [{ en: 'Timing', es: 'Plazos' }, 'How long does it take?', '¿Cuánto tardáis?'],
  [{ en: 'Tools', es: 'Herramientas' }, 'Which AI tools do you use?', '¿Qué herramientas de IA usáis?'],
  [{ en: 'Talk to a human', es: 'Hablar con alguien' }, 'I want to talk to a person', 'Quiero hablar con una persona']
];
const log = $('#botLog'), botPanel = $('#botPanel'), orb = $('#botOrb');
let greeted = false;
function addMsg(html, who) {
  const m = document.createElement('div'); m.className = 'msg ' + who;
  if (who === 'u') m.textContent = html; else m.innerHTML = html;
  log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
}
function botSay(key) {
  const typing = addMsg('<i></i><i></i><i></i>', 'b typing');
  setTimeout(() => { typing.remove(); addMsg(T(A[key]), 'b'); audio.tick(); }, reduce ? 50 : 650);
}
function answer(text) {
  addMsg(text, 'u');
  const em = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  if (em) { $('#fEmail').value = em[0]; return botSay('email'); }
  const hit = INTENTS.find(([r]) => r.test(text));
  botSay(hit ? hit[1] : 'fallback');
}
function renderQuick() {
  $('#botQuick').innerHTML = QUICK.map((q, i) => `<button type="button" data-q="${i}">${esc(T(q[0]))}</button>`).join('');
  $$('#botQuick button').forEach(b => b.addEventListener('click', () => { const q = QUICK[+b.dataset.q]; answer(lang === 'es' ? q[2] : q[1]); }));
}
function toggleBot(open) {
  botPanel.hidden = !open; orb.setAttribute('aria-expanded', open); audio.click();
  if (open) { if (!greeted) { greeted = true; botSay('hi'); } setTimeout(() => $('#botInput').focus(), 50); }
}
orb.addEventListener('click', () => toggleBot(botPanel.hidden));
$('#botClose').addEventListener('click', () => toggleBot(false));
$('#botForm').addEventListener('submit', e => { e.preventDefault(); const v = $('#botInput').value.trim(); if (!v) return; $('#botInput').value = ''; answer(v); });
addEventListener('keydown', e => { if (e.key === 'Escape') { if (!lb.hidden) closeLB(); if (!botPanel.hidden) toggleBot(false); } });

/* ---------------- opening ---------------- */
const intro = $('#intro');
const [startPage, startSub] = parseHash(location.hash);
function finishIntro(skipped) {
  if (!intro.isConnected) return;
  intro.remove(); document.body.classList.remove('intro-on');
  if (startPage !== 'home') { if (stage) stage.skip(); showPage(startPage); if (startSub) setTimeout(() => scrollToEl(document.getElementById(startSub)), 400); }
  else { if (stage) (skipped ? stage.skip() : stage.land(2000)); showPage('home'); }
  lenis && lenis.start();
}
function enter(withSound) {
  if (intro.classList.contains('flying')) return;
  if (withSound) { audio.start(); syncSound(); store.set('nf-sound', '1'); }
  intro.classList.add('flying');
  if (reduce || !G) { finishIntro(true); return; }
  audio.whoosh(2.6, 120, 7000, 0.32);
  G.to('#introUI', { scale: 0.9, opacity: 0, duration: 0.5, ease: 'power3.in' });
  G.to('#introSkip', { opacity: 0, duration: 0.3 });
  const tl = G.timeline();
  tl.fromTo('#iw1', { scale: 0.25, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, 0.25)
    .to('#iw1', { scale: 7, opacity: 0, filter: 'blur(10px)', duration: 0.6, ease: 'expo.in' }, 0.95)
    .fromTo('#iw2', { scale: 0.25, opacity: 0, filter: 'blur(12px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, 1.25)
    .to('#iw2', { scale: 8, opacity: 0, filter: 'blur(10px)', duration: 0.55, ease: 'expo.in' }, 1.95);
  const flight = stage ? stage.fly(2500) : new Promise(r => setTimeout(r, 2500));
  flight.then(() => {
    G.timeline()
      .to('#flash', { opacity: 1, duration: 0.12, ease: 'power2.in' })
      .add(() => { audio.chime(); finishIntro(false); })
      .to('#flash', { opacity: 0, duration: 1.1, ease: 'power2.out' });
  });
}
lenis && lenis.stop();
$('#enterSound').addEventListener('click', () => enter(true));
$('#enterQuiet').addEventListener('click', () => enter(false));
$('#introSkip').addEventListener('click', () => { if (store.get('nf-sound') === '1') { audio.start(); syncSound(); } finishIntro(true); });
addEventListener('keydown', e => { if (intro.isConnected && (e.code === 'Space' || e.key === 'Enter') && intro.classList.contains('ready')) { e.preventDefault(); enter(true); } });
(function load() {
  const num = $('#loadNum'), bar = $('#loadBar');
  const imgs = [...HELIX, 'media/founder.webp'];
  let done = 0, shown = 0;
  imgs.forEach(src => { const im = new Image(); im.onload = im.onerror = () => { done++; }; im.src = src; });
  const t0 = performance.now();
  (function tick(now) {
    const target = Math.min(done / imgs.length, (now - t0) / 1400);
    shown += (target - shown) * 0.12;
    if (target >= 1 && shown > 0.985) shown = 1;
    num.textContent = Math.round(shown * 100); bar.style.width = (shown * 100) + '%';
    if (shown < 1 && now - t0 < 6000) return requestAnimationFrame(tick);
    num.textContent = 100; bar.style.width = '100%'; intro.classList.add('ready');
  })(t0);
})();

/* ---------------- init ---------------- */
applyLang(lang);
addEventListener('load', () => ST && ST.refresh());
}
