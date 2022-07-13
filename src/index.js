import 'normalize.css';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components', true, /\.js$/));
requireAll(require.context('./', true, /\.(scss|css)$/));