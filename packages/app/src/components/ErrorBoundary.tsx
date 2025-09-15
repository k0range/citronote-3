import React from 'react';

import Icon from './Icon';

interface ErrorBoundaryState {
  error: string | null;
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  private eventHandler: (event: PromiseRejectionEvent) => void;

  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
    this.eventHandler = this.updateError.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  updateError() {
    this.setState({ error: 'An unexpected error occurred' });
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.eventHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.eventHandler)
  }

  render() {
    if (this.state.error) {
      return <div className='text-color text-center p-4'>
        <Icon icon={{ type: "lucide", name: "AlertTriangle" }} className='w-9 h-9 text-red-500 mb-1.5 opacity-45 inline' />
        <h2 className='text-lg opacity-85'>エラーが発生しました</h2>
        <div className='text-sm opacity-45 break-words'>{this.state.error}</div>
      </div>;
    }
    return this.props.children; 
  }
}
