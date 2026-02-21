import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import React from 'react';

describe('Button', () => {
    it('should render the children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeDefined();
    });

    it('should show a loader when isLoading is true', () => {
        const { container } = render(<Button isLoading>Click me</Button>);
        expect(container.querySelector('.animate-spin')).toBeDefined();
    });

    it('should be disabled when isLoading is true', () => {
        render(<Button isLoading>Click me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should call onClick when clicked', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Click me</Button>);
        const button = screen.getByText('Click me');
        button.click();
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply the correct variant class', () => {
        const { getByRole } = render(<Button variant="danger">Delete</Button>);
        const button = getByRole('button');
        expect(button.className).toContain('bg-red-600');
    });
});
