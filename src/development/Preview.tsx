import * as React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorStackTrace from './ErrorStackTrace/ErrorStackTrace';
import DynamicComponent from '@/components/DynamicComponent/DynamicComponent';
import GlobalStyle from '@/GlobalStyles';

const App = () => (
  <>
    <GlobalStyle />
    <ErrorStackTrace>
      <DynamicComponent />
    </ErrorStackTrace>
  </>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') || document.createElement('div')
);
root.render(<App />);
