<?php
/**
 * Plugin Name:       Asistente Pedagógico SIEPSI - Constructor de Mentefactos
 * Plugin URI:        https://siepsi.com.co/
 * Description:       Asistente pedagógico para construir mentefactos conceptuales paso a paso, con revisión según rúbrica y descarga en PNG, PDF y SVG. Se inserta en cualquier página con el shortcode [mentefacto_siepsi].
 * Version:           1.0.0
 * Requires at least: 5.0
 * Requires PHP:      5.6
 * Author:            Semillero de Investigación SIEPSI
 * Author URI:        https://siepsi.com.co/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       siepsi-mentefacto
 *
 * -----------------------------------------------------------------------------
 * ESTE ARCHIVO ES TODO EL TRABAJO DE MIGRACION.
 *
 * La herramienta (assets/mentefacto.css y assets/mentefacto.js) es byte por byte
 * la misma que se publica en GitHub Pages. Lo unico que cambia entre las dos
 * versiones es quien carga esos dos archivos y quien imprime el <div>:
 *
 *   - En GitHub Pages : index.html, con sus etiquetas <link> y <script>.
 *   - En WordPress    : este archivo, con wp_enqueue_* y un shortcode.
 *
 * Por eso no hay nada que reescribir el dia que el equipo apruebe la herramienta.
 * -----------------------------------------------------------------------------
 */

// Sin acceso directo.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SIEPSI_MF_VERSION', '1.0.0' );
define( 'SIEPSI_MF_RUTA', plugin_dir_path( __FILE__ ) );
define( 'SIEPSI_MF_URL', plugin_dir_url( __FILE__ ) );

/**
 * Devuelve la version a usar para romper la cache del navegador.
 *
 * Usa la fecha de modificacion del archivo: asi, cuando subas una version nueva
 * del plugin, los visitantes reciben el CSS y el JS nuevos de inmediato en vez
 * de quedarse con la copia vieja en cache.
 *
 * @param string $archivo Ruta relativa dentro de la carpeta assets/.
 * @return string
 */
function siepsi_mf_version( $archivo ) {
	$ruta = SIEPSI_MF_RUTA . 'assets/' . $archivo;
	if ( file_exists( $ruta ) ) {
		return SIEPSI_MF_VERSION . '.' . filemtime( $ruta );
	}
	return SIEPSI_MF_VERSION;
}

/**
 * Registra (que no es lo mismo que encolar) el CSS y el JS.
 *
 * Se registran siempre, pero solo se encolan dentro del shortcode. Asi la
 * herramienta no anade ni un kilobyte al resto del sitio, que ya carga
 * WooCommerce, Revolution Slider y Essential Grid.
 */
function siepsi_mf_registrar_assets() {
	wp_register_style(
		'siepsi-mentefacto',
		SIEPSI_MF_URL . 'assets/mentefacto.css',
		array(),
		siepsi_mf_version( 'mentefacto.css' )
	);

	wp_register_script(
		'siepsi-mentefacto',
		SIEPSI_MF_URL . 'assets/mentefacto.js',
		array(),          // sin dependencias: no necesita jQuery ni nada mas
		siepsi_mf_version( 'mentefacto.js' ),
		true              // en el pie, para no bloquear el pintado de la pagina
	);
}
add_action( 'wp_enqueue_scripts', 'siepsi_mf_registrar_assets' );

/**
 * Shortcode [mentefacto_siepsi]
 *
 * Atributos:
 *   tema   = siepsi | clasico | contraste   (color inicial del diagrama)
 *   titulo = si | no                        (mostrar el titulo dentro de la
 *                                            herramienta; ponlo en "no" si la
 *                                            pagina de WordPress ya trae su
 *                                            propio titulo, para no repetirlo)
 *
 * Ejemplo: [mentefacto_siepsi tema="clasico" titulo="no"]
 *
 * @param array $atts Atributos del shortcode.
 * @return string HTML del contenedor.
 */
function siepsi_mf_shortcode( $atts ) {
	// La herramienta usa un id unico. Si alguien pone el shortcode dos veces en
	// la misma pagina, se ignora la segunda: dos elementos con el mismo id
	// romperian el HTML y el JavaScript.
	static $ya_renderizado = false;

	$atts = shortcode_atts(
		array(
			'tema'   => 'siepsi',
			'titulo' => 'si',
		),
		$atts,
		'mentefacto_siepsi'
	);

	$tema = in_array( $atts['tema'], array( 'siepsi', 'clasico', 'contraste' ), true )
		? $atts['tema']
		: 'siepsi';

	if ( $ya_renderizado ) {
		return current_user_can( 'edit_posts' )
			? '<p style="padding:12px;border:1px solid #f0d79a;background:#fff6e0;color:#8a6116">'
				. esc_html__( 'El shortcode [mentefacto_siepsi] ya está insertado en esta página. Solo puede aparecer una vez. (Este aviso únicamente lo ven los editores del sitio.)', 'siepsi-mentefacto' )
				. '</p>'
			: '';
	}
	$ya_renderizado = true;

	wp_enqueue_style( 'siepsi-mentefacto' );
	wp_enqueue_script( 'siepsi-mentefacto' );

	$titulo = ( 'no' === strtolower( trim( $atts['titulo'] ) ) ) ? 'no' : 'si';

	return '<div id="mentefacto-app" data-tema="' . esc_attr( $tema ) . '" data-titulo="' . esc_attr( $titulo ) . '"></div>';
}
add_shortcode( 'mentefacto_siepsi', 'siepsi_mf_shortcode' );

/**
 * Enlace de ayuda en la lista de plugins, para que el equipo no tenga que
 * buscar en la documentacion cual era el shortcode.
 *
 * @param array $enlaces Enlaces existentes.
 * @return array
 */
function siepsi_mf_enlace_ayuda( $enlaces ) {
	array_unshift(
		$enlaces,
		'<span style="color:#2271b1">' . esc_html__( 'Shortcode:', 'siepsi-mentefacto' ) . ' <code>[mentefacto_siepsi]</code></span>'
	);
	return $enlaces;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'siepsi_mf_enlace_ayuda' );
