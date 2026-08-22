/*!
 * Asistente Pedagogico - Constructor de Mentefactos
 * Version 1.0.0 - JavaScript sin dependencias externas.
 *
 * REGLAS DE PORTABILIDAD (no romper: de esto depende que migrar a WordPress sea gratis)
 *  1. Todo el codigo vive dentro de esta funcion anonima. Cero variables globales.
 *  2. Toda la interfaz se dibuja dentro de #mentefacto-app. No se toca nada de fuera.
 *  3. Ningun recurso externo: sin CDN, sin fuentes remotas, sin peticiones de red.
 *  4. track() tiene guarda: si gtag no existe (GitHub Pages) no hace nada y no falla.
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. CONFIGURACION
     ========================================================================== */

  var VERSION = '1.0.0';
  var RAIZ_ID = 'mentefacto-app';
  var LS_KEY = 'siepsi_mentefacto_v1';
  var URL_BLOG = 'https://siepsi.com.co/herramientas-academicas/mentefacto-2/';
  var URL_LECTURA = 'https://n9.cl/0yndd';
  var CREDITO = 'Creado con el Asistente Pedagógico de Mentefactos · Semillero de Investigación SIEPSI · siepsi.com.co';

  var MAX_ITEMS = 6;
  var MIN_ITEMS = 1;

  /* Paletas de exportacion. boxStroke permite el tema de alto contraste. */
  var TEMAS = {
    siepsi: {
      nom: 'SIEPSI',
      fondo: '#ffffff',
      caja: '#09364d', cajaTxt: '#ffffff', cajaBorde: '#09364d',
      centro: '#7ac142', centroTxt: '#09364d', centroBorde: '#5c9a2e',
      supra: '#17546b', supraTxt: '#ffffff', supraBorde: '#17546b',
      linea: '#09364d', titulo: '#09364d', pie: '#8fa3ac'
    },
    clasico: {
      nom: 'Clásico',
      fondo: '#ffffff',
      caja: '#6f9e99', cajaTxt: '#ffffff', cajaBorde: '#5c8783',
      centro: '#3f6b67', centroTxt: '#ffffff', centroBorde: '#2f4f4d',
      supra: '#6f9e99', supraTxt: '#ffffff', supraBorde: '#5c8783',
      linea: '#2f4f4d', titulo: '#2f4f4d', pie: '#9bb0ad'
    },
    contraste: {
      nom: 'Alto contraste',
      fondo: '#ffffff',
      caja: '#ffffff', cajaTxt: '#000000', cajaBorde: '#000000',
      centro: '#000000', centroTxt: '#ffffff', centroBorde: '#000000',
      supra: '#ffffff', supraTxt: '#000000', supraBorde: '#000000',
      linea: '#000000', titulo: '#000000', pie: '#555555'
    }
  };

  /* Palabras que no deben abrir un elemento del mentefacto. */
  var PREPOS = ['de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'que', 'para', 'por', 'con', 'en', 'y', 'o', 'a', 'al', 'es', 'son', 'se',
    'su', 'sus', 'lo', 'como', 'sobre', 'entre'];

  var PASOS = [
    {
      id: 'concepto', nom: 'Concepto', tit: 'Concepto central', tipo: 'uno',
      preg: '¿Qué concepto vas a estudiar?',
      ph: 'Ej.: entrevista',
      ayuda: 'Escribe <b>un solo concepto</b>, en singular y sin artículos. Es el núcleo de todo el mentefacto: los cuatro cuadrantes se definen en relación con él.'
    },
    {
      id: 'supra', nom: 'Supraordinación', tit: 'Supraordinación — va arriba', tipo: 'uno',
      preg: '¿Cuál es la categoría o clase superior más próxima a la que pertenece {C}?',
      ph: 'Ej.: técnica de recolección de información',
      ayuda: 'Es la clase más amplia a la que pertenece el concepto. Busca la <b>más cercana</b>, no la más general: para <i>entrevista</i>, «técnica de recolección de información» funciona mucho mejor que «psicología».'
    },
    {
      id: 'iso', nom: 'Isoordinación', tit: 'Isoordinación — va a la izquierda', tipo: 'lista', rec: 3,
      preg: '¿Qué características definen únicamente a {C}?',
      ph: 'Una característica',
      ayuda: 'Son las cualidades que caracterizan <b>únicamente</b> al concepto y que no comparten ni las clases excluidas ni la clase supraordinada. Enlista palabras clave, nunca frases completas.'
    },
    {
      id: 'excl', nom: 'Exclusión', tit: 'Exclusión — va a la derecha', tipo: 'lista', rec: 2,
      preg: 'Dentro de {S}, ¿qué otros conceptos <b>no</b> son {C}?',
      ph: 'Un concepto hermano',
      ayuda: 'Son los miembros que, perteneciendo a la <b>misma clase mayor</b>, se diferencian del concepto o se le oponen. Es el cuadrante donde más se equivoca la gente: no busques «lo contrario», busca <b>los hermanos</b> del concepto dentro de su misma clase.'
    },
    {
      id: 'infra', nom: 'Infraordinación', tit: 'Infraordinación — va abajo', tipo: 'lista', rec: 2,
      preg: '¿En qué subclases o tipos se divide {C}?',
      ph: 'Una subclase o tipo',
      ayuda: 'Son las subclases o elementos que pertenecen al concepto central. Si el concepto no se divide en tipos, piensa en sus componentes o etapas.'
    },
    { id: 'rev', nom: 'Revisión', tit: 'Revisión y descarga', tipo: 'revision' }
  ];

  var EJEMPLOS = {
    ejecutivas: {
      nom: 'Funciones ejecutivas',
      desc: 'El ejemplo publicado en el blog del semillero.',
      datos: {
        titulo: 'Mentefacto: funciones ejecutivas', autor: '',
        concepto: 'Funciones ejecutivas',
        supra: 'Procesos cognitivos superiores',
        iso: ['Control consciente', 'Orientación a metas', 'Regulación de la conducta', 'Coordinación de procesos cognitivos', 'Adaptación'],
        excl: ['Reflejos', 'Procesamiento automático', 'Conductas instintivas', 'Hábitos automáticos'],
        infra: ['Inhibición', 'Memoria de trabajo', 'Planificación', 'Flexibilidad cognitiva', 'Monitoreo']
      }
    },
    entrevista: {
      nom: 'Entrevista',
      desc: 'El ejemplo de la Figura 2 del blog del semillero.',
      /* Contenido tomado de la Figura 2 publicada. La infraordinacion original
         lista diez subclases; aqui van seis, que es el maximo por cuadrante. */
      datos: {
        titulo: 'Mentefacto: entrevista', autor: '',
        concepto: 'Entrevista',
        supra: 'Instrumentos psicológicos',
        iso: ['Entrevistador-entrevistado', 'Diálogo guiado', 'Recolección datos cualitativos', 'Datos verbales'],
        excl: ['Encuesta', 'Prueba', 'Inventario', 'Protocolo de observación'],
        infra: ['Etnográfica', 'Focalizada', 'Episódica', 'Semiestructurada', 'Narrativa', 'Grupal']
      }
    },
    actitud: {
      nom: 'Ejercicio práctico: actitud',
      desc: 'El ejercicio de la guía. Se carga vacío para que lo resuelvas tú.',
      datos: {
        titulo: 'Mentefacto: actitud', autor: '',
        concepto: 'Actitud', supra: '', iso: ['', '', ''], excl: ['', ''], infra: ['', '']
      },
      lectura: true
    }
  };

  /* ==========================================================================
     2. UTILIDADES
     ========================================================================== */

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function palabras(t) {
    return String(t == null ? '' : t).trim().split(/\s+/).filter(Boolean);
  }

  function norm(t) {
    var s = String(t == null ? '' : t).toLowerCase();
    if (s.normalize) s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return s.replace(/\s+/g, ' ').trim();
  }

  function limpiar(arr) {
    return (arr || []).map(function (t) { return String(t || '').trim(); }).filter(Boolean);
  }

  function slug(t) {
    var s = norm(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return s || 'mentefacto';
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(c, a); }, ms);
    };
  }

  /* Google Analytics 4. En GitHub Pages gtag no existe: la guarda evita el error
     y el dia que esto viva en WordPress los eventos empiezan a llegar solos. */
  function track(evento, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', evento, params || {});
    } catch (e) { /* nunca romper la herramienta por analitica */ }
  }

  /* ==========================================================================
     3. ESTADO
     ========================================================================== */

  function estadoVacio() {
    return {
      v: VERSION, titulo: '', autor: '', concepto: '', supra: '',
      iso: ['', '', ''], excl: ['', ''], infra: ['', ''], tema: 'siepsi'
    };
  }

  var S = estadoVacio();
  var pasoActual = 0;
  var yaContado = {};       /* eventos de GA que solo se disparan una vez */
  var raiz = null;
  var vista = 'bienvenida';   /* 'bienvenida' | 'app' */
  var avisoPendiente = null;  /* mensajes que se muestran al entrar a la app */
  var ultimoSVG = { W: 900, H: 600, txt: '' };

  function guardar() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { }
  }

  function recuperar() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || typeof d !== 'object') return null;
      return d;
    } catch (e) { return null; }
  }

  function aplicar(datos) {
    var base = estadoVacio();
    ['titulo', 'autor', 'concepto', 'supra', 'tema'].forEach(function (k) {
      if (typeof datos[k] === 'string') base[k] = datos[k];
    });
    ['iso', 'excl', 'infra'].forEach(function (k) {
      if (Array.isArray(datos[k]) && datos[k].length) {
        base[k] = datos[k].slice(0, MAX_ITEMS).map(function (t) { return String(t || ''); });
      }
    });
    if (!TEMAS[base.tema]) base.tema = 'siepsi';
    S = base;
  }

  function hayContenido() {
    return !!(S.concepto.trim() || S.supra.trim() ||
      limpiar(S.iso).length || limpiar(S.excl).length || limpiar(S.infra).length);
  }

  function estaCompleto() {
    return !!(S.concepto.trim() && S.supra.trim() &&
      limpiar(S.iso).length && limpiar(S.excl).length && limpiar(S.infra).length);
  }

  /* ==========================================================================
     4. VALIDADOR PEDAGOGICO
     ========================================================================== */

  function avisosItem(t, campo) {
    var a = [], p = palabras(t);
    if (!p.length) return a;

    /* Regla del blog: la exclusion son «otros conceptos PERTENECIENTES a la
       clase o categoria superior», no la clase misma. Es el error clasico. */
    if (campo === 'excl' && S.supra.trim() && norm(t) === norm(S.supra)) {
      a.push('No repitas la clase superior: aquí van los conceptos hermanos, no la clase que los contiene.');
    }
    if (campo && campo !== 'concepto' && S.concepto.trim() && norm(t) === norm(S.concepto)) {
      a.push('No repitas el concepto central: cada cuadrante aporta información nueva.');
    }
    if (p.length > 5) a.push('No escribas frases: redúcelo a palabras clave.');
    if (PREPOS.indexOf(norm(p[0])) >= 0) a.push('No inicies con «' + p[0] + '»: quita artículos y preposiciones.');
    if (/[.;,:]$/.test(t.trim())) a.push('No uses signos de puntuación al final.');
    return a;
  }

  function avisosConcepto(t) {
    var a = [], p = palabras(t);
    if (!p.length) return a;
    if (p.length > 4) a.push('No uses frases: el concepto central es una sola idea corta.');
    if (PREPOS.indexOf(norm(p[0])) >= 0) a.push('No inicies con «' + p[0] + '»: quita artículos y preposiciones.');
    return a;
  }

  /* Rubrica del semillero: Estructura, Pertinencia, Claridad. */
  function evaluar() {
    var iso = limpiar(S.iso), exc = limpiar(S.excl), inf = limpiar(S.infra);
    var con = S.concepto.trim(), sup = S.supra.trim();
    var sug = [];
    var todos = iso.concat(exc, inf);

    /* --- Estructura: estan las cuatro operaciones en su cuadrante? --- */
    var est = 0;
    if (con) est += 20;
    else sug.push(['estructura', 'Falta el concepto central.']);

    if (sup) est += 20;
    else sug.push(['estructura', 'Falta la supraordinación. Sin la clase superior el mentefacto no se sostiene.']);

    if (iso.length >= 3) est += 20;
    else if (iso.length >= 1) { est += 12; sug.push(['estructura', 'Tienes ' + iso.length + ' isoordinada(s). Se recomiendan al menos 3.']); }
    else sug.push(['estructura', 'Falta la isoordinación: las características propias del concepto.']);

    if (exc.length >= 2) est += 20;
    else if (exc.length === 1) { est += 12; sug.push(['estructura', 'Añade al menos otra exclusión: con una sola no se aprecia el contraste.']); }
    else sug.push(['estructura', 'Falta la exclusión: los conceptos hermanos dentro de la clase superior.']);

    if (inf.length >= 2) est += 20;
    else if (inf.length === 1) { est += 12; sug.push(['estructura', 'Añade al menos otra infraordinada: un concepto rara vez tiene una sola subclase.']); }
    else sug.push(['estructura', 'Falta la infraordinación: las subclases o tipos del concepto.']);

    /* --- Pertinencia: son palabras clave relevantes? --- */
    var per = 100, largos = 0, arts = 0, dups = 0, repite = 0;
    [iso, exc, inf].forEach(function (lista) {
      var vistos = {};
      lista.forEach(function (t) {
        var p = palabras(t), k = norm(t);
        if (p.length > 5) largos++;
        if (PREPOS.indexOf(norm(p[0])) >= 0) arts++;
        if (vistos[k]) dups++; else vistos[k] = 1;
        if (con && k === norm(con)) repite++;
      });
    });
    per -= largos * 8; per -= arts * 5; per -= dups * 10; per -= repite * 12;

    if (con && palabras(con).length > 4) { per -= 10; sug.push(['pertinencia', 'El concepto central es demasiado largo. Debe ser una sola idea.']); }
    if (con && sup && norm(sup) === norm(con)) { per -= 15; sug.push(['pertinencia', 'La supraordinada no puede ser el mismo concepto central.']); }
    /* «tome únicamente la información más relevante y precisa para evitar
       ambigüedades» (blog). Un mismo término en dos cuadrantes es justo esa
       ambigüedad: cada cuadrante responde a una pregunta distinta. */
    var mapa = {};
    [['iso', iso], ['excl', exc], ['infra', inf]].forEach(function (par) {
      par[1].forEach(function (t) {
        var k = norm(t);
        if (!mapa[k]) mapa[k] = [];
        if (mapa[k].indexOf(par[0]) < 0) mapa[k].push(par[0]);
      });
    });
    var cruzados = Object.keys(mapa).filter(function (k) { return mapa[k].length > 1; });
    if (cruzados.length) {
      per -= cruzados.length * 10;
      sug.push(['pertinencia', cruzados.length + ' elemento(s) se repiten en dos cuadrantes distintos. Cada cuadrante responde a una pregunta diferente.']);
    }

    /* La exclusión son los miembros de la clase superior, nunca la clase. */
    var exclEsSupra = sup ? exc.filter(function (t) { return norm(t) === norm(sup); }).length : 0;
    if (exclEsSupra) {
      per -= 12;
      sug.push(['pertinencia', 'La exclusión repite la clase superior. Deben ser los conceptos hermanos que pertenecen a esa clase, no la clase misma.']);
    }

    if (largos) sug.push(['pertinencia', largos + ' elemento(s) están escritos como frase. Redúcelos a palabras clave.']);
    if (arts) sug.push(['pertinencia', arts + ' elemento(s) empiezan con artículo o preposición. Elimínalos.']);
    if (dups) sug.push(['pertinencia', 'Hay ' + dups + ' elemento(s) repetidos dentro de un mismo cuadrante.']);
    if (repite) sug.push(['pertinencia', 'Un elemento repite el concepto central. Cada cuadrante debe aportar información nueva.']);
    per = Math.max(0, Math.min(100, per));

    /* --- Claridad: se lee de corrido? --- */
    var cla = 100;
    var punt = todos.filter(function (t) { return /[.;,:]$/.test(t.trim()); }).length;
    if (punt) { cla -= 12; sug.push(['claridad', punt + ' elemento(s) terminan en signo de puntuación. En un mentefacto no se usan.']); }

    var prom = todos.length ? todos.reduce(function (a, t) { return a + palabras(t).length; }, 0) / todos.length : 0;
    if (prom > 3.5) { cla -= 15; sug.push(['claridad', 'El promedio es de ' + prom.toFixed(1) + ' palabras por elemento. Lo ideal está entre 1 y 3.']); }

    if (iso.length && exc.length && inf.length) {
      var cnts = [iso.length, exc.length, inf.length];
      var mx = Math.max.apply(null, cnts), mn = Math.min.apply(null, cnts);
      if (mx - mn >= 4) { cla -= 12; sug.push(['claridad', 'Los cuadrantes están muy desequilibrados (' + iso.length + '/' + exc.length + '/' + inf.length + '). Busca un reparto más parejo.']); }
    }
    if (todos.length > 15) { cla -= 10; sug.push(['claridad', 'Hay ' + todos.length + ' elementos en total. Un mentefacto legible rara vez pasa de 15.']); }
    cla = Math.max(0, Math.min(100, cla));

    /* Un mentefacto casi vacio no puede sacar 100 en pertinencia ni claridad. */
    if (est < 60) { per = Math.round(per * est / 100); cla = Math.round(cla * est / 100); }

    var total = Math.round((est + per + cla) / 3);
    var nivel = total >= 90 ? 'Excelente' : total >= 75 ? 'Bueno' : total >= 50 ? 'Aceptable' : 'En construcción';

    return { estructura: est, pertinencia: per, claridad: cla, total: total, nivel: nivel, sugerencias: sug };
  }

  /* ==========================================================================
     5. MOTOR DE DIBUJO (SVG)
     ========================================================================== */

  var FUENTE = 'Arial, \'Helvetica Neue\', Helvetica, sans-serif';
  var _medidor = null;

  function ctxMedida() {
    if (!_medidor) {
      var c = document.createElement('canvas');
      _medidor = c.getContext('2d');
    }
    return _medidor;
  }

  function medir(txt, size, peso) {
    var c = ctxMedida();
    c.font = (peso || 400) + ' ' + size + 'px ' + FUENTE;
    return c.measureText(String(txt)).width;
  }

  /* Ajuste de linea manual con tspan. No usamos foreignObject a proposito:
     no se rasteriza a PNG en la mayoria de navegadores. */
  function envolver(txt, maxW, size, peso, maxLineas) {
    maxLineas = maxLineas || 4;
    var ps = palabras(txt), lineas = [], actual = '';
    for (var i = 0; i < ps.length; i++) {
      var w = ps[i];
      /* palabra sola mas ancha que la caja: se parte por caracteres */
      if (medir(w, size, peso) > maxW) {
        if (actual) { lineas.push(actual); actual = ''; }
        var trozo = '';
        for (var j = 0; j < w.length; j++) {
          if (medir(trozo + w[j], size, peso) > maxW && trozo) { lineas.push(trozo); trozo = ''; }
          trozo += w[j];
        }
        actual = trozo;
        continue;
      }
      var prueba = actual ? actual + ' ' + w : w;
      if (medir(prueba, size, peso) <= maxW || !actual) actual = prueba;
      else { lineas.push(actual); actual = w; }
    }
    if (actual) lineas.push(actual);
    if (lineas.length > maxLineas) {
      lineas = lineas.slice(0, maxLineas);
      lineas[maxLineas - 1] = lineas[maxLineas - 1].replace(/.{3}$/, '…');
    }
    return lineas.length ? lineas : [''];
  }

  function alturaCaja(lineas, size, padY) {
    return Math.max(size * 2.6, lineas.length * (size * 1.28) + padY * 2);
  }

  function dibujarCaja(x, y, w, h, lineas, size, peso, relleno, color, borde, rx) {
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="' + rx + '" ry="' + rx + '" fill="' + relleno + '" stroke="' + borde + '" stroke-width="1.6"/>';
    var lh = size * 1.28;
    var y0 = y + h / 2 - (lineas.length - 1) * lh / 2 + size * 0.35;
    for (var i = 0; i < lineas.length; i++) {
      s += '<text x="' + (x + w / 2).toFixed(1) + '" y="' + (y0 + i * lh).toFixed(1) +
        '" text-anchor="middle" font-family="' + FUENTE + '" font-size="' + size +
        '" font-weight="' + peso + '" fill="' + color + '">' + esc(lineas[i]) + '</text>';
    }
    return s;
  }

  function linea(x1, y1, x2, y2, color, flecha) {
    return '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) +
      '" y2="' + y2.toFixed(1) + '" stroke="' + color + '" stroke-width="1.8" stroke-linecap="square"' +
      (flecha ? ' marker-end="url(#mfPunta)"' : '') + '/>';
  }

  function construirSVG() {
    var T = TEMAS[S.tema] || TEMAS.siepsi;

    var M = 44, SIDE_W = 208, CENTER_W = 250, INFRA_W = 152;
    var GAP_V = 13, GAP_H = 16, BRAZO = 70, CODO = 34, PAD = 9;
    var RX = 0;   /* esquinas rectas: es el estilo de SIEPSI */
    var FS_LADO = 13, FS_CENTRO = 16, FS_SUPRA = 14, FS_TIT = 22, FS_AUT = 12, FS_PIE = 10;

    var con = S.concepto.trim() || 'Concepto central';
    var sup = S.supra.trim();
    var iso = limpiar(S.iso), exc = limpiar(S.excl), inf = limpiar(S.infra);

    /* --- Medidas de cada caja --- */
    var lnCon = envolver(con, CENTER_W - PAD * 2 - 8, FS_CENTRO, 700, 3);
    var hCon = alturaCaja(lnCon, FS_CENTRO, PAD + 3);

    var lnSup = sup ? envolver(sup, SIDE_W + 40 - PAD * 2, FS_SUPRA, 600, 3) : null;
    var wSup = SIDE_W + 40;
    var hSup = lnSup ? alturaCaja(lnSup, FS_SUPRA, PAD) : 0;

    function preparar(lista, ancho, size) {
      return lista.map(function (t) {
        var l = envolver(t, ancho - PAD * 2, size, 600, 3);
        return { txt: t, ln: l, h: alturaCaja(l, size, PAD) };
      });
    }
    var bIso = preparar(iso, SIDE_W, FS_LADO);
    var bExc = preparar(exc, SIDE_W, FS_LADO);
    var bInf = preparar(inf, INFRA_W, FS_LADO);

    /* --- Ancho total del lienzo --- */
    var anchoInfra = bInf.length ? bInf.length * INFRA_W + (bInf.length - 1) * GAP_H : 0;
    var W = Math.max(M + SIDE_W + BRAZO + CENTER_W + BRAZO + SIDE_W + M, anchoInfra + M * 2);
    var cx = W / 2;
    var xIso = cx - CENTER_W / 2 - BRAZO - SIDE_W;
    var xExc = cx + CENTER_W / 2 + BRAZO;

    /* --- Posiciones verticales --- */
    var y = 26, cab = '';
    var tit = S.titulo.trim();
    var aut = S.autor.trim();
    if (tit) {
      cab += '<text x="' + cx + '" y="' + (y + FS_TIT * 0.8) + '" text-anchor="middle" font-family="' + FUENTE +
        '" font-size="' + FS_TIT + '" font-weight="700" fill="' + T.titulo + '">' + esc(tit) + '</text>';
      y += FS_TIT + 14;
    }
    if (aut) {
      cab += '<text x="' + cx + '" y="' + (y + FS_AUT * 0.8) + '" text-anchor="middle" font-family="' + FUENTE +
        '" font-size="' + FS_AUT + '" font-weight="400" fill="' + T.pie + '">' + esc(aut) + '</text>';
      y += FS_AUT + 12;
    }
    if (!tit && !aut) y = 34;

    var supY = y + 12;
    var supBot = lnSup ? supY + hSup : supY;

    function altoColumna(bs) {
      if (!bs.length) return 0;
      return bs.reduce(function (a, b) { return a + b.h; }, 0) + (bs.length - 1) * GAP_V;
    }
    var hCol = Math.max(altoColumna(bIso), altoColumna(bExc));

    var conCY = Math.max(supBot + 64 + hCon / 2, supBot + 30 + hCol / 2, hCon / 2 + 120);
    var conTop = conCY - hCon / 2, conBot = conCY + hCon / 2;
    var colTop = conCY - hCol / 2, colBot = conCY + hCol / 2;

    var hInf = bInf.length ? Math.max.apply(null, bInf.map(function (b) { return b.h; })) : 0;
    var infTop = bInf.length ? Math.max(conBot + 88, colBot + 64) : conBot;
    var H = (bInf.length ? infTop + hInf : Math.max(conBot, colBot)) + 34 + 22;

    /* --- Dibujo --- */
    var g = '';

    /* Supraordinacion */
    if (lnSup) {
      g += dibujarCaja(cx - wSup / 2, supY, wSup, hSup, lnSup, FS_SUPRA, 600, T.supra, T.supraTxt, T.supraBorde, RX);
      g += linea(cx, conTop, cx, supBot + 3, T.linea, true);
    }

    /* Isoordinacion (izquierda) */
    if (bIso.length) {
      var bordeIso = xIso + SIDE_W;
      var codoIso = bordeIso + CODO;
      /* cada columna se centra por si misma sobre el concepto: si se usara colTop
         (el alto de la columna mas larga) la columna corta quedaria desplazada */
      var yy = conCY - altoColumna(bIso) / 2, centrosI = [];
      bIso.forEach(function (b) {
        g += dibujarCaja(xIso, yy, SIDE_W, b.h, b.ln, FS_LADO, 600, T.caja, T.cajaTxt, T.cajaBorde, RX);
        centrosI.push(yy + b.h / 2);
        yy += b.h + GAP_V;
      });
      if (bIso.length === 1) {
        g += linea(cx - CENTER_W / 2, conCY, bordeIso + 4, centrosI[0], T.linea, true);
      } else {
        g += linea(cx - CENTER_W / 2, conCY, codoIso, conCY, T.linea, false);
        g += linea(codoIso, centrosI[0], codoIso, centrosI[centrosI.length - 1], T.linea, false);
        centrosI.forEach(function (yc) { g += linea(codoIso, yc, bordeIso + 4, yc, T.linea, true); });
      }
    }

    /* Exclusion (derecha) con el signo de diferente sobre la linea */
    if (bExc.length) {
      var bordeExc = xExc;
      var codoExc = bordeExc - CODO;
      var yy2 = conCY - altoColumna(bExc) / 2, centrosE = [];
      bExc.forEach(function (b) {
        g += dibujarCaja(xExc, yy2, SIDE_W, b.h, b.ln, FS_LADO, 600, T.caja, T.cajaTxt, T.cajaBorde, RX);
        centrosE.push(yy2 + b.h / 2);
        yy2 += b.h + GAP_V;
      });
      var xIni = cx + CENTER_W / 2;
      if (bExc.length === 1) {
        g += linea(xIni, conCY, bordeExc - 4, centrosE[0], T.linea, true);
      } else {
        g += linea(xIni, conCY, codoExc, conCY, T.linea, false);
        g += linea(codoExc, centrosE[0], codoExc, centrosE[centrosE.length - 1], T.linea, false);
        centrosE.forEach(function (yc) { g += linea(codoExc, yc, bordeExc - 4, yc, T.linea, true); });
      }
      /* dos barras inclinadas = "no pertenece a", como en la Figura 1 de la guia */
      var xm = (xIni + codoExc) / 2;
      g += '<rect x="' + (xm - 12) + '" y="' + (conCY - 12) + '" width="24" height="24" fill="' + T.fondo + '"/>';
      g += linea(xm - 7, conCY + 9, xm - 1, conCY - 9, T.linea, false);
      g += linea(xm + 1, conCY + 9, xm + 7, conCY - 9, T.linea, false);
    }

    /* Infraordinacion (abajo) */
    if (bInf.length) {
      var x0 = cx - anchoInfra / 2, centrosX = [];
      bInf.forEach(function (b, i) {
        var bx = x0 + i * (INFRA_W + GAP_H);
        g += dibujarCaja(bx, infTop, INFRA_W, hInf, b.ln, FS_LADO, 600, T.caja, T.cajaTxt, T.cajaBorde, RX);
        centrosX.push(bx + INFRA_W / 2);
      });
      if (bInf.length === 1) {
        g += linea(cx, conBot, cx, infTop - 4, T.linea, true);
      } else {
        var ySpine = infTop - 40;
        g += linea(cx, conBot, cx, ySpine, T.linea, false);
        g += linea(centrosX[0], ySpine, centrosX[centrosX.length - 1], ySpine, T.linea, false);
        centrosX.forEach(function (xc) { g += linea(xc, ySpine, xc, infTop - 4, T.linea, true); });
      }
    }

    /* Concepto central. Se dibuja de ultimo a proposito: asi queda por encima de
       los extremos de las lineas que llegan a sus bordes. */
    g += dibujarCaja(cx - CENTER_W / 2, conTop, CENTER_W, hCon, lnCon, FS_CENTRO, 700,
      T.centro, T.centroTxt, T.centroBorde, RX);

    /* Pie de firma: cada mentefacto entregado es una mención del semillero */
    g += '<text x="' + cx + '" y="' + (H - 12) + '" text-anchor="middle" font-family="' + FUENTE +
      '" font-size="' + FS_PIE + '" fill="' + T.pie + '">' + esc(CREDITO) + '</text>';

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + Math.round(W) + '" height="' + Math.round(H) +
      '" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(H) + '" role="img" aria-label="Mentefacto de ' + esc(con) + '">' +
      '<defs><marker id="mfPunta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">' +
      '<path d="M0,1 L9,5 L0,9 z" fill="' + T.linea + '"/></marker></defs>' +
      '<rect width="100%" height="100%" fill="' + T.fondo + '"/>' + cab + g + '</svg>';

    ultimoSVG = { W: Math.round(W), H: Math.round(H), txt: svg };
    return svg;
  }

  /* ==========================================================================
     6. EXPORTACION
     ========================================================================== */

  function nombreArchivo() {
    return 'mentefacto-' + slug(S.concepto || 'sin-titulo');
  }

  function descargarBlob(blob, nombre) {
    var u = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = u; a.download = nombre;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(u); a.parentNode && a.parentNode.removeChild(a); }, 1000);
  }

  function exportarPNG(escala) {
    escala = escala || 2;
    var svg = construirSVG();
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas');
      c.width = Math.round(ultimoSVG.W * escala);
      c.height = Math.round(ultimoSVG.H * escala);
      var x = c.getContext('2d');
      x.fillStyle = (TEMAS[S.tema] || TEMAS.siepsi).fondo;
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(img, 0, 0, c.width, c.height);
      if (c.toBlob) {
        c.toBlob(function (b) { descargarBlob(b, nombreArchivo() + '.png'); }, 'image/png');
      } else {
        var a = document.createElement('a');
        a.href = c.toDataURL('image/png'); a.download = nombreArchivo() + '.png'; a.click();
      }
      track('mf_exportar', { formato: 'png', escala: escala });
    };
    img.onerror = function () {
      aviso('No se pudo generar el PNG en este navegador. Prueba con la descarga en SVG.', true);
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function exportarSVG() {
    var svg = construirSVG();
    descargarBlob(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], { type: 'image/svg+xml;charset=utf-8' }),
      nombreArchivo() + '.svg');
    track('mf_exportar', { formato: 'svg' });
  }

  function exportarJSON() {
    var datos = JSON.parse(JSON.stringify(S));
    datos.guardado = new Date().toISOString();
    descargarBlob(new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' }),
      nombreArchivo() + '.mentefacto.json');
    track('mf_exportar', { formato: 'json' });
  }

  /* PDF sin librerias: se imprime un iframe con la hoja ya puesta en horizontal
     y el usuario elige "Guardar como PDF". Funciona en todos los navegadores. */
  function exportarPDF() {
    var svg = construirSVG();
    var f = document.createElement('iframe');
    f.setAttribute('aria-hidden', 'true');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(f);

    var doc = f.contentWindow.document;
    doc.open();
    doc.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>' +
      esc(nombreArchivo()) + '</title><style>@page{size:A4 landscape;margin:8mm}' +
      'html,body{margin:0;padding:0;background:#fff}' +
      'svg{width:100%;height:auto;display:block}</style></head><body>' + svg + '</body></html>');
    doc.close();

    var limpio = false;
    function quitar() {
      if (limpio) return;
      limpio = true;
      setTimeout(function () { f.parentNode && f.parentNode.removeChild(f); }, 300);
    }
    setTimeout(function () {
      try {
        f.contentWindow.onafterprint = quitar;
        f.contentWindow.focus();
        f.contentWindow.print();
      } catch (e) { aviso('Tu navegador bloqueó la impresión. Descarga el PNG y ese archivo sí lo puedes insertar en Word.', true); }
      setTimeout(quitar, 60000);
    }, 400);

    track('mf_exportar', { formato: 'pdf' });
  }

  /* ==========================================================================
     7. INTERFAZ
     ========================================================================== */

  /* Pantalla de bienvenida. Va dentro de la herramienta y no en la cascara de
     la demo, para que el shortcode de WordPress tambien la traiga. */
  function plantillaBienvenida() {
    var hayBorrador = hayContenido();
    return '' +
      '<div class="mf-bienvenida">' +
      '  <div class="mf-bv-rejilla" aria-hidden="true"></div>' +
      '  <div class="mf-bv-cont">' +
      '    <p class="mf-bv-et">Recursos educativos</p>' +
      '    <h2 class="mf-bv-titulo">Mentefacto</h2>' +
      '    <div class="mf-bv-texto">' +
      '      <p class="mf-bv-l1">Asistente pedagógico para construir mentefactos conceptuales.</p>' +
      '      <p class="mf-bv-l2">Responde las preguntas y el mentefacto se construye solo, con la estructura correcta. Al terminar, la propia herramienta lo revisa con los criterios de la rúbrica del semillero y lo descargas en PNG o PDF.</p>' +
      '      <p class="mf-bv-nota">Herramienta de aprendizaje: cubre la estructura esencial del mentefacto, para que entiendas cómo funciona y lo construyas bien. Para diagramas más elaborados o de otro tipo, usa un editor gráfico.</p>' +
      '      <p class="mf-bv-l3">Semillero de Investigación SIEPSI</p>' +
      '    </div>' +
      '    <div class="mf-bv-pie">' +
      '      <button type="button" class="mf-entrar" data-act="iniciar">' +
      '        <span>' + (hayBorrador ? 'Continuar mi mentefacto' : 'Iniciar mentefacto') + '</span>' +
      '        <svg class="mf-flecha" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/>' +
      '        </svg>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  function plantillaApp() {
    return '' +
      '<div class="mf-shell">' +
      '  <div class="mf-avisos" id="mf-avisos"></div>' +
      '  <header class="mf-tope">' +
      '    <div class="mf-tope-rejilla" aria-hidden="true"></div>' +
      '    <div class="mf-tope-fila">' +
      '      <div>' +
      '        <h2 class="mf-h-tit">Asistente pedagógico</h2>' +
      '        <p class="mf-h-nom">Constructor de Mentefactos</p>' +
      '      </div>' +
      '      <div class="mf-h-acc">' +
      '        <button type="button" class="mf-btn mf-btn-linea" data-act="ejemplos">Ver un ejemplo</button>' +
      '        <button type="button" class="mf-btn mf-btn-linea" data-act="abrir">Abrir archivo</button>' +
      '        <button type="button" class="mf-btn mf-btn-linea" data-act="nuevo">Empezar de cero</button>' +
      '      </div>' +
      '    </div>' +
      '    <ol class="mf-rail" id="mf-rail"></ol>' +
      '  </header>' +
      '  <div class="mf-grid">' +
      '    <section class="mf-col-edit">' +
      '      <div class="mf-panel" id="mf-panel"></div>' +
      '      <div class="mf-nav">' +
      '        <button type="button" class="mf-btn mf-btn-sec" data-act="atras">← Atrás</button>' +
      '        <span class="mf-nav-pos" id="mf-pos"></span>' +
      '        <button type="button" class="mf-btn mf-btn-sig" data-act="siguiente">Siguiente →</button>' +
      '      </div>' +
      '    </section>' +
      '    <section class="mf-col-prev">' +
      '      <div class="mf-prev-sticky">' +
      '      <div class="mf-prev-barra">' +
      '        <span class="mf-prev-tit">Vista previa</span>' +
      '        <button type="button" class="mf-btn mf-btn-linea mf-btn-sm" data-act="ampliar">Ampliar</button>' +
      '        <label class="mf-tema-lbl">Color' +
      '          <select class="mf-select" id="mf-tema">' +
      Object.keys(TEMAS).map(function (k) {
        return '<option value="' + k + '">' + esc(TEMAS[k].nom) + '</option>';
      }).join('') +
      '          </select>' +
      '        </label>' +
      '      </div>' +
      '      <div class="mf-lienzo" id="mf-lienzo"></div>' +
      '      <div class="mf-exp">' +
      '        <button type="button" class="mf-btn mf-btn-pri mf-btn-ancho" data-act="png">Descargar imagen (PNG)</button>' +
      '        <div class="mf-exp-fila">' +
      '          <button type="button" class="mf-btn mf-btn-sec" data-act="pdf">PDF / Imprimir</button>' +
      '          <button type="button" class="mf-btn mf-btn-sec" data-act="svg">SVG</button>' +
      '          <button type="button" class="mf-btn mf-btn-sec" data-act="json">Guardar avance</button>' +
      '        </div>' +
      '        <p class="mf-exp-nota">El archivo <b>Guardar avance</b> te permite retomar el mentefacto más adelante con «Abrir archivo».</p>' +
      '      </div>' +
      '      </div>' +
      '    </section>' +
      '  </div>' +
      '  <input type="file" id="mf-file" accept=".json,application/json" class="mf-oculto">' +
      '  <div class="mf-lupa mf-oculto" id="mf-lupa">' +
      '    <div class="mf-lupa-barra">' +
      '      <span class="mf-lupa-tit">Vista ampliada</span>' +
      '      <div class="mf-lupa-acc">' +
      '        <button type="button" class="mf-zbtn" data-act="zoom-menos" aria-label="Alejar">−</button>' +
      '        <span class="mf-zpct" id="mf-zpct">100%</span>' +
      '        <button type="button" class="mf-zbtn" data-act="zoom-mas" aria-label="Acercar">+</button>' +
      '        <button type="button" class="mf-btn mf-btn-sec mf-btn-sm" data-act="zoom-ajustar">Ajustar</button>' +
      '        <button type="button" class="mf-x" data-act="cerrar-lupa" aria-label="Cerrar">×</button>' +
      '      </div>' +
      '    </div>' +
      '    <div class="mf-lupa-cuerpo" id="mf-lupa-cuerpo"></div>' +
      '  </div>' +
      '  <div class="mf-modal mf-oculto" id="mf-modal"><div class="mf-modal-caja" role="dialog" aria-modal="true">' +
      '    <div class="mf-modal-cab"><h3 id="mf-modal-tit">Título</h3>' +
      '      <button type="button" class="mf-x" data-act="cerrar-modal" aria-label="Cerrar">×</button></div>' +
      '    <div class="mf-modal-cuerpo" id="mf-modal-cuerpo"></div>' +
      '  </div></div>' +
      '</div>';
  }

  /* Los mensajes ya no se autodestruyen: aparecen al pie y se cierran a mano.
     Desaparecer solos hacia la mitad de una lectura confundia mas que ayudaba. */
  function aviso(txt, esError) {
    var cont = $('#mf-avisos', raiz);
    if (!cont) return;
    var d = document.createElement('div');
    d.className = 'mf-flash' + (esError ? ' mf-flash-err' : '');
    d.innerHTML = '<span class="mf-flash-txt">' + txt + '</span>' +
      '<button type="button" class="mf-flash-x" data-act="cerrar-aviso" aria-label="Cerrar aviso">×</button>';
    cont.appendChild(d);
  }

  function textoPregunta(p) {
    var c = S.concepto.trim() || 'el concepto';
    var s = S.supra.trim() || 'la clase superior';
    return p.preg
      .replace('{C}', '<b class="mf-var">' + esc(c) + '</b>')
      .replace('{S}', '<b class="mf-var">' + esc(s) + '</b>');
  }

  function pasoCompleto(i) {
    var p = PASOS[i];
    if (p.tipo === 'uno') return !!S[p.id].trim();
    if (p.tipo === 'lista') return limpiar(S[p.id]).length >= 1;
    return estaCompleto();
  }

  function renderRail() {
    var rail = $('#mf-rail', raiz);
    if (!rail) return;
    rail.innerHTML = PASOS.map(function (p, i) {
      var cls = 'mf-rail-i';
      if (i === pasoActual) cls += ' mf-rail-act';
      if (pasoCompleto(i) && i !== pasoActual) cls += ' mf-rail-ok';
      return '<li class="' + cls + '"><button type="button" data-ir="' + i + '">' +
        '<span class="mf-rail-n">' + (pasoCompleto(i) && i !== pasoActual ? '✓' : ('0' + (i + 1))) + '</span>' +
        '<span class="mf-rail-t">' + esc(p.nom) + '</span></button></li>';
    }).join('');
    var pos = $('#mf-pos', raiz);
    if (pos) pos.textContent = 'Paso ' + (pasoActual + 1) + ' de ' + PASOS.length;
    var bAtras = $('[data-act="atras"]', raiz);
    if (bAtras) bAtras.disabled = pasoActual === 0;
    var bSig = $('[data-act="siguiente"]', raiz);
    if (bSig) bSig.style.visibility = pasoActual === PASOS.length - 1 ? 'hidden' : 'visible';
  }

  function htmlLista(p) {
    var vals = S[p.id];
    var filas = vals.map(function (v, i) {
      var av = avisosItem(v, p.id);
      return '<div class="mf-item" data-i="' + i + '">' +
        '<span class="mf-item-n">' + (i + 1) + '</span>' +
        '<div class="mf-item-c">' +
        '<input type="text" class="mf-input" data-campo="' + p.id + '" data-i="' + i + '" value="' + esc(v) +
        '" placeholder="' + esc(p.ph) + '" autocomplete="off">' +
        '<div class="mf-item-av">' + av.map(function (a) { return '<span class="mf-av">' + esc(a) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<button type="button" class="mf-quitar" data-quitar="' + p.id + '" data-i="' + i + '" aria-label="Quitar"' +
        (vals.length <= MIN_ITEMS ? ' disabled' : '') + '>×</button>' +
        '</div>';
    }).join('');

    var n = limpiar(vals).length;
    var estado = n >= (p.rec || 1)
      ? '<span class="mf-cont mf-estado mf-cont-ok">' + n + ' elemento(s) · bien</span>'
      : '<span class="mf-cont mf-estado">' + n + ' de ' + (p.rec || 1) + ' recomendados</span>';

    return '<div class="mf-lista">' + filas + '</div>' +
      '<div class="mf-lista-pie">' +
      (vals.length < MAX_ITEMS ? '<button type="button" class="mf-btn mf-btn-sec mf-btn-sm" data-add="' + p.id + '">+ Añadir</button>' : '<span class="mf-cont">Máximo ' + MAX_ITEMS + '</span>') +
      estado + '</div>';
  }

  function htmlRevision() {
    var r = evaluar();
    var barra = function (nom, val) {
      var clase = val >= 75 ? 'mf-b-ok' : val >= 50 ? 'mf-b-med' : 'mf-b-baja';
      return '<div class="mf-rub-fila"><div class="mf-rub-cab"><span>' + nom + '</span><b>' + val + '</b></div>' +
        '<div class="mf-barra"><i class="' + clase + '" style="width:' + val + '%"></i></div></div>';
    };

    var grupos = { estructura: [], pertinencia: [], claridad: [] };
    r.sugerencias.forEach(function (s) { grupos[s[0]].push(s[1]); });
    var listaSug = '';
    ['estructura', 'pertinencia', 'claridad'].forEach(function (g) {
      if (!grupos[g].length) return;
      listaSug += '<li class="mf-sug-g"><span class="mf-sug-et mf-et-' + g + '">' + g + '</span><ul>' +
        grupos[g].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></li>';
    });

    var nivelClase = r.total >= 90 ? 'mf-niv-exc' : r.total >= 75 ? 'mf-niv-bue' : r.total >= 50 ? 'mf-niv-ace' : 'mf-niv-con';

    return '' +
      '<div class="mf-rub">' +
      '  <div class="mf-rub-total ' + nivelClase + '"><b>' + r.total + '</b><span>' + r.nivel + '</span></div>' +
      '  <div class="mf-rub-barras">' + barra('Estructura', r.estructura) + barra('Pertinencia', r.pertinencia) + barra('Claridad', r.claridad) + '</div>' +
      '</div>' +
      '<p class="mf-rub-nota">Puntuación orientativa según la rúbrica del semillero. No reemplaza la valoración de tu docente.</p>' +
      (listaSug
        ? '<div class="mf-sug"><h4>Qué puedes mejorar</h4><ul class="mf-sug-l">' + listaSug + '</ul></div>'
        : '<div class="mf-sug mf-sug-ok"><h4>Sin observaciones</h4><p>Tu mentefacto cumple con los tres criterios de la rúbrica. Ya lo puedes descargar.</p></div>') +
      '<div class="mf-meta">' +
      '  <h4>Datos para la entrega <span class="mf-opc">opcional</span></h4>' +
      '  <label class="mf-lbl">Título que aparecerá arriba' +
      '    <input type="text" class="mf-input" data-campo="titulo" value="' + esc(S.titulo) + '" placeholder="Ej.: Mentefacto: ' + esc(S.concepto.trim() || 'actitud') + '" autocomplete="off"></label>' +
      '  <label class="mf-lbl">Autor o curso' +
      '    <input type="text" class="mf-input" data-campo="autor" value="' + esc(S.autor) + '" placeholder="Ej.: Ana Pérez · Psicología VI" autocomplete="off"></label>' +
      '</div>' +
      '<div class="mf-cta">' +
      '  <h4>¿Quieres la guía completa?</h4>' +
      '  <p>Recibe la Guía Explicativa y la plantilla editable del Semillero SIEPSI, con la rúbrica de evaluación y más ejemplos.</p>' +
      '  <a class="mf-btn mf-btn-pri" href="' + URL_BLOG + '" target="_blank" rel="noopener" data-act="lead">Quiero la guía</a>' +
      '</div>';
  }

  function renderPanel() {
    var p = PASOS[pasoActual];
    var panel = $('#mf-panel', raiz);
    if (!panel) return;

    var cuerpo;
    if (p.tipo === 'revision') {
      cuerpo = htmlRevision();
    } else if (p.tipo === 'uno') {
      var av = p.id === 'concepto' ? avisosConcepto(S[p.id]) : avisosItem(S[p.id], p.id);
      cuerpo = '<div class="mf-campo">' +
        '<input type="text" class="mf-input mf-input-gr" data-campo="' + p.id + '" value="' + esc(S[p.id]) +
        '" placeholder="' + esc(p.ph) + '" autocomplete="off">' +
        '<div class="mf-item-av">' + av.map(function (a) { return '<span class="mf-av">' + esc(a) + '</span>'; }).join('') + '</div>' +
        '</div>';
    } else {
      cuerpo = htmlLista(p);
    }

    var recordatorio = '';
    if (p.id === 'excl') {
      recordatorio = S.supra.trim()
        ? '<div class="mf-record"><span class="mf-record-et">Tu clase superior</span><b>' + esc(S.supra.trim()) + '</b>' +
        '<p>Todo lo que escribas aquí debe pertenecer a esta clase, igual que ' + esc(S.concepto.trim() || 'tu concepto') + '.</p></div>'
        : '<div class="mf-record mf-record-warn"><b>Aún no definiste la supraordinación.</b>' +
        '<p>Sin ella no puedes saber cuáles son los conceptos hermanos. <button type="button" class="mf-enlace" data-ir="1">Volver al paso 2</button></p></div>';
    }
    if (p.id === 'infra' && S.concepto.trim()) {
      recordatorio = '<div class="mf-record"><span class="mf-record-et">Comprobación</span>' +
        '<p>Cada elemento debe poder leerse así: «<b>es un tipo de ' + esc(S.concepto.trim().toLowerCase()) + '</b>».</p></div>';
    }
    if (p.id === 'iso' && S.concepto.trim()) {
      recordatorio = '<div class="mf-record"><span class="mf-record-et">Comprobación</span>' +
        '<p>Cada elemento debe poder leerse así: «<b>' + esc(S.concepto.trim().toLowerCase()) + ' es / tiene …</b>», y no valer para los conceptos excluidos.</p></div>';
    }

    panel.innerHTML =
      '<div class="mf-paso-cab"><span class="mf-paso-et">' + esc(p.nom) + '</span><h3>' + esc(p.tit) + '</h3></div>' +
      (p.preg ? '<p class="mf-preg">' + textoPregunta(p) + '</p>' : '') +
      (p.ayuda ? '<details class="mf-ayuda"><summary>Cómo se responde</summary><div>' + p.ayuda + '</div></details>' : '') +
      recordatorio + cuerpo;

    var primer = $('.mf-input', panel);
    if (primer && p.tipo !== 'revision') { try { primer.focus({ preventScroll: true }); } catch (e) { primer.focus(); } }

    renderRail();
  }

  function renderPreview() {
    var l = $('#mf-lienzo', raiz);
    if (!l) return;
    if (!hayContenido()) {
      l.innerHTML = '<div class="mf-vacio"><p><b>Tu mentefacto aparecerá aquí.</b></p>' +
        '<p>Empieza escribiendo el concepto central. Cada palabra que agregues se dibuja al instante.</p></div>';
      return;
    }
    l.innerHTML = '<div class="mf-svg-caja" data-act="ampliar" role="button" tabindex="0" ' +
      'title="Pulsa para ver el mentefacto en grande">' + construirSVG() + '</div>';
  }

  /* Actualiza solo los avisos del paso actual, sin volver a dibujar los inputs
     (si se redibujaran, el campo perderia el foco al escribir). */
  function refrescarAvisos() {
    var p = PASOS[pasoActual];
    if (p.tipo === 'revision') return;
    var panel = $('#mf-panel', raiz);
    if (!panel) return;

    if (p.tipo === 'uno') {
      var cont = $('.mf-item-av', panel);
      var av = p.id === 'concepto' ? avisosConcepto(S[p.id]) : avisosItem(S[p.id], p.id);
      if (cont) cont.innerHTML = av.map(function (a) { return '<span class="mf-av">' + esc(a) + '</span>'; }).join('');
    } else {
      $$('.mf-item', panel).forEach(function (fila) {
        var i = parseInt(fila.getAttribute('data-i'), 10);
        var cont2 = $('.mf-item-av', fila);
        if (!cont2) return;
        cont2.innerHTML = avisosItem(S[p.id][i] || '', p.id).map(function (a) { return '<span class="mf-av">' + esc(a) + '</span>'; }).join('');
      });
      var pie = $('.mf-lista-pie', panel);
      if (pie) {
        var n = limpiar(S[p.id]).length, rec = p.rec || 1;
        var etq = $('.mf-estado', pie);
        if (etq) {
          etq.className = 'mf-cont mf-estado' + (n >= rec ? ' mf-cont-ok' : '');
          etq.textContent = n >= rec ? n + ' elemento(s) · bien' : n + ' de ' + rec + ' recomendados';
        }
      }
    }
  }

  var guardarLento = debounce(guardar, 500);
  var dibujarLento = debounce(renderPreview, 130);

  function alCambiar() {
    guardarLento();
    dibujarLento();
    refrescarAvisos();
    renderRail();

    if (!yaContado.inicio && S.concepto.trim().length >= 3) {
      yaContado.inicio = true;
      track('mf_inicio', {});
    }
    if (!yaContado.completo && estaCompleto()) {
      yaContado.completo = true;
      var tot = limpiar(S.iso).length + limpiar(S.excl).length + limpiar(S.infra).length;
      track('mf_completo', { total_items: tot });
    }
  }

  function irAPaso(i) {
    if (i < 0 || i >= PASOS.length) return;
    /* se cuenta el paso que se abandona, no el que se abre: mide finalizacion */
    var previo = PASOS[pasoActual];
    if (i > pasoActual && previo.tipo !== 'revision' && !yaContado['p_' + previo.id]) {
      yaContado['p_' + previo.id] = true;
      track('mf_paso', {
        paso: pasoActual + 1,
        cuadrante: previo.id,
        n_items: previo.tipo === 'lista' ? limpiar(S[previo.id]).length : (S[previo.id].trim() ? 1 : 0)
      });
    }
    pasoActual = i;
    renderPanel();
    var sh = $('.mf-shell', raiz);
    if (sh && sh.getBoundingClientRect().top < -20) sh.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Vista ampliada con zoom ---------- */

  var lupaZoom = 1;
  var LUPA_MIN = 0.4, LUPA_MAX = 4;

  function pintarLupa() {
    var cuerpo = $('#mf-lupa-cuerpo', raiz);
    if (!cuerpo) return;
    /* El zoom se hace con el ancho del marco y no con transform: scale(), para
       que el scroll del contenedor funcione solo y el SVG no se pixele. */
    cuerpo.innerHTML = '<div class="mf-lupa-marco" style="width:' +
      (lupaZoom * 100).toFixed(2) + '%">' + construirSVG() + '</div>';
    var pct = $('#mf-zpct', raiz);
    if (pct) pct.textContent = Math.round(lupaZoom * 100) + '%';
  }

  function zoom(paso) {
    var z = paso === 0 ? 1 : lupaZoom * (paso > 0 ? 1.25 : 0.8);
    lupaZoom = Math.min(LUPA_MAX, Math.max(LUPA_MIN, z));
    var cuerpo = $('#mf-lupa-cuerpo', raiz);
    var antesX = cuerpo ? cuerpo.scrollLeft + cuerpo.clientWidth / 2 : 0;
    var antesW = cuerpo ? cuerpo.scrollWidth : 1;
    pintarLupa();
    /* mantener centrado lo que se estaba mirando */
    if (cuerpo && antesW) {
      cuerpo.scrollLeft = antesX * (cuerpo.scrollWidth / antesW) - cuerpo.clientWidth / 2;
    }
  }

  function abrirLupa() {
    if (!hayContenido()) return;
    lupaZoom = 1;
    pintarLupa();
    $('#mf-lupa', raiz).classList.remove('mf-oculto');
    var x = $('[data-act="cerrar-lupa"]', raiz);
    if (x) x.focus();
    track('mf_ampliar', {});
  }

  function cerrarLupa() {
    var l = $('#mf-lupa', raiz);
    if (l) l.classList.add('mf-oculto');
  }

  /* Arrastrar para desplazarse dentro de la vista ampliada. */
  function conectarArrastre() {
    var cuerpo = $('#mf-lupa-cuerpo', raiz);
    if (!cuerpo) return;
    var activo = false, x0 = 0, y0 = 0, sx = 0, sy = 0;

    cuerpo.addEventListener('mousedown', function (ev) {
      if (ev.button !== 0) return;
      activo = true;
      x0 = ev.clientX; y0 = ev.clientY;
      sx = cuerpo.scrollLeft; sy = cuerpo.scrollTop;
      cuerpo.classList.add('mf-arrastrando');
      ev.preventDefault();
    });
    document.addEventListener('mousemove', function (ev) {
      if (!activo) return;
      cuerpo.scrollLeft = sx - (ev.clientX - x0);
      cuerpo.scrollTop = sy - (ev.clientY - y0);
    });
    document.addEventListener('mouseup', function () {
      activo = false;
      cuerpo.classList.remove('mf-arrastrando');
    });
  }

  /* ---------- Modales ---------- */

  function abrirModal(titulo, html) {
    $('#mf-modal-tit', raiz).textContent = titulo;
    $('#mf-modal-cuerpo', raiz).innerHTML = html;
    $('#mf-modal', raiz).classList.remove('mf-oculto');
  }
  function cerrarModal() { $('#mf-modal', raiz).classList.add('mf-oculto'); }

  function modalEjemplos() {
    var html = '<p class="mf-modal-int">Se reemplazará lo que tengas escrito. Si quieres conservarlo, guarda tu avance primero.</p>' +
      Object.keys(EJEMPLOS).map(function (k) {
        var e = EJEMPLOS[k];
        return '<button type="button" class="mf-ej" data-ejemplo="' + k + '">' +
          '<b>' + esc(e.nom) + '</b><span>' + esc(e.desc) + '</span></button>';
      }).join('');
    abrirModal('Ejemplos y ejercicio', html);
  }

  function cargarEjemplo(k) {
    var e = EJEMPLOS[k];
    if (!e) return;
    aplicar(e.datos);
    S.tema = $('#mf-tema', raiz).value || 'siepsi';
    pasoActual = 0;
    yaContado = {};
    guardar();
    renderPanel();
    renderPreview();
    cerrarModal();
    track('mf_ejemplo', { tipo: k });
    if (e.lectura) {
      aviso('Ejercicio cargado. Lee <a href="' + URL_LECTURA + '" target="_blank" rel="noopener">«Conceptos básicos acerca de las pruebas de actitud»</a> y completa los cuatro cuadrantes.');
    } else {
      aviso('Ejemplo cargado. Recorre los pasos para ver cómo se responde cada cuadrante.');
    }
  }

  /* ---------- Eventos ---------- */

  function conectar() {
    raiz.addEventListener('input', function (ev) {
      var el = ev.target;
      if (!el.classList || !el.classList.contains('mf-input')) return;
      var campo = el.getAttribute('data-campo');
      if (!campo) return;
      var idx = el.getAttribute('data-i');
      if (idx === null) S[campo] = el.value;
      else S[campo][parseInt(idx, 10)] = el.value;
      alCambiar();
    });

    raiz.addEventListener('change', function (ev) {
      if (ev.target.id === 'mf-tema') {
        S.tema = ev.target.value;
        guardar();
        renderPreview();
        track('mf_tema', { tema: S.tema });
      }
      if (ev.target.id === 'mf-file' && ev.target.files && ev.target.files[0]) {
        var fr = new FileReader();
        fr.onload = function () {
          try {
            aplicar(JSON.parse(fr.result));
            pasoActual = 0; yaContado = {};
            guardar(); renderPanel(); renderPreview();
            $('#mf-tema', raiz).value = S.tema;
            aviso('Mentefacto cargado correctamente.');
            track('mf_abrir', {});
          } catch (e) {
            aviso('Ese archivo no es un mentefacto válido.', true);
          }
        };
        fr.readAsText(ev.target.files[0]);
        ev.target.value = '';
      }
    });

    raiz.addEventListener('keydown', function (ev) {
      if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList &&
          ev.target.classList.contains('mf-svg-caja')) {
        ev.preventDefault();
        abrirLupa();
        return;
      }
      if (ev.key === 'Enter' && ev.target.classList && ev.target.classList.contains('mf-input')) {
        ev.preventDefault();
        var p = PASOS[pasoActual];
        if (p.tipo === 'lista' && S[p.id].length < MAX_ITEMS) {
          var i = parseInt(ev.target.getAttribute('data-i'), 10);
          if (i === S[p.id].length - 1 && ev.target.value.trim()) {
            S[p.id].push('');
            renderPanel();
            var ins = $$('.mf-input', $('#mf-panel', raiz));
            if (ins.length) ins[ins.length - 1].focus();
            return;
          }
        }
        if (pasoActual < PASOS.length - 1) irAPaso(pasoActual + 1);
      }
      if (ev.key === 'Escape') { cerrarModal(); cerrarLupa(); }
      if (ev.target.closest && ev.target.closest('.mf-lupa')) {
        if (ev.key === '+' || ev.key === '=') { ev.preventDefault(); zoom(1); }
        if (ev.key === '-') { ev.preventDefault(); zoom(-1); }
        if (ev.key === '0') { ev.preventDefault(); zoom(0); }
      }
    });

    raiz.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('[data-act],[data-ir],[data-add],[data-quitar],[data-ejemplo]') : null;
      if (!b) {
        if (ev.target.id === 'mf-modal') cerrarModal();
        if (ev.target.id === 'mf-lupa') cerrarLupa();
        return;
      }

      var ir = b.getAttribute('data-ir');
      if (ir !== null) { irAPaso(parseInt(ir, 10)); return; }

      var add = b.getAttribute('data-add');
      if (add) {
        if (S[add].length < MAX_ITEMS) {
          S[add].push('');
          renderPanel();
          var ins2 = $$('.mf-input', $('#mf-panel', raiz));
          if (ins2.length) ins2[ins2.length - 1].focus();
        }
        return;
      }

      var q = b.getAttribute('data-quitar');
      if (q) {
        var i2 = parseInt(b.getAttribute('data-i'), 10);
        if (S[q].length > MIN_ITEMS) {
          S[q].splice(i2, 1);
          guardar(); renderPanel(); renderPreview();
        }
        return;
      }

      var ej = b.getAttribute('data-ejemplo');
      if (ej) { cargarEjemplo(ej); return; }

      switch (b.getAttribute('data-act')) {
        case 'iniciar':
          var conBorrador = hayContenido();
          vista = 'app';
          render();
          track('mf_iniciar', { borrador: conBorrador ? 1 : 0 });
          break;
        case 'atras': irAPaso(pasoActual - 1); break;
        case 'siguiente': irAPaso(pasoActual + 1); break;
        case 'ejemplos': modalEjemplos(); break;
        case 'abrir': $('#mf-file', raiz).click(); break;
        case 'nuevo':
          if (!hayContenido() || window.confirm('Se borrará el mentefacto actual. ¿Continuar?')) {
            var tema = S.tema;
            S = estadoVacio(); S.tema = tema;
            pasoActual = 0; yaContado = {};
            guardar(); renderPanel(); renderPreview();
          }
          break;
        case 'png': exportarPNG(2); break;
        case 'pdf': exportarPDF(); break;
        case 'svg': exportarSVG(); break;
        case 'json': exportarJSON(); break;
        case 'lead': track('mf_lead', { origen: 'revision' }); break;
        case 'cerrar-aviso':
          var caja = b.parentNode;
          if (caja && caja.parentNode) caja.parentNode.removeChild(caja);
          break;
        case 'ampliar': abrirLupa(); break;
        case 'zoom-mas': zoom(1); break;
        case 'zoom-menos': zoom(-1); break;
        case 'zoom-ajustar': zoom(0); break;
        case 'cerrar-lupa': cerrarLupa(); break;
        case 'cerrar-modal': cerrarModal(); break;
      }
    });
  }

  /* Unico punto que decide que pantalla se pinta. */
  function render() {
    if (vista === 'bienvenida') {
      raiz.innerHTML = plantillaBienvenida();
      return;
    }
    raiz.innerHTML = plantillaApp();
    conectarArrastre();
    $('#mf-tema', raiz).value = S.tema;
    renderPanel();
    renderPreview();
    if (avisoPendiente) { aviso(avisoPendiente); avisoPendiente = null; }
  }

  /* ==========================================================================
     8. ARRANQUE
     ========================================================================== */

  function iniciar() {
    raiz = document.getElementById(RAIZ_ID);
    if (!raiz) return;
    if (raiz.getAttribute('data-mf-listo')) return;
    raiz.setAttribute('data-mf-listo', '1');

    var temaAttr = raiz.getAttribute('data-tema');

    var previo = recuperar();
    var recuperado = false;
    if (previo) {
      aplicar(previo);
      recuperado = hayContenido();
    }
    if (temaAttr && TEMAS[temaAttr] && !recuperado) S.tema = temaAttr;
    if (recuperado) {
      avisoPendiente = 'Recuperamos el borrador que tenías guardado en este navegador. Usa «Empezar de cero» si prefieres uno nuevo.';
    }

    conectar();
    vista = 'bienvenida';
    render();
    track('mf_cargado', { version: VERSION });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
