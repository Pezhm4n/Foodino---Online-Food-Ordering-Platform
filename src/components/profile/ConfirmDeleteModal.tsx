import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Button } from '@/components/common/StyledComponents';

interface ConfirmDeleteModalProps {
  $isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDeleteModal = ({ $isOpen, onClose, onConfirm, itemName }: ConfirmDeleteModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 190);
  }, [isClosing, onClose]);

  const handleConfirm = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      setIsClosing(false);
    }, 190);
  }, [isClosing, onConfirm]);

  if (!$isOpen) return null;

  return (
    <ModalOverlay $isOpen={$isOpen} $isClosing={isClosing} onClick={handleClose}>
      <ModalContent $isClosing={isClosing} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>تأیید حذف</ModalTitle>
          <CloseButton onClick={handleClose} aria-label="بستن">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <WarningIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 21.41H5.93999C2.46999 21.41 1.01999 18.93 2.69999 15.9L5.81999 10.28L8.75999 5.00003C10.54 1.79003 13.46 1.79003 15.24 5.00003L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9945 17H12.0035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </WarningIcon>
          
          <ConfirmMessage>
            آیا مطمئن هستید که می‌خواهید {itemName} را از لیست علاقه‌مندی‌ها حذف کنید؟
          </ConfirmMessage>
          
          <ConfirmDescription>
            با حذف این مورد، دیگر در لیست رستوران‌های مورد علاقه شما نمایش داده نخواهد شد.
          </ConfirmDescription>
        </ModalBody>
        
        <ModalActions>
          <DeleteButton $variant="primary" onClick={handleConfirm}>بله، حذف شود</DeleteButton>
          <CancelButton onClick={handleClose}>انصراف</CancelButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

const modalFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const modalFadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const modalScaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97) translateY(6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const modalScaleOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean; $isClosing?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${props => props.$isClosing ? modalFadeOut : modalFadeIn} 190ms cubic-bezier(0, 0, 0.2, 1) forwards;
`;

const ModalContent = styled.div<{ $isClosing?: boolean }>`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  direction: rtl;
  box-shadow: ${props => props.theme.boxShadow.lg};
  animation: ${props => props.$isClosing ? modalScaleOut : modalScaleIn} 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    width: 94%;
    border-radius: 1rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.error[500]};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.neutral[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 140ms ease, transform 120ms ease;
  user-select: none;
  touch-action: manipulation;
  
  &:hover {
    color: ${props => props.theme.colors.neutral[900]};
  }

  &:active {
    transform: scale(0.9);
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const WarningIcon = styled.div`
  color: ${props => props.theme.colors.error[500]};
  margin-bottom: 1.5rem;
  
  svg {
    width: 64px;
    height: 64px;

    @media (max-width: 480px) {
      width: 48px;
      height: 48px;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const ConfirmMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[800]};
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }
`;

const ConfirmDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.md};
  color: ${props => props.theme.colors.neutral[600]};
  margin: 0;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const DeleteButton = styled(Button)`
  background-color: ${props => props.theme.colors.error[500]};
  
  &:hover {
    background-color: ${props => props.theme.colors.error[600]};
  }
`;

const CancelButton = styled(Button)``;

export default ConfirmDeleteModal; 