export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    topic: 'grooming' | 'feeding' | 'health' | 'tack' | 'anatomy' | 'safety' | 'breeds';
    difficulty: 'Novice' | 'Bronze' | 'Silver' | 'Gold' | 'Champion';
}
export const questions: Question[] = [
    {
        id: 1,
        question: "What is the first brush you should use when grooming a muddy horse?",
        options: ["Soft Brush", "Curry Comb", "Mane Comb", "Finishing Brush"],
        correctAnswer: "Curry Comb",
        topic: "grooming",
        difficulty: "Novice"
    },
    {
        id: 2,
        question: "Which of these vegetables is a safe treat for horses?",
        options: ["Potatoes", "Carrots", "Onions", "Cabbage"],
        correctAnswer: "Carrots",
        topic: "feeding",
        difficulty: "Novice"
    },
    {
        id: 3,
        question: "What is the normal resting heart rate for an adult horse?",
        options: ["10-20 bpm", "30-40 bpm", "60-80 bpm", "100+ bpm"],
        correctAnswer: "30-40 bpm",
        topic: "health",
        difficulty: "Champion"
    },
    {
        id: 4,
        question: "Which piece of tack is used to protect a horse's lower legs?",
        options: ["Saddle Pad", "Martingale", "Splint Boots", "Bridle"],
        correctAnswer: "Splint Boots",
        topic: "tack",
        difficulty: "Gold"
    },
    {
        id: 5,
        question: "What is 'colic' in horses?",
        options: ["A type of walk", "Abdominal pain", "A coat color", "A grooming tool"],
        correctAnswer: "Abdominal pain",
        topic: "health",
        difficulty: "Silver"
    },
    {
        id: 6,
        question: "How often should a horse's hooves be trimmed by a farrier?",
        options: ["Every year", "Every 6-8 weeks", "Every 2 weeks", "Only when they stumble"],
        correctAnswer: "Every 6-8 weeks",
        topic: "health",
        difficulty: "Bronze"
    },
    {
        id: 7,
        question: "What is the small triangle part on the bottom of a horse's hoof called?",
        options: ["The Wall", "The Frog", "The Sole", "The Heel"],
        correctAnswer: "The Frog",
        topic: "anatomy",
        difficulty: "Novice"
    },
    {
        id: 8,
        question: "Which knot should you use to tie a horse safely?",
        options: ["Square Knot", "Quick Release Knot", "Granny Knot", "Double Knot"],
        correctAnswer: "Quick Release Knot",
        topic: "safety",
        difficulty: "Bronze"
    },
    {
        id: 9,
        question: "A horse with a golden coat and white mane/tail is called a:",
        options: ["Bay", "Chestnut", "Palomino", "Roan"],
        correctAnswer: "Palomino",
        topic: "breeds",
        difficulty: "Novice"
    },
    {
        id: 10,
        question: "What should you never do when walking behind a horse?",
        options: ["Talk to them", "Walk close to their body with a hand on them", "Startle them or stand directly in the blind spot", "Check their tail"],
        correctAnswer: "Startle them or stand directly in the blind spot",
        topic: "safety",
        difficulty: "Novice"
    }
];
