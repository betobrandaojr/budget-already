import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from './Input';
import React from 'react';

describe('Input', () => {
    it('should render the label if provided', () => {
        render(<Input label="Username" />);
        expect(screen.getByText('Username')).toBeDefined();
    });

    it('should render the error message if provided', () => {
        render(<Input error="Invalid input" />);
        expect(screen.getByText('Invalid input')).toBeDefined();
    });

    it('should apply error classes when error is present', () => {
        const { container } = render(<Input error="Error" />);
        const input = container.querySelector('input');
        expect(input?.className).toContain('border-red-500');
    });

    it('should be able to type into the input', () => {
        render(<Input placeholder="Enter something" />);
        const input = screen.getByPlaceholderText('Enter something') as HTMLInputElement;
        input.value = 'test';
        expect(input.value).toBe('test');
    });
});
