import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  placeholder = '搜尋股票或概念...',
  className = '',
}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={setQuery}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button onClick={handleSearch} disabled={!query.trim()}>
        搜尋
      </Button>
    </div>
  );
};

export default SearchBox;
