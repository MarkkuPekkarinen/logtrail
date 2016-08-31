module.exports = function (server) {
  server.route({
    method: 'GET',
    path: '/konsole/validate/es',
    handler: function (request, reply) {
      var config = require('../../konsole.json');
      var callWithRequest = server.plugins.elasticsearch.callWithRequest;

      var body = {
        index: config.es.default_index,
        fields: config.es.timefield
      };

      callWithRequest(request, 'fieldStats', body).then(function (resp) {
        reply({
          ok: true,
          field: config.es.timefield,
          min: resp.indices._all.fields[config.es.timefield].min_value,
          max: resp.indices._all.fields[config.es.timefield].max_value
        });
      }).catch(function (resp) {
        console.error('Exception while validating ES',resp);
        reply({
          ok: false,
          resp: resp
        });
      });

    }
  });
};
