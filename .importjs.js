module.exports = {
  aliases: {
    '_': 'lodash',
    'autobind': 'autobind-decorator',
  },
  namedExports: {
    'mobx': ['observable', 'computed', 'action', 'extendObservable'],
    'mobx-react/native': ['observer', 'inject', 'Provider']
  }
};
