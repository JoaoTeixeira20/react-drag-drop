import React, {
  Component,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { mapStackTrace } from 'sourcemapped-stacktrace';

type TparseStackTraceLine = {
  at: string;
  link: string;
  file: string;
};

function parseStackTraceLine(stack: string): TparseStackTraceLine {
  const regex = /at (\S+) \((.+?):(\d+):(\d+)\)/;
  const match = regex.exec(stack);

  if (!match) {
    return {
      at: '',
      file: '',
      link: '',
    };
  }

  const [, at, link, line, column] = match;
  const file = link.substring(link.lastIndexOf('/') + 1);

  return {
    at,
    link: link.startsWith('http') ? link.replace(/^http/, 'devtools') : link,
    file: `${file}:${line}:${column}`,
  };
}

function ErrorFormatter({ error }: { error: Error }) {
  const [stackTrace, setStackTrace] = useState<TparseStackTraceLine[]>();

  useEffect(() => {
    window.document.body.style.backgroundColor = 'black';
    mapStackTrace(error.stack, function (mappedStack) {
      setStackTrace(
        mappedStack.map((el) => {
          return parseStackTraceLine(el);
        })
      );
    });
  }, []);

  return (
    <div
      style={{
        border: '2px solid white',
        borderRadius: '5px',
        padding: '10px',
        margin: '20px',
        backgroundColor: 'black',
      }}
    >
      <h1
        style={{
          color: 'whitesmoke',
          padding: '10px',
          fontFamily: 'Courier New',
        }}
      >
        {error.name} : {error.message}
      </h1>
      <div style={{ padding: '10px' }}>
        {stackTrace ? (
          stackTrace.map((el, i) => (
            <div key={i} style={{ paddingBottom: '5px' }}>
              <p style={{ color: 'whitesmoke' }}>
                - {el.at}{' '}
                <a style={{ color: 'whitesmoke' }} href={el.link}>
                  {el.file}
                </a>
              </p>
            </div>
          ))
        ) : (
          <div style={{ color: 'whitesmoke' }}>loading stack trace...</div>
        )}
      </div>
    </div>
  );
}

type ErrorBoundaryProps = PropsWithChildren;

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <>
          {this.state.error ? (
            <ErrorFormatter error={this.state.error} />
          ) : (
            <div>no error to show</div>
          )}
        </>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
