const glColorMode = require('./on-ready-script/custom/gaitelyrique-colormode.js');

function phoneActions () {
  // Open menu
  const button = document.querySelector('#document-header .header-button');

  if (button) {
    button.click();
  }
};

function desktopActions () {
  // Open first menu dropdown
  const button = document.querySelector('#document-header .menu .nav-level-1 > li.has-children > a');

  if (button) {
    button.click();
  }
};

module.exports = async (page, scenario, viewport) => {
  if (viewport.label === 'phone') {
    page.evaluate(phoneActions);
  } else if (viewport.label === 'desktop') {
    page.evaluate(desktopActions);
  };
  glColorMode(page, scenario, viewport);
};