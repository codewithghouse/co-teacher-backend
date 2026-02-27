
export const CURRICULUM_DATA: Record<string, Record<string, Record<string, string[]>>> = {
    // Boards: CBSE, ICSE, SSC
    "CBSE": {},
    "ICSE": {},
    "SSC": {}
};

// Helper to generate structure
const CLASSES_1_5 = ["1", "2", "3", "4", "5"];
const CLASSES_6_8 = ["6", "7", "8"];
const CLASSES_9_10 = ["9", "10"];
const CLASSES_11_12 = ["11", "12"];

const SUBJECTS_PRIMARY = ["English", "Mathematics", "EVS", "Hindi"];
const SUBJECTS_MIDDLE = ["English", "Mathematics", "Science", "Social Studies", "Hindi", "Computer Science"];
const SUBJECTS_SECONDARY = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Civics", "Economics", "Computer Science"];
const SUBJECTS_SENIOR = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Accountancy", "Business Studies", "Economics", "Political Science", "History", "Psychology", "Computer Science"];

const TOPICS_PRIMARY: Record<string, string[]> = {
    "English": ["Reading Skills", "Nouns & Pronouns", "Verbs", "Adjectives", "Small Sentences", "Story Telling", "Alphabet Fun", "Nursery Rhymes"],
    "Mathematics": ["Counting & Number Names", "Addition & Subtraction", "Shapes & Patterns", "Measurement Basics", "Time & Money", "Place Value"],
    "EVS": ["My Family", "My Body", "Plants Around Us", "Animal Life", "Food We Eat", "Air & Water", "Seasons", "Safe Habits"],
    "Social Studies": ["My Neighborhood", "People Who Help Us", "Transport & Communication", "Our Festivals", "National Symbols", "Great Leaders"],
    "Hindi": ["Varnamala", "Matraen", "Shabd Rachna", "Kavita", "Kahani"],
    "Urdu": ["Huroof-e-Tahajji", "Alfazz", "Jumle", "Nazm", "Kahani"],
    "Telugu": ["Varnamala", "Padalu", "Vyakaranamu", "Padyalu", "Katha"],
    "Computer Science": ["Manual Basics", "Using Mouse", "Paint", "Parts of Computer"]
};

const TOPICS_MIDDLE: Record<string, string[]> = {
    "English": ["Tenses", "Direct & Indirect Speech", "Active & Passive Voice", "Reading Comprehension", "Letter Writing", "Essay Writing"],
    "Mathematics": ["Integers", "Fractions & Decimals", "Algebra Intro", "Linear Equations", "Geometry", "Mensuration", "Data Handling", "Rational Numbers"],
    "Science": ["Food Sources", "Components of Food", "Changes Around Us", "Electricity & Circuits", "Motion & Measurement", "Light & Shadows", "Body Movements"],
    "Social Studies": ["Our Past", "Earth: Our Habitat", "Social & Political Life", "Maps", "Major Domains of Earth"],
    "Hindi": ["Vyakaran", "Vibhinn Vidhayen", "Patra Lekhan", "Nibandh"],
    "Urdu": ["Qawaid", "Mazmoon Navesi", "Khat Navesi", "Nazm-o-Nasr"],
    "Telugu": ["Vyakaranamu", "Rachana", "Lekha Rachana", "Upanyasam"],
    "Computer Science": ["Computer Basics", "Hardware and Software", "Office Tools", "Internet Basics", "Algorithm & Flowchart"]
};


const TOPICS_CBSE_MIDDLE: Record<string, string[]> = {
    "Science": ["Nutrition in Plants", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and its Effects", "Light", "Forests: Our Lifeline"],
    "Social Science": ["Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "Role of the Government in Health", "How the State Government Works"]
};

const TOPICS_ICSE_MIDDLE: Record<string, string[]> = {
    "Physics": ["Physical Quantities and Measurement", "Force and Pressure", "Energy", "Light Energy", "Heat Transfer", "Sound", "Electricity and Magnetism"],
    "Chemistry": ["Matter and its Composition", "Physical and Chemical Changes", "Elements, Compounds and Mixtures", "Atomic Structure", "Language of Chemistry", "Metals and Non-Metals", "Air and Atmosphere"],
    "Biology": ["Plant Life", "The Cell", "Human Body Systems", "Health and Hygiene", "Adaptation in Animals/Plants"],
    "History & Civics": ["The Vedic Period", "The Mauryan Empire", "The Gupta Empire", "Medieval India", "The Constitution of India"],
    "Geography": ["Representation of Geographical Features", "Atmosphere", "Study of Continents: Africa, Australia, Antarctica"]
};

const TOPICS_SSC_MIDDLE: Record<string, string[]> = {
    "General Science": ["The Living World: Adaptations and Classification", "Plants: Structure and Function", "Properties of Natural Resources", "Nutrition in Living Organisms", "Food Safety", "Measurement of Physical Quantities", "Motion, Force and Work", "Static Electricity", "Heat", "Disaster Management", "Cell Structure and Micro-organisms"],
    "Social Science": ["History: Sources of History", "India before the Times of Shivaji Maharaj", "The Foundation of the Swaraj", "Civics: Introduction to our Constitution", "Geography: The Sun, the Moon and the Earth", "Tides", "Air Pressure", "Winds"]
};

const TOPICS_SECONDARY: Record<string, string[]> = {
    "English": ["Analytical Paragraph", "Grammar: Editing & Omission", "Literature Analysis", "Formal Letters", "Diary Entry"],
    "Mathematics": ["Real Numbers", "Polynomials", "Trigonometry", "Coordinate Geometry", "Quadratic Equations", "Arithmetic Progression", "Probability", "Statistics"],
    "Physics": ["Light: Reflection & Refraction", "Human Eye & Colorful World", "Electricity", "Magnetic Effects of Electric Current"],
    "Chemistry": ["Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-Metals", "Carbon & Its Compounds"],
    "Biology": ["Life Processes", "Control & Coordination", "How do Organisms Reproduce?", "Heredity & Evolution"],
    "History": ["Rise of Nationalism in Europe", "Nationalism in India", "Making of Global World", "Print Culture"],
    "Geography": ["Resources & Development", "Forest & Wildlife", "Water Resources", "Agriculture", "Minerals & Energy"],
    "Civics": ["Power Sharing", "Federalism", "Gender, Religion & Caste", "Political Parties"],
    "Economics": ["Development", "Sectors of Indian Economy", "Money & Credit", "Globalization"],
    "Computer Science": ["Computer Systems", "Python Programming", "Cyber Safety", "Data Handling"]
};

const TOPICS_11: Record<string, string[]> = {
    "English": ["Note Making", "Summarizing", "Poetic Devices", "Report Writing", "Job Application"],
    "Mathematics": ["Sets & Functions", "Complex Numbers", "Calculus Basics", "Matrices & Determinants", "Vector Algebra", "3D Geometry"],
    "Physics": ["Units & Measurements", "Motion in a Straight Line", "Laws of Motion", "Work, Energy & Power", "Gravitation"],
    "Chemistry": ["Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", "Chemical Bonding"],
    "Biology": ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Cell: The Unit of Life"]
};

const TOPICS_12: Record<string, string[]> = {
    "English": ["Analytical Paragraph", "Literature Analysis", "Formal Letters", "Diary Entry"],
    "Mathematics": ["Relations & Functions", "Inverse Trigonometric Functions", "Continuity & Differentiability", "Integrals", "Differential Equations"],
    "Physics": ["Electrostatics", "Current Electricity", "Optics", "Dual Nature of Matter", "Atoms & Nuclei"],
    "Chemistry": ["Solutions", "Electrochemistry", "Chemical Kinetics", "p-Block Elements", "Coordination Compounds"],
    "Biology": ["Sexual Reproduction in Plants", "Human Reproduction", "Principles of Inheritance", "Evolution", "Biotechnology"]
};

const TOPICS_SENIOR_COMMERCE: Record<string, string[]> = {
    "Accountancy": ["Accounting for Partnership", "Company Accounts", "Analysis of Financial Statements", "Cash Flow Statement"],
    "Business Studies": ["Principles of Management", "Business Environment", "Marketing Management", "Financial Management"],
    "Economics": ["Introductory Macroeconomics", "Indian Economic Development", "National Income", "Government Budget"]
};

const TOPICS_SENIOR_HUMANITIES: Record<string, string[]> = {
    "Political Science": ["World Politics", "Politics in India Since Independence", "Contemporary World Order"],
    "Psychology": ["Variations in Psychological Attributes", "Self & Personality", "Meeting Life Challenges", "Social Influence"]
};

const TOPICS_9: Record<string, string[]> = {
    "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Euclid Geometry"],
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "The Fundamental Unit of Life"]
};

const TOPICS_10: Record<string, string[]> = {
    "Mathematics": ["Real Numbers", "Polynomials", "Trigonometry", "Coordinate Geometry", "Quadratic Equations"],
    "Science": ["Chemical Reactions & Equations", "Acids, Bases & Salts", "Metals & Non-Metals", "Life Processes"]
};

// --- Board Specific Subject Lists ---

// CBSE
const SUBJECTS_CBSE_PRIMARY = ["English", "Mathematics", "EVS", "Hindi", "Urdu", "Telugu"];
const SUBJECTS_CBSE_MIDDLE = ["English", "Mathematics", "Science", "Social Science", "Hindi", "Computer Science", "Urdu", "Telugu"];
const SUBJECTS_CBSE_SECONDARY = ["English", "Mathematics", "Science", "Social Science", "Hindi", "Urdu", "Telugu"];
const SUBJECTS_CBSE_SENIOR = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Accountancy", "Business Studies", "Economics", "History", "Political Science", "Psychology", "Computer Science", "Hindi", "Urdu", "Telugu"];

// ICSE
const SUBJECTS_ICSE_PRIMARY = ["English", "Mathematics", "General Science", "Social Studies", "Computer Studies", "Hindi", "Urdu", "Telugu"];
const SUBJECTS_ICSE_MIDDLE = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "Computer Studies", "Hindi", "Urdu", "Telugu"];
const SUBJECTS_ICSE_SECONDARY = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "History & Civics", "Geography", "Computer Applications", "Commercial Studies", "Economics", "Hindi", "Urdu", "Telugu"];
const SUBJECTS_ICSE_SENIOR = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Accounts", "Commerce", "Economics", "Computer Science", "History", "Political Science", "Psychology", "Hindi", "Urdu", "Telugu"];

// SSC
const SUBJECTS_SSC_PRIMARY = ["Urdu", "Hindi", "Mathematics", "General Science", "Social Service", "Telugu"];
const SUBJECTS_SSC_MIDDLE = ["Urdu", "Hindi", "Telugu", "Mathematics", "General Science", "Social Science"];
const SUBJECTS_SSC_SECONDARY = ["Urdu", "Hindi", "Telugu", "Mathematics (Algebra)", "Mathematics (Geometry)", "Science & Technology", "Social Sciences"];
const SUBJECTS_SSC_SENIOR = ["English", "Telugu", "Mathematics", "Physics", "Chemistry", "Biology", "Book Keeping & Accountancy", "Organization of Commerce", "Secretarial Practice", "Urdu", "Hindi"];

// Populate Data
const populate = (board: string) => {
    const boardData: any = {};

    let subjectsPrimary: string[] = [];
    let subjectsMiddle: string[] = [];
    let subjectsSecondary: string[] = [];
    let subjectsSenior: string[] = [];

    if (board === "CBSE") {
        subjectsPrimary = SUBJECTS_CBSE_PRIMARY;
        subjectsMiddle = SUBJECTS_CBSE_MIDDLE;
        subjectsSecondary = SUBJECTS_CBSE_SECONDARY;
        subjectsSenior = SUBJECTS_CBSE_SENIOR;
    } else if (board === "ICSE") {
        subjectsPrimary = SUBJECTS_ICSE_PRIMARY;
        subjectsMiddle = SUBJECTS_ICSE_MIDDLE;
        subjectsSecondary = SUBJECTS_ICSE_SECONDARY;
        subjectsSenior = SUBJECTS_ICSE_SENIOR;
    } else if (board === "SSC") {
        subjectsPrimary = SUBJECTS_SSC_PRIMARY;
        subjectsMiddle = SUBJECTS_SSC_MIDDLE;
        subjectsSecondary = SUBJECTS_SSC_SECONDARY;
        subjectsSenior = SUBJECTS_SSC_SENIOR;
    }

    // Advanced Topic Resolver
    const getTopics = (sub: string, board: string, cls: string) => {
        const classNum = parseInt(cls);

        // Language Mappings
        if (sub === "Urdu") {
            if (classNum <= 5) return TOPICS_PRIMARY["Urdu"];
            if (classNum <= 8) return TOPICS_MIDDLE["Urdu"];
            return ["Adab", "Shayari", "Ghazal", "Nazm", "Afsana", "Novel"];
        }
        if (sub === "Telugu") {
            if (classNum <= 5) return TOPICS_PRIMARY["Telugu"];
            if (classNum <= 8) return TOPICS_MIDDLE["Telugu"];
            return ["Pracheena Sahityam", "Adhunika Sahityam", "Vyakaranamu", "Chandassu"];
        }
        if (sub === "First Language") {
            if (TOPICS_SECONDARY["English"]) return TOPICS_SECONDARY["English"]; // Default to English topics
            return ["Reading Comprehension", "Grammar", "Creative Writing", "Literature"];
        }
        if (sub === "Second Language") {
            if (TOPICS_PRIMARY["Hindi"]) return TOPICS_PRIMARY["Hindi"];
            return ["Vyakaran", "Sahitya", "Rachna"];
        }

        // senior subjects often have common names but different topics by class
        if (classNum === 11) {
            if (TOPICS_11[sub]) return TOPICS_11[sub];
            if (TOPICS_SENIOR_COMMERCE[sub]) return TOPICS_SENIOR_COMMERCE[sub];
            if (TOPICS_SENIOR_HUMANITIES[sub]) return TOPICS_SENIOR_HUMANITIES[sub];
        }
        if (classNum === 12) {
            if (TOPICS_12[sub]) return TOPICS_12[sub];
            if (TOPICS_SENIOR_COMMERCE[sub]) return TOPICS_SENIOR_COMMERCE[sub].map(t => t + " (Advanced)");
            if (TOPICS_SENIOR_HUMANITIES[sub]) return TOPICS_SENIOR_HUMANITIES[sub].map(t => t + " (Advanced)");
        }

        if (classNum === 9 && TOPICS_9[sub]) return TOPICS_9[sub];
        if (classNum === 10 && TOPICS_10[sub]) return TOPICS_10[sub];

        // Board Specific Overrides
        if (board === "SSC") {
            if (sub === "Mathematics (Algebra)") return ["Linear Equations", "Quadratic Equations", "Arithmetic Progression", "Probability"];
            if (sub === "Mathematics (Geometry)") return ["Similarity", "Pythagoras Theorem", "Circle", "Geometric Constructions"];
            if (sub === "Science & Technology") return ["Matter", "Energy", "Sound", "Space Exploration"];
        }

        if (board === "ICSE") {
            if (sub === "History & Civics") return ["First War of Independence", "The Vedic Period", "Local Self-Government"];
        }

        // Generic Fallbacks
        if (classNum <= 5) {
            if (TOPICS_PRIMARY[sub]) return TOPICS_PRIMARY[sub];
            // Aliases
            if (sub === "General Science") return TOPICS_PRIMARY["EVS"];
            if (sub === "Social Service" || sub === "Social Studies") return TOPICS_PRIMARY["Social Studies"];
            if (sub === "Computer Studies") return TOPICS_PRIMARY["Computer Science"];
            return ["General " + sub];
        }
        if (classNum <= 8) {
            if (board === "CBSE") {
                if (TOPICS_CBSE_MIDDLE[sub]) return TOPICS_CBSE_MIDDLE[sub];
            }
            if (board === "ICSE") {
                if (TOPICS_ICSE_MIDDLE[sub]) return TOPICS_ICSE_MIDDLE[sub];
            }
            if (board === "SSC") {
                if (TOPICS_SSC_MIDDLE[sub]) return TOPICS_SSC_MIDDLE[sub];
                // SSC Subject Map Fixes
                if (sub === "Science") return TOPICS_SSC_MIDDLE["General Science"];
            }

            if (TOPICS_MIDDLE[sub]) return TOPICS_MIDDLE[sub];
            // Aliases
            if (sub === "Social Science") return TOPICS_MIDDLE["Social Studies"];
            if (sub === "General Science") return TOPICS_MIDDLE["Science"];
            return ["Middle " + sub];
        }
        if (classNum <= 10) {
            if (TOPICS_SECONDARY[sub]) return TOPICS_SECONDARY[sub];
            // Aliases
            if (sub === "Social Science") return TOPICS_SECONDARY["Geography"]; // Or a mix
            return ["Secondary " + sub];
        }

        return ["General Topics (" + cls + ")"];
    };

    // 1-5
    CLASSES_1_5.forEach(cls => {
        boardData[cls] = {};
        subjectsPrimary.forEach(sub => {
            boardData[cls][sub] = getTopics(sub, board, cls);
        });
    });

    // 6-8
    CLASSES_6_8.forEach(cls => {
        boardData[cls] = {};
        subjectsMiddle.forEach(sub => {
            boardData[cls][sub] = getTopics(sub, board, cls);
        });
    });

    // 9-10
    CLASSES_9_10.forEach(cls => {
        boardData[cls] = {};
        subjectsSecondary.forEach(sub => {
            boardData[cls][sub] = getTopics(sub, board, cls);
        });
    });

    // 11-12
    CLASSES_11_12.forEach(cls => {
        boardData[cls] = {};
        subjectsSenior.forEach(sub => {
            boardData[cls][sub] = getTopics(sub, board, cls);
        });
    });

    CURRICULUM_DATA[board] = boardData;
};

["CBSE", "ICSE", "SSC"].forEach(populate);
