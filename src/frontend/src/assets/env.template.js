(function (window) {
  window['env'] = window['env'] || {};

  // Environment variables
  window['env']['apiUrl'] = '${API_URL}';
  window['env']['host'] = ['${API_HOST}'];
})(this);
