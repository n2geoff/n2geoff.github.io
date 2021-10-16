///////////////////////////////////////////////
// Grayscale Theme Builder
///////////////////////////////////////////////

// query helper
const $ = document.querySelector.bind(document);

function HEXToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function RGBToHSL(r,g,b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(0);
    l = +(l * 100).toFixed(0);

    return {
        h,s,l
    };
}

// refresh current page theme
function refresh() {
    const form = $('#settings');

    // convert hex-to-rbg-to-hsl
    const rgb = HEXToRGB(form.elements['theme'].value);
    const hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

    // build theme string
    const theme = String(`
        :root {
            --Hsl: ${hsl.h};
            --hSl: ${hsl.s}%;
            --hsL: ${hsl.l}%;
            --font: ${form.elements['font'].value};
            --size: ${form.elements['size'].value}px;
            --space: ${form.elements['spacing'].value}rem;
            --line: ${form.elements['line'].value};
            --radius: ${form.elements['radius'].value}rem;
        }`).replace(/\s/g, '');

    // override :root to update page theme
    $('#dynamic').innerHTML = theme;

    return theme;
}

// download custom grayscaled theme
function download(css) {
    const filename = `grayscaled.css`;

    let el = document.createElement('a');
    el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(css));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    el.click();
}

// page download button
$('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();

    // get current theme
    const theme = refresh();

    // get style rules as text
    function getText(x) {
        // exclude :root theme vars
        if(x.selectorText !== ':root') {
            return x.cssText; 
        }
    }

    // get grayscale stylesheet as dom object
    var css = $('#grayscale');

    // convert stylesheet dom object to string
    var style = Array.prototype.map.call(css.sheet.cssRules, getText).join('\n');

    // build custom grayscaled theme & minify
    const grayscaled = `${theme}${style}`.replace(/\s/g, '');

    download(grayscaled);
});

// toggle light / dark mode
$('#mode').addEventListener('click', () => {
    const attr = $('html').getAttribute('data-theme');

    if(attr && attr === 'dark') {
        $('html').setAttribute('data-theme', 'light');
    } else {
        $('html').setAttribute('data-theme', 'dark');
    }
});

// refresh page theme on changes
$('#radius').addEventListener('click', refresh);
$('#font').addEventListener('click', refresh);
$('#size').addEventListener('click', refresh);
$('#spacing').addEventListener('click', refresh);
$('#line').addEventListener('click', refresh);
$('#theme').addEventListener('change', refresh);
