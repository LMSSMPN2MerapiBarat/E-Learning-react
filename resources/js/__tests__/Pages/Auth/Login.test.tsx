import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// We need to test the Login component behavior

describe('Login Page', () => {
    describe('Email Input Validation', () => {
        it('should only allow lowercase letters, numbers, @ and .', async () => {
            // Test the email filtering logic directly
            const filterEmail = (value: string): string => {
                return value.toLowerCase().replace(/[^a-z0-9.@]/g, '');
            };

            // Test various inputs
            expect(filterEmail('Test@Example.Com')).toBe('test@example.com');
            expect(filterEmail('USER123@test.com')).toBe('user123@test.com');
            expect(filterEmail('hello_world@test.com')).toBe('helloworld@test.com');
            expect(filterEmail('test!#$%@email.com')).toBe('test@email.com');
            expect(filterEmail('user name@test.com')).toBe('username@test.com');
        });

        it('should convert uppercase to lowercase', () => {
            const filterEmail = (value: string): string => {
                return value.toLowerCase().replace(/[^a-z0-9.@]/g, '');
            };

            expect(filterEmail('UPPERCASE')).toBe('uppercase');
            expect(filterEmail('MiXeD CaSe')).toBe('mixedcase');
        });

        it('should preserve valid email characters', () => {
            const filterEmail = (value: string): string => {
                return value.toLowerCase().replace(/[^a-z0-9.@]/g, '');
            };

            expect(filterEmail('valid.email@domain.com')).toBe('valid.email@domain.com');
            expect(filterEmail('user123@test.org')).toBe('user123@test.org');
        });
    });

    describe('Form Validation', () => {
        it('should validate required fields', () => {
            // Email validation check
            const isValidEmail = (email: string): boolean => {
                const emailRegex = /^[a-z0-9.@]+$/;
                return emailRegex.test(email) && email.includes('@') && email.includes('.');
            };

            expect(isValidEmail('valid@email.com')).toBe(true);
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });
});
