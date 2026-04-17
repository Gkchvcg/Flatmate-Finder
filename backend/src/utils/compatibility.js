/**
 * Calculates a compatibility score (checksum) between an interested user and a property listing/owner.
 * @param {Object} interestedUser - The user who showed interest.
 * @param {Object} propertyOwner - The owner of the property.
 * @param {Object} property - The property details (including property-specific preferences).
 * @returns {number} Score from 0 to 100.
 */
export const calculateCompatibility = (interestedUser, propertyOwner, property) => {
  let score = 0;
  const weights = {
    budget: 20,
    area: 15,
    gender: 20,
    sleepSchedule: 15,
    habits: 15,
    cleanliness: 15
  };

  // 1. Budget (20 points)
  if (interestedUser.preferences?.budget && property.rent) {
    const budget = interestedUser.preferences.budget;
    const rent = property.rent;
    if (rent <= budget) {
      score += weights.budget;
    } else if (rent <= budget * 1.2) {
      score += weights.budget * 0.5;
    }
  } else {
      score += weights.budget * 0.5;
  }

  // 2. Area (15 points)
  if (interestedUser.preferredArea && property.area) {
    if (interestedUser.preferredArea.toLowerCase().trim() === property.area.toLowerCase().trim()) {
      score += weights.area;
    } else if (interestedUser.preferences?.city?.toLowerCase() === property.city?.toLowerCase()) {
        score += weights.area * 0.5;
    }
  } else {
      score += weights.area * 0.5;
  }

  // 3. Gender (20 points)
  // Use property preference if set, otherwise owner preference
  const prefGender = property.preferredGender || propertyOwner.preferences?.genderPreference || 'Any';
  let genderMatch = true;
  if (prefGender !== 'Any') {
    if (interestedUser.gender && interestedUser.gender !== prefGender) {
      genderMatch = false;
    }
  }
  // Also check if owner matches IU's preference
  if (interestedUser.preferences?.genderPreference && interestedUser.preferences.genderPreference !== 'Any') {
    if (propertyOwner.gender && propertyOwner.gender !== interestedUser.preferences.genderPreference) {
      genderMatch = false;
    }
  }
  if (genderMatch) score += weights.gender;

  // 4. Sleep Schedule (15 points)
  const prefSleep = property.preferredSleepSchedule || propertyOwner.sleepSchedule || 'Any';
  if (interestedUser.sleepSchedule && prefSleep !== 'Any') {
    if (interestedUser.sleepSchedule === prefSleep) {
      score += weights.sleepSchedule;
    } else if (interestedUser.sleepSchedule === 'Flexible' || prefSleep === 'Flexible') {
      score += weights.sleepSchedule * 0.7;
    }
  } else {
      score += weights.sleepSchedule * 0.5;
  }

  // 5. Habits: Smoking/Drinking (15 points)
  let habitsScore = 0;
  // Smoking
  const smokingAllowed = property.smokingAllowed !== undefined ? property.smokingAllowed : (propertyOwner.preferences?.smokingDrinking === 'Allowed');
  if (interestedUser.smokingHabit) {
      if (smokingAllowed) habitsScore += 7.5;
  } else {
      habitsScore += 7.5;
  }
  // Drinking
  const drinkingAllowed = property.drinkingAllowed !== undefined ? property.drinkingAllowed : (propertyOwner.preferences?.smokingDrinking === 'Allowed');
  if (interestedUser.drinkingHabit) {
      if (drinkingAllowed) habitsScore += 7.5;
  } else {
      habitsScore += 7.5;
  }
  score += habitsScore;

  // 6. Cleanliness (15 points)
  const prefClean = property.preferredCleanliness || propertyOwner.cleanlinessLevel || 'Any';
  const cleanlinessMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
  if (interestedUser.cleanlinessLevel && prefClean !== 'Any') {
    const diff = Math.abs(cleanlinessMap[interestedUser.cleanlinessLevel] - cleanlinessMap[prefClean]);
    if (diff === 0) score += weights.cleanliness;
    else if (diff === 1) score += weights.cleanliness * 0.5;
  } else {
      score += weights.cleanliness * 0.5;
  }

  return Math.round(score);
};

