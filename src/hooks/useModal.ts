import { useCallback, useState } from 'react';

const useModal = (defaultShowModal = false) => {
  const [showModal, setShowModal] = useState(defaultShowModal);

  const setModalVisible = useCallback((showModal: boolean) => {
    setShowModal(showModal);
  }, []);

  return {
    showModal,
    setModalVisible,
  };
};

export default useModal;
