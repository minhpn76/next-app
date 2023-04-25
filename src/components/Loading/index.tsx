import styled, { keyframes } from 'styled-components';
import TextField from '@mui/material/TextField';

export interface LoadingProps {
  /**
   * Whether show "loading" text next to the loading spin
   */
  showText?: boolean;
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg';
}

const Loading = ({ size = 'md', showText = false }: LoadingProps) => {
  return (
    <div className="h-100 w-100 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center">
        <LoadingIcon size={calcSize(size)} />
        {showText && (
          <div className="ms-2">
            <TextField type={size === 'sm' ? 'smallBody' : 'body'}>Loading...</TextField>
          </div>
        )}
      </div>
    </div>
  );
};

const LoadingIcon = ({ size }: { size: number }) => {
  return (
    <LoadingSpinner $size={size}>
      <LoadingContent $scale={size / 100}>
        <div></div>
      </LoadingContent>
    </LoadingSpinner>
  );
};

const calcSize = (size: 'sm' | 'md' | 'lg' | undefined) => {
  switch (size) {
    case 'sm':
      return 32;
    case 'md':
      return 48;
    case 'lg':
      return 64;
    default:
      return 48;
  }
};

const LoadingSpinner = styled.div<{ $size: number }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  display: inline-block;
  overflow: hidden;
  background: none;
`;

const spin = keyframes`
  0% { 
    transform: translate(-50%,-50%) rotate(0deg); 
  }

  100% { 
    transform: translate(-50%,-50%) rotate(360deg); 
  }
`;

const LoadingContent = styled.div<{ $scale: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(${props => props.$scale});
  backface-visibility: hidden;
  transform-origin: 0 0;

  div {
    box-sizing: content-box;
    animation: ${spin} 1s linear infinite;
    top: 50px;
    left: 50px;

    position: absolute;
    width: 74px;
    height: 74px;
    border: 6px solid #ed1a3d;
    border-top-color: transparent;
    border-radius: 50%;
  }
`;

export default Loading;
