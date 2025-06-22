// src/data/aiPortraits.ts
import AiPortrait1 from '../assets/logos_post_emergency/ai_portrait.jpeg'; // This is your original 'ai_portrait.jpeg'
import AiPortrait2 from '../assets/logos_post_emergency/ai_portrait_2.png';
import AiPortrait3 from '../assets/logos_post_emergency/ai_portrait_3.png';
import AiPortrait4 from '../assets/logos_post_emergency/ai_portrait_4.png';
import AiPortrait5 from '../assets/logos_post_emergency/ai_portrait_5.png';
import AiPortrait6 from '../assets/logos_post_emergency/ai_portrait_6.png';
import AiPortrait7 from '../assets/logos_post_emergency/ai_portrait_7.png';
import AiPortrait8 from '../assets/logos_post_emergency/ai_portrait_8.png';
import AiPortrait9 from '../assets/logos_post_emergency/ai_portrait_9.png';
// Assuming you have a 10th one, if not, adjust the array size and logic.
// If your existing ai_portrait.jpeg is one of the 9 you previously generated,
// you might re-evaluate its naming to fit the sequence or include it as a distinct entry.
// For now, I'll treat 'ai_portrait.jpeg' as the "first" and add others.

// You will need to ensure these image paths are correct and the images exist in your assets folder.
// Based on your previous output, I will use the filenames you provided.
// If 'ai_portrait.jpeg' is meant to be one of the *newly generated* ones, you should rename it.
// For simplicity, I'll assume it's one of the 10.

export const aiPortraits = [
  {
    id: '1',
    image: AiPortrait1,
    date: 'On 16/06/2025',
    responders: 'Rohit | Alphys | Kaiao | Sean',
    description: 'Responded to a case of cardiac arrest at Block 227 Jurong East Street 32, successfully reviving the patient.',
  },
  {
    id: '2',
    image: AiPortrait2,
    date: 'On 20/05/2025',
    responders: 'Kevin | Paul | Steve | Lena',
    description: 'Quick response to a fire hazard, assisting with evacuation and initial containment before SCDF arrival. Equipped with a fire extinguisher, AED, crowbar, and medic bag.',
  },
  {
    id: '3',
    image: AiPortrait3,
    date: 'On 01/06/2025',
    responders: 'John | Mark | Emily | Sarah | David | Chris',
    description: 'Two teams responding to simultaneous incidents in an HDB estate. One team providing CPR and AED assistance, the other handling a minor structural issue.',
  },
  {
    id: '4',
    image: AiPortrait4,
    date: 'On 10/06/2025',
    responders: 'Alex | Daniel | Lisa | Maria | Tom | Ken',
    description: 'CFRs providing medical assistance and managing a small electrical fire. Equipped with medic bags and basic tools.',
  },
  {
    id: '5',
    image: AiPortrait5,
    date: 'On 15/06/2025',
    responders: 'Chloe | Ethan | Noah | Grace | Lucas | Sophie',
    description: 'Teams coordinating emergency response. One CFR is communicating via radio, while others manage a medical emergency with a medic kit and crowbar.',
  },
  {
    id: '6',
    image: AiPortrait6,
    date: 'On 22/06/2025',
    responders: 'Mike | Jessica | Ryan',
    description: 'Three CFRs addressing a minor incident. One handles a medic bag, and another is prepared with a fire extinguisher.',
  },
  {
    id: '7',
    image: AiPortrait7,
    date: 'On 05/07/2025',
    responders: 'Ling | Amir | Devi',
    description: 'Three Community First Responders standing ready near a "Community RedRhino" vehicle, prepared for any local emergency.',
  },
  {
    id: '8',
    image: AiPortrait8,
    date: 'On 12/07/2025',
    responders: 'Wei | Omar | Siti',
    description: 'A team of three CFRs with a medic bag and crowbar, ready to assist with a medical emergency or forced entry.',
  },
  {
    id: '9',
    image: AiPortrait9,
    date: 'On 18/07/2025',
    responders: 'Kai | Ben | Sam | Priya',
    description: 'Four CFRs, including one female, with an AED, prepared for cardiac arrest response and other community emergencies.',
  },
  {
    id: '10', // Assuming you have a 10th image, if not, adjust.
    image: AiPortrait1, // Placeholder, replace with actual 10th image
    date: 'On 25/07/2025',
    responders: 'Zoe | Liam | Mia | Leo',
    description: 'A dedicated team of CFRs patrolling their neighborhood, always vigilant and ready to help.',
  },
];