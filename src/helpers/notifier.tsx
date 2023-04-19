// import { Icon } from '@dls/assets/icons';
// import { Button, Modal, Text } from '@dls/web';
import { PropsWithChildren, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom';

namespace notifier {
  /**
   * Open an error notification modal
   * @param message Notification message
   * @param onConfirm Callback after clicking on the bottom button
   */
  export const error = (message: string, onConfirm?: () => void) => {
    ModalManager.open(
      <NotificationComponent buttonAlignment="center" onConfirm={onConfirm}>
        {/* <div className="my-4 d-flex justify-content-center text-danger">
          <Icon name="clear" size={64} color="currentColor" />
        </div>
        <div className="mb-6 text-center">
          <Text type="body">{message}</Text>
        </div> */}
        <>{message}</>
      </NotificationComponent>
    );
  };

  /**
   * Open a success notification modal
   * @param message Notification message
   * @param onConfirm Callback after clicking on the bottom button
   */
  export const success = (message: string, onConfirm?: () => void) => {
    ModalManager.open(
      <NotificationComponent buttonAlignment="center" onConfirm={onConfirm}>
        {/* <div className="my-4 d-flex justify-content-center text-success">
          <Icon name="completed" size={64} color="currentColor" />
        </div>
        <div className="mb-6 text-center">
          <Text type="body">{message}</Text>
        </div> */}
        <>{message}</>

      </NotificationComponent>
    );
  };

  /**
   * Open a warning notification modal
   * @param message Notification message
   * @param onConfirm Callback after clicking on the bottom button
   */
  export const warning = (message: string, onConfirm?: () => void) => {
    ModalManager.open(
      <NotificationComponent buttonAlignment="center" onConfirm={onConfirm}>
        {/* <div className="my-4 d-flex justify-content-center text-warning">
          <Icon name="alert" size={64} color="currentColor" />
        </div>
        <div className="mb-6 text-center">
          <Text type="body">{message}</Text>
        </div> */}

        <>{message}</>

      </NotificationComponent>
    );
  };

  /**
   * Open an info notification modal
   * @param message Notification message
   * @param onConfirm Callback after clicking on the bottom button
   */
  export const info = (message: string, onConfirm?: () => void) => {
    ModalManager.open(
      <NotificationComponent buttonAlignment="center" onConfirm={onConfirm}>
        {/* <div className="my-4 d-flex justify-content-center text-info">
          <Icon name="info" size={64} color="currentColor" />
        </div>
        <div className="mb-6 text-center">
          <Text type="body">{message}</Text>
        </div> */}
        <>{ message}</>
      </NotificationComponent>
    );
  };

  /**
   * Open a notification modal with customized content
   * @param message Notification message
   * @param onConfirm Callback after clicking on the bottom button
   */
  export const notify = (content: ReactNode, options?: NotificationOptions) => {
    ModalManager.open(<NotificationComponent {...options}>{content}</NotificationComponent>);
  };
}

export default notifier;

export interface NotificationOptions extends NotificationComponentProps { }
interface NotificationComponentProps {
  title?: string;
  buttonText?: string;
  buttonFullWidth?: boolean;
  buttonAlignment?: 'left' | 'center' | 'right';
  onConfirm?: () => void;
  onClose?: () => void;
}

const NotificationComponent = (props: PropsWithChildren<NotificationComponentProps>) => {
  const [visible, setVisible] = useState(true);

  onCloseHandler = (callback: Function) => {
    setVisible(false);
    setTimeout(callback, 400); //ensure modal dispear transition complete
    onClose();
  };

  const onConfirm = () => {
    ModalManager.close();
    if (props.onConfirm) {
      props.onConfirm();
    }
  };

  const onClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    // <Modal backdropClosable={false} visible={visible} title={props.title} onClose={() => ModalManager.close()}>
    //   <Modal.Content>
    //     {typeof props.children === 'string' ? <Text>{props.children}</Text> : props.children}
    //     <div className={`mt-3${getAlignmentClass(props.buttonAlignment)}`}>
    //       <Button fullWidth={props.buttonFullWidth} onClick={onConfirm}>
    //         {props.buttonText ? props.buttonText : 'OK'}
    //       </Button>
    //     </div>
    //   </Modal.Content>
    // </Modal>
    <></>
  );
};

const getAlignmentClass = (alignment: 'left' | 'center' | 'right' | undefined) => {
  if (alignment === 'center') return ' text-center';
  else if (alignment === 'right') return ' text-end';
  return '';
};

var node: HTMLElement | undefined;
var modals: Array<any> = [];
let onCloseHandler: Function;

const renderModal = () => {
  if (modals.length === 0) return;

  const component = modals.shift();
  if (!node) {
    node = document.createElement('span');
    document.body.appendChild(node);
  }
  ReactDOM.render(component, node);
};

export const ModalManager = {
  open(component: any) {
    modals.push(component);
    if (modals.length === 1) {
      // render the modal only if there is no other showing modals
      renderModal();
    }
  },
  close() {
    onCloseHandler &&
      onCloseHandler(() => {
        if (node) {
          ReactDOM.unmountComponentAtNode(node);
          node.remove();
          node = undefined;
        }
        renderModal(); // render the other modals which are waiting.
      });
  },
};
