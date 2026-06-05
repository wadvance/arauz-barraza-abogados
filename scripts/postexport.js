const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const webDir = path.join(__dirname, '..', 'web');

// Copy manifest.json
fs.copyFileSync(path.join(webDir, 'manifest.json'), path.join(distDir, 'manifest.json'));

// Copy sw.js
fs.copyFileSync(path.join(webDir, 'sw.js'), path.join(distDir, 'sw.js'));

// Patch index.html
const indexPath = path.join(distDir, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const headTags = `
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <link rel="apple-touch-icon" href="/favicon.ico" />
    <script>
      window.addEventListener('error', function(e) {
        var d = document.getElementById('root');
        if (d && d.children.length === 0) {
          d.innerHTML = '<div style="padding:20px;font-family:sans-serif"><h2 style="color:#D32F2F">Error de carga</h2><pre style="white-space:pre-wrap;color:#333;font-size:14px">' + (e.message || (e.error && e.error.message) || e.filename || 'Unknown error') + '</pre></div>';
        }
      });
      window.addEventListener('unhandledrejection', function(e) {
        var d = document.getElementById('root');
        if (d && d.children.length === 0) {
          d.innerHTML = '<div style="padding:20px;font-family:sans-serif"><h2 style="color:#D32F2F">Error de promesa</h2><pre style="white-space:pre-wrap;color:#333;font-size:14px">' + (e.reason && (e.reason.message || e.reason) || 'Unknown error') + '</pre></div>';
        }
      });
      setTimeout(function() {
        var d = document.getElementById('root');
        if (d && d.children.length === 0) {
          d.innerHTML = '<div style="padding:40px;font-family:sans-serif"><h2 style="color:#D32F2F">La aplicación no cargó</h2><p style="color:#333;font-size:14px">Revise la consola del navegador para más detalles.</p></div>';
        }
      }, 10000);
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>`;

html = html.replace('</head>', headTags + '\n  </head>');

html = html.replace(
  /<script src="\/_expo\/static\/js\/web\/AppEntry-[^"]+\.js" defer><\/script>/,
  function(match) {
    var src = match.match(/src="([^"]+)"/)[1];
    return '<script>\n' +
      '  try {\n' +
      '    (function() {\n' +
      '      var s = document.createElement("script");\n' +
      '      s.src = "' + src + '";\n' +
      '      s.defer = true;\n' +
      '      s.onerror = function() {\n' +
      '        var d = document.getElementById("root");\n' +
      '        if (d && d.children.length === 0) {\n' +
      '          d.innerHTML = \'<div style="padding:40px;font-family:sans-serif"><h2 style="color:#D32F2F">Error al cargar script</h2></div>\';\n' +
      '        }\n' +
      '      };\n' +
      '      document.body.appendChild(s);\n' +
      '    })();\n' +
      '  } catch(e) {\n' +
      '    var d = document.getElementById("root");\n' +
      '    if (d) d.innerHTML = \'<div style="padding:40px;font-family:sans-serif"><h2 style="color:#D32F2F">\' + e.message + \'</h2></div>\';\n' +
      '  }\n' +
      '</script>';
  }
);

fs.writeFileSync(indexPath, html);

console.log('PWA setup complete');
