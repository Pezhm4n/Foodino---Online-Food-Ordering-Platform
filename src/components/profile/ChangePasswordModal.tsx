import React, { useState } from 'react';
import styled from 'styled-components';
import { FormInput, Button } from '@/components/common/StyledComponents';

interface ChangePasswordModalProps {
  $isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PasswordChangeData) => void;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordModal = ({ $isOpen, onClose, onSubmit }: ChangePasswordModalProps) => {
  const [formData, setFormData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // پاک کردن خطای فیلد در هنگام تایپ
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'رمز عبور جدید الزامی است';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'رمز عبور باید حداقل یک عدد داشته باشد';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'تکرار رمز عبور با رمز عبور جدید مطابقت ندارد';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      // بعد از ارسال فرم، فیلدها را پاک می‌کنیم
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <ModalOverlay $isOpen={$isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>تغییر رمز عبور</ModalTitle>
          <CloseButton onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>رمز عبور فعلی</FormLabel>
              <FormInput 
                type="password" 
                name="currentPassword" 
                value={formData.currentPassword} 
                onChange={handleInputChange} 
                placeholder="رمز عبور فعلی خود را وارد کنید" 
              />
              {errors.currentPassword && <ErrorMessage>{errors.currentPassword}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>رمز عبور جدید</FormLabel>
              <FormInput 
                type="password" 
                name="newPassword" 
                value={formData.newPassword} 
                onChange={handleInputChange} 
                placeholder="رمز عبور جدید را وارد کنید" 
              />
              {errors.newPassword && <ErrorMessage>{errors.newPassword}</ErrorMessage>}
              <PasswordHint>
                رمز عبور باید حداقل ۸ کاراکتر، یک حرف بزرگ و یک عدد داشته باشد.
              </PasswordHint>
            </FormGroup>
            
            <FormGroup>
              <FormLabel>تکرار رمز عبور جدید</FormLabel>
              <FormInput 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder="رمز عبور جدید را مجدداً وارد کنید" 
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
            
            <ButtonGroup>
              <SubmitButton $variant="primary" type="submit">تغییر رمز عبور</SubmitButton>
              <CancelButton type="button" onClick={onClose}>انصراف</CancelButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  direction: rtl;
  box-shadow: ${props => props.theme.boxShadow.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSizes.xl};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  color: ${props => props.theme.colors.secondary[500]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.neutral[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.neutral[900]};
  }
`;

const ModalBody = styled.div``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-size: ${props => props.theme.typography.fontSizes.md};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.theme.colors.neutral[700]};
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.sm};
  color: ${props => props.theme.colors.error[500]};
  margin: 0.25rem 0 0 0;
`;

const PasswordHint = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.xs};
  color: ${props => props.theme.colors.neutral[500]};
  margin: 0.25rem 0 0 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 1rem;
`;

const SubmitButton = styled(Button)`
  flex: 1;
`;

const CancelButton = styled(Button)`
  flex: 1;
`;

export default ChangePasswordModal; 