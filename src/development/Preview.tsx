import * as React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorStackTrace from './ErrorStackTrace/ErrorStackTrace';
import ContextTestDrag from './ReactDragDropTestComponent/TestDrag';

const App = () => (
  <>
    <ErrorStackTrace>
      <ContextTestDrag />
    </ErrorStackTrace>
  </>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') || document.createElement('div')
);
root.render(<App />);
