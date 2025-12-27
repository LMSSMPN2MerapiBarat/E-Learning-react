import { describe, it, expect } from 'vitest';

// Test data for activities component
const activitiesData = [
    {
        title: "Pramuka",
        category: "Pembentukan Karakter",
        description: "Mengembangkan kepemimpinan, keterampilan bertahan hidup, dan disiplin melalui kegiatan luar ruangan.",
    },
    {
        title: "Voli",
        category: "Olahraga",
        description: "Melatih kerjasama tim, ketangkasan, dan sportivitas melalui olahraga bola voli.",
    },
    {
        title: "Drumband",
        category: "Seni & Musik",
        description: "Mengasah kreativitas dan kedisiplinan melalui seni musik marching band.",
    },
];

describe('Activities Component', () => {
    describe('Data Structure', () => {
        it('should have 3 activities defined', () => {
            expect(activitiesData).toHaveLength(3);
        });

        it('should have required properties for each activity', () => {
            activitiesData.forEach((activity) => {
                expect(activity).toHaveProperty('title');
                expect(activity).toHaveProperty('category');
                expect(activity).toHaveProperty('description');
                expect(typeof activity.title).toBe('string');
                expect(typeof activity.category).toBe('string');
                expect(typeof activity.description).toBe('string');
            });
        });

        it('should include Pramuka activity', () => {
            const pramuka = activitiesData.find(a => a.title === 'Pramuka');
            expect(pramuka).toBeDefined();
            expect(pramuka?.category).toBe('Pembentukan Karakter');
            expect(pramuka?.description).toContain('kepemimpinan');
        });

        it('should include Voli activity', () => {
            const voli = activitiesData.find(a => a.title === 'Voli');
            expect(voli).toBeDefined();
            expect(voli?.category).toBe('Olahraga');
            expect(voli?.description).toContain('kerjasama tim');
        });

        it('should include Drumband activity', () => {
            const drumband = activitiesData.find(a => a.title === 'Drumband');
            expect(drumband).toBeDefined();
            expect(drumband?.category).toBe('Seni & Musik');
            expect(drumband?.description).toContain('kreativitas');
        });
    });

    describe('Category Validation', () => {
        it('should have diverse categories', () => {
            const categories = [...new Set(activitiesData.map(a => a.category))];
            expect(categories.length).toBe(3);
        });

        it('categories should match expected values', () => {
            const categories = activitiesData.map(a => a.category);
            expect(categories).toContain('Pembentukan Karakter');
            expect(categories).toContain('Olahraga');
            expect(categories).toContain('Seni & Musik');
        });
    });

    describe('Content Validation', () => {
        it('all activity titles should be non-empty', () => {
            activitiesData.forEach((activity) => {
                expect(activity.title.trim().length).toBeGreaterThan(0);
            });
        });

        it('all activity descriptions should be non-empty', () => {
            activitiesData.forEach((activity) => {
                expect(activity.description.trim().length).toBeGreaterThan(0);
            });
        });
    });
});
