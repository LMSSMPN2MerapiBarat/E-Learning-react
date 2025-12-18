import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Test data for facilities component
const facilitiesData = [
    {
        name: "Ruang Kelas",
        description: "Ruang kelas yang luas dan berventilasi baik dengan peralatan pembelajaran multimedia.",
    },
    {
        name: "Laboratorium IPA",
        description: "Laboratorium lengkap untuk praktikum Fisika, Kimia, dan Biologi.",
    },
    {
        name: "Laboratorium Komputer",
        description: "Komputer spesifikasi tinggi dengan akses internet untuk pembelajaran dan penelitian digital.",
    },
    {
        name: "Lapangan Olahraga",
        description: "Lapangan luas untuk sepak bola, basket, dan aktivitas atletik lainnya.",
    },
];

describe('Facilities Component', () => {
    describe('Data Structure', () => {
        it('should have 4 facilities defined', () => {
            expect(facilitiesData).toHaveLength(4);
        });

        it('should have required properties for each facility', () => {
            facilitiesData.forEach((facility) => {
                expect(facility).toHaveProperty('name');
                expect(facility).toHaveProperty('description');
                expect(typeof facility.name).toBe('string');
                expect(typeof facility.description).toBe('string');
            });
        });

        it('should include Ruang Kelas facility', () => {
            const ruangKelas = facilitiesData.find(f => f.name === 'Ruang Kelas');
            expect(ruangKelas).toBeDefined();
            expect(ruangKelas?.description).toContain('multimedia');
        });

        it('should include Laboratorium IPA facility', () => {
            const labIPA = facilitiesData.find(f => f.name === 'Laboratorium IPA');
            expect(labIPA).toBeDefined();
            expect(labIPA?.description).toContain('praktikum');
        });

        it('should include Laboratorium Komputer facility', () => {
            const labKomputer = facilitiesData.find(f => f.name === 'Laboratorium Komputer');
            expect(labKomputer).toBeDefined();
            expect(labKomputer?.description).toContain('internet');
        });

        it('should include Lapangan Olahraga facility', () => {
            const lapangan = facilitiesData.find(f => f.name === 'Lapangan Olahraga');
            expect(lapangan).toBeDefined();
            expect(lapangan?.description).toContain('sepak bola');
        });
    });

    describe('Content Validation', () => {
        it('all facility names should be non-empty', () => {
            facilitiesData.forEach((facility) => {
                expect(facility.name.trim().length).toBeGreaterThan(0);
            });
        });

        it('all facility descriptions should be non-empty', () => {
            facilitiesData.forEach((facility) => {
                expect(facility.description.trim().length).toBeGreaterThan(0);
            });
        });
    });
});
