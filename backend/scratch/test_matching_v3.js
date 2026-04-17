import { calculateCompatibility } from '../src/utils/compatibility.js';

const mockUser = (overrides) => ({
    preferences: { budget: 1000, city: 'Bangalore', genderPreference: 'Any' },
    gender: 'Male',
    sleepSchedule: 'Early Bird',
    smokingHabit: false,
    drinkingHabit: false,
    cleanlinessLevel: 'High',
    preferredArea: 'HSR',
    occupation: 'Student',
    ...overrides
});

const mockOwner = (overrides) => ({
    gender: 'Male',
    sleepSchedule: 'Early Bird',
    cleanlinessLevel: 'High',
    ...overrides
});

const mockProperty = (overrides) => ({
    rent: 900,
    area: 'HSR',
    city: 'Bangalore',
    preferredGender: 'Any',
    preferredSleepSchedule: 'Any',
    smokingAllowed: false,
    drinkingAllowed: false,
    preferredCleanliness: 'Any',
    preferredOccupation: 'Student',
    ...overrides
});

function testMatchingV3() {
    console.log('--- Testing Enhanced Matching (Occupation-based) ---');

    console.log('\nCase 1: Exact Occupation Match (Student -> Student)');
    const p1 = mockProperty({ preferredOccupation: 'Student' });
    const u1 = mockUser({ occupation: 'Student' });
    const score1 = calculateCompatibility(u1, mockOwner(), p1);
    console.log('Score:', score1, '(Expected high score)');

    console.log('\nCase 2: Occupation Mismatch (Student -> Professional)');
    const p2 = mockProperty({ preferredOccupation: 'Professional' });
    const u2 = mockUser({ occupation: 'Student' });
    const score2 = calculateCompatibility(u2, mockOwner(), p2);
    console.log('Score:', score2, '(Expected lower score than Case 1)');

    if (score1 > score2) {
        console.log('\nSUCCESS: Occupation matching is working correctly!');
    } else {
        console.error('\nFAILURE: Occupation matching logic did not affect the score as expected.');
    }
}

testMatchingV3();
