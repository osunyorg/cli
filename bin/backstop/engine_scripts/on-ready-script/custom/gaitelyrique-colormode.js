module.exports = async (page, scenario, viewport) => {
  page.evaluate(() => {
    const button = document.querySelector('.change-color-mode-button');
    if (button) {
      button.click();
    }
  });
};