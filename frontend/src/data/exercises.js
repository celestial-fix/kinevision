export const EXERCISES = [
    {
        id: 'squat',
        title: 'Bodyweight Squat',
        category: 'Legs',
        duration: '10 reps',
        difficulty: 'Beginner',
        briefing: {
            goal: "Maintain a neutral spine and lower your hips until your thighs are parallel to the floor.",
            focus: ["Knee alignment", "Back straightness", "Depth"],
            ai_instructions: "The AI will track your hip and knee angles to ensure you hit 90 degrees depth without rounding your back."
        }
    },
    {
        id: 'lateral_raise',
        title: 'Lateral Arm Raise',
        category: 'Shoulders',
        duration: '12 reps',
        difficulty: 'Beginner',
        briefing: {
            goal: "Raise your arms to the side until they are shoulder height.",
            focus: ["Shoulder stability", "Controlled movement"],
            ai_instructions: "The AI will monitor your shoulder angle and ensure you don't shrug your shoulders."
        }
    },
    {
        id: 'lunge',
        title: 'Forward Lunge',
        category: 'Legs',
        duration: '10 reps / leg',
        difficulty: 'Intermediate',
        briefing: {
            goal: "Step forward and lower your hips until both knees are bent at approximately a 90-degree angle.",
            focus: ["Balance", "Knee not passing toes"],
            ai_instructions: "The AI will check your stride length and knee stability."
        }
    }
];
