import { PropsWithChildren } from 'react';
import Loading from '../Loading';
import { SCDataLoadingContainer, SCDataLoadingOverlay, SCDataLoadingOverlayContainer } from './styles';

interface DataLoadingProps {
  isLoading: boolean;
  /** once enabled the children still shows, the loading displays as the overlay above the children */
  showAsOverlay?: boolean;
}

const DataLoading = ({ isLoading, showAsOverlay, children }: PropsWithChildren<DataLoadingProps>) => {
  return (
    <>
      {isLoading ? (
        showAsOverlay ? (
          <SCDataLoadingOverlayContainer>
            <SCDataLoadingOverlay>
              <Loading />
            </SCDataLoadingOverlay>
            {children}
          </SCDataLoadingOverlayContainer>
        ) : (
          <SCDataLoadingContainer>
            <Loading />
          </SCDataLoadingContainer>
        )
      ) : (
        children
      )}
    </>
  );
};

export default DataLoading;
