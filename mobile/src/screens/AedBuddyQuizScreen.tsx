// src/screens/AedBuddyQuizScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "As an AED Buddy, what is your primary task?",
    options: [
      "Perform chest compressions",
      "Retrieve the AED machine",
      "Provide first aid for minor injuries",
      "Direct traffic"
    ],
    correctAnswerIndex: 1, // "Retrieve the AED machine"
  },
  {
    id: 2,
    question: "How do you locate the nearest AED machines?",
    options: [
      "Ask a bystander",
      "Wait for paramedics",
      "Follow the map provided in the app",
      "Look for a red cross sign"
    ],
    correctAnswerIndex: 2, // "Follow the map provided in the app"
  },
  {
    id: 3,
    question: "What should you do once you have collected the AED?",
    options: [
      "Immediately return to the casualty and deploy it.",
      "Press the green button to indicate collection and proceed to the casualty.",
      "Wait for instructions from the emergency dispatcher.",
      "Check the AED for damages."
    ],
    correctAnswerIndex: 1, // "Press the green button to indicate collection and proceed to the casualty."
  },
  {
    id: 4,
    question: "When should AED pads be applied?",
    options: [
      "After 5 cycles of CPR",
      "Immediately after the AED arrives and the casualty is bare-chested",
      "Only if the casualty is a child",
      "When the ambulance arrives"
    ],
    correctAnswerIndex: 1, // "Immediately after the AED arrives and the casualty is bare-chested"
  },
];

const AEDBuddyQuizScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const navigation = useNavigation();

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null) {
      Alert.alert("Please select an answer", "You must choose an option before submitting.");
      return;
    }

    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (selectedAnswerIndex === currentQuestion.correctAnswerIndex) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswerIndex(null); // Reset for next question
    } else {
      setQuizCompleted(true);
      const finalScore = score + (selectedAnswerIndex === currentQuestion.correctAnswerIndex ? 1 : 0); // Add score for the last question
      const passScore = quizQuestions.length; // 4/4 implies pass for 4 questions
      if (finalScore === passScore) {
        Alert.alert("Quiz Completed!", `You scored ${finalScore}/${quizQuestions.length}. Great job! You passed!`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Quiz Completed!", `You scored ${finalScore}/${quizQuestions.length}. Keep practicing!`, [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!quizCompleted ? (
          <View style={styles.quizContainer}>
            <Text style={styles.questionNumber}>Question {currentQuestion.id} of {quizQuestions.length}</Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswerIndex === index && styles.selectedOptionButton,
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswerIndex === index && styles.selectedOptionText,
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitAnswer}
            >
              <Text style={styles.submitButtonText}>
                {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null }
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quizContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  optionButton: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF', // Blue for selected
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#FF0000', // Red submit button
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AEDBuddyQuizScreen;