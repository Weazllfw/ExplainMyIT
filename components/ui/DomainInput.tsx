'use client';

/**
 * Enhanced Domain Input Component
 * 
 * Smart domain input with autocomplete, validation, and auto-formatting.
 * Reduces input errors and improves UX.
 */

import { useState, useEffect } from 'react';

interface DomainInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const COMMON_TLDS = ['.com', '.org', '.net', '.io', '.co', '.ai', '.dev'];

export function DomainInput({ 
  value, 
  onChange, 
  onSubmit,
  placeholder = 'example.com',
  autoFocus = false 
}: DomainInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-format domain (remove http://, www., trailing slashes)
  const formatDomain = (input: string): string => {
    let formatted = input.trim().toLowerCase();
    formatted = formatted.replace(/^https?:\/\//, '');
    formatted = formatted.replace(/^www\./, '');
    formatted = formatted.replace(/\/$/, '');
    return formatted;
  };

  // Generate suggestions based on input
  useEffect(() => {
    const formatted = formatDomain(value);
    
    if (formatted.length > 2 && !formatted.includes('.')) {
      // Suggest TLD completions if no dot present
      const newSuggestions = COMMON_TLDS.map(tld => formatted + tld);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else if (formatted.length > 2 && formatted.split('.').length === 2 && !formatted.endsWith('.com')) {
      // If they have a TLD but it's not .com, still suggest .com
      const parts = formatted.split('.');
      const withCom = parts[0] + '.com';
      if (withCom !== formatted) {
        setSuggestions([withCom]);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDomain(e.target.value);
    onChange(formatted);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) {
      e.preventDefault();
      setShowSuggestions(false);
      onSubmit();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-4 py-3 text-[16px] border-2 border-brand-border rounded-[10px] focus:outline-none focus:border-brand-cyan transition-colors"
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-[10px] shadow-lg z-10 overflow-hidden">
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
            >
              <span className="text-brand-navy font-medium">{suggestion}</span>
              <span className="text-xs text-gray-500 ml-2">Press Enter or click</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
