$(() => {

  $('.download-btn').click((evt) => {
    domtoimage.toBlob(document.getElementById('user-container'))
      .then(function (blob) {
        window.saveAs(blob, 'vcard.png');
      });
  });
});
