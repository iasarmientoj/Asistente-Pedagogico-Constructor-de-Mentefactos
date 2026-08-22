# Asistente Pedagógico — Constructor de Mentefactos

Semillero de Investigación SIEPSI

Herramienta web para construir mentefactos conceptuales paso a paso, revisarlos
contra la rúbrica del semillero y descargarlos en PNG, PDF o SVG.

Sin dependencias, sin servidor, sin build. Tres archivos y funciona.

---

## Qué hace, y por qué no es «otro generador de diagramas»

El problema del estudiante no es dibujar cuatro cajas: eso ya lo hace en Canva.
El problema es **no saber qué va en cada cuadrante**. Por eso esta herramienta no
es un lienzo de dibujo, es un **asistente guiado**:

| | |
|---|---|
| **Pantalla de bienvenida** | La herramienta abre con una portada de fondo plano y rejilla de puntos, y un solo botón. Va dentro del propio componente, no en la página que lo contiene, así que el shortcode de WordPress también la trae. |
| **Asistente por pasos** | Una pregunta por operación intelectual, tomada literalmente de la guía del blog. El usuario nunca mueve una caja. |
| **Recordatorio de exclusión** | En el paso 4 se le muestra **la supraordinada que él mismo escribió**. Es donde todo el mundo se equivoca: confunde «lo contrario» con «los hermanos». |
| **Validador pedagógico** | Avisos suaves en tiempo real: frases en vez de palabras clave, artículos y preposiciones iniciales, puntuación, duplicados, elementos que repiten el concepto central. |
| **Rúbrica automática** | Puntúa Estructura, Pertinencia y Claridad (los tres criterios del semillero) y dice qué mejorar. |
| **Dibujo automático** | El diagrama se arma solo con la estructura canónica: supraordinación arriba, isoordinación izquierda, exclusión derecha con el signo de diferente, infraordinación abajo. |
| **Exportación** | PNG a doble resolución, PDF (hoja A4 horizontal ya configurada), SVG editable y un archivo `.json` para retomar el trabajo después. |
| **Firma en cada descarga** | Cada mentefacto que un estudiante entrega a su docente lleva el crédito del semillero. Es el mecanismo de difusión. |

Todo ocurre en el navegador. No se envía ni un dato a ningún servidor.

---

## Estructura del proyecto

```
26.08.02 web mentefacto/
├── index.html                      Cáscara para GitHub Pages (solo demo)
├── assets/
│   ├── mentefacto.css              La herramienta (estilos)
│   ├── mentefacto.js               La herramienta (lógica + motor SVG)
│   └── SIEPSI_LOGO_...webp         Logo, solo para la cabecera de la demo
├── wordpress/
│   └── siepsi-mentefacto/
│       ├── siepsi-mentefacto.php   Envoltorio de WordPress (shortcode)
│       └── assets/                 Copia automática, generada por el script
├── construir-plugin.ps1            Empaqueta el plugin en un ZIP instalable
├── dist/                           ZIP generado (no se versiona)
├── .gitignore
├── .nojekyll                       Le dice a GitHub Pages que no procese con Jekyll
└── README.md
```

### Qué se sube a GitHub

Se sube **casi todo**: el repositorio es la fuente de verdad del proyecto, no
solo la demo. El `.gitignore` excluye únicamente lo que se regenera solo:

| Excluido | Por qué |
|---|---|
| `dist/` | El ZIP lo produce el script en dos segundos. Un binario en el historial solo lo infla y genera conflictos. Si lo necesitas para el equipo, adjúntalo a una *Release*. |
| `wordpress/siepsi-mentefacto/assets/` | Es una copia automática de `assets/`. Versionarla duplicaría los mismos archivos y tarde o temprano las dos copias se desincronizan. |

Quedan versionados nueve archivos. Ten en cuenta que un repositorio público
sirve **todo** su contenido: el `.php` del plugin será legible como texto plano.
No hay ningún secreto ahí dentro, así que no supone problema.

**La herramienta son únicamente `assets/mentefacto.css` y `assets/mentefacto.js`.**
Esos dos archivos son idénticos en GitHub Pages y en WordPress. Lo único que
cambia es quién los carga.

---

## Probarlo en local

Desde esta carpeta:

```bash
python -m http.server 8777
```

Y abrir <http://localhost:8777>.

> No lo abras con doble clic (`file://`). Funciona, pero `localStorage` se
> comporta distinto y no podrás comprobar el autoguardado.

---

## Publicar la demo en GitHub Pages

1. Crear un repositorio nuevo (puede ser privado; Pages exige público en cuentas
   gratuitas).
2. Subir **`index.html`** y la carpeta **`assets/`** completa a la raíz
   (el `.webp` del logo incluido: si falta, la cabecera sale sin logo).
   Las carpetas `wordpress/` y `dist/` pueden subirse o no: no afectan a la demo.
3. En el repositorio: `Settings` → `Pages` → *Source*: `Deploy from a branch`,
   rama `main`, carpeta `/ (root)`.
4. En dos o tres minutos queda en
   `https://<usuario>.github.io/<repositorio>/`.

Esa URL es la que se le pasa al equipo. Se abre desde el celular sin instalar nada.

`index.html` lleva `<meta name="robots" content="noindex">` a propósito: la demo
**no debe indexarse en Google**, para que no le compita a siepsi.com.co cuando la
herramienta se publique en el dominio propio.

---

## Migrar a WordPress

Es el paso que hace que nada del trabajo se pierda. No hay que reescribir código.

### 1. Generar el ZIP

```powershell
.\construir-plugin.ps1
```

Copia los assets al plugin, comprueba que las versiones coincidan, genera
`dist\siepsi-mentefacto-1.0.0.zip` y verifica que las rutas internas estén bien.

### 2. Instalar

En el escritorio de WordPress: **Plugins → Añadir nuevo → Subir plugin** →
elegir el ZIP → **Instalar** → **Activar**.

No hace falta FTP ni acceso a cPanel.

### 3. Crear la página

Recomendado: **página propia**, no dentro del post actual del blog.

- URL sugerida: `siepsi.com.co/herramientas-academicas/constructor-de-mentefactos/`
- En WPBakery, una fila a **ancho completo** con un elemento de **texto**
  y dentro únicamente el shortcode:

```
[mentefacto_siepsi]
```

Único atributo disponible:

| Atributo | Valores | Para qué |
|---|---|---|
| `tema` | `siepsi` · `clasico` · `contraste` | Color inicial del diagrama. `clasico` usa la paleta verde azulada de la plantilla PDF actual. |

**No pongas un titular encima del shortcode.** La herramienta arranca con su
propia pantalla de bienvenida, que ya lleva el título, la descripción y el
crédito del semillero. Si la página añade otro titular, se duplica.

### 4. Enlazar las dos páginas

El post del blog se queda como el explicativo (rankea para búsquedas
informativas: «qué es un mentefacto») y le pone un botón grande a la herramienta.
La herramienta enlaza de vuelta al blog. Las dos páginas se refuerzan en lugar de
competir.

### 5. Ajustes finos

Calcula entre media hora y una hora de retoques: herencia de tipografía del tema
`extremestore`, ancho real de la fila de WPBakery y comportamiento en móvil.
Todo el CSS está aislado bajo `#mentefacto-app`, así que no debería haber
sorpresas grandes, pero conviene reservar ese rato.

---

## Google Analytics 4

El sitio ya tiene GA4 (`G-3CK2RMDMW7`) cargado por MonsterInsights y Site Kit, y
`gtag` está disponible como función global. **En WordPress no hay que configurar
nada en el código**: los eventos empiezan a llegar solos.

En GitHub Pages `gtag` no existe; la función `track()` lleva una guarda y
simplemente no hace nada. Cero cambios de código entre las dos versiones.

### Eventos que envía la herramienta

| Evento | Cuándo se dispara | Parámetros |
|---|---|---|
| `mf_cargado` | La herramienta termina de montarse (pantalla de bienvenida) | `version` |
| `mf_iniciar` | Pulsa el botón de la bienvenida y entra al asistente | `borrador` (1 si retomaba algo) |
| `mf_inicio` | El usuario escribe el concepto central (3+ caracteres) | — |
| `mf_paso` | Al salir de cada paso hacia el siguiente | `paso` (1–5), `cuadrante`, `n_items` |
| `mf_completo` | Los cuatro cuadrantes tienen contenido | `total_items` |
| `mf_exportar` | Cualquier descarga | `formato` (`png`/`pdf`/`svg`/`json`) |
| `mf_ejemplo` | Carga un ejemplo o el ejercicio práctico | `tipo` |
| `mf_abrir` | Retoma un archivo guardado | — |
| `mf_tema` | Cambia la paleta de color | `tema` |
| `mf_lead` | Pulsa el botón de la guía | `origen` |

Cada evento se cuenta **una sola vez por sesión** cuando corresponde, para que el
embudo no se infle.

### Qué hay que hacer en el panel de GA4

Tres pasos. El primero es el que todo el mundo olvida.

1. **Definiciones personalizadas.**
   *Administrar → Definiciones personalizadas → Crear dimensión personalizada.*
   Crear una por cada parámetro que quieras ver en los informes, con **ámbito de
   evento**:

   | Nombre | Parámetro |
   |---|---|
   | Formato de descarga | `formato` |
   | Paso del asistente | `paso` |
   | Cuadrante | `cuadrante` |

   Sin este paso los parámetros **se registran pero no aparecen en ningún
   informe**.

2. **Marcar la conversión.**
   *Administrar → Eventos* → marcar `mf_exportar` como **evento clave**.

3. **Construir el embudo.**
   *Explorar → Exploración de embudo*, con los pasos:
   `mf_inicio` → `mf_paso` → `mf_completo` → `mf_exportar`.

   Ese informe dice **en qué cuadrante exacto abandona la gente**. Apuesto a que
   es exclusión. Esa es información pedagógica aprovechable para el semillero, no
   solo métrica de marketing.

Durante la instalación, verificar con **DebugView**, que muestra los eventos en
tiempo real.

### Dos advertencias

- **MonsterInsights y Site Kit** están cargando etiquetas de Google en paralelo
  (`GT-552WD3CR` y `G-3CK2RMDMW7`). Eso a veces produce visitas contadas doble.
  Conviene revisarlo aparte; no afecta a esta herramienta.
- **MonsterInsights no va a detectar estas descargas.** Su rastreo automático
  busca enlaces a archivos, y aquí los archivos se generan en el navegador como
  blob, sin URL. Por eso los eventos personalizados son obligatorios.

---

## Reglas de portabilidad

Son las que permiten que la herramienta viva en los dos sitios sin tocar una
línea. Si alguien modifica el código más adelante, hay que respetarlas:

1. **Todo el CSS empieza por `#mentefacto-app`.** Ni una regla para `body`,
   `html` o etiquetas sueltas. El tema `extremestore` y WPBakery inyectan mucho
   CSS global y sin este aislamiento nos desarman el diseño.
2. **Cero variables globales en JavaScript.** Todo vive dentro de una función
   anónima. El sitio ya carga jQuery, WooCommerce y Revolution Slider.
3. **Ningún recurso externo.** Sin CDN, sin fuentes remotas, sin peticiones de
   red. Los iconos son SVG en línea o data URI.
4. **Rutas relativas siempre.** En WordPress la ruta base es distinta.
5. **`track()` siempre con guarda.** Nunca llamar a `gtag` directamente.
6. **El único punto de anclaje es `<div id="mentefacto-app">`.** La interfaz
   entera se dibuja desde JavaScript dentro de ese div.

---

## Decisiones técnicas que conviene conocer

- **El texto se ajusta a mano, con `<tspan>`.** No se usa `foreignObject`, que
  sería más cómodo pero **no se rasteriza a PNG** en la mayoría de navegadores.
- **El PNG se genera pasando el SVG por un `data:` URI**, no por un blob. Así el
  canvas no queda «contaminado» y `toBlob()` funciona en todos los navegadores.
- **El PDF no usa ninguna librería.** Se imprime un iframe con `@page {size: A4
  landscape}` ya configurado y el usuario elige «Guardar como PDF». Añadir jsPDF
  habría supuesto ~300 KB para hacer algo peor.
- **La fuente del diagrama es Arial/Helvetica a propósito.** El SVG exportado
  tiene que verse igual en el computador de cualquier docente. La interfaz, en
  cambio, usa Lato y Raleway, que son las del sitio y en WordPress ya vienen
  cargadas: no se pide ni un recurso extra.
- **Todo va con esquinas rectas**, sin `border-radius`, porque es el estilo de
  SIEPSI. Si alguien redondea algo más adelante, dejará de parecer del sitio.
- **La rama de infraordinación se dibuja por debajo de las columnas laterales.**
  Es un cálculo deliberado (`colBot + 64`): si se reduce ese margen, con muchos
  elementos a izquierda o derecha la línea horizontal atraviesa las cajas.
- **El `.ps1` no usa `Compress-Archive` ni `ZipFile::CreateFromDirectory`.** Los
  dos guardan las rutas internas con barra invertida en Windows PowerShell 5.1,
  lo cual es inválido y **rompe la instalación en hosting Linux**. El script crea
  cada entrada a mano y verifica el resultado antes de darlo por bueno.

---

## Ideas para más adelante

No están hechas, y ninguna es necesaria para la versión 1:

- Enlace para compartir el mentefacto (estado codificado en la URL).
- Modo docente: generar varios mentefactos en blanco con el concepto ya puesto.
- Exportar a PowerPoint o Word.
- Reutilizar el motor SVG para la herramienta de flujograma. Si se hace, conviene
  separar antes `mentefacto.js` en un módulo de dibujo y otro de asistente: buena
  parte del trabajo se aprovecharía.

---

Semillero de Investigación SIEPSI · <https://siepsi.com.co>
