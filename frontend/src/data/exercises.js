export const EXERCISES = [
    {
        id: 'squat',
        title: 'Bodyweight Squat',
        category: 'Legs',
        duration: '10 reps',
        difficulty: 'Beginner',
        locked: false,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
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
        locked: false,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
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
        locked: false,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        briefing: {
            goal: "Step forward and lower your hips until both knees are bent at approximately a 90-degree angle.",
            focus: ["Balance", "Knee not passing toes"],
            ai_instructions: "The AI will check your stride length and knee stability."
        }
    },
    {
        id: 'plank',
        title: 'Plank Hold',
        category: 'Core',
        duration: '30 seconds',
        difficulty: 'Beginner',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=400&h=300&fit=crop',
        briefing: {
            goal: "Hold a straight line from head to heels, engaging your core.",
            focus: ["Hip alignment", "Core engagement", "Breathing"],
            ai_instructions: "The AI will monitor your hip sag and ensure proper alignment."
        }
    },
    {
        id: 'push_up',
        title: 'Push-Up',
        category: 'Chest',
        duration: '10 reps',
        difficulty: 'Intermediate',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop',
        briefing: {
            goal: "Lower your body until your chest nearly touches the floor, then push back up.",
            focus: ["Elbow angle", "Core stability", "Full range of motion"],
            ai_instructions: "The AI will track your elbow bend and body alignment."
        }
    },
    {
        id: 'shoulder_press',
        title: 'Shoulder Press',
        category: 'Shoulders',
        duration: '12 reps',
        difficulty: 'Intermediate',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop',
        briefing: {
            goal: "Press weights overhead until arms are fully extended.",
            focus: ["Shoulder mobility", "Core stability", "Controlled descent"],
            ai_instructions: "The AI will monitor your shoulder and elbow angles."
        }
    },
    {
        id: 'deadlift',
        title: 'Deadlift',
        category: 'Legs',
        duration: '8 reps',
        difficulty: 'Advanced',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
        briefing: {
            goal: "Lift the weight by extending your hips and knees, keeping your back straight.",
            focus: ["Back neutrality", "Hip hinge", "Knee alignment"],
            ai_instructions: "The AI will track your spine angle and hip movement."
        }
    },
    {
        id: 'bicycle_crunch',
        title: 'Bicycle Crunch',
        category: 'Core',
        duration: '20 reps',
        difficulty: 'Beginner',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        briefing: {
            goal: "Alternate bringing opposite elbow to knee in a cycling motion.",
            focus: ["Rotation", "Controlled movement", "Core engagement"],
            ai_instructions: "The AI will monitor your torso rotation and knee-elbow contact."
        }
    },
    {
        id: 'glute_bridge',
        title: 'Glute Bridge',
        category: 'Legs',
        duration: '15 reps',
        difficulty: 'Beginner',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
        briefing: {
            goal: "Lift your hips off the ground until your body forms a straight line.",
            focus: ["Hip extension", "Glute activation", "Controlled descent"],
            ai_instructions: "The AI will track your hip angle and alignment."
        }
    },
    {
        id: 'mountain_climber',
        title: 'Mountain Climbers',
        category: 'Core',
        duration: '30 seconds',
        difficulty: 'Intermediate',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        briefing: {
            goal: "Alternate bringing knees to chest in a running motion from plank position.",
            focus: ["Core stability", "Hip mobility", "Pace control"],
            ai_instructions: "The AI will monitor your hip height and knee drive."
        }
    },
    {
        id: 'tricep_dip',
        title: 'Tricep Dips',
        category: 'Arms',
        duration: '12 reps',
        difficulty: 'Intermediate',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        briefing: {
            goal: "Lower your body by bending elbows, then push back up.",
            focus: ["Elbow angle", "Shoulder stability", "Controlled movement"],
            ai_instructions: "The AI will track your elbow bend and shoulder position."
        }
    },
    {
        id: 'burpee',
        title: 'Burpees',
        category: 'Full Body',
        duration: '10 reps',
        difficulty: 'Advanced',
        locked: true,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop',
        briefing: {
            goal: "Complete a push-up, jump to squat, then jump up with arms overhead.",
            focus: ["Explosive power", "Coordination", "Full range of motion"],
            ai_instructions: "The AI will track each phase of the movement."
        }
    }
];
