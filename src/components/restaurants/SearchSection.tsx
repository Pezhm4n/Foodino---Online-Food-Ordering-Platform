"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const SearchContainer = styled.section`
  background-color: ${props => props.theme.colors.primary[500]};
  padding: 3rem 2rem;
  color: white;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem 1rem;
  }
`;

const SearchContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes['3xl']};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-bottom: 1rem;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: 2rem;
  text-align: center;
  max-width: 700px;
`;

const SearchForm = styled.form`
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  border: none;
  outline: none;
  font-size: ${props => props.theme.typography.fontSizes.md};
  
  &::placeholder {
    color: ${props => props.theme.colors.neutral[500]};
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.secondary[500]};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #404040;
  }
`;

const SearchTagsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchTag = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.$active ? props.theme.colors.primary[500] : 'white'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSizes.sm};
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const SearchError = styled.div`
  color: white;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: right;
  opacity: 0.9;
`;

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState('همه');
  const [searchError, setSearchError] = useState('');
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    
    if (!searchTerm.trim()) {
      setSearchError('لطفاً عبارت جستجو را وارد کنید');
      return;
    }
    
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      
      if (activeTag !== 'همه') {
        params.set('filter', activeTag);
      }
      
      router.push(`/search?${params.toString()}`);
    }
  };
  
  const handleTagClick = (tag: string) => {
    setActiveTag(tag);
    if (searchTerm.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      
      if (tag !== 'همه') {
        params.set('filter', tag);
      }
      
      router.push(`/search?${params.toString()}`);
    }
  };
  
  const tags = ['همه', 'فست فود', 'ایرانی', 'سنتی', 'کباب', 'پیتزا', 'ساندویچ', 'سالاد', 'دریایی'];
  
  return (
    <SearchContainer>
      <SearchContent>
        <Title>جستجوی رستوران‌ها</Title>
        <Subtitle>
          از میان بهترین رستوران‌های شهر، رستوران مورد نظر خود را پیدا کنید
        </Subtitle>
        
        <SearchForm onSubmit={handleSubmit}>
          <SearchInputContainer>
            <SearchInput 
              type="text" 
              placeholder="نام رستوران یا نوع غذا را وارد کنید..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="جستجوی رستوران یا غذا"
            />
            <SearchButton type="submit">جستجو</SearchButton>
          </SearchInputContainer>
          {searchError && <SearchError>{searchError}</SearchError>}
        </SearchForm>
        
        <SearchTagsContainer>
          {tags.map(tag => (
            <SearchTag 
              key={tag} 
              $active={activeTag === tag}
              onClick={() => handleTagClick(tag)}
              data-active={activeTag === tag ? 'true' : 'false'}
            >
              {tag}
            </SearchTag>
          ))}
        </SearchTagsContainer>
      </SearchContent>
    </SearchContainer>
  );
};

export default SearchSection; 